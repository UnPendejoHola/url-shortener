import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const link = await prisma.link.findUnique({ where: { slug } })

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.link.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  })

  return NextResponse.redirect(link.url)
}
