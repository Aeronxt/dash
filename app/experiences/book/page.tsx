"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ChevronLeft, Calendar, MapPin } from "lucide-react"

const tracks = [
  {
    id: "cota",
    name: "Circuit of The Americas",
    location: "Austin, TX",
    image: "https://images.pexels.com/photos/12118842/pexels-photo-12118842.jpeg",
    description: "5.513 km FIA Grade 1 circuit with 20 turns and challenging elevation changes."
  },
  {
    id: "harris-hill",
    name: "Harris Hill Raceway",
    location: "San Marcos, TX",
    image: "https://images.pexels.com/photos/3621557/pexels-photo-3621557.jpeg",
    description: "1.82 mile road course with 11 turns and natural elevation changes."
  },
  {
    id: "eagles-canyon",
    name: "Eagles Canyon Raceway",
    location: "Decatur, TX",
    image: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg",
    description: "2.7 mile road course with 15 turns and over 100 feet of elevation changes."
  }
]

type BookingStep = "track" | "details" | "confirmation"

export default function BookingPage() {
  const [step, setStep] = useState<BookingStep>("track")
  const [selectedTrack, setSelectedTrack] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    experience: "",
    message: ""
  })

  const handleNext = () => {
    if (step === "track") setStep("details")
    else if (step === "details") setStep("confirmation")
  }

  const handleBack = () => {
    if (step === "details") setStep("track")
    else if (step === "confirmation") setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", { selectedTrack, ...formData })
    // For now, just show a success message
    alert("Booking request submitted successfully! We'll contact you shortly.")
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Book Your Track Experience
        </motion.h1>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "track" ? "bg-accent text-white" : "bg-accent/20"}`}>1</div>
            <div className="w-16 h-1 bg-accent/20" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "details" ? "bg-accent text-white" : "bg-accent/20"}`}>2</div>
            <div className="w-16 h-1 bg-accent/20" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "confirmation" ? "bg-accent text-white" : "bg-accent/20"}`}>3</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "track" && (
            <motion.div
              key="track-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tracks.map((track) => (
                <Card 
                  key={track.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedTrack === track.id ? "ring-2 ring-accent" : ""
                  }`}
                  onClick={() => setSelectedTrack(track.id)}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={track.image} 
                      alt={track.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{track.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {track.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{track.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="booking-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                  <CardDescription>
                    Please provide your information to complete the booking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 555-5555"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData({ ...formData, experience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-2 track days)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (3-10 track days)</SelectItem>
                        <SelectItem value="advanced">Advanced (10+ track days)</SelectItem>
                        <SelectItem value="expert">Expert (Racing Experience)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Notes</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any special requests or questions?"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Confirm Your Booking</CardTitle>
                  <CardDescription>Please review your booking details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Selected Track</h3>
                      <p>{tracks.find(t => t.id === selectedTrack)?.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p>{tracks.find(t => t.id === selectedTrack)?.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Name</h3>
                      <p>{formData.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>{formData.email}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p>{formData.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Preferred Date</h3>
                      <p>{formData.date}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Experience Level</h3>
                      <p className="capitalize">{formData.experience}</p>
                    </div>
                  </div>
                  {formData.message && (
                    <div>
                      <h3 className="font-semibold">Additional Notes</h3>
                      <p>{formData.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-8 space-x-4">
          {step !== "track" && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          {step === "confirmation" ? (
            <Button
              onClick={handleSubmit}
              className="bg-accent hover:bg-accent/90"
            >
              Submit Booking
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={step === "track" && !selectedTrack}
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 