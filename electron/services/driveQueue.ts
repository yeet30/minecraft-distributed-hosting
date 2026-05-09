/**
 * driveQueue.ts
 *
 * Rate-aware concurrent task pool for Google Drive API operations.
 *
 * Google Drive API v3 documented limits (per user):
 *   - 12,000 requests / 60 seconds  → 200 req/s sustained
 *   - 12,000 queries / 60 seconds   → same bucket in practice
 *
 * We target a conservative 80 % of the per-60s budget to leave headroom
 * for background calls (lock heartbeat, manifest fetch, etc.).
 *
 * Cost model (how many API calls each operation burns):
 *   - downloadFile          → 1  (GET /files/:id?alt=media)
 *   - uploadFileRaw (new)   → 2  (list check + POST upload)
 *   - uploadFileRaw (patch) → 2  (list check + PATCH upload)
 *   - ensureDriveFolder     → 1–2 (list + optional create)
 *   - listFolderContents    → 1
 */

// ─── Token-bucket rate limiter ────────────────────────────────────────────────

export interface RateLimiterOptions {
	/** Maximum tokens in the bucket (burst ceiling). */
	capacity: number;
	/** Tokens added per millisecond (refill rate). */
	refillRatePerMs: number;
}

export class TokenBucketLimiter {
	private tokens: number;
	private lastRefill: number;

	constructor(private opts: RateLimiterOptions) {
		this.tokens = opts.capacity;
		this.lastRefill = Date.now();
	}

	/** Refill tokens based on elapsed time. */
	private refill(): void {
		const now = Date.now();
		const elapsed = now - this.lastRefill;
		this.tokens = Math.min(
			this.opts.capacity,
			this.tokens + elapsed * this.opts.refillRatePerMs
		);
		this.lastRefill = now;
	}

	/**
	 * Acquire cost tokens, waiting if the bucket is not full enough.
	 * Resolves as soon as the tokens are available.
	 */
	async acquire(cost = 1): Promise<void> {
		while (true) {
			this.refill();
			if (this.tokens >= cost) {
				this.tokens -= cost;
				return;
			}
			// How long until we have enough tokens?
			const waitMs = Math.ceil((cost - this.tokens) / this.opts.refillRatePerMs);
			await sleep(waitMs);
		}
	}
}

// ─── Shared limiter instance ──────────────────────────────────────────────────

/**
 * 12,000 req / 60,000 ms = 0.2 req/ms.
 * We target 80 % → 0.16 req/ms.
 * Burst cap = 60 (comfortable spike without hammering).
 */
export const driveLimiter = new TokenBucketLimiter({
	capacity: 60,
	refillRatePerMs: 0.16,
});

// ─── Concurrent task pool ─────────────────────────────────────────────────────

export interface PoolOptions {
	/** Maximum number of tasks running simultaneously. */
	concurrency: number;
	/** Called when a task throws; return true to abort the whole pool. */
	onError?: (err: unknown, index: number) => boolean | void;
}

export interface TaskResult<T> {
	index: number;
	status: "fulfilled" | "rejected";
	value?: T;
	reason?: unknown;
}

/**
 * Runs tasks with bounded concurrency, returning all results in
 * input order once every task has settled (fulfilled or rejected).
 *
 * Unlike Promise.all, this never rejects – every outcome is captured
 * so the caller can decide what to do with partial failures.
 */
export async function runPool<T>(
	tasks: Array<() => Promise<T>>,
	opts: PoolOptions
): Promise<TaskResult<T>[]> {
	const results: TaskResult<T>[] = new Array(tasks.length);
	let nextIndex = 0;
	let aborted = false;

	async function worker(): Promise<void> {
		while (true) {
			if (aborted) return;
			const index = nextIndex++;
			if (index >= tasks.length) return;

			try {
				const value = await tasks[index]();
				results[index] = { index, status: "fulfilled", value };
			} catch (err) {
				results[index] = { index, status: "rejected", reason: err };
				if (opts.onError?.(err, index)) {
					aborted = true;
					return;
				}
			}
		}
	}

	// Spawn exactly `concurrency` workers; they self-feed from the task list.
	await Promise.all(
		Array.from({ length: Math.min(opts.concurrency, tasks.length) }, worker)
	);

	return results;
}

// ─── Drive-specific helpers ───────────────────────────────────────────────────

/**
 * How many simultaneous Drive requests to keep in-flight.
 *
 * Rule of thumb: with a 200 ms average round-trip, 16 concurrent requests
 * saturate ≈ 80 req/s — well inside the 160 req/s budget and fast enough
 * to keep the pipe full. Needs to be tuned downward if 429 responses are seen.
 */
export const DRIVE_CONCURRENCY = 16;

/**
 * Wraps a Drive API call with rate-limiter acquisition.
 *
 * @param cost   API-call cost of this operation (see top-of-file table).
 * @param fn     The async operation to perform.
 */
export async function rateLimited<T>(cost: number, fn: () => Promise<T>): Promise<T> {
	await driveLimiter.acquire(cost);
	return fn();
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
