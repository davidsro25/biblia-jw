"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NovaReuniaoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    await fetch("/api/reunioes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: fd.get("date"),
        type: fd.get("type"),
        title: fd.get("title"),
        program: fd.get("program"),
        notes: fd.get("notes"),
        attended: fd.get("attended") === "on",
      }),
    })
    router.push("/reunioes")
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <a href="/reunioes" className="text-blue-600 hover:underline text-sm">← Reuniões</a>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Nova Reunião</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Data</label>
          <input type="date" name="date" required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
          <select name="type" required
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="MEIO_SEMANA">Reunião de Meio de Semana</option>
            <option value="FIM_SEMANA">Reunião de Fim de Semana</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Título / Tema</label>
          <input type="text" name="title" placeholder="Ex: Vida e Ministério Cristão"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Programa</label>
          <textarea name="program" rows={3} placeholder="Discursos, partes, canções…"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Minhas anotações</label>
          <textarea name="notes" rows={4} placeholder="Pontos que me tocaram, aplicações…"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="attended" id="attended" className="rounded" defaultChecked />
          <label htmlFor="attended" className="text-sm text-slate-600">Assisti a esta reunião</label>
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-[#1a56a4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
          {saving ? "Salvando…" : "Salvar Reunião"}
        </button>
      </form>
    </div>
  )
}
