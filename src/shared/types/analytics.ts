export type TopZone = {
  zona: string
  count: number
}

export type AnalyticsSummary = {
  total_leads: number
  lead_score_counts: Record<string, number>
  urgency_counts: Record<string, number>
  tipo_propiedad_counts: Record<string, number>
  canal_counts: Record<string, number>
  avg_presupuesto: number | null
  top_zonas: TopZone[]
}
