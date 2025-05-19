import { ComponentProps } from 'react'
import NewNoteButton from './Buttons/NewNoteButton'
import DeleteNotButton from './Buttons/DeleteNoteButton'

export default function ActionButtonsRow({ ...props }: ComponentProps<'div'>) {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNotButton />
    </div>
  )
}
