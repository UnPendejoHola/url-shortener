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
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-12 sm:px-6">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Shrt
          </span>
        </h1>
        <p className="mt-2 text-zinc-500">Paste a URL and shorten it instantly</p>
      </header>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Shortening
              </span>
            ) : (
              'Shorten'
            )}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </form>

      {result && (
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs text-zinc-500">Short URL</p>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-lg font-medium text-cyan-400 hover:underline"
              >
                {result.shortUrl}
              </a>
              <p className="mt-1 truncate text-sm text-zinc-600">{result.url}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => copyToClipboard(result.shortUrl)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <a
                href={getQrUrl(result.shortUrl)}
                download={`qr-${result.slug}.png`}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                QR
              </a>
            </div>
          </div>
        </div>
      )}

      {links.length > 0 && (
        <div className="rounded-xl border border-zinc-800">
          <div className="border-b border-zinc-800 px-5 py-3">
            <h2 className="text-sm font-medium text-zinc-400">Recent Links</h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {links.map((link) => (
              <div key={link.slug} className="flex items-center gap-4 px-5 py-3">
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate text-sm text-cyan-400 hover:underline"
                >
                  {link.shortUrl}
                </a>
                <span className="shrink-0 truncate text-sm text-zinc-600">{link.url}</span>
                <button
                  onClick={() => copyToClipboard(link.shortUrl)}
                  className="shrink-0 rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-auto pt-12 text-center text-sm text-zinc-600">
        Built with Next.js + Prisma
      </footer>
    </div>
  )
}
