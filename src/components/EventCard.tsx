import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Video } from 'lucide-react'
import type { ListedEvent } from '@/server/events'
import { formatEventDateTime } from '@/lib/format'
import { TagChips } from './TagChips'
import { cn } from '@/lib/cn'

export function EventCard(props: { event: ListedEvent; className?: string }) {
  const { event } = props
  const isOnline = event.venueType === 'ONLINE'

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn('tv-card tv-card-hover group block rounded-[24px] p-6', props.className)}
    >
      <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-[18px] border border-white/10 bg-[color:var(--card-hover)]">
        {event.coverImageUrl ? (
          <Image
            alt={event.title}
            src={event.coverImageUrl}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[color:var(--ink-muted)]">
            No poster
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="tv-kicker text-[10px] font-semibold tracking-wider text-[color:var(--ink-muted)]">
          {isOnline ? 'VIRTUAL' : 'IN PERSON'} · {event.organizer.name.toUpperCase()}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-[color:var(--ink)] transition-colors duration-200 group-hover:text-[color:var(--ink-highlight)]">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-[color:var(--ink-muted)]">{event.summary}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-[color:var(--ink-muted)]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 flex-none opacity-60" aria-hidden="true" />
            {formatEventDateTime({
              startAt: new Date(event.startAt),
              endAt: event.endAt ? new Date(event.endAt) : null,
              timezone: event.timezone,
            })}
          </span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1 font-medium text-[color:var(--ink)]">
            {isOnline ? (
              <>
                <Video className="h-3.5 w-3.5 flex-none opacity-70" aria-hidden="true" />
                Virtual
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5 flex-none opacity-70" aria-hidden="true" />
                <span className="max-w-[220px] truncate" title={event.locationText ?? 'In-person'}>
                  {event.locationText || 'In-person'}
                </span>
              </>
            )}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-[color:var(--stroke)] pt-4">
          <TagChips tags={event.tagList} />
          <span className="text-xs font-medium text-[color:var(--ink-muted)]">
            <span className="text-[color:var(--ink)]">{event._count.rsvps}</span> RSVPs
          </span>
        </div>
      </div>
    </Link>
  )
}

