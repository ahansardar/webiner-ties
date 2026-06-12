import type { Metadata } from 'next'
import './globals.css'
import { ConditionalHeader } from '@/components/ConditionalHeader'
import { Fraunces, Manrope } from 'next/font/google'

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    default: 'Tiesverse Events',
    template: '%s - Tiesverse Events',
  },
  description: 'Discover webinars and events from Tiesverse.',
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <div className="tv-outer">
          <div className="tv-shell">
            <ConditionalHeader />
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
