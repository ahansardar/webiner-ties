import Link from 'next/link'
import { listEvents } from '@/server/events'
import { EventCard } from '@/components/EventCard'
import { CategoryCard } from '@/components/CategoryCard'
import { FeaturedEventCard } from '@/components/FeaturedEventCard'
import { categories, featuredEvents } from '@/data/homeDiscover'

export default async function Page() {
  const now = new Date()
  const events = await listEvents({ take: 80 })

  const upcoming = events
    .filter((event) => new Date(event.startAt).getTime() >= now.getTime())
    .slice(0, 9)
  const recent = events
    .filter((event) => new Date(event.startAt).getTime() < now.getTime())
    .slice(0, 4)

  const live = events
    .filter((event) => {
      const s = new Date(event.startAt).getTime()
      const e = event.endAt ? new Date(event.endAt).getTime() : s + 60 * 60 * 1000
      return s <= now.getTime() && now.getTime() < e
    })
    .slice(0, 6)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-0 lg:py-16">
      <section className="mb-16 overflow-hidden rounded-[32px] border border-white/08 bg-[color:var(--card)]" style={{boxShadow:'0 1px 0 rgba(255,255,255,0.05) inset, 0 40px 100px rgba(0,0,0,0.50)'}}>
        <div className="relative p-8 sm:p-16 lg:p-20">
          {/* Multi-layer ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_65%_at_20%_-10%,rgba(228,213,160,0.13),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_110%,rgba(120,100,200,0.07),transparent_60%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="relative">
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-[color:var(--ink)] sm:text-7xl leading-tight">
              Webinars &amp; events by{' '}
              <span className="tv-highlight">.tiesverse</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--ink-muted)] sm:text-xl">
              Find what&apos;s next. RSVP fast. Show up with a friendly crowd.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/discover" className="tv-btn tv-btn-primary px-8 py-3.5 text-[15px] font-semibold">
                <span className="material-symbols-outlined text-[18px]">explore</span>
                Explore events
              </Link>
              <Link href="/discover?tag=webinar" className="tv-btn px-7 py-3">
                Webinars
              </Link>
              <Link href="/discover?tag=meetup" className="tv-btn px-7 py-3">
                Meetups
              </Link>
              <Link href="/discover?venue=ONLINE" className="tv-btn px-7 py-3">
                Online only
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[color:var(--ink)] tracking-tight">Upcoming</h2>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">Pick a session and grab your spot.</p>
          </div>
          <Link href="/discover" className="text-sm font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors">
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.length ? (
            upcoming.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[color:var(--card)] p-6 text-sm text-[color:var(--ink-muted)]">
              No upcoming events yet.
            </div>
          )}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[color:var(--ink)] tracking-tight">Live now</h2>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">Join while it&apos;s happening.</p>
          </div>
          <Link href="/discover" className="text-sm font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors">
            Explore →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {live.length ? (
            live.map((event) => <EventCard key={`live-${event.id}`} event={event} />)
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[color:var(--card)] p-6 text-sm text-[color:var(--ink-muted)]">
              No live events right now.
            </div>
          )}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[color:var(--ink)] tracking-tight">Browse by category</h2>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">Tap a category to filter events.</p>
          </div>
          <Link href="/discover" className="text-sm font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors">
            All filters →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.key} category={c} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[color:var(--ink)] tracking-tight">Featured events</h2>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">Handpicked sessions worth bookmarking.</p>
          </div>
          <Link href="/discover" className="text-sm font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors">
            Browse →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.slice(0, 6).map((e) => (
            <FeaturedEventCard key={e.key} event={e} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[color:var(--ink)] tracking-tight">Recently hosted</h2>
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">Missed one? Catch the recap on the event page.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recent.length ? (
            recent.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[color:var(--card)] p-6 text-sm text-[color:var(--ink-muted)]">
              Past events will appear here.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
