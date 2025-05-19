import { NoteInfo } from '@shared/Types'
import { ComponentProps } from 'react'
import { CiExport } from 'react-icons/ci'
import { cn, formatDateFromMS } from '../utils/utils'

export type PreviewNoteProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

export default function PreviewNote({
  title,
  content,
  lastEditTime,
  isActive = false,
  className,
  ...props
}: PreviewNoteProps) {
  return (
    <div
      className={cn(
        'w-full cursor-pointer rounded-md px-2.5 pt-3 pb-2 transition-colors duration-100',
        {
          'bg-zinc-400/75': isActive,
          'hover:bg-zinc-500/75': !isActive
        },
        className
      )}
      {...props}
    >
      <h3 title={title} className="mb-4 w-full truncate font-bold">
        {title}
      </h3>
      <div className="relative flex w-full items-center justify-between">
        <span className="inline-block h-full text-xs font-light">
          {formatDateFromMS(lastEditTime)}
        </span>
        <button
          onClick={async (e) => {
            e.stopPropagation()
            const isSuccessful = await window.context.exportNote(title)
            if (isSuccessful) {
              new window.Notification('通知', { body: '文件已成功創建!' })
            } else if (isSuccessful === false) {
              new window.Notification('通知', { body: '文件創建失敗!' })
            }
          }}
          className="relative after:invisible after:absolute after:top-[-110%] after:left-[50%] after:z-50 after:w-max after:translate-x-[-50%] after:rounded-lg after:bg-white after:px-2 after:py-1 after:text-[.8rem] after:text-black after:opacity-0 after:transition-all after:duration-200 after:content-['匯出'] hover:cursor-pointer hover:after:visible hover:after:opacity-100"
        >
          <CiExport size={24} />
        </button>
      </div>
    </div>
  )
}
