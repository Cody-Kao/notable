import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { GoGear } from 'react-icons/go'
import { useAtomValue, useSetAtom } from 'jotai'
import { readWriteSettingsAtom, refreshNotesAtom, toolBarAtom } from '@renderer/store/state'
import { notification } from '@renderer/utils/utils'
import { FaRegQuestionCircle } from 'react-icons/fa'

export default function SideBar({ className, children, ...props }: ComponentProps<'aside'>) {
  const toolbarToggle = useAtomValue(toolBarAtom)
  const setSettings = useSetAtom(readWriteSettingsAtom)
  const refresh = useSetAtom(refreshNotesAtom)
  return (
    <aside
      className={twMerge(
        'relative flex h-[calc(100vh)] w-[30%] max-w-[300px] flex-col', // Changed height and added flex
        className
      )}
      {...props}
    >
      <button className="absolute top-[10px] right-[10px] z-100 box-border flex aspect-square h-max items-center justify-center rounded-full text-gray-300 transition-all duration-200 after:invisible after:absolute after:top-[50%] after:right-[105%] after:w-max after:translate-y-[-50%] after:text-[.8rem] after:text-white after:opacity-0 after:transition-all after:duration-200 after:content-['查看教學'] hover:cursor-pointer hover:bg-gray-500 hover:after:visible hover:after:opacity-100">
        <FaRegQuestionCircle />
      </button>
      <div className="mt-10 flex flex-1 flex-col overflow-hidden">{children}</div>
      <div className="sticky bottom-0 z-100 flex h-[40px] w-full items-end justify-between py-1 text-gray-400">
        <div className="relative align-middle transition-all duration-200 after:invisible after:absolute after:top-[50%] after:left-[105%] after:w-max after:translate-y-[-50%] after:bg-black after:p-1 after:text-[.8rem] after:text-white after:opacity-0 after:transition-all after:duration-200 after:content-['變更筆記資料夾'] hover:cursor-pointer hover:text-gray-300 hover:after:visible hover:after:opacity-100">
          <GoGear
            onClick={async () => {
              const path = await window.context.changeNotesPath()
              if (!path) return
              const isSuccessful = await setSettings({ path: path })
              if (isSuccessful) {
                notification('系統通知', '筆記資料夾變更成功')
                refresh()
              } else {
                notification('系統錯誤', '無法更改筆記資料夾')
              }
            }}
            size={28}
          />
        </div>
        <label
          htmlFor="toggle-btn"
          className={`relative inline-block h-[26px] w-[50px] cursor-pointer after:absolute after:top-[-110%] after:left-1/2 after:w-max after:-translate-x-1/2 after:bg-black after:px-2 after:py-1 after:text-xs after:text-white after:opacity-0 after:transition-opacity after:duration-200 ${toolbarToggle ? "after:content-['隱藏置頂工具列']" : "after:content-['啟用置頂工具列']"} hover:after:opacity-100`}
        >
          <input
            id="toggle-btn"
            checked={toolbarToggle}
            onChange={async () => {
              const isSuccessful = await setSettings({ tool_bar: !toolbarToggle })
              if (isSuccessful) {
                notification('系統通知', 'ctrl/cmd + r或重新開啟以使用變更')
              } else {
                notification('系統錯誤', '無法更改設定')
              }
            }}
            type="checkbox"
            className="peer sr-only"
          />
          <div className="h-full w-full rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-green-800"></div>
          <div className="absolute top-[2px] left-[2px] h-[22px] w-[22px] rounded-full bg-white transition-transform duration-300 peer-checked:translate-x-[24px]"></div>
        </label>
      </div>
    </aside>
  )
}
