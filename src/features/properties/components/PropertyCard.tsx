import type { Property } from '../../../shared/types'
import { Link } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge'
import { formatCurrency, formatDate } from '../../../shared/utils/format'

type PropertyCardProps = {
  property: Property
  onChat?: (property: Property) => void
}

export const PropertyCard = ({ property, onChat }: PropertyCardProps) => {
  const cover = property.photos && property.photos.length > 0 ? property.photos[0] : null
  return (
    <div className="group flex flex-col rounded-2xl border border-red-600/25 bg-gradient-to-br from-black/70 via-red-900/20 to-black/50 p-4 shadow shadow-red-900/25 transition hover:-translate-y-1 hover:border-red-400/50 hover:shadow-xl hover:shadow-red-900/30">
      {cover ? (
        <div className="mb-3 overflow-hidden rounded-xl border border-red-600/25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={property.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <Badge variant="info">{property.status}</Badge>
        <span className="text-xs text-slate-400">{formatDate(property.created_at)}</span>
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-slate-300">{property.location ?? 'Sin ubicacion'}</p>
        <h3 className="text-lg font-semibold text-white">{property.title}</h3>
        <p className="text-xs uppercase tracking-[0.18em] text-red-200">
          {property.property_type ?? 'propiedad'}
        </p>
        {property.description ? <p className="text-sm text-slate-300">{property.description}</p> : null}
      </div>
      <p className="mt-2 text-lg font-semibold text-red-100">{formatCurrency(property.price)}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
        {property.area ? <span className="rounded-lg bg-red-600/10 px-2 py-1 text-red-100">{property.area}</span> : null}
        {property.bedrooms != null ? (
          <span className="rounded-lg bg-white/5 px-2 py-1">{property.bedrooms} hab</span>
        ) : null}
        {property.bathrooms != null ? (
          <span className="rounded-lg bg-white/5 px-2 py-1">{property.bathrooms} baños</span>
        ) : null}
        {property.parking != null ? (
          <span className="rounded-lg bg-white/5 px-2 py-1">{property.parking ? 'Garaje' : 'Sin garaje'}</span>
        ) : null}
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          to={`/app/properties/${property.id}`}
          className="inline-flex items-center justify-center rounded-xl border border-red-600/30 px-3 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:border-red-400 hover:text-white hover:shadow-md hover:shadow-red-900/30"
        >
          Ver detalle
        </Link>
        {onChat ? (
          <button
            type="button"
            onClick={() => onChat(property)}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-3 py-2 text-xs font-semibold text-white shadow shadow-red-900/30 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Hablar con asesor
          </button>
        ) : null}
      </div>
    </div>
  )
}
