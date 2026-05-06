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
import { getWatcherState, stopWatcher } from "./watcher";


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

async function createFolder(client: OAuth2Client, name: string, parentId?: string) {

	const body: any = { name, mimeType: "application/vnd.google-apps.folder" };

	if (parentId)
		body.parents = [parentId];

	const data = await authorizedFetch(client, DRIVE_BASE_URL, {
		method: "POST",
		body: JSON.stringify(body)
	});

	return data.id;
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
	if (!fs.existsSync(localPath)) {
		console.log(`DOWNLOAD: ${localPath} - file doesn't exist locally`);
		return true;
	}

	const localStat = fs.statSync(localPath);

	if (!driveFile.size) {
		console.log(`DOWNLOAD: ${path.basename(localPath)} - no size info from Drive`);
		return true;
	}

	if (localStat.size !== parseInt(driveFile.size)) {
		console.log(`DOWNLOAD: ${path.basename(localPath)} - size differs: local=${localStat.size} drive=${driveFile.size}`);
		return true;
	}

	const driveModified = new Date(driveFile.modifiedTime).getTime();
	if (driveModified > localStat.mtimeMs) {
		console.log(`DOWNLOAD: ${path.basename(localPath)} - drive newer: drive=${new Date(driveFile.modifiedTime).toISOString()} local=${new Date(localStat.mtimeMs).toISOString()}`);
		return true;
	}

	console.log(`SKIP: ${path.basename(localPath)}`);
	return false;
}

async function downloadFile(client: OAuth2Client, fileId: string) {

	await refreshIfNeeded(client);
	const accessToken = client.credentials.access_token;

	const res = await fetch(
		`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
		{ headers: { Authorization: `Bearer ${accessToken}` } }
	)

	if (!res.ok)
		throw new Error(await res.text())

	return Buffer.from(await res.arrayBuffer())
}

async function downloadFolderRecursive(
	client: OAuth2Client,
	folderId: string,
	localPath: string,
	onProgress: (message: string, status?: "error" | "loading" | "done", importance?: "major" | "minor") => void
) {
	const items = await listFolderContents(client, folderId);

	const SKIP_FILES = ["lock.json"];

	for (const item of items) {
		if (SKIP_FILES.includes(item.name)) continue;

		const itemPath = path.join(localPath, item.name);

		if (item.mimeType === "application/vnd.google-apps.folder") {
			if (!fs.existsSync(itemPath))
				fs.mkdirSync(itemPath);

			await downloadFolderRecursive(client, item.id, itemPath, onProgress);
		} else {
			if (shouldDownloadFile(itemPath, item)) {
				console.log("Downloading changed file:", item.name);
				onProgress(`Downloading changed file: ${item.name}`, "loading")
				const data = await downloadFile(client, item.id);
				onProgress(`Downloaded ${item.name}`, "done")
				fs.writeFileSync(itemPath, data);
				if (item.modifiedTime)
					fs.utimesSync(itemPath, new Date(item.modifiedTime), new Date(item.modifiedTime));
			} else {
				onProgress(`Skipping unchanged file: ${item.name}`, "done")
				console.log("Skipping unchanged file:", item.name);
			}
		}
	}
}

async function uploadFileRaw(
	client: OAuth2Client,
	localFilePath: string,
	parentId: string,
	onProgress: (message: string, status?: "error" | "loading" | "done", importance?: "major" | "minor") => void
): Promise<void> {
	await refreshIfNeeded(client);
	const accessToken = client.credentials.access_token;
	const fileName = path.basename(localFilePath);
	const fileBuffer = fs.readFileSync(localFilePath);

	// Only need the file id, not size/modifiedTime — manifest handles change detection
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
		? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`
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
}

// ─── internal: get-or-create a Drive folder, with local cache ────────────────

async function ensureDriveFolder(
	client: OAuth2Client,
	folderName: string,
	parentId: string,
	cache: Map<string, string>
): Promise<string> {
	const key = `${parentId}/${folderName}`;
	if (cache.has(key)) return cache.get(key)!;

	const query = `'${parentId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
	const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id)`;
	const res = await authorizedFetch(client, url);
	let id: string = res.files?.[0]?.id;

	if (!id) id = await createFolder(client, folderName, parentId);

	cache.set(key, id);
	return id;
}

// ─── internal: manifest upload/download ──────────────────────────────────────

async function uploadManifest(client: OAuth2Client, serverDir: string, parentId: string, manifest: Manifest,
	onProgress: (message: string, status?: "error" | "loading" | "done", importance?: "major" | "minor") => void
): Promise<void> {
	saveLocalManifest(serverDir, manifest);
	await uploadFileRaw(client, getManifestPath(serverDir), parentId, onProgress);
}

async function fetchDriveManifest(client: OAuth2Client, parentId: string): Promise<Manifest | null> {
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

async function buildDriveIdMap(client: OAuth2Client, rootId: string, manifest: Manifest): Promise<Record<string, string>> {
	// Collect unique folder paths (empty string = root)
	const folderRelPaths = new Set<string>([""]);
	for (const rel of Object.keys(manifest.files)) {
		const parts = rel.split("/");
		parts.pop();
		if (parts.length > 0) folderRelPaths.add(parts.join("/"));
	}

	// Resolve each folder path to a Drive folder ID
	const folderIdByRelPath: Record<string, string> = { "": rootId };
	const cache = new Map<string, string>();

	// Sort so parent paths are resolved before children
	for (const folderPath of [...folderRelPaths].sort()) {
		if (folderPath === "") continue;
		const parts = folderPath.split("/");
		let currentId = rootId;
		let currentPath = "";
		for (const part of parts) {
			const nextPath = currentPath ? `${currentPath}/${part}` : part;
			if (folderIdByRelPath[nextPath]) {
				currentId = folderIdByRelPath[nextPath];
			} else {
				currentId = await ensureDriveFolder(client, part, currentId, cache);
				folderIdByRelPath[nextPath] = currentId;
			}
			currentPath = nextPath;
		}
	}

	// List files in each resolved folder
	const result: Record<string, string> = {};
	for (const [folderPath, folderId] of Object.entries(folderIdByRelPath)) {
		const query = `'${folderId}' in parents and mimeType!='application/vnd.google-apps.folder' and trashed=false`;
		const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=1000`;
		const listRes = await authorizedFetch(client, url);
		for (const f of listRes.files ?? []) {
			const rel = folderPath ? `${folderPath}/${f.name}` : f.name;
			result[rel] = f.id;
		}
	}

	return result;
}

export async function downloadServerFolder(
	serverId: string,
	onProgress: (message: string, status?: "error" | "loading" | "done", importance?: "major" | "minor") => void
) {
	console.log("Downloading server:", serverId);
	onProgress("Checking drive manifest...", "loading", "major");

	const client = getOAuthClient();
	const serverPath = getServerPath(serverId);

	if (!serverPath)
		return { success: false, error: "No local path set." };

	try {
		if (!fs.existsSync(serverPath))
			fs.mkdirSync(serverPath, { recursive: true });

		const driveManifest = await fetchDriveManifest(client, serverId);

		if (!driveManifest) {
			onProgress("No manifest found. Performing full sync...", "loading", "major");
			await downloadFolderRecursive(client, serverId, serverPath, onProgress);
			// Build and persist a local manifest from what we just downloaded
			const manifest = buildInitialManifest(serverPath);
			saveLocalManifest(serverPath, manifest);
			onProgress("Drive folder downloaded.", "done", "major");
			return { success: true };
		}

		const localManifest = loadLocalManifest(serverPath);

		// Determine what needs downloading
		const filesToDownload = Object.entries(driveManifest.files).filter(([rel, driveEntry]) => {
			const localEntry = localManifest?.files[rel];
			return !localEntry || driveEntry.version > localEntry.version;
		});

		if (filesToDownload.length === 0) {
			onProgress("Local files are already up to date.", "done", "major");
			return { success: true };
		}

		onProgress(`Downloading ${filesToDownload.length} changed file(s)...`, "loading", "major");

		// Build path→id map with batched folder listings
		const driveIdMap = await buildDriveIdMap(client, serverId, driveManifest);

		for (const [rel] of filesToDownload) {
			const fileId = driveIdMap[rel];
			if (!fileId) {
				onProgress(`Not found on Drive: ${rel}`, "error", "minor");
				continue;
			}
			const localFilePath = path.join(serverPath, rel);
			fs.mkdirSync(path.dirname(localFilePath), { recursive: true });
			onProgress(`Downloading: ${rel}`, "loading", "minor");
			const data = await downloadFile(client, fileId);
			fs.writeFileSync(localFilePath, data);
			onProgress(`Done: ${rel}`, "done", "minor");
		}

		// Drive manifest becomes the new local manifest
		saveLocalManifest(serverPath, driveManifest);

		onProgress(`Sync complete. ${filesToDownload.length} file(s) updated.`, "done", "major");
		return { success: true };

	} catch (err: any) {
		return { success: false, error: err.message };
	}
}

export async function uploadServerFolder(
	serverId: string,
	onProgress: (message: string, status?: "error" | "loading" | "done", importance?: "major" | "minor") => void
) {
	const client = getOAuthClient();
	const serverDir = getServerPath(serverId);

	if (!serverDir) {
		onProgress("Local server folder not found.", "error", "major");
		return { success: false, error: "Local server folder not found." };
	}

	try {
		// Harvest watcher state and stop watching
		const { changed, deleted } = getWatcherState();
		stopWatcher();

		// Fetch drive manifest first so we know if this is a first-time upload
		onProgress("Checking drive manifest...", "loading", "major");
		const driveManifest = await fetchDriveManifest(client, serverId);

		let localManifest = loadLocalManifest(serverDir);
		let filesToUpload: string[];

		if (!driveManifest || !localManifest) {
			// First time — upload everything and build manifest from scratch
			onProgress("No manifest found. Uploading all files...", "loading", "major");
			localManifest = buildInitialManifest(serverDir);
			filesToUpload = Object.keys(localManifest.files);
		} else {
			// Normal session end — bump version and apply watcher changes
			const sessionVersion = localManifest.version + 1;
			localManifest = applyWatcherChanges(localManifest, changed, deleted, serverDir, sessionVersion);

			// Upload only files that are newer than what's on the drive
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

		const folderCache = new Map<string, string>();

		for (const rel of filesToUpload) {
			const localFilePath = path.join(serverDir, rel);
			if (!fs.existsSync(localFilePath)) continue; // was deleted

			// Ensure parent folder(s) exist on Drive
			const parts = rel.split("/");
			parts.pop(); // remove filename
			let currentParent = serverId;
			let currentPath = "";
			for (const part of parts) {
				currentPath = currentPath ? `${currentPath}/${part}` : part;
				currentParent = await ensureDriveFolder(client, part, currentParent, folderCache);
			}

			await uploadFileRaw(client, localFilePath, currentParent, onProgress);
		}

		// Save updated manifest both locally and to Drive
		await uploadManifest(client, serverDir, serverId, localManifest, onProgress);

		onProgress(`Upload complete. ${filesToUpload.length} file(s) synced.`, "done", "major");
		return { success: true };

	} catch (err: any) {
		onProgress(`Upload failed: ${err.message}`, "error", "major");
		return { success: false, error: err.message };
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
