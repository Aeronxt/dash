"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
                  // Special handling for Lite plan - create custom $9 checkout session
                  if (plan.name === "Lite") {
                    setLoadingPlan("Lite");
                    try {
                      // Validate environment
                      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
                        throw new Error('Stripe configuration missing');
                      }

                      const response = await fetch('/api/stripe/create-checkout-session', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          planName: 'Lite',
                          amount: 9, // $9 charge
                          country: country
                        }),
                      });

                      const responseData = await response.json();

                      if (!response.ok) {
                        throw new Error(responseData.error || 'Failed to create checkout session');
                      }

                      const { sessionId } = responseData;
                      
                      if (!sessionId) {
                        throw new Error('No session ID received');
                      }
                      
                      // Redirect to Stripe Checkout
                      const { loadStripe } = await import('@stripe/stripe-js');
                      const stripeInstance = await loadStripe(
                        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                      );
                      
                      if (!stripeInstance) {
                        throw new Error('Failed to load Stripe');
                      }

                      const { error } = await stripeInstance.redirectToCheckout({ sessionId });
                      
                      if (error) {
                        throw new Error(error.message || 'Stripe checkout failed');
                      }
                      
                    } catch (error) {
                      console.error('Error creating checkout session:', error);
                      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                      alert(`Failed to start checkout: ${errorMessage}. Please try again.`);
                    } finally {
                      setLoadingPlan(null);
                    }
                    return;
                  }

                  // For other plans, use existing logic
                  const paymentLink = getPaymentLink(plan.name)
                  if (paymentLink) {
                    window.open(paymentLink, '_blank')
                  } else {
                    onSelectPlan?.(plan)
                  }
                }}
                variant={plan.buttonVariant}
                disabled={loadingPlan === plan.name}
                className={`w-full mt-6 ${
                  plan.buttonVariant === "default"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                }`}
              >
                {loadingPlan === plan.name ? "Processing..." : plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 