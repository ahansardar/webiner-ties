import { cn } from '@/lib/cn'

export function HeroCollage(props: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex min-h-[320px] flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[color:var(--stroke-strong)] bg-[color:var(--paper-muted)] p-8 text-center shadow-sm',
        props.className,
      )}
    >
      <span className="tv-display text-xs font-semibold tracking-wider text-[color:var(--ink-muted)]">
        WE CAN ADD SOME THEMED POSTER HERE.
      </span>
    </div>
  )
}

