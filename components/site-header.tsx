"use client"

import React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X, User, LogOut } from "lucide-react"
import { motion } from "framer-motion"

export function SiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, userProfile, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setIsScrolled(offset > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Only keep essential navigation items
  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" }
  ]

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 bg-transparent py-2",
      isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : ""
    )}>
      <div className="container flex items-center justify-between h-20">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
              alt="Flowscape Logo"
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
          {navigationItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                "uppercase font-bold tracking-wider text-white nav-link px-0 py-0 text-sm xl:text-base transition-colors duration-300",
                pathname === item.href ? "text-accent" : "hover:text-accent"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Authentication Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white">
                <User className="h-4 w-4" />
                <span className="text-sm">{userProfile?.full_name || user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-accent text-accent hover:bg-accent hover:text-black"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-black">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-black font-bold">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-accent hover:bg-white/10"
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[280px] sm:w-[350px] bg-background/95 backdrop-blur-md border-l border-accent/20"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-accent/20">
                  <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <img 
                      src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
                      alt="Flowscape Logo"
                      className="h-16 w-auto"
                    />
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-accent">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6">
                  <div className="space-y-1">
                    {navigationItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-lg text-base font-semibold tracking-wide transition-all duration-300",
                            pathname === item.href 
                              ? "text-accent bg-accent/10 border-l-4 border-accent" 
                              : "text-white hover:text-accent hover:bg-white/5 hover:translate-x-1"
                          )}
                        >
                          <span className="uppercase">{item.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                {/* Footer Actions */}
                <div className="border-t border-accent/20 pt-6 space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 text-white px-4 py-2 bg-accent/10 rounded-lg">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{userProfile?.full_name || user.email}</span>
                      </div>
                      <Button
                        onClick={() => {
                          signOut()
                          setIsMobileMenuOpen(false)
                        }}
                        variant="outline"
                        className="w-full border-accent text-accent hover:bg-accent hover:text-black"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-black">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-black font-bold">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}