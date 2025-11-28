import { activityFeed, analyticsSnapshot, trendsMock } from '../../../shared/services/data'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { BarChart } from '../components/BarChart'

export const AnalyticsDashboard = () => {
  const { distribution } = analyticsSnapshot
  const total = distribution.A + distribution.B + distribution.C
  const distributionList = [
    { label: 'A', value: distribution.A, color: 'bg-emerald-500' },
    { label: 'B', value: distribution.B, color: 'bg-amber-500' },
    { label: 'C', value: distribution.C, color: 'bg-rose-500' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle="Indicadores de captación, clasificación y eficiencia del agente."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="Leads captados"
          value={analyticsSnapshot.totalLeads}
          helper="Esta semana"
          trend="+14%"
        />
        <StatCard
          label="Leads clasificados"
          value={analyticsSnapshot.classifiedLeads}
          helper="Automáticos"
          trend="82% precisión"
        />
        <StatCard
          label="Eficiencia del agente"
          value={`${Math.round(analyticsSnapshot.efficiency * 100)}%`}
          helper="Tiempo ahorrado"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Distribución A/B/C" className="md:col-span-2">
          <div className="space-y-4">
            <div className="flex gap-3">
              {distributionList.map((item) => (
                <div key={item.label} className="flex-1">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span>Lead {item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`${item.color} h-full rounded-full`}
                      style={{ width: `${(item.value / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <BarChart points={trendsMock} />
          </div>
        </Card>

        <Card title="Actividad reciente">
          <div className="space-y-3">
            {activityFeed.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
                <Badge variant={activity.status === 'success' ? 'success' : 'warning'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Eficiencia operativa"
          description="Cómo el agente reduce esfuerzo manual."
          className="relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
          <ul className="space-y-2 text-sm text-slate-200">
            <li>• 3m17s promedio de clasificación por lead.</li>
            <li>• Disminución del 38% en leads no calificados.</li>
            <li>• Priorización basada en intención real y presupuesto.</li>
          </ul>
        </Card>

        <Card title="Network effect" description="Más inmobiliarias → mejor modelo.">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
              <div className="flex h-full flex-col items-center justify-center">
                <span>+5</span>
                <span className="text-xs">nuevas</span>
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-200">
              <p>Datos frescos de 5 inmobiliarias esta semana.</p>
              <p className="text-indigo-100">Cobertura: {analyticsSnapshot.coverageZones} zonas.</p>
              <p className="text-slate-300">↑ Precisión mejora con cada dataset.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
