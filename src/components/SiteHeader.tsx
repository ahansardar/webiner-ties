'use client'

import Link from 'next/link'
import { Container } from './Container'
import { HeaderClock } from './HeaderClock'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/08 bg-[#09090b]/80 backdrop-blur-xl backdrop-saturate-150">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)]/40 to-transparent" />

      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
          <span className="tv-header-logo font-bold tracking-tight">
            <span className="tv-header-logo-dot text-[color:var(--accent)]">.</span>tiesverse
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block">
            <HeaderClock />
          </div>
          <nav className="flex items-center gap-1">
            <Link
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-[color:var(--ink-muted)] transition-all hover:text-[color:var(--ink)] hover:bg-white/08"
              href="/"
            >
              Discover
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
