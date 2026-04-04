import { app, BrowserWindow, ipcMain, dialog, shell, Menu, Tray, nativeImage  } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ILocalVariables } from '../src/lib/types'
import { loginWithGoogle, getUserInfo, isAlreadyLoggedIn, logoutGoogle, isRequestAllowed, requestDriveScope } from './services/googleAuthService'
import {
	createServerFolder,
	deleteServerFolder,
	getRootWithContents,
	syncServer,
	uploadServerFolder,
	inviteUserToServer,
	removeUserPermission,
	getJoinedServers,
	joinServerById,
	renameServerFolder,
} from './services/googleDriveService'

import { startServer, getServerLock, updateLockFile, stopServer, getMaxPlayers } from './services/serverService' 
import { launchServer, getServerProcess, getPlayitggProcess, killPlayitgg, killServer } from './services/childrenProcesses'
import { getServerPath, setServerPath, getLocalVariable, setLocalVariable } from './services/localServerStore'
import { IStartupOptions } from '../src/lib/types'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconPath = path.join(__dirname, '../public/launcher.ico')

let heartbeatInterval: NodeJS.Timeout | null = null;
let currentHostingServerId: string | null = null;
let currentPlayers: string[] = [];
let cleanupDone = false;
let isQuitting = false;

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null = null;
Menu.setApplicationMenu(null)

function createWindow() {
	win = new BrowserWindow({
		resizable: false,
		width: 800,
		height: 600,
		icon: iconPath,
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
		},
	})

	win.on('minimize', (event: Event) => {
		event.preventDefault()
		win?.hide()
	})

	win.on('close', (event) => {
		if (cleanupDone) return; // cleanup done, let it close for real

		event.preventDefault(); // block close in ALL other cases

		if (isQuitting) {
			// we're in quit flow, do cleanup then close
			safeSend('app-quitting');
			safeSend('show-progress');
			doCleanup(); // extract cleanup into a separate function
			return;
		}

		// manual X button click, show confirm popup
		win!.webContents.send('confirm-quit', { isHosting: !!currentHostingServerId });
	});

	win.on('closed', () => {
		win = null;
	});

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', (new Date).toLocaleString())
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, 'index.html'))
	}
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    console.log("window-all-closed fired, cleanupDone:", cleanupDone, "platform:", process.platform);
    if (process.platform !== 'darwin') {
        if (cleanupDone) {
            app.quit();
            win = null;
        }
    }
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

app.whenReady().then(() => {
    const icon = nativeImage.createFromPath(iconPath)
    tray = new Tray(icon)
    
    tray.setToolTip('Drive Launcher')
    tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'Open', click: () => win?.show() },
        { label: 'Quit', click: () => app.quit() }
    ]))

    tray.on('click', () => {
        win?.show()
    })
})

app.on('before-quit', () => {
	win?.show()
    console.log("before-quit fired, cleanupDone:", cleanupDone);
});

app.on('will-quit', (event) => {
    if (!cleanupDone) event.preventDefault(); // safety net, shouldn't reach here before cleanup
});

ipcMain.handle('confirm-quit-response', (_, confirmed: boolean) => {
    if (confirmed) {
        isQuitting = true; // allow window to close when app.quit() triggers 'close'
        safeSend('app-quitting');
        safeSend('show-progress');
        app.quit();
    }
});

function safeSend(channel: string, ...args: any[]) {
    if (win && !win.isDestroyed()) {
        win.webContents.send(channel, ...args);
    }
}

function sendProgress(message: string, status: 'loading' | 'done' | 'error' = 'loading', importance: 'major' | 'minor' = 'minor') {
	if (win && !win.isDestroyed()) {
    	win?.webContents.send("startup-progress", { message, status, importance });
	}
}

async function doCleanup() {
    const playitggProcess = getPlayitggProcess();

    if (playitggProcess) {
        sendProgress("Closing down the playitgg client.", "loading", "major");
        killPlayitgg();
        sendProgress("Finished closing the playitgg client.", "done", "major");
    }

    if (currentHostingServerId) {
        sendProgress("Closing down the server console.", "loading", "major");
        killServer();
        sendProgress("Finished closing down the server console.", "done", "major");

        const shouldUpload = getLocalVariable("checklist").upload;
        const stopRes = await stopServer({ shouldUpload, folderId: currentHostingServerId }, sendProgress);
        currentHostingServerId = null;

        safeSend("hide-progress");

        if (!stopRes.success) {
            await dialog.showMessageBox({
                type: "info",
                title: "Info",
                message: stopRes.error,
            });
        }
    }

    clearInterval(heartbeatInterval!);
    heartbeatInterval = null;
    cleanupDone = true;
    app.quit(); // now cleanupDone is true, close event passes through, will-quit passes through
}

ipcMain.handle("google-login", async () => {
	return await loginWithGoogle();
});

ipcMain.handle("google-get-user", async () => {
	return await getUserInfo(); 
});

ipcMain.handle("google-is-logged-in", () => {
	return isAlreadyLoggedIn();
})

ipcMain.handle("google-logout", async () => {

	win?.webContents.send('app-quitting')

	win?.webContents.send("show-progress");
	const playitggProcess = getPlayitggProcess()
	let stopRes;

	if(playitggProcess){
		sendProgress("Closing down the playitgg client.", "loading", "major")
		killPlayitgg()
		sendProgress("Finished closing the playitgg client.", "done", "major")
	}

	if (currentHostingServerId) {
		sendProgress("Closing down the server console.", "loading", "major")
		killServer()
		sendProgress("Finished closing down the server console.", "done", "major")

		const shouldUpload = getLocalVariable("checklist").upload

		stopRes = await stopServer({ shouldUpload: shouldUpload, folderId: currentHostingServerId }, sendProgress);
		currentHostingServerId = null;
		win?.webContents.send("hide-progress");
		if(!stopRes.success)
			dialog.showMessageBox({
				type: "info",
				title: "Info",
				message: stopRes.error,
			});
    }

	clearInterval(heartbeatInterval!);
	heartbeatInterval = null;
		
    return await logoutGoogle();
})

ipcMain.handle("start-server", async (_, options: IStartupOptions) => {

	if(
		(options.checklist.download 
		|| options.checklist.upload 
		|| options.checklist.serverConsole) 
		&& !options.serverPath
	)
		return {success: false, error: "You need to set the server path."}


	win?.webContents.send("show-progress");
    const result = await startServer(options, sendProgress);

    if (!result.success) {
		return {success: false, error: result.error}
	};

	let launchRes = null
	let serverProcess= null;

    // Launch the actual MC server process
	if(options.checklist.serverConsole){
		launchRes = launchServer(options.serverPath, options.RAMoptions);
		if (!launchRes.success) {
			await stopServer({ shouldUpload: false, folderId: options.folderId }, sendProgress);
			win?.webContents.send("server-stopped");
			return {
				success: false, 
				error: launchRes.error
			}
		}
		serverProcess = launchRes.process!

		// Stream server output to renderer
		win?.webContents.send("server-started");
		serverProcess.stdout?.on("data", (data) => {
			const text = data.toString();

			// Parse player list silently
			const listMatch = text.match(/There are \d+ of a max of \d+ players online: ?(.*)/);
			if (listMatch) {
				currentPlayers = listMatch[1] ? listMatch[1].split(", ").filter(Boolean) : [];
			} else {
				// Only forward to console if it's not the list response
				win?.webContents.send("server-output", text);
			}
		});
		serverProcess.stderr?.on("data", (data) => {
			win?.webContents.send("server-output", data.toString());
		});
		serverProcess.on("close", (code) => {
			win?.webContents.send("server-output", `\n[System] Server exited with code ${code}\n`);
			win?.webContents.send("server-stopped");
		});
	}

    
    // Stream playit.gg link to renderer if enabled
    if (options.checklist.playitgg && result.playitggProcess) {
        result.playitggProcess.stdout?.on("data", (data) => {
            const text = data.toString("utf-8").replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
            const match = text.match(/([a-zA-Z0-9.-]+\.joinmc\.link)\s*=>/);
            if (match) 
				win?.webContents.send("playitgg-link", match[1]);
        });
    }

    // Start heartbeat
    currentHostingServerId = options.folderId;

    heartbeatInterval = setInterval(async () => {
        const res = await updateLockFile(options.folderId, "online", currentPlayers);
		if(res.success)
			win?.webContents.send("lock-updated", res.lockData)
		serverProcess?.stdin?.write("list\n");
    }, 20000);

	win?.webContents.send("hide-progress");

    return { success: true, lockStatus: result.lockData };
});

ipcMain.handle("get-current-players", ()=>{
	return currentPlayers;
})

ipcMain.handle("stop-server", async () => {

	win?.webContents.send("show-progress");
	const playitggProcess = getPlayitggProcess()

	if(!currentHostingServerId)
		return {
			success: false,
			error: "Server is not running."
		}

	if(playitggProcess){
		sendProgress("Closing down the playitgg client.", "loading", "major")
		killPlayitgg()
		sendProgress("Finished closing the playitgg client.", "done", "major")
	}
	sendProgress("Closing down the server console.", "loading", "major")
	killServer()
	sendProgress("Finished closing down the server console.", "done", "major")

    clearInterval(heartbeatInterval!);

	const shouldUpload = getLocalVariable("checklist").upload

	const stopRes = await stopServer({ shouldUpload: shouldUpload, folderId: currentHostingServerId }, sendProgress);
    heartbeatInterval = null;
    currentHostingServerId = null;
	currentPlayers = [];
	win?.webContents.send("hide-progress");

	if(!stopRes.success){
		return {
			success: false,
			error: stopRes.error
		}
	}
    return {
		success: true,
		lockData: stopRes
	}
});

ipcMain.handle("send-server-command", (_, command: string) => {
	const serverProcess = getServerProcess();
    if (!serverProcess)
        return { success: false, error: "Server is not running." };

    serverProcess.stdin?.write(command + "\n");

    return { success: true };
});

ipcMain.handle("is-server-running", ()=>{
	return currentHostingServerId;
})

ipcMain.handle("drive-create-server", async () => {
	return await createServerFolder();
});

ipcMain.handle('drive-delete-server', async (_event, folderId) => {
	return await deleteServerFolder(folderId);
})

ipcMain.handle("drive-get-root", async () => {
	return await getRootWithContents();
})

ipcMain.handle("choose-file-directory", async () => {
	const result = await dialog.showOpenDialog({ properties: ["openFile"] })

	if (result.canceled) return null;

	const filePath = result.filePaths[0];

	return filePath;
})

ipcMain.handle("set-server-path", async (_, serverId) => {
	const result = await dialog.showOpenDialog({ properties: ["openDirectory"] })

	if (result.canceled) return null

	setServerPath(serverId, result.filePaths[0])

	return result.filePaths[0]
})

ipcMain.handle("get-server-path", (_, serverId) => {
	return getServerPath(serverId)
})

ipcMain.handle("get-max-players", (_, serverPath) => {
	return getMaxPlayers(serverPath)
})

ipcMain.handle("sync-server", async (_, serverId) => {
	return await syncServer(serverId, sendProgress)
})

ipcMain.handle("upload-server-folder", async (_, serverId) => {
	return await uploadServerFolder(serverId, sendProgress);
})

ipcMain.handle("drive-invite-user", async (_, serverId, email, message?) => {
	return await inviteUserToServer(serverId, email, message);
});

ipcMain.handle("drive-remove-permission", async (_, serverId, permissionId, isOwner) => {
	return await removeUserPermission(serverId, permissionId, isOwner);
});

ipcMain.handle("join-by-id", async (_, folderId) => {
	return await joinServerById(folderId);
})

ipcMain.handle("get-joined-folders", async () => {
	return await getJoinedServers();
})

ipcMain.handle("open-external-link", async (_, url: string) => {
	await shell.openExternal(url);
});

ipcMain.handle("is-request-allowed", (): boolean => {
	return isRequestAllowed();
})

ipcMain.handle("request-drive-scope", async () => {
	return await requestDriveScope();
});

ipcMain.handle("rename-server", async (_, folderId, newName) => {
	return await renameServerFolder(folderId, newName);
});

ipcMain.handle("get-server-lock", async (_, folderId) => {
	return await getServerLock(folderId);
});

ipcMain.handle("get-local-variable", async (_, variable: keyof ILocalVariables) => {
    return getLocalVariable(variable);
});

ipcMain.handle("set-local-variable", async (_, variable: keyof ILocalVariables, value: ILocalVariables[typeof variable]) => {
    setLocalVariable(variable, value);
    return true;
});

app.whenReady().then(createWindow)
