import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Home,
  LineChart,
  Users
} from 'lucide-react'

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-black text-slate-50">
      {/* Fondos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-24 h-96 w-96 rounded-full bg-red-600/15 blur-3xl" />
        <div className="absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-red-600/15 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-red-600 to-red-700 p-2 shadow-lg shadow-red-900/30">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-red-300">Full House</p>
              <p className="text-lg font-semibold text-white">Lead Agent</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
              <ShieldCheck className="h-3 w-3 text-emerald-300" />
              Pensado para equipos inmobiliarios
            </span>

            <div className="flex items-center gap-3 text-sm font-semibold">
              <Link
                to="/auth/login"
                className="rounded-full border border-red-600/40 px-4 py-2 text-slate-200 transition hover:border-red-400 hover:bg-red-600/10 hover:text-white"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white shadow shadow-red-900/40 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Crear cuenta
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="relative mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Columna izquierda */}
          <section className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-red-200">
              <Zap className="h-3 w-3" />
              Lead Agent impulsado por IA
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Convierte leads inmobiliarios en cierres reales, sin perder tiempo.
              </h1>
              <p className="max-w-xl text-base sm:text-lg text-slate-300">
                Analizamos cada lead con IA, detectando presupuesto, zona, urgencia y nivel de intención.
                Priorizamos dependiendo la urgencia y te sugerimos el siguiente paso para que tu equipo se enfoque solo en
                las oportunidades con más probabilidad de cierre.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 text-sm font-semibold text-white shadow shadow-red-900/30 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Probar ahora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-red-600/30 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-red-400 hover:bg-white/5 hover:text-white"
              >
                Ver dashboard demo
            </Link>
            </div>

            {/* Beneficios rápidos */}
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: 'Clasificación A/B/C',
                  desc: 'Intención real, prioridad y urgencia.',
                  icon: <Zap className="h-5 w-5" />,
                },
                {
                  title: 'Contexto del mercado',
                  desc: 'Propiedades y precios alineados al lead.',
                  icon: <LineChart className="h-5 w-5" />,
                },
                {
                  title: 'Para agencias y equipos',
                  desc: 'Múltiples usuarios, mismo panel.',
                  icon: <Users className="h-5 w-5" />,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-red-600/25 bg-black/40 p-3 backdrop-blur transition hover:border-red-400/60 hover:bg-black/60"
                >
                  <div className="flex items-center gap-2 text-red-200">
                    {item.icon}
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Franja para agencias */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200 sm:text-sm">
              <p className="font-semibold text-white">¿Tienes una agencia inmobiliaria?</p>
              <p className="text-slate-300">
                Crea tu cuenta como <span className="font-semibold text-red-200">agencia</span>, asigna agentes, centraliza todos los leads y
                deja que el sistema priorice por ti. Menos Excel, más cierres.
              </p>
            </div>
          </section>

          {/* Columna derecha - Card demo */}
          <section className="relative">
            <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-red-600/30 blur-3xl" />
            <div className="absolute -right-16 -bottom-14 h-28 w-28 rounded-full bg-red-600/30 blur-3xl" />

            <div className="relative rounded-3xl border border-red-600/30 bg-black/40 p-4 shadow-2xl shadow-red-900/25 backdrop-blur">
              {/* Header card */}
              <div className="flex items-center justify-between rounded-2xl border border-red-600/35 bg-gradient-to-r from-black via-black to-red-950/60 px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-red-200">Demo en tiempo real</p>
                  <p className="text-lg font-semibold text-white">Panel del agente</p>
                  <p className="text-xs text-slate-300">
                    Vista resumida de cómo se ve tu día con Lead Agent.
                  </p>
                </div>
                <Link
                  to="/auth/login"
                  className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-semibold text-white shadow shadow-red-900/40 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Entrar al panel
                </Link>
              </div>

              {/* Métricas principales */}
              <div className="mt-4 grid gap-3 rounded-2xl border border-red-600/30 bg-black/40 p-4 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <span>Leads analizados este mes</span>
                  <span className="font-semibold text-white">148</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Distribución segun la urgencia</span>
                  <span className="text-red-200 font-medium">46 / 62 / 40</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Eficiencia del agente</span>
                  <span className="font-semibold text-emerald-300">+82%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tiempo ahorrado por lead</span>
                  <span className="font-semibold text-white">3m 17s</span>
                </div>
              </div>

              {/* Lista mini de leads */}
              <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Próximos leads recomendados
                </p>

                {[
                  {
                    name: 'Laura · A',
                    info: 'Busca 3 habitaciones en zona norte · Alta urgencia',
                    tag: 'Prioridad hoy',
                  },
                  {
                    name: 'Carlos · B',
                    info: 'Interesado en inversión, rango medio',
                    tag: 'Contactar esta semana',
                  },
                  {
                    name: 'Mariana · C',
                    info: 'Explorando opciones, aún comparando',
                    tag: 'Seguimiento suave',
                  },
                ].map((lead) => (
                  <div
                    key={lead.name}
                    className="flex items-start justify-between rounded-xl bg-black/40 px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{lead.name}</p>
                      <p className="text-[11px] text-slate-300">{lead.info}</p>
                    </div>
                    <span className="ml-3 rounded-full bg-red-600/20 px-2 py-1 text-[10px] font-medium text-red-100">
                      {lead.tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Aviso de seguridad */}
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="h-3 w-3 text-emerald-300" />
                <span>Datos de prueba. La información real de tus leads se maneja de forma segura y privada.</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
