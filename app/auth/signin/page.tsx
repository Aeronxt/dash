"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { useAuth } from "@/hooks/use-auth"
import { Icons } from "@/components/icons"
import { CheckCircle, Github } from "lucide-react"
import Loader from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp, signInWithGoogle, signInWithGitHub, resetPassword } = useAuth()
  const { toast } = useToast()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  
  const [loading, setLoading] = useState(false)
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
    if (isSignUp && !fullName) {
      newErrors.full_name = "Full name is required"
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else if (isSignUp && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation (only for sign up)
    if (isSignUp) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (password !== confirmPassword) {
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
        const { data, error } = await signUp(email, password, {
          full_name: fullName
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
            description: "Welcome to Dash!"
          })
          
          // Redirect to dashboard after successful signup
          router.push('/dashboard')
        }
      } else {
        // Handle sign in
        const { data, error } = await signIn(email, password)

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
          }
          
          // Show success state instead of immediately redirecting
          setShowSuccess(true)
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

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setShowForgotPassword(false)
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFullName("")
    setErrors({})
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
      } else {
        setShowSuccess(true)
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
      } else {
        setShowSuccess(true)
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
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address to reset your password"
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await resetPassword(email)
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

  const handleContinueToDashboard = () => {
    router.push('/dashboard')
  }

  // Success state component
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center space-y-8">
          {/* Checkmark */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          {/* Success message */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">You&apos;re in!</h1>
            <p className="text-gray-400 text-lg">Welcome</p>
          </div>

          {/* Continue button */}
          <Button 
            onClick={handleContinueToDashboard}
            className="px-8 py-3 rounded-full text-base font-medium"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-black md:grid md:grid-cols-2">
      {/* Left Column: The Form */}
      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12 bg-black">
        <div className="mx-auto grid w-[350px] gap-2">
          <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">
                {isSignUp ? "Create an account" : "Sign in to your account"}
              </h1>
              <p className="text-balance text-sm text-muted-foreground">
                {isSignUp ? "Enter your details below to sign up" : "Enter your email below to sign in"}
              </p>
            </div>
            
            <div className="grid gap-4">
              {isSignUp && (
                <div className="grid gap-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="John Doe" 
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.full_name) {
                        setErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.full_name
                          return newErrors
                        })
                      }
                    }}
                    required 
                    autoComplete="name" 
                  />
                  {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email" 
                  type="email"
                  placeholder="m@example.com" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.email
                        return newErrors
                      })
                    }
                  }}
                  required
                  autoComplete="email" 
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              
              <div className="grid gap-2">
                <PasswordInput 
                  name="password" 
                  label="Password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.password
                        return newErrors
                      })
                    }
                  }}
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="••••••••" 
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {isSignUp && (
                <div className="grid gap-2">
                  <PasswordInput 
                    name="confirmPassword" 
                    label="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) {
                        setErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.confirmPassword
                          return newErrors
                        })
                      }
                    }}
                    required
                    autoComplete="new-password" 
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              )}

              {!isSignUp && (
                <>
                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto"
                      onClick={() => setShowForgotPassword(!showForgotPassword)}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  {/* Forgot Password Form */}
                  {showForgotPassword && (
                    <div className="bg-muted border border-border rounded-lg p-4 space-y-3">
                      <div className="text-center">
                        <h3 className="text-foreground font-medium">Reset Password</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter your email and we&apos;ll send you a link to reset your password
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleForgotPassword}
                          disabled={loading || !email}
                          className="flex-1"
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
                          className="px-4"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <Button 
                type="submit" 
                variant="outline" 
                className="mt-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="scale-25">
                      <Loader />
                    </div>
                  </div>
                ) : (
                  isSignUp ? "Sign Up" : "Sign In"
                )}
              </Button>

              {isSignUp && (
                <div className="text-center space-y-4">
                  <p className="text-xs text-muted-foreground">
                    By signing up, you agree to the{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
                      MSA
                    </Link>
                    ,{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                      Product Terms
                    </Link>
                    ,{" "}
                    <Link href="/policies" className="underline underline-offset-4 hover:text-foreground">
                      Policies
                    </Link>
                    ,{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                      Privacy Notice
                    </Link>
                    , and{" "}
                    <Link href="/cookies" className="underline underline-offset-4 hover:text-foreground">
                      Cookie Notice
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </form>

          <div className="text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button 
              variant="link" 
              className="pl-1 text-foreground" 
              onClick={toggleMode}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Button>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
          
          <Button 
            variant="outline" 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
          
          <Button 
            variant="outline" 
            type="button"
            onClick={handleGitHubSignIn}
            disabled={loading}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </div>
      </div>

      {/* Right Column: The Iridescence Effect */}
      <div className="hidden md:block relative">
        {/* Centered Image */}
        <div className="absolute inset-0 flex h-full items-center justify-center p-10 bg-black">
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//Darkshell2012.jpeg"
            alt="Darkshell"
            className="w-full h-full object-cover opacity-90 rounded-lg shadow-2xl"
          />
          {/* Flowscape Logo Overlay */}
          <Link href="/" className="absolute inset-0 flex items-center justify-center">
            <img 
              src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
              alt="Flowscape Logo"
              className="h-20 w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  )
} 