export interface Product {
  id: string
  name: string
  price: string
  priceInCents: number
  image: string
  description: string
  category: "silk" | "handloom-cotton" | "semi-silk"
  categoryLabel: string
  details?: {
    fabric?: string
    length?: string
    width?: string
    blouse?: string
    care?: string
  }
}

