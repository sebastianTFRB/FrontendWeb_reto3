import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-600/20 bg-gradient-to-r from-red-900/20 via-black/60 to-red-800/10 px-4 py-3 shadow shadow-red-900/20">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-600/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
          Lead Agent
          <span className="h-1 w-1 rounded-full bg-red-300" />
          Live
        </div>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-200">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}
