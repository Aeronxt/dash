"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import Loader from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updatePassword } = useAuth()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isValidToken, setIsValidToken] = useState(true)

  useEffect(() => {
    // Check if we have the required tokens/fragments in the URL
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      setIsValidToken(false)
      toast({
        variant: "destructive",
        title: "Invalid reset link",
        description: errorDescription || "The password reset link is invalid or has expired"
      })
    }
  }, [searchParams, toast])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { error } = await updatePassword(formData.password)

      if (error) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: error.message || "Failed to update password"
        })
        return
      }

      toast({
        title: "Password updated successfully!",
        description: "Your password has been updated. You can now sign in with your new password."
      })
      
      // Redirect to sign in page after successful password update
      router.push('/auth/signin')
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error.message || "An unexpected error occurred"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-black flex">
        {/* Left side - Logo */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            <img 
              src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
              alt="Flowscape Logo"
              className="h-16 w-auto"
            />
          </div>
        </div>

        {/* Divider line */}
        <div className="w-px bg-gray-700"></div>

        {/* Right side - Error message */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="text-red-400">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <span className="text-red-600 text-2xl">✕</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h1>
              <p className="text-gray-400 mb-6">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button 
                onClick={() => router.push('/auth/signin')}
                className="bg-white text-black hover:bg-gray-200"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center">
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
            alt="Flowscape Logo"
            className="h-16 w-auto"
          />
        </div>
      </div>

      {/* Divider line */}
      <div className="w-px bg-gray-700"></div>

      {/* Right side - Reset password form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
            <p className="text-gray-400">Enter your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200 h-12 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="scale-25">
                    <Loader />
                  </div>
                </div>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          {/* Back to sign in */}
          <div className="text-center">
            <button 
              type="button"
              onClick={() => router.push('/auth/signin')}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 