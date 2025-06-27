"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  MessageSquare, 
  MessageCircle,
  Search,
  Filter,
  Send,
  Clock,
  User
} from "lucide-react"

export default function MessagesPage() {
  const [conversations] = useState([]) // Empty array for now

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
            <p className="text-gray-400">
              Communicate with your team and collaborators
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Empty State */}
        {conversations.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-800/50 rounded-full mb-6">
                <MessageSquare className="w-12 h-12 text-gray-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white mb-2">
                No messages yet
              </CardTitle>
              <CardDescription className="text-gray-400 text-center max-w-md mb-6">
                Start a conversation with your team members. Share ideas, discuss projects, 
                and stay connected with real-time messaging.
              </CardDescription>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start your first conversation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Conversations List (when conversations exist) */}
        {conversations.length > 0 && (
          <div className="space-y-4">
            {conversations.map((conversation: any, index: number) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-400" />
                      </div>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-medium truncate">{conversation.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{conversation.lastMessage?.time}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm truncate mb-2">
                        {conversation.lastMessage?.text || "No messages yet"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {conversation.participants} participants
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 