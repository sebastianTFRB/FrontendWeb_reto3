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
  full_name: string
  email?: string | null
  phone?: string | null
  preferred_area?: string | null
  budget?: number | null
  urgency: LeadUrgency
  notes?: string | null
  status: string
  category: LeadCategory
  preferences?: Record<string, any> | null
  intent_score: number
  agency_id?: number | null
  created_at: string
  updated_at: string
  interactions: LeadInteraction[]
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
