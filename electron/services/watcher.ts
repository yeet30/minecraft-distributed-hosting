import { watch, FSWatcher } from 'chokidar';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const dir = "C:\\Users\\ygtyi\\Desktop\\Code\\fs-watcher"
let manifestExists = fs.existsSync("./manifest.json")

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

//Initializes/Reads the manifest.

let manifest: IManifest = {
    version: 0,
    updatedAt: new Date().toISOString(),
    files: {}
};
if (manifestExists)
    manifest = JSON.parse(fs.readFileSync("./manifest.json", { encoding: 'utf8', flag: 'r' }))

//Declares the FileWatcher

const watcher: FSWatcher = watch('./', {
    ignoreInitial: false,
    ignored: ["node_modules", "manifest.json", ".vscode"],
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


//Initializes manifestBuffer. 
const manifestBuffer = {
    toAdd: new Set<string>(),
    toRemove: new Set<string>()
};

//Leaves in only the files that had been added/removed while the program was not running.
function removeDuplicates() {
    for (const filePath of Object.keys(manifest.files)) {
        if (manifestBuffer.toAdd.has(filePath))
            manifestBuffer.toAdd.delete(filePath)
        else {
            manifestBuffer.toRemove.add(filePath)
            manifestBuffer.toAdd.delete(filePath)
        }
    }
    console.log("These files have been removed from to the directory while the program was not running:", manifestBuffer.toRemove);
    console.log("These files have been added to the directory while the program was not running:", manifestBuffer.toAdd);
}

function manifestUpsert(path: string) {
    console.log(`File ${path} has been added to the manifest.`)
    manifestBuffer.toRemove.delete(path)
    manifestBuffer.toAdd.add(path)
}

function manifestRemove(path: string) {
    console.log(`File ${path} has been removed from the manifest.`)
    manifestBuffer.toAdd.delete(path)
    manifestBuffer.toRemove.add(path)
}

function writeManifest() {
    for (const filePath of manifestBuffer.toAdd) {
        const existing = manifest.files[filePath]
        let fileStats = null
        try {
            fileStats = fs.statSync(path.join(dir, filePath))
        } catch (error) {
            console.log(`Could not write the information on the file: ${filePath}. See the reason below: \n${error}`)
        }
        if (existing) {
            manifest.files[filePath] = {
                version: existing.version + 1,
                size: fileStats?.size ?? existing.size,
                updatedAt: fileStats?.mtime.toISOString() ?? existing.updatedAt
            }
        }
        else {
            manifest.files[filePath] = {
                version: 0,
                size: fileStats?.size ?? 0,
                updatedAt: fileStats?.mtime.toISOString() ?? new Date().toISOString()
            }
        }
    }
    for (const filePath of manifestBuffer.toRemove)
        delete manifest.files[filePath]
    fs.writeFileSync("./manifest.tmp", JSON.stringify(manifest, null, 4), "utf8")
    fs.renameSync("./manifest.tmp", "./manifest.json");
    manifestBuffer.toAdd.clear()
    manifestBuffer.toRemove.clear()
    console.log("The manifest.json has been written.");
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Save/Stop (y/n)\n', answer => {
    if (answer === "y")
        writeManifest()
    else if (answer === "n") {
        process.exit()
    }
})