export type LeadUrgency = 'low' | 'medium' | 'high'

export type LeadCategory = 'A' | 'B' | 'C'

export type LeadInteraction = {
  id: number
  lead_id: number
  channel: string
  direction: string
  message: string
  created_at: string
}

export type Lead = {
  id: number
  full_name: string | null
  email: string | null
  phone: string | null
  preferred_area: string | null
  budget: number | null
  urgency: string | null
  category: string | null
  intent_score: number | null
  notes: string | null
  status: string | null
}

export type LeadCreatePayload = {
  full_name: string
  email?: string
  phone?: string
  preferred_area?: string
  budget?: number
  urgency?: LeadUrgency
  notes?: string
  agency_id?: number
}

export type LeadUpdatePayload = Partial<
  Pick<
    Lead,
    'full_name' | 'email' | 'phone' | 'preferred_area' | 'budget' | 'urgency' | 'notes' | 'status' | 'category'
  >
>
