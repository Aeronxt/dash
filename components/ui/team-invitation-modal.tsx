"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { 
  X, 
  UserPlus, 
  Copy, 
  Check,
  Send
} from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/hooks/use-auth"

interface TeamInvitationModalProps {
  isOpen: boolean
  onClose: () => void
  onInvitationSent: (invitation: any) => void
}

export default function TeamInvitationModal({ isOpen, onClose, onInvitationSent }: TeamInvitationModalProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [invitationLink, setInvitationLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<"invite" | "success">("invite")
  
  const { user } = useAuth()

  const generateLinkCode = () => {
    // Generate a simple 8-character code with timestamp to ensure uniqueness
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const timestamp = Date.now().toString(36).slice(-4) // Last 4 chars of timestamp
    let result = timestamp
    
    // Add 4 more random characters
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleSendInvitation = async () => {
    
    if (!user) {
      console.error('No user found')
      alert('You must be logged in to send invitations')
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Starting invitation creation...')
      
      // Generate unique codes
      const invitationToken = generateLinkCode()
      const linkCode = generateLinkCode()
      
      console.log('Generated codes:', { invitationToken, linkCode })
      console.log('User ID:', user.id)

      // Prepare data for insertion
      const insertData = {
        invited_by: user.id,
        email: email.toLowerCase() || 'team-member@example.com',
        invitation_token: invitationToken,
        link_code: linkCode,
        role: role
        // Let the database handle expires_at with its default
      }

      console.log('Insert data:', insertData)

      // Create invitation record
      const { data: invitation, error } = await supabase
        .from('team_invitations')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error(error.message)
      }

      if (!invitation) {
        throw new Error('No invitation data returned')
      }

      console.log('Invitation created successfully:', invitation)

      // Generate invitation link
      const baseUrl = window.location.origin
      const inviteLink = `${baseUrl}/join/${linkCode}`
      setInvitationLink(inviteLink)
      
      // Call parent callback
      onInvitationSent(invitation)
      
      // Switch to success view
      setStep("success")

    } catch (error) {
      console.error('Error in handleSendInvitation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to create invitation: ${errorMessage}`)
    } finally {
      console.log('Setting loading to false')
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const resetModal = () => {
    setEmail("")
    setRole("member")
    setMessage("")
    setInvitationLink("")
    setStep("invite")
    setCopied(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {step === "invite" ? "Invite Team Member" : "Invitation Sent!"}
              </h2>
              <p className="text-sm text-gray-400">
                {step === "invite" ? "Add a new member to your team" : "Share the invitation link"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetModal}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === "invite" ? (
              <motion.div
                key="invite-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teammate@company.com (for reference only)"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-500">
                    The invitation link will work for anyone, regardless of email address
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I'd like to invite you to join our team..."
                    className="bg-gray-800 border-gray-700 text-white resize-none h-20"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetModal}
                    className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSendInvitation}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating Link...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Invitation Link
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Team Link Created!
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Share this link with {email || 'anyone you want'} to join your team
                  </p>
                </div>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-gray-300 mb-2 block">
                      Team Join Link
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={invitationLink}
                        readOnly
                        className="bg-gray-900 border-gray-600 text-white text-sm"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={copyToClipboard}
                        className={`min-w-[80px] ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This link expires in 7 days
                    </p>
                  </CardContent>
                </Card>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("invite")}
                    className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Invite Another
                  </Button>
                  <Button
                    type="button"
                    onClick={resetModal}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
} 