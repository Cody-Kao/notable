import { notification } from '@renderer/utils/utils'
import { NoteContent, NoteInfo, Settings } from '@shared/Types'
import { atom } from 'jotai'
import { selectAtom, unwrap } from 'jotai/utils'

// 管理settings的state
export const initSettingsAtom = atom(null, async (_, set) => {
  const settings = await window.context.readSettings()
  if (settings === null) {
    notification('系統錯誤', '系統初始化錯誤 請重新啟動')
    set(settingsAtom, {
      path: '未知路徑',
      tool_bar: false
    })
  } else {
    set(settingsAtom, settings)
  }
})

export const settingsAtom = atom<Settings | null>(null)

export const readWriteSettingsAtom = atom(
  (get) => get(settingsAtom),
  async (get, set, updates: Partial<Settings>) => {
    const currentSettings = get(settingsAtom)
    if (!currentSettings) return false

    const updatedSettings = { ...currentSettings, ...updates }

    const isSuccessful = await window.context.updateSettings(updatedSettings)
    if (!isSuccessful) return false
    console.log('change:', { updatedSettings })
    set(settingsAtom, updatedSettings)
    return true
  }
)

export const pathAtom = selectAtom(settingsAtom, (settings) =>
  settings ? settings.path : '未知路徑'
)

export const toolBarAtom = selectAtom(settingsAtom, (settings) =>
  settings ? settings.tool_bar : false
)

// global state for auto save or not
export const isAutoSavedAtom = atom(true)

// 筆記操作
const loadNotes = async () => {
  const notes = await window.context.getNotes()

  // sort them by most recently edited
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

// 重新抓取所有notes 並重設index為null
export const refreshNotesAtom = atom(null, async (_, set) => {
  const notes = await loadNotes()
  set(notesAtom, notes)
  set(selectedNoteIndexAtom, null)
})

export const selectedNoteIndexAtom = atom<number | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)
  if (selectedNoteIndex === null || notes === undefined) return null
  let index = selectedNoteIndex
  if (selectedNoteIndex >= notes.length) {
    index = 0
  }
  const selectedNote = notes[index]
  const noteContent = await window.context.readNote(selectedNote.title)
  if (noteContent === null) {
    return undefined // 未成功讀取到該note
  }
  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: '',
      content: '',
      lastEditTime: Date.now()
    }
)

export const createEmptyNoteAtom = atom(null, async (get, set): Promise<boolean | null> => {
  const notes = get(notesAtom)

  if (!notes) return false

  const title = await window.context.createNote()

  if (title === false) return false
  if (title === '') return null
  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now()
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

  set(selectedNoteIndexAtom, 0)

  return true
})

export const saveNoteAtom = atom(true, async (get, set, newContent: NoteContent) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return true

  // save on disk
  const isSuccessful = await (async (): Promise<boolean> => {
    try {
      await window.context.writeNote(selectedNote.title, newContent)
    } catch (err) {
      console.error('writeNote failed:', err)
      return false
    }
    return true
  })()
  if (!isSuccessful) return false
  // update the saved note's last edit time
  set(
    notesAtom,
    notes.map((note) => {
      // this is the note that we want to update
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: Date.now()
        }
      }

      return note
    })
  )

  return true
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const isDeleted = await window.context.deleteNote(selectedNote.title)

  if (!isDeleted) return

  // filter out the deleted note
  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  // reset selection of note
  set(selectedNoteIndexAtom, null)
})
