import { Sun, BookOpen, Calendar, Heart, BookMarked, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function getDailyText() {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/')
    const res = await fetch(`https://wol.jw.org/pt/wol/dt/r5/lp-t/${today}`, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) return null
    const data = await res.json()
    return data
  } catch { return null }
}

export default async function HomePage() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const cards = [
    { href: '/biblia',       icon: BookOpen,   label: 'Bíblia',       desc: 'Ler e ouvir a Bíblia', color: 'bg-blue-600' },
    { href: '/exame-diario', icon: Sun,         label: 'Exame Diário', desc: 'Texto do dia de hoje', color: 'bg-amber-500' },
    { href: '/reunioes',     icon: Calendar,    label: 'Reuniões',     desc: 'Agenda e anotações',   color: 'bg-green-600' },
    { href: '/anotacoes',    icon: BookMarked,  label: 'Anotações',    desc: 'Discursos e programas', color: 'bg-purple-600' },
    { href: '/ministerio',   icon: Heart,       label: 'Ministério',   desc: 'Relatório e motivação', color: 'bg-rose-600' },
    { href: '/leitura',      icon: TrendingUp,  label: 'Leitura',      desc: 'Planos com alarme',    color: 'bg-teal-600' },
  ]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Estudo Pessoal</h1>
        <p className="text-slate-500 text-sm mt-1 capitalize">{dateStr}</p>
      </div>

      {/* Exame do dia — destaque */}
      <Link href="/exame-diario" className="block mb-6">
        <div className="bg-gradient-to-r from-[#1a56a4] to-blue-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sun size={18} className="text-amber-300" />
            <span className="text-sm font-semibold text-blue-100">Exame Diário de Hoje</span>
          </div>
          <p className="font-bold text-lg">Abra o texto do dia</p>
          <p className="text-blue-200 text-sm mt-1">Toque para ler, ouvir e anotar</p>
        </div>
      </Link>

      {/* Grade de seções */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white" />
            </div>
            <div className="font-semibold text-slate-800 text-sm">{label}</div>
            <div className="text-slate-400 text-xs mt-0.5">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
