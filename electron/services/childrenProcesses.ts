import { spawn, ChildProcess } from "child_process";
import fs from "fs";

let serverProcess: ChildProcess | null = null;
let playitggProcess: ChildProcess | null = null;


export function getServerProcess(){
    return serverProcess;
}

export function getPlayitggProcess(){
    return playitggProcess;
}

export function setServerProcess(process: ChildProcess | null){
    serverProcess = process;
}

export function setPlayitggProcess(process: ChildProcess | null){
    playitggProcess = process;
}

export async function launchPlayitggConsole( playitggPath: string ){
    if (!fs.existsSync(playitggPath))
        playitggProcess = null;
    else
        playitggProcess = spawn(playitggPath, [], { stdio: ["ignore", "pipe", "pipe"], windowsHide: true });

    return playitggProcess
}

export async function launchServerConsole(serverPath: string){
    const files = fs.readdirSync(serverPath);
    const jarFile = files.find(f => f.endsWith(".jar"));

    if (!jarFile)
        serverProcess = null
    else
        serverProcess = spawn(
            "java",
            ["-Xmx4G", "-Xms2G", "-jar", "server.jar", "nogui"],
            {
                cwd: serverPath,
                stdio: ["pipe", "pipe", "pipe"],
                windowsHide: true
            }
        );
    
    return  serverProcess
}

export function waitForPlayitLink(process: ChildProcess): Promise<string> {
    return new Promise((resolve, reject) => {
        let resolved = false;

        process.stdout?.on("data", (data) => {
            const text = data.toString("utf-8");

            const match = text
                .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "")
                .match(/([a-zA-Z0-9.-]+\.joinmc\.link)\s*=>/);

            if (match && !resolved) {
                resolved = true;
                resolve(match[1]);
            }
        });

        process.on("error", reject);
    });
}