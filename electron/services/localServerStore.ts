import { app } from "electron";
import path from "path";
import fs from "fs";

type Store = {
    paths: Record<string, string>;
    joinedServerIds: string[];
}

function getStorePath() {
    return path.join(app.getPath("userData"), "serverPaths.json");
}

function readStore(): Store {
    const storePath = getStorePath();

    if (!fs.existsSync(storePath))
        return { paths: {}, joinedServerIds: [] };

    const data = JSON.parse(fs.readFileSync(storePath, "utf-8"));

    // Migrate old store format
    if (!data.paths) 
        return { paths: data, joinedServerIds: [] }; // preserve old paths

    // Ensure joinedServerIds exists
    if (!data.joinedServerIds)
        data.joinedServerIds = [];

    return data;
}

function writeStore(data: Store) {
    fs.writeFileSync(getStorePath(), JSON.stringify(data, null, 2));
}

export function setServerPath(serverId: string, localPath: string) {
    const store = readStore();
    store.paths[serverId] = localPath;
    writeStore(store);
}

export function getServerPath(serverId: string) {
    const store = readStore();
    return store.paths[serverId] || null;
}

export function addJoinedServer(serverId: string) {
    const store = readStore();
    if (!store.joinedServerIds.includes(serverId))
        store.joinedServerIds.push(serverId);
    writeStore(store);
}

export function getJoinedServerIds(): string[] {
    const store = readStore();
    return store.joinedServerIds || [];
}

export function removeJoinedServer(serverId: string) {
    const store = readStore();
    store.joinedServerIds = store.joinedServerIds.filter(id => id !== serverId);
    writeStore(store);
}