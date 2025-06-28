"use client"

import { useState, useEffect, type MouseEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Target, 
  Users, 
  Palette, 
  Code, 
  Shield, 
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Calendar,
  Briefcase,
  FileText,
  Zap,
  Eye,
  Edit3
} from "lucide-react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from "framer-motion"
import Balancer from "react-wrap-balancer"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>
  "--y": MotionValue<string>
}

interface ProjectStatusModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

interface ProjectData {
  id: string
  project_name: string
  company: string
  business_name: string
  business_type: string
  project_status: string
  created_at: string
  updated_at: string
  primary_contact_name: string
  primary_contact_email: string
  primary_contact_phone: string
  primary_contact_role: string
  business_address: string
  company_description: string
  website_purpose_list: string[]
  business_goals: string
  primary_audience: string
  audience_demographics: string
  audience_pain_points: string
  competitors: any
  top_level_pages: string
  nested_pages: string
  core_functionality: string[]
  other_integrations: string
  content_supply: string
  need_copywriting: boolean
  approximate_pages: string
  need_seo: boolean
  existing_analytics: string
  need_goal_tracking: boolean
  has_logo: boolean
  logo_files: string
  color_palette: string
  brand_fonts: string
  design_style: string[]
  must_have_notes: string
  header_style: string
  footer_elements: string
  accessibility_requirements: string
  priority_devices: string[]
  has_existing_domain: boolean
  existing_domain: string
  need_hosting_setup: boolean
  need_business_email: boolean
  third_party_integrations: string
  data_privacy_requirements: string
  need_ssl: boolean
  post_launch_support: string[]
  subscription_plan: string
  is_active: boolean
  onboarding_completed: boolean
}

const statusOptions = [
  { value: 'planning', label: 'Planning', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock },
  { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Settings },
  { value: 'review', label: 'Under Review', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Eye },
  { value: 'completed', label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
  { value: 'on-hold', label: 'On Hold', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle }
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    const isSmall = window.matchMedia("(max-width: 768px)").matches
    const isMobileDevice = Boolean(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.exec(
        userAgent
      )
    )

    const isDev = process.env.NODE_ENV !== "production"
    if (isDev) setIsMobile(isSmall || isMobileDevice)

    setIsMobile(isSmall && isMobileDevice)
  }, [])

  return isMobile
}

function ProjectStatusCard({
  title,
  description,
  bgClass,
  children,
}: {
  title: string
  description: string
  bgClass?: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const isMobile = useIsMobile()

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      className="animated-cards relative w-full rounded-[16px]"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": useMotionTemplate`${mouseX}px`,
          "--y": useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-b from-neutral-900/90 to-stone-800 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90",
          "md:hover:border-transparent",
          bgClass
        )}
      >
        <div className="m-4 min-h-[600px] w-full">
          <div className="flex w-full flex-col gap-3 mb-4">
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              {title}
            </h2>
            <p className="text-sm leading-5 text-neutral-300 dark:text-zinc-400 sm:text-base sm:leading-5">
              <Balancer>{description}</Balancer>
            </p>
          </div>
          {mounted ? children : null}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectStatusModal({ isOpen, onClose, projectId }: ProjectStatusModalProps) {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectData()
    }
  }, [isOpen, projectId])

  const fetchProjectData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('flowscape_users')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) {
        console.error('Error fetching project data:', error)
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive"
        })
      } else {
        setProject(data)
      }
    } catch (error) {
      console.error('Error fetching project data:', error)
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'planning': return 10
      case 'in-progress': return 50
      case 'review': return 85
      case 'completed': return 100
      case 'on-hold': return 30
      case 'cancelled': return 0
      default: return 0
    }
  }

  const getCurrentStatus = () => {
    return statusOptions.find(s => s.value === project?.project_status) || statusOptions[0]
  }

  if (!project && !loading) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-transparent border-none p-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : project ? (
          <ProjectStatusCard
            title={project?.project_name || project?.business_name || "Project Details"}
            description={`${getCurrentStatus().label} • ${project.company || project.business_name || 'No company'}`}
          >
            <div className="space-y-6">
              {/* Status and Progress - Read Only */}
                             <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                 <h3 className="text-white text-lg font-semibold mb-3">Project Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getCurrentStatus().color}>
                      {getCurrentStatus().label}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      Progress: {getProgressPercentage(project.project_status)}%
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(project.project_status)} 
                    className="h-2"
                  />
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Edit3 className="w-4 h-4" />
                      Updated: {new Date(project.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Information Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                                 <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700/50">
                   <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white text-xs">Overview</TabsTrigger>
                   <TabsTrigger value="contact" className="text-gray-300 data-[state=active]:text-white text-xs">Contact</TabsTrigger>
                   <TabsTrigger value="technical" className="text-gray-300 data-[state=active]:text-white text-xs">Technical</TabsTrigger>
                   <TabsTrigger value="design" className="text-gray-300 data-[state=active]:text-white text-xs">Design</TabsTrigger>
                   <TabsTrigger value="deployment" className="text-gray-300 data-[state=active]:text-white text-xs">Deployment</TabsTrigger>
                 </TabsList>

                                  <TabsContent value="overview" className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                      <h4 className="text-white flex items-center gap-2 mb-3">
                        <Building2 className="w-5 h-5 text-blue-400" />
                        Business Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Company Name</p>
                          <p className="text-white">{project.company || project.business_name || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Business Type</p>
                          <p className="text-white">{project.business_type || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Description</p>
                          <p className="text-white text-sm">{project.company_description || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                      <h4 className="text-white flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-green-400" />
                        Project Goals
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Website Purpose</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.website_purpose_list?.map((purpose, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {purpose}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Business Goals</p>
                          <p className="text-white text-sm">{project.business_goals || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Target Audience</p>
                          <p className="text-white text-sm">{project.primary_audience || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                    <h4 className="text-white flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      Audience Analysis
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Demographics</p>
                        <p className="text-white text-sm">{project.audience_demographics || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Pain Points</p>
                        <p className="text-white text-sm">{project.audience_pain_points || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                    <h4 className="text-white flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-blue-400" />
                      Primary Contact
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Name</p>
                          <p className="text-white">{project.primary_contact_name || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Role</p>
                          <p className="text-white">{project.primary_contact_role || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Email</p>
                            <p className="text-white">{project.primary_contact_email || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Phone</p>
                            <p className="text-white">{project.primary_contact_phone || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Business Address</p>
                          <p className="text-white">{project.business_address || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                      <h4 className="text-white flex items-center gap-2 mb-3">
                        <Code className="w-5 h-5 text-green-400" />
                        Functionality
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Core Features</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.core_functionality?.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Approximate Pages</p>
                          <p className="text-white">{project.approximate_pages || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Top Level Pages</p>
                          <p className="text-white text-sm">{project.top_level_pages || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                      <h4 className="text-white flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Features & Services
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.need_copywriting ? 'bg-green-400' : 'bg-gray-600'}`} />
                            <span className="text-gray-300">Copywriting</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.need_seo ? 'bg-green-400' : 'bg-gray-600'}`} />
                            <span className="text-gray-300">SEO</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.need_goal_tracking ? 'bg-green-400' : 'bg-gray-600'}`} />
                            <span className="text-gray-300">Goal Tracking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.need_ssl ? 'bg-green-400' : 'bg-gray-600'}`} />
                            <span className="text-gray-300">SSL Certificate</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Analytics</p>
                          <p className="text-white text-sm">{project.existing_analytics || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Integrations</p>
                          <p className="text-white text-sm">{project.third_party_integrations || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                      <h4 className="text-white flex items-center gap-2 mb-3">
                        <Palette className="w-5 h-5 text-pink-400" />
                        Brand & Design
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.has_logo ? 'bg-green-400' : 'bg-gray-600'}`} />
                            <span className="text-gray-300">Has Logo</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Color Palette</p>
                          <p className="text-white text-sm">{project.color_palette || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Brand Fonts</p>
                          <p className="text-white text-sm">{project.brand_fonts || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Design Style</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.design_style?.map((style, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                      <h4 className="text-white flex items-center gap-2 mb-3">
                        <Settings className="w-5 h-5 text-gray-400" />
                        Layout & Structure
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Header Style</p>
                          <p className="text-white text-sm">{project.header_style || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Footer Elements</p>
                          <p className="text-white text-sm">{project.footer_elements || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Priority Devices</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.priority_devices?.map((device, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {device}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Accessibility</p>
                          <p className="text-white text-sm">{project.accessibility_requirements || 'Standard compliance'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                    <h4 className="text-white flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Special Notes
                    </h4>
                    <p className="text-white text-sm">{project.must_have_notes || 'No special requirements noted'}</p>
                  </div>
                </TabsContent>

                <TabsContent value="deployment" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                      <h4 className="text-white flex items-center gap-2 mb-3">
                        <Globe className="w-5 h-5 text-blue-400" />
                        Domain & Hosting
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.has_existing_domain ? 'bg-green-400' : 'bg-gray-600'}`} />
                            <span className="text-gray-300">Has Existing Domain</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.need_hosting_setup ? 'bg-green-400' : 'bg-gray-600'}`} />
                            <span className="text-gray-300">Needs Hosting Setup</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.need_business_email ? 'bg-green-400' : 'bg-gray-600'}`} />
                            <span className="text-gray-300">Needs Business Email</span>
                          </div>
                        </div>
                        {project.existing_domain && (
                          <div>
                            <p className="text-sm text-gray-400">Existing Domain</p>
                            <p className="text-white">{project.existing_domain}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                      <h4 className="text-white flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        Security & Privacy
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Data Privacy Requirements</p>
                          <p className="text-white text-sm">{project.data_privacy_requirements || 'Standard compliance'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Content Supply</p>
                          <p className="text-white text-sm">{project.content_supply || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
                    <h4 className="text-white flex items-center gap-2 mb-3">
                      <Settings className="w-5 h-5 text-purple-400" />
                      Post-Launch Support
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {project.post_launch_support?.map((support, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {support}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ProjectStatusCard>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}