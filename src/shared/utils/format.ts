import type { Lead } from '../types/leads'

export const formatCurrency = (value: number) =>
  Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
  })

export const classifyLead = (lead: Lead) => {
  const urgencyScore = lead.urgency === 'alta' ? 2 : lead.urgency === 'media' ? 1 : 0
  const budgetScore = lead.budget >= 250000 ? 2 : lead.budget >= 150000 ? 1 : 0
  const intentScore = (lead.intentScore ?? 0.5) * 2
  const total = urgencyScore + budgetScore + intentScore

  if (total >= 4.5) return 'A'
  if (total >= 3) return 'B'
  return 'C'
}
