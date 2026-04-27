export const dynamic = "force-dynamic"
import { searchWOL } from "@/lib/wol"

export default async function PesquisaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  let results: Array<{ title: string; snippet: string; href: string }> = []
  if (q) {
    try { results = await searchWOL(q) } catch {}
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Pesquisa</h1>
      <form method="GET" className="flex gap-2 mb-6">
        <input name="q" defaultValue={q} placeholder="Pesquisar no JW.org — assuntos, temas, artigos…"
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <button type="submit"
          className="bg-[#1a56a4] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          Buscar
        </button>
      </form>

      {q && results.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
          <p>Nenhum resultado para <strong>"{q}"</strong>.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <a key={i} href={`https://wol.jw.org${r.href}`} target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <p className="font-semibold text-[#1a56a4] text-sm">{r.title}</p>
              {r.snippet && <p className="text-slate-500 text-xs mt-1">{r.snippet}</p>}
              <p className="text-xs text-slate-300 mt-2">wol.jw.org</p>
            </a>
          ))}
        </div>
      )}

      {!q && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Sugestões</p>
          {["amor de Deus","oração","ressurreição","Armagedom","Reino de Deus","fé","esperança"].map(s => (
            <a key={s} href={`/pesquisa?q=${encodeURIComponent(s)}`}
              className="block bg-white rounded-xl px-4 py-3 text-sm text-slate-700 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              {s}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
