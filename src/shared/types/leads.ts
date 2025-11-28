export type LeadUrgency = 'alta' | 'media' | 'baja'
export type LeadStatus = 'A' | 'B' | 'C'

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  budget: number
  location: string
  urgency: LeadUrgency
  intentScore?: number
  tags?: string[]
  status: LeadStatus
  goal?: string
  notes?: string
  source?: string
  createdAt: string
}
