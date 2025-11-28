import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur">
      <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">404</p>
      <h1 className="text-3xl font-semibold text-white">Página no encontrada</h1>
      <p className="max-w-xl text-sm text-slate-300">
        No pudimos encontrar la pantalla que buscas. Vuelve al dashboard para
        seguir monitoreando el agente de leads.
      </p>
      <Link to="/app/dashboard" className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg">
        Ir al dashboard
      </Link>
    </div>
  )
}
