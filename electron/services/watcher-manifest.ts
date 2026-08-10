import { watch, FSWatcher } from 'chokidar';
import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import { IManifestUpdates } from '../../src/lib/types';

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

const IGNORED_DIRECTORIES = [
    /[/\\]node_modules[/\\]/,
    /[/\\]manifest\.json$/,
    /[/\\]\.vscode[/\\]/,
    /[/\\]lock\.json$/,
    /[/\\]session\.lock$/,
    /[/\\]logs[/\\]/,
    /[/\\]crash-reports[/\\]/,
    /\.log$/,
];

let manifestUpdates: IManifestUpdates = { toAdd: new Set<string>(), toRemove: new Set<string>() };
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

export async function startWatcher(serverDir: string) {

    stopWatcher()
    manifestUpdates = { toAdd: new Set<string>(), toRemove: new Set<string>() };

    watcher = watch(serverDir, {
        ignoreInitial: false,
        ignored: IGNORED_DIRECTORIES,
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
        if (manifestUpdates.toAdd.has(filePath))
            manifestUpdates.toAdd.delete(filePath)
        else {
            manifestUpdates.toRemove.add(filePath)
            manifestUpdates.toAdd.delete(filePath)
        }
    }
    console.log("These files have been removed from to the directory while the program was not running:", manifestUpdates.toRemove);
    console.log("These files have been added to the directory while the program was not running:", manifestUpdates.toAdd);
}

function manifestUpsert(serverDir: string, p: string) {
    const rel = path.relative(serverDir, p)
    console.log(`File ${rel} has been added to the manifest.`)
    manifestEvents.emit('change', { opertion: 'upsert', path: rel })
    manifestUpdates.toRemove.delete(rel)
    manifestUpdates.toAdd.add(rel)
}

function manifestRemove(serverDir:string, p: string) {
    const rel = path.relative(serverDir, p)
    console.log(`File ${rel} has been removed from the manifest.`)
    manifestEvents.emit('change', { opertion: 'remove', path: rel })
    manifestUpdates.toAdd.delete(rel)
    manifestUpdates.toRemove.add(rel)
}

export function writeManifest(serverDir: string) {
    readLocalManifest(serverDir)
    for (const filePath of manifestUpdates.toAdd) {
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
    for (const filePath of manifestUpdates.toRemove)
        delete localManifest.files[filePath]
    const tempPath= path.join(serverDir, "manifest.tmp")
    const manifestPath = getLocalManifestPath(serverDir)
    fs.writeFileSync(tempPath, JSON.stringify(localManifest, null, 4), "utf8")
    fs.renameSync(tempPath, manifestPath);
    manifestUpdates.toAdd.clear()
    manifestUpdates.toRemove.clear()
    console.log("The manifest.json has been written.");
}

export function stopWatcher() {
    watcher?.close();
    watcher = null;
}

export function isWatcherRunning(): boolean { return !(watcher === null) }

export function getManifestUpdates() { return manifestUpdates; }