export const dynamic = "force-dynamic"
import { BIBLE_BOOKS } from "@/lib/bible"
import { fetchBibleChapter } from "@/lib/wol"
import Link from "next/link"

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book, chapter } = await params
  const chapterNum = parseInt(chapter)
  const bookIndex = BIBLE_BOOKS.findIndex(b => b.id.toLowerCase() === book.toLowerCase())
  const bookInfo = BIBLE_BOOKS[bookIndex]
  if (!bookInfo) return <div className="p-6">Livro não encontrado.</div>

  let data: { title: string; verses: Array<{ num: number; text: string }> } | null = null
  try { data = await fetchBibleChapter(bookIndex + 1, chapterNum) } catch {}

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-5 text-sm">
        <Link href="/biblia" className="text-blue-600 hover:underline">Bíblia</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600">{bookInfo.name}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-slate-800">{bookInfo.name} {chapterNum}</h1>
        <div className="flex gap-2">
          {chapterNum > 1 && (
            <Link href={`/biblia/${book}/${chapterNum - 1}`}
              className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">← Ant</Link>
          )}
          {chapterNum < bookInfo.chapters && (
            <Link href={`/biblia/${book}/${chapterNum + 1}`}
              className="px-3 py-1.5 bg-[#1a56a4] text-white rounded-lg text-sm hover:bg-blue-700">Próx →</Link>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-5">
        {Array.from({ length: bookInfo.chapters }, (_, i) => i + 1).map(n => (
          <Link key={n} href={`/biblia/${book}/${n}`}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${n === chapterNum ? "bg-[#1a56a4] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {n}
          </Link>
        ))}
      </div>

      {data && data.verses.length > 0 ? (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2">
          {data.verses.map(v => (
            <p key={v.num} className="text-slate-700 text-sm leading-relaxed">
              <sup className="text-[#1a56a4] font-semibold mr-1 text-xs">{v.num}</sup>{v.text}
            </p>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
          <p>Capítulo não disponível no momento.</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <a href={`https://wol.jw.org/pt/wol/b/r5/lp-t/nwtsty/${bookIndex + 1}/${chapterNum}`}
          target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline">
          Abrir no WOL →
        </a>
      </div>
    </div>
  )
}
