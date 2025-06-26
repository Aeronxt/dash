"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/icons"
import { 
  ChevronRight, Clock, MapPin, Calendar, Users, Car, Globe, Trophy, 
  Star, CheckCircle, ArrowRight, Play, Zap, Target, Award, Settings,
  Timer, Flag, Shield, Camera, BookOpen, HeadphonesIcon
} from "lucide-react"

interface Experience {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  price: string;
  originalPrice?: string;
  duration: string;
  location: string;
  trackLength: string;
  difficulty: string;
  maxSpeed: string;
  featured: boolean;
  includes: string[];
  highlights: string[];
  image: string;
  trackFeatures: string[];
}

export default function ExperiencesPage() {
  const [selectedCategory, setSelectedCategory] = useState("victoria")
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  
  // BMW E90 Victoria Track Experiences
  const victoriaExperiences = [
    {
      id: "winton-bmw",
      title: "Winton Raceway BMW E90 Experience",
      shortDesc: "Technical driving mastery on Victoria's premier circuit",
      description: "Master the art of racing on one of Australia's most technical circuits. Our modified BMW E90 with automatic transmission provides the perfect platform for learning advanced driving techniques while maintaining comfort and safety.",
      price: "$899",
      originalPrice: "$1,199",
      duration: "Full Day (8 hours)",
      location: "Winton Raceway, Benalla, Victoria",
      trackLength: "3.0km",
      difficulty: "Intermediate",
      maxSpeed: "180km/h",
      featured: true,
      includes: [
        "BMW E90 Modified (Auto Transmission)",
        "Professional CAMS-licensed instructor",
        "30+ track laps in BMW E90",
        "Track walk and theory session",
        "In-car video recording",
        "Data analysis and feedback",
        "Racing helmet and suit provided",
        "Track day certificate",
        "Complimentary lunch and refreshments"
      ],
      highlights: [
        "Road registered BMW E90 for comfort",
        "Beginner-friendly automatic transmission",
        "Technical 12-corner layout",
        "Elevation changes for skill development",
        "Professional racing instruction"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//WMR_aerial06.jfif",
      trackFeatures: ["12 challenging corners", "100m elevation change", "2.8km main straight"]
    },
    {
      id: "sandown-bmw",
      title: "Sandown Raceway BMW E90 Experience", 
      shortDesc: "Historic circuit thrills with modern comfort",
      description: "Experience the legendary Sandown Raceway in our comfortable BMW E90. This historic circuit offers the perfect blend of high-speed sections and technical corners, ideal for drivers of all skill levels.",
      price: "$799",
      originalPrice: "$999",
      duration: "Full Day (7 hours)",
      location: "Sandown Raceway, Melbourne, Victoria",
      trackLength: "3.1km",
      difficulty: "Beginner-Friendly",
      maxSpeed: "200km/h",
      featured: false,
      includes: [
        "BMW E90 Modified (Auto Transmission)",
        "CAMS-certified driving instructor",
        "25+ laps on historic Sandown circuit",
        "Circuit history and technique briefing",
        "Professional in-car footage",
        "Performance data analysis",
        "Safety equipment provided",
        "Achievement certificate",
        "Gourmet lunch included"
      ],
      highlights: [
        "Historic racing circuit since 1962",
        "Fast flowing corners perfect for learning",
        "Long Dandenong Road straight",
        "Excellent for first-time track drivers",
        "BMW E90 automatic for easy handling"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//Race-19-EV09-24-MH3_5754.jpg",
      trackFeatures: ["Historic Turn 1 hairpin", "Fast Dandenong straight", "Technical back section"]
    },
    {
      id: "calder-bmw",
      title: "Calder Park Raceway BMW E90 Experience",
      shortDesc: "Multiple circuit configurations for diverse thrills",
      description: "Explore the versatility of Calder Park with multiple circuit configurations. From the historic Thunderdome to the technical road course, experience diverse racing challenges in our BMW E90.",
      price: "$749",
      originalPrice: "$899",
      duration: "Full Day (6 hours)",
      location: "Calder Park Raceway, Melbourne, Victoria",
      trackLength: "2.3km",
      difficulty: "Intermediate",
      maxSpeed: "170km/h",
      featured: false,
      includes: [
        "BMW E90 Modified (Auto Transmission)",
        "Professional racing instructor",
        "Multiple circuit configurations",
        "Road course and short circuit access",
        "HD in-car camera footage",
        "Telemetry data analysis",
        "Racing gear provided",
        "Skills assessment certificate",
        "Light refreshments"
      ],
      highlights: [
        "Multiple track configurations",
        "Historic Thunderdome oval access",
        "Technical road course challenges",
        "BMW E90 comfort meets performance",
        "Perfect for skill progression"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//600e781aef90c.jpg",
      trackFeatures: ["Thunderdome banking", "Technical infield", "Multiple layouts"]
    }
  ]

  // NSW Track Experiences
  const nswExperiences = [
    {
      id: "sydney-motorsport",
      title: "Sydney Motorsport Park Experience",
      shortDesc: "Multiple circuit configurations and night racing thrills",
      description: "Experience the versatility of Sydney Motorsport Park with its multiple circuit configurations. From the full Gardner GP Circuit to the technical Druitt North Circuit, master different driving challenges day or night with our professional instruction.",
      price: "$999",
      originalPrice: "$1,299",
      duration: "Full Day (9 hours)",
      location: "Sydney Motorsport Park, Eastern Creek, NSW",
      trackLength: "3.93km (Gardner GP)",
      difficulty: "Intermediate",
      maxSpeed: "230km/h",
      featured: true,
      includes: [
        "Access to multiple circuit configurations",
        "Night racing session with LED lighting",
        "Professional CAMS-licensed instructor",
        "35+ track laps across configurations",
        "Circuit walk and briefing",
        "In-car video recording",
        "Data analysis and feedback",
        "Racing helmet and suit provided",
        "Track day certificate",
        "Gourmet lunch and refreshments"
      ],
      highlights: [
        "FIA Grade 2 licensed facility",
        "Night racing capability",
        "Multiple circuit layouts",
        "Professional pit facilities",
        "Advanced driving techniques"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//pf-e9febaff--ARDCnewsletterheader.webp",
      trackFeatures: [
        "Gardner GP (3.93km)",
        "Brabham Extended (4.5km)",
        "LED track lighting",
        "Multiple pit facilities"
      ]
    },
    {
      id: "bathurst-experience",
      title: "Mount Panorama Bathurst Experience",
      shortDesc: "Conquer the legendary mountain circuit",
      description: "Take on the challenge of Australia's most iconic racing circuit. Experience the thrill of Mount Panorama's elevation changes, challenging corners, and rich racing history with expert guidance and comprehensive support.",
      price: "$1,499",
      originalPrice: "$1,899",
      duration: "Full Day (8 hours)",
      location: "Mount Panorama Circuit, Bathurst, NSW",
      trackLength: "6.213km",
      difficulty: "Advanced",
      maxSpeed: "250km/h",
      featured: true,
      includes: [
        "Exclusive track access",
        "Expert racing instructor",
        "20+ track laps",
        "Detailed circuit analysis",
        "Professional video recording",
        "Data telemetry analysis",
        "Safety equipment provided",
        "Achievement certificate",
        "Premium catering package",
        "Mountain viewpoint tour"
      ],
      highlights: [
        "Iconic mountain course",
        "23 challenging corners",
        "174m elevation change",
        "Historic racing venue",
        "Professional instruction"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//DSC01209.webp",
      trackFeatures: [
        "6.213km circuit length",
        "23 unique corners",
        "174m elevation change",
        "Mountain straight"
      ]
    }
  ]

  // Global Testing Experiences
  const globalExperiences: Experience[] = [
    {
      id: "global-testing",
      title: "Global Testing Program",
      shortDesc: "Test and develop at international circuits",
      description: "Join our global testing program to experience and develop your skills at world-renowned racing circuits. Perfect for serious racers and teams looking to expand their testing capabilities.",
      price: "$4,999",
      originalPrice: "$5,999",
      duration: "5 Days",
      location: "Multiple International Circuits",
      trackLength: "Various",
      difficulty: "Professional",
      maxSpeed: "300km/h",
      featured: true,
      includes: [
        "Access to multiple international circuits",
        "Professional race engineer",
        "Data analysis package",
        "Accommodation and transport",
        "Technical support team",
        "Safety equipment provided",
        "Video analysis sessions",
        "Performance reports"
      ],
      highlights: [
        "World-class facilities",
        "Professional support team",
        "Multiple circuit access",
        "Comprehensive data analysis",
        "International racing exposure"
      ],
      image: "https://images.pexels.com/photos/12118842/pexels-photo-12118842.jpeg",
      trackFeatures: [
        "FIA Grade 1 circuits",
        "Professional pit facilities",
        "Advanced telemetry systems",
        "International testing environment"
      ]
    }
  ]

  // Track Day Experiences
  const trackDayExperiences: Experience[] = [
    {
      id: "bmw-e90-track",
      title: "BMW E90 Track Experience & Rental Program",
      shortDesc: "Your gateway to motorsport with our high-performance road registered BMW E90",
      description: "Start your motorsport journey with our modified BMW E90. Perfect for beginners and intermediate drivers, our road registered automatic transmission vehicle offers the ideal balance of performance and accessibility. Whether you're looking for your first track experience or aiming to compete in Sprint/Time Attack events, our comprehensive program provides everything you need, including full team support, professional videography, and data analysis.",
      price: "$799",
      originalPrice: "$999",
      duration: "Full Day (8 hours)",
      location: "Multiple Australian Circuits",
      trackLength: "Various",
      difficulty: "Beginner to Intermediate",
      maxSpeed: "200km/h",
      featured: true,
      includes: [
        "Professional CAMS-licensed instructor",
        "30+ track laps",
        "Track walk and theory session",
        "In-car video recording",
        "Data analysis and feedback",
        "Racing helmet and suit provided",
        "Track day certificate",
        "Complimentary lunch and refreshments",
        "Sprint/Time Attack entry support",
        "Full technical team backup"
      ],
      highlights: [
        "Road registered BMW E90 for comfort",
        "Automatic transmission for easy learning",
        "Available for Sprint/Time Attack events",
        "Full team support package",
        "Professional videography and analysis",
        "Data logging and coaching",
        "Multiple circuit availability"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//WMR_aerial06.jfif",
      trackFeatures: [
        "Multiple circuit availability",
        "Professional pit facilities",
        "Technical support team",
        "Data analysis equipment",
        "Video analysis suite"
      ]
    },
    {
      id: "sydney-motorsport",
      title: "Sydney Motorsport Park Experience",
      shortDesc: "Multiple circuit configurations and night racing thrills",
      description: "Experience the versatility of Sydney Motorsport Park with its multiple circuit configurations. From the full Gardner GP Circuit to the technical Druitt North Circuit, master different driving challenges day or night with our professional instruction. This FIA Grade 2 licensed facility offers state-of-the-art amenities including LED lighting for night racing, multiple pit facilities, and comprehensive data analysis capabilities.",
      price: "$999",
      originalPrice: "$1,299",
      duration: "Full Day (9 hours)",
      location: "Sydney Motorsport Park, Eastern Creek, NSW",
      trackLength: "3.93km (Gardner GP)",
      difficulty: "Intermediate",
      maxSpeed: "230km/h",
      featured: true,
      includes: [
        "Access to multiple circuit configurations",
        "Night racing session with LED lighting",
        "Professional CAMS-licensed instructor",
        "35+ track laps across configurations",
        "Circuit walk and briefing",
        "In-car video recording",
        "Data analysis and feedback",
        "Racing helmet and suit provided",
        "Track day certificate",
        "Gourmet lunch and refreshments"
      ],
      highlights: [
        "FIA Grade 2 licensed facility",
        "Night racing capability",
        "Multiple circuit layouts",
        "Professional pit facilities",
        "Advanced driving techniques",
        "State-of-the-art lighting system",
        "9000m² skidpan available"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//pf-e9febaff--ARDCnewsletterheader.webp",
      trackFeatures: [
        "Gardner GP (3.93km)",
        "Brabham Extended (4.5km)",
        "Druitt North (2.8km)",
        "Amaroo South (1.8km)",
        "LED track lighting",
        "Multiple pit facilities"
      ]
    },
    {
      id: "bathurst-experience",
      title: "Mount Panorama Bathurst Experience",
      shortDesc: "Conquer the legendary mountain circuit",
      description: "Take on the challenge of Australia's most iconic racing circuit. Experience the thrill of Mount Panorama's elevation changes, challenging corners, and rich racing history with expert guidance and comprehensive support. This legendary 6.213km circuit features 23 corners and an incredible 174-meter elevation change, making it one of the most challenging and rewarding tracks in the world.",
      price: "$1,499",
      originalPrice: "$1,899",
      duration: "Full Day (8 hours)",
      location: "Mount Panorama Circuit, Bathurst, NSW",
      trackLength: "6.213km",
      difficulty: "Advanced",
      maxSpeed: "250km/h",
      featured: true,
      includes: [
        "Exclusive track access",
        "Expert racing instructor",
        "20+ track laps",
        "Detailed circuit analysis",
        "Professional video recording",
        "Data telemetry analysis",
        "Safety equipment provided",
        "Achievement certificate",
        "Premium catering package",
        "Mountain viewpoint tour"
      ],
      highlights: [
        "Iconic mountain course",
        "23 challenging corners",
        "174m elevation change",
        "Historic racing venue",
        "Professional instruction",
        "Home of the Bathurst 1000",
        "Legendary racing history"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//DSC01209.webp",
      trackFeatures: [
        "6.213km circuit length",
        "23 unique corners",
        "174m elevation change",
        "Mountain straight",
        "The Dipper",
        "Conrod Straight",
        "Skyline section"
      ]
    },
    {
      id: "winton-experience",
      title: "Winton Raceway Experience",
      shortDesc: "Master the technical challenges of Victoria's driver's circuit",
      description: "Develop your skills at Winton Raceway, known as Victoria's driver's circuit. This technical track features a combination of challenging corners and elevation changes that reward precision and skill. Perfect for both beginners and experienced drivers looking to master the art of technical driving.",
      price: "$699",
      originalPrice: "$899",
      duration: "Full Day (8 hours)",
      location: "Winton Raceway, Benalla, Victoria",
      trackLength: "3.0km",
      difficulty: "Beginner to Intermediate",
      maxSpeed: "180km/h",
      featured: false,
      includes: [
        "Professional instruction",
        "25+ track laps",
        "Technical driving workshop",
        "Video analysis",
        "Data logging and review",
        "Safety equipment provided",
        "Track day certificate",
        "Lunch and refreshments"
      ],
      highlights: [
        "Technical layout",
        "Elevation changes",
        "Challenging corners",
        "Perfect for learning",
        "Professional coaching",
        "Modern facilities"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//WMR_aerial06.jfif",
      trackFeatures: [
        "3.0km circuit length",
        "12 technical corners",
        "Multiple elevation changes",
        "Wide runoff areas",
        "Modern pit facilities"
      ]
    },
    {
      id: "sandown-experience",
      title: "Sandown Raceway Experience",
      shortDesc: "High-speed thrills at Melbourne's historic circuit",
      description: "Experience the perfect blend of speed and history at Sandown Raceway. This historic Melbourne circuit features long straights and flowing corners, making it ideal for high-speed driving while remaining accessible to drivers of all skill levels. Learn the techniques of high-speed cornering and racing lines on this legendary track.",
      price: "$799",
      originalPrice: "$999",
      duration: "Full Day (8 hours)",
      location: "Sandown Raceway, Melbourne, Victoria",
      trackLength: "3.1km",
      difficulty: "Beginner to Advanced",
      maxSpeed: "220km/h",
      featured: false,
      includes: [
        "Expert instruction",
        "30+ track laps",
        "High-speed driving techniques",
        "Video recording",
        "Data analysis",
        "Safety gear provided",
        "Achievement certificate",
        "Catered lunch"
      ],
      highlights: [
        "Historic circuit",
        "Fast flowing corners",
        "Long straights",
        "Great for beginners",
        "High-speed sections",
        "Professional coaching"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//Race-19-EV09-24-MH3_5754.jpg",
      trackFeatures: [
        "3.1km circuit length",
        "13 corners",
        "Two long straights",
        "Famous Dandenong Road corner",
        "Modern safety features"
      ]
    },
    {
      id: "calder-experience",
      title: "Calder Park Experience",
      shortDesc: "Unique multi-configuration motorsport complex",
      description: "Discover the diverse challenges of Calder Park Raceway, Melbourne's unique motorsport complex. Experience both the technical road course and the famous Thunderdome, offering a truly unique driving experience. Perfect for drivers wanting to try different racing disciplines and improve their adaptability.",
      price: "$699",
      originalPrice: "$899",
      duration: "Full Day (8 hours)",
      location: "Calder Park Raceway, Melbourne, Victoria",
      trackLength: "2.3km",
      difficulty: "Beginner to Intermediate",
      maxSpeed: "190km/h",
      featured: false,
      includes: [
        "Professional instruction",
        "25+ track laps",
        "Multi-configuration experience",
        "Video recording",
        "Technical analysis",
        "Safety equipment",
        "Completion certificate",
        "Full catering"
      ],
      highlights: [
        "Thunderdome oval",
        "Road course",
        "Multiple configurations",
        "Technical sections",
        "Unique layout options",
        "Professional support"
      ],
      image: "https://rgpoutowdawylaxqncyi.supabase.co/storage/v1/object/public/otherlogos//600e781aef90c.jpg",
      trackFeatures: [
        "2.3km road course",
        "Thunderdome NASCAR oval",
        "Technical corners",
        "Multiple layout options",
        "Modern facilities"
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const cardVariants = {
    rest: { scale: 1, rotateY: 0 },
    hover: { 
      scale: 1.02, 
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
          <Image
            src="https://images.pexels.com/photos/12118842/pexels-photo-12118842.jpeg"
            alt="Racing Experience"
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
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Racing
              <span className="text-gradient block">Experiences</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              From BMW E90 adventures in Victoria to global F1 testing - discover your ultimate racing experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg px-8 py-4">
                <Globe className="mr-2 h-5 w-5" />
                Global Experiences
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
        >
          <ChevronRight className="h-8 w-8 rotate-90" />
        </motion.div>
      </motion.section>

      {/* Experience Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Adventure</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From comfortable BMW E90 experiences to cutting-edge global testing programs
            </p>
          </motion.div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 h-auto mb-12 bg-transparent">
              <TabsTrigger 
                value="trackdays" 
                className="py-6 px-8 data-[state=active]:bg-primary data-[state=active]:text-white border border-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                <div className="text-center">
                  <Icons.bmw width={32} height={32} className="mx-auto mb-2" />
                  <h3 className="text-lg font-semibold mb-1">Track Days</h3>
                  <p className="text-sm opacity-80">Experience & Rental Program</p>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="race" 
                className="py-6 px-8 data-[state=active]:bg-primary data-[state=active]:text-white border border-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                <div className="text-center">
                  <Trophy className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold mb-1">Race Program</h3>
                  <p className="text-sm opacity-80">Your path to professional racing</p>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="training" 
                className="py-6 px-8 data-[state=active]:bg-primary data-[state=active]:text-white border border-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold mb-1">Training & Coaching</h3>
                  <p className="text-sm opacity-80">Professional development</p>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Track Day Experiences */}
            <TabsContent value="trackdays" className="space-y-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                {/* Featured Track Day Experience */}
                <motion.div variants={itemVariants}>
                  <FeaturedExperienceCard experience={trackDayExperiences[0]} />
                </motion.div>

                {/* Other Track Day Experiences */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {trackDayExperiences.slice(1).map((experience, index) => (
                    <motion.div key={experience.id} variants={itemVariants}>
                      <DetailedExperienceCard 
                        experience={experience}
                        isSelected={selectedExperience === experience.id}
                        onClick={() => setSelectedExperience(selectedExperience === experience.id ? null : experience.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Race Program Content */}
            <TabsContent value="race" className="space-y-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-500">
                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Your Journey to Professional Racing</h3>
                        <p className="text-muted-foreground">
                          From F4 to GT3, discover your path in professional motorsport with ATXR Racing&apos;s comprehensive race program.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Flag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Global Racing Opportunities</h4>
                            <p className="text-sm text-muted-foreground">F4, F3, GT3, and Endurance racing pathways available</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Trophy className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">ATXR Academy Journey</h4>
                            <p className="text-sm text-muted-foreground">Structured progression from testing to professional racing</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Settings className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Professional Support</h4>
                            <p className="text-sm text-muted-foreground">Full team backing, data analysis, and career guidance</p>
                          </div>
                        </div>
                      </div>

                      <Button asChild size="lg" className="w-full md:w-auto">
                        <Link href="/race">
                          Explore Race Program
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>

                    <div className="relative h-[400px] rounded-xl overflow-hidden">
                      <Image
                        src="https://images.pexels.com/photos/12118842/pexels-photo-12118842.jpeg"
                        alt="ATXR Racing Program"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Badge variant="secondary" className="bg-black/70 text-white">
                            F4 to GT3 Pathways
                          </Badge>
                          <Badge variant="secondary" className="bg-black/70 text-white">
                            Professional Racing
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Training Content */}
            <TabsContent value="training" className="space-y-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {trackDayExperiences.map((experience, index) => (
                  <motion.div key={experience.id} variants={itemVariants}>
                    <TrainingExperienceCard experience={experience} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Experience the Thrill?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied drivers who have pushed their limits with ATXR Racing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-4">
                <Link href="/experiences/book">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your Experience
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4">
                <Link href="/contact">
                  <HeadphonesIcon className="mr-2 h-5 w-5" />
                  Speak to Our Team
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Featured Experience Card Component
function FeaturedExperienceCard({ experience }: { experience: Experience }) {
  return (
    <motion.div
      variants={{
        rest: { scale: 1 },
        hover: { scale: 1.01 }
      }}
      initial="rest"
      whileHover="hover"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary text-white">
              <Star className="w-3 h-3 mr-1" />
              Featured Experience
            </Badge>
            <Badge variant="outline">{experience.difficulty}</Badge>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold mb-3">{experience.title}</h3>
            <p className="text-lg text-muted-foreground mb-4">{experience.shortDesc}</p>
            <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>{experience.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{experience.location}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Flag className="h-4 w-4 text-primary" />
                <span>{experience.trackLength} circuit</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span>Max {experience.maxSpeed}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-primary">{experience.price}</div>
            {experience.originalPrice && (
              <div className="text-lg text-muted-foreground line-through">{experience.originalPrice}</div>
            )}
          </div>

          <Button size="lg" className="w-full sm:w-auto">
            <ArrowRight className="mr-2 h-4 w-4" />
            Book This Experience
          </Button>
        </div>

        <div className="relative">
          <div className="relative h-64 lg:h-full rounded-xl overflow-hidden">
            <Image
              src={experience.image}
              alt={experience.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="grid grid-cols-3 gap-2">
              {experience.trackFeatures.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-black/70 text-white text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Detailed Experience Card Component
function DetailedExperienceCard({ experience, isSelected, onClick }: { 
  experience: Experience, 
  isSelected: boolean, 
  onClick: () => void 
}) {
  return (
    <motion.div
      layoutId={experience.id}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/50">
        <div className="relative h-64">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary">{experience.difficulty}</Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-black/70 text-white">
              {experience.trackLength}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{experience.title}</CardTitle>
              <CardDescription className="text-base">{experience.shortDesc}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{experience.price}</div>
              {experience.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">{experience.originalPrice}</div>
              )}
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-muted-foreground">{experience.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{experience.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Victoria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Max {experience.maxSpeed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Safety Certified</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Experience Highlights:</h5>
                  <div className="space-y-1">
                    {experience.highlights.slice(0, 3).map((highlight: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        <CardFooter className="pt-4">
          <Button className="w-full" asChild>
            <Link href="/experiences/book">
              <Calendar className="mr-2 h-4 w-4" />
              Book Now
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Training Experience Card Component
function TrainingExperienceCard({ experience }: { experience: Experience }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full group hover:shadow-xl transition-all duration-300">
        <div className="relative h-48">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary">{experience.difficulty}</Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-lg">{experience.title}</CardTitle>
          <CardDescription>{experience.shortDesc}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{experience.description}</p>
          
          <div className="space-y-2">
            {experience.includes.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xl font-bold text-primary">{experience.price}</div>
            <div className="text-sm text-muted-foreground">{experience.duration}</div>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/experiences/book">
              <BookOpen className="mr-2 h-4 w-4" />
              Enroll Now
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}