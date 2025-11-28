import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Lead, LeadStatus, LeadUrgency } from '../../../shared/types'
import { classifyLead } from '../../../shared/utils/format'
import { Badge } from '../../../shared/components/Badge'

type LeadCaptureFormProps = {
  onSubmit: (lead: Lead) => void
}

export const LeadCaptureForm = ({ onSubmit }: LeadCaptureFormProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [budget, setBudget] = useState<number>(220000)
  const [location, setLocation] = useState('CDMX - Roma Norte')
  const [urgency, setUrgency] = useState<LeadUrgency>('media')
  const [goal, setGoal] = useState('Compra para vivir')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const draft: Lead = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: '',
      budget,
      location,
      urgency,
      goal,
      status: 'B',
      intentScore: urgency === 'alta' ? 0.9 : urgency === 'media' ? 0.7 : 0.45,
      source: 'Formulario inteligente',
      createdAt: new Date().toISOString(),
    }

    const computedStatus = classifyLead(draft) as LeadStatus
    onSubmit({ ...draft, status: computedStatus })
    setName('')
    setEmail('')
    setGoal('Compra para vivir')
  }

  const classificationPreview = classifyLead({
    id: 'preview',
    name,
    email,
    phone: '',
    budget,
    location,
    urgency,
    goal,
    status: 'B',
    createdAt: new Date().toISOString(),
  })

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Captura inteligente</p>
          <p className="text-xs text-slate-300">
            El agente infiere intención y clasifica antes de entregarlo.
          </p>
        </div>
        <Badge variant="info">Clasificación previa: {classificationPreview}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej. Ana López"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Email</span>
          <input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ana@email.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Presupuesto</span>
          <input
            value={budget}
            type="number"
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Zona</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="CDMX - Condesa"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Urgencia</span>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as LeadUrgency)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          >
            <option value="alta">Alta (0-30 días)</option>
            <option value="media">Media (1-3 meses)</option>
            <option value="baja">Baja (+3 meses)</option>
          </select>
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-slate-200">Objetivo</span>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Vivir / inversión / renta"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none"
      >
        Crear lead y clasificar
      </button>
    </form>
  )
}
