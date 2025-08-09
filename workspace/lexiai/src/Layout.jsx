import { Link, useLocation } from 'react-router-dom'
import { FileText, Search } from 'lucide-react'
import { createPageUrl } from './utils/index.js'

export default function Layout({ children }) {
  const location = useLocation()

  const links = [
    { to: createPageUrl('Cases'), label: 'Cases' },
    { to: createPageUrl('Research'), label: 'Legal Research' },
    { to: createPageUrl('Generator'), label: 'Document Generator' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-[var(--navy)]" />
            <span className="font-bold text-[var(--navy)]">LexiAI</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded-md hover:bg-slate-100 ${location.pathname === l.to ? 'text-[var(--navy)] font-medium' : 'text-slate-600'}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 text-xs text-slate-500 p-3 text-center bg-white/60">© LexiAI</footer>
    </div>
  )
}