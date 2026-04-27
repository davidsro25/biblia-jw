"use client"
import { useState } from "react"

type Activity = { id: number; date: string; hours: number; placements: number; videoShown: number; returnVisits: number; notes: string | null }
type Report = { id: number; hours: number; placements: number; videoShown: number; returnVisits: number; bibleStudies: number; notes: string | null } | null
type Goal = { year: number; monthlyHours: number; yearlyHours: number } | null

export default function MinisterioClient({ relatorio, atividades: init, meta: initMeta, mes, mesAtual }: {
  relatorio: Report; atividades: Activity[]; meta: Goal; mes: string; mesAtual: string
}) {
  const [atividades, setAtividades] = useState(init)
  const [meta, setMeta] = useState(initMeta)
  const [showAdd, setShowAdd] = useState(false)
  const [showMeta, setShowMeta] = useState(false)
  const [newHours, setNewHours] = useState("")
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0])
  const [newPub, setNewPub] = useState("")
  const [newVideo, setNewVideo] = useState("")
  const [newRevisit, setNewRevisit] = useState("")
  const [newNotes, setNewNotes] = useState("")

  const totalHoras = atividades.reduce((s, a) => s + a.hours, 0)
  const totalPub = atividades.reduce((s, a) => s + a.placements, 0)
  const totalVideo = atividades.reduce((s, a) => s + a.videoShown, 0)
  const totalRevisit = atividades.reduce((s, a) => s + a.returnVisits, 0)
  const pctMes = meta?.monthlyHours ? Math.min(100, Math.round((totalHoras / meta.monthlyHours) * 100)) : 0

  async function addActivity() {
    const r = await fetch("/api/ministerio/atividade", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, hours: parseFloat(newHours)||0, placements: parseInt(newPub)||0, videoShown: parseInt(newVideo)||0, returnVisits: parseInt(newRevisit)||0, notes: newNotes||null })
    })
    const a = await r.json()
    setAtividades([...atividades, a].sort((a,b) => a.date.localeCompare(b.date)))
    setShowAdd(false); setNewHours(""); setNewPub(""); setNewVideo(""); setNewRevisit(""); setNewNotes("")
  }

  async function saveMeta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const r = await fetch("/api/ministerio/meta", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: new Date().getFullYear(), monthlyHours: parseFloat(fd.get("monthlyHours") as string)||0, yearlyHours: parseFloat(fd.get("yearlyHours") as string)||0 })
    })
    setMeta(await r.json()); setShowMeta(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ministério</h1>
          <p className="text-slate-500 text-sm capitalize">{mes}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowMeta(true)} className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200">🎯 Metas</button>
          <a href="/ministerio/editar" className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200">📋 Relatório</a>
        </div>
      </div>

      {/* Resumo do mês */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700 text-sm">Totais do Mês</h2>
          {meta && <span className="text-xs text-slate-400">Meta: {meta.monthlyHours}h/mês • {meta.yearlyHours}h/ano</span>}
        </div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[{l:"Horas",v:totalHoras,u:"h"},{l:"Publicações",v:totalPub,u:""},{l:"Vídeos",v:totalVideo,u:""},{l:"Revisitas",v:totalRevisit,u:""}].map(({l,v,u}) => (
            <div key={l} className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-[#1a56a4]">{v}{u}</div>
              <div className="text-xs text-slate-500 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        {meta?.monthlyHours > 0 && (
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Meta mensal</span><span>{totalHoras}h / {meta.monthlyHours}h — {pctMes}%</span>
            </div>
            <div className="bg-slate-100 rounded-full h-2">
              <div className="bg-[#1a56a4] h-2 rounded-full transition-all" style={{width:`${pctMes}%`}} />
            </div>
          </div>
        )}
      </div>

      {/* Atividades do dia */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-700 text-sm">Atividades por Dia</h2>
        <button onClick={() => setShowAdd(true)} className="bg-[#1a56a4] text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-blue-700">+ Adicionar</button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-4 mb-4 space-y-3">
          <h3 className="font-medium text-slate-700 text-sm">Nova Atividade</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-500">Data</label><input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} className="w-full mt-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" /></div>
            <div><label className="text-xs text-slate-500">Horas</label><input type="number" step="0.5" min="0" value={newHours} onChange={e=>setNewHours(e.target.value)} placeholder="0.5" className="w-full mt-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" /></div>
            <div><label className="text-xs text-slate-500">Publicações</label><input type="number" min="0" value={newPub} onChange={e=>setNewPub(e.target.value)} placeholder="0" className="w-full mt-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" /></div>
            <div><label className="text-xs text-slate-500">Vídeos</label><input type="number" min="0" value={newVideo} onChange={e=>setNewVideo(e.target.value)} placeholder="0" className="w-full mt-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" /></div>
            <div><label className="text-xs text-slate-500">Revisitas</label><input type="number" min="0" value={newRevisit} onChange={e=>setNewRevisit(e.target.value)} placeholder="0" className="w-full mt-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" /></div>
          </div>
          <input value={newNotes} onChange={e=>setNewNotes(e.target.value)} placeholder="Observações (opcional)" className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
          <div className="flex gap-2">
            <button onClick={addActivity} className="flex-1 bg-[#1a56a4] text-white py-2 rounded-lg text-sm font-medium">Salvar</button>
            <button onClick={()=>setShowAdd(false)} className="px-4 bg-slate-100 rounded-lg text-sm text-slate-600">Cancelar</button>
          </div>
        </div>
      )}

      {atividades.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center text-slate-400 shadow-sm border border-slate-100">
          <p className="text-sm">Nenhuma atividade registrada este mês.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {atividades.map(a => (
            <div key={a.id} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString("pt-BR",{weekday:"short",day:"numeric",month:"short"})}</span>
                {a.notes && <p className="text-xs text-slate-400 mt-0.5">{a.notes}</p>}
              </div>
              <div className="flex gap-3 text-xs text-slate-600">
                {a.hours > 0 && <span className="font-semibold text-[#1a56a4]">{a.hours}h</span>}
                {a.placements > 0 && <span>{a.placements} pub</span>}
                {a.videoShown > 0 && <span>{a.videoShown} vid</span>}
                {a.returnVisits > 0 && <span>{a.returnVisits} rev</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de metas */}
      {showMeta && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-slate-800 mb-4">Definir Metas</h2>
            <form onSubmit={saveMeta} className="space-y-3">
              <div><label className="text-sm text-slate-600">Horas mensais</label><input type="number" name="monthlyHours" step="0.5" defaultValue={meta?.monthlyHours??0} className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="text-sm text-slate-600">Horas anuais</label><input type="number" name="yearlyHours" step="0.5" defaultValue={meta?.yearlyHours??0} className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#1a56a4] text-white py-2 rounded-xl text-sm font-medium">Salvar</button>
                <button type="button" onClick={()=>setShowMeta(false)} className="px-4 bg-slate-100 rounded-xl text-sm">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gradient-to-r from-[#1a56a4] to-blue-500 rounded-2xl p-5 text-white">
        <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-2">Romanos 10:14 — NWT</p>
        <p className="font-medium leading-relaxed text-sm">
          "Como, porém, invocarão aquele em quem não creram? Como crerão naquele de quem não ouviram?
          Como ouvirão sem que alguém pregue?"
        </p>
      </div>
    </div>
  )
}
