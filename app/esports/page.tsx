"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Check, ArrowRight } from "lucide-react"

export default function EsportsPage() {
  const teamMembers = [
    {
      name: "Arhaam Rahaman",
      role: "Driver",
      image: "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//469034667_1750292265788291_2540125736135567474_n.jpg"
    },
    {
      name: "Ashfiqur Rahman",
      role: "Driver",
      image: "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//457656101_3485453214932660_7743845053782697430_n.jpg"
    },
    {
      name: "Antar Bhuyan",
      role: "Driver",
      image: "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//29433069_10215689387817176_912363968360611840_n.jpg"
    },
    {
      name: "Sombit Dewan",
      role: "Driver",
      image: "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//492333502_122221671560191846_1553206820491444112_n.jpg"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 z-10" />
          <Image
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//Desktop%20Screenshot%202025.05.14%20-%2020.06.53.88.png"
            alt="ATXR Esports Racing"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Race Together.
              <span className="text-gradient block">Learn Together.</span>
              <span className="text-gradient">Win Together.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Join the ATXR Academy Esports Team and start your journey in competitive sim racing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission in Esports</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-xl leading-relaxed mb-6">
                At ATXR Academy, our Esports division is more than just racing—it&apos;s about building 
                the future of motorsport from the ground up.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Our team is dedicated to developing amateur sim racers into highly skilled drivers 
                by providing them with a structured, team-based environment. We focus on teaching 
                the fundamentals of real racing—teamwork, strategy, discipline, and communication—all 
                within the thrilling world of virtual endurance racing.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                We currently compete in online endurance championships across the APAC region, 
                where our drivers race together in long-format events that demand precision, 
                coordination, and teamwork.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                Whether you&apos;re looking to go pro in esports or step into real-world racing, 
                ATXR is your launchpad.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet the Drivers */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Drivers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the talented individuals who represent ATXR in virtual competitions around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-primary/10">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}