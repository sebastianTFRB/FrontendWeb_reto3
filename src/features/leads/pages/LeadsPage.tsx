import { useMemo, useState } from 'react'
import type { Lead } from '../../../shared/types'
import { leadsMock } from '../../../shared/services/data'
import { LeadCaptureForm } from '../components/LeadCaptureForm'
import { LeadList } from '../components/LeadList'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StatCard } from '../../../shared/components/StatCard'

export const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>(leadsMock)
  const [filter, setFilter] = useState<'all' | 'A' | 'B' | 'C'>('all')

  const filteredLeads = useMemo(
    () => (filter === 'all' ? leads : leads.filter((lead) => lead.status === filter)),
    [filter, leads]
  )

  const stats = useMemo(() => {
    const total = leads.length
    const a = leads.filter((l) => l.status === 'A').length
    const b = leads.filter((l) => l.status === 'B').length
    const c = leads.filter((l) => l.status === 'C').length
    return { total, a, b, c }
  }, [leads])

  const handleCreateLead = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev])
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        subtitle="Captura, clasifica y prioriza automáticamente."
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
        <StatCard label="Leads totales" value={stats.total} helper="+12 esta semana" />
        <StatCard label="Leads A" value={stats.a} helper="Listos para contacto" trend="+8%" />
        <StatCard label="Leads B" value={stats.b} helper="Nurturing activo" />
        <StatCard label="Leads C" value={stats.c} helper="Automatizar seguimiento" />
      </div>

      <LeadCaptureForm onSubmit={handleCreateLead} />
      <LeadList leads={filteredLeads} />
    </div>
  )
}
