import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Lead Agent</p>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}
