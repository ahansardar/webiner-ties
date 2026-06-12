'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container } from './Container'
import { HeaderClock } from './HeaderClock'

const navLinks = [
  { href: '/discover', label: 'Discover' },
  { href: '/about',    label: 'About' },
  { href: '/contact',  label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--rule)] bg-white/95 backdrop-blur-md">
      <Container className="flex h-[74px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="tv-header-logo">
            <span className="tv-header-logo-dot">.</span>ties
            <span className="tv-header-logo-verse">verse</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <HeaderClock />
          </div>

          <nav className="flex items-center gap-1.5">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'text-[color:var(--accent)]'
                      : 'text-[color:var(--ink)] hover:text-[color:var(--accent)]',
                  ].join(' ')}
                >
                  <span className="font-bold text-[color:var(--accent)]">+</span>
                  {label}
                </Link>
              )
            })}
          </nav>

          <Link href="/discover" className="tv-btn-primary tv-btn hidden text-sm sm:inline-flex">
            Register now
          </Link>
        </div>
      </Container>
    </header>
  )
}
