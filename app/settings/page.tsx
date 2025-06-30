"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BackgroundThemeSelector } from "@/components/ui/background-theme-selector"
import SplitText from "@/components/ui/split-text"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import PricingPlans from "@/components/ui/pricing-plans"
import { 
  Settings as SettingsIcon, 
  User,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Search,
  ChevronRight,
  ChevronDown,
  Save,
  Loader2,
  Download,
  Trash2
} from "lucide-react"

export default function SettingsPage() {
  const { user, userProfile, updateProfile, updatePassword } = useAuth()
  const { toast } = useToast()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: '',
    address: '',
    business_name: '',
    business_type: ''
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name || '',
        address: userProfile.address || '',
        business_name: userProfile.business_name || '',
        business_type: userProfile.business_type || ''
      })
    }
  }, [userProfile])

  const toggleSection = (sectionTitle: string) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('🚀 [Settings] Starting profile update with data:', profileData)
      console.log('🚀 [Settings] Current user:', user)
      console.log('🚀 [Settings] Current userProfile:', userProfile)
      
      const result = await updateProfile(profileData)
      console.log('📡 [Settings] Update result:', result)
      
      if (result?.error) {
        console.error('❌ [Settings] Update error:', result.error)
        throw new Error(result.error.message || result.error || 'Failed to update profile')
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully."
      })
    } catch (error: any) {
      console.error('💥 [Settings] Profile update failed:', error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Password form submitted')
    setPasswordLoading(true)

    try {
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      // Validate password strength
      if (passwordData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      console.log('Calling updatePassword...')
      // According to Supabase docs, we just need to call updateUser with the new password
      // The current password verification is handled by Supabase authentication
      const result = await updatePassword(passwordData.newPassword)
      console.log('updatePassword result:', result)
      
      if (result?.error) {
        console.error('Update error details:', result.error)
        throw new Error(result.error.message || 'Failed to update password')
      }

      if (!result?.data) {
        console.warn('No data returned from updatePassword')
      }

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully. Please check your email for confirmation."
      })

      // Clear the form
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      console.error('Password update error:', error)
      console.error('Error stack:', error.stack)
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error.message || "Failed to update password. Please try again."
      })
    } finally {
      console.log('Setting loading to false')
      setPasswordLoading(false)
    }
  }

  const handlePasswordInputChange = (field: string, value: string) => {
    console.log('🔐 Password input changed:', field, '=', value)
    setPasswordData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      console.log('🔐 New password data:', newData)
      return newData
    })
  }

  const renderAccountForm = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Subscription Management</h3>
          
          {/* Current Plan Display */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Current Plan</span>
              <span className="text-white font-medium">
                {userProfile?.subscription_plan ? 
                  userProfile.subscription_plan.charAt(0).toUpperCase() + userProfile.subscription_plan.slice(1) 
                  : 'Free'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {userProfile?.subscription_plan === 'free' && 'Basic features with limited usage'}
              {userProfile?.subscription_plan === 'lite' && '$9/month - Interactive Blog + 1 Page'}
              {userProfile?.subscription_plan === 'plus' && '$15/month - Everything in Lite + Enhanced Features'}
              {userProfile?.subscription_plan === 'pro' && '$35/month - Everything in Plus + Premium Support'}
              {userProfile?.subscription_plan === 'startup' && '$45/month - 4 Pages + Ecommerce'}
              {userProfile?.subscription_plan === 'rising_star' && '$75/month - 10 Pages + 1 Bonus + Ecommerce'}
            </div>
          </div>

          {/* Upgrade/Change Plan Button */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowPricingModal(true)}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {userProfile?.subscription_plan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
          </Button>

          {/* Cancellation Notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-400 text-sm">
              ⚠️ To cancel your subscription, please contact us at{' '}
              <a 
                href="mailto:support@flowscape.xyz" 
                className="underline hover:text-amber-300 transition-colors"
              >
                support@flowscape.xyz
              </a>
            </p>
          </div>

          {/* Additional Account Options */}
          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Account Actions</h4>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-300 border-gray-700 hover:bg-gray-800"
                onClick={() => {
                  // Download account data functionality
                  toast({
                    title: "Feature coming soon",
                    description: "Account data export will be available in the next update."
                  })
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Account Data
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-400 border-red-900 hover:bg-red-900/20"
                onClick={() => {
                  // Delete account functionality
                  toast({
                    variant: "destructive",
                    title: "Contact support",
                    description: "To delete your account, please email support@flowscape.xyz"
                  })
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSecurityForm = () => {
    return (
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>

          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-white">New Password</Label>
            <Input
              id="new_password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your new password"
              required
              minLength={6}
            />
            <p className="text-sm text-gray-400">Password must be at least 6 characters long</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-white">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Confirm your new password"
              required
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              ⓘ You will receive a confirmation email after changing your password. Your new password will be active immediately.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={passwordLoading || !passwordData.newPassword || !passwordData.confirmPassword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {passwordLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </div>
      </form>
    )
  }

  const renderProfileForm = () => (
    <form onSubmit={(e) => {
      console.log('🔥 Form submitted!', e)
      handleProfileSubmit(e)
    }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-white">Full Name</Label>
          <Input
            id="full_name"
            value={profileData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business_name" className="text-white">Business Name</Label>
          <Input
            id="business_name"
            value={profileData.business_name}
            onChange={(e) => handleInputChange('business_name', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter your business name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-white">Address</Label>
        <Input
          id="address"
          value={profileData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="Enter your address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="business_type" className="text-white">Business Type</Label>
        <Select onValueChange={(value) => handleInputChange('business_type', value)} value={profileData.business_type}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="consulting">Consulting</SelectItem>
            <SelectItem value="real-estate">Real Estate</SelectItem>
            <SelectItem value="hospitality">Hospitality</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="nonprofit">Non-profit</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          onClick={(e) => {
            console.log('🔥 Save button clicked!', e)
            // Let the form onSubmit handle the actual submission
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )

  const settingsSections = [
    {
      title: "Profile",
      description: "Manage your personal information and business details",
      icon: User,
      items: ["Full Name", "Business Name", "Address", "Business Type"],
      content: "profile" // Use a string identifier instead of JSX
    },
    {
      title: "Security",
      description: "Protect your account and manage privacy settings",
      icon: Shield,
      items: ["Password Change", "Two-Factor Authentication", "Privacy Settings"],
      content: "security"
    },
    {
      title: "Appearance",
      description: "Customize the look and feel of your workspace",
      icon: Palette,
      items: ["Theme", "Background", "Language", "Font Size"],
      content: <BackgroundThemeSelector />
    },
    {
      title: "Account",
      description: "Billing, subscription, and account management",
      icon: CreditCard,
      items: ["Billing Information", "Subscription", "Account Deletion"],
      content: "account"
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              <SplitText 
                text="Settings"
                className="text-5xl font-bold text-white"
                delay={50}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 50, scale: 0.8 }}
                to={{ opacity: 1, y: 0, scale: 1 }}
                textAlign="left"
              />
            </h1>
            <p className="text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {settingsSections.map((section, index) => {
            const Icon = section.icon
            const isExpanded = expandedSection === section.title
            const hasContent = section.content !== null && section.content !== undefined

            return (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-0">
                  <div 
                    className={`p-6 ${hasContent ? 'cursor-pointer' : ''}`}
                    onClick={hasContent ? () => toggleSection(section.title) : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/20 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg font-medium mb-1">
                            {section.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {section.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {section.items.map((item, itemIndex) => (
                              <span 
                                key={itemIndex}
                                className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {hasContent ? (
                        <div className="transition-transform duration-200">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Expandable Content */}
                  {hasContent && isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-800">
                      <div className="pt-6">
                        {section.content === "profile" ? renderProfileForm() : 
                         section.content === "security" ? renderSecurityForm() : 
                         section.content === "account" ? renderAccountForm() :
                         section.content}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20 mt-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 bg-blue-600/20 rounded-full mb-6">
              <SettingsIcon className="w-8 h-8 text-blue-400" />
            </div>
            <CardTitle className="text-lg font-semibold text-white mb-2">
              More Settings Coming Soon
            </CardTitle>
            <CardDescription className="text-gray-400 text-center max-w-md">
              We&apos;re working hard to bring you comprehensive settings management. 
              Additional configuration options will be available in future updates.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Plans Modal */}
      <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {userProfile?.subscription_plan === 'free' ? 'Choose Your Plan' : 'Change Your Plan'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {userProfile?.subscription_plan === 'free' 
                ? 'Select the plan that best fits your needs' 
                : `You're currently on the ${userProfile?.subscription_plan} plan. Select a new plan to switch.`}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <PricingPlans onSelectPlan={(plan) => {
              // Handle plan selection
              console.log('Selected plan:', plan)
              // The PricingPlans component handles the Stripe checkout
              // After successful payment, the payment/success page will update the subscription
            }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 