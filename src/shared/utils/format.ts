export const formatCurrency = (value?: number | null) => {
  const parsed = Number(value ?? 0)
  return Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number.isNaN(parsed) ? 0 : parsed)
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
  })

export const formatUrgency = (urgency?: string) => {
  if (!urgency) return 'Sin definir'
  if (urgency === 'high') return 'Alta'
  if (urgency === 'medium') return 'Media'
  if (urgency === 'low') return 'Baja'
  return urgency
}
