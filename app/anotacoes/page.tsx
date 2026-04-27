export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"

const TIPOS = ["TODOS","DISCURSO","PROGRAMA","ASSEMBLEIA","MINISTERIO","LIVRE"]

export default async function AnotacoesPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo } = await searchParams
  const notas = await prisma.note.findMany({
    where: tipo && tipo !== "TODOS" ? { type: tipo } : {},
    orderBy: { date: "desc" },
    take: 50
  })

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Anotações</h1>
        <a href="/anotacoes/nova"
          className="bg-[#1a56a4] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          + Nova
        </a>
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {TIPOS.map(t => (
          <a key={t} href={`/anotacoes${t !== "TODOS" ? `?tipo=${t}` : ""}`}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
              ${(tipo ?? "TODOS") === t ? "bg-[#1a56a4] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </a>
        ))}
      </div>
      {notas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
          <p>Nenhuma anotação encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notas.map(n => (
            <a key={n.id} href={`/anotacoes/${n.id}`}
              className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {n.type.charAt(0) + n.type.slice(1).toLowerCase()}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(n.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-sm mt-1">{n.title}</p>
              <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{n.content}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
