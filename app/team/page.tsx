"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SplitText from "@/components/ui/split-text"
import { 
  Plus, 
  Users, 
  UserPlus,
  Search,
  Filter,
  Mail,
  MoreHorizontal,
  Calendar,
  Shield,
  Clock,
  Copy
} from "lucide-react"
import TeamInvitationModal from "@/components/ui/team-invitation-modal"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/hooks/use-auth"

export default function TeamPage() {
  const { user } = useAuth()
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTeamData()
    }
  }, [user])

  const fetchTeamData = async () => {
    if (!user) return

    try {
      // Fetch team members
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select(`
          *,
          member:flowscape_users!team_members_member_id_fkey(*)
        `)
        .eq('team_owner_id', user.id)

      if (membersError) {
        console.error('Error fetching team members:', membersError)
      } else {
        setTeamMembers(members || [])
      }

      // Fetch pending invitations
      const { data: invites, error: invitesError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invited_by', user.id)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())

      if (invitesError) {
        console.error('Error fetching invitations:', invitesError)
      } else {
        setInvitations(invites || [])
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvitationSent = (newInvitation: any) => {
    setInvitations(prev => [...prev, newInvitation])
    setIsInviteModalOpen(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              <SplitText 
                text="Team"
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
              Manage your team members and collaboration
            </p>
          </div>
          <Button 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search team members..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Pending Invitations ({invitations.length})
              </CardTitle>
              <CardDescription className="text-gray-400">
                People you&apos;ve invited who haven&apos;t joined yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invitations.map((invitation: any) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-600/20 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-yellow-400" />
                      </div>
                                             <div>
                         <p className="text-white font-medium">{invitation.email}</p>
                         <p className="text-xs text-gray-400">
                           Invited {formatDate(invitation.created_at)} • Role: {invitation.role}
                         </p>
                         <p className="text-xs text-blue-400 font-mono">
                           /join/{invitation.link_code}
                         </p>
                       </div>
                    </div>
                                         <div className="flex items-center gap-2">
                       <div className="text-xs text-yellow-400 bg-yellow-800/20 px-2 py-1 rounded">
                         Pending
                       </div>
                       <Button
                         size="sm"
                         variant="ghost"
                         onClick={() => {
                           const link = `${window.location.origin}/join/${invitation.link_code}`
                           navigator.clipboard.writeText(link)
                         }}
                         className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                       >
                         <Copy className="w-3 h-3" />
                       </Button>
                     </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {teamMembers.length === 0 && invitations.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-800/50 rounded-full mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white mb-2">
                No team members yet
              </CardTitle>
              <CardDescription className="text-gray-400 text-center max-w-md mb-6">
                Start building your team by inviting members. Collaborate on projects, 
                share resources, and work together towards your goals.
              </CardDescription>
              <Button 
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite your first team member
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Team Members Grid (when members exist) */}
        {teamMembers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Team Members ({teamMembers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((teamMember: any, index: number) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-sm font-medium truncate">
                          {teamMember.member?.full_name || teamMember.member?.email?.split('@')[0]}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Shield className="w-3 h-3" />
                          <span className="truncate">{teamMember.role}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{teamMember.member?.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {formatDate(teamMember.joined_at)}</span>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-green-800 text-green-300">
                        Active
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Team Invitation Modal */}
        <TeamInvitationModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInvitationSent={handleInvitationSent}
        />
      </div>
    </div>
  )
} 