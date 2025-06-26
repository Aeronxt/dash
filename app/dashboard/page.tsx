"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import PricingPlans from "@/components/ui/pricing-plans"
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  User, 
  Settings,
  Sparkles,
  Clock,
  ChevronRight,
  X
} from "lucide-react"

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  action?: () => void
  actionText?: string
}

export default function DashboardHomePage() {
  const { userProfile, user, loading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPricing, setShowPricing] = useState(false)

  const isOnboardingCompleted = userProfile?.onboarding_completed || false

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Set up your workspace preferences and business information to get started",
      icon: <User className="w-5 h-5" />,
      completed: isOnboardingCompleted,
      action: () => router.push('/onboarding'),
      actionText: isOnboardingCompleted ? "View Profile" : "Complete Setup"
    },
    {
      id: 2,
      title: "Choose Your Plan",
      description: "Select the perfect plan for your needs and start building",
      icon: <Settings className="w-5 h-5" />,
      completed: false, // For now, always false as requested
      action: () => {
        setShowPricing(true)
      },
      actionText: "Choose Plan"
    }
  ]

  const completedSteps = steps.filter(step => step.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Auto-advance to next incomplete step
    const nextIncompleteStep = steps.find(step => !step.completed)
    if (nextIncompleteStep) {
      setCurrentStep(nextIncompleteStep.id)
    }
  }, [isOnboardingCompleted])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
            alt="Flowscape Logo"
            className="h-16 w-auto"
          />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSelectPlan = (plan: any) => {
    console.log("Selected plan:", plan)
    setShowPricing(false)
    // Here you would typically handle the plan selection logic
  }

  if (showPricing) {
    return (
      <div className="min-h-screen bg-black relative">
        {/* Pricing Modal */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="relative bg-black rounded-lg border border-gray-800 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowPricing(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white text-center">Choose Your Plan</h2>
              <p className="text-gray-400 text-center mt-2">Select the perfect plan for your needs</p>
            </div>
            
            {/* Pricing Component */}
            <PricingPlans onSelectPlan={handleSelectPlan} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to your workspace{userProfile?.user_display_name ? `, ${userProfile.user_display_name}` : ''}
        </h1>
        <p className="text-gray-400">
                            Let&apos;s get you set up with a few quick steps
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">Setup Progress</CardTitle>
                <CardDescription className="text-gray-400">
                  {completedSteps} of {steps.length} steps completed
                </CardDescription>
              </div>
            </div>
            <Badge variant={completedSteps === steps.length ? "default" : "secondary"} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {completedSteps === steps.length ? "Complete" : `${Math.round(progressPercentage)}%`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="w-full h-2 bg-gray-800" />
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted = step.completed
          const isNext = !isCompleted && steps.slice(0, index).every(s => s.completed)

          return (
            <Card
              key={step.id}
              className={`
                transition-all duration-500 ease-in-out transform hover:scale-[1.01]
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/40 shadow-lg shadow-blue-500/10' 
                  : isCompleted 
                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
                    : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                }
              `}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Step Icon */}
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                      ${isCompleted 
                        ? 'bg-green-500/20 text-green-400' 
                        : isActive 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-gray-800/50 text-gray-500'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <div className={`
                          flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300
                          ${isActive ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600'}
                        `}>
                          {isActive && <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`
                          text-lg font-semibold transition-colors duration-300
                          ${isCompleted ? 'text-green-400' : isActive ? 'text-blue-400' : 'text-white'}
                        `}>
                          {step.title}
                        </h3>
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                            Completed
                          </Badge>
                        )}
                        {isNext && !isCompleted && (
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs animate-pulse">
                            Next
                          </Badge>
                        )}
                      </div>
                      <p className={`
                        text-sm transition-colors duration-300
                        ${isCompleted ? 'text-gray-400' : isActive ? 'text-gray-300' : 'text-gray-500'}
                      `}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {step.action && (
                    <Button
                      onClick={step.action}
                      disabled={false}
                      variant={isCompleted ? "outline" : "default"}
                      className={`
                        transition-all duration-300 min-w-[120px]
                        ${isCompleted 
                          ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
                          : isActive 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                        }
                      `}
                    >
                      {step.actionText}
                      {!isCompleted && (
                        <ChevronRight className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Completion Message */}
      {completedSteps === steps.length && (
        <Card className="mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">Setup Complete!</h3>
                <p className="text-gray-400">
                  Your workspace is ready. You can now explore all the features and start building.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State for Incomplete Setup */}
      {completedSteps < steps.length && (
        <Card className="mt-8 bg-gray-900/30 border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-gray-800/50 rounded-full">
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Almost There!</h3>
                <p className="text-gray-500 max-w-md">
                  Complete the remaining steps above to unlock your full workspace experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 