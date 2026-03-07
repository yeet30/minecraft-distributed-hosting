import { app } from "electron";
import path from "path";
import fs from "fs";

function getStorePath() {
  return path.join(app.getPath("userData"), "serverPaths.json");
}

function readStore(): Record<string, string> {
  const storePath = getStorePath();

  if (!fs.existsSync(storePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(storePath, "utf-8"));
}

function writeStore(data: Record<string, string>) {
  fs.writeFileSync(
    getStorePath(),
    JSON.stringify(data, null, 2)
  );
}

export function setServerPath(serverId: string, localPath: string) {
  const store = readStore();
  store[serverId] = localPath;
  writeStore(store);
}

export function getServerPath(serverId: string) {
  const store = readStore();
  return store[serverId] || null;
}