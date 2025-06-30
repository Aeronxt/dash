"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function PageRefreshHandler() {
  const pathname = usePathname()
  const lastPathname = useRef<string | null>(null)

  useEffect(() => {
    // Only refresh if this is a new navigation (not from a refresh)
    if (lastPathname.current !== null && lastPathname.current !== pathname) {
      window.location.reload()
    }
    // Update the last pathname
    lastPathname.current = pathname
  }, [pathname])

  return null
} 