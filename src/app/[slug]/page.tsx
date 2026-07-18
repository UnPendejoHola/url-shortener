import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const link = await prisma.link.findUnique({ where: { slug } })

  if (!link) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">Link not found</div>
  }

  await prisma.link.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  })

  redirect(link.url)
}
