import { cn } from '@/shared/lib/cn'

type AvatarStackProps = {
  initials: string[]
  max?: number
  size?: 'sm' | 'md'
}

export function AvatarStack({ initials, max = 3, size = 'md' }: AvatarStackProps) {
  const shown = initials.slice(0, max)
  const hidden = Math.max(0, initials.length - max)

  const sizeClass = {
    sm: 'size-6 text-kicker',
    md: 'size-8 text-form',
  }[size]

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((initial) => (
        <div
          key={initial}
          className={cn(
            'flex items-center justify-center rounded-full bg-accent text-bg font-extrabold border border-bg',
            sizeClass,
          )}
        >
          {initial}
        </div>
      ))}
      {hidden > 0 ? (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-neutral-400 text-bg font-bold border border-bg',
            sizeClass,
          )}
        >
          +{hidden}
        </div>
      ) : null}
    </div>
  )
}
