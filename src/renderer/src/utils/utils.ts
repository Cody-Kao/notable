import { logoURL } from '@shared/consts'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

export const dateFormatter = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Asia/Taipei'
})

export const formatDateFromMS = (ms: number) => dateFormatter.format(ms)

export const notification = (title: string, body: string) => {
  new window.Notification(title, { body: body, icon: logoURL })
}
