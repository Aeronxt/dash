"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Icons } from "@/components/icons"
import { Eye, EyeOff, User, Mail, Lock, Github } from "lucide-react"
import Loader from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, signInWithGoogle, signInWithGitHub } = useAuth()
  const { toast } = useToast()
  
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.full_name) {
      newErrors.full_name = "Full name is required"
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
          description: "Please check your email to verify your account before signing in."
        })
        
        router.push('/auth/signin')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/public//f.png"
              alt="Flowscape Logo"
              className="h-12 w-auto" 
            />
          </div>
          <CardTitle className="text-3xl text-white">Create your account</CardTitle>
          <CardDescription className="text-gray-400">
            Join Flowscape and start your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-sm">Quick signup with</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={async () => {
                  setLoading(true)
                  try {
                    const { error } = await signInWithGoogle()
                    if (error) {
                      toast({
                        variant: "destructive",
                        title: "Google signup failed",
                        description: error.message
                      })
                    }
                  } catch (error: any) {
                    toast({
                      variant: "destructive",
                      title: "Google signup failed",
                      description: error.message || "An unexpected error occurred"
                    })
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="bg-transparent border-gray-700 text-white hover:bg-gray-900 h-11"
              >
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={async () => {
                  setLoading(true)
                  try {
                    const { error } = await signInWithGitHub()
                    if (error) {
                      toast({
                        variant: "destructive",
                        title: "GitHub signup failed",
                        description: error.message
                      })
                    }
                  } catch (error: any) {
                    toast({
                      variant: "destructive",
                      title: "GitHub signup failed",
                      description: error.message || "An unexpected error occurred"
                    })
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="bg-transparent border-gray-700 text-white hover:bg-gray-900 h-11"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">OR CONTINUE WITH EMAIL</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
                  required
                />
              </div>
              {errors.full_name && <p className="text-red-400 text-sm">{errors.full_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
                  required
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
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
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
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
              className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="scale-25">
                    <Loader />
                  </div>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-white hover:text-gray-300 underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 