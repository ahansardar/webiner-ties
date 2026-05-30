import Link from 'next/link'
import type { Category } from '@/data/homeDiscover'
import { cn } from '@/lib/cn'

/**
 * A small, scan-friendly category tile.
 * It routes to `/discover` with a `tag` prefilled to keep the UX simple.
 */
export function CategoryCard(props: { category: Category; className?: string }) {
  const Icon = props.category.icon

  return (
    <Link
      href={`/discover?tag=${encodeURIComponent(props.category.discoverTag ?? props.category.key)}`}
      className={cn(
        'tv-card tv-card-hover flex items-center gap-4 rounded-[22px] px-6 py-5 transition-all hover:-translate-y-1',
        props.className,
      )}
    >
      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[color:var(--accent-dim)] to-[color:var(--surface-container-highest)]">
        <Icon className="h-5 w-5 text-[color:var(--ink-highlight)]" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[color:var(--ink)] tracking-tight">
          {props.category.title}
        </div>
        <div className="mt-1 truncate text-xs text-[color:var(--ink-muted)]">
          {props.category.title} events
        </div>
      </div>
    </Link>
  )
}
