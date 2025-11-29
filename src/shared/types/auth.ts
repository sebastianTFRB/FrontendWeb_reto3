export type User = {
  id: number
  email: string
  full_name?: string | null
  agency_id?: number | null
  is_active: boolean
  is_superuser: boolean
}

export type TokenResponse = {
  access_token: string
  token_type: string
}
