import { Link } from 'react-router-dom'
import type { Lead } from '../../../shared/types'
import { Badge } from '../../../shared/components/Badge'
import { formatCurrency, formatDate, formatUrgency } from '../../../shared/utils/format'

type LeadListProps = {
  leads: Lead[]
}

const categoryColor: Record<Lead['category'], 'success' | 'warning' | 'danger'> = {
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
              <p className="text-sm text-slate-300">{formatDate(lead.created_at)}</p>
              <h3 className="text-lg font-semibold text-white">{lead.full_name}</h3>
              <p className="text-sm text-slate-300">{lead.preferred_area || 'Sin zona'}</p>
            </div>
            <Badge variant={categoryColor[lead.category]}>
              Lead {lead.category} · {formatUrgency(lead.urgency)}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="rounded-lg bg-white/5 px-2 py-1 font-semibold text-indigo-100">
              {lead.budget != null ? formatCurrency(lead.budget) : 'Sin presupuesto'}
            </span>
            <span className="rounded-lg bg-white/5 px-2 py-1">Urgencia: {formatUrgency(lead.urgency)}</span>
            <span className="rounded-lg bg-white/5 px-2 py-1">Estado: {lead.status}</span>
          </div>
          {lead.preferences ? (
            <div className="flex flex-wrap gap-2 text-xs text-slate-200">
              {lead.preferences.tipo_propiedad ? (
                <span className="rounded-full bg-white/5 px-2 py-1">{lead.preferences.tipo_propiedad}</span>
              ) : null}
              {lead.preferences.habitaciones ? (
                <span className="rounded-full bg-white/5 px-2 py-1">{lead.preferences.habitaciones} hab</span>
              ) : null}
              {lead.preferences.banos ? (
                <span className="rounded-full bg-white/5 px-2 py-1">{lead.preferences.banos} baños</span>
              ) : null}
              {lead.preferences.garaje != null ? (
                <span className="rounded-full bg-white/5 px-2 py-1">
                  {lead.preferences.garaje ? 'Quiere garaje' : 'Sin garaje'}
                </span>
              ) : null}
            </div>
          ) : null}
          <p className="text-sm text-slate-200">
            {lead.email ?? 'Sin email'} · {lead.phone ?? 'Sin telefono'}
          </p>
        </Link>
      ))}
    </div>
  )
}
