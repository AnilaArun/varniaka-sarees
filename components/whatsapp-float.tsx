"use client"

import { Share2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const WHATSAPP_NUMBER = "447721943635"
const DEFAULT_CHAT_TEXT =
  "Hi, I'm interested in your saree collection. Can you help me?"

const COLLECTION_NAMES: Record<string, string> = {
  "/all-sarees": "All Sarees",
  "/banarasi": "Banarasi Sarees",
  "/handloom-cotton": "Handloom Cotton Sarees",
  "/kalyani-cotton": "Kalyani Cotton Sarees",
  "/kerala-sarees": "Kerala Sarees",
  "/linen": "Linen Sarees",
  "/maheswari-cotton": "Maheswari Cotton Sarees",
  "/maheshwari-cotton": "Maheshwari Cotton Sarees",
  "/mul-cotton": "Mul Cotton Sarees",
  "/organza": "Organza Sarees",
  "/semi-silk": "Semi Silk Sarees",
  "/silk-sarees": "Silk Sarees",
}

function getPageHeading() {
  return document.querySelector("h1")?.textContent?.trim()
}

function buildChatText(pathname: string, pageUrl: string) {
  if (pathname.startsWith("/product/")) {
    const productName = getPageHeading() || "this saree"

    return (
      `Hi, I'm looking at ${productName} on Varnika Sarees.\n\n` +
      `Could you confirm availability and share more details?\n\n` +
      pageUrl
    )
  }

  const collectionName = COLLECTION_NAMES[pathname]

  if (collectionName) {
    return (
      `Hi, I'm looking at ${collectionName} on Varnika Sarees.\n\n` +
      `Could you help me with more collections or similar sarees?\n\n` +
      pageUrl
    )
  }

  return (
    `Hi, I'm interested in your saree collection.\n\n` +
    `Could you help me find available sarees and latest collections?\n\n` +
    pageUrl
  )
}

function buildShareText(pathname: string, pageUrl: string) {
  const pageName = pathname.startsWith("/product/")
    ? getPageHeading() || "this saree from Varnika"
    : COLLECTION_NAMES[pathname] || "Varnika Sarees"

  return `Have a look at ${pageName}.\n\n${pageUrl}`
}

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 32 32"
    >
      <path d="M16.02 3.2C9 3.2 3.29 8.84 3.29 15.78c0 2.22.59 4.39 1.7 6.3L3.2 28.8l6.91-1.79a12.92 12.92 0 0 0 5.91 1.45c7.02 0 12.73-5.64 12.73-12.58S23.04 3.2 16.02 3.2Zm0 22.98c-1.88 0-3.72-.5-5.33-1.44l-.38-.22-4.1 1.06 1.09-3.97-.25-.41a10.18 10.18 0 0 1-1.48-5.28c0-5.68 4.69-10.3 10.45-10.3s10.45 4.62 10.45 10.3-4.69 10.26-10.45 10.26Zm5.73-7.68c-.31-.15-1.85-.9-2.14-1-.29-.1-.5-.15-.71.15-.21.31-.81 1-.99 1.2-.18.21-.36.23-.67.08-.31-.15-1.31-.48-2.5-1.52-.92-.81-1.55-1.82-1.73-2.13-.18-.31-.02-.48.13-.63.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.15-.71-1.69-.97-2.31-.26-.6-.52-.52-.71-.53h-.6c-.21 0-.54.08-.83.39-.29.31-1.09 1.05-1.09 2.57 0 1.51 1.12 2.98 1.27 3.18.16.21 2.2 3.33 5.33 4.67.75.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.85-.75 2.11-1.47.26-.72.26-1.34.18-1.47-.08-.13-.28-.21-.6-.36Z" />
    </svg>
  )
}

export function WhatsAppFloat() {
  const pathname = usePathname()
  const [showShare, setShowShare] = useState(false)
  const [shareHref, setShareHref] = useState(
    "https://wa.me/?text=Check%20out%20this%20beautiful%20saree%20collection%20from%20Varnika!"
  )
  const [chatHref, setChatHref] = useState(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_CHAT_TEXT)}`
  )

  useEffect(() => {
    const pageUrl = window.location.href

    if (pathname.startsWith("/admin")) {
      return
    }

    setShareHref(
      `https://wa.me/?text=${encodeURIComponent(buildShareText(pathname, pageUrl))}`
    )
    setChatHref(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        buildChatText(pathname, pageUrl)
      )}`
    )
  }, [pathname])

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <>
      {/* Share Button - Right middle edge */}
      <a
        href={shareHref}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowShare(true)}
        onMouseLeave={() => setShowShare(false)}
        className="fixed right-0 top-1/2 z-[60] flex -translate-y-1/2 items-center gap-2 rounded-l-full bg-[#25D366] py-3 pl-3 pr-2 text-white shadow-lg transition-all hover:pr-4 hover:shadow-xl"
        aria-label="Share on WhatsApp"
      >
        <Share2 className="h-5 w-5" />
        {showShare && (
          <span className="text-sm font-medium">Share</span>
        )}
      </a>

      {/* WhatsApp Chat Button - Bottom right corner */}
      <a
        href={chatHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-[#25D366] p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppLogo className="h-6 w-6" />
        <span className="hidden pr-1 text-sm font-medium sm:inline">Chat with us</span>
      </a>
    </>
  )
}
