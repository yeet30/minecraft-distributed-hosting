import { watch, FSWatcher } from 'chokidar';
import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import { IWatcherEntry, IWatcherUpdates, IManifest } from '../../src/lib/types';
import { getLocalVariable, setLocalVariable } from './localServerStore';
import { readDriveManifest } from './fileTransferService';
import { getUserInfo } from './googleAuthService';

export const PROTECTED_DIRECTORIES = new Set<string>(["manifest.json", "lock.json"])
let ignoredNames = new Set<string>([...PROTECTED_DIRECTORIES])

let trackedFiles = new Set<string>()
let ignoredPatterns: RegExp[] = [];
let watcherUpdates: IWatcherUpdates = {
    toAdd: new Map<string, IWatcherEntry>(),
    toRemove: new Map<string, IWatcherEntry>()
};
let localChanges: IWatcherUpdates = {
    toAdd: new Map<string, IWatcherEntry>(),
    toRemove: new Map<string, IWatcherEntry>()
};
let watcher: FSWatcher | null = null;
export const manifestEvents = new EventEmitter()
let localManifest: IManifest = {
    version: 0,
    updatedAt: Date.now(),
    authorName: "",
    authorEmail: "",
    files: {}
}

export function getLocalManifestPath(serverDir: string): string {
    return path.join(serverDir, "manifest.json")
}

function localManifestExists(serverDir: string): boolean {
    return fs.existsSync(getLocalManifestPath(serverDir))
}

export function readLocalManifest(serverDir: string) {
    if (localManifestExists(serverDir))
        localManifest = JSON.parse(fs.readFileSync(getLocalManifestPath(serverDir), { encoding: 'utf8', flag: 'r' }))
}

function escapeRegExp(str: string): string { return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }

function normalizePath(p: string): string { return path.resolve(p).replace(/\\/g, "/").replace(/\/+$/, "") }

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
        toAdd: new Map<string, IWatcherEntry>(),
        toRemove: new Map<string, IWatcherEntry>()
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
            .on('unlink', (p: string) => manifestRemove(serverDir, p))
            .once('ready', () => {
                readLocalManifest(serverDir)
                detectLocalChanges(serverDir)
                resolve()
            })
            .on('error', (error: unknown) => {
                console.error(`Watcher error: ${error}`)
                reject(error)
            });
    })
}

//Leaves in only the files that had been added/removed while the program was not running.
function detectLocalChanges(serverDir: string) {
    formatWatcherUpdates(serverDir)
    for (const [filePath, value] of Object.entries(localManifest.files)) {
        const watcherInstance = watcherUpdates.toAdd.get(filePath)
        if (watcherInstance) {
            if (watcherInstance.modifiedAt === value.modifiedAt)
                watcherUpdates.toAdd.delete(filePath)
            else
                continue
        }
        else {
            watcherUpdates.toRemove.set(filePath, { size: 0, modifiedAt: 0 })
            watcherUpdates.toAdd.delete(filePath)
        }
    }

    localChanges.toAdd = watcherUpdates.toAdd
    localChanges.toRemove = watcherUpdates.toRemove
}

export function getLocalChanges(): IWatcherUpdates { return localChanges }

function manifestUpsert(serverDir: string, p: string) {
    const rel = path.relative(serverDir, p)
    console.log(`File ${rel} has been added to the manifest.`)
    manifestEvents.emit('change', { opertion: 'upsert', path: rel })
    trackedFiles.add(rel)
    watcherUpdates.toRemove.delete(rel)
    watcherUpdates.toAdd.set(rel, { size: 0, modifiedAt: 0 })
}

function manifestRemove(serverDir: string, p: string) {
    const rel = path.relative(serverDir, p)
    console.log(`File ${rel} has been removed from the manifest.`)
    manifestEvents.emit('change', { opertion: 'remove', path: rel })
    trackedFiles.delete(rel)
    watcherUpdates.toAdd.delete(rel)
    watcherUpdates.toRemove.set(rel, { size: 0, modifiedAt: Date.now() })
}

export async function writeLocalManifest(serverDir: string) {
    readLocalManifest(serverDir)
    formatWatcherUpdates(serverDir)
    const userInfo = await getUserInfo()

    for (const [filePath, value] of watcherUpdates.toAdd) {
        const existing = localManifest.files[filePath]

        localManifest.files[filePath] = {
            version: existing ? (existing.version + 1) : 0,
            size: value.size,
            modifiedAt: value.modifiedAt
        }
    }
    for (const filePath of watcherUpdates.toRemove.keys())
        delete localManifest.files[filePath]

    localManifest.updatedAt = Date.now()
    localManifest.version++;
    localManifest.authorName = userInfo.name
    localManifest.authorEmail = userInfo.email

    const tempPath = path.join(serverDir, "manifest.tmp")
    const manifestPath = getLocalManifestPath(serverDir)
    fs.writeFileSync(tempPath, JSON.stringify(localManifest, null, 4), "utf8")
    fs.renameSync(tempPath, manifestPath);
    watcherUpdates.toAdd.clear()
    watcherUpdates.toRemove.clear()
    console.log("The manifest.json has been written.");
}

export function setWatcherBlacklist(serverDir: string, blacklist: Set<string>) {
    ignoredNames = new Set([...PROTECTED_DIRECTORIES, ...blacklist]);
    console.log("updated ignored: ", ignoredNames);

    setLocalVariable("watcherBlacklist", [...ignoredNames])
    rebuildIgnoredPatterns(serverDir)
}

export function mutateTrackedFiles(change: { operation: "add" | "remove", filePath: string }) {
    if (change.operation === "add")
        trackedFiles.add(change.filePath)
    else if (change.operation === "remove")
        trackedFiles.delete(change.filePath)
}

export function stopWatcher() {
    watcher?.close();
    trackedFiles.clear()
    watcher = null;
}

export function getBlacklist(): Set<string> { return ignoredNames }

export function getTrackedFiles(): Set<string> { return trackedFiles }

export function isWatcherRunning(): boolean { return !(watcher === null) }

function formatWatcherUpdates(serverDir: string) {
    for (const [filePath, update] of watcherUpdates.toAdd) {
        const stats = fs.statSync(path.join(serverDir, filePath))
        update.size = stats.size
        update.modifiedAt = stats.mtimeMs
    }
}

export function getWatcherUpdates(serverDir: string): IWatcherUpdates {
    formatWatcherUpdates(serverDir)
    return watcherUpdates
}

/**
 * Returns a set containing the difference of two manifest objects' file entries,
 * based on the existance of the entries and the modified timestamps.
 * @param manifestA Manifest object to be cycled through
 * @param manifestB Manifest object to be compared to
 */
function getManifestDifference(manifestA: IManifest, manifestB: IManifest): Set<string> {
    const fileDifference = new Set<string>();
    for (const [filePath, instanceA] of Object.entries(manifestA.files)) {
        const instanceB = manifestB.files[filePath]
        if (!instanceB || instanceA.version > instanceB.version)
            fileDifference.add(filePath)
    }
    return fileDifference
}

function getFilesToDelete(localManifest: IManifest, driveManifest: IManifest): Set<string> {
    const toDelete = new Set<string>();
    for (const filePath of Object.keys(driveManifest.files))
        if (!localManifest.files[filePath]) toDelete.add(filePath);
    return toDelete;
}

export async function getFilesToDownload(serverDir: string, serverId: string, overrideWarning: boolean = false) {
    const driveManifest = await readDriveManifest(serverId)
    readLocalManifest(serverDir)
    if (!driveManifest)
        return {
            success: false,
            error: `Manifest.json could not be found in the Drive folder.`
        }
    else if (!localManifest.files)
        return {
            success: true,
            filesToDownload: new Set(Object.keys(driveManifest.files)),
            filesToRemove: new Set<string>()
        }
    else if (localManifest.version > driveManifest.version && !overrideWarning)
        return {
            success: false,
            error: `The files found in the Drive folder may NOT be up to date, `
                + `and downloading them may cause desynchronisation problems. `
                + `\n\nPlease contact the latest uploader: `
                + `\nName: ${driveManifest.authorName} \nEmail: ${driveManifest.authorEmail}`
                + `\n\nOr proceed with downloading ONLY if you know what you are doing!`
        }

    const filesToDownload = getManifestDifference(driveManifest, localManifest)
    const filesToRemove = getFilesToDelete(driveManifest, localManifest)

    return {
        success: true,
        filesToDownload: filesToDownload,
        filesToRemove: filesToRemove
    }
}

export async function getFilesToUpload(serverDir: string, serverId: string, overrideWarning: boolean = false) {
    const driveManifest = await readDriveManifest(serverId)
    writeLocalManifest(serverDir)

    if (!localManifest.files)
        return {
            success: false,
            error: "There are no files to be uploaded in the local directory."
        }
    else if (!driveManifest)
        return {
            success: true,
            filesToUpload: new Set(Object.keys(localManifest.files)),
            filesToRemove: new Set<string>()
        }
    else if (driveManifest.version > localManifest.version && !overrideWarning)
        return {
            success: false,
            error: `The files found in your local directory may NOT be up to date, `
                + `and uploading them may cause desynchronisation problems. `
                + `\n\nPlease contact the latest uploader: `
                + `\nName: ${driveManifest.authorName} \nEmail: ${driveManifest.authorEmail}`
                + `\n\nOr proceed with uploading ONLY if you know what you are doing!`
        }
    
    const filesToUpload = getManifestDifference(localManifest, driveManifest)
    const filesToRemove = getFilesToDelete(localManifest, driveManifest)

    return {
        success: true,
        filesToUpload: filesToUpload,
        filesToRemove: filesToRemove
    }
}