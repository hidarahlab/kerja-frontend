import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'outline' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'border-2 border-text px-4 py-3 text-form font-extrabold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-700',
        'disabled:cursor-not-allowed disabled:opacity-55',
        variant === 'primary' && 'bg-accent text-bg hover:bg-accent-600',
        variant === 'outline' && 'bg-transparent text-text hover:bg-accent-100',
        variant === 'secondary' && 'bg-neutral-100 text-text hover:bg-neutral-200',
        className,
      )}
      {...props}
    />
  )
}
