"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Loader from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { updateOnboardingData, user } = useAuth()
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    website_purpose: "",
    website_purpose_other: "",
    business_type: "",
    business_type_other: "",
    features_needed: [] as string[],
    features_other: "",
    business_name: "",
    user_country: "",
    user_display_name: ""
  })

  const totalSteps = 6

  const websitePurposeOptions = [
    "Personal portfolio",
    "Business",
    "Blog", 
    "Event",
    "Other"
  ]

  const businessTypeOptions = [
    "Freelancer",
    "Restaurant", 
    "Online Store",
    "Startup",
    "Health",
    "Real Estate",
    "NGO",
    "Finance",
    "Not sure",
    "Other"
  ]

  const featuresOptions = [
    "Contact form",
    "Booking system",
    "Ticket System",
    "Blog",
    "Online store", 
    "Portfolio",
    "Newsletter",
    "Payments",
    "Live chat",
    "Analytics",
    "Other"
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features_needed: prev.features_needed.includes(feature)
        ? prev.features_needed.filter(f => f !== feature)
        : [...prev.features_needed, feature]
    }))
  }

  const handleComplete = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "Please log in again"
      })
      router.push('/auth/signin')
      return
    }

    setLoading(true)

    try {
      // Prepare final data
      const finalData = {
        website_purpose: formData.website_purpose === "Other" ? formData.website_purpose_other : formData.website_purpose,
        business_type: formData.business_type === "Other" ? formData.business_type_other : formData.business_type,
        features_needed: formData.features_needed.map(feature => 
          feature === "Other" ? formData.features_other : feature
        ).filter(Boolean),
        business_name: formData.business_name,
        user_country: formData.user_country,
        user_display_name: formData.user_display_name
      }

      console.log("Submitting onboarding data:", finalData)
      console.log("Current user:", user)

      const { error } = await updateOnboardingData(finalData)

      if (error) {
        console.error("Onboarding error:", error)
        toast({
          variant: "destructive",
          title: "Error saving data",
          description: error.message || "Failed to save onboarding data"
        })
        return
      }

      console.log("Onboarding completed successfully")
      toast({
        title: "Welcome to Flowscape!",
        description: "Your account setup is complete."
      })

      // Redirect to dashboard
      router.push('/')
    } catch (error: any) {
      console.error("Unexpected error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred"
      })
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.website_purpose !== "" && 
               (formData.website_purpose !== "Other" || formData.website_purpose_other.trim() !== "")
      case 2:
        return formData.business_type !== "" && 
               (formData.business_type !== "Other" || formData.business_type_other.trim() !== "")
      case 3:
        return formData.features_needed.length > 0 && 
               (!formData.features_needed.includes("Other") || formData.features_other.trim() !== "")
      case 4:
        return formData.business_name.trim() !== ""
      case 5:
        return formData.user_country.trim() !== ""
      case 6:
        return formData.user_display_name.trim() !== ""
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">What do you need a website for?</h2>
              <p className="text-gray-400">Help us understand your goals</p>
            </div>
            <div className="space-y-3">
              {websitePurposeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData(prev => ({ ...prev, website_purpose: option }))}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    formData.website_purpose === option
                      ? 'border-white bg-gray-800 text-white'
                      : 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {option}
                </button>
              ))}
              {formData.website_purpose === "Other" && (
                <Input
                  placeholder="Please specify..."
                  value={formData.website_purpose_other}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_purpose_other: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">What best describes your business?</h2>
              <p className="text-gray-400">This helps us customize your experience</p>
            </div>
            <div className="space-y-3">
              {businessTypeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData(prev => ({ ...prev, business_type: option }))}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    formData.business_type === option
                      ? 'border-white bg-gray-800 text-white'
                      : 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {option}
                </button>
              ))}
              {formData.business_type === "Other" && (
                <Input
                  placeholder="Please specify..."
                  value={formData.business_type_other}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_type_other: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">What features do you need?</h2>
              <p className="text-gray-400">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {featuresOptions.map((feature) => (
                <div key={feature} className="flex items-center space-x-3">
                  <Checkbox
                    checked={formData.features_needed.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                    className="border-gray-600"
                  />
                  <label className="text-gray-300 cursor-pointer" onClick={() => handleFeatureToggle(feature)}>
                    {feature}
                  </label>
                </div>
              ))}
              {formData.features_needed.includes("Other") && (
                <Input
                  placeholder="Please specify other features..."
                  value={formData.features_other}
                  onChange={(e) => setFormData(prev => ({ ...prev, features_other: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white mt-3"
                />
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">What's your business/brand name?</h2>
              <p className="text-gray-400">This will help us personalize your experience</p>
            </div>
            <Input
              placeholder="Enter your business or brand name"
              value={formData.business_name}
              onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Where are you located?</h2>
              <p className="text-gray-400">This helps us provide location-relevant features</p>
            </div>
            <Input
              placeholder="Enter your country"
              value={formData.user_country}
              onChange={(e) => setFormData(prev => ({ ...prev, user_country: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">How should we address you?</h2>
              <p className="text-gray-400">Your preferred display name</p>
            </div>
            <Input
              placeholder="Enter your preferred name"
              value={formData.user_display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, user_display_name: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
              alt="Flowscape Logo"
              className="h-12 w-auto" 
            />
          </div>
          <CardTitle className="text-3xl text-white">Welcome to Flowscape</CardTitle>
          <CardDescription className="text-gray-400">
            Let's set up your account in just a few steps
          </CardDescription>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i + 1 <= currentStep ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || loading}
                className="bg-white text-black hover:bg-gray-200"
              >
                                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="scale-25">
                        <Loader />
                      </div>
                    </div>
                  ) : (
                    "Complete Setup"
                  )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-white text-black hover:bg-gray-200"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 