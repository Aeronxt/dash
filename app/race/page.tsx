"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Clock, Users, Car, Globe, ChevronRight, MapPin, Flag } from "lucide-react"

// Racing Series Data
const racingSeries = [
  {
    id: "f4",
    title: "Formula 4",
    description: "Your first step into formula racing. Learn the fundamentals of open-wheel racing in a professional environment.",
    image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//DEFLOGO_FIAF4_CEZ_CERTIFIED_RGB_NEG-e1737376239980.png",
    features: [
      "Professional coaching",
      "Data analysis",
      "Physical training",
      "Media training",
      "Race craft development"
    ],
    requirements: "No prior experience needed",
    duration: "Full season or partial programs",
    locations: ["Australia", "Europe", "Asia"]
  },
  {
    id: "f3",
    title: "Formula 3",
    description: "Take your racing career to the next level in the highly competitive F3 championship.",
    image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//FIA_Formula_3_Championship.webp",
    features: [
      "Advanced race strategy",
      "Professional coaching",
      "Data engineering",
      "Media relations",
      "Career development"
    ],
    requirements: "F4 or equivalent experience",
    duration: "Full season commitment",
    locations: ["Europe", "Asia"]
  },
  {
    id: "gt3",
    title: "GT World Challenge",
    description: "Compete in prestigious GT3 championships with professional teams and factory support.",
    image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//GTWC-AWS_CMYK_NEG_3212x.webp",
    features: [
      "Factory team support",
      "Professional engineering",
      "Advanced simulators",
      "Sponsorship guidance",
      "Team management"
    ],
    requirements: "Previous racing experience",
    duration: "Full season or endurance events",
    locations: ["Global"]
  },
  {
    id: "endurance",
    title: "FIA WEC",
    description: "Experience the pinnacle of endurance racing in the World Endurance Championship.",
    image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//FIA_WEC_Logo_2019.svg.png",
    features: [
      "Multi-driver teams",
      "24-hour race preparation",
      "Advanced strategy",
      "Factory support",
      "Global exposure"
    ],
    requirements: "GT3 or equivalent experience",
    duration: "Full season or selected events",
    locations: ["Global"]
  }
]

// Partner Logos
const partners = [
  { 
    name: "Formula 4", 
    logo: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//DEFLOGO_FIAF4_CEZ_CERTIFIED_RGB_NEG-e1737376239980.png" 
  },
  { 
    name: "Formula 3", 
    logo: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//FIA_Formula_3_Championship.webp" 
  },
  { 
    name: "GT World Challenge", 
    logo: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//GTWC-AWS_CMYK_NEG_3212x.webp" 
  },
  { 
    name: "FIA WEC", 
    logo: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//FIA_WEC_Logo_2019.svg.png" 
  },
  { 
    name: "iRacing TCR", 
    logo: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//iR_Partners_TCR.png" 
  },
  { 
    name: "FRECA", 
    logo: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//freca-logo-vertical.png" 
  }
]

// Journey Steps
const journeySteps = [
  {
    title: "Assessment",
    description: "Initial evaluation of skills and goals",
    icon: Users,
    duration: "1 day"
  },
  {
    title: "Training",
    description: "Simulator and karting preparation",
    icon: Star,
    duration: "1-3 months"
  },
  {
    title: "Testing",
    description: "First real car experience",
    icon: Car,
    duration: "1 week"
  },
  {
    title: "Racing",
    description: "Competitive racing debut",
    icon: Trophy,
    duration: "Season-based"
  }
]

export default function RacePage() {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-race.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Racing
              <span className="text-gradient block">Journey Starts Here</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              From your first track day to professional racing, we&apos;ll guide you every step of the way
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg">
                Start Racing
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg">
                Explore Programs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: [0, -2000] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
              className="flex gap-16"
            >
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={index}
                  className="w-48 h-32 bg-transparent rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-gradient-to-b from-black via-black/95 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center mb-12">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                At ATXR Academy, we believe that racing should not be reserved for the privileged few. Whether you&apos;re a lifelong motorsport fan, a sim racer chasing the leap to reality, a passionate karting amateur, or even someone with zero on-track experience, we make it possible for you to become a real racing driver.
              </p>
              <p className="text-2xl md:text-3xl font-bold mt-6 text-accent">
                This page is your starting line.
              </p>
            </div>

            <div className="space-y-6 text-gray-300">
              <p className="text-lg leading-relaxed">
                We offer you the opportunity to race competitively in professionally organized series across the globe—from Formula 4 to GT3 and endurance championships. Through our partnerships with top-tier racing teams, you&apos;ll have access to the best seats available, matched specifically to your skill level, budget, and goals. From single-day events to full-season entries, we handle the planning so you can focus on what matters most: performance on the track.
              </p>

              <div className="bg-white/5 rounded-lg p-8 backdrop-blur-sm border border-white/10">
                <h3 className="text-xl font-bold mb-4 text-white">ATXR Academy Driver Program Benefits</h3>
                <p className="mb-4">
                  When you register for a race experience with us, you&apos;ll automatically join the ATXR Academy Driver Program—a structured driver development pathway that takes you from the basics all the way to competitive race wins. Our driver support includes:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <span>Customized training programs (online and on-track)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <span>Private and team-based test sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <span>Physical and mental performance coaching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <span>Career guidance and sponsorship consultation</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-accent/20 to-transparent p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2 text-white">No experience? No problem.</h3>
                  <p className="leading-relaxed">
                    We specialize in transforming beginners into race-ready competitors. Our team will evaluate your background—whether it&apos;s karting, simulators, or complete inexperience—and create a development roadmap tailored to you.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/20 to-transparent p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2 text-white">Already have the fire?</h3>
                  <p className="leading-relaxed">
                    Start with a testing session. These sessions are the gateway into racing, allowing you to get behind the wheel of your chosen series (F4, F3, GT3, etc.) and work with real engineers and pro coaches. You&apos;ll build confidence, learn how to communicate with a team, and sharpen your skills—before entering your first competitive race.
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <p className="text-xl font-bold mb-4">We don&apos;t just place you in a car—we build your career.</p>
                <p className="text-lg text-gray-300">
                  Best of all, we work with all levels of budget and racing ambition. Whether you&apos;re exploring your first motorsport experience or looking for a full-season campaign, we&apos;ll find a path that works for you.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Racing Opportunities */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Race with Our Partners in These Series Around the Globe</h2>
            <p className="text-gray-400 text-lg">Choose your path to racing success</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {racingSeries.map((series) => (
              <motion.div
                key={series.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setSelectedSeries(series.id)}
              >
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
                  <div className="h-24 flex items-center justify-center mb-6">
                    <Image
                      src={series.image}
                      alt={series.title}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{series.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{series.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{series.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{series.locations.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{series.requirements}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Become an ATXR Academy Driver</h2>
            <p className="text-gray-400 text-lg">
              No experience? No problem. We guide you through every step of becoming a winning driver.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-600 to-transparent animate-pulse" />
            <div className="space-y-20">
              {journeySteps.map((step, index) => {
                const StepIcon = step.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className={`flex items-center transition-transform duration-500 ease-in-out transform hover:scale-105 ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`relative flex items-center ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      } w-1/2`}
                    >
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full animate-bounce" />
                      <div
                        className={`bg-gray-900 p-6 rounded-lg shadow-xl transition-shadow duration-500 ease-in-out hover:shadow-2xl ${
                          index % 2 === 0 ? "mr-8" : "ml-8"
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <StepIcon className="h-8 w-8 text-red-500 animate-spin-slow" />
                          <div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-gray-400">{step.duration}</p>
                          </div>
                        </div>
                        <p className="text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="text-center mt-16">
            {/* Button removed as per request */}
          </div>
        </div>
      </section>

      {/* Testing Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Start with a Test Session</h2>
            <p className="text-gray-400 text-lg">
              Not ready to race yet? We&apos;ll arrange test sessions with real teams across F4, F3, or GT3.
              Understand the car, get professional coaching, and build confidence.
            </p>
          </motion.div>

          <Tabs defaultValue="f4" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="f4">Formula 4</TabsTrigger>
              <TabsTrigger value="f3">Formula 3</TabsTrigger>
              <TabsTrigger value="gt3">GT3</TabsTrigger>
              <TabsTrigger value="radical">Radical</TabsTrigger>
              <TabsTrigger value="tcr">TCR</TabsTrigger>
              <TabsTrigger value="gt4">GT4</TabsTrigger>
            </TabsList>

            {["f4", "f3", "gt3", "radical", "tcr", "gt4"].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="flex justify-center items-center h-96">
                  <motion.div
                    variants={itemVariants}
                    className="relative h-full w-full max-w-3xl rounded-lg overflow-hidden"
                  >
                    <Image
                      src={category === "f4" ? "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//Tatuus_F4Gen2_1.jpg" :
                           category === "f3" ? "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//header.webp" :
                           category === "gt3" ? "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//2018-porsche-911-gt3-r-race-car_100651690.jpg" :
                           category === "radical" ? "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//1-radical-sr10-2020-uk-fd-hero-front.webp" :
                           category === "tcr" ? "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//timthumb.jfif" :
                           "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/misc//img_14.webp"}
                      alt={`${category.toUpperCase()} Car`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-12">
            {/* Button removed as per request */}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Race? Contact Us Now</h2>
            <p className="text-gray-400 text-lg">
              Take the first step towards your racing career
            </p>
          </motion.div>

          <motion.form
            variants={containerVariants}
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              const nameInput = document.querySelector('input[placeholder="Name"]');
              const emailInput = document.querySelector('input[type="email"]');
              const countryInput = document.querySelector('input[placeholder="Country"]');
              const experienceSelect = document.querySelector('select[placeholder="Racing Experience"]');
              const messageTextarea = document.querySelector('textarea[placeholder="Message"]');

              const name = (nameInput as HTMLInputElement)?.value || '';
              const email = (emailInput as HTMLInputElement)?.value || '';
              const country = (countryInput as HTMLInputElement)?.value || '';
              const experience = (experienceSelect as HTMLSelectElement)?.value || '';
              const message = (messageTextarea as HTMLTextAreaElement)?.value || '';

              const mailtoLink = `mailto:info@atxrracing.com?subject=Racing Inquiry&body=Name: ${name}%0AEmail: ${email}%0ACountry: ${country}%0ARacing Experience: ${experience}%0AMessage: ${message}`;
              window.location.href = mailtoLink;
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <Input
                  placeholder="Name"
                  className="bg-gray-900 border-gray-800"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-900 border-gray-800"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Input
                placeholder="Country"
                className="bg-gray-900 border-gray-800"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Select>
                <SelectTrigger className="bg-gray-900 border-gray-800">
                  <SelectValue placeholder="Racing Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Experience</SelectItem>
                  <SelectItem value="sim">Sim Racing</SelectItem>
                  <SelectItem value="karting">Karting</SelectItem>
                  <SelectItem value="track">Track Days</SelectItem>
                  <SelectItem value="racing">Racing Experience</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Textarea
                placeholder="Message"
                className="bg-gray-900 border-gray-800"
                rows={6}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <Button type="submit" size="lg" className="bg-red-600 hover:bg-red-700">
                Submit Inquiry
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </section>
    </main>
  )
} 