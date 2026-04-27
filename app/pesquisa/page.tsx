export const dynamic = "force-dynamic"
import { searchWOL } from "@/lib/wol"

export default async function PesquisaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  let results: Array<{ title: string; snippet: string; href: string; source: string }> = []
  if (q) {
    try { results = await searchWOL(q) } catch {}
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Pesquisa</h1>
      <form method="GET" className="flex gap-2 mb-6">
        <input name="q" defaultValue={q} placeholder="Pesquisar artigos no JW.org…"
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <button type="submit" className="bg-[#1a56a4] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
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
            <a key={i} href={r.href ? `https://wol.jw.org${r.href}` : `https://wol.jw.org/pt/wol/s/r5/lp-t?q=${encodeURIComponent(q??"")}` }
              target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <p className="font-semibold text-[#1a56a4] text-sm leading-snug">{r.title}</p>
              {r.snippet && r.snippet !== r.title && (
                <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-4">{r.snippet}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-300">wol.jw.org</span>
                <span className="text-xs text-blue-400">Ler artigo →</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {!q && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Sugestões</p>
          <div className="grid grid-cols-2 gap-2">
            {["amor de Deus","oração","ressurreição","Armagedom","Reino de Deus","fé e obras","esperança","Jeová","Jesus Cristo","batismo"].map(s => (
              <a key={s} href={`/pesquisa?q=${encodeURIComponent(s)}`}
                className="bg-white rounded-xl px-4 py-3 text-sm text-slate-700 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                {s}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
