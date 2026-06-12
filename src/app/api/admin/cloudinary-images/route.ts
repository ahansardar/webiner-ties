import { cloudinary } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      direction: 'desc',
    })

    const images = (result.resources ?? []).map((r: any) => ({
      url: r.secure_url,
      publicId: r.public_id,
      width: r.width,
      height: r.height,
      format: r.format,
      createdAt: r.created_at,
    }))

    return Response.json({ images })
  } catch (err: any) {
    console.error('[cloudinary-images]', err?.message ?? err)
    return Response.json({ images: [], error: err?.message ?? 'Failed to fetch' }, { status: 500 })
  }
}
