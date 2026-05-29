import { cn } from '@/lib/cn'

type Bubble = {
  name: string
  role: string
  message: string
  accent?: boolean
}

const BUBBLES: Bubble[] = [
  {
    name: 'Tiesverse Events',
    role: 'Feed',
    message: 'New event: Fireside Chat • Bengaluru • 2:00 PM',
  },
  {
    name: 'Organizer',
    role: 'Host',
    message: 'Quick reminder: add the meeting link before publishing.',
  },
  {
    name: 'Attendee',
    role: 'RSVP',
    message: 'Booked my spot. See you there!',
    accent: true,
  },
  {
    name: 'Tiesverse Events',
    role: 'Feed',
    message: 'Tip: filter by tag = webinar to find upcoming online sessions.',
  },
]

/**
 * Right-side hero collage.
 *
 * It's "inspired by" the reference layout: a dark panel that looks like a live
 * community feed. We keep it fully local (no external images) so it loads fast
 * and avoids stock-photo energy.
 */
export function HeroCollage(props: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[22px] border border-[color:var(--stroke)] bg-[color:var(--paper-muted)] p-5 shadow-sm',
        props.className,
      )}
    >
      <div className="tv-kicker text-[10px] font-semibold text-[color:var(--ink-muted)]">
        Live feed (demo)
      </div>
      <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
        What people see when they browse
      </div>

      <div className="mt-4 space-y-3">
        {BUBBLES.map((b, idx) => (
          <div
            key={`${b.name}-${idx}`}
            className={cn(
              'rounded-xl border bg-white p-3 text-[color:var(--ink)] shadow-sm',
              b.accent
                ? 'border-[color:var(--brand)]'
                : 'border-[color:var(--stroke)]',
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 flex-none items-center justify-center rounded-full text-[10px] font-semibold',
                  b.accent
                    ? 'bg-[color:var(--brand)] text-white'
                    : 'bg-[color:var(--paper-muted)] text-[color:var(--ink-muted)] border border-[color:var(--stroke)]',
                )}
                aria-hidden="true"
              >
                tv
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <div className="text-xs font-semibold text-[color:var(--ink)]">
                    {b.name}
                  </div>
                  <span className="rounded-full border border-[color:var(--stroke)] bg-[color:var(--paper-muted)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--ink-muted)]">
                    {b.role}
                  </span>
                </div>
                <div className="mt-1 text-sm text-[color:var(--ink-muted)]">{b.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
