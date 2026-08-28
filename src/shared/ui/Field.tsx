import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="eyebrow text-text">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-kicker font-bold text-accent-800">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full border-2 border-text bg-white px-3 py-2.5 text-form text-text',
        'placeholder:text-neutral-500',
        'focus:outline-2 focus:outline-offset-0 focus:outline-accent',
        'aria-[invalid=true]:border-accent-800',
        className,
      )}
      {...props}
    />
  )
}
