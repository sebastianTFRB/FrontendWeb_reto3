import { NavLink, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { SparklesIcon } from '../../shared/components/icons/SparklesIcon'

type NavItem = {
  label: string
  to: string
  icon?: ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/app/dashboard' },
  { label: 'Leads', to: '/app/leads' },
  { label: 'Propiedades', to: '/app/properties' },
  { label: 'Agente', to: '/app/agent' },
]

export const AppLayout = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-32 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:w-64 lg:self-start">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-pink-600/20 to-purple-600/20 px-4 py-3 shadow-lg shadow-pink-500/10">
            <div className="rounded-full bg-pink-500/20 p-2 text-pink-200">
              <SparklesIcon />
            </div>
            <div>
              <p className="text-sm text-slate-300">Full House</p>
              <p className="font-semibold text-white">Lead Agent</p>
            </div>
          </div>
          <nav className="mt-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-white shadow shadow-pink-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  ].join(' ')
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 rounded-xl border border-white/5 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-fuchsia-500/20 p-4">
            <p className="text-sm text-slate-200">Network effect</p>
            <p className="text-sm text-slate-400">
              Más inmobiliarias y propiedades → mejor clasificación automática.
            </p>
          </div>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
