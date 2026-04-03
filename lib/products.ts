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

export const products: Product[] = [
  // Silk Sarees - Pure Kanchipuram
  {
    id: "kanchipuram-lavender-gold",
    name: "Pure Kanchipuram - Lavender Gold",
    price: "£109",
    priceInCents: 10900,
    image: "/images/kanchipuram-purple.jpg",
    description:
      "Exquisite pure Kanchipuram silk saree in a stunning lavender hue with rich red and gold zari border featuring traditional paisley and peacock motifs. Handwoven by master artisans for timeless elegance.",
    category: "silk",
    categoryLabel: "Silk Sarees",
    details: {
      fabric: "Pure Kanchipuram Silk",
      length: "6.3 meters (including blouse piece)",
      width: "47 inches",
      blouse: "0.8 meters unstitched blouse piece included",
      care: "Dry clean only. Store in muslin cloth.",
    },
  },
  {
    id: "kanchipuram-offwhite-red",
    name: "Pure Kanchipuram - Off White Red",
    price: "£135",
    priceInCents: 13500,
    image: "/images/kanchipuram-offwhite.jpg",
    description:
      "Elegant off-white Kanchipuram silk saree with delicate butta work and a magnificent red and gold zari border adorned with traditional elephant and floral motifs. A masterpiece of South Indian weaving.",
    category: "silk",
    categoryLabel: "Silk Sarees",
    details: {
      fabric: "Pure Kanchipuram Silk",
      length: "6.3 meters (including blouse piece)",
      width: "47 inches",
      blouse: "0.8 meters unstitched blouse piece included",
      care: "Dry clean only. Store in muslin cloth.",
    },
  },

  // Handloom Cotton - Kalyani Cotton
  {
    id: "kalyani-cotton-pink-navy",
    name: "Kalyani Cotton - Pink Navy",
    price: "£20",
    priceInCents: 2000,
    image: "/images/kalyani-cotton-2.jpg",
    description:
      "Soft, lightweight, and breathable Kalyani cotton fabric designed for everyday elegance. Comfortable to wear with a smooth finish and classic appeal.",
    category: "handloom-cotton",
    categoryLabel: "Handloom Cotton",
    details: {
      fabric: "Pure Kalyani Cotton",
      length: "6.3 meters (including blouse piece)",
      width: "45 inches",
      blouse: "0.8 meters unstitched blouse piece included",
      care: "Hand wash or gentle machine wash. Iron on medium heat.",
    },
  },
  {
    id: "kalyani-cotton-mustard-purple",
    name: "Kalyani Cotton - Mustard Purple",
    price: "£20",
    priceInCents: 2000,
    image: "/images/kalyani-cotton-3.jpg",
    description:
      "Soft, lightweight, and breathable Kalyani cotton fabric designed for everyday elegance. Comfortable to wear with a smooth finish and classic appeal.",
    category: "handloom-cotton",
    categoryLabel: "Handloom Cotton",
    details: {
      fabric: "Pure Kalyani Cotton",
      length: "6.3 meters (including blouse piece)",
      width: "45 inches",
      blouse: "0.8 meters unstitched blouse piece included",
      care: "Hand wash or gentle machine wash. Iron on medium heat.",
    },
  },

  // Semi Silk Sarees
  {
    id: "semi-silk-mauve-green",
    name: "Semi Silk - Mauve Green",
    price: "£35",
    priceInCents: 3500,
    image: "/images/semi-silk-1.jpg",
    description:
      "Elegant mauve semi-silk saree with a stunning green and gold zari border featuring intricate geometric patterns. Perfect blend of tradition and contemporary style for festive occasions.",
    category: "semi-silk",
    categoryLabel: "Semi Silk",
    details: {
      fabric: "Semi Silk (Silk Cotton Blend)",
      length: "6.3 meters (including blouse piece)",
      width: "46 inches",
      blouse: "0.8 meters unstitched blouse piece included",
      care: "Dry clean recommended. Store in cool, dry place.",
    },
  },
  /* {
    id: "semi-silk-pink-green",
    name: "Semi Silk - Pink Green",
    price: "£48",
    priceInCents: 4800,
    image: "/images/semi-silk-2.jpg",
    description:
      "Beautiful pink and green dual-tone semi-silk saree with elaborate gold zari work. The contrasting colors and rich border make it ideal for celebrations and special events.",
    category: "semi-silk",
    categoryLabel: "Semi Silk",
    details: {
      fabric: "Semi Silk (Silk Cotton Blend)",
      length: "6.3 meters (including blouse piece)",
      width: "46 inches",
      blouse: "0.8 meters unstitched blouse piece included",
      care: "Dry clean recommended. Store in cool, dry place.",
    },
  }, */
  {
    id: "semi-silk-coral-blue",
    name: "Semi Silk - Coral Blue",
    price: "£28",
    priceInCents: 2800,
    image: "/images/semi-silk-3.jpg",
    description:
      "Stunning coral semi-silk saree with a vibrant blue and gold zari border adorned with traditional elephant and floral motifs. A statement piece for weddings and festivities.",
    category: "semi-silk",
    categoryLabel: "Semi Silk",
    details: {
      fabric: "Semi Silk (Silk Cotton Blend)",
      length: "6.3 meters (including blouse piece)",
      width: "46 inches",
      blouse: "0.8 meters unstitched blouse piece included",
      care: "Dry clean recommended. Store in cool, dry place.",
    },
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getProductsByCategory(category: Product["category"]): Product[] {
  return products.filter((product) => product.category === category)
}
