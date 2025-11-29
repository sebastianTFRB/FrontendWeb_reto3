import { useEffect, useState } from 'react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import type { AnalyticsSummary, LeadAnalyzeResponse } from '../../../shared/types'
import { api, ApiError } from '../../../shared/services/api'

export const AgentInsightsPage = () => {
  const [message, setMessage] = useState('')
  const [canal, setCanal] = useState('whatsapp')
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [result, setResult] = useState<LeadAnalyzeResponse | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    api
      .analytics()
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics(null))
  }, [])

  const handleAnalyze = async () => {
    setError(undefined)
    setLoading(true)
    try {
      const response = await api.analyzeLead({ mensaje: message, canal, nombre, contacto })
      setResult(response)
    } catch (err) {
      const detail = err instanceof ApiError ? err.message : 'No se pudo analizar el mensaje'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Agente inteligente"
        subtitle="Conecta directo con /api/lead/analyze y /api/analytics/summary."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Analizar mensaje" className="lg:col-span-2">
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Pega aqui el mensaje del lead"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              rows={5}
            />
            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={canal}
                onChange={(e) => setCanal(e.target.value)}
                placeholder="Canal (whatsapp, web...)"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del lead"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
              <input
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Contacto (email/telefono)"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
            </div>
            {error ? <p className="text-sm text-amber-200">{error}</p> : null}
            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              disabled={loading}
            >
              Analizar
            </button>
          </div>
        </Card>

        <Card title="Analytics en vivo">
          {analytics ? (
            <div className="space-y-2 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <span>Leads totales</span>
                <span className="font-semibold text-indigo-100">{analytics.total_leads}</span>
              </div>
              <div>
                <p className="text-slate-400">Lead score</p>
                <div className="flex gap-2">
                  {Object.entries(analytics.lead_score_counts).map(([label, value]) => (
                    <Badge key={label} variant="info">
                      {label}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-400">Urgencias</p>
                <div className="flex gap-2">
                  {Object.entries(analytics.urgency_counts).map(([label, value]) => (
                    <Badge key={label} variant="neutral">
                      {label}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-400">Top zonas</p>
                <ul className="list-disc space-y-1 pl-4">
                  {analytics.top_zonas.map((item) => (
                    <li key={item.zona}>
                      {item.zona}: {item.count}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-slate-400">Presupuesto promedio</p>
                <p>{analytics.avg_presupuesto ?? 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Sin datos de analytics aun.</p>
          )}
        </Card>
      </div>

      {result ? (
        <Card title="Resultado del agente">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-1 text-sm text-slate-200">
              <p className="text-slate-400">Lead score</p>
              <Badge variant="success">Lead {result.lead_score}</Badge>
              <p className="text-slate-400">Urgencia</p>
              <Badge variant="info">{result.urgencia}</Badge>
              <p className="text-slate-400">Zona</p>
              <p>{result.zona ?? 'Sin zona'}</p>
              <p className="text-slate-400">Tipo de propiedad</p>
              <p>{result.tipo_propiedad ?? 'Sin tipo'}</p>
            </div>
            <div className="space-y-1 text-sm text-slate-200">
              <p className="text-slate-400">Presupuesto</p>
              <p>{result.presupuesto ?? 'Sin valor'}</p>
              <p className="text-slate-400">Razonamiento</p>
              <p>{result.razonamiento}</p>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
