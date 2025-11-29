// src/shared/services/leadSupabaseService.ts
import type { Lead, LeadCategory, LeadInteraction, LeadUrgency } from '../types'
import { supabase } from './supabaseClient'

// Normaliza registros sin tipar de Supabase al modelo Lead del front
const normalizeLead = (raw: any): Lead => {
  const parsePreferences = (prefs: any) => {
    if (!prefs) return null
    if (typeof prefs === 'object') return prefs as Record<string, any>
    if (typeof prefs === 'string') {
      try {
        return JSON.parse(prefs) as Record<string, any>
      } catch {
        return { raw: prefs }
      }
    }
    return { raw: prefs }
  }

  const normalizeInteraction = (interaction: any): LeadInteraction => ({
    id: Number(interaction.id),
    lead_id: Number(interaction.lead_id),
    channel: interaction.channel ?? 'unknown',
    direction: interaction.direction ?? 'unknown',
    message: interaction.message ?? '',
    created_at: interaction.created_at ?? new Date().toISOString(),
  })

  const interactionsSource = raw.lead_interactions || raw.interactions || []

  return {
    id: Number(raw.id),
    full_name: raw.full_name ?? 'Lead sin nombre',
    email: raw.email ?? null,
    phone: raw.phone ?? null,
    preferred_area: raw.preferred_area ?? null,
    budget: raw.budget != null ? Number(raw.budget) : null,
    urgency: (raw.urgency ?? 'medium') as LeadUrgency,
    notes: raw.notes ?? null,
    status: raw.status ?? 'nuevo',
    category: (raw.category ?? 'C') as LeadCategory,
    preferences: parsePreferences(raw.preferences),
    intent_score: Number(raw.intent_score ?? 0),
    agency_id: raw.agency_id ?? null,
    created_at: raw.created_at ?? new Date().toISOString(),
    updated_at: raw.updated_at ?? raw.created_at ?? new Date().toISOString(),
    interactions: Array.isArray(interactionsSource)
      ? interactionsSource.map(normalizeInteraction)
      : [],
  }
}

export class LeadServiceWeb {
  // Obtener todos los leads (modo administrador)
  static async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(
        [
          'id',
          'full_name',
          'category',
          'email',
          'phone',
          'preferred_area',
          'budget',
          'urgency',
          'intent_score',
          'notes',
          'status',
          'created_at',
          'updated_at',
          'agency_id',
        ].join(', ')
      )
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`No se pudieron cargar los leads: ${error.message}`)
    }

    return (data ?? []).map(normalizeLead)
  }

  // Obtener un lead por id
  static async getLeadById(id: number): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select(
        [
          'id',
          'full_name',
          'category',
          'email',
          'phone',
          'preferred_area',
          'budget',
          'urgency',
          'intent_score',
          'notes',
          'status',
          'created_at',
          'updated_at',
          'agency_id',
          'lead_interactions (id, lead_id, channel, direction, message, created_at)',
        ].join(', ')
      )
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(`No se pudo cargar el lead: ${error.message}`)
    }

    if (!data) return null
    return normalizeLead(data)
  }
}
