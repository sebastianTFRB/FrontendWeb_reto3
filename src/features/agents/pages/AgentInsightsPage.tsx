import { useEffect, useState } from 'react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import type { AnalyticsSummary, LeadAnalyzeResponse, ChatbotResponse } from '../../../shared/types'
import { api, ApiError } from '../../../shared/services/api'
import { Link } from 'react-router-dom'

export const AgentInsightsPage = () => {
  const [message, setMessage] = useState('')
  const [canal, setCanal] = useState('whatsapp')
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')

  const [leadResult, setLeadResult] = useState<LeadAnalyzeResponse | null>(null)
  const [chatReply, setChatReply] = useState<string | null>(null)

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
    setLeadResult(null)
    setChatReply(null)

    try {
      const response: ChatbotResponse = await api.chatbotAnalyze({
        message,                // 👈 coincide con ChatRequest.message
        contact_key: contacto || null, // 👈 coincide con ChatRequest.contact_key
      })

      setLeadResult(response.lead_analysis)
      setChatReply(response.reply)
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
        subtitle="Conecta directo con /api/chatbot y /api/analytics/summary."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Analizar mensaje" className="lg:col-span-2">
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Pega aqui el mensaje del lead"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              rows={5}
            />
            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={canal}
                onChange={(e) => setCanal(e.target.value)}
                placeholder="Canal (whatsapp, web...)"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del lead"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <input
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Contacto (email/telefono)"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            {error ? <p className="text-sm text-amber-200">{error}</p> : null}
            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-red-900/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Analizando…' : 'Analizar'}
            </button>
          </div>
        </Card>

        {/* Analytics igual que antes */}
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
                  {Object.entries(analytics.by_score || {}).map(([label, value]) => (
                    <Badge key={label} variant="info">
                      {label}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-400">Interés</p>
                <div className="flex gap-2">
                  <Badge variant="success">interesados: {analytics.by_interest?.interested ?? 0}</Badge>
                  <Badge variant="neutral">no interesados: {analytics.by_interest?.not_interested ?? 0}</Badge>
                </div>
              </div>
              <div>
                <p className="text-slate-400">Canales</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analytics.by_channel || {}).map(([label, value]) => (
                    <Badge key={label} variant="info">
                      {label}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Sin datos de analytics aun.</p>
          )}
        </Card>
      </div>

      {leadResult ? (
        <Card title="Resultado del agente">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-1 text-sm text-slate-200">
              <p className="text-slate-400">Lead score</p>
              <Badge variant="success">Lead {leadResult.lead_score}</Badge>

              <p className="text-slate-400">Interés</p>
              <div className="flex gap-2">
                <Badge variant={leadResult.is_interested ? 'success' : 'neutral'}>
                  {leadResult.is_interested ? 'Interesado' : 'No interesado'}
                </Badge>
                <Badge variant="info">{leadResult.interest_level}</Badge>
              </div>

              <p className="text-slate-400">Urgencia</p>
              <Badge variant="info">{leadResult.urgencia}</Badge>

              <p className="text-slate-400">Zona</p>
              <p>{leadResult.zona ?? 'Sin zona'}</p>

              <p className="text-slate-400">Tipo de propiedad</p>
              <p>{leadResult.tipo_propiedad ?? 'Sin tipo'}</p>
            </div>
            <div className="space-y-1 text-sm text-slate-200">
              <p className="text-slate-400">Presupuesto</p>
              <p>{leadResult.presupuesto != null ? `$${leadResult.presupuesto}` : 'Sin valor'}</p>

              <p className="text-slate-400">Intención real</p>
              <p>{leadResult.intencion_real ?? 'Sin dato'}</p>

              <p className="text-slate-400">Razonamiento</p>
              <p>{leadResult.razonamiento}</p>
            </div>
          </div>

          {chatReply ? (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Respuesta del chatbot</p>
              <p className="mt-1 rounded-xl bg-white/5 p-3 text-sm text-slate-100 whitespace-pre-line">
                {chatReply}
              </p>
            </div>
          ) : null}

          {leadResult.recommendations && leadResult.recommendations.length > 0 ? (
            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recomendaciones</p>
              <div className="grid gap-2 md:grid-cols-2">
                {leadResult.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-100"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{rec.title ?? `Propiedad #${rec.id}`}</p>
                      {rec.price != null ? <span className="text-indigo-200">${rec.price}</span> : null}
                    </div>
                    <p className="text-slate-400">{rec.location ?? 'Sin zona'}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {rec.bedrooms != null ? <Badge variant="neutral">{rec.bedrooms} hab</Badge> : null}
                      {rec.bathrooms != null ? <Badge variant="neutral">{rec.bathrooms} baños</Badge> : null}
                    </div>
                    {rec.id ? (
                      <Link
                        to={`/app/properties/${rec.id}`}
                        className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white hover:bg-white/20"
                      >
                        Ver detalle
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}
    </div>
  )
}
