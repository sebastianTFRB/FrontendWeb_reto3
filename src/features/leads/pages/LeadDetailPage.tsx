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

  const loadLead = () => {
    if (!token || Number.isNaN(leadId)) return
    setLoading(true)
    setError(undefined)

    api
      .getLead(leadId, token)
      .then((data) => setLead(data)) // <- sigue leyendo desde tu backend / base de datos
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
    return `${formatUrgency(lead.urgency)} · Prioridad ${lead.category}`
  }, [lead])

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
        <Card title="Resumen del lead" className="md:col-span-3">
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
              <Badge variant={lead.urgency === 'high' ? 'success' : 'warning'}>
                {formatUrgency(lead.urgency)}
              </Badge>
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

          {/* Aquí estaba la tabla / bloque de "Captura inteligente" (lead.preferences) y ya la eliminé */}
        </Card>
      </div>
    </div>
  )
}
