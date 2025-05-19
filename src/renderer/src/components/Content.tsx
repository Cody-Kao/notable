import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { selectedNoteIndexAtom } from '@renderer/store/state'
import { useAtomValue } from 'jotai'
import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, children, ...props }, ref) => {
    const selectedIndex = useAtomValue(selectedNoteIndexAtom)
    const { isAutoSaved } = useMarkdownEditor()
    return (
      <div
        ref={ref}
        className={twMerge('relative flex h-screen w-full flex-col pt-[32px]', className)}
        {...props}
      >
        {children}
        {selectedIndex !== null && (
          <div className="sticky bottom-0 left-0 flex h-max w-full items-center justify-between px-8 font-light text-gray-400">
            <span>{isAutoSaved ? '' : 'ctrl/cmd + s以手動儲存'}</span>
            <span>{isAutoSaved ? '已儲存 ✓' : '未儲存...'}</span>
          </div>
        )}
      </div>
    )
  }
)

Content.displayName = 'Content'
