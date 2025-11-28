export type PropertyType = 'departamento' | 'casa' | 'oficina' | 'loft'

export type Property = {
  id: string
  title: string
  price: number
  location: string
  type: PropertyType
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  score: number
  tags?: string[]
}
