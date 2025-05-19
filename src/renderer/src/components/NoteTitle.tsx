import { selectedNoteAtom } from '@renderer/store/state'
import { useAtomValue } from 'jotai'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export default function NoteTitle({ className, ...props }: ComponentProps<'div'>) {
  const selectedNote = useAtomValue(selectedNoteAtom)
  if (!selectedNote) return ''
  return (
    <div className={twMerge('mb-2 flex justify-center px-2 text-center', className)} {...props}>
      <span className="text-gray-400">{selectedNote.title}</span>
    </div>
  )
}
