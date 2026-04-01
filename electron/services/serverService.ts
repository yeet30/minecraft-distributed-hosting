import { OAuth2Client } from "google-auth-library";
import { getUserInfo } from "./googleAuthService";
import { IStartupOptions, ILockStatus } from "../../src/lib/types";
import { launchPlayitgg, waitForPlayitLink, killPlayitgg } from "./childrenProcesses";
import { syncServer, refreshIfNeeded, getOAuthClient, authorizedFetch, uploadServerFolder } from './googleDriveService'
import fs from "fs";
import path from "path";

const DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3/files";

let publicIp = ""

export async function startServer(
	options: IStartupOptions, 
	onProgress: (message: string, status?: "error" | "loading" | "done", importance?: "major" | "minor") => void
) {
    const { folderId, playitggPath} = options;

    // 1. Check if already hosted
	onProgress("Checking if server is already hosted...", "loading", "major");
    let lockRes = await getServerLock(folderId)
    if (lockRes.lockData.status === "online"){
		onProgress("The server is already being hosted.", "error", "major");
		return { success: false, error: "This server is already being hosted.", lock: lockRes.lockData};
	}
	onProgress("The server is not being hosted", "done", "major");

    // 2. Reserve the lock immediately so no one else can start
	onProgress("Reserving server slot...", "loading", "major");
	await updateLockFile(folderId, "starting")
	onProgress("Reserved...", "done", "major");

    // 3. Start playit.gg and file sync IN PARALLEL
    const playitggProcess = (options.checklist.playitgg && playitggPath) ? launchPlayitgg(playitggPath) : null;
	playitggProcess && onProgress("Booting up the playit.gg client...", "loading", "major");
    if (playitggPath && !playitggProcess) {
        await updateLockFile(folderId, "offline"); // release the lock
		onProgress("Could not start playit.gg ", "error", "major");
        return { success: false, error: "playit.gg failed to start." };
    }
	playitggProcess && onProgress("Playit.gg client launched.", "done", "major");

	let syncRes, ip;

    // Run file sync and wait for playit link at the same time depending on the options

	if(options.checklist.download && options.checklist.playitgg){
		onProgress("Waiting for the ip from the playit.gg client.", "loading", "minor");
		[syncRes, ip] = await Promise.all([
			syncServer(folderId, onProgress),
			playitggProcess ? waitForPlayitLink(playitggProcess) : Promise.resolve(null)
		]);
		onProgress("Finished downloading server files.", "done", "major")
		onProgress("Received the ip from playitgg client.", "done", "minor")
	}
	else if (options.checklist.download){
		[syncRes] = await Promise.all([
			syncServer(folderId, onProgress)
		])
		onProgress("Finished downloading server files.", "done", "major")
	}
    else if (options.checklist.playitgg){
		onProgress("Waiting for the ip from the playit.gg client.", "loading", "minor");
		[ip] = await Promise.all([
			playitggProcess ? waitForPlayitLink(playitggProcess) : Promise.resolve(null)
		]);
		onProgress("Received the ip from playitgg client.", "done", "minor")
	}

	publicIp = ip ?? "";

    if (syncRes && !syncRes.success) {
		onProgress("Could not download the server files.", "error", "major")
		onProgress("Deleting the lock.", "loading", "minor")
        await updateLockFile(folderId, "offline");
        killPlayitgg();
        return { success: false, error: syncRes.error };
    }

    // 4. Update lock with public IP and running status
	onProgress("Uploading the lock to the drive.", "loading", "major")
    await updateLockFile(folderId, "online");
	lockRes = await getServerLock(folderId)
	onProgress("Process successfully finished.", "done", "major")

    return { 
		success: true, 
		playitggProcess: playitggProcess, 
		lockData: lockRes.lockData 
	};
}

async function uploadLockFile(
	client: OAuth2Client, 
	content: object, 
	folderId: string, 
	existingLockId?: string 
){
	await refreshIfNeeded(client)
	const accessToken = client.credentials.access_token	
	
	const boundary = "boundary_string"
	const metadata = JSON.stringify({
		name: "lock.json",
		...(!existingLockId && { parents: [folderId]}) //If there is no existing file, POSTs it inside of parent folder
	})
	const body_content = JSON.stringify(content)

	const body = Buffer.concat([
		Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`),
		Buffer.from(metadata),
		Buffer.from(`\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n`),
		Buffer.from(body_content),
		Buffer.from(`\r\n--${boundary}--\r\n`)
	]);

	const url = existingLockId
		? `https://www.googleapis.com/upload/drive/v3/files/${existingLockId}?uploadType=multipart`
        : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`; //If lock exists, PATCH it

	
	const res = await fetch(url, {
        method: existingLockId ? "PATCH" : "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": `multipart/related; boundary=${boundary}`
        },
        body
    });

	if(!res.ok) {
		const text = await res.text()
		console.error(text)
		throw new Error(text)
	}

	return await res.json()
}

export async function updateLockFile(folderId: string, status: "starting" | "online" | "stopping" | "offline", players?: string[] ){
	const client = getOAuthClient();

	const query = `'${folderId}' in parents and name='lock.json' and trashed=false`;
    const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id)`;
    const data = await authorizedFetch(client, url);
	
	const existingLockId = data.files?.[0]?.id

	const user = await getUserInfo();

	let content = {
		hostName: user.name,
		hostEmail: user.email,
		startedAt: new Date(Date.now()).toISOString(),
		expiresAt: new Date(Date.now() + 30000).toISOString(),
		publicIp: publicIp ?? "",
		status: status,
        onlinePlayers: players
	}

	if(status==="starting")
		content = {
			...content,
			expiresAt: new Date(Date.now() + 60000).toISOString(), // 60s grace period for startup
		};

	await uploadLockFile(client, content, folderId, existingLockId)
}

export async function getServerLock(folderId: string): Promise<{ lockData: ILockStatus; lockFileId: string }>{
	const client = getOAuthClient();

	const query = `'${folderId}' in parents and name='lock.json' and trashed=false`;
    const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id)`;
    const data = await authorizedFetch(client, url);

    if (!data.files || data.files.length === 0) {
		await updateLockFile(folderId, "offline");
		const newData = await authorizedFetch(client, url);
		const lockFileId = newData.files[0].id;
		const lockData = await authorizedFetch(
			client,
			`${DRIVE_BASE_URL}/${lockFileId}?alt=media`,
			{ method: "GET" },
			{}
		);
		return JSON.parse(JSON.stringify({ lockData, lockFileId }));
	}

	const lockFileId = data.files[0].id
	let lockData = await authorizedFetch(
		client,
		`${DRIVE_BASE_URL}/${lockFileId}?alt=media`,
		{ method: "GET" },
		{} // no Content-Type
	);

	const now = new Date();
	const expiresAt = new Date(lockData.expiresAt);

	if (now > expiresAt){
		await updateLockFile(folderId, "offline");
	}

	return  { 
		lockData: lockData, 
		lockFileId: lockFileId
	}
}

export function getMaxPlayers(serverPath: string): number | null {
    const propsPath = path.join(serverPath, "server.properties");
    if (!fs.existsSync(propsPath)) return null;
    
    const content = fs.readFileSync(propsPath, "utf-8");
    const match = content.match(/max-players=(\d+)/);
    return match ? parseInt(match[1]) : null;
}

export async function stopServer(
	options: {shouldUpload: boolean, folderId: string},
	onProgress: (message: string, status?: "error" | "loading" | "done", importance?: "major" | "minor") => void
){

	const defaultLock = {hostName: "", hostEmail: "", publicIp: "", startedAt: "", expiresAt: "", status:  "offline" }
	const {shouldUpload, folderId} = options

	try {
		let lockRes = await getServerLock(folderId);

		if(lockRes.lockData.status === "offline" || lockRes.lockData.status === "stopping")
			return {
				success : false,
				error: "This server is not being hosted."
			}
		await updateLockFile(folderId, "stopping")

		if(shouldUpload) {
			onProgress("Uploading the server files to the drive...", "loading", "major")
			const uploadRes = await uploadServerFolder(folderId, onProgress)
			onProgress("Done uploading the files", "done", "major")

			if(!uploadRes.success)
				return {
					success: false,
					error: uploadRes.error
				}
		}
		
		await updateLockFile(folderId, "offline");
		lockRes = await getServerLock(folderId)
		
		return { 
			success: true, 
			lockData: lockRes.lockData 
		}

	} catch (err: any) {
		return {
			success: false,
			lockData: defaultLock,
			error: err.message
		}
	}
}