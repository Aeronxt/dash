"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Arhaam Rahaman",
      role: "Founder & Team Principal",
      bio: "First Bangladeshi racing driver to compete in FIA Motorsport Games, pioneering accessible motorsport pathways.",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
    },
    {
      name: "Racing Development",
      role: "Professional Coaches",
      bio: "Expert racing instructors providing comprehensive training across all motorsport disciplines.",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg"
    },
    {
      name: "Technical Team",
      role: "Engineering Support",
      bio: "Experienced engineers ensuring optimal vehicle setup and performance for every driver.",
      image: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg"
    },
    {
      name: "Support Staff",
      role: "Operations Team",
      bio: "Dedicated professionals managing logistics, events, and driver support services.",
      image: "https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg"
    }
  ]
  
  const achievements = [
    { year: 2024, title: "International GT Championship", place: "1st Place" },
    { year: 2023, title: "World Endurance Series", place: "Constructors Champions" },
    { year: 2022, title: "24 Hours of Le Mans", place: "Class Winners" },
    { year: 2021, title: "North American Racing Series", place: "Drivers & Team Champions" },
    { year: 2020, title: "European Sprint Cup", place: "Drivers Champions" },
    { year: 2019, title: "Asian Endurance Challenge", place: "2nd Place" }
  ]
  
  const milestones = [
    {
      year: 2021,
      title: "ATXR Racing Founded",
      description: "Founded by Arhaam Rahaman with a mission to make professional racing accessible to all talented drivers."
    },
    {
      year: 2022,
      title: "FIA Motorsport Games",
      description: "Arhaam becomes the first Bangladeshi racing driver to compete in the FIA Motorsport Games esports category."
    },
    {
      year: 2023,
      title: "Team Expansion",
      description: "Establishing partnerships with professional racing teams across multiple global series."
    },
    {
      year: 2024,
      title: "Development Programs",
      description: "Launch of comprehensive driver development programs and training initiatives."
    },
    {
      year: 2025,
      title: "Track Experience Program",
      description: "Introduction of track-ready race cars and full team support across Australia."
    }
  ]
  
  return (
    <div className="pt-24">
      <div className="relative bg-secondary text-secondary-foreground py-20">
        <div className="container relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About ATXR Racing
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto text-center text-secondary-foreground/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Making professional racing accessible to talented, passionate drivers—no matter where they start.
          </motion.p>
        </div>
        
        {/* Racing stripe decorations */}
        <div className="absolute -right-10 top-0 h-full w-20 bg-accent/80 transform skew-x-12" />
        <div className="absolute -right-4 top-0 h-full w-4 bg-primary/80 transform skew-x-12" />
      </div>
      
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4">
                <p>
                  Founded in 2021 by Arhaam Rahaman, ATXR Racing is a next-generation motorsport platform with a clear mission: 
                  to make professional racing accessible to talented, passionate drivers—no matter where they start.
                </p>
                <p>
                  Arhaam made history in 2022 as the first Bangladeshi racing driver to compete in the FIA Motorsport Games, 
                  representing his country in the global esports racing category at just 17 years old. His journey began racing 
                  in local rental karts as a child, before transitioning into competitive sim racing from 2018, with a focus on 
                  open-wheel cars.
                </p>
                <p>
                  In 2022, despite being new to GT3 racing, Arhaam successfully competed in the ACC-based FIA Motorsport Games 
                  esports qualifiers in Marseille, France, becoming a pioneer for Bangladeshi motorsport on the world stage.
                </p>
                <p>
                  But this was just the beginning. Arhaam&apos;s ambition wasn&apos;t just personal success, it was to build a team and platform that would allow many more aspiring racers from around the globe to follow the correct path into motorsport.
                </p>
              </div>
              
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">2021</span>
                  <span className="text-muted-foreground">Founded</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative h-[500px] w-full rounded-lg overflow-hidden flex items-center justify-center bg-black/5">
                <Image 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//atxrlog%20white%20(1).png"
                  alt="ATXR Racing Logo"
                  width={400}
                  height={400}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Building more than just a team—we&apos;re building a legacy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Icons.flag className="h-12 w-12" />}
              title="Training"
              description="Providing proper training and guidance for drivers at every level of their journey."
            />
            <ValueCard
              icon={<Icons.trophy className="h-12 w-12" />}
              title="Development"
              description="Ensuring drivers are mentally and physically ready for competition through comprehensive development programs."
            />
            <ValueCard
              icon={<Icons.globe className="h-12 w-12" />}
              title="Accessibility"
              description="Making motorsport accessible to talented drivers regardless of their background or starting point."
            />
          </div>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              From esports to real-world GT racing, we&apos;re your gateway into motorsport.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Professional Partnerships</CardTitle>
                <CardDescription>Global Racing Series Access</CardDescription>
              </CardHeader>
              <CardContent>
                <p>ATXR Racing is now partnered with professional teams across global racing series—from Formula 4 and Formula 3 to GT3 and Endurance Racing. We help new and experienced drivers find the right team, series, and race seat.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Driver Development</CardTitle>
                <CardDescription>Comprehensive Training Programs</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Whether you&apos;re an amateur karter, a sim racer, or someone with no prior experience, we provide proper training, mental and physical preparation, and technical equipment for competition.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">2025: Track-Ready Experience</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our biggest step forward: Your own racing experience with our track-ready cars.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Future Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Perfect for aspiring racers exploring their path into motorsport</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enthusiasts</CardTitle>
              </CardHeader>
              <CardContent>
                <p>For those wanting to push their limits on real racing circuits</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Corporate Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Unique experiences for team building and special occasions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Testing Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Professional development programs for career advancement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
            <p className="text-primary-foreground/80 text-lg max-w-3xl mx-auto">
              Ready to start your racing journey? Contact us to explore our experiences and hit the track.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}