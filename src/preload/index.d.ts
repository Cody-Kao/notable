import { ElectronAPI } from '@electron-toolkit/preload'
import {
  ReadSettings,
  GetNotes,
  ReadNotes,
  WriteNote,
  CreateNote,
  DeleteNote,
  ExportNote,
  WindowActionFunc,
  UpdateSettings,
  ChangeNotesPath
} from '@shared/Types'
// define types used in the preload.ts
declare global {
  interface Window {
    context: {
      locale: string
      platform: string
      readSettings: ReadSettings
      updateSettings: UpdateSettings
      changeNotesPath: ChangeNotesPath
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createNote: CreateNote
      deleteNote: DeleteNote
      exportNote: ExportNote
      windowAction: WindowActionFunc
      subToWindowMaximized: (callback: (isMaximized: boolean) => void) => () => void
    }
  }
}
