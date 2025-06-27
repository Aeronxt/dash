"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Loader from "@/components/ui/loader"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard')
      } else {
        // Don't auto-redirect, let users choose
      }
    }
  }, [user, loading, router])

  if (loading) {
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
        </div>
      </div>
    )
  }

  if (user) {
    // Show loading while redirecting authenticated users
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
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center">
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
            alt="Flowscape Logo"
            className="h-20 w-auto"
          />
        </div>
      </div>

      {/* Divider line */}
      <div className="w-px bg-gray-700"></div>

      {/* Right side - Welcome message */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Welcome to Flowscape</h1>
            <p className="text-gray-400 mb-8">
              Your comprehensive digital platform for modern experiences.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg font-semibold"
            >
              Sign In
            </Button>
            
            <Button 
              onClick={() => router.push('/auth/signup')}
              variant="outline"
              className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-900 h-12 text-lg font-semibold"
            >
              Create Account
            </Button>
          </div>
          
          <div className="pt-4">
            <p className="text-gray-500 text-sm">
              Get started by creating an account or signing in to access your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 