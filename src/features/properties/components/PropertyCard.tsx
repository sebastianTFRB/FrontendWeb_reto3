import type { Property } from '../../../shared/types'
import { Badge } from '../../../shared/components/Badge'
import { formatCurrency } from '../../../shared/utils/format'

type PropertyCardProps = {
  property: Property
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 shadow shadow-indigo-500/10 transition hover:-translate-y-1 hover:border-indigo-400/40">
      <div className="relative h-40 overflow-hidden rounded-t-2xl">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge variant="info">{property.type}</Badge>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          <span className="font-semibold">{property.score}/100</span>
          <span className="text-slate-200">match</span>
        </div>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-sm text-slate-300">{property.location}</p>
        <h3 className="text-lg font-semibold text-white">{property.title}</h3>
        <p className="text-indigo-100">{formatCurrency(property.price)}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          <span>{property.bedrooms} recámaras</span>
          <span>{property.bathrooms} baños</span>
          <span>{property.area} m²</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {property.tags?.map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
