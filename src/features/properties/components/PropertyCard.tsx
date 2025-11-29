import type { Property } from '../../../shared/types'
import { Badge } from '../../../shared/components/Badge'
import { formatCurrency, formatDate } from '../../../shared/utils/format'

type PropertyCardProps = {
  property: Property
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/20 p-4 shadow shadow-indigo-500/10 transition hover:-translate-y-1 hover:border-indigo-400/40">
      <div className="flex items-center justify-between">
        <Badge variant="info">{property.status}</Badge>
        <span className="text-xs text-slate-400">{formatDate(property.created_at)}</span>
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-slate-300">{property.location ?? 'Sin ubicacion'}</p>
        <h3 className="text-lg font-semibold text-white">{property.title}</h3>
        {property.description ? <p className="text-sm text-slate-300">{property.description}</p> : null}
      </div>
      <p className="mt-2 text-indigo-100">{formatCurrency(property.price)}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
        {property.area ? <span>{property.area}</span> : null}
        {property.bedrooms != null ? <span>{property.bedrooms} recamaras</span> : null}
        {property.bathrooms != null ? <span>{property.bathrooms} banos</span> : null}
      </div>
    </div>
  )
}
