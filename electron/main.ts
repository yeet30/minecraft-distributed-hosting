import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { loginWithGoogle, getUserInfo, isAlreadyLoggedIn, logoutGoogle } from './services/googleAuthService'
import { createServerFolder, deleteServerFolder,getRootWithContents,syncServer, uploadServerFolder } from './services/googleDriveService'
import { getServerPath, setServerPath } from './services/localServerStore'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

function createWindow() {
  win = new BrowserWindow({
    resizable: false,
    width: 800,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

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
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle("google-login", async () => {
  const result = await loginWithGoogle();
  return result;
});

ipcMain.handle("google-get-user", async () => {
  return await getUserInfo();
});

ipcMain.handle("google-is-logged-in", () => {
  return isAlreadyLoggedIn();
})

ipcMain.handle("google-logout", async () => {
  return await logoutGoogle();
})

ipcMain.handle("drive-create-server", async () => {
  return await createServerFolder();
});

ipcMain.handle('drive-delete-server', async(_event, folderId) => {
  return await deleteServerFolder(folderId);
})

ipcMain.handle("drive-get-root", async ()=> {
  return await getRootWithContents();
})

ipcMain.handle("choose-directory", async () => {
  const results = await dialog.showOpenDialog({properties: ["openDirectory"]})

  if (results.canceled || results.filePaths.length===0) return null

  return results.filePaths[0];
})

ipcMain.handle("set-server-path", async (_,serverId)=> {
  const result = await dialog.showOpenDialog({properties:["openDirectory"]})

  if(result.canceled) return null

  setServerPath(serverId,result.filePaths[0])

  return result.filePaths[0]
})

ipcMain.handle("get-server-path", async (_,serverId)=> {
  return getServerPath(serverId)
})

ipcMain.handle("sync-server", async(_, serverId) => {
  return await syncServer(serverId)
})

ipcMain.handle("upload-server-folder", async (_, serverId) => {
    return await uploadServerFolder(serverId);
})

app.whenReady().then(createWindow)
