export type Property = {
  id: number
  title: string
  description?: string | null
  price: number
  area?: string | null
  location?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  status: string
  agency_id?: number | null
  created_at: string
}

export type PropertyCreatePayload = {
  title: string
  price: number
  agency_id: number
  description?: string
  area?: string
  location?: string
  bedrooms?: number
  bathrooms?: number
  status?: string
}

export type PropertyUpdatePayload = Partial<
  Pick<Property, 'title' | 'description' | 'price' | 'area' | 'location' | 'bedrooms' | 'bathrooms' | 'status'>
>
