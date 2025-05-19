import RootLayout from './components/RootLayout'
import SideBar from './components/SideBar'
import { Content } from './components/Content'
import DraggableTopBar from './components/DraggableTopBar'
import ActionButtonsRow from './components/ActionButtonsRow'
import PreviewNotesList from './components/PreviewNotesList'
import MarkdownEditor from './components/MarkdownEditor'
import NoteTitle from './components/NoteTitle'
import { ErrorBoundary } from 'react-error-boundary'
import { useEffect, useRef } from 'react'
import ErrorPage from './components/ErrorPage'
import PathDisplay from './components/PathDisplay'
import { useAtom } from 'jotai'
import { initSettingsAtom } from './store/state'

export interface test {}
function App(): React.JSX.Element {
  // 切換note時候重製scroll到最上面
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    if (!contentContainerRef.current) return
    contentContainerRef.current.scrollTo(0, 0)
  }

  const [_, init] = useAtom(initSettingsAtom)
  useEffect(() => {
    init()
  }, [])
  // ctrl + r 會自帶reload app的效果
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <SideBar className="relative p-2">
            <ActionButtonsRow className="z-10 mt-1 flex justify-between rounded-lg pb-2" />
            <PathDisplay />
            <PreviewNotesList
              className="mt-3 flex min-h-0 w-full flex-1 flex-col items-start justify-center gap-4 overflow-auto"
              onSelect={resetScroll}
            />
          </SideBar>
        </ErrorBoundary>
        <Content className="border-l border-l-white/20 bg-zinc-900/50">
          <ErrorBoundary FallbackComponent={ErrorPage}>
            <NoteTitle className="pt-2" />
            <MarkdownEditor />
          </ErrorBoundary>
        </Content>
      </RootLayout>
    </>
  )
}

export default App
