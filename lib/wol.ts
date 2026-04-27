// Scraping helpers para wol.jw.org
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
const BASE = "https://wol.jw.org/pt/wol"

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function cleanContent(html: string) {
  // Remove links externos, mantém texto
  return html
    .replace(/<a[^>]*class="[^"]*\b(b|fn)\b[^"]*"[^>]*>.*?<\/a>/g, "")
    .replace(/<a[^>]*href="\/pt\/wol\/dx[^"]*"[^>]*>(.*?)<\/a>/g, "$1")
    .replace(/<a[^>]*href="\/pt\/wol\/bc[^"]*"[^>]*>(.*?)<\/a>/g, "")
    .trim()
}

export async function fetchDailyText(date: Date) {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const url = `${BASE}/dt/r5/lp-t/${y}/${m}/${d}`
  const res = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store" })
  if (!res.ok) throw new Error("WOL dt failed")
  const html = await res.text()

  // Extrair docId do exame do dia (pub-es)
  const docMatch = html.match(/pub-es[^"]*docId-(\d+)/)
  if (!docMatch) throw new Error("docId não encontrado")
  const docId = docMatch[1]

  // Extrair a âncora dos parágrafos do dia
  const anchorMatch = html.match(/pub-es[^\n]*href="[^"]+\?#h=(\d+):\d+-(\d+):\d+"/)
  const pStart = anchorMatch ? parseInt(anchorMatch[1]) : null

  // Buscar documento completo
  const docUrl = `${BASE}/d/r5/lp-t/${docId}`
  const docRes = await fetch(docUrl, { headers: { "User-Agent": UA }, cache: "no-store" })
  if (!docRes.ok) throw new Error("WOL doc failed")
  const docHtml = await docRes.text()

  // Extrair versículo tema (themeScrp) do dia
  const verses: string[] = []
  const verseRe = /<p[^>]*id="p(\d+)"[^>]*class="themeScrp"[^>]*>([\s\S]*?)<\/p>/g
  let m2
  while ((m2 = verseRe.exec(docHtml)) !== null) {
    const pid = parseInt(m2[1])
    if (!pStart || (pid >= pStart && pid <= pStart + 5)) {
      verses.push(stripHtml(m2[2]))
    }
  }

  // Extrair parágrafos do comentário
  const paragraphs: string[] = []
  const pRe = /<p[^>]*id="p(\d+)"[^>]*class="[^"]*\bsn\b[^"]*"[^>]*>([\s\S]*?)<\/p>/g
  while ((m2 = pRe.exec(docHtml)) !== null) {
    const pid = parseInt(m2[1])
    if (!pStart || (pid >= pStart && pid <= pStart + 8)) {
      const text = stripHtml(m2[2])
      if (text.length > 20) paragraphs.push(text)
    }
  }

  return {
    verse: verses[0] ?? "",
    allVerses: verses,
    content: paragraphs.join("\n\n"),
    docId,
  }
}

export async function fetchBibleChapter(bookNum: number, chapter: number) {
  const url = `${BASE}/b/r5/lp-t/nwtsty/${bookNum}/${chapter}`
  const res = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store" })
  if (!res.ok) throw new Error("WOL Bible failed")
  const html = await res.text()

  // Extrair título do capítulo
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/)
  const title = titleMatch ? stripHtml(titleMatch[1]) : ""

  // Extrair versículos limpando links
  const verseRe = /<span[^>]*id="v\d+-\d+-(\d+)-\d+"[^>]*class="v"[^>]*>([\s\S]*?)<\/span>/g
  const verses: Array<{ num: number; text: string }> = []
  let m2
  while ((m2 = verseRe.exec(html)) !== null) {
    const num = parseInt(m2[1])
    if (!isNaN(num) && num > 0) {
      const text = stripHtml(cleanContent(m2[2]))
      if (text && !verses.find(v => v.num === num)) {
        verses.push({ num, text })
      }
    }
  }

  return { title, verses }
}

export async function searchWOL(query: string) {
  const url = `${BASE}/s/r5/lp-t?q=${encodeURIComponent(query)}&p=par`
  const res = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store" })
  if (!res.ok) return []
  const html = await res.text()

  // Extrair resultados
  const results: Array<{ title: string; snippet: string; href: string }> = []
  const itemRe = /<article[^>]*class="[^"]*resultItem[^"]*"[^>]*>([\s\S]*?)<\/article>/g
  let m
  while ((m = itemRe.exec(html)) !== null && results.length < 10) {
    const item = m[1]
    const titleMatch = item.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)
    const snippetMatch = item.match(/<p[^>]*class="[^"]*synopsis[^"]*"[^>]*>([\s\S]*?)<\/p>/)
    const hrefMatch = item.match(/<a[^>]*href="([^"]+)"/)
    if (titleMatch && hrefMatch) {
      results.push({
        title: stripHtml(titleMatch[1]),
        snippet: snippetMatch ? stripHtml(snippetMatch[1]) : "",
        href: hrefMatch[1],
      })
    }
  }
  return results
}
