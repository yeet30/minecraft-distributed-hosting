import fs from "fs";
import path from "path";

export interface FileEntry {
	version: number;
	size: number;
}

export interface Manifest {
	version: number;
	updatedAt: string;
	files: Record<string, FileEntry>;
}

const MANIFEST_NAME = "manifest.json";

export function getManifestPath(serverDir: string): string {
	return path.join(serverDir, MANIFEST_NAME);
}

export function loadLocalManifest(serverDir: string): Manifest | null {
	const p = getManifestPath(serverDir);
	if (!fs.existsSync(p)) return null;
	try {
		return JSON.parse(fs.readFileSync(p, "utf-8"));
	} catch {
		return null;
	}
}

export function saveLocalManifest(serverDir: string, manifest: Manifest): void {
	fs.writeFileSync(getManifestPath(serverDir), JSON.stringify(manifest, null, 2));
}

export function buildInitialManifest(serverDir: string): Manifest {
	const files: Record<string, FileEntry> = {};

	const SKIP = new Set(["manifest.json", "lock.json"]);

	function scan(dir: string) {
		for (const item of fs.readdirSync(dir)) {
			if (SKIP.has(item)) continue;
			const full = path.join(dir, item);
			const stat = fs.statSync(full);
			if (stat.isDirectory()) {
				scan(full);
			} else {
				const rel = path.relative(serverDir, full).replace(/\\/g, "/");
				files[rel] = { version: 1, size: stat.size };
			}
		}
	}

	scan(serverDir);

	return { version: 1, updatedAt: new Date().toISOString(), files };
}

export function applyWatcherChanges(
	manifest: Manifest,
	changed: Set<string>,
	deleted: Set<string>,
	serverDir: string,
	sessionVersion: number
): Manifest {
	const updated: Manifest = {
		...manifest,
		files: { ...manifest.files },
		version: sessionVersion,
		updatedAt: new Date().toISOString(),
	};

	for (const rel of changed) {
		const full = path.join(serverDir, rel);
		if (fs.existsSync(full)) {
			updated.files[rel] = { version: sessionVersion, size: fs.statSync(full).size };
		}
	}

	for (const rel of deleted) {
		delete updated.files[rel];
	}

	return updated;
}