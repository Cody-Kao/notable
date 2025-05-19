import { BrowserWindow, dialog } from 'electron'
import { fileEncoding, welcomeNoteFileName } from '../../shared/consts'
import {
  ChangeNotesPath,
  CreateNote,
  DeleteNote,
  ExportNote,
  GetNotes,
  NoteContent,
  NoteInfo,
  ReadNote,
  Settings,
  WindowActions,
  WriteNote
} from '@shared/Types'
import { readFile, remove, writeFile } from 'fs-extra'
import { ensureDir, readdir, stat } from 'fs-extra'
import { homedir } from 'os'
import path, { join } from 'path'
import { isEmpty } from 'lodash'
import welcomeNotePath from '../../../resources/welcomeNote.md?asset' // 加上asset 讓該import變成path string
import { settingsPath, defaultSettings, defaultNotesFolder } from '../consts'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import removeMd from 'remove-markdown'

// 取得notePath
const getNotesPath = () => {
  // 讀取settings並找出對應的path
  const data = readFileSync(settingsPath, fileEncoding)
  const settings = JSON.parse(data) as Settings
  if ('path' in settings) {
    return settings.path
  }
  return defaultNotesFolder
}

// 操控window
export const handleWindowAction = (window: BrowserWindow, windowAction: WindowActions) => {
  switch (windowAction) {
    case 'CLOSE':
      window.close()
      break
    case 'MINIMIZE':
      window.minimize()
      break
    case 'MAXIMIZE':
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
      break
    default:
      return
  }
}

// 讀取settings.json
export const readSettings = async (): Promise<Settings | null> => {
  try {
    if (!existsSync(settingsPath)) {
      writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), fileEncoding)
      return defaultSettings
    }
    const data = await readFile(settingsPath, fileEncoding)
    const settings = JSON.parse(data) as Settings
    return settings
  } catch (error) {
    console.error(error)
    return null
  }
}

// 更改settings.json
export const updateSettings = async (newSettings: Partial<Settings>) => {
  try {
    const data = await readFile(settingsPath, fileEncoding)
    const settings = JSON.parse(data) as Settings
    const updatedSettings = { ...settings, ...newSettings }
    writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2), fileEncoding)
  } catch (error) {
    console.error('error in updateSettings:', error)
    return false
  }

  return true
}

// 選擇更改notes的路徑
export const changeNotesPath: ChangeNotesPath = async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: '選擇筆記資料夾',
    properties: ['openDirectory'],
    defaultPath: getNotesPath()
  })
  const path = filePaths.pop()
  if (canceled || path === undefined) {
    return null
  }
  return path
}

// 操控筆記
export const getNotes: GetNotes = async () => {
  await ensureDir(getNotesPath())

  const notesFileNames = await readdir(getNotesPath(), {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  // 如果一開始載入notes為空時，就新建welcome note
  if (isEmpty(notes)) {
    // 讀取
    try {
      const content = await readFile(welcomeNotePath, { encoding: fileEncoding })
      // 寫入
      await writeFile(join(getNotesPath(), welcomeNoteFileName), content, {
        encoding: fileEncoding
      })
    } catch (error) {
      console.error('初始化筆記發生錯誤:', error)
      return []
    }

    notes.push(welcomeNoteFileName) // 加入到notes array中
  }

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(join(getNotesPath(), filename))

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (fileName: string) => {
  try {
    const content = await readFile(join(getNotesPath(), `${fileName}.md`), {
      encoding: fileEncoding
    })
    return content
  } catch (error) {
    return null
  }
}

export const writeNote: WriteNote = async (fileName: string, newContent: NoteContent) => {
  try {
    await writeFile(join(getNotesPath(), `${fileName}.md`), newContent, { encoding: fileEncoding })
  } catch (error) {
    console.error('writeNote error', error)
    return false
  }

  return true
}

export const createNote: CreateNote = async () => {
  await ensureDir(getNotesPath())

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: '未命名',
    defaultPath: `${getNotesPath()}/未命名.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info('Note creation canceled')
    return ''
  }

  const { name: filename, dir: _ } = path.parse(filePath)

  /* if (parentDir !== getNotesPath()) {
    await dialog.showMessageBox({
      type: 'error',
      title: '創建失敗',
      message: `檔案必須儲存於以下路徑 ${getNotesPath()}`
    })

    return false
  } */

  console.info(`Creating note: ${filePath}`)
  try {
    await writeFile(filePath, '')
  } catch (error) {
    console.log('error when creating file', error)
    return false
  }

  return filename
}

export const deleteNote: DeleteNote = async (fileName: NoteInfo['title']) => {
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: '刪除筆記',
    message: `確認刪除 ${fileName}?`,
    buttons: ['確認', '取消'], // 0 is 確認, 1 is 取消
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Note deletion canceled')
    return false
  }

  console.info(`Deleting note: ${fileName}`)
  await remove(`${getNotesPath()}/${fileName}.md`)
  return true
}

export const exportNote: ExportNote = async (fileName: NoteInfo['title']) => {
  console.log('file name is:', fileName)
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: '選擇儲存位置',
    defaultPath: join(homedir(), 'Desktop', `${fileName}`),
    filters: [{ name: 'Text', extensions: ['txt'] }]
  })
  if (canceled) return null
  if (filePath === undefined) return false

  try {
    const content = await readFile(join(getNotesPath(), `${fileName}.md`), {
      encoding: fileEncoding
    })
    await writeFile(
      join(filePath),
      removeMd(content, {
        stripListLeaders: false, // set to false to retain leading dots or number for lists
        useImgAltText: true // replace images with alt-text, if present (default: true)
      })
    )
    return true
  } catch (error) {
    console.error('Failed to export note:', error)
    return false
  }
}
