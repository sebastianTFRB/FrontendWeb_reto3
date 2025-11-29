import { useEffect, useMemo, useState } from 'react'
import type { Lead, LeadCreatePayload } from '../../../shared/types'
import { LeadCaptureForm } from '../components/LeadCaptureForm'
import { LeadList } from '../components/LeadList'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'
import { api, ApiError } from '../../../shared/services/api'
import { useAuth } from '../../../shared/hooks/useAuth'

export const LeadsPage = () => {
  const { token, user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<'all' | 'A' | 'B' | 'C'>('all')
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    api
      .listLeads(token)
      .then((data) => setLeads(data))
      .catch((err) => {
        const detail = err instanceof ApiError ? err.message : 'No se pudo cargar los leads'
        setError(detail)
      })
      .finally(() => setLoading(false))
  }, [token])

  const filteredLeads = useMemo(
    () => (filter === 'all' ? leads : leads.filter((lead) => lead.category === filter)),
    [filter, leads]
  )

  const stats = useMemo(() => {
    const total = leads.length
    const a = leads.filter((l) => l.category === 'A').length
    const b = leads.filter((l) => l.category === 'B').length
    const c = leads.filter((l) => l.category === 'C').length
    return { total, a, b, c }
  }, [leads])

  const handleCreateLead = async (payload: LeadCreatePayload) => {
    if (!token) return
    if (!user?.agency_id) {
      setError('El usuario necesita agency_id para crear leads')
      return
    }
    setSaving(true)
    setError(undefined)
    try {
      const created = await api.createLead({ ...payload, agency_id: user.agency_id }, token)
      setLeads((prev) => [created, ...prev])
    } catch (err) {
      const detail = err instanceof ApiError ? err.message : 'No se pudo crear el lead'
      setError(detail)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        subtitle="Captura, clasifica y prioriza directamente contra el backend."
        actions={
          <div className="flex gap-2">
            {(['all', 'A', 'B', 'C'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                  filter === option
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow shadow-pink-500/30'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                {option === 'all' ? 'Todos' : `Solo ${option}`}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Leads totales" value={stats.total} helper="+ backend" />
        <StatCard label="Leads A" value={stats.a} helper="category: A" />
        <StatCard label="Leads B" value={stats.b} helper="category: B" />
        <StatCard label="Leads C" value={stats.c} helper="category: C" />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          {error}
        </p>
      ) : null}

      <LeadCaptureForm onSubmit={handleCreateLead} loading={saving} />

      {loading ? <p className="text-sm text-slate-300">Cargando leads...</p> : <LeadList leads={filteredLeads} />}
    </div>
  )
}
