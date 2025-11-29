export type AnalyticsSummary = {
  total_leads: number
  by_score: Record<string, number>
  by_interest: {
    interested: number
    not_interested: number
  }
  by_channel: Record<string, number>
}
