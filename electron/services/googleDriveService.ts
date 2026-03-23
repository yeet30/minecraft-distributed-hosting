import { app } from "electron";
import path from "path";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import { addJoinedServer, getJoinedServerIds, getServerPath } from "./localServerStore";

const DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3/files";
const ROOT_FOLDER_NAME = "Minecraft Shared Servers";
const MAX_SERVERS = 3;

function getTokenPath() {
	return path.join(app.getPath("userData"), "token.json");
}

function getCredentialsPath() {
	return path.join(process.cwd(), "config", "client_secret.json");
}

export function getOAuthClient(): OAuth2Client {
	const tokens = JSON.parse(
		fs.readFileSync(getTokenPath(), "utf-8")
	);

	const credentials = JSON.parse(
		fs.readFileSync(getCredentialsPath(), "utf-8")
	);

	const { client_id, client_secret } = credentials.installed;

	const client = new OAuth2Client(client_id, client_secret);

	client.setCredentials(tokens);

	return client;
}

export async function refreshIfNeeded(client: OAuth2Client) {
	const tokens = client.credentials;

	if (!tokens.expiry_date || tokens.expiry_date <= Date.now()) {
		const { credentials } = await client.refreshAccessToken();
		client.setCredentials(credentials);

		fs.writeFileSync(
			getTokenPath(),
			JSON.stringify(credentials, null, 2)
		);
	}
}

async function authorizedFetch(
	client: OAuth2Client,
	url: string,
	options: RequestInit
) {
	await refreshIfNeeded(client);

	const accessToken = client.credentials.access_token;

	const res = await fetch(url, {
		...options,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			...(options.headers || {})
		}
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText);
	}

	if (res.status === 204) {
		return null;
	}

	const text = await res.text();

	if (!text) {
		return null;
	}

	return JSON.parse(text);
}

async function debugUser(client: OAuth2Client) {
	const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
		headers: {
			Authorization: `Bearer ${client.credentials.access_token}`
		}
	});

	return await res.json()
}

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

	const body: any = {
		name,
		mimeType: "application/vnd.google-apps.folder"
	};

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

		await createFolder(client, newServerName, rootId);

		return { success: true };

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

		return { success: true };

	} catch (err: any) {
		return {
			success: false,
			error: err.message
		};
	}
}

async function listFolderContents(client: OAuth2Client, folderId: string) {
	const query = `'${folderId}' in parents and trashed=false`;

	const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`;

	const data = await authorizedFetch(client, url, {
		method: "GET"
	});

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

async function listAllInFolder(client: OAuth2Client, folderId: string) {

	const query = `'${folderId}' in parents and trashed=false`;

	const url =
		`${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}`
		+ `&fields=files(id,name,mimeType,modifiedTime,size),nextPageToken`
		+ `&supportsAllDrives=true`
		+ `&includeItemsFromAllDrives=true`;

	const data = await authorizedFetch(client, url, {
		method: "GET"
	});

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

		const servers = await listFolderContents(client, rootId);

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

async function downloadFile(client: OAuth2Client, fileId: string) {

	await refreshIfNeeded(client);

	const accessToken = client.credentials.access_token;

	const res = await fetch(
		`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	)

	if (!res.ok)
		throw new Error(await res.text())

	return Buffer.from(await res.arrayBuffer())
}

async function downloadFolderRecursive(client: OAuth2Client, folderId: string, localPath: string) {
	const items = await listAllInFolder(client, folderId);

	console.log("Items found:", items.length);

	for (const item of items) {
		const itemPath = path.join(localPath, item.name);

		if (item.mimeType === "application/vnd.google-apps.folder") {
			if (!fs.existsSync(itemPath))
				fs.mkdirSync(itemPath);

			await downloadFolderRecursive(client, item.id, itemPath);
		} else {
			if (shouldDownloadFile(itemPath, item)) {
				console.log("Downloading changed file:", item.name);
				const data = await downloadFile(client, item.id);
				fs.writeFileSync(itemPath, data);
			} else {
				console.log("Skipping unchanged file:", item.name);
			}
		}
	}
}

export async function syncServer(serverId: string) {

	console.log("Syncing folder:", serverId);

	const client = getOAuthClient();
	const targetPath = getServerPath(serverId);

	if (!targetPath)
		return { success: false, error: "No local path set." };

	try {
		if (!fs.existsSync(targetPath))
			fs.mkdirSync(targetPath, { recursive: true });

		await downloadFolderRecursive(client, serverId, targetPath);

		return { success: true };

	} catch (err: any) {
		return { success: false, error: err.message };
	}
}

async function uploadFile(client: OAuth2Client, localFilePath: string, parentId: string) {
	await refreshIfNeeded(client);

	const accessToken = client.credentials.access_token;
	const fileName = path.basename(localFilePath);
	const fileBuffer = fs.readFileSync(localFilePath);

	// Fetch existing file with modifiedTime and size for comparison
	const query = `'${parentId}' in parents and name='${fileName}' and trashed=false`;
	const checkUrl = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id,modifiedTime,size)`;
	const checkRes = await authorizedFetch(client, checkUrl, { method: "GET" });
	const existing = checkRes.files?.[0];

	// Skip if file hasn't changed
	if (!shouldUploadFile(localFilePath, existing)) {
		console.log("Skipping unchanged file:", fileName);
		return;
	}

	console.log("Uploading changed file:", fileName);

	const metadata = JSON.stringify({ name: fileName, parents: existing ? undefined : [parentId] });
	const boundary = "boundary_string";

	const body = Buffer.concat([
		Buffer.from(`--${boundary}\r\nContent-Type: application/json\r\n\r\n${metadata}\r\n`),
		Buffer.from(`--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`),
		fileBuffer,
		Buffer.from(`\r\n--${boundary}--`)
	]);

	const uploadUrl = existing
		? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`
		: `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

	const res = await fetch(uploadUrl, {
		method: existing ? "PATCH" : "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": `multipart/related; boundary=${boundary}`
		},
		body
	});

	if (!res.ok)
		throw new Error(await res.text());

	return await res.json();
}

async function uploadFolderRecursive(client: OAuth2Client, localPath: string, parentId: string) {
	const items = fs.readdirSync(localPath);

	for (const item of items) {
		const itemPath = path.join(localPath, item);
		const stat = fs.statSync(itemPath);

		if (stat.isDirectory()) {
			// Check if folder already exists on Drive
			const query = `'${parentId}' in parents and name='${item}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
			const checkUrl = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id)`;
			const checkRes = await authorizedFetch(client, checkUrl, { method: "GET" });

			let folderId = checkRes.files?.[0]?.id;

			if (!folderId)
				folderId = await createFolder(client, item, parentId);

			await uploadFolderRecursive(client, itemPath, folderId);
		} else {
			await uploadFile(client, itemPath, parentId);
		}
	}
}

export async function uploadServerFolder(serverId: string) {

	const client = getOAuthClient();
	const fromPath = getServerPath(serverId)

	console.log("Uploading server folder:", fromPath);

	if (!fromPath)
		return { success: false, error: "Local server folder not found." };

	try {
		await uploadFolderRecursive(client, fromPath, serverId);
		return { success: true };
	} catch (err: any) {
		return { success: false, error: err.message };
	}
}

function shouldDownloadFile(localPath: string, driveFile: any): boolean {
	//If file doesn't exist locally then always download
	if (!fs.existsSync(localPath))
		return true;

	const localStat = fs.statSync(localPath);

	//If size differs then download
	if (localStat.size !== parseInt(driveFile.size))
		return true;

	//If drive version is newer than local then download
	const driveModified = new Date(driveFile.modifiedTime).getTime();
	if (driveModified > localStat.mtimeMs)
		return true;

	return false;
}

function shouldUploadFile(localFilePath: string, driveFile: any): boolean {
	//If file doesn't exist on drive then always upload
	if (!driveFile)
		return true;

	const localStat = fs.statSync(localFilePath);

	//If size differs then upload
	if (localStat.size !== parseInt(driveFile.size))
		return true;

	//If local version is newer than drive then upload
	const driveModified = new Date(driveFile.modifiedTime).getTime();
	if (localStat.mtimeMs > driveModified)
		return true;

	return false;
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

export async function removeUserPermission(serverId: string, permissionId: string) {
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

		if (!res.ok)
			throw new Error(await res.text())

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
		return { success: false, error: err.message }
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