import chokidar, { FSWatcher } from "chokidar";
import path from "path";

export interface WatcherState {
  changed: Set<string>;
  deleted: Set<string>;
}

const IGNORED = [
  "manifest.json",
  "lock.json",
  "session.lock",
  /[/\\]logs[/\\]/,
  /[/\\]crash-reports[/\\]/,
  /\.log$/,
];

let watcher: FSWatcher | null = null;
let state: WatcherState = { changed: new Set(), deleted: new Set() };

export function startWatcher(serverDir: string): void {
  stopWatcher();
  state = { changed: new Set(), deleted: new Set() };

  watcher = chokidar.watch(serverDir, {
    ignored: IGNORED,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 1500,
      pollInterval: 200,
    },
  });

  const rel = (abs: string) => path.relative(serverDir, abs).replace(/\\/g, "/");

  watcher.on("add",    (p) => { const r = rel(p); state.changed.add(r); state.deleted.delete(r); });
  watcher.on("change", (p) => { const r = rel(p); state.changed.add(r); state.deleted.delete(r); });
  watcher.on("unlink", (p) => { const r = rel(p); state.deleted.add(r); state.changed.delete(r); });
}

export function stopWatcher(): void {
  watcher?.close();
  watcher = null;
}

export function getWatcherState(): WatcherState {
  return state;
}