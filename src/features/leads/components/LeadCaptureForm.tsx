import type { FormEvent } from 'react'
import { useState } from 'react'
import type { LeadCreatePayload, LeadUrgency } from '../../../shared/types'

type LeadCaptureFormProps = {
  onSubmit: (lead: LeadCreatePayload) => Promise<void> | void
  loading?: boolean
}

export const LeadCaptureForm = ({ onSubmit, loading }: LeadCaptureFormProps) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    preferred_area: '',
    budget: '',
    urgency: 'medium' as LeadUrgency,
    notes: '',
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const payload: LeadCreatePayload = {
      full_name: form.full_name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      preferred_area: form.preferred_area || undefined,
      budget: form.budget ? Number(form.budget) : undefined,
      urgency: form.urgency,
      notes: form.notes || undefined,
    }

    await onSubmit(payload)
    setForm({
      full_name: '',
      email: '',
      phone: '',
      preferred_area: '',
      budget: '',
      urgency: 'medium',
      notes: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Captura inteligente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Nombre</span>
          <input
            value={form.full_name}
            onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
            required
            placeholder="Ej. Ana Lopez"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Email</span>
          <input
            value={form.email}
            type="email"
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="ana@email.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Presupuesto</span>
          <input
            value={form.budget}
            type="number"
            onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Zona preferida</span>
          <input
            value={form.preferred_area}
            onChange={(e) => setForm((prev) => ({ ...prev, preferred_area: e.target.value }))}
            placeholder="CDMX, Polanco, etc."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Telefono</span>
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+57 300 000 0000"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-200">Urgencia</span>
          <select
            value={form.urgency}
            onChange={(e) => setForm((prev) => ({ ...prev, urgency: e.target.value as LeadUrgency }))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          >
            <option value="high">Alta (0-30 dias)</option>
            <option value="medium">Media (1-3 meses)</option>
            <option value="low">Baja (+3 meses)</option>
          </select>
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-slate-200">Notas</span>
          <input
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Observaciones, notas rapidas"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none disabled:opacity-60"
        disabled={loading}
      >
        Crear lead
      </button>
    </form>
  )
}
