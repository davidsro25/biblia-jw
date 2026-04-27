'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen, Sun, Calendar, PenLine,
  Heart, BookMarked, Search, Home
} from 'lucide-react'

const NAV = [
  { href: '/',              label: 'Início',      icon: Home },
  { href: '/biblia',        label: 'Bíblia',      icon: BookOpen },
  { href: '/exame-diario',  label: 'Exame Diário',icon: Sun },
  { href: '/reunioes',      label: 'Reuniões',    icon: Calendar },
  { href: '/anotacoes',     label: 'Anotações',   icon: PenLine },
  { href: '/ministerio',    label: 'Ministério',  icon: Heart },
  { href: '/leitura',       label: 'Leitura',     icon: BookMarked },
  { href: '/pesquisa',      label: 'Pesquisa',    icon: Search },
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-[#1a56a4] text-white min-h-screen fixed left-0 top-0 z-40 shadow-xl">
        <div className="px-6 py-5 border-b border-blue-700">
          <div className="flex items-center gap-2">
            <BookOpen size={22} className="text-blue-200" />
            <span className="font-bold text-lg tracking-tight">Estudo JW</span>
          </div>
          <p className="text-blue-300 text-xs mt-1">Estudo Pessoal da Bíblia</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? path === '/' : path.startsWith(href)
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-lg mb-0.5 text-sm font-medium transition-all
                  ${active ? 'bg-white text-[#1a56a4]' : 'text-blue-100 hover:bg-blue-700'}`}>
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-blue-700 text-xs text-blue-400">
          biblia.apego.app.br
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex">
        {NAV.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex-1 flex flex-col items-center py-2 text-[10px] font-medium transition-colors
                ${active ? 'text-[#1a56a4]' : 'text-slate-400'}`}>
              <Icon size={20} />
              <span className="mt-0.5">{label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
