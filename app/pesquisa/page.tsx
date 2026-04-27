export const dynamic = "force-dynamic"

async function searchJW(query: string) {
  if (!query) return []
  try {
    const res = await fetch(
      `https://wol.jw.org/pt/wol/s/r5/lp-t?q=${encodeURIComponent(query)}&p=par`,
      { headers: { Accept: "application/json" }, cache: "no-store" }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data?.results?.slice(0, 10) ?? []
  } catch { return [] }
}

export default async function PesquisaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const results = await searchJW(q ?? "")

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Pesquisa</h1>
      <form method="GET" className="flex gap-2 mb-6">
        <input name="q" defaultValue={q} placeholder="Pesquisar artigos, temas, versículos…"
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
          {results.map((r: { url?: string; title?: string; snippet?: string; caption?: string }, i: number) => (
            <a key={i} href={`https://wol.jw.org${r.url ?? ""}`} target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <p className="font-semibold text-[#1a56a4] text-sm">{r.title ?? r.caption}</p>
              {r.snippet && <p className="text-slate-500 text-xs mt-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: r.snippet }} />}
              <p className="text-xs text-slate-300 mt-2">wol.jw.org</p>
            </a>
          ))}
        </div>
      )}
      {!q && (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
          <p className="font-medium text-slate-600">Pesquise artigos do JW.org</p>
          <p className="text-sm mt-1">Digite um assunto, versículo ou palavra-chave acima.</p>
        </div>
      )}
    </div>
  )
}
