import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../shared/components/PageHeader'
import { PropertyCard } from '../components/PropertyCard'
import { StatCard } from '../../../shared/components/StatCard'
import type { Property, PropertyCreatePayload } from '../../../shared/types'
import { api, ApiError } from '../../../shared/services/api'
import { useAuth } from '../../../shared/hooks/useAuth'

export const PropertiesPage = () => {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState<Property[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('todas')
  const [filters, setFilters] = useState({
    location: '',
    property_type: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    parking: null as boolean | null,
  })

  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    area: '',
    property_type: 'apartamento',
    bedrooms: '',
    bathrooms: '',
    parking: false,
    description: '',
    status: 'available',
  })

  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const isAgency = user?.role === 'agency_admin' || user?.role === 'superadmin'

  // Cargar propiedades con filtros
  useEffect(() => {
    if (!token) return

    // Validación local
    if (
      filters.minPrice !== null &&
      filters.maxPrice !== null &&
      filters.minPrice > filters.maxPrice
    ) {
      setError('El precio mínimo no puede ser mayor al precio máximo.')
      return
    } else {
      setError(undefined)
    }

    setLoading(true)
    api
      .listProperties(token, {
        location: filters.location || undefined,
        property_type: filters.property_type || undefined,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        parking: filters.parking,
      })
      .then((data) => setProperties(data))
      .catch((err) => {
        const detail = err instanceof ApiError ? err.message : 'No se pudieron cargar las propiedades'
        setError(detail)
      })
      .finally(() => setLoading(false))
  }, [
    token,
    filters.location,
    filters.property_type,
    filters.minPrice,
    filters.maxPrice,
    filters.bedrooms,
    filters.bathrooms,
    filters.parking,
  ])

  // Filtrar por estado
  const filtered = useMemo(() => {
    return properties.filter((property) => {
      if (statusFilter === 'todas') return true
      if (statusFilter === 'disponibles') return property.status === 'available'
      if (statusFilter === 'vendidas') return property.status === 'sold'
      return true
    })
  }, [properties, statusFilter])

  // Estadísticas
  const stats = useMemo(() => {
    const avg =
      filtered.length === 0
        ? 0
        : Math.round(
            filtered.reduce((acc, property) => acc + Number(property.price), 0) / filtered.length,
          )

    return {
      total: filtered.length,
      available: filtered.filter((p) => p.status === 'available').length,
      sold: filtered.filter((p) => p.status === 'sold').length,
      avg,
    }
  }, [filtered])

  // Crear propiedad
  const handleCreateProperty = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) return

    if (!user?.agency_id) {
      setError('Necesitas un agency_id para publicar propiedades')
      return
    }

    setSaving(true)
    setError(undefined)

    try {
      const payload: PropertyCreatePayload = {
        title: form.title,
        price: Number(form.price),
        description: form.description || undefined,
        area: form.area || undefined,
        location: form.location || undefined,
        property_type: form.property_type || undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        parking: form.parking,
        status: form.status,
        agency_id: user.agency_id,
        photos,
      }

      const created = await api.createProperty(payload, token)
      setProperties((prev) => [created, ...prev])

      setForm({
        title: '',
        price: '',
        location: '',
        area: '',
        property_type: 'apartamento',
        bedrooms: '',
        bathrooms: '',
        parking: false,
        description: '',
        status: 'available',
      })
      setPhotos([])
    } catch (err) {
      const detail = err instanceof ApiError ? err.message : 'No se pudo crear la propiedad'
      setError(detail)
    } finally {
      setSaving(false)
    }
  }

  const goToChat = (property: Property) => {
    navigate(`/app/chat?propertyId=${property.id}`)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={isAgency ? 'Inventario de propiedades' : 'Catálogo de propiedades'}
        subtitle={
          isAgency
            ? 'Publica y actualiza tu cartera, clasifica leads por interés.'
            : 'Filtra por zona, tipo y precio. Guarda tus preferencias.'
        }
        actions={
          <div className="flex gap-2">
            {(['todas', 'disponibles', 'vendidas'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setStatusFilter(option)}
                className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                  statusFilter === option
                    ? 'bg-red-500 text-white shadow shadow-red-500/30'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Propiedades activas" value={stats.total} helper="Filtradas" />
        <StatCard label="Disponibles" value={stats.available} helper="available" />
        <StatCard label="Vendidas" value={stats.sold} helper="sold" />
        <StatCard label="Precio promedio" value={`$${stats.avg.toLocaleString()}`} helper="USD" />
      </div>

      {error && (
        <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur lg:col-span-2">
          <p className="text-sm font-semibold text-white">Filtrado en vivo</p>


          <div className="mt-3 grid gap-3 md:grid-cols-3">

            <input
              placeholder="Zona / ciudad"
              value={filters.location}
              onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-slate-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />


            <select
              value={filters.property_type}
              onChange={(e) => setFilters((p) => ({ ...p, property_type: e.target.value }))}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white appearance-none outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option className="bg-black text-white" value="">
                Tipo (todos)
              </option>
              <option className="bg-black text-white" value="apartamento">
                Apartamento
              </option>
              <option className="bg-black text-white" value="casa">
                Casa
              </option>
              <option className="bg-black text-white" value="local">
                Local
              </option>
              <option className="bg-black text-white" value="oficina">
                Oficina
              </option>
              <option className="bg-black text-white" value="lote">
                Lote
              </option>
              <option className="bg-black text-white" value="finca">
                Finca
              </option>
            </select>


            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white">
              <input
                type="checkbox"
                checked={filters.parking === true}
                onChange={() =>
                  setFilters((p) => ({ ...p, parking: p.parking === true ? null : true }))
                }
              />
              Solo con garaje
            </label>
          </div>


          <div className="mt-3 grid gap-3 md:grid-cols-4">

            <input
              type="number"
              min={0}
              max={1000000000}
              placeholder="Min $"
              value={filters.minPrice ?? ''}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return setFilters((p) => ({ ...p, minPrice: null }))
                const n = Math.min(Math.max(Number(v), 0), 1000000000)
                setFilters((p) => ({ ...p, minPrice: n }))
              }}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />


            <input
              type="number"
              min={0}
              max={1000000000}
              placeholder="Max $"
              value={filters.maxPrice ?? ''}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return setFilters((p) => ({ ...p, maxPrice: null }))
                const n = Math.min(Math.max(Number(v), 0), 1000000000)
                setFilters((p) => ({ ...p, maxPrice: n }))
              }}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />


            <input
              type="number"
              min={0}
              max={10}
              placeholder="Habitaciones"
              value={filters.bedrooms ?? ''}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return setFilters((p) => ({ ...p, bedrooms: null }))
                const n = Math.min(Math.max(Number(v), 0), 10)
                setFilters((p) => ({ ...p, bedrooms: n }))
              }}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />


            <input
              type="number"
              min={0}
              max={8}
              placeholder="Baños"
              value={filters.bathrooms ?? ''}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return setFilters((p) => ({ ...p, bathrooms: null }))
                const n = Math.min(Math.max(Number(v), 0), 8)
                setFilters((p) => ({ ...p, bathrooms: n }))
              }}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>


        {isAgency ? (
          <form
            onSubmit={handleCreateProperty}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-black/60 to-slate-900/40 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Publicar propiedad</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                Solo agencias
              </span>
            </div>

            <div className="mt-3 grid gap-3">
              <input
                required
                placeholder="Título"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />

              <input
                required
                type="number"
                min={0}
                max={1000000000}
                placeholder="Precio"
                value={form.price}
                onChange={(e) => {
                  const v = e.target.value
                  if (!v) return setForm((p) => ({ ...p, price: '' }))
                  const n = Math.min(Math.max(Number(v), 0), 1000000000)
                  setForm((p) => ({ ...p, price: String(n) }))
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />

              <input
                placeholder="Zona / ciudad"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={form.property_type}
                  onChange={(e) => setForm((p) => ({ ...p, property_type: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="local">Local</option>
                  <option value="oficina">Oficina</option>
                  <option value="lote">Lote</option>
                  <option value="finca">Finca</option>
                </select>

                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  <option value="available">Disponible</option>
                  <option value="reserved">Reservada</option>
                  <option value="sold">Vendida</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min={0}
                  max={10}
                  placeholder="Habitaciones"
                  value={form.bedrooms}
                  onChange={(e) => {
                    const v = e.target.value
                    if (!v) return setForm((p) => ({ ...p, bedrooms: '' }))
                    const n = Math.min(Math.max(Number(v), 0), 10)
                    setForm((p) => ({ ...p, bedrooms: String(n) }))
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />

                <input
                  type="number"
                  min={0}
                  max={8}
                  placeholder="Baños"
                  value={form.bathrooms}
                  onChange={(e) => {
                    const v = e.target.value
                    if (!v) return setForm((p) => ({ ...p, bathrooms: '' }))
                    const n = Math.min(Math.max(Number(v), 0), 8)
                    setForm((p) => ({ ...p, bathrooms: String(n) }))
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />

                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={form.parking}
                    onChange={(e) => setForm((p) => ({ ...p, parking: e.target.checked }))}
                  />
                  Garaje
                </label>
              </div>

              <textarea
                placeholder="Descripción (Supabase)"
                value={form.description}
                rows={3}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white resize-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />

              <div className="space-y-1">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white file:mr-3 file:rounded-lg file:border-none file:bg-pink-600 file:px-3 file:py-1 file:text-white"
                />
                {photos.length > 0 ? (
                  <p className="text-xs text-slate-300">{photos.length} imagen(es) seleccionadas</p>
                ) : (
                  <p className="text-xs text-slate-500">Formatos: jpeg, png, gif, webp</p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 shadow shadow-pink-500/30 hover:shadow-lg disabled:opacity-60"
              >
                Publicar
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Tip comprador</p>
            <p className="text-sm text-slate-300">
              Guarda las propiedades que te gusten y abre el chat con el asesor.
            </p>
          </div>
        )}
      </div>

      {/* LISTADO */}
      {loading ? (
        <p className="text-sm text-slate-300">Cargando propiedades...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onChat={!isAgency ? goToChat : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
