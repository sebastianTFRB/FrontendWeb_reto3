export type AnalyticsSnapshot = {
  totalLeads: number
  classifiedLeads: number
  distribution: { A: number; B: number; C: number }
  efficiency: number
  conversionRate: number
  avgBudget: number
  coverageZones: number
}

export type TrendPoint = {
  label: string
  value: number
}

export type ActivityItem = {
  id: string
  message: string
  time: string
  status: 'success' | 'warning' | 'info'
}
