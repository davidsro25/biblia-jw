export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"

export default async function LeituraPage() {
  const planos = await prisma.readingPlan.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Leitura</h1>
        <a href="/leitura/novo"
          className="bg-[#1a56a4] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          + Novo Plano
        </a>
      </div>
      {planos.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
          <p className="text-lg font-medium text-slate-600 mb-1">Nenhum plano de leitura</p>
          <p className="text-sm">Crie um plano personalizado por livro, assunto ou época histórica.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {planos.map(p => {
            const total = p.totalDays ?? 1
            const done = p.daysCompleted ?? 0
            const pct = Math.round((done / total) * 100)
            return (
              <a key={p.id} href={`/leitura/${p.id}`}
                className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.type} • {done}/{total} dias</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                    ${p.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.active ? "Ativo" : "Pausado"}
                  </span>
                </div>
                <div className="bg-slate-100 rounded-full h-2 mt-3">
                  <div className="bg-[#1a56a4] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-1">{pct}% concluído</p>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
