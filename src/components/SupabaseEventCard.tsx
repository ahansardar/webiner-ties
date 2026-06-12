import type { SupabaseItem } from '@/server/supabaseEvents'

export function SupabaseEventCard({ item }: { item: SupabaseItem }) {
  const label = item.source === 'workshop' ? 'Workshop' : (item.category ?? 'Event')

  const card = (
    <div className="tv-card tv-card-hover group flex h-full flex-col rounded-[var(--radius)] p-5">
      <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius)] border border-[color:var(--rule)] bg-[color:var(--card-hover)]">
        {item.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[color:var(--ink-muted)]">
            No image
          </div>
        )}

        {item.isFeatured && (
          <span className="absolute left-2 top-2 rounded bg-[color:var(--accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Featured
          </span>
        )}
      </div>

      <div className="tv-kicker text-[10px] font-semibold uppercase tracking-wider text-[color:var(--ink-muted)]">
        {label}
      </div>

      <h3 className="mt-2 line-clamp-2 flex-1 text-base font-bold leading-snug text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--ink-highlight)]">
        {item.title}
      </h3>

      {item.description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-[color:var(--ink-muted)]">{item.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--ink-muted)]">
        {item.date && (
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] opacity-60">calendar_month</span>
            {item.date}{item.time ? ` · ${item.time}` : ''}
          </span>
        )}
        {item.location && (
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] opacity-60">location_on</span>
            <span className="max-w-[200px] truncate">{item.location}</span>
          </span>
        )}
      </div>

      {item.registerLink && (
        <div className="mt-4 border-t border-[color:var(--stroke)] pt-3">
          <span className="text-xs font-semibold text-[color:var(--accent)]">Register →</span>
        </div>
      )}
    </div>
  )

  if (item.registerLink) {
    return (
      <a href={item.registerLink} target="_blank" rel="noopener noreferrer" className="block h-full">
        {card}
      </a>
    )
  }

  return <div className="h-full">{card}</div>
}
