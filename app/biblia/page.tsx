import Link from "next/link"
import { BIBLE_BOOKS } from "@/lib/bible"

export default function BibliaPage() {
  const at = BIBLE_BOOKS.filter(b => b.testament === "AT")
  const nt = BIBLE_BOOKS.filter(b => b.testament === "NT")
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Bíblia</h1>
      {[{ label: "Escrituras Hebraico-Aramaicas", books: at }, { label: "Escrituras Gregas Cristãs", books: nt }].map(({ label, books }) => (
        <div key={label} className="mb-8">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{label}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {books.map(b => (
              <Link key={b.id} href={`/biblia/${b.id.toLowerCase()}/1`}
                className="bg-white border border-slate-100 rounded-xl px-4 py-3 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="font-medium text-slate-800 text-sm">{b.name}</div>
                <div className="text-slate-400 text-xs mt-0.5">{b.chapters} capítulos</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
