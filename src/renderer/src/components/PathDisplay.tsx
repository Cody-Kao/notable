import { pathAtom } from '@renderer/store/state'
import { useAtomValue } from 'jotai'

export default function PathDisplay() {
  const path = useAtomValue(pathAtom)
  return (
    <div className="flex w-full flex-col items-start truncate text-[.8rem] text-gray-300">
      <span>當前路徑:</span>
      <span title={path} className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {path}
      </span>
    </div>
  )
}
