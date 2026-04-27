export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"

export default async function MinisterioPage() {
  const hoje = new Date()
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const relatorio = await prisma.ministryReport.findUnique({ where: { month: mesAtual } })

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Ministério</h1>
      <p className="text-slate-500 text-sm mb-6 capitalize">
        {mesAtual.toLocaleDateString("pt-BR", { month:"long", year:"numeric" })}
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
        <h2 className="font-semibold text-slate-700 mb-4">Relatório do Mês</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label:"Horas", value: relatorio?.hours ?? 0, unit:"h" },
            { label:"Publicações", value: relatorio?.placements ?? 0, unit:"" },
            { label:"Vídeos Mostrados", value: relatorio?.videoShown ?? 0, unit:"" },
            { label:"Revisitas", value: relatorio?.returnVisits ?? 0, unit:"" },
            { label:"Estudos Bíblicos", value: relatorio?.bibleStudies ?? 0, unit:"" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#1a56a4]">{value}{unit}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        {relatorio?.notes && (
          <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 mb-4">{relatorio.notes}</p>
        )}
        <a href="/ministerio/editar"
          className="w-full block text-center bg-[#1a56a4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          ✏️ Atualizar Relatório
        </a>
      </div>

      <div className="bg-gradient-to-r from-[#1a56a4] to-blue-500 rounded-2xl p-5 text-white">
        <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-2">Motivação — Romanos 10:14</p>
        <p className="font-medium leading-relaxed">
          "Como, porém, invocarão aquele em quem não creram? Como crerão naquele de quem não ouviram?
          Como ouvirão sem que alguém pregue?"
        </p>
        <p className="text-blue-200 text-xs mt-2">Nova Tradução do Mundo</p>
      </div>
    </div>
  )
}
