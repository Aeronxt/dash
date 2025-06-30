"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronDown, CreditCard, Smartphone, Copy } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabaseClient"

import { getStripeConfig } from "@/lib/stripe-config"

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  name: string
  description: string
  price: number
  currency: string
  period: string
  features: PlanFeature[]
  isPopular?: boolean
  buttonText: string
  buttonVariant: "default" | "outline"
}

interface PricingPlansProps {
  onSelectPlan?: (plan: Plan) => void
}

export default function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const [planType, setPlanType] = useState<"Personal" | "Business">("Personal")
  const [country, setCountry] = useState("AU")
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  
  // Bangladesh payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | null>(null)
  const [mobileWalletType, setMobileWalletType] = useState<"bkash" | "nagad" | "rocket" | null>(null)
  const [bkashReference, setBkashReference] = useState("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  
  // Get current user
  const { user } = useAuth()
  
  // Check Stripe configuration
  const stripeConfig = getStripeConfig()

  // Helper function to get pricing based on country
  const getPricing = (basePrice: number) => {
    switch (country) {
      case "AU":
        return { price: basePrice, currency: "A$" }
      case "BD":
        // Bangladesh pricing based on screenshots
        if (planType === "Personal") {
          const bdPrices = { 9: 600, 15: 1200, 35: 3500 }
          return { price: bdPrices[basePrice as keyof typeof bdPrices] || basePrice * 67, currency: "৳" }
        } else {
          const bdPrices = { 45: 1399, 75: 4999 }
          return { price: bdPrices[basePrice as keyof typeof bdPrices] || basePrice * 31, currency: "৳" }
        }
      case "WW":
        return { price: Math.round(basePrice * 0.67), currency: "$" } // USD conversion
      default:
        return { price: basePrice, currency: "A$" }
    }
  }

  // Helper function to get features based on country
  const getFeatures = (baseFeatures: PlanFeature[], planName: string) => {
    if (country === "BD" && planName === "Startup") {
      return [
        { text: "4 Pages + Ecommerce", included: true },
        { text: "2GB Storage", included: true },
        { text: "Bkash + Nagad + SSL Commerce", included: true },
        { text: "6-12 Days Standard Delivery", included: true },
        { text: "10 Team Members Dashboard", included: true }
      ]
    }
    if (country === "BD") {
      return baseFeatures.map(feature => 
        feature.text === "Custom Domain +A$20" 
          ? { ...feature, text: "Custom Domain +৳1200" }
          : feature.text === "Stripe + Paypal + (Bangladesh payments)"
          ? { ...feature, text: "Bkash + Nagad + SSL Commerce" }
          : feature
      )
    }
    return baseFeatures
  }

  // Helper function to get Stripe payment links
  const getPaymentLink = (planName: string) => {
    // Only provide Stripe links for AU and WW (not BD)
    if (country === "BD") return null
    
    const links: { [key: string]: string } = {
      "Lite": "https://buy.stripe.com/fZu5kFaht6KV9iX9QPeZ200",
      "Plus": "https://buy.stripe.com/7sY28tblxc5f1QvbYXeZ201", 
      "Pro": "https://buy.stripe.com/4gMcN789l1qBan1e75eZ202",
      "Startup": "https://buy.stripe.com/3cI28tblxc5f3YDbYXeZ203",
      "Rising Star": "https://buy.stripe.com/dRm8wRfBN1qBfHld31eZ204"
    }
    
    return links[planName] || null
  }

  // Handle Bangladesh payment confirmation
  const handleBangladeshPayment = async () => {
    console.log('🔄 Starting Bangladesh payment process...')
    console.log('📝 Reference:', bkashReference.trim())
    console.log('👤 User:', user?.id)
    console.log('📦 Selected Plan:', selectedPlan?.name)

    if (!bkashReference.trim()) {
      toast({
        title: "Reference Required",
        description: "Please enter your bKash transaction reference number",
        variant: "destructive"
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your purchase",
        variant: "destructive"
      })
      return
    }

    setIsProcessingPayment(true)
    
    try {
      console.log('💾 Updating database...')
      
      // First check if user exists in flowscape_users table
      const { data: existingUser, error: checkError } = await supabase
        .from('flowscape_users')
        .select('id')
        .eq('id', user.id)
        .single()

      console.log('🔍 User check result:', { existingUser, checkError })

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking user existence:', checkError)
        toast({
          title: "Error",
          description: "Unable to verify user account. Please try again.",
          variant: "destructive"
        })
        setIsProcessingPayment(false)
        return
      }

      if (!existingUser) {
        console.log('👤 User not found in flowscape_users, creating...')
        // Create user if doesn't exist
        const { error: createError } = await supabase
          .from('flowscape_users')
          .insert([{
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            bdreference: bkashReference.trim(),
            subscription_plan: selectedPlan?.name.toLowerCase() || 'free',
            user_role: 'user',
            is_active: true
          }])

        if (createError) {
          console.error('Error creating user:', createError)
          toast({
            title: "Error",
            description: "Failed to create user account. Please contact support.",
            variant: "destructive"
          })
          setIsProcessingPayment(false)
          return
        }
      } else {
        // Update existing user
        const { error } = await supabase
          .from('flowscape_users')
          .update({ 
            bdreference: bkashReference.trim(),
            subscription_plan: selectedPlan?.name.toLowerCase() || 'free'
          })
          .eq('id', user.id)

        console.log('✅ Database update result:', { error })

        if (error) {
          console.error('Error saving bKash reference:', error)
          toast({
            title: "Error",
            description: "Failed to save payment reference. Please try again.",
            variant: "destructive"
          })
          setIsProcessingPayment(false)
          return
        }
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('🎉 Payment process completed successfully!')
      
      toast({
        title: "Payment Received!",
        description: "Thanks for subscribing, please wait 12-24 hours for your account to be activated.",
      })
      
          setShowPaymentModal(false)
    setPaymentMethod(null)
    setMobileWalletType(null)
    setBkashReference("")
    } catch (error) {
      console.error('Error processing Bangladesh payment:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Copy phone number to clipboard
  const copyPhoneNumber = () => {
    navigator.clipboard.writeText("+8801842521774")
    toast({
      title: "Copied!",
      description: "Phone number copied to clipboard",
    })
  }

  const basePlans = {
    personal: [
      {
        name: "Lite",
        description: "Perfect for getting started",
        basePrice: 9,
        features: [
          { text: "Interactive Blog + 1 Page", included: true },
          { text: "500MB Storage", included: true },
          { text: "Custom Domain +A$20", included: true },
          { text: "3-7 Days Standard Delivery", included: true },
          { text: "1 Dashboard Access", included: true }
        ],
        buttonText: "Get started",
        buttonVariant: "outline" as const
      },
      {
        name: "Plus",
        description: "Best for small businesses",
        basePrice: 15,
        features: [
          { text: "Everything in Lite +", included: true },
          { text: "1GB Storage", included: true },
          { text: "Google Adsense Monetization", included: true },
          { text: "Custom Domain Included", included: true },
          { text: "Enhanced Database (100K users)", included: true },
          { text: "2 Team Members", included: true }
        ],
        isPopular: true,
        buttonText: "Get started",
        buttonVariant: "default" as const
      },
      {
        name: "Pro",
        description: "For growing businesses",
        basePrice: 35,
        features: [
          { text: "Everything in Plus +", included: true },
          { text: "Max 8 Edits/Month", included: true },
          { text: "3 Team Members", included: true },
          { text: "Database Access", included: true },
          { text: "Express Delivery (3-7 Days)", included: true },
          { text: "Premium Support", included: true }
        ],
        buttonText: "Get started",
        buttonVariant: "outline" as const
      }
    ],
    business: [
      {
        name: "Startup",
        description: "Perfect for startups",
        basePrice: 45,
        features: [
          { text: "4 Pages + Ecommerce", included: true },
          { text: "2GB Storage", included: true },
          { text: "Stripe + Paypal + (Bangladesh payments)", included: true },
          { text: "6-12 Days Standard Delivery", included: true },
          { text: "10 Team Members Dashboard", included: true }
        ],
        buttonText: "Get started",
        buttonVariant: "outline" as const
      },
      {
        name: "Rising Star",
        description: "Best for growing businesses",
        basePrice: 75,
        features: [
          { text: "10 Pages + 1 Bonus + Ecommerce", included: true },
          { text: "5GB Storage", included: true },
          { text: "Split Payment + BNPL", included: true },
          { text: "10-14 Days Standard Delivery", included: true },
          { text: "25 Team Members Dashboard", included: true }
        ],
        isPopular: true,
        buttonText: "Get started",
        buttonVariant: "default" as const
      }
    ]
  }

  const basePlansList = planType === "Personal" ? basePlans.personal : basePlans.business
  
  const currentPlans: Plan[] = basePlansList.map(plan => {
    const pricing = getPricing(plan.basePrice)
    const features = getFeatures(plan.features, plan.name)
    
    return {
      name: plan.name,
      description: plan.description,
      price: pricing.price,
      currency: pricing.currency,
      period: "/month",
      features,
      isPopular: plan.isPopular,
      buttonText: plan.buttonText,
      buttonVariant: plan.buttonVariant
    }
  })

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        {/* Personal/Business Toggle */}
        <div className="flex items-center bg-gray-800/50 rounded-full p-1">
          <button
            onClick={() => setPlanType("Personal")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              planType === "Personal"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => setPlanType("Business")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              planType === "Business"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Business
          </button>
        </div>

        {/* Country Selector */}
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700 text-white">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{country}</span>
              <span className="text-gray-400">
                {country === "AU" ? "Australia" : country === "BD" ? "Bangladesh" : "Worldwide"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="AU" className="text-white hover:bg-gray-700">
              <div className="flex items-center gap-2">
                <span className="font-medium">AU</span>
                <span className="text-gray-400">Australia</span>
              </div>
            </SelectItem>
            <SelectItem value="BD" className="text-white hover:bg-gray-700">
              <div className="flex items-center gap-2">
                <span className="font-medium">BD</span>
                <span className="text-gray-400">Bangladesh</span>
              </div>
            </SelectItem>
            <SelectItem value="WW" className="text-white hover:bg-gray-700">
              <div className="flex items-center gap-2">
                <span className="font-medium">WW</span>
                <span className="text-gray-400">Worldwide</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pricing Cards */}
      <div className={`grid gap-6 ${currentPlans.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
        {currentPlans.map((plan, index) => (
          <Card
            key={plan.name}
            className={`relative bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 ${
              plan.isPopular ? "ring-2 ring-blue-500/50" : ""
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-medium">
                  POPULAR
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl font-bold text-white">{plan.name}</CardTitle>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              <CardDescription className="text-gray-400 text-sm">
                {plan.description}
              </CardDescription>
              
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-3xl font-bold text-white">{plan.currency}{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              
              <div className="text-gray-500 text-sm mt-1">
                {plan.name === "Lite" && "Interactive Blog + 1 Page"}
                {plan.name === "Plus" && "4 Pages + 1 Bonus"}
                {plan.name === "Pro" && "10+ Pages + 1 Bonus"}
                {plan.name === "Startup" && "4 Pages + Ecommerce"}
                {plan.name === "Rising Star" && "10 Pages + 1 Bonus + Ecommerce"}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={async () => {
                  // Handle Bangladesh - show payment modal
                  if (country === "BD") {
                    setSelectedPlan(plan);
                    setShowPaymentModal(true);
                    return;
                  }

                  // For AU and WW, use Stripe checkout sessions
                  if (country === "AU" || country === "WW") {
                    // Check Stripe configuration before proceeding
                    if (!stripeConfig.isConfigured) {
                      alert(stripeConfig.error || 'Stripe is not configured. Please contact support to complete your purchase.');
                      return;
                    }
                    
                    setLoadingPlan(plan.name);
                    try {
                      const response = await fetch('/api/stripe/create-checkout-session', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          planName: plan.name,
                          amount: plan.price, // Use the calculated price for the selected country
                          country: country
                        }),
                      });

                      const responseData = await response.json();

                      console.log('📡 Stripe API Response:', {
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries()),
                        data: responseData
                      });

                      if (!response.ok) {
                        console.error('❌ Stripe API Error:', {
                          status: response.status,
                          error: responseData.error,
                          details: responseData.details,
                          timestamp: responseData.timestamp,
                          fullResponse: responseData
                        });
                        
                        const errorMessage = responseData.details 
                          ? `${responseData.error}: ${responseData.details}`
                          : responseData.error || 'Failed to create checkout session';
                        
                        throw new Error(errorMessage);
                      }

                      const { sessionId } = responseData;
                      
                      if (!sessionId) {
                        throw new Error('No session ID received');
                      }
                      
                      // Redirect to Stripe Checkout
                      const { loadStripe } = await import('@stripe/stripe-js');
                      const stripeInstance = await loadStripe(stripeConfig.publishableKey!);
                      
                      if (!stripeInstance) {
                        throw new Error('Failed to load Stripe');
                      }

                      const { error } = await stripeInstance.redirectToCheckout({ sessionId });
                      
                      if (error) {
                        throw new Error(error.message || 'Stripe checkout failed');
                      }
                      
                    } catch (error) {
                      console.error('❌ Complete error details:', {
                        error,
                        message: error instanceof Error ? error.message : 'Unknown error',
                        stack: error instanceof Error ? error.stack : undefined,
                        name: error instanceof Error ? error.name : undefined,
                        type: typeof error,
                        timestamp: new Date().toISOString()
                      });
                      
                      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                      
                      // Show more detailed error to user
                      alert(`Failed to start checkout: ${errorMessage}\n\nPlease check the browser console for more details and try again.`);
                    } finally {
                      setLoadingPlan(null);
                    }
                    return;
                  }

                  // Fallback for any other cases
                  const paymentLink = getPaymentLink(plan.name)
                  if (paymentLink) {
                    window.open(paymentLink, '_blank')
                  } else {
                    onSelectPlan?.(plan)
                  }
                }}
                variant={plan.buttonVariant}
                disabled={
                  loadingPlan === plan.name || 
                  ((country === "AU" || country === "WW") && !stripeConfig.isConfigured)
                }
                className={`w-full mt-6 ${
                  plan.buttonVariant === "default"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                } ${((country === "AU" || country === "WW") && !stripeConfig.isConfigured) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loadingPlan === plan.name 
                  ? "Processing..." 
                  : ((country === "AU" || country === "WW") && !stripeConfig.isConfigured)
                    ? "Configuration Required"
                    : plan.buttonText
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bangladesh Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Complete Your Payment
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedPlan && `Subscribe to ${selectedPlan.name} - ${selectedPlan.currency}${selectedPlan.price}/month`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {!paymentMethod ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Select your payment method</p>
                
                <button
                  onClick={() => setPaymentMethod("card")}
                  className="w-full p-4 rounded-lg border border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-gray-600 flex items-center justify-center transition-colors">
                    <CreditCard className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Credit/Debit Card</p>
                    <p className="text-sm text-gray-400">Pay with Visa, Mastercard, etc.</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("wallet")}
                  className="w-full p-4 rounded-lg border border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-gray-600 flex items-center justify-center transition-colors">
                    <Smartphone className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Mobile Wallet</p>
                    <p className="text-sm text-gray-400">Pay with bKash, Nagad, Rocket</p>
                  </div>
                </button>
              </div>
            ) : paymentMethod === "card" ? (
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-lg font-semibold text-gray-300">Currently Not Available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Credit/Debit card payments are coming soon
                  </p>
                </div>

                {/* International Payment Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 text-sm font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm font-medium mb-1">
                        International Card Available?
                      </p>
                      <p className="text-blue-300/80 text-sm leading-relaxed">
                        If your card is activated for international payments, you can select your region as <strong>Worldwide</strong> and proceed with the payment using our secure Stripe integration.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setCountry("WW")
                      setShowPaymentModal(false)
                      setPaymentMethod(null)
                      setMobileWalletType(null)
                    }}
                    className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Switch to Worldwide & Use Card Payment
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    setPaymentMethod(null)
                    setMobileWalletType(null)
                  }}
                  variant="outline"
                  className="w-full bg-gray-800 hover:bg-gray-700 border-gray-700"
                >
                  Back to Payment Methods
                </Button>
              </div>
            ) : paymentMethod === "wallet" && !mobileWalletType ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Select your mobile wallet</p>
                
                <button
                  onClick={() => setMobileWalletType("bkash")}
                  className="w-full p-4 rounded-lg border border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 flex items-center justify-center group"
                >
                  <img 
                    src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mobilepaymentslogo//Bkash-Logo.png" 
                    alt="bKash" 
                    className="h-12 w-auto group-hover:scale-105 transition-transform duration-200"
                  />
                </button>

                <button
                  onClick={() => setMobileWalletType("nagad")}
                  className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800/30 transition-all duration-200 flex items-center justify-center opacity-50 cursor-not-allowed relative"
                  disabled
                >
                  <img 
                    src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mobilepaymentslogo//Nagad-Logo.wine.png" 
                    alt="Nagad" 
                    className="h-12 w-auto grayscale"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Coming Soon</span>
                  </div>
                </button>

                <button
                  onClick={() => setMobileWalletType("rocket")}
                  className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800/30 transition-all duration-200 flex items-center justify-center opacity-50 cursor-not-allowed relative"
                  disabled
                >
                  <img 
                    src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mobilepaymentslogo//Rocket_mobile_banking_logo.svg.png" 
                    alt="Rocket" 
                    className="h-12 w-auto grayscale"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Coming Soon</span>
                  </div>
                </button>

                <Button
                  onClick={() => setPaymentMethod(null)}
                  variant="outline"
                  className="w-full bg-gray-800 hover:bg-gray-700 border-gray-700"
                >
                  Back to Payment Methods
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <img 
                      src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mobilepaymentslogo//Bkash-Logo.png" 
                      alt="bKash" 
                      className="h-8"
                    />
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                      Personal Account
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300">Send money to this personal account:</p>
                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
                      <span className="font-mono text-lg flex-1">+8801842521774</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyPhoneNumber}
                        className="hover:bg-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-400">
                    <p>1. Open your bKash app</p>
                    <p>2. Select &quot;Send Money&quot;</p>
                    <p>3. Enter the number above</p>
                    <p>4. Enter amount: {selectedPlan?.currency}{selectedPlan?.price}</p>
                    <p>5. Complete the payment and note the reference</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference" className="text-gray-300">
                    Enter Reference Number
                  </Label>
                  <Input
                    id="reference"
                    value={bkashReference}
                    onChange={(e) => setBkashReference(e.target.value)}
                    placeholder="Enter your bKash transaction reference"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500">
                    You&apos;ll find this in your bKash payment confirmation
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setMobileWalletType(null)
                      setBkashReference("")
                    }}
                    variant="outline"
                    className="flex-1 bg-gray-800 hover:bg-gray-700 border-gray-700"
                    disabled={isProcessingPayment}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleBangladeshPayment}
                    className="flex-1 bg-pink-500 hover:bg-pink-600"
                    disabled={isProcessingPayment || !bkashReference.trim()}
                  >
                    {isProcessingPayment ? "Processing..." : "Confirm Payment"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 