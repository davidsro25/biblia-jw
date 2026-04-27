export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"
import { fetchDailyText } from "@/lib/wol"

async function getOrCreateToday() {
  const today = new Date()
  today.setHours(0,0,0,0)
  let exam = await prisma.dailyExam.findUnique({ where: { date: today } })
  if (!exam) {
    try {
      const data = await fetchDailyText(today)
      exam = await prisma.dailyExam.create({
        data: { date: today, title: "Exame Diário", verse: data.verse, content: data.content }
      })
    } catch (e) {
      console.error("WOL fetch error:", e)
    }
  }
  return exam
}

export default async function ExamePage() {
  const exam = await getOrCreateToday()
  const dateStr = new Date().toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Exame Diário</h1>
        <p className="text-slate-500 text-sm capitalize mt-1">{dateStr}</p>
      </div>
      {exam ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a56a4] to-blue-500 p-5 text-white">
            <div className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-2">Texto do Dia</div>
            <p className="text-base font-medium leading-relaxed italic">"{exam.verse}"</p>
          </div>
          <div className="p-5">
            {exam.content && (
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line mb-5">
                {exam.content}
              </div>
            )}
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">Minhas anotações</label>
              <form action="/api/exame-diario" method="POST">
                <input type="hidden" name="id" value={exam.id} />
                <textarea name="notes" defaultValue={exam.notes ?? ""} rows={5}
                  placeholder="Escreva suas reflexões sobre o texto de hoje…"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <button type="submit"
                  className="mt-2 bg-[#1a56a4] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Salvar anotação
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 shadow-sm border border-slate-100">
          <p className="text-lg">Texto do dia não disponível.</p>
          <p className="text-sm mt-1">Verifique sua conexão com a internet.</p>
        </div>
      )}
    </div>
  )
}
