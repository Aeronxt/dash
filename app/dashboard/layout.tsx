"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Home,
  Users,
  Settings,
  MessageSquare,
  Folder,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react"
import Loader from "@/components/ui/loader"

const sidebarItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Folder
  },
  {
    title: "Team",
    href: "/team",
    icon: Users
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, userProfile, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  // Handle page loading state based on pathname changes
  useEffect(() => {
    // Reset loading state when pathname changes (page has loaded)
    setPageLoading(false)
  }, [pathname])

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      setPageLoading(true)
      // Immediate navigation with visual feedback
      router.push(href)
      setSidebarOpen(false)
    } else {
      setSidebarOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center">
              <img 
                src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
                alt="Logo"
                className="h-8 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation(item.href)
                  }}
                  onMouseEnter={() => router.prefetch(item.href)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500 shadow-lg shadow-blue-500/20" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-l-4 hover:border-gray-600"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    pageLoading && pathname !== item.href ? "animate-pulse" : ""
                  )} />
                  {item.title}
                  {pageLoading && pathname !== item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/30 rounded-lg">
              <div className="p-2 bg-gray-700 rounded-full">
                <User className="h-4 w-4 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userProfile?.user_display_name || userProfile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={signOut}
              className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="lg:hidden bg-black border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <img 
              src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
              alt="Logo"
              className="h-6 w-auto"
            />
            <div className="w-8" /> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen bg-black relative">
          {/* Loading overlay */}
          {pageLoading && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-xs opacity-75">Loading...</p>
              </div>
            </div>
          )}
          
          {/* Page content with transition */}
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            pageLoading ? "opacity-50 scale-95" : "opacity-100 scale-100"
          )}>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white text-sm">Loading page...</p>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
} 