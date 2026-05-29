import { Container } from '@/components/Container'
import { AdminClient } from './ui/AdminClient'

export const dynamic = 'force-dynamic'

export default async function Page() {
  return (
    <Container className="py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="tv-kicker text-xs font-semibold text-[color:var(--ink-muted)]">
            Admin
          </div>
          <h1 className="tv-display mt-3 text-3xl font-semibold text-[color:var(--ink)]">
            Manage events
          </h1>
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
            Create webinars, customize RSVP questions, and review submissions.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AdminClient />
      </div>
    </Container>
  )
}
