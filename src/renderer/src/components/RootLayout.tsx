import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export default function RootLayout({ className, children, ...props }: ComponentProps<'main'>) {
  return (
    <main className={twMerge('flex h-screen flex-row', className)} {...props}>
      {children}
    </main>
  )
}
