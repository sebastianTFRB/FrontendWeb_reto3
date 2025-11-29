import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, type ReactNode, useMemo } from 'react'
import { SparklesIcon } from '../../shared/components/icons/SparklesIcon'
import { useAuth } from '../../shared/hooks/useAuth'
import { Building2, Home, MessageSquareText, Rocket, Shield, Target } from 'lucide-react'

type NavItem = {
  label: string
  to: string
  icon?: ReactNode
  roles?: string[]
}

export const AppLayout = () => {
  const { token, user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAgency = useMemo(
    () => user?.role === 'agency_admin' || user?.role === 'superadmin',
    [user?.role]
  )

  useEffect(() => {
    if (!loading && !token) {
      navigate('/auth', { replace: true })
    }
  }, [token, loading, navigate])

  useEffect(() => {
    if (loading || !user) return
    if (!isAgency && location.pathname.startsWith('/app') && location.pathname.match(/\/(dashboard|leads|agent)/)) {
      navigate('/app/properties', { replace: true })
    }
    if (isAgency && location.pathname === '/app/chat') {
      navigate('/app/leads', { replace: true })
    }
  }, [isAgency, location.pathname, loading, navigate, user])

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p>Redirigiendo al inicio de sesion...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-slate-50">
      {/* Capas decorativas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-28 h-80 w-80 rounded-full bg-red-600/25 blur-3xl" />
        <div className="absolute -bottom-52 -right-24 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-red-700/20 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full rounded-2xl border border-red-600/30 bg-black/60 p-5 shadow-2xl shadow-red-900/20 backdrop-blur lg:w-72 lg:self-start">
          <div className="flex items-center justify-between gap-2 rounded-xl border border-red-600/30 bg-gradient-to-r from-red-700/30 via-black/60 to-red-800/30 px-4 py-3 shadow-lg shadow-red-900/30">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-600/40 p-2 text-red-100">
                <SparklesIcon />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-red-200">Full House</p>
                <p className="text-sm font-semibold text-white">
                  {isAgency ? 'Panel Agencia' : 'Explorador de Compras'}
                </p>
                {user ? <p className="text-xs text-slate-300">{user.email}</p> : null}
              </div>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-slate-200">
              Live
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {(isAgency
              ? ([
                  { label: 'Dashboard', to: '/app/dashboard', icon: <Target className="h-4 w-4" /> },
                  { label: 'Leads', to: '/app/leads', icon: <Rocket className="h-4 w-4" /> },
                  { label: 'Propiedades', to: '/app/properties', icon: <Building2 className="h-4 w-4" /> },
                  { label: 'Agente IA', to: '/app/agent', icon: <Shield className="h-4 w-4" /> },
                ] as NavItem[])
              : ([
                  { label: 'Explorar', to: '/app/properties', icon: <Home className="h-4 w-4" /> },
                  { label: 'Chat con asesor', to: '/app/chat', icon: <MessageSquareText className="h-4 w-4" /> },
                ] as NavItem[])
            ).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-red-600/30 to-black/40 text-white shadow shadow-red-900/30 ring-1 ring-red-500/50'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white hover:ring-1 hover:ring-red-500/30',
                  ].join(' ')
                }
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-red-200">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => logout()}
            className="mt-6 w-full rounded-xl border border-red-600/30 bg-gradient-to-r from-red-700/40 via-black/40 to-red-700/40 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-red-400 hover:shadow-lg hover:shadow-red-900/30"
          >
            Cerrar sesion
          </button>

          <div className="mt-6 rounded-xl border border-red-600/30 bg-gradient-to-br from-red-700/25 via-black/40 to-red-800/20 p-4">
            <p className="text-sm font-semibold text-white">
              {isAgency ? 'Network effect' : 'Listo para comprar'}
            </p>
            <p className="text-sm text-slate-300">
              {isAgency
                ? 'Más inmobiliarias y propiedades = mejor clasificación automática.'
                : 'Completa tu perfil y el asesor te sugiere propiedades en minutos.'}
            </p>
          </div>
        </aside>

        <main className="relative flex-1">
          <div className="absolute -top-6 left-0 right-0 h-12 rounded-2xl bg-gradient-to-r from-red-600/15 via-transparent to-red-600/15 blur-3xl" />
          <div className="relative rounded-3xl border border-white/5 bg-black/60 p-4 shadow-xl shadow-black/40 backdrop-blur">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
