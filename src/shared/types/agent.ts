export type LeadAnalyzeRequest = {
  mensaje: string
  canal?: string
  nombre?: string
  contacto?: string
  usuario_id?: string
  agency_id?: number
}

export type LeadAnalyzeResponse = {
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
