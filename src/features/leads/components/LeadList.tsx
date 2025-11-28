import { Link } from 'react-router-dom'
import type { Lead } from '../../../shared/types'
import { Badge } from '../../../shared/components/Badge'
import { formatCurrency, formatDate } from '../../../shared/utils/format'

type LeadListProps = {
  leads: Lead[]
}

const statusColor: Record<Lead['status'], 'success' | 'warning' | 'danger'> = {
  A: 'success',
  B: 'warning',
  C: 'danger',
}

export const LeadList = ({ leads }: LeadListProps) => {
  return (
    <div className="grid gap-3">
      {leads.map((lead) => (
        <Link
          key={lead.id}
          to={`/app/leads/${lead.id}`}
          className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-pink-400/40 hover:bg-pink-500/5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-slate-300">{formatDate(lead.createdAt)}</p>
              <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
              <p className="text-sm text-slate-300">{lead.location}</p>
            </div>
            <Badge variant={statusColor[lead.status]}>
              Lead {lead.status} • {lead.urgency}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="rounded-lg bg-white/5 px-2 py-1 font-semibold text-indigo-100">
              {formatCurrency(lead.budget)}
            </span>
            <span className="rounded-lg bg-white/5 px-2 py-1">Urgencia: {lead.urgency}</span>
            {lead.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 px-2 py-1 text-xs font-semibold text-pink-50"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-200">
            {lead.goal} • {lead.source}
          </p>
        </Link>
      ))}
    </div>
  )
}
