import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let targetUrl = url.trim()

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl
    }

    try {
      new URL(targetUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const slug = nanoid(7)

    const link = await prisma.link.create({
      data: { slug, url: targetUrl },
    })

    const baseUrl = process.env.BASE_URL || req.headers.get('origin') || 'http://localhost:3000'

    return NextResponse.json({
      slug: link.slug,
      shortUrl: `${baseUrl}/${link.slug}`,
      url: link.url,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
