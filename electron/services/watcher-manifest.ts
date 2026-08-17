import { watch, FSWatcher } from 'chokidar';
import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import { IWatcherEntry, IWatcherUpdates } from '../../src/lib/types';
import { getLocalVariable, setLocalVariable } from './localServerStore';

interface IManifest {
    version: number,
    updatedAt: string,
    files: Record<string, IFileEntry>
}

interface IFileEntry {
    version: number,
    size: number,
    updatedAt: string
}

const PROTECTED_NAMES = new Set<string>(["manifest.json", "lock.json"])
let ignoredNames = new Set<string>([...PROTECTED_NAMES])

let trackedFiles = new Set<string>()
let ignoredPatterns: RegExp[] = [];
let watcherUpdates: IWatcherUpdates = { 
    toAdd: new Map<string,IWatcherEntry>(), 
    toRemove: new Map<string,IWatcherEntry>() 
};
let watcher: FSWatcher | null = null;
export const manifestEvents = new EventEmitter()
let localManifest: IManifest = {
    version: 0,
    updatedAt: new Date().toISOString(),
    files: {}
}

export function getLocalManifestPath(serverDir: string): string {
    return path.join(serverDir, "manifest.json")
}

function localManifestExists(serverDir: string): boolean {
    return fs.existsSync(getLocalManifestPath(serverDir))
}

function readLocalManifest(serverDir: string) {
    if (localManifestExists(serverDir))
        localManifest = JSON.parse(fs.readFileSync(getLocalManifestPath(serverDir), { encoding: 'utf8', flag: 'r' }))
}

function escapeRegExp(str: string): string { return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}

function normalizePath(p: string): string { return path.resolve(p).replace(/\\/g, "/").replace(/\/+$/, "")}

function makeSpecificDirRule(rootDir: string, folderName: string): RegExp {
    const safeRoot = escapeRegExp(normalizePath(rootDir));
    const safeName = escapeRegExp(folderName);
    return new RegExp(`^${safeRoot}/${safeName}(/|$)`);
}

function rebuildIgnoredPatterns(serverDir: string): void {
    ignoredPatterns = Array.from(ignoredNames).map(name => makeSpecificDirRule(serverDir, name));
}

function isIgnored(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, "/");
    return ignoredPatterns.some(pattern => pattern.test(normalizedPath));
}

export async function startWatcher(serverDir: string) {

    stopWatcher()
    watcherUpdates = { 
        toAdd: new Map<string,IWatcherEntry>(), 
        toRemove: new Map<string,IWatcherEntry>() 
    };
    ignoredNames = new Set(getLocalVariable("watcherBlacklist"))
    rebuildIgnoredPatterns(serverDir)

    watcher = watch(serverDir, {
        ignoreInitial: false,
        ignored: isIgnored,
        persistent: true,
        awaitWriteFinish: {
            stabilityThreshold: 3000,
            pollInterval: 200
        }
    });

    const currentWatcher = watcher

    return await new Promise<void>((resolve, reject) => {
        currentWatcher
            .on('add', (p: string) => manifestUpsert(serverDir, p))
            .on('change', (p: string) => manifestUpsert(serverDir, p))
            .on('unlink', (p: string) => manifestRemove(serverDir,p))
            .once('ready', () => {
                removeDuplicates()
                resolve()
            })
            .on('error', (error: unknown) => {
                console.error(`Watcher error: ${error}`)
                reject(error)
            });
    })
}

//Leaves in only the files that had been added/removed while the program was not running.
function removeDuplicates(){
    for (const filePath of Object.keys(localManifest.files)) {
        if (watcherUpdates.toAdd.has(filePath))
            watcherUpdates.toAdd.delete(filePath)
        else {
            watcherUpdates.toRemove.set(filePath, {size: 0, changedAt: 0})
            watcherUpdates.toAdd.delete(filePath)
        }
    }
    console.log("These files have been removed from to the directory while the program was not running:", watcherUpdates.toRemove);
    console.log("These files have been added to the directory while the program was not running:", watcherUpdates.toAdd);
}

function manifestUpsert(serverDir: string, p: string) {
    const rel = path.relative(serverDir, p)
    console.log(`File ${rel} has been added to the manifest.`)
    manifestEvents.emit('change', { opertion: 'upsert', path: rel })
    trackedFiles.add(rel)
    watcherUpdates.toRemove.delete(rel)
    watcherUpdates.toAdd.set(rel, {size: 0, changedAt: 0})
}

function manifestRemove(serverDir:string, p: string) {
    const rel = path.relative(serverDir, p)
    console.log(`File ${rel} has been removed from the manifest.`)
    manifestEvents.emit('change', { opertion: 'remove', path: rel })
    trackedFiles.delete(rel)
    watcherUpdates.toAdd.delete(rel)
    watcherUpdates.toRemove.set(rel, {size: 0, changedAt: Date.now()})
}

export function writeManifest(serverDir: string) {
    readLocalManifest(serverDir)
    for (const filePath of watcherUpdates.toAdd.keys()) {
        const existing = localManifest.files[filePath]
        let fileStats = null
        try {
            fileStats = fs.statSync(path.join(serverDir, filePath))
        } catch (error) {
            console.log(`Could not write the information on the file: ${filePath}. See the reason below: \n${error}`)
        }
        if (existing) {
            localManifest.files[filePath] = {
                version: existing.version + 1,
                size: fileStats?.size ?? existing.size,
                updatedAt: fileStats?.mtime.toISOString() ?? existing.updatedAt
            }
        }
        else {
            localManifest.files[filePath] = {
                version: 0,
                size: fileStats?.size ?? 0,
                updatedAt: fileStats?.mtime.toISOString() ?? new Date().toISOString()
            }
        }
    }
    for (const filePath of watcherUpdates.toRemove.keys())
        delete localManifest.files[filePath]
    const tempPath= path.join(serverDir, "manifest.tmp")
    const manifestPath = getLocalManifestPath(serverDir)
    fs.writeFileSync(tempPath, JSON.stringify(localManifest, null, 4), "utf8")
    fs.renameSync(tempPath, manifestPath);
    watcherUpdates.toAdd.clear()
    watcherUpdates.toRemove.clear()
    console.log("The manifest.json has been written.");
}

export function setWatcherBlacklist(serverDir: string, blacklist: Set<string>){    
    ignoredNames = new Set([...PROTECTED_NAMES, ...blacklist]);
    console.log("updated ignored: ", ignoredNames);
    
    setLocalVariable("watcherBlacklist", [...ignoredNames])
    rebuildIgnoredPatterns(serverDir)
}

export function mutateTrackedFiles(change: {operation: "add" | "remove", filePath:string}){
    if(change.operation === "add")
        trackedFiles.add(change.filePath)
    else if(change.operation === "remove")
        trackedFiles.delete(change.filePath)
}

export function stopWatcher() {
    watcher?.close();
    trackedFiles.clear()
    watcher = null;
}

export function getBlacklist(): Set<string> {return ignoredNames}

export function getTrackedFiles(): Set<string> { return trackedFiles }

export function isWatcherRunning(): boolean { return !(watcher === null) }

export function getWatcherUpdates(serverDir: string): IWatcherUpdates { 
    for (const [filePath, update] of watcherUpdates.toAdd) {
        const stats = fs.statSync(path.join(serverDir,filePath))
        update.size = stats.size
        update.changedAt = stats.mtimeMs
    }
    return watcherUpdates
}