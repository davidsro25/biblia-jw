const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
const BASE = "https://wol.jw.org/pt/wol"

function strip(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

async function wfetch(url: string) {
  const r = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store" })
  if (!r.ok) throw new Error(`WOL ${r.status}: ${url}`)
  return r.text()
}

export async function fetchDailyText(date: Date) {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate()
  const html = await wfetch(`${BASE}/dt/r5/lp-t/${y}/${m}/${d}`)

  const docMatch = html.match(/pub-es[^"]*docId-(\d+)/)
  if (!docMatch) throw new Error("docId nao encontrado")
  const anchorMatch = html.match(/pub-es[^"]*href="[^"]+\?#h=(\d+):\d+-(\d+):\d+"/)
  const pStart = anchorMatch ? parseInt(anchorMatch[1]) : null
  const pEnd = anchorMatch ? parseInt(anchorMatch[2]) : null

  const docHtml = await wfetch(`${BASE}/d/r5/lp-t/${docMatch[1]}`)

  let verse = ""
  const verseRe = /id="p(\d+)"[^>]*class="[^"]*themeScrp[^"]*"[^>]*>([\s\S]*?)<\/p>/g
  let mv: RegExpExecArray | null
  while ((mv = verseRe.exec(docHtml)) !== null) {
    const pid = parseInt(mv[1])
    if (!pStart || (pid > pStart && pid <= pStart + 3)) {
      verse = strip(mv[2]); break
    }
  }

  const sbRe = /id="p(\d+)"[^>]*class="[^"]*\bsb\b[^"]*"[^>]*>([\s\S]*?)<\/p>/g
  const paragraphs: string[] = []
  while ((mv = sbRe.exec(docHtml)) !== null) {
    const pid = parseInt(mv[1])
    if (pStart && pEnd && pid >= pStart && pid <= pEnd + 2) {
      const text = strip(mv[2])
      if (text.length > 30) paragraphs.push(text)
    }
  }

  return { verse, content: paragraphs.join("\n\n") }
}

export async function fetchWeeklyMeeting(date: Date) {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate()
  const html = await wfetch(`${BASE}/dt/r5/lp-t/${y}/${m}/${d}`)

  const mwbMatch = html.match(/pub-mwb[^"]*docId-(\d+)/)
  if (!mwbMatch) throw new Error("mwb nao encontrado")

  const docHtml = await wfetch(`${BASE}/d/r5/lp-t/${mwbMatch[1]}`)

  const lines: Array<{ type: "heading" | "subheading" | "item"; text: string }> = []
  const re = /<h1[^>]*>([\s\S]*?)<\/h1>|<h2[^>]*>([\s\S]*?)<\/h2>|<p[^>]*class="[^"]*\bsn\b[^"]*"[^>]*>([\s\S]*?)<\/p>|<p[^>]*class="[^"]*\bs\b[^"]*"[^>]*>([\s\S]*?)<\/p>|<p[^>]*class="[^"]*\bsl\b[^"]*"[^>]*>([\s\S]*?)<\/p>/g
  let mv: RegExpExecArray | null
  while ((mv = re.exec(docHtml)) !== null && lines.length < 80) {
    const raw = mv[1] ?? mv[2] ?? mv[3] ?? mv[4] ?? mv[5] ?? ""
    const text = strip(raw)
    if (!text || text.length < 2) continue
    if (mv[1]) lines.push({ type: "heading", text })
    else if (mv[2]) lines.push({ type: "subheading", text })
    else lines.push({ type: "item", text })
  }

  return { docId: mwbMatch[1], lines }
}

export async function fetchBibleChapter(bookNum: number, chapter: number) {
  const html = await wfetch(`${BASE}/b/r5/lp-t/nwtsty/${bookNum}/${chapter}`)

  const audioPub = html.match(/id="audioPubSym"[^>]*value="([^"]+)"/)
  const audioWolUrl = audioPub ? `${BASE}/b/r5/lp-t/${audioPub[1]}/${bookNum}/${chapter}` : null

  const verseRe = /id="v\d+-\d+-(\d+)-\d+"[^>]*class="v"[^>]*>([\s\S]*?)<\/span>/g
  const verses: Array<{ num: number; text: string; refs: string[] }> = []
  let mv: RegExpExecArray | null
  while ((mv = verseRe.exec(html)) !== null) {
    const num = parseInt(mv[1])
    if (isNaN(num) || num <= 0 || verses.find(v => v.num === num)) continue
    const raw = mv[2]
    const refs: string[] = []
    const refRe = /class="b"[^>]*>([^<]+)</g
    let rm: RegExpExecArray | null
    while ((rm = refRe.exec(raw)) !== null) refs.push(rm[1])
    const text = raw.replace(/<a[^>]*class="[^"]*\b(vl|vx|vp|cl)\b[^"]*"[^>]*>.*?<\/a>/g, "")
                    .replace(/<a[^>]*class="[^"]*\bb\b[^"]*"[^>]*>.*?<\/a>/g, "")
                    .replace(/<a[^>]*class="fn"[^>]*>.*?<\/a>/g, "")
                    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    verses.push({ num, text, refs })
  }

  return { audioWolUrl, verses }
}

export async function searchWOL(query: string) {
  const html = await wfetch(`${BASE}/s/r5/lp-t?q=${encodeURIComponent(query)}&p=par`)
  const results: Array<{ title: string; snippet: string; href: string; source: string }> = []

  const listRe = /class="searchResult[^"]*"[^>]*>([\s\S]*?)<\/li>[\s\S]{0,200}?class="ref"[^>]*>([\s\S]*?)<\/li>/g
  let mv: RegExpExecArray | null
  while ((mv = listRe.exec(html)) !== null && results.length < 10) {
    const item = mv[1]
    const source = strip(mv[2])
    const href = (item.match(/href="(\/pt\/wol\/d\/[^"?]+)/) ?? [])[1] ?? ""
    const snip = strip(item.replace(/<span[^>]*class="parNum"[^>]*>.*?<\/span>/g, ""))
    if (snip.length > 15) {
      results.push({ title: source || snip.slice(0, 80), snippet: snip.slice(0, 300), href, source })
    }
  }
  return results
}
