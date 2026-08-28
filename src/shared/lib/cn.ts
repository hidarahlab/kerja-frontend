import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Gabungkan className dengan aman — clsx untuk kondisi, twMerge untuk konflik utility. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
