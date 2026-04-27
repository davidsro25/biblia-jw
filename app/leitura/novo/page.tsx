"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const TIPOS = ["LIVRO","ASSUNTO","EPOCA","CRONOLOGICO"]

export default function NovoPlanoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    const books = (fd.get("books") as string).split(",").map(b => b.trim()).filter(Boolean)
    await fetch("/api/leitura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"), type: fd.get("type"),
        description: fd.get("description"),
        books, startDate: fd.get("startDate"), endDate: fd.get("endDate"),
        alarmTime: fd.get("alarmTime") || null,
        alarmDays: ["DOM","SEG","TER","QUA","QUI","SEX","SAB"],
      }),
    })
    router.push("/leitura")
  }

  const today = new Date().toISOString().split("T")[0]
  const in30 = new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0]

  return (
    <div className="p-6 max-w-lg mx-auto">
      <a href="/leitura" className="text-blue-600 hover:underline text-sm">← Leitura</a>
      <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-6">Novo Plano de Leitura</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Nome do plano</label>
          <input type="text" name="name" required placeholder="Ex: Evangelhos em 30 dias"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
          <select name="type" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0)+t.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Livros / Assunto</label>
          <input type="text" name="books" placeholder="Ex: Mateus, Marcos, Lucas, João"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <p className="text-xs text-slate-400 mt-1">Separados por vírgula</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Descrição / Meta</label>
          <textarea name="description" rows={2} placeholder="Ex: Ler 2 capítulos por dia"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Início</label>
            <input type="date" name="startDate" required defaultValue={today}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Fim</label>
            <input type="date" name="endDate" required defaultValue={in30}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Alarme diário</label>
          <input type="time" name="alarmTime" defaultValue="07:00"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-[#1a56a4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
          {saving ? "Salvando…" : "Criar Plano"}
        </button>
      </form>
    </div>
  )
}
