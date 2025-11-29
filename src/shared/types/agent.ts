export type LeadAnalyzeRequest = {
  mensaje: string
  canal?: string
  nombre?: string
  contacto?: string
}

export type LeadAnalyzeResponse = {
  lead_score: 'A' | 'B' | 'C'
  presupuesto?: number | null
  zona?: string | null
  tipo_propiedad?: 'apartamento' | 'casa' | 'local' | 'lote' | 'otro' | null
  urgencia: 'alta' | 'media' | 'baja'
  razonamiento: string
}
