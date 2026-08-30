import { cn } from '@/shared/lib/cn'

type ProgressBarProps = {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max = 100, className, showLabel }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-1.5 flex-1 bg-neutral-300">
        <div
          className="h-full bg-accent transition-all duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel ? <span className="text-kicker font-bold text-text">{value}%</span> : null}
    </div>
  )
}
