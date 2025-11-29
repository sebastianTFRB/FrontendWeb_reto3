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

export type ChatbotResponse = {
  reply: string
  lead_analysis: {
    lead_id?: number | null
    lead_score: 'A' | 'B' | 'C'
    is_interested: boolean
    interest_level: 'HIGH' | 'MEDIUM' | 'LOW'
    presupuesto?: number | null
    zona?: string | null
    tipo_propiedad?:
      | 'apartamento'
      | 'casa'
      | 'local'
      | 'oficina'
      | 'lote'
      | 'finca'
      | 'otro'
      | null
    urgencia: 'alta' | 'media' | 'baja'
    intencion_real?: string | null
    razonamiento: string
    recommendations?: Array<{
      id?: number
      title?: string
      price?: number
      location?: string | null
      property_type?: string | null
      bedrooms?: number | null
      bathrooms?: number | null
      parking?: boolean | null
      photos?: string[] | null
    }>
  }
}
