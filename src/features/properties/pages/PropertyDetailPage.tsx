import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge'
import { Card } from '../../../shared/components/Card'
import { PageHeader } from '../../../shared/components/PageHeader'
import { useAuth } from '../../../shared/hooks/useAuth'
import { api, ApiError } from '../../../shared/services/api'
import type { Property } from '../../../shared/types'
import { formatCurrency, formatDate } from '../../../shared/utils/format'

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!token || !id) return
    setLoading(true)
    setError(undefined)
    api
      .getProperty(Number(id), token)
      .then((data) => setProperty(data))
      .catch((err) => {
        const detail = err instanceof ApiError ? err.message : 'No se pudo cargar la propiedad'
        setError(detail)
      })
      .finally(() => setLoading(false))
  }, [token, id])

  if (loading) {
    return <p className="text-sm text-slate-200">Cargando propiedad...</p>
  }

  if (error) {
    return (
      <div className="space-y-3">
        <PageHeader title="Error" subtitle={error} />
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
        >
          Volver
        </button>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="space-y-3">
        <PageHeader title="No encontrada" subtitle="La propiedad no existe o fue eliminada." />
        <button
          onClick={() => navigate('/app/properties')}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
        >
          Ir al catálogo
        </button>
      </div>
    )
  }

  const photos = property.photos && property.photos.length > 0 ? property.photos : []

  return (
    <div className="space-y-5">
      <PageHeader
        title={property.title}
        subtitle={property.location ?? 'Ubicación no disponible'}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">{property.status}</Badge>
            <button
              onClick={() => navigate('/app/properties')}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:border-indigo-400 hover:bg-white/10"
            >
              Volver al catálogo
            </button>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* GALERÍA */}
        <Card className="lg:col-span-2" title="Galería">
          {photos.length > 0 ? (
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos[0]}
                  alt={property.title}
                  className="h-72 w-full object-cover md:h-[420px] transition-transform duration-500 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                  {photos.slice(1).map((url, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={idx}
                      src={url}
                      alt={`${property.title} ${idx + 2}`}
                      className="h-20 w-full cursor-pointer rounded-xl border border-white/10 object-cover opacity-80 transition hover:opacity-100 hover:border-indigo-400 md:h-24 lg:h-28"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/40 text-center">
              <p className="text-sm font-medium text-slate-100">Sin imágenes aún.</p>
              <p className="text-xs text-slate-400">
                Cuando el asesor suba fotos, aparecerán aquí automáticamente.
              </p>
            </div>
          )}
        </Card>

        {/* DETALLES */}
        <Card title="Detalles">
          <div className="space-y-4 text-sm text-slate-200">
            <div className="space-y-1">
              <p className="text-xl font-semibold text-white">{formatCurrency(property.price)}</p>
              <p className="text-xs uppercase tracking-wide text-emerald-400">
                ID #{property.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Tipo</p>
                <p className="font-medium text-slate-100">
                  {property.property_type ?? 'No especificado'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Zona</p>
                <p className="font-medium text-slate-100">
                  {property.location ?? 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Área</p>
                <p className="font-medium text-slate-100">
                  {property.area ? `${property.area} m²` : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Publicada</p>
                <p className="font-medium text-slate-100">
                  {formatDate(property.created_at)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {property.bedrooms != null && (
                <Badge variant="neutral">{property.bedrooms} habitaciones</Badge>
              )}
              {property.bathrooms != null && (
                <Badge variant="neutral">{property.bathrooms} baños</Badge>
              )}
              {property.parking != null && (
                <Badge variant="neutral">
                  {property.parking ? 'Con garaje' : 'Sin garaje'}
                </Badge>
              )}
            </div>

            {property.description && (
              <div className="mt-2 rounded-2xl bg-white/5 p-3 text-sm text-slate-100 shadow-inner shadow-black/20">
                {property.description}
              </div>
            )}

            <button
              onClick={() => navigate(`/app/chat?propertyId=${property.id}`)}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Hablar con asesor
            </button>

            {user?.role === 'agency_admin' || user?.role === 'superadmin' ? (
              <p className="pt-1 text-xs text-slate-500">
                Tip: comparte este ID con clientes para que encuentren la propiedad: #{property.id}
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
