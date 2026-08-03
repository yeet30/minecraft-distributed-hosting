import { watch, FSWatcher } from 'chokidar';
import fs from 'fs';
import path from 'path';

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
    "node_modules", 
    "manifest.json", 
    ".vscode",
    "manifest.json",
	"lock.json",
	"session.lock",
	/[/\\]logs[/\\]/,
	/[/\\]crash-reports[/\\]/,
	/\.log$/,
]

let manifestUpdates = { toAdd: new Set<string>(), toRemove: new Set<string>() };
let watcher: FSWatcher | null = null;
let localManifest: IManifest = {
    version: 0,
    updatedAt: new Date().toISOString(),
    files: {}
};

function getLocalManifestPath(serverDir:string):string{
    return path.join(serverDir, "manifest.json")
}

function localManifestExists(serverDir:string):boolean{
    return fs.existsSync(getLocalManifestPath(serverDir))
}

function readLocalManifest(serverDir:string){
    if (localManifestExists(serverDir))
        localManifest = JSON.parse(fs.readFileSync("./manifest.json", { encoding: 'utf8', flag: 'r' }))
}

export function startWatcher(serverDir:string){

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

    watcher
        .on('add', (path: string) => manifestUpsert(path))
        .on('change', (path: string) => manifestUpsert(path))
        .on('unlink', (path: string) => manifestRemove(path))
        .on('ready', () => removeDuplicates())
        .on('error', (error: unknown) => console.error(`Watcher error: ${error}`));
    
}

//Leaves in only the files that had been added/removed while the program was not running.
function removeDuplicates() {
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

function manifestUpsert(path: string) {
    console.log(`File ${path} has been added to the manifest.`)
    manifestUpdates.toRemove.delete(path)
    manifestUpdates.toAdd.add(path)
}

function manifestRemove(path: string) {
    console.log(`File ${path} has been removed from the manifest.`)
    manifestUpdates.toAdd.delete(path)
    manifestUpdates.toRemove.add(path)
}

export function writeManifest(serverDir:string) {
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
    fs.writeFileSync("./manifest.tmp", JSON.stringify(localManifest, null, 4), "utf8")
    fs.renameSync("./manifest.tmp", "./manifest.json");
    manifestUpdates.toAdd.clear()
    manifestUpdates.toRemove.clear()
    console.log("The manifest.json has been written.");
}

export function stopWatcher(){
    watcher?.close();
	watcher = null;
}

export function getManifestUpdates(){
    return manifestUpdates;
}