"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  Target, 
  FileText, 
  Palette, 
  Settings, 
  Wrench,
  CheckCircle,
  X
} from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/hooks/use-auth"

interface ProjectData {
  // Business & Contact Information
  companyName: string
  primaryContactName: string
  primaryContactRole: string
  primaryContactEmail: string
  primaryContactPhone: string
  businessAddress: string
  companyDescription: string
  
  // Project Goals & Objectives
  websitePurpose: string[]
  businessGoals: string
  primaryAudience: string
  audienceDemographics: string
  audiencePainPoints: string
  competitor1Url: string
  competitor1Notes: string
  competitor2Url: string
  competitor2Notes: string
  competitor3Url: string
  competitor3Notes: string
  
  // Content & Features
  topLevelPages: string
  nestedPages: string
  coreFunctionality: string[]
  otherIntegrations: string
  contentSupply: string
  needCopywriting: boolean
  approximatePages: string
  needSEO: boolean
  existingAnalytics: string
  needGoalTracking: boolean
  
  // Design & Branding
  hasLogo: boolean
  logoFiles: string
  colorPalette: string
  brandFonts: string
  designStyle: string[]
  mustHaveNotes: string
  headerStyle: string
  footerElements: string
  accessibilityRequirements: string
  priorityDevices: string[]
  
  // Technical & Hosting
  hasExistingDomain: boolean
  existingDomain: string
  needHostingSetup: boolean
  needBusinessEmail: boolean
  thirdPartyIntegrations: string
  dataPrivacyRequirements: string
  needSSL: boolean
  
  // Maintenance & Future Plans
  postLaunchSupport: string[]
}

interface ProjectCreationFlowProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreated: (project: any) => void
}

const steps = [
  {
    id: 1,
    title: "Business & Contact Information",
    icon: Building2,
    description: "Tell us about your company and primary contact"
  },
  {
    id: 2,
    title: "Project Goals & Objectives", 
    icon: Target,
    description: "Define your website's purpose and target audience"
  },
  {
    id: 3,
    title: "Content & Features",
    icon: FileText,
    description: "Specify what content and functionality you need"
  },
  {
    id: 4,
    title: "Design & Branding",
    icon: Palette,
    description: "Share your design preferences and brand assets"
  },
  {
    id: 5,
    title: "Technical & Hosting",
    icon: Settings,
    description: "Configure technical requirements and hosting needs"
  },
  {
    id: 6,
    title: "Maintenance & Future Plans",
    icon: Wrench,
    description: "Plan for ongoing support and future development"
  }
]

export default function ProjectCreationFlow({ isOpen, onClose, onProjectCreated }: ProjectCreationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const [projectData, setProjectData] = useState<ProjectData>({
    companyName: "",
    primaryContactName: "",
    primaryContactRole: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    businessAddress: "",
    companyDescription: "",
    websitePurpose: [],
    businessGoals: "",
    primaryAudience: "",
    audienceDemographics: "",
    audiencePainPoints: "",
    competitor1Url: "",
    competitor1Notes: "",
    competitor2Url: "",
    competitor2Notes: "",
    competitor3Url: "",
    competitor3Notes: "",
    topLevelPages: "",
    nestedPages: "",
    coreFunctionality: [],
    otherIntegrations: "",
    contentSupply: "",
    needCopywriting: false,
    approximatePages: "",
    needSEO: false,
    existingAnalytics: "",
    needGoalTracking: false,
    hasLogo: false,
    logoFiles: "",
    colorPalette: "",
    brandFonts: "",
    designStyle: [],
    mustHaveNotes: "",
    headerStyle: "",
    footerElements: "",
    accessibilityRequirements: "",
    priorityDevices: [],
    hasExistingDomain: false,
    existingDomain: "",
    needHostingSetup: false,
    needBusinessEmail: false,
    thirdPartyIntegrations: "",
    dataPrivacyRequirements: "",
    needSSL: false,
    postLaunchSupport: []
  })

  const updateProjectData = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayToggle = (field: keyof ProjectData, value: string) => {
    const currentArray = projectData[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateProjectData(field, newArray)
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      console.error("User not authenticated")
      return
    }

    setIsSubmitting(true)
    try {
      const projectToSave = {
        user_id: user.id,
        company_name: projectData.companyName,
        project_name: projectData.companyName || "Untitled Project",
        primary_contact_name: projectData.primaryContactName,
        primary_contact_role: projectData.primaryContactRole,
        primary_contact_email: projectData.primaryContactEmail,
        primary_contact_phone: projectData.primaryContactPhone,
        business_address: projectData.businessAddress,
        company_description: projectData.companyDescription,
        website_purpose: projectData.websitePurpose,
        business_goals: projectData.businessGoals,
        primary_audience: projectData.primaryAudience,
        audience_demographics: projectData.audienceDemographics,
        audience_pain_points: projectData.audiencePainPoints,
        competitors: {
          competitor1: { url: projectData.competitor1Url, notes: projectData.competitor1Notes },
          competitor2: { url: projectData.competitor2Url, notes: projectData.competitor2Notes },
          competitor3: { url: projectData.competitor3Url, notes: projectData.competitor3Notes }
        },
        top_level_pages: projectData.topLevelPages,
        nested_pages: projectData.nestedPages,
        core_functionality: projectData.coreFunctionality,
        other_integrations: projectData.otherIntegrations,
        content_supply: projectData.contentSupply,
        need_copywriting: projectData.needCopywriting,
        approximate_pages: projectData.approximatePages,
        need_seo: projectData.needSEO,
        existing_analytics: projectData.existingAnalytics,
        need_goal_tracking: projectData.needGoalTracking,
        has_logo: projectData.hasLogo,
        logo_files: projectData.logoFiles,
        color_palette: projectData.colorPalette,
        brand_fonts: projectData.brandFonts,
        design_style: projectData.designStyle,
        must_have_notes: projectData.mustHaveNotes,
        header_style: projectData.headerStyle,
        footer_elements: projectData.footerElements,
        accessibility_requirements: projectData.accessibilityRequirements,
        priority_devices: projectData.priorityDevices,
        has_existing_domain: projectData.hasExistingDomain,
        existing_domain: projectData.existingDomain,
        need_hosting_setup: projectData.needHostingSetup,
        need_business_email: projectData.needBusinessEmail,
        third_party_integrations: projectData.thirdPartyIntegrations,
        data_privacy_requirements: projectData.dataPrivacyRequirements,
        need_ssl: projectData.needSSL,
        post_launch_support: projectData.postLaunchSupport,
        status: "planning",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('flowscape_users')
        .update({
          company: projectData.companyName,
          project_name: projectData.companyName || "Untitled Project",
          primary_contact_name: projectData.primaryContactName,
          primary_contact_role: projectData.primaryContactRole,
          primary_contact_email: projectData.primaryContactEmail,
          primary_contact_phone: projectData.primaryContactPhone,
          business_address: projectData.businessAddress,
          company_description: projectData.companyDescription,
          website_purpose_list: projectData.websitePurpose,
          business_goals: projectData.businessGoals,
          primary_audience: projectData.primaryAudience,
          audience_demographics: projectData.audienceDemographics,
          audience_pain_points: projectData.audiencePainPoints,
          competitors: {
            competitor1: { url: projectData.competitor1Url, notes: projectData.competitor1Notes },
            competitor2: { url: projectData.competitor2Url, notes: projectData.competitor2Notes },
            competitor3: { url: projectData.competitor3Url, notes: projectData.competitor3Notes }
          },
          top_level_pages: projectData.topLevelPages,
          nested_pages: projectData.nestedPages,
          core_functionality: projectData.coreFunctionality,
          other_integrations: projectData.otherIntegrations,
          content_supply: projectData.contentSupply,
          need_copywriting: projectData.needCopywriting,
          approximate_pages: projectData.approximatePages,
          need_seo: projectData.needSEO,
          existing_analytics: projectData.existingAnalytics,
          need_goal_tracking: projectData.needGoalTracking,
          has_logo: projectData.hasLogo,
          logo_files: projectData.logoFiles,
          color_palette: projectData.colorPalette,
          brand_fonts: projectData.brandFonts,
          design_style: projectData.designStyle,
          must_have_notes: projectData.mustHaveNotes,
          header_style: projectData.headerStyle,
          footer_elements: projectData.footerElements,
          accessibility_requirements: projectData.accessibilityRequirements,
          priority_devices: projectData.priorityDevices,
          has_existing_domain: projectData.hasExistingDomain,
          existing_domain: projectData.existingDomain,
          need_hosting_setup: projectData.needHostingSetup,
          need_business_email: projectData.needBusinessEmail,
          third_party_integrations: projectData.thirdPartyIntegrations,
          data_privacy_requirements: projectData.dataPrivacyRequirements,
          need_ssl: projectData.needSSL,
          post_launch_support: projectData.postLaunchSupport,
          project_status: "planning",
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error("Error creating project:", error)
        throw error
      }

      console.log("Project created successfully:", data)
      onProjectCreated(data)
      onClose()
      
      // Reset form
      setCurrentStep(1)
      setProjectData({
        companyName: "",
        primaryContactName: "",
        primaryContactRole: "",
        primaryContactEmail: "",
        primaryContactPhone: "",
        businessAddress: "",
        companyDescription: "",
        websitePurpose: [],
        businessGoals: "",
        primaryAudience: "",
        audienceDemographics: "",
        audiencePainPoints: "",
        competitor1Url: "",
        competitor1Notes: "",
        competitor2Url: "",
        competitor2Notes: "",
        competitor3Url: "",
        competitor3Notes: "",
        topLevelPages: "",
        nestedPages: "",
        coreFunctionality: [],
        otherIntegrations: "",
        contentSupply: "",
        needCopywriting: false,
        approximatePages: "",
        needSEO: false,
        existingAnalytics: "",
        needGoalTracking: false,
        hasLogo: false,
        logoFiles: "",
        colorPalette: "",
        brandFonts: "",
        designStyle: [],
        mustHaveNotes: "",
        headerStyle: "",
        footerElements: "",
        accessibilityRequirements: "",
        priorityDevices: [],
        hasExistingDomain: false,
        existingDomain: "",
        needHostingSetup: false,
        needBusinessEmail: false,
        thirdPartyIntegrations: "",
        dataPrivacyRequirements: "",
        needSSL: false,
        postLaunchSupport: []
      })

    } catch (error) {
      console.error("Error submitting project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company / Organization Name *</Label>
                <Input
                  id="companyName"
                  value={projectData.companyName}
                  onChange={(e) => updateProjectData('companyName', e.target.value)}
                  placeholder="Enter company name"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={projectData.businessAddress}
                  onChange={(e) => updateProjectData('businessAddress', e.target.value)}
                  placeholder="Enter business address"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Primary Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Name *</Label>
                  <Input
                    id="contactName"
                    value={projectData.primaryContactName}
                    onChange={(e) => updateProjectData('primaryContactName', e.target.value)}
                    placeholder="Contact person name"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactRole">Role/Title</Label>
                  <Input
                    id="contactRole"
                    value={projectData.primaryContactRole}
                    onChange={(e) => updateProjectData('primaryContactRole', e.target.value)}
                    placeholder="Job title or role"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={projectData.primaryContactEmail}
                    onChange={(e) => updateProjectData('primaryContactEmail', e.target.value)}
                    placeholder="email@company.com"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={projectData.primaryContactPhone}
                    onChange={(e) => updateProjectData('primaryContactPhone', e.target.value)}
                    placeholder="Phone number"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDescription">Brief Company Description</Label>
              <Textarea
                id="companyDescription"
                value={projectData.companyDescription}
                onChange={(e) => updateProjectData('companyDescription', e.target.value)}
                placeholder="What products or services do you offer? Who is your target audience?"
                className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
              />
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label>What is the main purpose of your new website? (Select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Showcase products/services",
                  "Generate leads or inquiries", 
                  "Sell products (e-commerce)",
                  "Provide information / resource hub"
                ].map((purpose) => (
                  <div key={purpose} className="flex items-center space-x-2">
                    <Checkbox
                      id={purpose}
                      checked={projectData.websitePurpose.includes(purpose)}
                      onCheckedChange={() => handleArrayToggle('websitePurpose', purpose)}
                    />
                    <Label htmlFor={purpose} className="text-sm text-gray-300">
                      {purpose}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessGoals">What business goals should the website achieve?</Label>
              <Textarea
                id="businessGoals"
                value={projectData.businessGoals}
                onChange={(e) => updateProjectData('businessGoals', e.target.value)}
                placeholder="e.g. increase sales by 20%, collect 50 new emails/month, reduce support calls"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryAudience">Who is your primary audience?</Label>
              <Input
                id="primaryAudience"
                value={projectData.primaryAudience}
                onChange={(e) => updateProjectData('primaryAudience', e.target.value)}
                placeholder="Describe your target audience"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demographics">Demographics (age, location, profession)</Label>
                <Textarea
                  id="demographics"
                  value={projectData.audienceDemographics}
                  onChange={(e) => updateProjectData('audienceDemographics', e.target.value)}
                  placeholder="Age, location, profession details"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="painPoints">Pain points or needs</Label>
                <Textarea
                  id="painPoints"
                  value={projectData.audiencePainPoints}
                  onChange={(e) => updateProjectData('audiencePainPoints', e.target.value)}
                  placeholder="What problems do they need solved?"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">List 2–3 competitor or inspiration sites</h4>
              {[1, 2, 3].map((num) => (
                <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`competitor${num}Url`}>URL {num}</Label>
                    <Input
                      id={`competitor${num}Url`}
                      value={projectData[`competitor${num}Url` as keyof ProjectData] as string}
                      onChange={(e) => updateProjectData(`competitor${num}Url` as keyof ProjectData, e.target.value)}
                      placeholder="https://example.com"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`competitor${num}Notes`}>What you like about it</Label>
                    <Input
                      id={`competitor${num}Notes`}
                      value={projectData[`competitor${num}Notes` as keyof ProjectData] as string}
                      onChange={(e) => updateProjectData(`competitor${num}Notes` as keyof ProjectData, e.target.value)}
                      placeholder="What appeals to you?"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Site Structure</h4>
              <div className="space-y-2">
                <Label htmlFor="topLevelPages">What top-level pages do you need?</Label>
                <Input
                  id="topLevelPages"
                  value={projectData.topLevelPages}
                  onChange={(e) => updateProjectData('topLevelPages', e.target.value)}
                  placeholder="e.g. Home, About, Services, Blog, Contact"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nestedPages">Any nested pages or unique sections?</Label>
                <Input
                  id="nestedPages"
                  value={projectData.nestedPages}
                  onChange={(e) => updateProjectData('nestedPages', e.target.value)}
                  placeholder="e.g. Team Bios, Case Studies"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Core Functionality</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Contact form",
                  "Newsletter signup",
                  "Blog / News module",
                  "E-commerce / Shopping cart",
                  "Booking or reservation system",
                  "Member login / gated content",
                  "Portfolio / Gallery",
                  "Live chat or chatbot"
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={projectData.coreFunctionality.includes(feature)}
                      onCheckedChange={() => handleArrayToggle('coreFunctionality', feature)}
                    />
                    <Label htmlFor={feature} className="text-sm text-gray-300">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherIntegrations">Other integrations (CRM, ERP, payment gateways)</Label>
                <Input
                  id="otherIntegrations"
                  value={projectData.otherIntegrations}
                  onChange={(e) => updateProjectData('otherIntegrations', e.target.value)}
                  placeholder="Specify any additional integrations needed"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Content Supply</h4>
              <div className="space-y-2">
                <Label htmlFor="contentSupply">Will you provide all text, images, videos and PDFs?</Label>
                <Input
                  id="contentSupply"
                  value={projectData.contentSupply}
                  onChange={(e) => updateProjectData('contentSupply', e.target.value)}
                  placeholder="Yes/No and details about what you can provide"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needCopywriting"
                  checked={projectData.needCopywriting}
                  onCheckedChange={(checked) => updateProjectData('needCopywriting', checked)}
                />
                <Label htmlFor="needCopywriting" className="text-sm text-gray-300">
                  Need copywriting or photography services?
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="approximatePages">Approximate number of pages or posts</Label>
                <Input
                  id="approximatePages"
                  value={projectData.approximatePages}
                  onChange={(e) => updateProjectData('approximatePages', e.target.value)}
                  placeholder="e.g. 5-10 pages"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">SEO & Analytics</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needSEO"
                  checked={projectData.needSEO}
                  onCheckedChange={(checked) => updateProjectData('needSEO', checked)}
                />
                <Label htmlFor="needSEO" className="text-sm text-gray-300">
                  Do you need keyword research / on-page SEO?
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="existingAnalytics">Do you have existing analytics (Google Analytics, Tag Manager)?</Label>
                <Input
                  id="existingAnalytics"
                  value={projectData.existingAnalytics}
                  onChange={(e) => updateProjectData('existingAnalytics', e.target.value)}
                  placeholder="Yes/No and which tools you use"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needGoalTracking"
                  checked={projectData.needGoalTracking}
                  onCheckedChange={(checked) => updateProjectData('needGoalTracking', checked)}
                />
                <Label htmlFor="needGoalTracking" className="text-sm text-gray-300">
                  Will you need goal tracking or conversion funnels set up?
                </Label>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Existing Brand Assets</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLogo"
                  checked={projectData.hasLogo}
                  onCheckedChange={(checked) => updateProjectData('hasLogo', checked)}
                />
                <Label htmlFor="hasLogo" className="text-sm text-gray-300">
                  I have logo files (AI, SVG, PNG)
                </Label>
              </div>
              {projectData.hasLogo && (
                <div className="space-y-2">
                  <Label htmlFor="logoFiles">Logo files description</Label>
                  <Input
                    id="logoFiles"
                    value={projectData.logoFiles}
                    onChange={(e) => updateProjectData('logoFiles', e.target.value)}
                    placeholder="Describe your logo files and formats"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="colorPalette">Color palette (hex codes)</Label>
                <Input
                  id="colorPalette"
                  value={projectData.colorPalette}
                  onChange={(e) => updateProjectData('colorPalette', e.target.value)}
                  placeholder="e.g. #FF0000, #00FF00, #0000FF"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandFonts">Brand fonts or typographic style guide</Label>
                <Input
                  id="brandFonts"
                  value={projectData.brandFonts}
                  onChange={(e) => updateProjectData('brandFonts', e.target.value)}
                  placeholder="Font names or style preferences"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Design Style & Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Clean / minimal",
                  "Bold / colorful",
                  "Corporate / professional",
                  "Playful / creative",
                  "Dark mode / high contrast"
                ].map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={style}
                      checked={projectData.designStyle.includes(style)}
                      onCheckedChange={() => handleArrayToggle('designStyle', style)}
                    />
                    <Label htmlFor={style} className="text-sm text-gray-300">
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mustHaveNotes">Any "must-have" look & feel notes</Label>
                <Textarea
                  id="mustHaveNotes"
                  value={projectData.mustHaveNotes}
                  onChange={(e) => updateProjectData('mustHaveNotes', e.target.value)}
                  placeholder="Specific design requirements or preferences"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Layout Inspirations</h4>
              <div className="space-y-2">
                <Label htmlFor="headerStyle">Header style (navigation, hero banner, slider, video)</Label>
                <Input
                  id="headerStyle"
                  value={projectData.headerStyle}
                  onChange={(e) => updateProjectData('headerStyle', e.target.value)}
                  placeholder="Describe preferred header layout"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerElements">Footer elements (links, socials, newsletter sign-up)</Label>
                <Input
                  id="footerElements"
                  value={projectData.footerElements}
                  onChange={(e) => updateProjectData('footerElements', e.target.value)}
                  placeholder="What should be included in the footer"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Accessibility & Responsiveness</h4>
              <div className="space-y-2">
                <Label htmlFor="accessibilityRequirements">Do you have any accessibility requirements (WCAG)?</Label>
                <Input
                  id="accessibilityRequirements"
                  value={projectData.accessibilityRequirements}
                  onChange={(e) => updateProjectData('accessibilityRequirements', e.target.value)}
                  placeholder="WCAG compliance level or specific requirements"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-3">
                <Label>Priority devices (select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["Mobile", "Tablet", "Desktop"].map((device) => (
                    <div key={device} className="flex items-center space-x-2">
                      <Checkbox
                        id={device}
                        checked={projectData.priorityDevices.includes(device)}
                        onCheckedChange={() => handleArrayToggle('priorityDevices', device)}
                      />
                      <Label htmlFor={device} className="text-sm text-gray-300">
                        {device}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Domain & Hosting</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasExistingDomain"
                  checked={projectData.hasExistingDomain}
                  onCheckedChange={(checked) => updateProjectData('hasExistingDomain', checked)}
                />
                <Label htmlFor="hasExistingDomain" className="text-sm text-gray-300">
                  Do you have an existing domain name?
                </Label>
              </div>
              {projectData.hasExistingDomain && (
                <div className="space-y-2">
                  <Label htmlFor="existingDomain">Existing domain</Label>
                  <Input
                    id="existingDomain"
                    value={projectData.existingDomain}
                    onChange={(e) => updateProjectData('existingDomain', e.target.value)}
                    placeholder="yourdomain.com"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needHostingSetup"
                  checked={projectData.needHostingSetup}
                  onCheckedChange={(checked) => updateProjectData('needHostingSetup', checked)}
                />
                <Label htmlFor="needHostingSetup" className="text-sm text-gray-300">
                  Do you need hosting setup?
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Email & Integrations</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needBusinessEmail"
                  checked={projectData.needBusinessEmail}
                  onCheckedChange={(checked) => updateProjectData('needBusinessEmail', checked)}
                />
                <Label htmlFor="needBusinessEmail" className="text-sm text-gray-300">
                  Will you use a business email (e.g. name@yourdomain.com)?
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thirdPartyIntegrations">Third-party integrations required</Label>
                <Input
                  id="thirdPartyIntegrations"
                  value={projectData.thirdPartyIntegrations}
                  onChange={(e) => updateProjectData('thirdPartyIntegrations', e.target.value)}
                  placeholder="Mailchimp, Salesforce, Stripe, Zapier, etc."
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Security & Compliance</h4>
              <div className="space-y-2">
                <Label htmlFor="dataPrivacyRequirements">Any data privacy requirements (GDPR, CCPA)?</Label>
                <Input
                  id="dataPrivacyRequirements"
                  value={projectData.dataPrivacyRequirements}
                  onChange={(e) => updateProjectData('dataPrivacyRequirements', e.target.value)}
                  placeholder="GDPR, CCPA, or other compliance requirements"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needSSL"
                  checked={projectData.needSSL}
                  onCheckedChange={(checked) => updateProjectData('needSSL', checked)}
                />
                <Label htmlFor="needSSL" className="text-sm text-gray-300">
                  SSL certificate needed?
                </Label>
              </div>
            </div>
          </motion.div>
        )

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Post-launch support</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Monthly updates & backups",
                  "Security monitoring",
                  "Content additions",
                  "Training for your team"
                ].map((support) => (
                  <div key={support} className="flex items-center space-x-2">
                    <Checkbox
                      id={support}
                      checked={projectData.postLaunchSupport.includes(support)}
                      onCheckedChange={() => handleArrayToggle('postLaunchSupport', support)}
                    />
                    <Label htmlFor={support} className="text-sm text-gray-300">
                      {support}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h4 className="text-lg font-medium text-white">Ready to Create Project</h4>
              </div>
              <p className="text-gray-300 mb-4">
                You've completed all the project requirements. We'll create your project with all the details you've provided.
              </p>
              <div className="text-sm text-gray-400">
                <p><strong>Company:</strong> {projectData.companyName || "Not specified"}</p>
                <p><strong>Contact:</strong> {projectData.primaryContactName || "Not specified"}</p>
                <p><strong>Purpose:</strong> {projectData.websitePurpose.join(", ") || "Not specified"}</p>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-stretch">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-gray-900 w-full overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              {(() => {
                const step = steps.find(s => s.id === currentStep);
                if (step) {
                  const Icon = step.icon;
                  return <Icon className="w-6 h-6 text-blue-400" />;
                }
                return null;
              })()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {steps.find(s => s.id === currentStep)?.title}
              </h2>
              <p className="text-sm text-gray-400">
                {steps.find(s => s.id === currentStep)?.description}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep} of {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800">
          <div className="max-w-4xl w-full mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? "Creating Project..." : "Create Project"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 