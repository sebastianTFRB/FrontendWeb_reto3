// src/shared/services/leadSupabaseService.ts
import type { Lead } from '../types'
import { supabase } from './supabaseClient'

export class LeadServiceWeb {
  // Obtener todos los leads (modo administrador)
  static async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(
        'id, full_name, category, email, phone, preferred_area, budget, urgency, intent_score, notes, status'
      )
      .order('id', { ascending: false })

    if (error) {
      // puedes lanzar error o loguearlo según tu manejo global
      throw new Error(error.message)
    }

    // data ya viene tipado como any[], lo casteamos a Lead[]
    return (data ?? []) as Lead[]
  }

  // Obtener un lead por id
  static async getLeadById(id: number): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    if (!data) return null
    return data as Lead
  }
}
