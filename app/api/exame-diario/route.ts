export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const dateParam = url.searchParams.get('date') ?? new Date().toISOString().split('T')[0]
  const date = new Date(dateParam + 'T12:00:00Z')

  // Checar cache no banco
  const cached = await prisma.dailyExam.findUnique({ where: { date } })
  if (cached) return NextResponse.json(cached)

  // Buscar no JW.org
  try {
    const [y, m, d] = dateParam.split('-')
    const jwUrl = `https://wol.jw.org/pt/wol/dt/r5/lp-t/${y}/${Number(m)}/${Number(d)}`
    const r = await fetch(jwUrl, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 }
    })
    if (!r.ok) throw new Error('JW indisponível')
    const data = await r.json()
    const items = data?.items?.[0]
    if (!items) throw new Error('Sem dados')

    // Extrair título, versículo e conteúdo do HTML
    const titleRaw: string = items.title ?? ''
    const content: string = items.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
    const verse = titleRaw.match(/[""](.+?)[""]/)?.[1] ?? titleRaw
    const title = items.dateFormatted ?? dateParam

    const saved = await prisma.dailyExam.create({
      data: { date, title, verse, content }
    })
    return NextResponse.json(saved)
  } catch {
    return NextResponse.json({ date, title: dateParam, verse: '', content: 'Texto não disponível. Acesse wol.jw.org para ler o Exame das Escrituras.' }, { status: 200 })
  }
}

export async function PATCH(req: Request) {
  const { id, notes } = await req.json()
  const updated = await prisma.dailyExam.update({ where: { id }, data: { notes } })
  return NextResponse.json(updated)
}
