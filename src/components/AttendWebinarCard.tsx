'use client'

import { useMemo, useState, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { RegistrationPanel } from './RegistrationPanel'

export function AttendWebinarCard(props: {
  eventSlug: string
  title: string
  dateLine: string
  timeLine: string
  venueType: 'ONLINE' | 'IN_PERSON' | 'HYBRID'
  locationText?: string | null
  className?: string
  sticky?: boolean
  speakerName?: string
  speakerTitle?: string
  eventTopic?: string
}) {
  const [mode, setMode] = useState<'details' | 'form'>('details')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const venueLabel = useMemo(() => {
    if (props.venueType === 'ONLINE') return 'Virtual'
    if (props.venueType === 'IN_PERSON') return 'In person'
    return 'Hybrid'
  }, [props.venueType])

  const shouldStick = props.sticky && isMobile

  if (mode === 'form') {
    return (
      <div 
        className={cn(
          'overflow-hidden rounded-[32px] border border-white/10 bg-[color:var(--surface-container-highest)]',
          shouldStick && 'attend-card-sticky',
          props.className
        )}
      >
        <div className="p-4">
          <RegistrationPanel
            eventSlug={props.eventSlug}
            title={props.title}
            dateStr={props.dateLine}
            timeStr={props.timeLine}
            onDone={() => setMode('details')}
          />
          <div className="mt-3">
            <button 
              type="button" 
              onClick={() => setMode('details')} 
              className="tv-btn w-full py-3 text-sm"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Details mode - Premium hero + sticky footer on mobile
  return (
    <div 
      className={cn(
        shouldStick && 'attend-card-sticky',
        props.className
      )}
    >
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[color:var(--ink-highlight)]/80 via-[color:var(--ink-highlight)]/75 to-[#1a1a1e]">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(228,213,160,0.3),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(120,100,200,0.1),transparent_60%)]" />
        
        <div className="relative p-8 sm:p-10">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
            <span className="text-xs font-semibold text-white tracking-wider">WEBINAR</span>
          </div>

          {/* Main content */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight max-w-2xl">
            {props.title}
          </h2>

          {/* Speaker info if available */}
          {props.speakerName && (
            <div className="mt-8 space-y-3">
              <p className="text-sm text-white/60 tracking-wide uppercase">Hosted by</p>
              <div className="flex items-center gap-3">
                <div className="flex-none">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 border border-white/20" />
                </div>
                <div>
                  <div className="font-semibold text-white">{props.speakerName}</div>
                  {props.speakerTitle && (
                    <p className="text-xs text-white/70">{props.speakerTitle}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Topic if available */}
          {props.eventTopic && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-white/60 tracking-wide uppercase mb-2">Topic</p>
              <p className="text-base text-white font-medium">{props.eventTopic}</p>
            </div>
          )}

          {/* Date, time, location in hero */}
          <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-white/60 tracking-wide uppercase mb-1">Date</p>
              <p className="text-sm font-semibold text-white">{props.dateLine}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 tracking-wide uppercase mb-1">Time</p>
              <p className="text-sm font-semibold text-white">{props.timeLine}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 tracking-wide uppercase mb-1">Location</p>
              <p className="text-sm font-semibold text-white">{props.locationText || venueLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer Section on Mobile */}
      {shouldStick ? (
        <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[color:var(--surface-container-highest)]/95 backdrop-blur-xl px-4 py-3 safe-area-bottom">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <div className="text-xs text-[color:var(--ink-muted)] uppercase tracking-wider">Ticket</div>
              <div className="text-lg font-bold text-[color:var(--ink-highlight)]">FREE</div>
            </div>
            <button 
              type="button" 
              onClick={() => setMode('form')} 
              className="tv-btn tv-btn-primary px-8 py-3 font-semibold whitespace-nowrap"
            >
              Next step
            </button>
          </div>
        </div>
      ) : (
        /* Desktop: Show full details card below hero */
        <div className="mt-6 rounded-[32px] border border-white/10 bg-[color:var(--surface-container-highest)] p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[color:var(--ink)]">Webinar Details</h3>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">Everything you need to know about attending.</p>
          </div>

          {/* Details grid */}
          <div className="space-y-4 mb-8">
            <div className="rounded-2xl border border-white/10 bg-[color:var(--card)] px-5 py-4">
              <div className="text-xs font-semibold text-[color:var(--ink-muted)] uppercase tracking-wider">Date</div>
              <div className="mt-2 text-base font-medium text-[color:var(--ink)]">{props.dateLine}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[color:var(--card)] px-5 py-4">
              <div className="text-xs font-semibold text-[color:var(--ink-muted)] uppercase tracking-wider">Time</div>
              <div className="mt-2 text-base font-medium text-[color:var(--ink)]">{props.timeLine}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[color:var(--card)] px-5 py-4">
              <div className="text-xs font-semibold text-[color:var(--ink-muted)] uppercase tracking-wider">Location</div>
              <div className="mt-2 text-base font-medium text-[color:var(--ink)]">{props.locationText || venueLabel}</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-[color:var(--accent)]/15 to-[color:var(--ink-highlight)]/5 border border-[color:var(--accent)]/30">
            <div>
              <div className="text-xs font-semibold text-[color:var(--ink-muted)] uppercase tracking-wider">Ticket price</div>
              <div className="mt-1 text-2xl font-bold text-[color:var(--ink-highlight)]">FREE</div>
            </div>
            <button 
              type="button" 
              onClick={() => setMode('form')} 
              className="tv-btn tv-btn-primary px-8 py-3 font-semibold"
            >
              Register now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
