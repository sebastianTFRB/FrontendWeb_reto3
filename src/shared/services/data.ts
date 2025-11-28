import type {
  AgentInsight,
  AnalyticsSnapshot,
  Lead,
  Property,
  TrendPoint,
  ActivityItem,
} from '../types'
import { classifyLead } from '../utils/format'

export const leadsMock: Lead[] = [
  {
    id: 'ld-101',
    name: 'María Fernanda',
    email: 'maria@cliente.com',
    phone: '+52 55 1234 5678',
    budget: 320000,
    location: 'CDMX - Polanco',
    urgency: 'alta',
    goal: 'Mudanza en 60 días',
    status: 'A',
    intentScore: 0.92,
    tags: ['premium', 'whatsapp'],
    source: 'Campaña Meta',
    createdAt: '2024-11-15',
  },
  {
    id: 'ld-102',
    name: 'Jorge Ramírez',
    email: 'jorge@cliente.com',
    phone: '+52 81 9876 1111',
    budget: 210000,
    location: 'Monterrey - San Pedro',
    urgency: 'media',
    goal: 'Inversión renta',
    status: 'B',
    intentScore: 0.7,
    tags: ['inversión'],
    source: 'Landing orgánica',
    createdAt: '2024-11-12',
  },
  {
    id: 'ld-103',
    name: 'Sofía Aguilar',
    email: 'sofia@cliente.com',
    phone: '+52 33 3333 3333',
    budget: 140000,
    location: 'Guadalajara - Providencia',
    urgency: 'baja',
    goal: 'Primera compra',
    status: 'C',
    intentScore: 0.45,
    tags: ['email'],
    source: 'Formulario web',
    createdAt: '2024-11-10',
  },
]

export const propertiesMock: Property[] = [
  {
    id: 'pr-1',
    title: 'Departamento boutique en Polanco',
    price: 315000,
    location: 'CDMX - Polanco',
    type: 'departamento',
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    score: 92,
    tags: ['listo para habitar', 'amenidades'],
  },
  {
    id: 'pr-2',
    title: 'Penthouse con vista a la Sierra Madre',
    price: 450000,
    location: 'Monterrey - San Pedro',
    type: 'departamento',
    bedrooms: 3,
    bathrooms: 3,
    area: 200,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
    score: 95,
    tags: ['lujo', 'roof garden'],
  },
  {
    id: 'pr-3',
    title: 'Casa moderna con patio interior',
    price: 180000,
    location: 'Guadalajara - Providencia',
    type: 'casa',
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    score: 82,
    tags: ['familia', 'luz natural'],
  },
  {
    id: 'pr-4',
    title: 'Loft creativo para inversión',
    price: 155000,
    location: 'CDMX - Roma Norte',
    type: 'loft',
    bedrooms: 1,
    bathrooms: 1,
    area: 75,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
    score: 78,
    tags: ['alta demanda', 'airbnb ready'],
  },
]

export const agentInsightsMock: AgentInsight[] = leadsMock.map((lead) => ({
  leadId: lead.id,
  interestLevel: lead.status === 'A' ? 'alto' : lead.status === 'B' ? 'medio' : 'bajo',
  budgetDetected: lead.budget,
  preferredZones: [lead.location],
  confidence: Math.round(((lead.intentScore ?? 0.6) + 0.2) * 100),
  classification: classifyLead(lead),
  recommendedActions:
    lead.status === 'A'
      ? ['Agendar llamada en 24h', 'Enviar 3 opciones similares']
      : ['Enviar brochure', 'Revisar presupuesto en 3 días'],
  summary:
    lead.status === 'A'
      ? 'Alta probabilidad de cierre, busca propiedad premium.'
      : 'Lead en exploración, nutrir con contenido y validar presupuesto.',
}))

export const analyticsSnapshot: AnalyticsSnapshot = {
  totalLeads: 164,
  classifiedLeads: 148,
  distribution: { A: 46, B: 62, C: 40 },
  efficiency: 0.82,
  conversionRate: 0.31,
  avgBudget: 230000,
  coverageZones: 12,
}

export const trendsMock: TrendPoint[] = [
  { label: 'Lun', value: 18 },
  { label: 'Mar', value: 26 },
  { label: 'Mié', value: 24 },
  { label: 'Jue', value: 31 },
  { label: 'Vie', value: 37 },
  { label: 'Sáb', value: 20 },
  { label: 'Dom', value: 12 },
]

export const activityFeed: ActivityItem[] = [
  {
    id: 'ac-1',
    message: 'Nuevo lead clasificado como A (María) en CDMX.',
    time: 'hace 5 min',
    status: 'success',
  },
  {
    id: 'ac-2',
    message: 'El agente mejoró 8% la precisión tras 5 nuevas propiedades.',
    time: 'hace 22 min',
    status: 'info',
  },
  {
    id: 'ac-3',
    message: 'Lead Sofía movido a B tras validar presupuesto.',
    time: 'hace 1 h',
    status: 'warning',
  },
]
