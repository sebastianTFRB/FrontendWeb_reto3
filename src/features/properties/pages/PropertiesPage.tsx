import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { PropertyCard } from '../components/PropertyCard'
import { StatCard } from '../../../shared/components/StatCard'
import type { Property } from '../../../shared/types'
import { api, ApiError } from '../../../shared/services/api'
import { useAuth } from '../../../shared/hooks/useAuth'

export const PropertiesPage = () => {
  const { token } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('todas')
  const [zoneQuery, setZoneQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!token) return
    setLoading(true)
    api
      .listProperties(token)
      .then((data) => setProperties(data))
      .catch((err) => {
        const detail = err instanceof ApiError ? err.message : 'No se pudieron cargar las propiedades'
        setError(detail)
      })
      .finally(() => setLoading(false))
  }, [token])

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const matchesStatus = statusFilter === 'todas' ? true : property.status === statusFilter
      const matchesZone = zoneQuery
        ? property.location?.toLowerCase().includes(zoneQuery.toLowerCase()) ?? false
        : true
      const matchesPrice = maxPrice ? Number(property.price) <= maxPrice : true
      return matchesStatus && matchesZone && matchesPrice
    })
  }, [properties, statusFilter, zoneQuery, maxPrice])

  const stats = useMemo(() => {
    const avg =
      filtered.length === 0
        ? 0
        : Math.round(filtered.reduce((acc, property) => acc + Number(property.price), 0) / filtered.length)
    return { total: filtered.length, avg }
  }, [filtered])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Propiedades"
        subtitle="Datos alineados con /api/properties."
        actions={
          <div className="flex gap-2">
            {(['todas', 'available', 'sold'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setStatusFilter(option)}
                className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                  statusFilter === option
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
        <StatCard label="Propiedades activas" value={stats.total} helper="Listado filtrado" />
        <StatCard label="Precio promedio" value={`$${stats.avg.toLocaleString()}`} helper="USD" />
        <StatCard label="Estado" value={statusFilter} helper="status" />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        <input
          placeholder="Filtrar por zona"
          value={zoneQuery}
          onChange={(e) => setZoneQuery(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 md:col-span-2"
        />
        <input
          type="number"
          placeholder="Precio maximo (USD)"
          value={maxPrice ?? ''}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-300">Cargando propiedades...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
