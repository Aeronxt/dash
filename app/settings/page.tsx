"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Search,
  ChevronRight
} from "lucide-react"

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Profile",
      description: "Manage your personal information and preferences",
      icon: User,
      items: ["Personal Information", "Profile Picture", "Display Name"]
    },
    {
      title: "Notifications",
      description: "Configure how you receive updates and alerts",
      icon: Bell,
      items: ["Email Notifications", "Push Notifications", "SMS Alerts"]
    },
    {
      title: "Security",
      description: "Protect your account and manage privacy settings",
      icon: Shield,
      items: ["Two-Factor Authentication", "Password", "Privacy Settings"]
    },
    {
      title: "Appearance",
      description: "Customize the look and feel of your workspace",
      icon: Palette,
      items: ["Theme", "Language", "Font Size"]
    },
    {
      title: "Account",
      description: "Billing, subscription, and account management",
      icon: CreditCard,
      items: ["Billing Information", "Subscription", "Account Deletion"]
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {settingsSections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg font-medium mb-1">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {section.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {section.items.map((item, itemIndex) => (
                            <span 
                              key={itemIndex}
                              className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20 mt-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 bg-blue-600/20 rounded-full mb-6">
              <SettingsIcon className="w-8 h-8 text-blue-400" />
            </div>
            <CardTitle className="text-lg font-semibold text-white mb-2">
              Settings Configuration Coming Soon
            </CardTitle>
            <CardDescription className="text-gray-400 text-center max-w-md">
              We're working hard to bring you comprehensive settings management. 
              Advanced configuration options will be available in the next update.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 