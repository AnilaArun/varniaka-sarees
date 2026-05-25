import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Playfair_Display, Lato } from "next/font/google"

import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})
const _lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
})

export const metadata: Metadata = {
  title: "Varnika - Woven For Life | Luxury Sarees",
  description:
    "Discover the finest handwoven sarees at Varnika. From Banarasi silk to Kanjeevaram, explore our curated collection of luxury Indian sarees woven with tradition and love.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
<<<<<<< HEAD
          <CartProvider>
            {children}
            <CartSidebar />
            <WhatsAppFloat />
          </CartProvider>
        </body>
=======
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
>>>>>>> 584e901 (some improvements to admin page and main page)
    </html>
  )
}
