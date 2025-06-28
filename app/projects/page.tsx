"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Folder, 
  FolderOpen,
  Search,
  Filter
} from "lucide-react"
import ProjectCreationFlow from "@/components/ui/project-creation-flow"
import ProjectCard from "@/components/ui/project-card"
import ProjectStatusModal from "@/components/ui/project-status-modal"
import SplitText from "@/components/ui/split-text"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/hooks/use-auth"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('flowscape_users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user project data:', error)
        setProjects([])
      } else {
        // If user has project data, create a project object
        if (data && data.project_name) {
          const projectData = {
            id: data.id,
            project_name: data.project_name,
            company_name: data.company || data.business_name,
            status: data.project_status || 'planning',
            created_at: data.created_at,
            primary_contact_name: data.primary_contact_name,
            website_purpose: data.website_purpose_list,
            priority_devices: data.priority_devices
          }
          setProjects([projectData])
        } else {
          setProjects([])
        }
      }
    } catch (error) {
      console.error('Error fetching user project data:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (updatedUserData: any) => {
    // Create project object from updated user data
    if (updatedUserData && updatedUserData.project_name) {
      const projectData = {
        id: updatedUserData.id,
        project_name: updatedUserData.project_name,
        company_name: updatedUserData.company || updatedUserData.business_name,
        status: updatedUserData.project_status || 'planning',
        created_at: updatedUserData.created_at,
        primary_contact_name: updatedUserData.primary_contact_name,
        website_purpose: updatedUserData.website_purpose_list,
        priority_devices: updatedUserData.priority_devices
      }
      setProjects([projectData])
    }
  }

  const handleProjectClick = (project: any) => {
    setSelectedProjectId(project.id)
    setIsModalOpen(true)
  }



  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              <SplitText 
                text="Projects"
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
              Manage and organize your projects
            </p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-6"></div>
              <CardTitle className="text-xl font-semibold text-white mb-2">
                Loading projects...
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Please wait while we fetch your projects.
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-800/50 rounded-full mb-6">
                <FolderOpen className="w-12 h-12 text-gray-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white mb-2">
                No projects yet
              </CardTitle>
              <CardDescription className="text-gray-400 text-center max-w-md mb-6">
                Get started by creating your first project. You can organize your work, 
                track progress, and collaborate with your team.
              </CardDescription>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your first project
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Projects Grid (when projects exist) */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project: any) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        )}

        {/* Project Creation Flow */}
        <ProjectCreationFlow
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onProjectCreated={handleProjectCreated}
        />

        {/* Project Status Modal */}
        {selectedProjectId && (
          <ProjectStatusModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedProjectId(null)
            }}
            projectId={selectedProjectId}
          />
        )}
      </div>
    </div>
  )
} 