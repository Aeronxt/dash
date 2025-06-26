"use client"

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useInView, useAnimation } from "framer-motion"
import { Icons } from "@/components/icons"

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className }: HeroSectionProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])
  
  return (
    <div 
      ref={ref}
      className={cn(
        "relative h-screen w-full overflow-hidden",
        className
      )}
    >
      {/* Full-screen background video or image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/other//timthumb%20(1).jfif" 
          alt="Racing car on track"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>
      
      {/* Content overlay */}
      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-white">
        <motion.div
          className="text-center"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                delay: 0.3
              }
            }
          }}
        >
          <h2 className="font-montserrat mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gradient">
            ATXR RACING
          </h2>
          <h1 className="font-montserrat mb-4 text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            DRIVE
            <span className="text-gradient"> BEYOND </span>
            LIMITS
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg sm:text-xl md:text-2xl text-white/90">
            Experience the thrill of professional racing with ATXR Racing
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Drive With Us
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              Explore Our Team
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <Icons.chevronRight className="h-8 w-8 rotate-90 text-white opacity-70" />
      </div>
      
      {/* Racing stripe decoration */}
      <div className="absolute -right-10 top-0 h-full w-20 bg-accent/80 transform skew-x-12" />
      <div className="absolute -right-4 top-0 h-full w-4 bg-primary/80 transform skew-x-12" />
    </div>
  )
}