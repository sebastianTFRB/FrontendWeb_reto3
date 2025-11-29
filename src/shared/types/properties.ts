export type Property = {
  id: number
  title: string
  description?: string | null
  price: number
  area?: string | null
  location?: string | null
  property_type?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  parking?: boolean | null
  status: string
  agency_id?: number | null
  created_at: string
  photos?: string[] | null
}

export type PropertyCreatePayload = {
  title: string
  price: number
  agency_id: number
  description?: string
  area?: string
  location?: string
  property_type?: string
  bedrooms?: number
  bathrooms?: number
  parking?: boolean
  status?: string
  photos?: File[] | string[]
}

export type PropertyUpdatePayload = Partial<
  Pick<
    Property,
    'title' | 'description' | 'price' | 'area' | 'location' | 'property_type' | 'bedrooms' | 'bathrooms' | 'parking' | 'status'
  >
>
