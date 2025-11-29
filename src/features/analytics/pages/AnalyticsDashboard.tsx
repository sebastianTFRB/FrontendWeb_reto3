import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { api, ApiError } from '../../../shared/services/api'
import type { AnalyticsSummary } from '../../../shared/types'

export const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [error, setError] = useState<string>()

  useEffect(() => {
    api
      .analytics()
      .then((data) => setSummary(data))
      .catch((err) => {
        const detail = err instanceof ApiError ? err.message : 'No se pudo cargar analytics'
        setError(detail)
      })
  }, [])

  const distributionList = useMemo(() => {
    if (!summary) return []
    const counts = summary.by_score || {}
    const total = Math.max(
      1,
      Object.values(counts).reduce((acc, value) => acc + (value || 0), 0)
    )
    return ['A', 'B', 'C'].map((label) => ({
      label,
      value: counts[label] ?? 0,
      percent: ((counts[label] ?? 0) / total) * 100,
      color: label === 'A' ? 'bg-emerald-500' : label === 'B' ? 'bg-amber-500' : 'bg-rose-500',
    }))
  }, [summary])

  return (
    <div className="space-y-5">
      <PageHeader title="Dashboard" subtitle="Indicadores entregados por /api/analytics/summary." />

      {error ? <p className="text-sm text-amber-200">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="Leads captados"
          value={summary?.total_leads ?? 0}
          helper="total_leads"
        />
        <StatCard
          label="Interesados"
          value={summary ? summary.by_interest?.interested ?? 0 : 0}
          helper="by_interest.interested"
        />
        <StatCard
          label="No interesados"
          value={summary ? summary.by_interest?.not_interested ?? 0 : 0}
          helper="by_interest.not_interested"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Distribucion A/B/C">
          <div className="space-y-4">
            <div className="flex gap-3">
              {distributionList.map((item) => (
                <div key={item.label} className="flex-1">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span>Lead {item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Canales">
          <div className="flex flex-wrap gap-2">
            {summary
              ? Object.entries(summary.by_channel || {}).map(([label, value]) => (
                  <Badge key={label} variant="info">
                    {label}: {value}
                  </Badge>
                ))
              : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
