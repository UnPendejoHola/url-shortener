'use client'

import { useState, FormEvent } from 'react'

type LinkResult = {
  slug: string
  shortUrl: string
  url: string
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LinkResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [links, setLinks] = useState<LinkResult[]>([])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setCopied(false)

    if (!url.trim()) return

    setLoading(true)

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setResult(data)
      setLinks((prev) => [data, ...prev].slice(0, 5))
      setUrl('')
    } catch {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function getQrUrl(shortUrl: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shortUrl)}`
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16 sm:px-8">
        <header className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 px-5 py-2 backdrop-blur-sm">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-6xl font-black tracking-tight text-transparent">
                shrt
              </span>
            </div>
          </div>
          <p className="text-lg text-zinc-500">
            Pega una URL larga y la acortamos al instante
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-1.5 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ejemplo.com/mi-url-muy-larga"
                className="w-full rounded-xl border-0 bg-transparent py-3.5 pl-11 pr-4 text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Acortando
                </span>
              ) : (
                'Acortar'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-6 animate-slide-up rounded-xl border border-red-900/50 bg-red-950/30 px-5 py-3 backdrop-blur-sm">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {result && (
          <div className="mb-6 animate-slide-up rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  URL acortada
                </p>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-xl font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  {result.shortUrl}
                </a>
                <p className="mt-1.5 truncate text-sm text-zinc-600">
                  {result.url}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => copyToClipboard(result.shortUrl)}
                  className="group relative rounded-xl border border-zinc-700/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800/50"
                >
                  {copied ? (
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Copiado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                      Copiar
                    </span>
                  )}
                </button>
                <a
                  href={getQrUrl(result.shortUrl)}
                  download={`qr-${result.slug}.png`}
                  className="rounded-xl border border-zinc-700/50 px-4 py-2.5 transition-all hover:border-zinc-600 hover:bg-zinc-800/50"
                >
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              El QR se descarga automaticamente al hacer click
            </div>
          </div>
        )}

        {links.length > 0 && (
          <div className="animate-slide-up rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm">
            <div className="border-b border-zinc-800/50 px-6 py-4">
              <h2 className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ultimos enlaces
              </h2>
            </div>
            <div className="divide-y divide-zinc-800/40">
              {links.map((link) => (
                <div key={link.slug} className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-zinc-800/20">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 truncate text-sm font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    {link.shortUrl}
                  </a>
                  <span className="hidden shrink-0 truncate text-sm text-zinc-600 sm:block max-w-[200px]">
                    {link.url}
                  </span>
                  <button
                    onClick={() => copyToClipboard(link.shortUrl)}
                    className="shrink-0 rounded-lg border border-zinc-700/50 px-3.5 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-300"
                  >
                    Copiar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-auto pt-20 text-center">
          <div className="border-t border-zinc-800/40 pt-8">
            <p className="text-sm text-zinc-700">
              shrt &mdash; acortador de URLs
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
