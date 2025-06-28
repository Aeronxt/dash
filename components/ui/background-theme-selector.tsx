"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBackgroundTheme, BACKGROUND_THEMES } from "@/components/theme-provider"
import { Check, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function BackgroundThemeSelector() {
  const { backgroundTheme, setBackgroundTheme, saveBackgroundTheme } = useBackgroundTheme()
  const [selectedTheme, setSelectedTheme] = useState(backgroundTheme)
  const [saving, setSaving] = useState(false)
  const [initializing, setInitializing] = useState(true)

  // Sync selected theme with current background theme and handle initialization
  useEffect(() => {
    console.log('BackgroundThemeSelector: backgroundTheme changed to:', backgroundTheme)
    setSelectedTheme(backgroundTheme)
    setInitializing(false)
  }, [backgroundTheme])

  const handleThemeSelect = (themeId: string) => {
    console.log('Theme selected:', themeId)
    setSelectedTheme(themeId)
    setBackgroundTheme(themeId) // Preview immediately
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('Saving theme:', selectedTheme)
      await saveBackgroundTheme(selectedTheme)
      toast({
        title: "Background theme saved",
        description: `Your ${BACKGROUND_THEMES.find(t => t.id === selectedTheme)?.name || selectedTheme} theme has been saved successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error saving theme",
        description: "Failed to save your background theme preference. Please try again.",
        variant: "destructive",
      })
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = selectedTheme !== backgroundTheme

  if (initializing) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-gray-400">Loading themes...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white text-lg font-medium">
          Background Theme
        </CardTitle>
        <CardDescription className="text-gray-400">
          Choose a background theme for your workspace. Changes are previewed immediately and persist across sessions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Theme Info */}
        <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
          <p className="text-sm text-blue-400">
            Current theme: <span className="font-medium">{BACKGROUND_THEMES.find(t => t.id === backgroundTheme)?.name || backgroundTheme}</span>
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BACKGROUND_THEMES.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                selectedTheme === theme.id
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Preview */}
              <div
                className="aspect-video rounded-md overflow-hidden bg-gray-800"
                style={{
                  background: theme.preview,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Selected indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="bg-blue-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Theme name */}
              <div className="p-3 text-center">
                <p className="text-sm font-medium text-white">{theme.name}</p>
                {theme.id === backgroundTheme && (
                  <p className="text-xs text-blue-400 mt-1">Active</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Theme'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 