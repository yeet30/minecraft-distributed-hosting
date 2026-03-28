import { app } from "electron";
import path from "path";
import fs from "fs";
import { LocalVariables } from "../../src/lib/types";

type Store = {
    paths: Record<string, string>;
    joinedServerIds: string[];
    localVariables: {
        selectedIndex: number,
        playitggPath: string
    }
}

function getStorePath() {
    return path.join(app.getPath("userData"), "localStore.json");
}

function readStore(): Store {
    const storePath = getStorePath();

    if (!fs.existsSync(storePath))
        return { paths: {}, joinedServerIds: [], localVariables: {
                selectedIndex: 0, 
                playitggPath: ""
            } 
        }

    const data = JSON.parse(fs.readFileSync(storePath, "utf-8"));

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

export function getLocalVariable(variable: keyof LocalVariables){
    const store = readStore()
    return store.localVariables[variable];
}

export function setLocalVariable<K extends keyof LocalVariables>(variable: K, value: LocalVariables[K]) {
  const store = readStore();
  store.localVariables[variable] = value;
  writeStore(store);
}