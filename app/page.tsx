"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Loader from "@/components/ui/loader"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    // Add a timeout to show a message if loading takes too long
    const timeoutId = setTimeout(() => {
      setShowTimeout(true)
    }, 5000) // Show message after 5 seconds

    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect authenticated users to dashboard
        router.replace('/dashboard')
      } else {
        // Redirect unauthenticated users to sign-in page
        router.replace('/auth/signin')
      }
    }
  }, [user, loading, router])

  // Show loading screen while checking authentication and redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img 
          src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
          alt="Flowscape Logo"
          className="h-16 w-auto"
        />
        <div className="scale-50">
          <Loader />
        </div>
        <p className="text-gray-400">Loading...</p>
        {showTimeout && (
          <div className="text-center mt-4">
            <p className="text-gray-400">Taking longer than expected...</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:text-blue-400 mt-2"
            >
              Click here to refresh
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 