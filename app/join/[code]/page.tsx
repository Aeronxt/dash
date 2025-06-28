"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabaseClient"
import { 
  Users, 
  UserPlus, 
  Building2, 
  Mail,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

export default function JoinTeamPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [invitation, setInvitation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const validationAttempted = useRef(false)
  const joinAttempted = useRef(false)

  const code = params?.code as string

  useEffect(() => {
    if (code && !validationAttempted.current) {
      console.log('Starting validation for code:', code)
      validationAttempted.current = true
      validateInvitationCode()
    }
  }, [code]) // Only depend on code

  useEffect(() => {
    // If user is already logged in and we have a valid invitation, auto-join
    if (user && invitation && !joining && !error && !joinAttempted.current) {
      console.log('Auto-joining team for logged in user')
      joinAttempted.current = true
      handleJoinTeam()
    }
  }, [user, invitation]) // Don't include joining to avoid loops

  const validateInvitationCode = async () => {
    console.log('Validating invitation code:', code)
    
    if (!code) {
      console.log('No code provided')
      setError('Invalid invitation link.')
      setLoading(false)
      return
    }

    try {
      const { data: invitationData, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          invited_by:flowscape_users!team_invitations_invited_by_fkey(*)
        `)
        .eq('link_code', code)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single()

      console.log('Validation result:', { invitationData, error })

      if (error) {
        console.log('Database error:', error)
        if (error.code === 'PGRST116') {
          // No rows returned
          setError('This invitation link is invalid or has expired.')
        } else {
          setError('Failed to validate invitation. Please try again.')
        }
        return
      }

      if (!invitationData) {
        console.log('No invitation data returned')
        setError('This invitation link is invalid or has expired.')
        return
      }

      console.log('Setting invitation data:', invitationData)
      setInvitation(invitationData)
    } catch (error) {
      console.error('Error validating invitation:', error)
      setError('Failed to validate invitation. Please try again.')
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  const handleJoinTeam = async () => {
    if (!user || !invitation) {
      console.error('Missing user or invitation:', { user: !!user, invitation: !!invitation })
      return
    }

    console.log('Starting team join process...')
    console.log('User:', user.id)
    console.log('Invitation:', invitation)

    setJoining(true)
    try {
      // Get the team owner ID - invited_by is an object when joined
      const teamOwnerId = invitation.invited_by?.id || invitation.invited_by
      console.log('Team owner ID:', teamOwnerId)

      // Check if user is already a team member
      const { data: existingMember, error: existingMemberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_owner_id', teamOwnerId)
        .eq('member_id', user.id)
        .single()

      console.log('Existing member check:', { existingMember, existingMemberError })

      if (existingMember) {
        console.log('User is already a team member')
        setError('You are already a member of this team.')
        setJoining(false)
        return
      }

      // Update invitation status
      console.log('Updating invitation status...')
      const { error: updateError } = await supabase
        .from('team_invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          accepted_by: user.id
        })
        .eq('id', invitation.id)

      if (updateError) {
        console.error('Error updating invitation:', updateError)
        setError(`Failed to accept invitation: ${updateError.message}`)
        setJoining(false)
        return
      }

      console.log('Invitation updated successfully')

      // Prepare team member data
      const teamMemberData = {
        team_owner_id: teamOwnerId,
        member_id: user.id,
        role: invitation.role,
        invited_by: teamOwnerId
      }

      console.log('Inserting team member with data:', teamMemberData)

      // Add user to team_members table
      const { data: newMember, error: memberError } = await supabase
        .from('team_members')
        .insert([teamMemberData])
        .select()
        .single()

      if (memberError) {
        console.error('Error adding team member:', memberError)
        setError(`Failed to join team: ${memberError.message}`)
        setJoining(false)
        return
      }

      console.log('Team member added successfully:', newMember)

      // Update user's team_owner_id
      console.log('Updating user team_owner_id...')
      const { error: userUpdateError } = await supabase
        .from('flowscape_users')
        .update({ team_owner_id: teamOwnerId })
        .eq('id', user.id)

      if (userUpdateError) {
        console.error('Error updating user team_owner_id:', userUpdateError)
        // Don't fail the whole process for this, just log it
      } else {
        console.log('User team_owner_id updated successfully')
      }

      console.log('Team join completed successfully, redirecting...')
      // Redirect to dashboard
      router.push('/dashboard?joined=true')

    } catch (error) {
      console.error('Unexpected error joining team:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`An unexpected error occurred: ${errorMessage}`)
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <CardTitle className="text-xl text-white">Invalid Invitation</CardTitle>
            <CardDescription className="text-gray-400">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (joining) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Joining Team...</h2>
            <p className="text-gray-400 text-center">
              You&apos;re being added to the team. Please wait...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mt-4"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-white">Join Team Invitation</CardTitle>
          <CardDescription className="text-gray-400">
            You&apos;ve been invited to join a team on Flowscape
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">
                    {invitation?.invited_by?.company || invitation?.invited_by?.business_name || 'Team'}
                  </p>
                  <p className="text-gray-400 text-sm">Company</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">
                    {invitation?.invited_by?.full_name || invitation?.invited_by?.email}
                  </p>
                  <p className="text-gray-400 text-sm">Invited by</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium capitalize">{invitation?.role}</p>
                  <p className="text-gray-400 text-sm">Role</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {user ? (
            <div className="space-y-3">
              <p className="text-center text-gray-400 text-sm">
                Welcome back, {user.user_metadata?.full_name || user.email}!
              </p>
              <Button 
                onClick={handleJoinTeam}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={joining}
              >
                <Users className="w-4 h-4 mr-2" />
                Join Team
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-gray-400 text-sm">
                Create an account or sign in to join this team
              </p>
              <div className="space-y-2">
                <Link href={`/auth/signup?invite=${invitation?.link_code}`} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account & Join
                  </Button>
                </Link>
                <Link href={`/auth/signin?invite=${invitation?.link_code}`} className="block">
                  <Button variant="outline" className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">
                    Sign In & Join
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 