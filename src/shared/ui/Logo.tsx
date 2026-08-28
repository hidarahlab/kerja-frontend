import { cn } from '@/shared/lib/cn'

/** Wordmark "kerja" — kotak gelap berisi tiga garis + teks + balok aksen. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        aria-hidden
        className="flex size-7 shrink-0 flex-col justify-center gap-[3px] bg-text px-[5px]"
      >
        <span className="h-[3px] w-full bg-accent" />
        <span className="h-[3px] w-full bg-bg" />
        <span className="h-[3px] w-[60%] bg-bg" />
      </span>
      <span className="flex items-baseline gap-[3px]">
        <span className="text-[1.375rem] font-extrabold tracking-[-0.03em] leading-none">
          kerja
        </span>
        <span aria-hidden className="h-[0.9rem] w-[5px] bg-accent" />
      </span>
    </div>
  )
}
