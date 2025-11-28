import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { agentInsightsMock, leadsMock, propertiesMock } from '../../../shared/services/data'
import { Badge } from '../../../shared/components/Badge'
import { formatCurrency, formatDate } from '../../../shared/utils/format'
import { Card } from '../../../shared/components/Card'
import { PageHeader } from '../../../shared/components/PageHeader'

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const lead = leadsMock.find((item) => item.id === id)
  const insight = agentInsightsMock.find((item) => item.leadId === id)

  const recommendedMatches = useMemo(
    () =>
      propertiesMock
        .filter((property) => property.price <= (lead?.budget ?? 999999))
        .slice(0, 3),
    [lead]
  )

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
        title={lead.name}
        subtitle={`Lead ${lead.status} • ${lead.urgency}`}
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
              <p>{lead.email}</p>
              <p>{lead.phone}</p>
            </div>
            <div>
              <p className="text-slate-400">Presupuesto</p>
              <p className="text-lg font-semibold text-indigo-100">{formatCurrency(lead.budget)}</p>
            </div>
            <div>
              <p className="text-slate-400">Zona</p>
              <p>{lead.location}</p>
            </div>
            <div>
              <p className="text-slate-400">Urgencia</p>
              <Badge variant={lead.urgency === 'alta' ? 'success' : 'warning'}>{lead.urgency}</Badge>
            </div>
            <div>
              <p className="text-slate-400">Objetivo</p>
              <p>{lead.goal}</p>
            </div>
            <div>
              <p className="text-slate-400">Fuente</p>
              <p>{lead.source}</p>
            </div>
            <div>
              <p className="text-slate-400">Fecha</p>
              <p>{formatDate(lead.createdAt)}</p>
            </div>
          </div>
        </Card>

        <Card title="Clasificación del agente">
          {insight ? (
            <div className="space-y-2 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <span>Interés</span>
                <Badge variant="info">{insight.interestLevel}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Clasificación final</span>
                <Badge variant="success">Lead {insight.classification}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Confianza del modelo</span>
                <span className="font-semibold text-emerald-300">{insight.confidence}%</span>
              </div>
              <p className="text-slate-300">{insight.summary}</p>
              <div className="space-y-1">
                <p className="text-slate-400">Próximos pasos</p>
                <ul className="list-disc space-y-1 pl-5 text-slate-200">
                  {insight.recommendedActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Sin insight automático.</p>
          )}
        </Card>
      </div>

      <Card title="Match con propiedades" description="Opciones alineadas al presupuesto y zona.">
        <div className="grid gap-3 md:grid-cols-3">
          {recommendedMatches.map((property) => (
            <div
              key={property.id}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200"
            >
              <p className="text-xs uppercase tracking-wide text-indigo-200">{property.type}</p>
              <h4 className="text-lg font-semibold text-white">{property.title}</h4>
              <p className="text-sm text-slate-300">{property.location}</p>
              <p className="mt-1 text-indigo-100">{formatCurrency(property.price)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {property.tags?.map((tag) => (
                  <Badge key={tag} variant="info">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
