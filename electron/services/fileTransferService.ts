import path from "path";
import fs, { existsSync } from "fs";
import { IManifest } from "../../src/lib/types";
import { getOAuthClient, authorizedFetch, refreshIfNeeded } from "./googleAuthService";
import { OAuth2Client } from "google-auth-library";
import { getServerPath } from "./localServerStore";
import { createFolder } from "./googleDriveService";
import { PROTECTED_DIRECTORIES } from "./watcher-manifest";

const DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3/files";
let filesToDownload = new Set<string>("z.txt")
let filesToUpload = new Set<string>("asdawasd.txt")

type TFolderNode = { type: "folder", children: Map<string, TDirectoryNode> }
type TDirectoryNode = { type: "file" } | TFolderNode
interface IDriveItem {
    id: string,
    name: string,
    mimeType: string
}

export async function readDriveManifest(folderId: string): Promise<null | IManifest> {
    const client = getOAuthClient();

    const query = `'${folderId}' in parents and name='manifest.json' and trashed=false`;
    const url = `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}&fields=files(id)`;
    const data = await authorizedFetch(client, url);

    if (!data.files || data.files.length === 0)
        return null

    const manifestFileId = data.files[0].id
    let manifestData = await authorizedFetch(
        client,
        `${DRIVE_BASE_URL}/${manifestFileId}?alt=media`,
        { method: "GET" },
        {}
    );

    return manifestData
}

function buildTransferMap(filesToBeTransfered: Set<string>): TFolderNode {
    const root: TFolderNode = { type: "folder", children: new Map<string, TDirectoryNode>() }

    for (const file of filesToBeTransfered) {
        const parts = file.split(/[\\/]+/).filter(Boolean);
        const length = parts.length
        let currentNode: TDirectoryNode  = root

        for (let i = 0; i < length; i++) {
            const currentPart = parts[i]
            const isLast = (i === length - 1)

            if (currentNode.type !== "folder") break

            if (!currentNode.children.has(currentPart))
                currentNode.children.set(
                    currentPart,
                    isLast ? { type: "file" } : { type: "folder", children: new Map() }
                )

            if (!isLast) currentNode = currentNode.children.get(currentPart)! //descends into the newly created directory
        }
    }

    return root
}

async function listFolderIDs(client: OAuth2Client, folderId: string): Promise<IDriveItem[]> {
    const query = `'${folderId}' in parents and trashed=false`;
    let pageToken: string | undefined;
    const items: IDriveItem[] = []

    do {
        const url =
        `${DRIVE_BASE_URL}?q=${encodeURIComponent(query)}`
        + `&fields=files(id,name,mimeType),nextPageToken`
        + `&supportsAllDrives=true`
        + `&includeItemsFromAllDrives=true`
        + `&pageSize=1000`
        + (pageToken ? `&pageToken=${pageToken}`: "")

        const data = await authorizedFetch(client, url);
        items.push(...(data.files || []))
        pageToken = data.nextPageToken;
    }
    while (pageToken)
    
    return items
}

async function downloadFile(client: OAuth2Client, fileId: string) {
    await refreshIfNeeded(client);
    const accessToken = client.credentials.access_token;

    const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) throw new Error(await res.text());
    return Buffer.from(await res.arrayBuffer());
}

async function downloadFolderRecursive( client: OAuth2Client, folderId: string, localPath: string, fileMap: TFolderNode) {
    const driveItems: IDriveItem[] = await listFolderIDs(client, folderId);
    const driveItemsByName = new Map(driveItems.map(item=>[item.name, item]))

    for (const [name, node] of fileMap.children) {
        if (PROTECTED_DIRECTORIES.has(name)) continue;

        const driveItem = driveItemsByName.get(name)
        if (!driveItem) {
            console.warn("In manifest but not found in Drive:", path.join(localPath, name));
            continue;
        }

        const localItemPath = path.join(localPath, name);

        if(node.type === "folder"){
            if (driveItem.mimeType !== "application/vnd.google-apps.folder") {
                console.warn("Manifest expected a folder but Drive has a file:", name);
                continue;
            }
            
            try {
                const info = fs.statSync(localItemPath)
                if(!info.isDirectory()){
                    console.warn("Manifest expected a folder but found a file:", localItemPath);
                    continue
                }
            } catch (error) {
                if(!existsSync(localItemPath))
                    fs.mkdirSync(localItemPath);
            }

            await downloadFolderRecursive(client, driveItem.id, localItemPath, node);
        }
        else {
            try {
                const info = fs.statSync(localItemPath)
                if(!info.isFile()){
                    console.warn("Manifest expected a file but found a directory:", localItemPath);
                    continue
                }
            } catch (error) {
                console.warn(error)
            }
            
            const data = await downloadFile(client, driveItem.id);
            fs.writeFileSync(localItemPath, data);
        }
    }
}

export async function downloadServerFolder(serverId: string,) {
    const client = getOAuthClient();
    const localPath = getServerPath(serverId);

    if (!localPath) return { success: false, error: "No local path set." };

    try {
        if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });

        const fileTransferMap = buildTransferMap(filesToDownload)
        await downloadFolderRecursive(client, serverId, localPath, fileTransferMap);
        return { success: true };
    } 
    catch (err: any) {
        return { 
            success: false, 
            error: err.message 
        }
    }

}

async function uploadFile( client: OAuth2Client, localFilePath: string, localItemName: string, parentId: string, existing?: IDriveItem) {
    await refreshIfNeeded(client);
    const accessToken = client.credentials.access_token;

    const metadata = { name: localItemName, parents: existing ? undefined : [parentId] };
    const initUrl = existing
        ? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=resumable`
        : `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable`;

    const initRes = await fetch(initUrl, {
        method: existing ? "PATCH" : "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(metadata)
    });

    if (!initRes.ok) throw new Error(await initRes.text());

    const sessionUrl = initRes.headers.get("Location");
    if (!sessionUrl) throw new Error("No resumable session URL returned by Drive.");

    const fileBuffer = fs.readFileSync(localFilePath);

    const uploadRes = await fetch(sessionUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/octet-stream",
            "Content-Length": String(fileBuffer.length)
        },
        body: fileBuffer
    });

    if (!uploadRes.ok) throw new Error(await uploadRes.text());

    return await uploadRes.json();
}

async function uploadFolderRecursive(client: OAuth2Client, localPath: string, parentId: string, fileMap: TFolderNode) {
    const driveItems = await listFolderIDs(client, parentId);
    const driveItemsByName = new Map(driveItems.map(item=>[item.name, item]))

    for (const [localItemName, node] of fileMap.children) {
        if (PROTECTED_DIRECTORIES.has(localItemName)) continue;

        const localItemPath = path.join(localPath, localItemName)
        const driveItem = driveItemsByName.get(localItemName)

        if (node.type === "folder") {
            try {
                const info = fs.statSync(localItemPath)
                if(!info.isDirectory()){
                    console.warn("Manifest expected a folder but found a file:", localItemPath);
                    continue
                }
            } catch (error) {
                console.warn("In manifest but not found in Local:", localItemPath, " Error: ", error);
                continue;
            }
            
            let folderId: string;

            if(driveItem?.mimeType==="application/vnd.google-apps.folder")
                folderId = driveItem.id;
            else if(driveItem){
                console.warn("Manifest expected a folder but the Drive has a file: ", driveItem?.name)
                continue
            }
            else
                folderId = await createFolder(client, path.basename(localItemName), parentId);

            await uploadFolderRecursive(client, localItemPath, folderId, node);
        } 
        else {
            try {
                const info = fs.statSync(localItemPath)
                if(!info.isFile()){
                    console.warn("Manifest expected a file but found a directory:", path.join(localPath, localItemName));
                    continue
                }
            } catch (error) {
                console.warn("In manifest but not found in Local:", path.join(localPath, localItemName), " Error: ", error);
                continue;
            }
            await uploadFile(client, localItemPath, localItemName, parentId, driveItem);
        }
    }
}

export async function uploadServerFolder(serverId: string,) {
    const client = getOAuthClient();
    const localPath = getServerPath(serverId)

    if (!localPath) return { success: false, error: "No local path set." };

    try {
        const fileTransferMap = buildTransferMap(filesToUpload) 
        await uploadFolderRecursive(client, localPath, serverId, fileTransferMap);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}


