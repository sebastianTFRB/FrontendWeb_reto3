import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export const Card = ({
  title,
  description,
  children,
  action,
  className = '',
}: CardProps) => {
  return (
    <div
      className={`glass rounded-2xl bg-gradient-to-br from-white/5 via-white/0 to-pink-500/10 p-4 shadow-lg shadow-pink-500/10 ${className}`}
    >
      {(title || description || action) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {description && <p className="text-sm text-slate-300">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
