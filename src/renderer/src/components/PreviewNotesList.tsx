import { ComponentProps } from 'react'
import PreviewNote from './PreviewNote'
import { twMerge } from 'tailwind-merge'
import { useNoteList } from '@renderer/hooks/useNoteList'
import { isEmpty } from 'lodash'

type PreviewNotesListProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}
export default function PreviewNotesList({ className, onSelect, ...props }: PreviewNotesListProps) {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNoteList({ onSelect })
  if (notes === undefined) return null

  if (isEmpty(notes)) {
    return (
      <ul className={twMerge('pt-4', className, 'items-center')} {...props}>
        尚無筆記
      </ul>
    )
  }
  return (
    <div className="flex-1 overflow-auto">
      {/* Removed fixed height */}
      <ul {...props}>
        {notes.map((note, index) => (
          <PreviewNote
            key={note.title}
            className={className}
            isActive={selectedNoteIndex === index}
            onClick={handleNoteSelect(index)}
            {...note}
          />
        ))}
      </ul>
    </div>
  )
}
