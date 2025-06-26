"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import { 
  TrendingUp, 
  TrendingDown,
  MoreHorizontal,
  Plus,
  Settings,

  AlertTriangle,
  X
} from "lucide-react"

export default function DashboardPage() {
  const { userProfile, updateOnboardingData } = useAuth()
  const { toast } = useToast()
  
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const [onboardingLoading, setOnboardingLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showTaskBanner, setShowTaskBanner] = useState(true)
  
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
  const isOnboardingComplete = userProfile?.onboarding_completed || false

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features_needed: prev.features_needed.includes(feature)
        ? prev.features_needed.filter(f => f !== feature)
        : [...prev.features_needed, feature]
    }))
  }

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

  const handleComplete = async () => {
    setOnboardingLoading(true)

    try {
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

      const { error } = await updateOnboardingData(finalData)

      if (error) {
        toast({
          variant: "destructive",
          title: "Error saving data",
          description: error.message || "Failed to save onboarding data"
        })
        return
      }

      toast({
        title: "Setup Complete!",
        description: "Your account setup has been completed successfully."
      })

      setShowOnboardingModal(false)
      setShowTaskBanner(false)
      setCurrentStep(1)
      
      // Reset form
      setFormData({
        website_purpose: "",
        website_purpose_other: "",
        business_type: "",
        business_type_other: "",
        features_needed: [],
        features_other: "",
        business_name: "",
        user_country: "",
        user_display_name: ""
      })
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred"
      })
    } finally {
      setOnboardingLoading(false)
    }
  }

  // Dashboard data
  const metrics = [
    {
      title: "Total Revenue",
      value: "$1,250.00",
      change: "+12.5%",
      trend: "up",
      description: "Trending up this month",
      subtitle: "Visitors for the last 6 months",
      icon: "💰"
    },
    {
      title: "New Customers", 
      value: "1,234",
      change: "-20%",
      trend: "down",
      description: "Down 20% this period",
      subtitle: "Acquisition needs attention",
      icon: "👥"
    },
    {
      title: "Active Accounts",
      value: "45,678", 
      change: "+12.5%",
      trend: "up",
      description: "Strong user retention",
      subtitle: "Engagement exceed targets",
      icon: "📊"
    },
    {
      title: "Growth Rate",
      value: "4.5%",
      change: "+4.5%", 
      trend: "up",
      description: "Steady performance increase",
      subtitle: "Meets growth projections",
      icon: "📈"
    }
  ]

  const tableData = [
    {
      header: "Table of contents",
      sectionType: "Table of contents",
      status: "Done",
      target: "29",
      limit: "24",
      reviewer: "Eddie Lake"
    },
    {
      header: "Executive summary",
      sectionType: "Narrative",
      status: "Done",
      target: "10",
      limit: "13",
      reviewer: "Eddie Lake"
    },
    {
      header: "Technical approach",
      sectionType: "Narrative",
      status: "Done",
      target: "27",
      limit: "23",
      reviewer: "Jamik Tashputatov"
    },
    {
      header: "Design",
      sectionType: "Narrative",
      status: "In Progress",
      target: "2",
      limit: "16",
      reviewer: "Jamik Tashputatov"
    },
    {
      header: "Capabilities",
      sectionType: "Narrative",
      status: "In Progress",
      target: "20",
      limit: "8",
      reviewer: "Jamik Tashputatov"
    }
  ]
  
  return (
    <div className="p-6 space-y-6">
      {/* Task Banner for Onboarding */}
      {!isOnboardingComplete && showTaskBanner && (
        <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-amber-200 font-medium">Complete your account setup</p>
                <p className="text-amber-300/80 text-sm">Help us personalize your experience by completing your profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={showOnboardingModal} onOpenChange={setShowOnboardingModal}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Complete Setup
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Complete Your Setup</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Step {currentStep} of {totalSteps}: Help us personalize your experience
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Simplified onboarding form */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-6">
                      {Array.from({ length: totalSteps }, (_, index) => (
                        <div
                          key={index}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            index + 1 <= currentStep 
                              ? 'bg-blue-500' 
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="min-h-[200px] flex items-center justify-center">
                      <p className="text-gray-400">Onboarding step {currentStep} content...</p>
                    </div>
                    
                    <div className="flex justify-between pt-6">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                      >
                        Previous
                      </Button>

                      {currentStep === totalSteps ? (
                        <Button
                          onClick={handleComplete}
                          disabled={onboardingLoading}
                          className="bg-white text-black hover:bg-gray-200"
                        >
                                                      {onboardingLoading ? (
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
                          className="bg-white text-black hover:bg-gray-200"
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTaskBanner(false)}
                className="text-amber-300/80 hover:text-amber-200 hover:bg-amber-900/30"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card 
            key={index} 
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 group cursor-pointer backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                  {metric.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{metric.icon}</span>
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {metric.value}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={metric.trend === "up" ? "default" : "destructive"}
                    className={`text-xs transition-all duration-300 ${
                      metric.trend === "up" 
                        ? "bg-green-500/20 text-green-400 border-green-500/30 group-hover:bg-green-500/30" 
                        : "bg-red-500/20 text-red-400 border-red-500/30 group-hover:bg-red-500/30"
                    }`}
                  >
                    {metric.change}
                  </Badge>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {metric.description}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                {metric.subtitle}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">Total Visitors</CardTitle>
              <CardDescription className="text-gray-400">
                Total for the last 3 months
              </CardDescription>
            </div>
            <Tabs defaultValue="3months" className="w-auto">
              <TabsList className="bg-gray-800/50 border-gray-700">
                <TabsTrigger 
                  value="3months" 
                  className="text-white data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400 transition-all"
                >
                  Last 3 months
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-800/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Tabs defaultValue="outline" className="w-auto">
              <TabsList className="bg-gray-800/50 border-gray-700">
                <TabsTrigger 
                  value="outline" 
                  className="text-white data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400 transition-all"
                >
                  Outline
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button 
                className="bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Header</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Section Type</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Reviewer</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-all duration-200 group cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <span className="text-white group-hover:text-blue-400 transition-colors font-medium">
                        {row.header}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-gray-700/30 text-gray-300 border-gray-600/50 hover:bg-gray-700/50 transition-colors"
                      >
                        {row.sectionType}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant={row.status === "Done" ? "default" : "secondary"}
                        className={`transition-all duration-200 ${
                          row.status === "Done" 
                            ? "bg-green-500/20 text-green-400 border-green-500/30" 
                            : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {row.reviewer}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}