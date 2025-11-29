export type ChatPreferencePayload = {
  mensaje: string
  canal?: string
  contacto?: string
  nombre?: string
  usuario_id?: number
  agency_id?: number
  presupuesto?: number
  zona?: string
  tipo_propiedad?: string
  habitaciones?: number
  banos?: number
  garaje?: boolean
  property_id?: number
}

export type ChatPreferenceResponse = {
  lead_id?: number | null
  category?: string | null
  intent_score?: number | null
  is_interested?: boolean
  interest_level?: string
  saved: boolean
  message?: string
  preferences?: Record<string, any> | null
}
