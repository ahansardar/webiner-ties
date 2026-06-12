import { supabaseAdmin } from '@/lib/supabase'

export type SupabaseItem = {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  date: string | null
  time: string | null
  location: string | null
  category: string | null
  registerLink: string | null
  isFeatured: boolean
  source: 'event' | 'workshop'
}

export async function getSupabaseWebinars(): Promise<SupabaseItem[]> {
  const [eventsRes, workshopsRes] = await Promise.all([
    supabaseAdmin.from('events').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('workshops').select('*').order('created_at', { ascending: false }),
  ])

  const events: SupabaseItem[] = (eventsRes.data ?? []).map((e: any) => ({
    id: e.id,
    title: e.title,
    description: e.description ?? null,
    imageUrl: e.image_url ?? null,
    date: e.date ?? null,
    time: e.time ?? null,
    location: e.location ?? null,
    category: e.type ?? null,
    registerLink: e.form_link ?? null,
    isFeatured: e.is_featured ?? false,
    source: 'event' as const,
  }))

  const workshops: SupabaseItem[] = (workshopsRes.data ?? []).map((w: any) => ({
    id: w.id,
    title: w.title,
    description: w.description ?? null,
    imageUrl: w.image_url ?? null,
    date: w.date ?? null,
    time: w.time ?? null,
    location: w.location ?? null,
    category: w.category ?? null,
    registerLink: w.register_link ?? w.form_link ?? null,
    isFeatured: false,
    source: 'workshop' as const,
  }))

  // Featured events first, then by insertion order
  return [...events.filter((e) => e.isFeatured), ...events.filter((e) => !e.isFeatured), ...workshops]
}
