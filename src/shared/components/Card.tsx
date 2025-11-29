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
      className={`rounded-2xl bg-gradient-to-br from-red-900/40 via-black/60 to-black/80 border border-red-600/30 p-4 shadow-lg shadow-red-900/30 ${className}`}
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
