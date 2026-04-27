"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

const TIPOS = ["DISCURSO","PROGRAMA","ASSEMBLEIA","MINISTERIO","LIVRE"]

function useVerseAutocomplete(text: string) {
  const [suggestion, setSuggestion] = useState<{ ref: string; text: string } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    clearTimeout(timer.current)
    // Detecta padrão tipo "João 3:16" ou "Jo 3:16" no fim do texto
    const m = text.match(/([1-3]?\s?[A-ZÀ-Úa-zà-ú]+\.?\s+\d+:\d+)\s*$/)
    if (!m) { setSuggestion(null); return }
    const ref = m[1].trim()
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/biblia/versiculo?ref=${encodeURIComponent(ref)}`)
        if (r.ok) { const d = await r.json(); setSuggestion(d) }
        else setSuggestion(null)
      } catch { setSuggestion(null) }
    }, 600)
    return () => clearTimeout(timer.current)
  }, [text])

  return suggestion
}

export default function NovaAnotacaoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const suggestion = useVerseAutocomplete(content)

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const t = tagInput.trim().replace(/,$/, "")
      if (t && !tags.includes(t)) setTags([...tags, t])
      setTagInput("")
    }
  }

  function insertVerse() {
    if (!suggestion) return
    setContent(prev => {
      const m = prev.match(/([1-3]?\s?[A-ZÀ-Úa-zà-ú]+\.?\s+\d+:\d+)\s*$/)
      if (!m) return prev
      const idx = prev.lastIndexOf(m[0])
      return prev.slice(0, idx) + `${suggestion.ref} — "${suggestion.text}" `
    })
    setSuggestion(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    await fetch("/api/anotacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"), type: fd.get("type"),
        date: fd.get("date"), content, tags,
      }),
    })
    router.push("/anotacoes")
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <a href="/anotacoes" className="text-blue-600 hover:underline text-sm">← Anotações</a>
      <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-6">Nova Anotação</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
            <select name="type" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0)+t.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Data</label>
            <input type="date" name="date" required defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Título</label>
          <input type="text" name="title" required placeholder="Ex: Discurso — A esperança da ressurreição"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Conteúdo
            <span className="text-slate-400 font-normal ml-1 text-xs">— digite ex: João 3:16 para inserir versículo</span>
          </label>
          <textarea rows={8} value={content} onChange={e => setContent(e.target.value)}
            placeholder="Escreva suas anotações. Digite uma referência bíblica para autocompletar…"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300" />
          {suggestion && (
            <div className="absolute left-0 right-0 bg-white border border-blue-200 rounded-xl shadow-lg p-3 z-10">
              <p className="text-xs text-blue-600 font-semibold">{suggestion.ref}</p>
              <p className="text-xs text-slate-700 mt-0.5 line-clamp-2">{suggestion.text}</p>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={insertVerse}
                  className="text-xs bg-[#1a56a4] text-white px-3 py-1 rounded-lg">Inserir</button>
                <button type="button" onClick={() => setSuggestion(null)}
                  className="text-xs text-slate-400 hover:text-slate-600">Ignorar</button>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tags</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {t}
                <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="text-blue-400 hover:text-blue-700">×</button>
              </span>
            ))}
          </div>
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
            placeholder="Digite uma tag e pressione Enter"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <p className="text-xs text-slate-400 mt-1">Pressione Enter ou vírgula para adicionar</p>
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-[#1a56a4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
          {saving ? "Salvando…" : "Salvar Anotação"}
        </button>
      </form>
    </div>
  )
}
