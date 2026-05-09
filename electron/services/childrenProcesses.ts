import { spawn, ChildProcess, exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { IJavaFlags } from "../../src/lib/types";

let serverProcess: ChildProcess | null = null;
let playitggProcess: ChildProcess | null = null;

export function getServerProcess() { return serverProcess; }
export function isServerProcess() { return serverProcess ? true : false; }
export function getPlayitggProcess() { return playitggProcess; }

export function launchPlayitgg(playitggPath: string): ChildProcess | null {
    if (!fs.existsSync(playitggPath)) return null;
    playitggProcess = spawn(playitggPath, [], {
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true
    });
    return playitggProcess;
}

function parseRunScript(scriptPath: string): string[] | null {
    const content = fs.readFileSync(scriptPath, "utf-8");
    const javaLine = content
        .split("\n")
        .map(l => l.trim())
        .find(l => l.startsWith("java "));

    if (!javaLine) return null;

    // Strip shell argument-forwarding tokens
    const cleaned = javaLine
        .replace(/%\*/g, "")       // Windows: %*
        .replace(/"?\$@"?/g, "")   // Unix: "$@" or $@
        .trim();

    // Split into args, respecting quoted strings
    const args: string[] = [];
    const regex = /(?:[^\s"]+|"[^"]*")+/g;
    let match;
    while ((match = regex.exec(cleaned)) !== null)
        args.push(match[0].replace(/^"|"$/g, ""));

    return [...args.slice(1), "nogui"];
}

export function launchServer(serverPath: string, javaFlags: IJavaFlags, onError?: (msg: string) => void) {
    try {
        execSync("java -version", { stdio: "ignore" });
    } catch {
        return { success: false, error: "Java not installed" };
    }

    fs.writeFileSync(path.join(serverPath, "eula.txt"), "eula=true\n");

    const isWindows = process.platform === "win32";
    const scriptName = isWindows ? "run.bat" : "run.sh";
    const scriptPath = path.join(serverPath, scriptName);

    const runArgs = [`-Xmx${javaFlags.maxRAM}M`, `-Xms${javaFlags.minRAM}M`, javaFlags.customFlags].filter(Boolean)

    if (fs.existsSync(scriptPath)) {
        const parsed = parseRunScript(scriptPath); // returns args WITHOUT "java"
        if (!parsed)
            return { success: false, error: "Located the run file but no java command was found in it." };
        runArgs.push(...parsed)
    } else {
        const jarFiles = fs.readdirSync(serverPath).filter(f => f.endsWith(".jar"));
        if (jarFiles.length === 0)
            return { success: false, error: "No .jar file and no run script found." };
        if (jarFiles.length > 1)
            return { success: false, error: "Multiple .jar files found and no run script to disambiguate." };

        runArgs.push("-jar", jarFiles[0], "nogui");
    }

    console.log("attempting to run with args:", runArgs)

    serverProcess = spawn("java", runArgs, {
        cwd: serverPath,
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
    });

    serverProcess.on("close", (code) => {
        if (code !== 0)
            onError?.(`[System] Java exited with code ${code}`);
    });

    return { success: true, process: serverProcess };
}

export function killServer() {
    serverProcess?.stdin?.write("stop\n");
}

export function killPlayitgg() {
    if (!playitggProcess?.pid) return;
    exec(`taskkill /PID ${playitggProcess.pid} /T /F`);
    playitggProcess = null;
}

export function waitForPlayitLink(process: ChildProcess): Promise<string> {
    return new Promise((resolve, reject) => {
        let resolved = false;
        process.stdout?.on("data", (data) => {
            const text = data.toString("utf-8").replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
            const match = text.match(/([a-zA-Z0-9.-]+\.joinmc\.link)\s*=>/);
            if (match && !resolved) {
                resolved = true;
                resolve(match[1]);
            }
        });
        process.on("error", reject);
        process.on("close", () => { if (!resolved) reject(new Error("playit.gg closed before link was found")); });
    });
}