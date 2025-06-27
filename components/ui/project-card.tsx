"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Folder, 
  Calendar, 
  User, 
  Building2,
  Globe,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  project: {
    id: string
    project_name: string
    company_name: string
    status: string
    created_at: string
    primary_contact_name?: string
    website_purpose?: string[]
    priority_devices?: string[]
  }
  onClick?: () => void
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'on-hold':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card 
      className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:shadow-blue-500/10"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Folder className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-white text-base font-medium truncate">
                {project.project_name || project.company_name}
              </CardTitle>
              {project.company_name && project.project_name !== project.company_name && (
                <p className="text-sm text-gray-400 truncate mt-1">
                  {project.company_name}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation()
              // Add menu actions here
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusColor(project.status)}`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(project.created_at)}
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-2">
          {project.primary_contact_name && (
            <div className="flex items-center text-sm text-gray-400">
              <User className="w-3 h-3 mr-2" />
              <span className="truncate">{project.primary_contact_name}</span>
            </div>
          )}
          
          {project.website_purpose && project.website_purpose.length > 0 && (
            <div className="flex items-center text-sm text-gray-400">
              <Globe className="w-3 h-3 mr-2" />
              <span className="truncate">
                {project.website_purpose.slice(0, 2).join(", ")}
                {project.website_purpose.length > 2 && ` +${project.website_purpose.length - 2}`}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {project.priority_devices && project.priority_devices.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.priority_devices.slice(0, 3).map((device) => (
              <Badge
                key={device}
                variant="secondary"
                className="text-xs bg-gray-800 text-gray-300 border-gray-700"
              >
                {device}
              </Badge>
            ))}
            {project.priority_devices.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-800 text-gray-300 border-gray-700"
              >
                +{project.priority_devices.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 