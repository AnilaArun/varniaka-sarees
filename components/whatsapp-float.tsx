"use client"

import { MessageCircle, Share2 } from "lucide-react"
import { useState } from "react"

const WHATSAPP_NUMBER = "447721943635"

export function WhatsAppFloat() {
  const [showShare, setShowShare] = useState(false)

  const handleWhatsAppChat = () => {
    const message = encodeURIComponent(
      "Hi, I'm interested in your saree collection. Can you help me?"
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  const handleShareToWhatsApp = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : ""
    const message = encodeURIComponent(
      `Check out this beautiful saree collection from Varnika!\n\n${currentUrl}`
    )
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Share Button */}
      <button
        onClick={handleShareToWhatsApp}
        onMouseEnter={() => setShowShare(true)}
        onMouseLeave={() => setShowShare(false)}
        className="group flex items-center gap-2 rounded-full bg-[#25D366] p-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        aria-label="Share on WhatsApp"
      >
        {showShare && (
          <span className="hidden pr-1 text-sm font-medium sm:inline">Share</span>
        )}
        <Share2 className="h-5 w-5" />
      </button>

      {/* WhatsApp Chat Button */}
      <button
        onClick={handleWhatsAppChat}
        className="group flex items-center gap-2 rounded-full bg-[#25D366] p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden pr-1 text-sm font-medium sm:inline">Chat with us</span>
      </button>
    </div>
  )
}
