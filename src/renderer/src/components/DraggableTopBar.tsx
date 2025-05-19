import { FiMinus } from 'react-icons/fi'
import { AiOutlineShrink } from 'react-icons/ai'
import { useEffect, useState } from 'react'
export default function DraggableTopBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    const unSub = window.context.subToWindowMaximized(setIsMaximized)
    return unSub
  }, [])

  return (
    <header
      className={`insect-0 drag absolute z-100 flex h-8 w-full items-center ${window.context.platform !== 'darwin' ? 'justify-end' : 'justify-start'} rounded-lg bg-transparent`}
    >
      {window.context.platform !== 'darwin' ? (
        <div className="flex h-full">
          <button
            onClick={() => window.context.windowAction('CLOSE')}
            className="order-3 box-border flex h-full w-[50px] items-center justify-center px-4 py-1 hover:cursor-pointer hover:bg-red-800"
          >
            &#10005;
          </button>
          <button
            onClick={() => window.context.windowAction('MAXIMIZE')}
            className="order-2 box-border flex h-full w-[50px] items-center justify-center px-4 py-1 hover:cursor-pointer hover:bg-gray-500"
          >
            {isMaximized ? <AiOutlineShrink /> : <>&#9974;</>}
          </button>
          <button
            onClick={() => window.context.windowAction('MINIMIZE')}
            className="order-1 box-border flex h-full w-[50px] items-center justify-center px-4 py-1 hover:cursor-pointer hover:bg-gray-500"
          >
            <FiMinus strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div className="flex h-full items-center gap-3 px-2">
          <button
            onClick={() => window.context.windowAction('CLOSE')}
            className="box-border flex aspect-square h-[12px] w-[12px] items-center justify-center rounded-full bg-red-600 hover:cursor-pointer"
          ></button>
          <button
            onClick={() => window.context.windowAction('MINIMIZE')}
            className="box-border flex aspect-square h-[12px] w-[12px] items-center justify-center rounded-full bg-yellow-600 hover:cursor-pointer"
          ></button>
          <button
            onClick={() => window.context.windowAction('MAXIMIZE')}
            className="box-border flex aspect-square h-[12px] w-[12px] items-center justify-center rounded-full bg-green-600 hover:cursor-pointer"
          ></button>
        </div>
      )}
    </header>
  )
}
