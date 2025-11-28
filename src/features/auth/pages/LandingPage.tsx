import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, BotMessageSquare, Sparkles } from 'lucide-react'

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-24 h-96 w-96 rounded-full bg-pink-600/20 blur-3xl" />
        <div className="absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 p-2 shadow-lg shadow-pink-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pink-200">Full House</p>
            <p className="text-lg font-semibold text-white">Lead Agent</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link
            to="/auth/login"
            className="rounded-full border border-white/15 px-4 py-2 text-slate-200 transition hover:border-pink-400 hover:text-white"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/auth/register"
            className="rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-white shadow shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Crear cuenta
          </Link>
        </div>
      </header>

      <main className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-pink-200">Reto 3 · Agente</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Encuentra, clasifica y prioriza leads inmobiliarios con IA
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            El agente detecta presupuesto, zona preferida y urgencia. Clasifica automáticamente en
            A/B/C y sugiere acciones para cerrar más rápido.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Probar ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-pink-400 hover:text-white"
            >
              Ver dashboard
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Clasifica A/B/C', desc: 'Intención real y urgencia', icon: <Zap className="h-5 w-5" /> },
              { title: 'Propiedades curadas', desc: 'Scrapings + precios', icon: <ShieldCheck className="h-5 w-5" /> },
              { title: 'Network effect', desc: 'Más inmobiliarias → mejor modelo', icon: <BotMessageSquare className="h-5 w-5" /> },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur"
              >
                <div className="flex items-center gap-2 text-pink-200">{item.icon}<span className="text-sm font-semibold text-white">{item.title}</span></div>
                <p className="text-xs text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-pink-600/30 blur-3xl" />
          <div className="absolute -right-16 -bottom-14 h-28 w-28 rounded-full bg-purple-600/30 blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-pink-500/10 backdrop-blur">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-pink-200">Demo</p>
                <p className="text-lg font-semibold text-white">Panel del agente</p>
              </div>
              <Link
                to="/auth/login"
                className="rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Entrar
              </Link>
            </div>
            <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Leads clasificados</span>
                <span className="font-semibold text-white">148</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Distribución A/B/C</span>
                <span className="text-pink-200">46 / 62 / 40</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Eficiencia del agente</span>
                <span className="font-semibold text-emerald-300">82%</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Tiempo ahorrado</span>
                <span className="font-semibold text-white">3m17s</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
