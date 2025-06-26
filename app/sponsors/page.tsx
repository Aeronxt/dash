"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Code, Globe, Laptop, Brain, Users, Rocket } from "lucide-react"
import "./styles.css"

export default function SponsorsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const features = [
    {
      icon: Globe,
      title: "Brand Management",
      description: "Comprehensive digital presence and brand identity management across all platforms"
    },
    {
      icon: Code,
      title: "Technology Framework",
      description: "Advanced web solutions and custom software development for optimal performance"
    },
    {
      icon: Brain,
      title: "Driver Development",
      description: "Next-gen technology solutions for tracking and improving driver performance"
    },
    {
      icon: Laptop,
      title: "Digital Infrastructure",
      description: "Robust digital ecosystem supporting all aspects of racing operations"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Integrated solutions for efficient team coordination and communication"
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Cutting-edge technological solutions driving competitive advantage"
    }
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-black">
            {/* First Layer - Moving Gradient */}
            <div className="absolute inset-0 opacity-30 animate-gradient-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" 
                   style={{ backgroundSize: "400% 400%" }} 
              />
            </div>
            
            {/* Second Layer - Floating Elements */}
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-96 h-96 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${
                      i === 0 ? "rgba(59, 130, 246, 0.15)" :
                      i === 1 ? "rgba(139, 92, 246, 0.15)" :
                      "rgba(239, 68, 68, 0.15)"
                    }, transparent 70%)`,
                    left: `${i * 30}%`,
                    top: `${i * 20}%`
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                    x: [0, 30, 0],
                    y: [0, -30, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: i * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Third Layer - Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
          </div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our Technology
              <span className="text-gradient block">Partner</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Powered by innovation, driven by excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Aeron X Partnership Section */}
      <section className="py-24 bg-gradient-to-b from-black via-black/95 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-4xl font-bold mb-6">
                  Transforming Racing Through Technology
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our partnership with Aeron X has been instrumental in revolutionizing how we approach motorsport. As our primary technology partner, Aeron X has been an integral part of our journey, providing cutting-edge solutions that power every aspect of our operations.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  From managing our brand presence to developing next-generation driver training programs, Aeron X&apos;s technological framework has given us a competitive edge both on and off the track.
                </p>
                <Link 
                  href="https://www.aeronxtt.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="mt-6 bg-primary hover:bg-primary/90">
                    Visit Aeron X
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="relative h-[400px] rounded-lg overflow-hidden group"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <Image
                    src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages/aerondropshad.png"
                    alt="Aeron X Logo"
                    width={400}
                    height={200}
                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div 
              variants={itemVariants}
              className="mt-24"
            >
              <h3 className="text-3xl font-bold text-center mb-12">
                Powering Our Success
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card 
                    key={index}
                    className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                  >
                    <CardContent className="p-6">
                      <feature.icon className="h-8 w-8 text-accent mb-4" />
                      <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                      <p className="text-gray-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 