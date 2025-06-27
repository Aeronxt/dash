"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Home as HomeIcon,
  BarChart3,
  Users,
  MessageSquare,
  Folder,
  Plus,
  Clock,
  Star,
  Activity
} from "lucide-react"

export default function HomePage() {
  const { userProfile } = useAuth()
  const [recentActivity] = useState([]) // Empty for now

  const quickActions = [
    {
      title: "Create Project",
      description: "Start a new project and organize your work",
      icon: Folder,
      color: "blue"
    },
    {
      title: "Invite Team",
      description: "Add team members to collaborate",
      icon: Users,
      color: "green"
    },
    {
      title: "Send Message",
      description: "Start a conversation with your team",
      icon: MessageSquare,
      color: "purple"
    },
    {
      title: "View Analytics",
      description: "Check your project insights",
      icon: BarChart3,
      color: "orange"
    }
  ]

  const stats = [
    { label: "Projects", value: "0", icon: Folder },
    { label: "Team Members", value: "0", icon: Users },
    { label: "Messages", value: "0", icon: MessageSquare }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Home{userProfile?.user_display_name ? `, ${userProfile.user_display_name}` : ''}
          </h1>
          <p className="text-gray-400">
            Your workspace overview and quick actions
          </p>
        </div>

        {/* Welcome Card with Stats */}
        <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-blue-600/20 rounded-full">
                <HomeIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Your Workspace</h2>
                <p className="text-gray-400">Everything you need in one place</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-black/20 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card 
                  key={index} 
                  className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer group hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg mb-4 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white text-lg font-medium mb-2 group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity - Empty State */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Recent Activity
          </h3>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-gray-800/50 rounded-full mb-6">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle className="text-lg font-semibold text-white mb-2">
                No recent activity
              </CardTitle>
              <CardDescription className="text-gray-400 text-center max-w-md mb-6">
                Start working on projects, collaborate with your team, or explore the platform 
                to see your activity here.
              </CardDescription>
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
                <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 