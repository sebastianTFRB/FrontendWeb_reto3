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
    <div
      className={`relative min-h-screen ${
        isAgency
          ? 'bg-gradient-to-br from-slate-950 via-black to-slate-950'
          : 'bg-gradient-to-br from-teal-950 via-slate-950 to-black'
      } text-slate-50`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-48 -left-32 h-72 w-72 rounded-full ${
            isAgency ? 'bg-red-600/15' : 'bg-emerald-500/20'
          } blur-3xl`}
        />
        <div
          className={`absolute -bottom-48 -right-24 h-80 w-80 rounded-full ${
            isAgency ? 'bg-red-600/12' : 'bg-cyan-500/15'
          } blur-3xl`}
        />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row">
        <aside
          className={`w-full rounded-2xl border ${
            isAgency ? 'border-red-600/30' : 'border-emerald-500/30'
          } bg-black/40 p-4 backdrop-blur lg:w-72 lg:self-start`}
        >
          <div
            className={`flex items-center gap-3 rounded-xl border ${
              isAgency ? 'border-red-600/30 bg-gradient-to-r from-red-700/30 to-red-500/20' : 'border-emerald-500/30 bg-gradient-to-r from-emerald-700/30 to-teal-500/20'
            } px-4 py-3 shadow-lg ${isAgency ? 'shadow-red-900/30' : 'shadow-emerald-900/30'}`}
          >
            <div
              className={`rounded-full ${isAgency ? 'bg-red-600/30 text-red-200' : 'bg-emerald-500/30 text-emerald-100'} p-2`}
            >
              <SparklesIcon />
            </div>
            <div>
              <p className="text-sm text-gray-300">Full House</p>
              <p className="font-semibold text-white">
                {isAgency ? 'Panel Agencia' : 'Explorador de Compras'}
              </p>
              {user ? <p className="text-xs text-gray-300">{user.email}</p> : null}
            </div>
          </div>
          <nav className="mt-6 flex flex-col gap-1">
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
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? isAgency
                        ? 'bg-gradient-to-r from-red-600/30 to-red-500/30 text-white shadow shadow-red-900/30'
                        : 'bg-gradient-to-r from-emerald-600/30 to-cyan-500/30 text-white shadow shadow-emerald-900/30'
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
            className={`mt-6 w-full rounded-xl border ${
              isAgency ? 'border-red-600/30' : 'border-emerald-500/30'
            } bg-black/30 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 ${
              isAgency ? 'hover:border-red-500 hover:text-red-100' : 'hover:border-emerald-400 hover:text-emerald-50'
            }`}
          >
            Cerrar sesion
          </button>
          <div
            className={`mt-6 rounded-xl border ${
              isAgency ? 'border-red-600/30 bg-gradient-to-br from-red-700/20 via-red-500/10 to-red-800/20' : 'border-emerald-500/30 bg-gradient-to-br from-emerald-700/15 via-teal-500/10 to-cyan-600/20'
            } p-4`}
          >
            <p className="text-sm text-slate-200">{isAgency ? 'Network effect' : 'Listo para comprar'}</p>
            <p className="text-sm text-slate-400">
              {isAgency
                ? 'Mas inmobiliarias y propiedades = mejor clasificacion automatica.'
                : 'Completa tu perfil y el asesor te sugiere propiedades en minutos.'}
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
