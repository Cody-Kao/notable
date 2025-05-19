import { MDXEditorMethods } from '@mdxeditor/editor'
import {
  isAutoSavedAtom,
  refreshNotesAtom,
  saveNoteAtom,
  selectedNoteAtom
} from '@renderer/store/state'
import { NoteContent } from '@shared/Types'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRef } from 'react'
import { throttle } from 'lodash'
import { autoSaveInterval } from '@shared/consts'
import { notification } from '@renderer/utils/utils'

export const useMarkdownEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const [isAutoSaved, setIsAutoSaved] = useAtom(isAutoSavedAtom)
  const markdownEditorRef = useRef<MDXEditorMethods>(null)
  const [_, refresh] = useAtom(refreshNotesAtom)
  const autoSave = throttle(
    async (newContent: NoteContent) => {
      if (!selectedNote || !('content' in selectedNote)) return
      console.log('enter autoSave')
      // Skip save if content hasn't changed
      if (newContent === selectedNote.content) return

      console.log(selectedNote.title, 'auto saving...')
      const isSuccessful = await saveNote(newContent)
      setIsAutoSaved(isSuccessful)
      if (!isSuccessful) {
        refresh()
        notification('儲存錯誤', '無法儲存已遺失或刪除的檔案') // 但這其實不容易發生，因為寫入也可以直接創造檔案再寫入
      }
    },
    autoSaveInterval,
    { leading: false, trailing: true }
  )

  const manualSave = async () => {
    if (!selectedNote) return
    autoSave.cancel()
    const newContent = markdownEditorRef.current?.getMarkdown()
    if (newContent === undefined) return

    if (newContent === selectedNote.content) return
    const isSuccessful = await saveNote(newContent)
    setIsAutoSaved(isSuccessful)
    if (!isSuccessful) {
      refresh()
      notification('儲存錯誤', '無法儲存已遺失或刪除的檔案') // 但這其實不容易發生，因為寫入也可以直接創造檔案再寫入
    }
  }

  // 如果跳去其他檔案，就直接儲存當前的檔案
  const saveOnBlur = async () => {
    if (!selectedNote) return
    autoSave.cancel()

    const content = markdownEditorRef.current?.getMarkdown()
    if (content === undefined) return

    // Avoid saving if content hasn't changed
    if ('content' in selectedNote && content === selectedNote.content) return

    const isSuccessful = await saveNote(content)
    setIsAutoSaved(isSuccessful)
    if (!isSuccessful) {
      refresh()
      notification('儲存錯誤', '無法儲存已遺失或刪除的檔案') // 但這其實不容易發生，因為寫入也可以直接創造檔案再寫入
    }
  }

  return {
    markdownEditorRef,
    selectedNote,
    autoSave,
    isAutoSaved,
    setIsAutoSaved,
    manualSave,
    saveOnBlur
  }
}
