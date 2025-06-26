"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
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
    href: "/",
    icon: Home
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3
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
    title: "Reports",
    href: "/reports",
    icon: FileText
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar
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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

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
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-gray-800 text-white border-l-4 border-gray-600" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
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
        <main className="min-h-screen bg-black">
          {children}
        </main>
      </div>
    </div>
  )
} 