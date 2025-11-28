import { useMemo, useState } from 'react'
import { propertiesMock } from '../../../shared/services/data'
import type { Property, PropertyType } from '../../../shared/types'
import { PageHeader } from '../../../shared/components/PageHeader'
import { PropertyCard } from '../components/PropertyCard'
import { StatCard } from '../../../shared/components/StatCard'

export const PropertiesPage = () => {
  const [type, setType] = useState<PropertyType | 'todas'>('todas')
  const [zoneQuery, setZoneQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  const filtered = useMemo(() => {
    return propertiesMock.filter((property) => {
      const matchesType = type === 'todas' ? true : property.type === type
      const matchesZone = property.location.toLowerCase().includes(zoneQuery.toLowerCase())
      const matchesPrice = maxPrice ? property.price <= maxPrice : true
      return matchesType && matchesZone && matchesPrice
    })
  }, [type, zoneQuery, maxPrice])

  const stats = useMemo(() => {
    const avg = Math.round(
      filtered.reduce((acc, property) => acc + property.price, 0) / Math.max(filtered.length, 1)
    )
    return { total: filtered.length, avg }
  }, [filtered])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Propiedades"
        subtitle="Datos curados y scrapings listos para el agente."
        actions={
          <div className="flex gap-2">
            {(['todas', 'departamento', 'casa', 'loft'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setType(option)}
                className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                  type === option
                    ? 'bg-cyan-500 text-white shadow shadow-cyan-500/30'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Propiedades activas" value={stats.total} helper="Dataset curado" />
        <StatCard label="Precio promedio" value={`$${stats.avg.toLocaleString()}`} helper="USD" />
        <StatCard label="Network effect" value="↑" helper="+5 inmob. aportan datos" />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          placeholder="Filtrar por zona"
          value={zoneQuery}
          onChange={(e) => setZoneQuery(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 md:col-span-2"
        />
        <input
          type="number"
          placeholder="Precio máximo (USD)"
          value={maxPrice ?? ''}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((property) => (
          <PropertyCard key={property.id} property={property as Property} />
        ))}
      </div>
    </div>
  )
}
