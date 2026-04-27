export const dynamic = "force-dynamic"
import { BIBLE_BOOKS } from "@/lib/bible"
import Link from "next/link"

async function fetchChapter(bookId: string, chapter: number) {
  try {
    const bookNum = BIBLE_BOOKS.findIndex(b => b.id.toLowerCase() === bookId.toLowerCase()) + 1
    if (!bookNum) return null
    const res = await fetch(
      `https://wol.jw.org/pt/wol/b/r5/lp-t/nwtsty/${bookNum}/${chapter}`,
      { headers: { Accept: "application/json" }, cache: "no-store" }
    )
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book, chapter } = await params
  const chapterNum = parseInt(chapter)
  const bookInfo = BIBLE_BOOKS.find(b => b.id.toLowerCase() === book.toLowerCase())
  if (!bookInfo) return <div className="p-6">Livro não encontrado.</div>

  const data = await fetchChapter(book, chapterNum)

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/biblia" className="text-blue-600 hover:underline text-sm">← Bíblia</Link>
        <span className="text-slate-300">/</span>
        <Link href={`/biblia/${book}/1`} className="text-blue-600 hover:underline text-sm">{bookInfo.name}</Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">{bookInfo.name} {chapterNum}</h1>
        <div className="flex gap-2">
          {chapterNum > 1 && (
            <Link href={`/biblia/${book}/${chapterNum - 1}`}
              className="px-3 py-1 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">← Ant</Link>
          )}
          {chapterNum < bookInfo.chapters && (
            <Link href={`/biblia/${book}/${chapterNum + 1}`}
              className="px-3 py-1 bg-[#1a56a4] text-white rounded-lg text-sm hover:bg-blue-700">Próx →</Link>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: bookInfo.chapters }, (_, i) => i + 1).map(n => (
            <Link key={n} href={`/biblia/${book}/${n}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                ${n === chapterNum ? "bg-[#1a56a4] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {n}
            </Link>
          ))}
        </div>
      </div>
      {data ? (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.content ?? "<p>Conteúdo não disponível.</p>" }} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
          <p>Capítulo não disponível no momento.</p>
          <p className="text-xs mt-1">Verifique sua conexão com a internet.</p>
        </div>
      )}
    </div>
  )
}
