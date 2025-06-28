"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Icons } from "@/components/icons"
import { Eye, EyeOff, User, Lock, Github } from "lucide-react"
import Loader from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp, signInWithGoogle, signInWithGitHub, resetPassword } = useAuth()
  const { toast } = useToast()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [invitationToken, setInvitationToken] = useState<string | null>(null)

  // Check for invitation token in URL
  useEffect(() => {
    const inviteParam = searchParams.get('invite')
    if (inviteParam) {
      setInvitationToken(inviteParam)
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Name validation (only for sign up)
    if (isSignUp && !formData.full_name) {
      newErrors.full_name = "Full name is required"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (isSignUp && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation (only for sign up)
    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
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
      if (isSignUp) {
        // Handle sign up
        const { data, error } = await signUp(formData.email, formData.password, {
          full_name: formData.full_name
        })

        if (error) {
          toast({
            variant: "destructive",
            title: "Sign up failed",
            description: error.message || "An error occurred during sign up"
          })
          return
        }

        if (data && data.user) {
          toast({
            title: "Account created successfully!",
            description: "Let's get your account set up!"
          })
          
          // Redirect to onboarding after successful signup
          router.push('/onboarding')
        }
      } else {
        // Handle sign in
        const { data, error } = await signIn(formData.email, formData.password)

        if (error) {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: error.message || "Invalid email or password"
          })
          return
        }

        if (data?.user) {
          // If there's an invitation token, accept the invitation
          if (invitationToken) {
            try {
              const inviteResponse = await fetch('/api/invitations/validate', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  invitationToken: invitationToken, 
                  userId: data.user.id 
                })
              })

              if (inviteResponse.ok) {
                toast({
                  title: "Welcome to the team!",
                  description: "You've been signed in and added to the team."
                })
              }
            } catch (error) {
              console.error('Error accepting invitation:', error)
            }
          } else {
            toast({
              title: "Welcome back!",
              description: "You have been signed in successfully."
            })
          }
          
          // Redirect to dashboard after successful signin
          router.push('/')
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: isSignUp ? "Sign up failed" : "Sign in failed",
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

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setShowForgotPassword(false)
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      full_name: ""
    })
    setErrors({})
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast({
          variant: "destructive",
          title: "Google sign in failed",
          description: error.message
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: error.message || "An unexpected error occurred"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithGitHub()
      if (error) {
        toast({
          variant: "destructive",
          title: "GitHub sign in failed",
          description: error.message
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "GitHub sign in failed",
        description: error.message || "An unexpected error occurred"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address to reset your password"
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await resetPassword(formData.email)
      if (error) {
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: error.message
        })
      } else {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for password reset instructions"
        })
        setShowForgotPassword(false)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message || "An unexpected error occurred"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
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

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">
              {isSignUp ? "Create an account" : "Sign in to your account"}
            </h1>
            <p className="text-gray-400">
              {isSignUp 
                ? "Enter your details below to create your account" 
                : "Enter your email below to sign in"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field - only show in sign up mode */}
            {isSignUp && (
              <div className="space-y-2">
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600 h-12"
                  required
                />
                {errors.full_name && <p className="text-red-400 text-sm">{errors.full_name}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600 h-12"
                required
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600 h-12 pr-10"
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

            {/* Forgot Password - only show in sign in mode */}
            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-sm text-gray-400 hover:text-white underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Forgot Password Form */}
            {showForgotPassword && !isSignUp && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="text-center">
                  <h3 className="text-white font-medium">Reset Password</h3>
                                     <p className="text-sm text-gray-400 mt-1">
                     Enter your email and we&apos;ll send you a link to reset your password
                   </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading || !formData.email}
                    className="flex-1 bg-white text-black hover:bg-gray-200 h-10"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="scale-25">
                          <Loader />
                        </div>
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 bg-transparent border-gray-700 text-white hover:bg-gray-900 h-10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Confirm Password field - only show in sign up mode */}
            {isSignUp && (
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600 h-12 pr-10"
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
            )}

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
                isSignUp ? "Create Account" : "Sign In with Email"
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">
                  {isSignUp ? "OR SIGN UP WITH" : "OR CONTINUE WITH"}
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button 
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-900 h-12"
              >
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={handleGitHubSignIn}
                disabled={loading}
                className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-900 h-12"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            {/* Terms - only show for sign up */}
            {isSignUp && (
              <p className="text-center text-xs text-gray-400">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-white">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-white">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </form>

          {/* Toggle between sign in and sign up */}
          <div className="text-center">
            <button 
              type="button"
              onClick={toggleMode}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 