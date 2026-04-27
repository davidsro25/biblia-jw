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

  let data: { audioWolUrl: string | null; verses: Array<{ num: number; text: string; refs: string[] }> } | null = null
  try { data = await fetchBibleChapter(bookIndex + 1, chapterNum) } catch {}

  const wolUrl = `https://wol.jw.org/pt/wol/b/r5/lp-t/nwtsty/${bookIndex + 1}/${chapterNum}`

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-5 text-sm">
        <Link href="/biblia" className="text-blue-600 hover:underline">Bíblia</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600">{bookInfo.name}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
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

      {/* Áudio */}
      <div className="flex gap-3 mb-4">
        <a href={data?.audioWolUrl ?? wolUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
          🔊 Ouvir no WOL
        </a>
        <a href={wolUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm hover:bg-slate-100 transition-colors">
          📖 Abrir no WOL
        </a>
      </div>

      {/* Navegação de capítulos */}
      <div className="flex gap-1 flex-wrap mb-5">
        {Array.from({ length: bookInfo.chapters }, (_, i) => i + 1).map(n => (
          <Link key={n} href={`/biblia/${book}/${n}`}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${n === chapterNum ? "bg-[#1a56a4] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {n}
          </Link>
        ))}
      </div>

      {data && data.verses.length > 0 ? (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          {data.verses.map(v => (
            <div key={v.num} className="group">
              <p className="text-slate-700 text-sm leading-relaxed">
                <sup className="text-[#1a56a4] font-bold mr-1 text-xs">{v.num}</sup>
                {v.text}
              </p>
              {v.refs.length > 0 && (
                <div className="mt-1 pl-4 flex flex-wrap gap-1">
                  {v.refs.map((ref, ri) => (
                    <span key={ri} className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">{ref}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
          <p>Capítulo não disponível.</p>
          <a href={wolUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline mt-2 block">
            Abrir no WOL →
          </a>
        </div>
      )}
    </div>
  )
}
