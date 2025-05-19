export type NoteInfo = {
  title: string
  lastEditTime: number
}
export type Settings = {
  path: string
  tool_bar: boolean
}
export type ReadSettings = () => Promise<Settings | null>
export type UpdateSettings = (newSettings: Partial<Settings>) => Promise<boolean>
export type ChangeNotesPath = () => Promise<string | null>

export type NoteContent = string
export type GetNotes = () => Promise<NoteInfo[]>
export type ReadNote = (fileName: NoteInfo['title']) => Promise<NoteContent | null>
export type WriteNote = (fileName: string, newContent: NoteContent) => Promise<boolean>
export type CreateNote = () => Promise<string | false>
export type DeleteNote = (fileName: NoteInfo['title']) => Promise<boolean>
export type ExportNote = (fileName: NoteInfo['title']) => Promise<boolean | null>

export type WindowActions = 'CLOSE' | 'MINIMIZE' | 'MAXIMIZE'
export type WindowActionFunc = (action: WindowActions) => void
