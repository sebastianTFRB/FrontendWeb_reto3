export type User = {
  id: number
  email: string
  full_name?: string | null
  agency_id?: number | null
  role?: string | null
  is_active: boolean
  is_superuser: boolean
}

export type TokenResponse = {
  access_token: string
  token_type: string
  user_id?: number
  role?: string
  agency_id?: number | null
}
