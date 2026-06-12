'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ListedEvent } from '@/server/events'

type FormData = {
  title: string
  summary: string
  descriptionMd: string
  coverImageUrl: string
  tags: string
  venueType: 'ONLINE' | 'IN_PERSON' | 'HYBRID'
  meetingUrl: string
  locationText: string
  startAt: string
  endAt: string
  timezone: string
  capacity: string
  isPublished: boolean
  organizerHandle: string
  organizerName: string
  organizerBio: string
  organizerWebsite: string
}

function toLocalDatetimeValue(isoStr: string): string {
  // Convert ISO string to datetime-local input value (YYYY-MM-DDTHH:mm)
  if (!isoStr) return ''
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 16)
}

function fromLocalDatetimeValue(val: string, tz: string): string {
  if (!val) return ''
  return new Date(val).toISOString()
}

const TIMEZONES = [
  'Asia/Kolkata', 'UTC', 'America/New_York', 'America/Los_Angeles',
  'America/Chicago', 'Europe/London', 'Europe/Paris', 'Asia/Singapore',
  'Asia/Dubai', 'Australia/Sydney',
]

export function EventForm({
  mode,
  event,
}: {
  mode: 'create' | 'edit'
  event?: ListedEvent
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState<FormData>({
    title: event?.title ?? '',
    summary: event?.summary ?? '',
    descriptionMd: event?.descriptionMd ?? '',
    coverImageUrl: event?.coverImageUrl ?? '',
    tags: event?.tagList.join(', ') ?? '',
    venueType: event?.venueType ?? 'ONLINE',
    meetingUrl: event?.meetingUrl ?? '',
    locationText: event?.locationText ?? '',
    startAt: toLocalDatetimeValue(event?.startAt ?? ''),
    endAt: toLocalDatetimeValue(event?.endAt ?? ''),
    timezone: event?.timezone ?? 'Asia/Kolkata',
    capacity: event?.capacity != null ? String(event.capacity) : '',
    isPublished: event?.isPublished ?? false,
    organizerHandle: event?.organizer.handle ?? 'tiesverse',
    organizerName: event?.organizer.name ?? '',
    organizerBio: event?.organizer.bio ?? '',
    organizerWebsite: event?.organizer.website ?? '',
  })

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const setChecked = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.checked }))

  const submit = () => {
    startTransition(async () => {
      setError('')
      setSuccess('')

      // Client-side required field checks
      if (!form.title.trim()) { setError('Title is required.'); return }
      if (!form.summary.trim()) { setError('Summary is required.'); return }
      if (!form.startAt) { setError('Start date & time is required.'); return }
      if (!form.organizerName.trim()) { setError('Organizer display name is required.'); return }

      let startAtIso: string
      let endAtIso: string | null = null
      try {
        startAtIso = new Date(form.startAt).toISOString()
        if (isNaN(new Date(form.startAt).getTime())) throw new Error()
      } catch {
        setError('Start date is invalid. Please pick a date from the calendar.')
        return
      }
      try {
        if (form.endAt) {
          if (isNaN(new Date(form.endAt).getTime())) throw new Error()
          endAtIso = new Date(form.endAt).toISOString()
        }
      } catch {
        setError('End date is invalid.')
        return
      }

      const tags = form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)

      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        descriptionMd: form.descriptionMd.trim(),
        coverImageUrl: form.coverImageUrl.trim() || null,
        tags,
        venueType: form.venueType,
        meetingUrl: form.meetingUrl.trim() || null,
        locationText: form.locationText.trim() || null,
        startAt: startAtIso,
        endAt: endAtIso,
        timezone: form.timezone,
        capacity: form.capacity ? parseInt(form.capacity, 10) : null,
        isPublished: form.isPublished,
        organizerHandle: form.organizerHandle.trim() || 'tiesverse',
        organizerName: form.organizerName.trim(),
        organizerBio: form.organizerBio.trim() || null,
        organizerWebsite: form.organizerWebsite.trim() || null,
      }

      const url = mode === 'edit' && event ? `/api/admin/events/${event.id}` : '/api/admin/events'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      try {
        const res = await fetch(url, {
          method,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const json = await res.json().catch(() => null)

        if (!res.ok) {
          const issues = json?.issues as Array<{ path: string[]; message: string }> | undefined
          if (issues?.length) {
            const detail = issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n')
            setError(`Validation failed:\n${detail}`)
          } else {
            setError(json?.error ?? 'Something went wrong.')
          }
          return
        }

        if (mode === 'create') {
          router.push('/admin/events')
        } else {
          setSuccess('Saved successfully.')
          router.refresh()
        }
      } catch {
        setError('Network error. Please try again.')
      }
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Basic info */}
        <Section title="Basic info">
          <Field label="Title" required>
            <input value={form.title} onChange={set('title')} className="tv-input" placeholder="Webinar title" />
          </Field>
          <Field label="Summary (shown on cards)" required>
            <textarea value={form.summary} onChange={set('summary')} className="tv-input min-h-20 py-3" placeholder="One or two sentences describing the event" />
          </Field>
          <Field label="Description (Markdown)">
            <textarea value={form.descriptionMd} onChange={set('descriptionMd')} className="tv-input min-h-48 py-3 font-mono text-sm" placeholder="## About this event&#10;&#10;Full details, agenda, speakers..." />
          </Field>
          <Field label="Cover image">
            <ImageUploader
              value={form.coverImageUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, coverImageUrl: url }))}
            />
          </Field>
          <Field label="Tags (comma-separated)">
            <input value={form.tags} onChange={set('tags')} className="tv-input" placeholder="webinar, product, qa" />
          </Field>
        </Section>

        {/* Schedule */}
        <Section title="Schedule">
          <Field label="Venue type" required>
            <select value={form.venueType} onChange={set('venueType')} className="tv-input">
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In person</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start date & time" required>
              <input type="datetime-local" value={form.startAt} onChange={set('startAt')} className="tv-input" />
            </Field>
            <Field label="End date & time">
              <input type="datetime-local" value={form.endAt} onChange={set('endAt')} className="tv-input" />
            </Field>
          </div>
          <Field label="Timezone" required>
            <select value={form.timezone} onChange={set('timezone')} className="tv-input">
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </Field>

          {(form.venueType === 'ONLINE' || form.venueType === 'HYBRID') && (
            <Field label="Meeting URL">
              <input value={form.meetingUrl} onChange={set('meetingUrl')} className="tv-input" placeholder="https://meet.google.com/..." type="url" />
            </Field>
          )}
          {(form.venueType === 'IN_PERSON' || form.venueType === 'HYBRID') && (
            <Field label="Location">
              <input value={form.locationText} onChange={set('locationText')} className="tv-input" placeholder="Venue name, city" />
            </Field>
          )}
        </Section>

        {/* Organizer */}
        <Section title="Organizer">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Handle (URL-safe slug)" required>
              <input value={form.organizerHandle} onChange={set('organizerHandle')} className="tv-input" placeholder="tiesverse" />
            </Field>
            <Field label="Display name" required>
              <input value={form.organizerName} onChange={set('organizerName')} className="tv-input" placeholder="Tiesverse" />
            </Field>
          </div>
          <Field label="Bio">
            <textarea value={form.organizerBio} onChange={set('organizerBio')} className="tv-input min-h-20 py-3" placeholder="Short description of the organizer" />
          </Field>
          <Field label="Website">
            <input value={form.organizerWebsite} onChange={set('organizerWebsite')} className="tv-input" placeholder="https://tiesverse.com" type="url" />
          </Field>
        </Section>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <Section title="Publish settings">
          <Field label="Capacity (leave blank for unlimited)">
            <input value={form.capacity} onChange={set('capacity')} className="tv-input" type="number" min={1} placeholder="e.g. 200" />
          </Field>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={setChecked('isPublished')}
              className="h-4 w-4 rounded border-[color:var(--rule)]"
            />
            <span className="text-sm text-[color:var(--ink)]">Published (visible to public)</span>
          </label>
        </Section>

        {error && (
          <div className="rounded-[var(--radius)] bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-[var(--radius)] bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400">
            {success}
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="tv-btn tv-btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Saving…' : mode === 'create' ? 'Create event' : 'Save changes'}
        </button>

        {mode === 'edit' && event && (
          <a
            href={`/events/${event.slug}`}
            target="_blank"
            className="tv-btn w-full py-3 text-center block text-sm"
          >
            View public page
          </a>
        )}
      </div>
    </div>
  )
}

type CloudinaryImage = {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  createdAt: string
}

function CloudinaryLibraryModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void
  onClose: () => void
}) {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/cloudinary-images')
      .then((r) => r.json())
      .then((json) => setImages(json.images ?? []))
      .catch(() => setError('Failed to load library'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-[var(--radius)] border border-[color:var(--rule)] bg-[color:var(--bg)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--rule)] px-5 py-4">
          <h3 className="text-sm font-semibold text-[color:var(--ink)]">Cloudinary Library</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <p className="py-10 text-center text-sm text-[color:var(--ink-muted)]">Loading…</p>
          )}
          {error && (
            <p className="py-10 text-center text-sm text-red-400">{error}</p>
          )}
          {!loading && !error && images.length === 0 && (
            <p className="py-10 text-center text-sm text-[color:var(--ink-muted)]">
              No images found in tiesverse/events/
            </p>
          )}
          {!loading && images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <button
                  key={img.publicId}
                  type="button"
                  onClick={() => { onSelect(img.url); onClose() }}
                  className="group relative overflow-hidden rounded-[var(--radius)] border border-[color:var(--rule)] bg-[color:var(--card)] transition hover:border-[color:var(--accent)]"
                  style={{ aspectRatio: '4/3' }}
                >
                  <img
                    src={img.url}
                    alt={img.publicId}
                    className="h-full w-full object-cover transition group-hover:opacity-80"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1 opacity-0 transition group-hover:opacity-100">
                    <p className="truncate text-[10px] text-white">{img.publicId.split('/').pop()}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [showLibrary, setShowLibrary] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error ?? 'Upload failed')
      onChange(json.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      {showLibrary && (
        <CloudinaryLibraryModal
          onSelect={onChange}
          onClose={() => setShowLibrary(false)}
        />
      )}

      {value && (
        <div
          className="relative overflow-hidden rounded-[var(--radius)] border border-[color:var(--rule)] bg-[color:var(--card)]"
          style={{ aspectRatio: '1200/630' }}
        >
          <img src={value} alt="Cover preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="tv-btn px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="tv-btn px-4 py-2 text-sm"
        >
          Choose from library
        </button>

        <span className="text-xs text-[color:var(--ink-muted)]">JPG, PNG, WebP · max 8 MB</span>
      </div>

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      <div className="flex items-center gap-2">
        <span className="shrink-0 text-xs text-[color:var(--ink-muted)]">or paste URL</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="tv-input flex-1 text-sm"
          placeholder="https://..."
        />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius)] border border-[color:var(--rule)] bg-[color:var(--card)] p-6">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-[color:var(--ink-muted)]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[color:var(--ink-muted)]">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}
