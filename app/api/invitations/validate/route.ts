import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  try {
    const { invitationToken, linkCode } = await req.json()

    if (!invitationToken && !linkCode) {
      return NextResponse.json(
        { error: 'Invitation token or link code is required' },
        { status: 400 }
      )
    }

    // Check if invitation exists and is valid
    let query = supabase
      .from('team_invitations')
      .select(`
        *,
        invited_by:flowscape_users!team_invitations_invited_by_fkey(*)
      `)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())

    if (linkCode) {
      query = query.eq('link_code', linkCode)
    } else {
      query = query.eq('invitation_token', invitationToken)
    }

    const { data: invitation, error } = await query.single()

    if (error || !invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        invitedBy: invitation.invited_by?.full_name || invitation.invited_by?.email,
        companyName: invitation.invited_by?.company_name || 'the team'
      }
    })

  } catch (error) {
    console.error('Error validating invitation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { invitationToken, linkCode, userId } = await req.json()

    if ((!invitationToken && !linkCode) || !userId) {
      return NextResponse.json(
        { error: 'Invitation token/link code and user ID are required' },
        { status: 400 }
      )
    }

    // Get invitation details
    let query = supabase
      .from('team_invitations')
      .select('*')
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())

    if (linkCode) {
      query = query.eq('link_code', linkCode)
    } else {
      query = query.eq('invitation_token', invitationToken)
    }

    const { data: invitation, error: inviteError } = await query.single()

    if (inviteError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      )
    }

    // Update invitation status
    const { error: updateError } = await supabase
      .from('team_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        accepted_by: userId
      })
      .eq('id', invitation.id)

    if (updateError) {
      console.error('Error updating invitation:', updateError)
      return NextResponse.json(
        { error: 'Failed to accept invitation' },
        { status: 500 }
      )
    }

    // Add user to team_members table
    const { error: memberError } = await supabase
      .from('team_members')
      .insert([
        {
          team_owner_id: invitation.invited_by,
          member_id: userId,
          role: invitation.role,
          invited_by: invitation.invited_by
        }
      ])

    if (memberError) {
      console.error('Error adding team member:', memberError)
    }

    // Update user's team_owner_id
    const { error: userUpdateError } = await supabase
      .from('flowscape_users')
      .update({ team_owner_id: invitation.invited_by })
      .eq('id', userId)

    if (userUpdateError) {
      console.error('Error updating user team_owner_id:', userUpdateError)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error accepting invitation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 