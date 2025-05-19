import { useSetAtom } from 'jotai'
import ActionButton, { ActionButtonProps } from './ActionButton'
import { FaRegTrashCan } from 'react-icons/fa6'
import { deleteNoteAtom } from '@renderer/store/state'

export default function DeleteNotButton({ ...props }: ActionButtonProps) {
  const deleteNote = useSetAtom(deleteNoteAtom)

  const handleDelete = async () => {
    await deleteNote()
  }
  return (
    <ActionButton onClick={handleDelete} {...props}>
      <FaRegTrashCan className="h-6 w-6 text-zinc-300 hover:text-zinc-100" />
    </ActionButton>
  )
}
