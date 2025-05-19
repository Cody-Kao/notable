import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { nativeImage } from 'electron'
import {
  createNote,
  getNotes,
  readNote,
  writeNote,
  deleteNote,
  handleWindowAction,
  exportNote,
  readSettings,
  updateSettings,
  changeNotesPath
} from './lib/lib'
import {
  CreateNote,
  DeleteNote,
  ExportNote,
  GetNotes,
  ReadNote,
  UpdateSettings,
  WindowActions,
  WriteNote
} from '@shared/Types'

if (process.platform === 'win32') {
  app.setAppUserModelId('com.notable.app')
}
const appIcon = nativeImage.createFromPath(icon)

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    center: true,
    backgroundMaterial: 'acrylic', // on Windows 11
    title: 'NoteMarkDown',
    frame: false,
    vibrancy: 'under-window', // or 'sidebar', 'ultra-dark', etc.
    visualEffectState: 'active',
    titleBarStyle: 'hiddenInset', // usually better with vibrancy
    icon: appIcon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 針對settings.json的事件監聽
  ipcMain.handle('readSettings', () => readSettings())
  ipcMain.handle('updateSettings', (_, ...args: Parameters<UpdateSettings>) =>
    updateSettings(...args)
  )
  ipcMain.handle('changeNotesPath', () => changeNotesPath())

  // 取得視窗
  const mainWindow = createWindow()
  // ipcMain操作視窗
  ipcMain.on('window', (_, action: WindowActions) => handleWindowAction(mainWindow, action))
  // 視窗監聽
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:maximized', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:maximized', false)
  })

  // Detect manual resize or snap and emit correct state
  // to prevent over-sending, just memoize the last value, only sends when it changes
  let lastMaximized = mainWindow.isMaximized()
  mainWindow.on('resize', () => {
    const isNowMaximized = mainWindow.isMaximized()
    if (isNowMaximized !== lastMaximized) {
      mainWindow.webContents.send('window:maximized', isNowMaximized)
      lastMaximized = isNowMaximized
    }
  })

  // 對筆記的操作
  ipcMain.handle('getNotes', (_, ...args: Parameters<GetNotes>) => getNotes(...args))
  ipcMain.handle('readNote', (_, ...args: Parameters<ReadNote>) => readNote(...args))
  ipcMain.handle('writeNote', (_, ...args: Parameters<WriteNote>) => writeNote(...args))
  ipcMain.handle('createNote', (_, ...args: Parameters<CreateNote>) => createNote(...args))
  ipcMain.handle('deleteNote', (_, ...args: Parameters<DeleteNote>) => deleteNote(...args))
  ipcMain.handle('exportNote', (_, ...args: Parameters<ExportNote>) => exportNote(...args))

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
