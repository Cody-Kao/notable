import { useSetAtom } from 'jotai'
import ActionButton, { ActionButtonProps } from './ActionButton'
import { FaRegFileWord } from 'react-icons/fa'
import { createEmptyNoteAtom } from '@renderer/store/state'
import { notification } from '@renderer/utils/utils'

export default function NewNoteButton({ ...props }: ActionButtonProps) {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom)

  const handleCreation = async () => {
    const isSuccessful = await createEmptyNote()
    if (!isSuccessful && isSuccessful !== null) {
      notification('創建錯誤', '新建筆記失敗')
    }
  }
  return (
    <ActionButton onClick={handleCreation} {...props}>
      <FaRegFileWord className="h-6 w-6 text-zinc-300 hover:text-zinc-100" />
    </ActionButton>
  )
}
