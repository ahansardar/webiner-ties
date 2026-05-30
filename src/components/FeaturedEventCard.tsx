import { Calendar, Clock, MapPin, Video } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { FeaturedEvent } from '@/data/homeDiscover'
import { cn } from '@/lib/cn'

export function FeaturedEventCard(props: { event: FeaturedEvent; className?: string }) {
  const { event } = props

  return (
    <Link
      href={`/events/${event.key}`}
      className={cn(
        'tv-card group block overflow-hidden rounded-[28px] p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl',
        props.className,
      )}
    >
      {/* Premium Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/30">
        {event.posterUrl ? (
          <Image
            alt={event.title}
            src={event.posterUrl}
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(228,213,160,0.15),transparent_55%),radial-gradient(circle_at_75%_30%,rgba(120,100,200,0.08),transparent_60%)]" />
        )}

        {/* Premium Badge */}
        {event.badge && (
          <span className="absolute right-4 top-4 rounded-full border border-[color:var(--ink-highlight)]/40 bg-black/50 px-3.5 py-1.5 text-[10px] font-bold text-[color:var(--ink-highlight)] backdrop-blur-md tracking-widest uppercase">
            {event.badge}
          </span>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="p-6">
        {/* Category badge */}
        <div className="tv-kicker text-[10px] font-bold tracking-widest text-[color:var(--ink-muted)] uppercase">
          Featured · {event.organizer.toUpperCase()}
        </div>

        {/* Title */}
        <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug text-[color:var(--ink)] transition-colors duration-200 group-hover:text-[color:var(--ink-highlight)]">
          {event.title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
          {event.description}
        </p>

        {/* Metadata */}
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[color:var(--ink-muted)]">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 flex-none opacity-60" aria-hidden="true" />
            {event.time}
          </span>
          <span className="opacity-25">•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 flex-none opacity-60" aria-hidden="true" />
            {event.date}
          </span>
          {event.venueType ? (
            <>
              <span className="opacity-25">•</span>
              <span className="flex items-center gap-1.5 font-medium text-[color:var(--ink)]">
                {event.venueType === 'ONLINE' ? (
                  <>
                    <Video className="h-4 w-4 flex-none opacity-70" aria-hidden="true" />
                    Online
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 flex-none opacity-70" aria-hidden="true" />
                    <span className="max-w-[150px] truncate" title={event.locationText ?? 'In-person'}>
                      {event.locationText || 'In-person'}
                    </span>
                  </>
                )}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

