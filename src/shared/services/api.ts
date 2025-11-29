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
} from '../types'

const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_BASE = RAW_BASE_URL.replace(/\/$/, '')

export class ApiError extends Error {
  status?: number
  data?: unknown
}

type ApiRequestInit = Omit<RequestInit, 'body'> & { body?: unknown }

const isJsonBody = (body: unknown) =>
  !!body && !(body instanceof FormData) && !(body instanceof URLSearchParams) && typeof body !== 'string'

async function request<T>(path: string, init: ApiRequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers || {})
  const url = `${API_BASE}${path}`
  const preparedBody: BodyInit | undefined = isJsonBody(init.body)
    ? (JSON.stringify(init.body) as BodyInit)
    : (init.body as BodyInit | undefined)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const shouldSetJson = !!preparedBody && !(preparedBody instanceof FormData) && !(preparedBody instanceof URLSearchParams)
  if (shouldSetJson && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, { ...init, headers, body: preparedBody })
  const text = await response.text()
  const data = text ? (JSON.parse(text) as unknown) : undefined

  if (!response.ok) {
    const detail = (data as any)?.detail
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: any) => d?.msg || d?.detail || "").filter(Boolean).join("; ")
          : response.statusText

    const error = new ApiError(message || response.statusText)
    error.status = response.status
    error.data = data
    throw error
  }

  return data as T
}

export const api = {
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

  listLeads: (token: string) => request<Lead[]>('/api/leads', { method: 'GET' }, token),
  createLead: (payload: LeadCreatePayload, token: string) =>
    request<Lead>('/api/leads', { method: 'POST', body: payload }, token),
  getLead: (id: number, token: string) => request<Lead>(`/api/leads/${id}`, { method: 'GET' }, token),
  updateLead: (id: number, payload: LeadUpdatePayload, token: string) =>
    request<Lead>(`/api/leads/${id}`, { method: 'PUT', body: payload }, token),
  deleteLead: (id: number, token: string) =>
    request<void>(`/api/leads/${id}`, { method: 'DELETE' }, token),
  addInteraction: (id: number, payload: { channel?: string; direction?: string; message: string }, token: string) =>
    request(`/api/leads/${id}/interactions`, { method: 'POST', body: payload }, token),

  listProperties: (token: string) => request<Property[]>('/api/properties', { method: 'GET' }, token),
  createProperty: (payload: PropertyCreatePayload, token: string) =>
    request<Property>('/api/properties', { method: 'POST', body: payload }, token),
  updateProperty: (id: number, payload: PropertyUpdatePayload, token: string) =>
    request<Property>(`/api/properties/${id}`, { method: 'PUT', body: payload }, token),
  deleteProperty: (id: number, token: string) =>
    request<void>(`/api/properties/${id}`, { method: 'DELETE' }, token),

  analyzeLead: (payload: LeadAnalyzeRequest) =>
    request<LeadAnalyzeResponse>('/api/lead/analyze', { method: 'POST', body: payload }),
  analytics: () => request<AnalyticsSummary>('/api/analytics/summary', { method: 'GET' }),
}

export { API_BASE }
