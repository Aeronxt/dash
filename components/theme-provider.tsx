"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { supabase } from "@/lib/supabaseClient"

// Background theme options
export const BACKGROUND_THEMES = [
  {
    id: 'default',
    name: 'Default',
    url: null,
    preview: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
  },
  {
    id: 'blue-rays',
    name: 'Blue Rays',
    url: 'https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/theme//BlueRays2001.jpeg',
    preview: 'url(https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/theme//BlueRays2001.jpeg)'
  },
  {
    id: 'moon',
    name: 'Moon',
    url: 'https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/theme//Moon2011.png',
    preview: 'url(https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/theme//Moon2011.png)'
  },
  {
    id: 'syntone',
    name: 'Syntone',
    url: 'https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/theme//Syntone2024.jpg',
    preview: 'url(https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/theme//Syntone2024.jpg)'
  }
]

interface BackgroundThemeContextType {
  backgroundTheme: string
  setBackgroundTheme: (theme: string) => void
  saveBackgroundTheme: (theme: string) => Promise<void>
}

const BackgroundThemeContext = createContext<BackgroundThemeContextType>({
  backgroundTheme: 'moon',
  setBackgroundTheme: () => {},
  saveBackgroundTheme: async () => {}
})

export const useBackgroundTheme = () => {
  const context = useContext(BackgroundThemeContext)
  if (!context) {
    throw new Error('useBackgroundTheme must be used within a BackgroundThemeProvider')
  }
  return context
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [backgroundTheme, setBackgroundThemeState] = useState('moon')
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setCurrentUser(session.user)
          await loadBackgroundTheme(session.user)
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null)
          // Reset to moon theme when user signs out
          setBackgroundThemeState('moon')
          setIsLoaded(true)
        }
      }
    )

    // Also check current session on mount
    const checkCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setCurrentUser(session.user)
        await loadBackgroundTheme(session.user)
      } else {
        setIsLoaded(true)
      }
    }

    checkCurrentSession()

    return () => subscription.unsubscribe()
  }, [])

  // Load user's background theme preference
  const loadBackgroundTheme = async (user: any) => {
    try {
      console.log('Loading background theme for user:', user.id)
      
      const { data, error } = await supabase
        .from('flowscape_users')
        .select('preferences')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user preferences:', error)
        // If there's an error, still set to moon and mark as loaded
        setBackgroundThemeState('moon')
      } else if (data?.preferences?.backgroundTheme) {
        console.log('Found saved background theme:', data.preferences.backgroundTheme)
        // Validate that the theme exists in our available themes
        const isValidTheme = BACKGROUND_THEMES.some(theme => theme.id === data.preferences.backgroundTheme)
        if (isValidTheme) {
          setBackgroundThemeState(data.preferences.backgroundTheme)
        } else {
          console.warn('Invalid background theme found:', data.preferences.backgroundTheme, 'using moon')
          setBackgroundThemeState('moon')
        }
      } else {
        console.log('No saved background theme found, using moon')
        setBackgroundThemeState('moon')
      }
    } catch (error) {
      console.error('Error loading background theme:', error)
      setBackgroundThemeState('moon')
    } finally {
      setIsLoaded(true)
    }
  }

  // Apply background theme to body and html
  useEffect(() => {
    if (!isLoaded) return

    console.log('Applying background theme:', backgroundTheme)
    const theme = BACKGROUND_THEMES.find(t => t.id === backgroundTheme)
    const body = document.body
    const html = document.documentElement

    // Remove existing background classes and styles
    body.className = body.className
      .split(' ')
      .filter(cls => !cls.startsWith('bg-'))
      .join(' ')

    // Clear all background styles
    body.style.background = ''
    body.style.backgroundImage = ''
    body.style.backgroundSize = ''
    body.style.backgroundPosition = ''
    body.style.backgroundRepeat = ''
    body.style.backgroundAttachment = ''
    html.style.background = ''
    html.style.backgroundImage = ''
    html.style.backgroundSize = ''
    html.style.backgroundPosition = ''
    html.style.backgroundRepeat = ''
    html.style.backgroundAttachment = ''

    if (theme?.url) {
      console.log('Applying custom background image:', theme.url)
      // Apply custom background image to both html and body
      const backgroundStyles = {
        backgroundImage: `url(${theme.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }
      
      Object.assign(html.style, backgroundStyles)
      Object.assign(body.style, backgroundStyles)
      
      // Add overlay for better readability
      body.style.position = 'relative'
      
      // Create or update overlay
      let overlay = document.getElementById('background-overlay')
      if (!overlay) {
        overlay = document.createElement('div')
        overlay.id = 'background-overlay'
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          pointer-events: none;
          z-index: -1;
        `
        body.appendChild(overlay)
      }
    } else {
      console.log('Applying default background gradient')
      // Apply default dark gradient
      const defaultBackground = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      html.style.background = defaultBackground
      body.style.background = defaultBackground
      
      // Remove overlay if it exists
      const overlay = document.getElementById('background-overlay')
      if (overlay) {
        overlay.remove()
      }
    }
  }, [backgroundTheme, isLoaded])

  const setBackgroundTheme = (theme: string) => {
    setBackgroundThemeState(theme)
  }

  const saveBackgroundTheme = async (theme: string) => {
    try {
      if (!currentUser) {
        console.error('No user logged in, cannot save theme')
        return
      }

      console.log('Saving background theme:', theme, 'for user:', currentUser.id)

      // Get current preferences
      const { data: currentUserData } = await supabase
        .from('flowscape_users')
        .select('preferences')
        .eq('id', currentUser.id)
        .single()

      const currentPreferences = currentUserData?.preferences || {}

      // Update preferences with new background theme
      const { error } = await supabase
        .from('flowscape_users')
        .update({
          preferences: {
            ...currentPreferences,
            backgroundTheme: theme
          }
        })
        .eq('id', currentUser.id)

      if (error) {
        console.error('Error saving background theme:', error)
        throw error
      }

      console.log('Background theme saved successfully')
      setBackgroundThemeState(theme)
    } catch (error) {
      console.error('Error saving background theme:', error)
      throw error
    }
  }

  return (
    <NextThemesProvider {...props}>
      <BackgroundThemeContext.Provider value={{
        backgroundTheme,
        setBackgroundTheme,
        saveBackgroundTheme
      }}>
        {children}
      </BackgroundThemeContext.Provider>
    </NextThemesProvider>
  )
}