"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateOnboardingData, userProfile, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    user_display_name: "",
    business_name: "",
    website_purpose: "",
    business_type: "",
    user_country: "",
    features_needed: [] as string[]
  });

  // Update form data when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        user_display_name: userProfile.user_display_name || "",
        business_name: userProfile.business_name || "",
        website_purpose: userProfile.website_purpose || "",
        business_type: userProfile.business_type || "",
        user_country: userProfile.user_country || "",
        features_needed: userProfile.features_needed || []
      });
    }
  }, [userProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("No user found, redirecting to signin...");
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  // Check if already onboarded
  useEffect(() => {
    if (!authLoading && userProfile?.onboarding_completed) {
      console.log("Onboarding already completed, redirecting to dashboard...");
      router.push('/dashboard');
    }
  }, [userProfile, authLoading, router]);

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features_needed: checked 
        ? [...prev.features_needed, feature]
        : prev.features_needed.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_display_name || !formData.business_name || !formData.website_purpose || !formData.business_type || !formData.user_country) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to complete onboarding.",
        variant: "destructive"
      });
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    
    try {
      console.log("Submitting onboarding data:", formData);
      console.log("User ID:", user.id);
      
      const { error } = await updateOnboardingData(formData);
      
      if (error) {
        console.error('Onboarding error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to save your information. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome to Flowscape!",
          description: "Your profile has been set up successfully.",
        });
        // Add a small delay to ensure the update is processed
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: "Error", 
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "E-commerce Integration",
    "Blog & Content Management", 
    "SEO Optimization",
    "Analytics & Tracking",
    "Custom Domain",
    "Mobile Optimization",
    "Social Media Integration",
    "Email Marketing"
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Flowscape!</h1>
        <p className="text-gray-400">Let&apos;s set up your workspace with a few quick questions</p>
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Complete Your Profile</CardTitle>
          <CardDescription className="text-gray-400">
            This information helps us customize your experience
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-gray-300">
                Display Name *
              </Label>
              <Input
                id="display_name"
                value={formData.user_display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, user_display_name: e.target.value }))}
                placeholder="How should we address you?"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="business_name" className="text-gray-300">
                Business/Project Name *
              </Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="Your company or project name"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            {/* Website Purpose */}
            <div className="space-y-2">
              <Label htmlFor="website_purpose" className="text-gray-300">
                Website Purpose *
              </Label>
              <Select
                value={formData.website_purpose}
                onValueChange={(value) => setFormData(prev => ({ ...prev, website_purpose: value }))}
                required
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="What&apos;s your website for?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="business">Business Website</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                  <SelectItem value="personal">Personal Website</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="business_type" className="text-gray-300">
                Business Type *
              </Label>
              <Select
                value={formData.business_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, business_type: value }))}
                required
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="small_business">Small Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="user_country" className="text-gray-300">
                Country *
              </Label>
              <Select
                value={formData.user_country}
                onValueChange={(value) => setFormData(prev => ({ ...prev, user_country: value }))}
                required
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="BD">Bangladesh</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Features Needed */}
            <div className="space-y-3">
              <Label className="text-gray-300">
                Features You&apos;re Interested In
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features_needed.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                      className="border-gray-600"
                    />
                    <Label 
                      htmlFor={feature} 
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading || authLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up your workspace...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 