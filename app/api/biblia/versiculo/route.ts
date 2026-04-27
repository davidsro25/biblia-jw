export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

const BOOK_NUM: Record<string, number> = {
  GEN:1,EXO:2,LEV:3,NUM:4,DEU:5,JOS:6,JUD:7,RUT:8,'1SA':9,'2SA':10,
  '1RE':11,'2RE':12,'1CR':13,'2CR':14,ESD:15,NEE:16,EST:17,JOB:18,
  SAL:19,PRO:20,ECL:21,CAN:22,ISA:23,JER:24,LAM:25,EZE:26,DAN:27,
  OSE:28,JOE:29,AMO:30,OBA:31,JON:32,MIQ:33,NAU:34,HAB:35,SOF:36,
  AGA:37,ZAC:38,MAL:39,MAT:40,MAR:41,LUC:42,JOA:43,ATO:44,ROM:45,
  '1CO':46,'2CO':47,GAL:48,EFE:49,FIL:50,COL:51,'1TE':52,'2TE':53,
  '1TI':54,'2TI':55,TIT:56,FLM:57,HEB:58,TIA:59,'1PE':60,'2PE':61,
  '1JO':62,'2JO':63,'3JO':64,JUD2:65,APO:66
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const book = url.searchParams.get('book') ?? ''
  const chapter = url.searchParams.get('chapter') ?? '1'
  const verse = url.searchParams.get('verse') ?? ''

  const bookNum = BOOK_NUM[book]
  if (!bookNum) return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 })

  try {
    // JW.org WOL Bible API
    const endpoint = verse
      ? `https://wol.jw.org/pt/wol/b/r5/lp-t/nwtsty/${bookNum}/${chapter}#v=${bookNum}:${chapter}:${verse}-${bookNum}:${chapter}:${verse}`
      : `https://wol.jw.org/pt/wol/b/r5/lp-t/nwtsty/${bookNum}/${chapter}`

    // API pública de versículos em JSON
    const apiUrl = `https://wol.jw.org/pt/wol/b/r5/lp-t/nwtsty/${bookNum}/${chapter}/${verse || ''}`
    const r = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 86400 }
    })
    if (r.ok) {
      const data = await r.json()
      return NextResponse.json({ ...data, sourceUrl: endpoint })
    }
    throw new Error('Falha')
  } catch {
    return NextResponse.json({ error: 'Versículo não encontrado', sourceUrl: `https://www.jw.org/pt/biblioteca/biblia/biblia-de-estudo/livros/` })
  }
}
