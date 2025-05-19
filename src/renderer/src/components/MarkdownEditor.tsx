import {
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  linkDialogPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  thematicBreakPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertCodeBlock,
  InsertThematicBreak,
  InsertTable,
  InsertImage,
  ListsToggle,
  Separator,
  StrikeThroughSupSubToggles,
  tablePlugin,
  imagePlugin
} from '@mdxeditor/editor'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { refreshNotesAtom, toolBarAtom } from '@renderer/store/state'
import { notification } from '@renderer/utils/utils'
import { supportedLanguages } from '@shared/consts'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import '@mdxeditor/editor/style.css'

export default function MarkdownEditor() {
  const { markdownEditorRef, selectedNote, autoSave, setIsAutoSaved, manualSave, saveOnBlur } =
    useMarkdownEditor()
  const [isContentEmpty, setIsContentEmpty] = useState(true)
  const [_, refresh] = useAtom(refreshNotesAtom)
  const toolbarToggle = useAtomValue(toolBarAtom)
  useEffect(() => {
    if (markdownEditorRef.current === null) return
    setIsContentEmpty(markdownEditorRef.current.getMarkdown() === '')
  }, [selectedNote])

  useEffect(() => {
    const handleManualSave = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        console.log('manual save')
        await manualSave()
      }
    }
    window.addEventListener('keydown', handleManualSave)

    return () => window.removeEventListener('keydown', handleManualSave)
  }, [])

  if (selectedNote === null) return null

  // 如果read到一個沒辦法讀出來的note(比方說被刪除了)，這時候note會是null，則觸發重新讀取所有notes，更新sidebar
  if (selectedNote === undefined) {
    refresh()
    notification('讀取錯誤', '無法開啟已刪除或遺失的檔案')
    return null
  }

  return (
    <div className="relative flex h-[calc(100vh-32px)] w-full flex-1 flex-col overflow-auto">
      <div className="mdx relative w-full flex-1 overflow-auto">
        {/* Scrollable area */}
        <MDXEditor
          ref={markdownEditorRef}
          key={selectedNote.title}
          onChange={(newContent) => {
            autoSave(newContent)
            setIsAutoSaved(false)
            setIsContentEmpty(newContent === '')
          }}
          onBlur={saveOnBlur}
          markdown={'content' in selectedNote ? selectedNote.content : ''}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            thematicBreakPlugin(),
            tablePlugin(),
            imagePlugin(),
            codeBlockPlugin({
              codeBlockEditorDescriptors: [
                {
                  match: (lang) => (lang || '') in supportedLanguages === false,
                  Editor: ({ language }) => (
                    <pre className="w-full text-wrap" style={{ background: '#b3b004' }}>
                      <span className="text-white">編輯器不支援{language} 目前僅支援:</span>
                      <br />
                      <span className="text-white">
                        {Object.keys(supportedLanguages).map((language, _) => language + ', ')}
                      </span>
                      <br />
                      <span className="text-white">切換至Source Mode刪除此區塊以復原</span>
                      <br />
                      <span className="text-white">若無顯示置頂工具列請於左下角開啟</span>
                    </pre>
                  ),
                  priority: 0
                }
              ],
              defaultCodeBlockLanguage: 'text'
            }),
            ...(toolbarToggle
              ? [
                  toolbarPlugin({
                    toolbarContents: () => (
                      <DiffSourceToggleWrapper>
                        <BoldItalicUnderlineToggles />
                        <CreateLink />
                        <StrikeThroughSupSubToggles />
                        <InsertCodeBlock />
                        <InsertThematicBreak />
                        <InsertTable />
                        <InsertImage />
                        <ListsToggle />
                        <Separator />
                      </DiffSourceToggleWrapper>
                    )
                  })
                ]
              : []),
            codeMirrorPlugin({ codeBlockLanguages: supportedLanguages }),
            markdownShortcutPlugin(),
            diffSourcePlugin({
              diffMarkdown: markdownEditorRef.current?.getMarkdown(),
              viewMode: 'rich-text'
            })
          ]}
          contentEditableClassName="
            outline-none min-h-full w-full text-lg caret-[#f5c802] font-mono max-w-full
            prose-span:text-white prose-hr:h-[2px] prose-hr:bg-white prose-p:text-gray-200 prose-p:text-[1.2rem]
            prose prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4
            prose-blockquote:my-4 prose-blockquote:text-white prose-blockquote:dark:text-white
            prose-blockquote:border-white prose-blockquote:font-bold 
            prose-a:text-blue-400 prose-a:hover:cursor-pointer
            prose-ul:my-1 prose-ul:marker:text-gray-300 prose-li:marker:text-gray-400
            prose-li:text-gray-200 prose-li:my-0 
            prose-code:text-amber-700 prose-code:before:content-[''] prose-code:after:content-['']
            prose-code:bg-transparent prose-code:text-[1.2rem] prose-code:p-0"
        />
        {/* 手刻placeholder，因為原生的很奇怪 */}
        {isContentEmpty && (
          <span
            className={`pointer-events-none absolute top-0 left-0 px-3 ${toolbarToggle ? 'py-18' : 'py-7'} text-gray-300`}
          >
            請輸入...
          </span>
        )}
      </div>
    </div>
  )
}
