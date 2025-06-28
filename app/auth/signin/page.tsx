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
import Iridescence from "@/components/Iridescence"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp, signInWithGoogle, signInWithGitHub, resetPassword } = useAuth()
  const { toast } = useToast()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: ""
  })
  
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
        // Show success state for Google sign in too
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
        // Show success state for GitHub sign in too
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

  // SignInForm component
  const SignInForm = () => (
    <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">Enter your email below to sign in</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="m@example.com" 
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required 
            autoComplete="email" 
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="grid gap-2">
          <PasswordInput 
            name="password" 
            label="Password" 
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required 
            autoComplete="current-password" 
            placeholder="••••••••" 
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        
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
                disabled={loading || !formData.email}
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
            "Sign In"
          )}
        </Button>
      </div>
    </form>
  )

  // SignUpForm component
  const SignUpForm = () => (
    <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">Enter your details below to sign up</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            type="text" 
            placeholder="John Doe" 
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            required 
            autoComplete="name" 
          />
          {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="m@example.com" 
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required 
            autoComplete="email" 
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="grid gap-2">
          <PasswordInput 
            name="password" 
            label="Password" 
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required 
            autoComplete="new-password" 
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <div className="grid gap-2">
          <PasswordInput 
            name="confirmPassword" 
            label="Confirm Password" 
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            required 
            autoComplete="new-password" 
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>
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
            "Sign Up"
          )}
        </Button>
        
        {/* Terms */}
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
      </div>
    </form>
  )

  // AuthFormContainer component
  const AuthFormContainer = () => (
    <div className="mx-auto grid w-[350px] gap-2">
      {isSignUp ? <SignUpForm /> : <SignInForm />}
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
  )

  return (
    <div className="w-full min-h-screen bg-black md:grid md:grid-cols-2">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Left Column: The Form */}
      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12 bg-black">
        <AuthFormContainer />
      </div>

      {/* Right Column: The Iridescence Effect */}
      <div className="hidden md:block relative">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
        
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Centered Logo */}
        <div className="absolute inset-0 z-10 flex h-full items-center justify-center p-10">
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
            alt="Flowscape Logo"
            className="h-24 w-auto opacity-90"
          />
        </div>
      </div>
    </div>
  )
} 