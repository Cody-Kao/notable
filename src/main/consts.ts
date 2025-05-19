import { Settings } from '@shared/Types'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

export const settingsDir = app.getPath('userData')
export const settingsPath = join(settingsDir, 'settings.json')
export const defaultNotesFolder = join(settingsDir, 'notes')

export const defaultSettings: Settings = {
  path: defaultNotesFolder,
  tool_bar: false
}

// 初始化app的必要資料夾
try {
  // Create notes folder if missing
  if (!existsSync(defaultNotesFolder)) {
    mkdirSync(defaultNotesFolder, { recursive: true }) // more robust
  }

  // Create settings.json if missing
  if (!existsSync(settingsPath)) {
    writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), 'utf-8')
  }
} catch (err) {
  console.error('初始化錯誤:', err)
  new Notification('系統通知', { body: '創建初始化資料夾失敗' }) // no `window.` in Electron main process
  app.relaunch()
  app.exit(0) // make sure to exit after relaunching
}
