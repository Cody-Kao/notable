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
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    platform: process.platform,
    readSettings: () => ipcRenderer.invoke('readSettings'),
    updateSettings: (...args: Parameters<UpdateSettings>) =>
      ipcRenderer.invoke('updateSettings', ...args),
    changeNotesPath: () => ipcRenderer.invoke('changeNotesPath'),
    // automatically spread the required parameters of that function in <>, so no need to manually type
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args),
    exportNote: (...args: Parameters<ExportNote>) => ipcRenderer.invoke('exportNote', ...args),
    windowAction: (action: WindowActions) => ipcRenderer.send('window', action),
    subToWindowMaximized: (callback: (isMaximized: boolean) => void): (() => void) => {
      const cb = (_: Electron.IpcRendererEvent, isMaximized: boolean) => callback(isMaximized)
      ipcRenderer.on('window:maximized', cb)
      return () => ipcRenderer.off('window:maximized', cb)
    }
  })
} catch (error) {
  console.log(error)
}
