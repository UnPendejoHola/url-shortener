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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-6 backdrop-blur-sm">
          <p className="text-5xl font-bold text-zinc-700">404</p>
          <p className="mt-2 text-zinc-500">Ese enlace no existe</p>
          <a
            href="/"
            className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300"
          >
            Crear otro
          </a>
        </div>
      </div>
    )
  }

  await prisma.link.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  })

  redirect(link.url)
}
