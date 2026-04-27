"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Relatorio = {
  id: number; hours: number; placements: number; videoShown: number;
  returnVisits: number; bibleStudies: number; notes?: string | null
} | null

export default function MinisterioForm({ relatorio, mes, mesAtual }: { relatorio: Relatorio; mes: string; mesAtual: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    const body = {
      month: mesAtual,
      hours: parseFloat(fd.get("hours") as string) || 0,
      placements: parseInt(fd.get("placements") as string) || 0,
      videoShown: parseInt(fd.get("videoShown") as string) || 0,
      returnVisits: parseInt(fd.get("returnVisits") as string) || 0,
      bibleStudies: parseInt(fd.get("bibleStudies") as string) || 0,
      notes: fd.get("notes") as string,
    }
    if (relatorio?.id) {
      await fetch("/api/ministerio", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: relatorio.id, ...body }) })
    } else {
      await fetch("/api/ministerio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    }
    router.push("/ministerio")
  }

  const fields = [
    { name: "hours", label: "Horas", step: "0.5", defaultValue: relatorio?.hours ?? 0 },
    { name: "placements", label: "Publicações", step: "1", defaultValue: relatorio?.placements ?? 0 },
    { name: "videoShown", label: "Vídeos Mostrados", step: "1", defaultValue: relatorio?.videoShown ?? 0 },
    { name: "returnVisits", label: "Revisitas", step: "1", defaultValue: relatorio?.returnVisits ?? 0 },
    { name: "bibleStudies", label: "Estudos Bíblicos", step: "1", defaultValue: relatorio?.bibleStudies ?? 0 },
  ]

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <a href="/ministerio" className="text-blue-600 hover:underline text-sm">← Ministério</a>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Relatório do Ministério</h1>
      <p className="text-slate-500 text-sm mb-6 capitalize">{mes}</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
              <input type="number" name={f.name} step={f.step} min="0"
                defaultValue={f.defaultValue}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Observações</label>
          <textarea name="notes" rows={3} defaultValue={relatorio?.notes ?? ""}
            placeholder="Experiências, metas, reflexões do mês…"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-[#1a56a4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
          {saving ? "Salvando…" : "Salvar Relatório"}
        </button>
      </form>
    </div>
  )
}
