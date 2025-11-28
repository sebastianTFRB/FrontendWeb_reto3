import { agentInsightsMock, leadsMock } from '../../../shared/services/data'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { formatCurrency } from '../../../shared/utils/format'

export const AgentInsightsPage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Agente inteligente"
        subtitle="Detección automática de interés, presupuesto y zonas preferidas."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {agentInsightsMock.map((insight) => {
          const lead = leadsMock.find((item) => item.id === insight.leadId)
          if (!lead) return null

          return (
            <Card
              key={insight.leadId}
              title={lead.name}
              description={`${lead.location} • ${lead.urgency}`}
              className="h-full"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="info">Lead {insight.classification}</Badge>
                <Badge variant="info">Confianza {insight.confidence}%</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <span>Presupuesto detectado</span>
                  <span className="font-semibold text-indigo-100">
                    {formatCurrency(insight.budgetDetected)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Nivel de interés</span>
                  <Badge variant="success">{insight.interestLevel}</Badge>
                </div>
                <div>
                  <p className="text-slate-400">Zonas preferidas</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {insight.preferredZones.map((zone) => (
                      <Badge key={zone} variant="neutral">
                        {zone}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400">Próximos pasos</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {insight.recommendedActions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
