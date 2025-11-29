import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import type { Lead } from '../../../shared/types'
import { Badge } from '../../../shared/components/Badge'
import { formatCurrency, formatDate, formatUrgency } from '../../../shared/utils/format'
import { Card } from '../../../shared/components/Card'
import { PageHeader } from '../../../shared/components/PageHeader'
import { api, ApiError } from '../../../shared/services/api'
import { useAuth } from '../../../shared/hooks/useAuth'

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const leadId = Number(id)

  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>()
  const [message, setMessage] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)

  const loadLead = () => {
    if (!token || Number.isNaN(leadId)) return
    setLoading(true)
    setError(undefined)
    api
      .getLead(leadId, token)
      .then((data) => setLead(data))
      .catch((err) => {
        const detail = err instanceof ApiError ? err.message : 'No se pudo cargar el lead'
        setError(detail)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadLead()
  }, [token, id])

  const recommendedTag = useMemo(() => {
    if (!lead) return ''
    // Ejemplo: "Alta urgencia · Prioridad A"
    return `${formatUrgency(lead.urgency)} · Prioridad ${lead.category}`
  }, [lead])

  const handleAddInteraction = async () => {
    if (!token || !lead) return
    if (!message.trim()) return
    setSaving(true)
    setError(undefined)
    try {
      await api.addInteraction(
        lead.id,
        { message, channel: 'whatsapp', direction: 'inbound' },
        token
      )
      setMessage('')
      loadLead()
    } catch (err) {
      const detail = err instanceof ApiError ? err.message : 'No se pudo guardar la interacción'
      setError(detail)
    } finally {
      setSaving(false)
    }
  }

  const formatChannelLabel = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return 'WhatsApp'
      case 'web':
        return 'Web'
      case 'phone':
        return 'Llamada'
      case 'email':
        return 'Correo'
      default:
        return channel
    }
  }

  if (Number.isNaN(leadId)) {
    return <p className="text-sm text-amber-200">ID de lead no válido.</p>
  }

  if (loading) {
    return <p className="text-sm text-slate-200">Cargando información del lead...</p>
  }

  if (error) {
    return (
      <div className="space-y-3">
        <PageHeader title="Error" subtitle={error} />
        <button
          onClick={() => navigate('/app/leads')}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white"
        >
          Volver
        </button>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="space-y-3">
        <PageHeader title="Lead no encontrado" subtitle="Regresa al listado y selecciona otro contacto." />
        <button
          onClick={() => navigate('/app/leads')}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white"
        >
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={lead.full_name}
        subtitle={recommendedTag}
        actions={
          <Link to="/app/leads" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            Volver al listado
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Resumen del lead" className="md:col-span-2">
          <div className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
            <div>
              <p className="text-slate-400">Datos de contacto</p>
              <p>{lead.email ?? 'Sin correo registrado'}</p>
              <p>{lead.phone ?? 'Sin teléfono registrado'}</p>
            </div>
            <div>
              <p className="text-slate-400">Presupuesto aproximado</p>
              <p className="text-lg font-semibold text-indigo-100">
                {lead.budget != null ? formatCurrency(lead.budget) : 'Sin presupuesto definido'}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Zona de interés</p>
              <p>{lead.preferred_area ?? 'Sin zona especificada'}</p>
            </div>
            <div>
              <p className="text-slate-400">Urgencia</p>
              <Badge variant={lead.urgency === 'high' ? 'success' : 'warning'}>{formatUrgency(lead.urgency)}</Badge>
            </div>
            <div>
              <p className="text-slate-400">Estado del seguimiento</p>
              <p>{lead.status}</p>
            </div>
            <div>
              <p className="text-slate-400">Prioridad</p>
              <Badge variant="info">Prioridad {lead.category}</Badge>
            </div>
            <div>
              <p className="text-slate-400">Creado</p>
              <p>{formatDate(lead.created_at)}</p>
            </div>
            <div>
              <p className="text-slate-400">Última actualización</p>
              <p>{formatDate(lead.updated_at)}</p>
            </div>
          </div>

          {lead.preferences ? (
            <div className="mt-3 space-y-1 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preferencias detectadas</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-100">
                {lead.preferences.tipo_propiedad ? (
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    Tipo de propiedad: {lead.preferences.tipo_propiedad}
                  </span>
                ) : null}
                {lead.preferences.habitaciones ? (
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {lead.preferences.habitaciones} habitaciones
                  </span>
                ) : null}
                {lead.preferences.banos ? (
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {lead.preferences.banos} baños
                  </span>
                ) : null}
                {lead.preferences.garaje != null ? (
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {lead.preferences.garaje ? 'Requiere garaje' : 'No requiere garaje'}
                  </span>
                ) : null}
                {lead.preferences.property_title ? (
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    Propiedad de referencia: {lead.preferences.property_title}
                  </span>
                ) : null}
                {lead.preferences.property_id && !lead.preferences.property_title ? (
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    Propiedad de referencia seleccionada
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </Card>

        <Card title="Historial de interacciones">
          <div className="space-y-2">
            {lead.interactions.length === 0 && (
              <p className="text-sm text-slate-400">Aún no hay interacciones registradas.</p>
            )}
            {lead.interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{formatChannelLabel(interaction.channel)}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(interaction.created_at)}</span>
                </div>
                <p className="text-slate-100 mt-1">{interaction.message}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-sm font-semibold text-white">Agregar nueva interacción</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Anota aquí el mensaje recibido o enviado con el lead."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              rows={3}
            />
            <button
              type="button"
              onClick={handleAddInteraction}
              className="w-full rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              disabled={saving}
            >
              Guardar interacción
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
