export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json([])

  try {
    const searchUrl = `https://wol.jw.org/pt/wol/s/r5/lp-t?q=${encodeURIComponent(q)}&p=par`
    const r = await fetch(searchUrl, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 }
    })
    if (!r.ok) throw new Error('Falha')
    const data = await r.json()
    const results = (data?.results ?? []).slice(0, 20).map((item: any) => ({
      id: item.did,
      title: item.title,
      snippet: item.snippet?.replace(/<[^>]+>/g, '').trim(),
      url: `https://wol.jw.org/pt/wol/d/r5/lp-t/${item.did}`,
      pubName: item.pubName,
      pubSymbol: item.pubSymbol,
    }))
    return NextResponse.json(results)
  } catch {
    return NextResponse.json([])
  }
}
