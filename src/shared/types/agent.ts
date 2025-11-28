import type { LeadStatus } from './leads'

export type AgentInsight = {
  leadId: string
  interestLevel: 'alto' | 'medio' | 'bajo'
  budgetDetected: number
  preferredZones: string[]
  confidence: number
  classification: LeadStatus
  recommendedActions: string[]
  summary: string
}
