import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card } from '../../../shared/components/Card'
import { PageHeader } from '../../../shared/components/PageHeader'
import { useAuth } from '../../../shared/hooks/useAuth'
import { api, ApiError } from '../../../shared/services/api'
import type { LeadAnalyzeResponse, Property, ChatbotResponse } from '../../../shared/types'

type ChatMessage = {
  from: 'bot' | 'user'
  text: string
}

const steps = [
  { key: 'tipo_propiedad', prompt: '¿Qué tipo de propiedad buscas? (casa, apartamento, local...)' },
  { key: 'zona', prompt: '¿En qué ciudad o zona te gustaría?' },
  { key: 'presupuesto', prompt: '¿Cuál es tu presupuesto aproximado?' },
  { key: 'habitaciones', prompt: '¿Cuántas habitaciones necesitas?' },
  { key: 'banos', prompt: '¿Cuántos baños te gustaría?' },
  { key: 'garaje', prompt: '¿Necesitas garaje/parqueadero? (sí/no)' },
]

export const ChatbotPage = () => {
  const { token, user } = useAuth()
  const [searchParams] = useSearchParams()
  const propertyId = searchParams.get('propertyId')

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: 'bot',
      text: '👋 Hola, soy tu asistente. Te haré algunas preguntas rápidas para encontrar propiedades. ¿Listo?',
    },
    { from: 'bot', text: steps[0].prompt },
  ])
  const [input, setInput] = useState('')
  const [stepIndex, setStepIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [score, setScore] = useState<LeadAnalyzeResponse | null>(null)
  const [error, setError] = useState<string>()
  const [prefs, setPrefs] = useState<Record<string, any>>({})
  const [property, setProperty] = useState<Property | null>(null)
  const [propertyError, setPropertyError] = useState<string>()
  const [propertyPrefilled, setPropertyPrefilled] = useState(false)

  useEffect(() => {
    if (!propertyId || !token) return
    api
      .getProperty(Number(propertyId), token)
      .then((data) => setProperty(data))
      .catch(() => setPropertyError('No se pudo cargar la propiedad seleccionada'))
  }, [propertyId, token])

  useEffect(() => {
    if (!property || propertyPrefilled) return
    setPrefs((prev) => ({
      ...prev,
      tipo_propiedad: prev.tipo_propiedad || property.property_type,
      zona: prev.zona || property.location,
      presupuesto: prev.presupuesto || property.price,
    }))
    setMessages((prev) => [
      ...prev,
      {
        from: 'bot',
        text: `Tomamos la propiedad ${property.title} (${property.location ?? 'sin ubicación'}) como referencia.`,
      },
    ])
    setPropertyPrefilled(true)
  }, [property, propertyPrefilled])

  const nextPrompt = useMemo(() => steps[stepIndex]?.prompt, [stepIndex])

  const sendMessage = async () => {
    if (!input.trim()) return
    const text = input.trim()
    setMessages((prev) => [...prev, { from: 'user', text }])
    setInput('')
    setError(undefined)

    const currentStep = steps[stepIndex]
    const updatedPrefs = { ...prefs }

    // Actualizar preferencias locales según el paso
    if (currentStep) {
      if (currentStep.key === 'presupuesto') {
        const digits = parseInt(text.replace(/[^\d]/g, ''), 10)
        if (!Number.isNaN(digits)) updatedPrefs.presupuesto = digits
      } else if (currentStep.key === 'habitaciones') {
        const n = parseInt(text.replace(/[^\d]/g, ''), 10)
        if (!Number.isNaN(n)) updatedPrefs.habitaciones = n
      } else if (currentStep.key === 'banos') {
        const n = parseInt(text.replace(/[^\d]/g, ''), 10)
        if (!Number.isNaN(n)) updatedPrefs.banos = n
      } else if (currentStep.key === 'garaje') {
        updatedPrefs.garaje = text.toLowerCase().startsWith('s')
      } else {
        updatedPrefs[currentStep.key] = text
      }
      setPrefs(updatedPrefs)
    }

    setSaving(true)
    try {
      // Llamamos al backend de chatbot (ConversationalAgentService → LeadAgentService)
      const chatbotResponse: ChatbotResponse = await api.chatbotAnalyze({
        message: text,
        contact_key: user?.email || undefined,
      })

      // Guardamos el score/lead_analysis en el panel derecho
      setScore(chatbotResponse.lead_analysis)

      // Añadimos la respuesta del bot al chat
      setMessages((prev) => [...prev, { from: 'bot', text: chatbotResponse.reply }])

      // Flujo de pasos guiados
      if (stepIndex < steps.length - 1) {
        setStepIndex((i) => i + 1)
        setMessages((prev) => [...prev, { from: 'bot', text: steps[stepIndex + 1].prompt }])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: 'Genial, ya tengo todo. ¿Quieres que te comparta opciones o agendamos una llamada?',
          },
        ])
      }
    } catch (err) {
      const detail = err instanceof ApiError ? err.message : 'No pude procesar tu mensaje'
      setError(detail)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Chat tipo WhatsApp"
        subtitle="Usamos el agente inteligente para analizar tus respuestas y sugerir propiedades."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Chat" className="lg:col-span-2">
          {property ? (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-red-600/30 bg-red-600/10 px-3 py-2 text-xs text-red-50">
              <span>Trabajando sobre: {property.title}</span>
              <span className="text-red-200">{property.location ?? 'Sin zona'}</span>
            </div>
          ) : null}
          {propertyError ? <p className="text-xs text-amber-200">{propertyError}</p> : null}
          <div className="flex h-[480px] flex-col gap-3 overflow-y-auto rounded-xl bg-black/30 p-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                  m.from === 'bot'
                    ? 'self-start bg-white/5 text-slate-100'
                    : 'self-end bg-gradient-to-r from-red-600 via-red-700 to-red-500 text-white shadow shadow-red-900/20'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={nextPrompt || 'Escribe tu respuesta'}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-red-900/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
            >
              Enviar
            </button>
          </div>
          {error ? <p className="text-sm text-amber-200">{error}</p> : null}
        </Card>

        <Card title="Perfil/score">
          <div className="space-y-2 text-sm text-slate-200">
            <p className="text-slate-400">Paso actual</p>
            <p>
              {stepIndex + 1} / {steps.length} {nextPrompt ? `→ ${nextPrompt}` : ''}
            </p>

            <p className="text-slate-400">Preferencias</p>
            <ul className="space-y-1">
              {Object.entries(prefs).map(([k, v]) => (
                <li key={k}>
                  <span className="text-slate-400">{k}:</span> {String(v)}
                </li>
              ))}
            </ul>

            {score ? (
              <div className="space-y-1 rounded-xl bg-white/5 p-3">
                <p>Lead {score.lead_score}</p>
                <p>
                  Interés: {score.is_interested ? 'Alto' : 'Bajo'} ({score.interest_level})
                </p>
                <p>Presupuesto: {score.presupuesto ?? 'N/A'}</p>
                <p>Zona: {score.zona ?? 'N/A'}</p>
                <p>Urgencia: {score.urgencia}</p>
                <p className="text-slate-400 text-xs">Razón: {score.razonamiento}</p>
                {score.recommendations && score.recommendations.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Recomendaciones
                    </p>
                    <div className="grid gap-2">
                      {score.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100"
                        >
                          <div>
                            <p className="font-semibold">{rec.title ?? `Propiedad #${rec.id}`}</p>
                            <p className="text-slate-400">{rec.location ?? 'Sin zona'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {rec.price != null ? (
                              <span className="font-semibold">${rec.price}</span>
                            ) : null}
                            {rec.id ? (
                              <Link
                                to={`/app/properties/${rec.id}`}
                                className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white hover:bg-white/20"
                              >
                                Ver
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-slate-400">Sin score aún.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
