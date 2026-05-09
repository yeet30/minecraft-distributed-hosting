import path from "path";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import { addJoinedServer, removeJoinedServer, getJoinedServerIds, getServerPath, removeServerPath } from "./localServerStore";
import { getOAuthClient, refreshIfNeeded, authorizedFetch, debugUser } from "./googleAuthService";
import {
	Manifest,
	loadLocalManifest,
	saveLocalManifest,
	buildInitialManifest,
	applyWatcherChanges,
	getManifestPath,
} from "./manifest";
import {runPool, rateLimited, DRIVE_CONCURRENCY, type TaskResult} from "./driveQueue";
import { getWatcherState, stopWatcher } from "./watcher";

type ProgressFn = (
	message: string,
	status?: "error" | "loading" | "done",
	importance?: "major" | "minor"
) => void;

interface DriveItemInfo {
	localPath: string;
	driveFile: any;
}


const DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3/files";
const ROOT_FOLDER_NAME = "Minecraft Shared Servers";
const MAX_SERVERS = 3;

async function findRootFolder(client: OAuth2Client) { //gets the root folder's id
	const query = `name='${ROOT_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

	const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name)`;

	const data = await authorizedFetch(client, url, { method: "GET" });

	if (data.files && data.files.length > 0)
		return data.files[0].id;

	return null;
}

async function countServerFolders(client: OAuth2Client, rootId: string) {
	const query = `'${rootId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;

	const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name)`;

	const data = await authorizedFetch(client, url, { method: "GET" });

	return data.files || [];
}

async function createFolder(client: OAuth2Client, name: string, parentId?: string): Promise<string> {
    return rateLimited(1, async () => {
        const body: any = { name, mimeType: "application/vnd.google-apps.folder" };
        if (parentId) body.parents = [parentId];
        const data = await authorizedFetch(client, DRIVE_BASE_URL, {
            method: "POST",
            body: JSON.stringify(body)
        });
        return data.id;
    });
}

export async function createServerFolder() {
	try {
		const client = getOAuthClient();

		// Step 1: Ensure root exists
		let rootId = await findRootFolder(client);

		if (!rootId) {
			rootId = await createFolder(client, ROOT_FOLDER_NAME);
		}

		// Step 2: Count existing servers
		const servers = await countServerFolders(client, rootId);

		if (servers.length >= MAX_SERVERS) {
			return {
				success: false,
				error: "Maximum 3 servers reached"
			};
		}

		const newServerName = `Server-${servers.length + 1}`;

		const id = await createFolder(client, newServerName, rootId);

		return { success: true, folderId: id };

	} catch (err: any) {
		return {
			success: false,
			error: err.message
		};
	}
}

export async function deleteServerFolder(folderId: string) {
	try {
		const client = getOAuthClient();

		const url = `https://www.googleapis.com/drive/v3/files/${folderId}`;

		await authorizedFetch(client, url, {
			method: "DELETE"
		});

		removeServerPath(folderId)

		return { success: true };

	} catch (err: any) {
		return {
			success: false,
			error: err.message
		};
	}
}

async function listServerFolders(client: OAuth2Client, folderId: string) {
	const query = `'${folderId}' in parents and trashed=false`;

	const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`;

	const data = await authorizedFetch(client, url);

	const servers = await Promise.all(
		data.files
			.filter((f: any) => f.mimeType === "application/vnd.google-apps.folder")
			.map(async (f: any) => ({
				type: 'owned',
				id: f.id,
				name: f.name,
				path: getServerPath(f.id) || "",
				permittedUsers: await getFolderPermissions(f.id)
			}))
	)

	return servers;
}

async function listFolderContents(client: OAuth2Client, folderId: string) {

	const query = `'${folderId}' in parents and trashed=false`;

	const url =
		`${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}`
		+ `&fields=files(id,name,mimeType,modifiedTime,size),nextPageToken`
		+ `&supportsAllDrives=true`
		+ `&includeItemsFromAllDrives=true`;

	const data = await authorizedFetch(client, url);

	return data.files || [];
}

export async function getRootWithContents() {
	try {
		const client = getOAuthClient();

		const rootId = await findRootFolder(client);

		if (!rootId) {
			return {
				success: true,
				rootId: null,
				rootName: ROOT_FOLDER_NAME,
				servers: []
			};
		}

		const servers = await listServerFolders(client, rootId);

		return {
			success: true,
			rootId,
			rootName: ROOT_FOLDER_NAME,
			servers: JSON.parse(JSON.stringify(servers))
		};

	} catch (err: any) {
		return {
			success: false,
			error: err.message
		};
	}
}

export async function getJoinedServers() {
	const client = getOAuthClient();
	await refreshIfNeeded(client);
	const accessToken = client.credentials.access_token;

	const ids = getJoinedServerIds()

	const servers = (await Promise.all(
		ids.map(async (folderId) => {
			const res = await fetch(
				`${DRIVE_BASE_URL}/${folderId}?fields=id,name`,
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			)

			if (!res.ok)
				return null

			const data = await res.json()
			const permissions = await getFolderPermissions(folderId);

			const user = await debugUser(client)
			const currentUserPermission = permissions.find((p: any) => p.emailAddress === user.email);

			if (currentUserPermission?.role === 'owner')
				return null;

			return {
				type: 'joined' as const,
				id: data.id,
				name: data.name,
				path: getServerPath(data.id) || '',
				permittedUsers: await getFolderPermissions(data.id)
			}
		})
	)).filter(s => s !== null)

	if (!servers.length)
		return { success: false, error: "No joined servers found." }

	return { success: true, servers: JSON.parse(JSON.stringify(servers)) };
}

function shouldDownloadFile(localPath: string, driveFile: any): boolean {
	if (!fs.existsSync(localPath)) return true;
	const localStat = fs.statSync(localPath);
	if (!driveFile.size) return true;
	if (localStat.size !== parseInt(driveFile.size)) return true;
	const driveModified = new Date(driveFile.modifiedTime).getTime();
	return driveModified > localStat.mtimeMs;
}

// cost = 1 (single GET)
async function downloadFile(client: OAuth2Client, fileId: string): Promise<Buffer> {
	return rateLimited(1, async () => {
		await refreshIfNeeded(client);
		const res = await fetch(
			`${DRIVE_BASE_URL}/${fileId}?alt=media`,
			{ headers: { Authorization: `Bearer ${client.credentials.access_token}` } }
		);
		if (!res.ok) throw new Error(await res.text());
		return Buffer.from(await res.arrayBuffer());
	});
}

// cost = 2 (list-check + upload/patch)
async function uploadFileRaw(
	client: OAuth2Client,
	localFilePath: string,
	parentId: string,
	onProgress: ProgressFn
): Promise<void> {
	return rateLimited(2, async () => {
		await refreshIfNeeded(client);
		const accessToken = client.credentials.access_token!;
		const fileName = path.basename(localFilePath);
		const fileBuffer = fs.readFileSync(localFilePath);

		const query = `'${parentId}' in parents and name='${fileName}' and trashed=false`;
		const checkUrl = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id)`;
		const checkRes = await authorizedFetch(client, checkUrl);
		const existing = checkRes.files?.[0];

		onProgress(`Uploading: ${fileName}`, "loading", "minor");

		const metadata = JSON.stringify({
			name: fileName,
			...(existing ? {} : { parents: [parentId] }),
		});
		const boundary = "boundary_string";
		const body = Buffer.concat([
			Buffer.from(`--${boundary}\r\nContent-Type: application/json\r\n\r\n${metadata}\r\n`),
			Buffer.from(`--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`),
			fileBuffer,
			Buffer.from(`\r\n--${boundary}--`),
		]);

		const uploadUrl = existing
			? `${DRIVE_BASE_URL.replace("/drive/v3/files", "/upload/drive/v3/files")}/${existing.id}?uploadType=multipart`
			: `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

		const res = await fetch(uploadUrl, {
			method: existing ? "PATCH" : "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": `multipart/related; boundary=${boundary}`,
			},
			body,
		});

		if (!res.ok) {
			onProgress(`Failed: ${fileName}`, "error", "minor");
			throw new Error(await res.text());
		}

		onProgress(`Done: ${fileName}`, "done", "minor");
	});
}

// cost = 1–2 (list + optional create)
async function ensureDriveFolder( client: OAuth2Client, folderName: string, parentId: string, cache: Map<string, string>): Promise<string> {
	const key = `${parentId}/${folderName}`;
	if (cache.has(key)) return cache.get(key)!;

	return rateLimited(1, async () => {
		const query = `'${parentId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
		const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id)`;
		const res = await authorizedFetch(client, url);
		let id: string = res.files?.[0]?.id;

		if (!id) {
			// Extra cost: folder creation counts as +1 request — already covered
			// by the outer rateLimited(1) call since creation is rare.
			id = await createFolder(client, folderName, parentId);
		}

		cache.set(key, id);
		return id;
	});
}

// ─── internal: manifest upload/download ──────────────────────────────────────

async function uploadManifest(
	client: OAuth2Client,
	serverDir: string,
	parentId: string,
	manifest: Manifest,
	onProgress: ProgressFn
): Promise<void> {
	saveLocalManifest(serverDir, manifest);
	await uploadFileRaw(client, getManifestPath(serverDir), parentId, onProgress);
}

async function fetchDriveManifest( client: OAuth2Client, parentId: string): Promise<Manifest | null> {
	const query = `'${parentId}' in parents and name='manifest.json' and trashed=false`;
	const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id)`;
	const res = await authorizedFetch(client, url);
	const file = res.files?.[0];
	if (!file) return null;

	const data = await downloadFile(client, file.id);
	try {
		return JSON.parse(data.toString("utf-8"));
	} catch {
		return null;
	}
}

async function buildDriveIdMap( client: OAuth2Client, rootId: string, manifest: Manifest): Promise<Record<string, string>> {
	// Collect unique folder paths
	const folderRelPaths = new Set<string>([""]);
	for (const rel of Object.keys(manifest.files)) {
		const parts = rel.split("/");
		parts.pop();
		if (parts.length > 0) folderRelPaths.add(parts.join("/"));
	}

	// Sort so that parent paths come before children (a < a/b)
	const sortedFolders = [...folderRelPaths].sort();

	const folderIdByRelPath: Record<string, string> = { "": rootId };
	const cache = new Map<string, string>();

	// Resolve each depth level in parallel.
	// Group folders by depth so all children of an already-resolved parent
	// can be looked up concurrently.
	const byDepth: Map<number, string[]> = new Map();
	for (const p of sortedFolders) {
		if (p === "") continue;
		const depth = p.split("/").length;
		if (!byDepth.has(depth)) byDepth.set(depth, []);
		byDepth.get(depth)!.push(p);
	}

	for (const [, foldersAtDepth] of [...byDepth.entries()].sort(([a], [b]) => a - b)) {
		const tasks = foldersAtDepth.map((folderPath) => async () => {
			const parts = folderPath.split("/");
			const folderName = parts[parts.length - 1];
			const parentPath = parts.slice(0, -1).join("/");
			const parentId = folderIdByRelPath[parentPath] ?? rootId;
			const id = await ensureDriveFolder(client, folderName, parentId, cache);
			folderIdByRelPath[folderPath] = id;
		});

		await runPool(tasks, { concurrency: DRIVE_CONCURRENCY });
	}

	// List files in all resolved folders — in parallel
	const result: Record<string, string> = {};
	const listTasks = Object.entries(folderIdByRelPath).map(
		([folderPath, folderId]) =>
			async () => {
				const query = `'${folderId}' in parents and mimeType!='application/vnd.google-apps.folder' and trashed=false`;
				const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=1000`;

				// cost = 1
				const listRes = await rateLimited(1, () => authorizedFetch(client, url));

				for (const f of listRes.files ?? []) {
					const rel = folderPath ? `${folderPath}/${f.name}` : f.name;
					result[rel] = f.id;
				}
			}
	);

	await runPool(listTasks, { concurrency: DRIVE_CONCURRENCY });

	return result;
}

export async function downloadServerFolder( serverId: string, onProgress: ProgressFn): Promise<{ success: boolean; error?: string }> {
	console.log("Downloading server:", serverId);
	onProgress("Checking drive manifest...", "loading", "major");

	const client = getOAuthClient();
	const serverPath = getServerPath(serverId);

	if (!serverPath) return { success: false, error: "No local path set." };

	try {
		if (!fs.existsSync(serverPath))
			fs.mkdirSync(serverPath, { recursive: true });

		const driveManifest = await fetchDriveManifest(client, serverId);

		if (!driveManifest) {
			// ── Fallback: no manifest on Drive, full recursive sync ──────────────
			onProgress("No manifest found. Performing full sync...", "loading", "major");

			// Collect all items first (recursive listing), then download in parallel
			const allItems = await collectDriveItems(client, serverId, serverPath);
			const toDownload = allItems.filter(({ localPath, driveFile }) =>
				shouldDownloadFile(localPath, driveFile)
			);

			onProgress(`Downloading ${toDownload.length} file(s)...`, "loading", "major");

			const tasks = toDownload.map(({ localPath, driveFile }) => async () => {
				fs.mkdirSync(path.dirname(localPath), { recursive: true });
				onProgress(`Downloading: ${path.basename(localPath)}`, "loading", "minor");
				const data = await downloadFile(client, driveFile.id);
				fs.writeFileSync(localPath, data);
				if (driveFile.modifiedTime)
					fs.utimesSync(localPath, new Date(driveFile.modifiedTime), new Date(driveFile.modifiedTime));
				onProgress(`Done: ${path.basename(localPath)}`, "done", "minor");
			});

			const results = await runPool(tasks, {
				concurrency: DRIVE_CONCURRENCY,
				onError: (err, i) => {
					onProgress(`Failed: ${toDownload[i].driveFile.name} — ${String(err)}`, "error", "minor");
				},
			});

			logPoolSummary(results, onProgress);

			const manifest = buildInitialManifest(serverPath);
			saveLocalManifest(serverPath, manifest);
			onProgress("Drive folder downloaded.", "done", "major");
			return { success: true };
		}

		// ── Normal path: manifest-guided download ─────────────────────────────
		const localManifest = loadLocalManifest(serverPath);

		const filesToDownload = Object.entries(driveManifest.files).filter(([rel, driveEntry]) => {
			const localEntry = localManifest?.files[rel];
			return !localEntry || driveEntry.version > localEntry.version;
		});

		if (filesToDownload.length === 0) {
			onProgress("Local files are already up to date.", "done", "major");
			return { success: true };
		}

		onProgress(`Downloading ${filesToDownload.length} changed file(s)...`, "loading", "major");

		const driveIdMap = await buildDriveIdMap(client, serverId, driveManifest);

		const downloadTasks = filesToDownload.map(([rel]) => async () => {
			const fileId = driveIdMap[rel];
			if (!fileId) {
				onProgress(`Not found on Drive: ${rel}`, "error", "minor");
				return;
			}
			const localFilePath = path.join(serverPath, rel);
			fs.mkdirSync(path.dirname(localFilePath), { recursive: true });
			onProgress(`Downloading: ${rel}`, "loading", "minor");
			const data = await downloadFile(client, fileId);
			fs.writeFileSync(localFilePath, data);
			onProgress(`Done: ${rel}`, "done", "minor");
		});

		const results = await runPool(downloadTasks, {
			concurrency: DRIVE_CONCURRENCY,
			onError: (err, i) => {
				onProgress(
					`Failed: ${filesToDownload[i][0]} — ${String(err)}`,
					"error",
					"minor"
				);
			},
		});

		logPoolSummary(results, onProgress);

		saveLocalManifest(serverPath, driveManifest);

		const failed = results.filter((r) => r.status === "rejected").length;
		const succeeded = results.length - failed;
		onProgress(
			`Sync complete. ${succeeded} file(s) updated${failed ? `, ${failed} failed` : ""}.`,
			failed ? "error" : "done",
			"major"
		);
		return { success: failed === 0 };

	} catch (err: any) {
		return { success: false, error: err.message };
	}
}

export async function uploadServerFolder( serverId: string, onProgress: ProgressFn): Promise<{ success: boolean; error?: string }> {
	const client = getOAuthClient();
	const serverDir = getServerPath(serverId);

	if (!serverDir) {
		onProgress("Local server folder not found.", "error", "major");
		return { success: false, error: "Local server folder not found." };
	}

	try {
		const { changed, deleted } = getWatcherState();
		stopWatcher();

		onProgress("Checking drive manifest...", "loading", "major");
		const driveManifest = await fetchDriveManifest(client, serverId);

		let localManifest = loadLocalManifest(serverDir);
		let filesToUpload: string[];

		if (!driveManifest || !localManifest) {
			onProgress("No manifest found. Uploading all files...", "loading", "major");
			localManifest = buildInitialManifest(serverDir);
			filesToUpload = Object.keys(localManifest.files);
		} else {
			const sessionVersion = localManifest.version + 1;
			localManifest = applyWatcherChanges(localManifest, changed, deleted, serverDir, sessionVersion);

			filesToUpload = Object.entries(localManifest.files)
				.filter(([rel, entry]) => {
					const driveEntry = driveManifest.files[rel];
					return !driveEntry || entry.version > driveEntry.version;
				})
				.map(([rel]) => rel);
		}

		if (filesToUpload.length === 0) {
			onProgress("No changed files to upload.", "done", "major");
			await uploadManifest(client, serverDir, serverId, localManifest, onProgress);
			return { success: true };
		}

		onProgress(`Uploading ${filesToUpload.length} changed file(s)...`, "loading", "major");

		// Pre-resolve all required Drive folders before launching the upload pool.
		// This avoids duplicate folder-creation races when many files share a parent.
		const folderCache = await preBuildFolderCache(client, serverId, filesToUpload);

		const uploadTasks = filesToUpload.map((rel) => async () => {
			const localFilePath = path.join(serverDir, rel);
			if (!fs.existsSync(localFilePath)) return; // deleted

			const parentId = await resolveParentId(client, serverId, rel, folderCache);
			await uploadFileRaw(client, localFilePath, parentId, onProgress);
		});

		const results = await runPool(uploadTasks, {
			concurrency: DRIVE_CONCURRENCY,
			onError: (err, i) => {
				onProgress(`Failed: ${filesToUpload[i]} — ${String(err)}`, "error", "minor");
			},
			});

			// Remove failed files from the manifest so they remain "pending" for the next session
			const failedRels = new Set(
			results
				.filter((r) => r.status === "rejected")
				.map((r) => filesToUpload[r.index])
			);

			if (failedRels.size > 0) {
			localManifest!.files = Object.fromEntries(
				Object.entries(localManifest!.files).filter(([rel]) => !failedRels.has(rel))
			);
		}

		logPoolSummary(results, onProgress);

		await uploadManifest(client, serverDir, serverId, localManifest!, onProgress);

		const failed = results.filter((r) => r.status === "rejected").length;
		const succeeded = results.length - failed;
		onProgress(
			`Upload complete. ${succeeded} file(s) synced${failed ? `, ${failed} failed` : ""}.`,
			failed ? "error" : "done",
			"major"
		);
		return { success: failed === 0 };

	} catch (err: any) {
		onProgress(`Upload failed: ${err.message}`, "error", "major");
		return { success: false, error: err.message };
	}
}

async function collectDriveItems(
	client: OAuth2Client,
	folderId: string,
	localBase: string,
	SKIP_FILES = new Set(["lock.json"])
): Promise<DriveItemInfo[]> {
	// Use the existing listFolderContents helper you already have
	const items = await listFolderContents(client, folderId);
	const result: DriveItemInfo[] = [];

	const subFolderTasks = items
		.filter((item: any) => item.mimeType === "application/vnd.google-apps.folder")
		.map((item: any) => async () => {
			const itemPath = path.join(localBase, item.name);
			if (!fs.existsSync(itemPath)) fs.mkdirSync(itemPath);
			const children = await collectDriveItems(client, item.id, itemPath, SKIP_FILES);
			result.push(...children);
		});

	// Recurse into subfolders in parallel
	await runPool(subFolderTasks, { concurrency: DRIVE_CONCURRENCY });

	for (const item of items) {
		if (SKIP_FILES.has(item.name)) continue;
		if (item.mimeType !== "application/vnd.google-apps.folder") {
			result.push({ localPath: path.join(localBase, item.name), driveFile: item });
		}
	}

	return result;
}

async function preBuildFolderCache(
	client: OAuth2Client,
	rootId: string,
	filesToUpload: string[]
): Promise<Map<string, string>> {
	const folderCache = new Map<string, string>();

	// Collect unique folder paths needed
	const neededFolderPaths = new Set<string>();
	for (const rel of filesToUpload) {
		const parts = rel.split("/");
		parts.pop();
		if (parts.length === 0) continue;
		// Add every ancestor path too
		for (let i = 1; i <= parts.length; i++) {
			neededFolderPaths.add(parts.slice(0, i).join("/"));
		}
	}

	if (neededFolderPaths.size === 0) return folderCache;

	// Group by depth and resolve level-by-level (parents before children)
	const byDepth = new Map<number, string[]>();
	for (const p of neededFolderPaths) {
		const depth = p.split("/").length;
		if (!byDepth.has(depth)) byDepth.set(depth, []);
		byDepth.get(depth)!.push(p);
	}

	const resolvedIds: Record<string, string> = { "": rootId };

	for (const [, foldersAtDepth] of [...byDepth.entries()].sort(([a], [b]) => a - b)) {
		const tasks = foldersAtDepth.map((folderPath) => async () => {
			const parts = folderPath.split("/");
			const folderName = parts[parts.length - 1];
			const parentPath = parts.slice(0, -1).join("/");
			const parentId = resolvedIds[parentPath] ?? rootId;
			const id = await ensureDriveFolder(client, folderName, parentId, folderCache);
			resolvedIds[folderPath] = id;
		});

		await runPool(tasks, { concurrency: DRIVE_CONCURRENCY });
	}

	return folderCache;
}

async function resolveParentId(
	client: OAuth2Client,
	rootId: string,
	rel: string,
	folderCache: Map<string, string>
): Promise<string> {
	const parts = rel.split("/");
	parts.pop(); // remove filename
	if (parts.length === 0) return rootId;

	let currentParent = rootId;
	let currentPath = "";
	for (const part of parts) {
		currentPath = currentPath ? `${currentPath}/${part}` : part;
		currentParent = await ensureDriveFolder(client, part, currentParent, folderCache);
	}
	return currentParent;
}

function logPoolSummary(results: TaskResult<any>[], onProgress: ProgressFn): void {
	const failed = results.filter((r) => r.status === "rejected");
	onProgress(`Failed to download ${failed}.`, "error", "minor")
	if (failed.length > 0) {
		console.warn(`Pool completed with ${failed.length} failure(s):`, failed.map((r) => r.reason));
	}
}


export async function getFolderPermissions(folderId: string) {

	const client = getOAuthClient();
	await refreshIfNeeded(client);
	const accessToken = client.credentials.access_token;

	const res = await fetch(
		`https://www.googleapis.com/drive/v3/files/${folderId}/permissions?fields=permissions(id,emailAddress,role,type,displayName,photoLink)`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	);

	if (!res.ok)
		return []

	const data = await res.json();

	return data.permissions || [];
}

export async function inviteUserToServer(serverId: string, email: string, message?: string) {
	const client = getOAuthClient();
	await refreshIfNeeded(client);

	const accessToken = client.credentials.access_token;

	let defaultMessage = `You have been invited to a shared Minecraft server folder. To join, copy the link below and paste it in the app.

  ➜ ${serverId}`

	if (message)
		defaultMessage = message + '\n\n' + defaultMessage

	const params = new URLSearchParams({ sendNotificationEmail: "true", emailMessage: defaultMessage });

	const res = await fetch(
		`https://www.googleapis.com/drive/v3/files/${serverId}/permissions?${params}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				type: "user",
				role: "writer",
				emailAddress: email
			})
		}
	);

	if (!res.ok)
		throw new Error(await res.text());

	return { success: true };
}

export async function removeUserPermission(serverId: string, permissionId: string, isOwner: boolean) {
	const client = getOAuthClient();
	await refreshIfNeeded(client);

	const accessToken = client.credentials.access_token;

	const res = await fetch(
		`https://www.googleapis.com/drive/v3/files/${serverId}/permissions/${permissionId}`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	);

	if (!isOwner) {
		removeJoinedServer(serverId)
		removeServerPath(serverId)
	}

	if (!res.ok)
		throw new Error(await res.text());

	return { success: true };
}

export async function joinServerById(folderId: string) {
	const client = getOAuthClient();

	try {
		await refreshIfNeeded(client)
		const accessToken = client.credentials.access_token

		const res = await fetch(
			`https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name`,
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		)

		if (!res.ok) {
			if (res.status === 404)
				throw new Error("File not found. Either the folder ID is wrong or you haven't been invited to this server.")
			throw new Error(await res.text())
		}

		const data = await res.json()

		addJoinedServer(data.id)

		return {
			success: true,
			folder: {
				type: 'joined' as const,
				id: data.id,
				name: data.name,
				path: getServerPath(data.id) || null,
				permittedUsers: await getFolderPermissions(data.id)
			}
		}
	} catch (err: any) {
		return { success: false, error: err.message || err }
	}
}

export async function renameServerFolder(folderId: string, newName: string) {
	const client = getOAuthClient();
	await refreshIfNeeded(client);
	const accessToken = client.credentials.access_token;

	const res = await fetch(`${DRIVE_BASE_URL}/${folderId}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ name: newName })
	});

	if (!res.ok)
		throw new Error(await res.text());

	return { success: true };
}
