"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const TIPOS = ["DISCURSO","PROGRAMA","ASSEMBLEIA","MINISTERIO","LIVRE"]

export default function NovaAnotacaoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    await fetch("/api/anotacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        type: fd.get("type"),
        date: fd.get("date"),
        content,
        tags: (fd.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) ?? [],
      }),
    })
    router.push("/anotacoes")
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <a href="/anotacoes" className="text-blue-600 hover:underline text-sm">← Anotações</a>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Nova Anotação</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
          <select name="type" required
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0)+t.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Título</label>
          <input type="text" name="title" required placeholder="Ex: Discurso público — A esperança da ressurreição"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Data</label>
          <input type="date" name="date" required defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Conteúdo
            <span className="text-slate-400 font-normal ml-1 text-xs">— digite João 3:16 para autocompletar o versículo</span>
          </label>
          <textarea name="content" rows={8} value={content} onChange={e => setContent(e.target.value)}
            placeholder="Escreva aqui. Digite ex: João 3:16 para inserir o versículo"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tags (separadas por vírgula)</label>
          <input type="text" name="tags" placeholder="Ex: fé, oração, assembleia"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-[#1a56a4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
          {saving ? "Salvando…" : "Salvar Anotação"}
        </button>
      </form>
    </div>
  )
}
