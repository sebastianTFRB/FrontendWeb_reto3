import type {
  AnalyticsSummary,
  Lead,
  LeadAnalyzeRequest,
  LeadAnalyzeResponse,
  LeadCreatePayload,
  LeadUpdatePayload,
  Property,
  PropertyCreatePayload,
  PropertyUpdatePayload,
  TokenResponse,
  User,
  ChatPreferencePayload,
  ChatPreferenceResponse,
  ChatbotResponse,
} from '../types'

const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_BASE = RAW_BASE_URL.replace(/\/$/, '')

export class ApiError extends Error {
  status?: number
  data?: unknown
}

type ApiRequestInit = Omit<RequestInit, 'body'> & { body?: unknown }

const isJsonBody = (body: unknown) =>
  !!body &&
  !(body instanceof FormData) &&
  !(body instanceof URLSearchParams) &&
  typeof body !== 'string'

async function request<T>(path: string, init: ApiRequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers || {})
  const url = `${API_BASE}${path}`
  const preparedBody: BodyInit | undefined = isJsonBody(init.body)
    ? (JSON.stringify(init.body) as BodyInit)
    : (init.body as BodyInit | undefined)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const shouldSetJson =
    !!preparedBody &&
    !(preparedBody instanceof FormData) &&
    !(preparedBody instanceof URLSearchParams)

  if (shouldSetJson && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, { ...init, headers, body: preparedBody })
  const text = await response.text()
  const data = text ? (JSON.parse(text) as unknown) : undefined

  if (!response.ok) {
    const detail = (data as any)?.detail
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail
              .map((d: any) => d?.msg || d?.detail || '')
              .filter(Boolean)
              .join('; ')
          : response.statusText

    const error = new ApiError(message || response.statusText)
    error.status = response.status
    error.data = data
    throw error
  }

  return data as T
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (payload: { email: string; password: string; full_name?: string }) =>
    request<User>('/api/auth/register', {
      method: 'POST',
      body: payload,
    }),

  me: (token: string) => request<User>('/api/auth/me', { method: 'GET' }, token),

  // Leads CRUD
  listLeads: (token: string) => request<Lead[]>('/api/leads', { method: 'GET' }, token),

  createLead: (payload: LeadCreatePayload, token: string) =>
    request<Lead>('/api/leads', { method: 'POST', body: payload }, token),

  getLead: (id: number, token: string) =>
    request<Lead>(`/api/leads/${id}`, { method: 'GET' }, token),

  updateLead: (id: number, payload: LeadUpdatePayload, token: string) =>
    request<Lead>(`/api/leads/${id}`, { method: 'PUT', body: payload }, token),

  deleteLead: (id: number, token: string) =>
    request<void>(`/api/leads/${id}`, { method: 'DELETE' }, token),

  addInteraction: (
    id: number,
    payload: { channel?: string; direction?: string; message: string },
    token: string,
  ) => request(`/api/leads/${id}/interactions`, { method: 'POST', body: payload }, token),

  // Properties
  listProperties: (
    token: string,
    filters: {
      location?: string
      property_type?: string
      min_price?: number | null
      max_price?: number | null
      bedrooms?: number | null
      bathrooms?: number | null
      parking?: boolean | null
    } = {},
  ) => {
    const params = new URLSearchParams()
    if (filters.location) params.set('location', filters.location)
    if (filters.property_type) params.set('property_type', filters.property_type)
    if (filters.min_price != null) params.set('min_price', String(filters.min_price))
    if (filters.max_price != null) params.set('max_price', String(filters.max_price))
    if (filters.bedrooms != null) params.set('bedrooms', String(filters.bedrooms))
    if (filters.bathrooms != null) params.set('bathrooms', String(filters.bathrooms))
    if (filters.parking != null) params.set('parking', String(filters.parking))
    const query = params.toString()
    const path = `/api/properties${query ? `?${query}` : ''}`
    return request<Property[]>(path, { method: 'GET' }, token)
  },

  getProperty: (id: number, token: string) =>
    request<Property>(`/api/properties/${id}`, { method: 'GET' }, token),

  createProperty: (payload: PropertyCreatePayload, token: string) => {
    if (
      (payload as any).photos &&
      Array.isArray((payload as any).photos) &&
      (payload as any).photos.length > 0
    ) {
      const formData = new FormData()
      formData.append('title', payload.title)
      formData.append('price', String(payload.price))
      if (payload.description) formData.append('description', payload.description)
      if (payload.area) formData.append('area', payload.area)
      if (payload.location) formData.append('location', payload.location)
      if (payload.property_type) formData.append('property_type', payload.property_type)
      if (payload.bedrooms != null) formData.append('bedrooms', String(payload.bedrooms))
      if (payload.bathrooms != null) formData.append('bathrooms', String(payload.bathrooms))
      if (payload.parking != null) formData.append('parking', String(payload.parking))
      if (payload.status) formData.append('status', payload.status)
      if (payload.agency_id) formData.append('agency_id', String(payload.agency_id))
      ;(payload as any).photos.forEach((file: File) => {
        formData.append('photos', file)
      })
      return request<Property>('/api/properties/with-media', { method: 'POST', body: formData }, token)
    }
    const { photos, ...rest } = payload as any
    return request<Property>('/api/properties', { method: 'POST', body: rest }, token)
  },

  updateProperty: (id: number, payload: PropertyUpdatePayload, token: string) =>
    request<Property>(`/api/properties/${id}`, { method: 'PUT', body: payload }, token),

  deleteProperty: (id: number, token: string) =>
    request<void>(`/api/properties/${id}`, { method: 'DELETE' }, token),

  // IA de leads (solo análisis clásico)
  analyzeLead: (payload: LeadAnalyzeRequest) =>
    request<LeadAnalyzeResponse>('/api/agent/analyze', {
      method: 'POST',
      body: payload,
    }),

  // Chatbot conversacional (usa ConversationalAgentService en el back)
  chatbotAnalyze: (payload: { message: string; contact_key?: string | null }) =>
    request<ChatbotResponse>('/api/chatbot/', {
      method: 'POST',
      body: payload,
    }),

  // Analytics
  analytics: () =>
    request<AnalyticsSummary>('/api/analytics/summary', {
      method: 'GET',
    }),

  // Preferencias de chat
  saveChatPreferences: (payload: ChatPreferencePayload, token?: string) =>
    request<ChatPreferenceResponse>('/api/chat/preferences', {
      method: 'POST',
      body: payload,
    }, token),
}

export { API_BASE }
