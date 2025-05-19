import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type ActionButtonProps = ComponentProps<'button'>

export default function ActionButton({ className, children, ...props }: ActionButtonProps) {
  return (
    <button
      className={twMerge(
        'rounded-md py-1 transition-colors duration-100 hover:cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
