export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"

export default async function ReunioesPage() {
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  const inicio = new Date(hoje); inicio.setDate(hoje.getDate() - hoje.getDay())
  const fim = new Date(inicio); fim.setDate(inicio.getDate() + 6)

  const reunioes = await prisma.meeting.findMany({
    where: { date: { gte: inicio, lte: fim } },
    orderBy: { date: "asc" }
  })

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reuniões</h1>
        <a href="/reunioes/nova"
          className="bg-[#1a56a4] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          + Nova
        </a>
      </div>
      <div className="mb-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Esta semana</h2>
        {reunioes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
            <p>Nenhuma reunião registrada esta semana.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reunioes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2
                      ${r.type === "MEIO_SEMANA" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                      {r.type === "MEIO_SEMANA" ? "Meio de Semana" : "Fim de Semana"}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(r.date).toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"short" })}
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${r.attended ? "text-green-600" : "text-slate-400"}`}>
                    {r.attended ? "✓ Assistida" : "Pendente"}
                  </span>
                </div>
                {r.title && <p className="font-medium text-slate-700 text-sm">{r.title}</p>}
                {r.notes && <p className="text-slate-500 text-sm mt-1">{r.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
