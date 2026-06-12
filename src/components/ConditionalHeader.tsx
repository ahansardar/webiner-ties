'use client'

import { usePathname } from 'next/navigation'
import { SiteHeader } from './SiteHeader'

export function ConditionalHeader() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <SiteHeader />
}
