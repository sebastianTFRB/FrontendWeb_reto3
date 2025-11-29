import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, type ReactNode } from 'react'
import { SparklesIcon } from '../../shared/components/icons/SparklesIcon'
import { useAuth } from '../../shared/hooks/useAuth'

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
  const { token, user, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !token) {
      navigate('/auth', { replace: true })
    }
  }, [token, loading, navigate])

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p>Redirigiendo al inicio de sesion...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-32 h-72 w-72 rounded-full bg-red-600/12 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 h-80 w-80 rounded-full bg-red-600/12 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-red-600/30 bg-black/40 p-4 backdrop-blur lg:w-64 lg:self-start">
          <div className="flex items-center gap-3 rounded-xl border border-red-600/30 bg-gradient-to-r from-red-700/30 to-red-500/30 px-4 py-3 shadow-lg shadow-red-900/30">
            <div className="rounded-full bg-red-600/30 p-2 text-red-200">
              <SparklesIcon />
            </div>
            <div>
              <p className="text-sm text-gray-300">Full House</p>
              <p className="font-semibold text-white">Lead Agent</p>
              {user ? <p className="text-xs text-gray-300">{user.email}</p> : null}
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
                      ? 'bg-gradient-to-r from-red-600/30 to-red-500/30 text-white shadow shadow-red-900/30'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white',
                  ].join(' ')
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => logout()}
            className="mt-6 w-full rounded-xl border border-red-600/30 bg-black/30 px-3 py-2 text-sm font-semibold text-white transition hover:border-red-500 hover:text-red-100"
          >
            Cerrar sesion
          </button>
          <div className="mt-6 rounded-xl border border-red-600/30 bg-gradient-to-br from-red-700/20 via-red-500/10 to-red-800/20 p-4">
            <p className="text-sm text-slate-200">Network effect</p>
            <p className="text-sm text-slate-400">Mas inmobiliarias y propiedades = mejor clasificacion automatica.</p>
          </div>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
