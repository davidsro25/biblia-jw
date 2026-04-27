export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"
import { fetchWeeklyMeeting } from "@/lib/wol"

export default async function ReunioesPage() {
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  const inicio = new Date(hoje); inicio.setDate(hoje.getDate() - hoje.getDay() + 1)
  const fim = new Date(inicio); fim.setDate(inicio.getDate() + 6)

  const [reunioes, meeting] = await Promise.allSettled([
    prisma.meeting.findMany({ where: { date: { gte: inicio, lte: fim } }, orderBy: { date: "asc" } }),
    fetchWeeklyMeeting(hoje),
  ])

  const lista = reunioes.status === "fulfilled" ? reunioes.value : []
  const prog = meeting.status === "fulfilled" ? meeting.value : null

  const semanaStr = `${inicio.toLocaleDateString("pt-BR",{day:"numeric",month:"short"})} – ${fim.toLocaleDateString("pt-BR",{day:"numeric",month:"short",year:"numeric"})}`

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reuniões</h1>
          <p className="text-slate-400 text-xs mt-0.5">{semanaStr}</p>
        </div>
        <a href="/reunioes/nova"
          className="bg-[#1a56a4] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          + Nova
        </a>
      </div>

      {prog && prog.lines.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a56a4] to-blue-500 px-5 py-3">
            <p className="text-white font-semibold text-sm">Programa da Semana</p>
          </div>
          <div className="p-4 space-y-1">
            {prog.lines.map((l, i) => (
              <div key={i} className={
                l.type === "heading"
                  ? "font-bold text-[#1a56a4] text-sm mt-3 first:mt-0"
                  : l.type === "subheading"
                  ? "font-semibold text-slate-700 text-sm mt-2 border-l-2 border-blue-300 pl-2"
                  : "text-slate-600 text-xs pl-3"
              }>{l.text}</div>
            ))}
          </div>
          <div className="px-4 pb-3">
            <a href={`https://wol.jw.org/pt/wol/d/r5/lp-t/${prog.docId}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline">
              Ver no WOL →
            </a>
          </div>
        </div>
      )}

      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Minhas anotações da semana</h2>
      {lista.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center text-slate-400 shadow-sm border border-slate-100">
          <p className="text-sm">Nenhuma reunião registrada esta semana.</p>
          <a href="/reunioes/nova" className="text-blue-500 text-sm hover:underline mt-1 block">Adicionar →</a>
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map(r => (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                  ${r.type === "MEIO_SEMANA" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                  {r.type === "MEIO_SEMANA" ? "Meio de Semana" : "Fim de Semana"}
                </span>
                <span className={`text-xs font-medium ${r.attended ? "text-green-600" : "text-slate-400"}`}>
                  {r.attended ? "✓ Assistida" : "Pendente"}
                </span>
              </div>
              <p className="text-xs text-slate-400">{new Date(r.date).toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"short"})}</p>
              {r.title && <p className="font-medium text-slate-700 text-sm mt-1">{r.title}</p>}
              {r.notes && <p className="text-slate-500 text-sm mt-1">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
