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
      className={cn('tv-card tv-card-hover group block overflow-hidden rounded-[28px] transition-all duration-300', props.className)}
    >
      {/* Premium Image Container */}
      <div className="relative mb-0 aspect-[4/3] w-full overflow-hidden bg-[color:var(--card-hover)]">
        {event.coverImageUrl ? (
          <Image
            alt={event.title}
            src={event.coverImageUrl}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[color:var(--ink-muted)]">
            No poster
          </div>
        )}
        {/* Badge overlay */}
        <div className="absolute right-3 top-3 rounded-full bg-[color:var(--ink-highlight)]/10 backdrop-blur-md border border-[color:var(--ink-highlight)]/30 px-3 py-1">
          <span className="text-xs font-semibold text-[color:var(--ink-highlight)]">
            {isOnline ? 'VIRTUAL' : 'IN PERSON'}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Organizer badge */}
        <div className="tv-kicker text-[10px] font-semibold tracking-widest text-[color:var(--ink-muted)] uppercase">
          By {event.organizer.name.toUpperCase()}
        </div>

        {/* Title */}
        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-[color:var(--ink)] transition-colors duration-200 group-hover:text-[color:var(--ink-highlight)]">
          {event.title}
        </h3>

        {/* Summary */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
          {event.summary}
        </p>

        {/* Date & Time */}
        <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs text-[color:var(--ink-muted)]">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 flex-none opacity-60" aria-hidden="true" />
            {formatEventDateTime({
              startAt: new Date(event.startAt),
              endAt: event.endAt ? new Date(event.endAt) : null,
              timezone: event.timezone,
            })}
          </span>
          <span className="opacity-30">·</span>
          <span className="flex items-center gap-1.5 font-medium text-[color:var(--ink)]">
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

        {/* Footer with tags and RSVPs */}
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-[color:var(--stroke)] pt-4">
          <TagChips tags={event.tagList} />
          <span className="text-xs font-medium text-[color:var(--ink-muted)]">
            <span className="font-semibold text-[color:var(--ink)]">{event._count.rsvps}</span> joined
          </span>
        </div>
      </div>
    </Link>
  )
}

