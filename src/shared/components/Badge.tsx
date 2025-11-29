import type { ReactNode } from 'react'

const variants = {
  success: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
  danger: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
  info: 'bg-red-600/20 text-red-100 border-red-500/30',
  neutral: 'bg-white/5 text-slate-100 border-white/10',
}

type BadgeProps = {
  children: ReactNode
  variant?: keyof typeof variants
}

export const Badge = ({ children, variant = 'neutral' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
