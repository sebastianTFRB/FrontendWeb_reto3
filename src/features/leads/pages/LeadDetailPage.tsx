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
    return `Lead ${lead.category} · ${formatUrgency(lead.urgency)}`
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
      const detail = err instanceof ApiError ? err.message : 'No se pudo guardar la interaccion'
      setError(detail)
    } finally {
      setSaving(false)
    }
  }

  if (Number.isNaN(leadId)) {
    return <p className="text-sm text-amber-200">ID de lead no valido</p>
  }

  if (loading) {
    return <p className="text-sm text-slate-200">Cargando lead...</p>
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
        <PageHeader title="Lead no encontrado" subtitle="Regresa al listado y selecciona otro lead." />
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
        <Card title="Ficha del lead" className="md:col-span-2">
          <div className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
            <div>
              <p className="text-slate-400">Contacto</p>
              <p>{lead.email ?? 'Sin email'}</p>
              <p>{lead.phone ?? 'Sin telefono'}</p>
            </div>
            <div>
              <p className="text-slate-400">Presupuesto</p>
              <p className="text-lg font-semibold text-indigo-100">
                {lead.budget != null ? formatCurrency(lead.budget) : 'Sin presupuesto'}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Zona</p>
              <p>{lead.preferred_area ?? 'Sin zona'}</p>
            </div>
            <div>
              <p className="text-slate-400">Urgencia</p>
              <Badge variant={lead.urgency === 'high' ? 'success' : 'warning'}>{formatUrgency(lead.urgency)}</Badge>
            </div>
            <div>
              <p className="text-slate-400">Estado</p>
              <p>{lead.status}</p>
            </div>
            <div>
              <p className="text-slate-400">Categoria</p>
              <Badge variant="info">Lead {lead.category}</Badge>
            </div>
            <div>
              <p className="text-slate-400">Creado</p>
              <p>{formatDate(lead.created_at)}</p>
            </div>
            <div>
              <p className="text-slate-400">Actualizado</p>
              <p>{formatDate(lead.updated_at)}</p>
            </div>
          </div>
        </Card>

        <Card title="Interacciones">
          <div className="space-y-2">
            {lead.interactions.length === 0 && <p className="text-sm text-slate-400">Sin interacciones.</p>}
            {lead.interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{interaction.channel}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(interaction.created_at)}</span>
                </div>
                <p className="text-slate-100">{interaction.message}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-sm font-semibold text-white">Agregar interaccion</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mensaje recibido o enviado"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              rows={3}
            />
            <button
              type="button"
              onClick={handleAddInteraction}
              className="w-full rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              disabled={saving}
            >
              Guardar interaccion
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
