import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  user_role?: string;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  subscription_plan?: string;
  preferences?: any;
  website_purpose?: string;
  business_type?: string;
  features_needed?: string[];
  business_name?: string;
  user_country?: string;
  user_display_name?: string;
  onboarding_completed?: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (!isClient) return;

    // Safety check for supabase client
    if (!supabase || !supabase.auth) {
      console.error('Supabase client not properly initialized');
      setLoading(false);
      return;
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Try to fetch user profile, if it doesn't exist, create it
          const profileExists = await fetchUserProfile(session.user.id);
          if (!profileExists && session.user) {
            console.log('User profile not found, creating new profile...');
            await createOAuthUserProfile(session.user);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    let subscription: any;
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Check if this is a new OAuth user and create profile if needed
            if (event === 'SIGNED_IN' && session.user.app_metadata?.provider !== 'email') {
              await createOAuthUserProfile(session.user);
            }
            const profileExists = await fetchUserProfile(session.user.id);
            if (!profileExists && session.user) {
              console.log('User profile not found in auth listener, creating new profile...');
              await createOAuthUserProfile(session.user);
              await fetchUserProfile(session.user.id);
            }
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        }
      );
      subscription = authSubscription;
    } catch (error) {
      console.error('Error setting up auth state change listener:', error);
      setLoading(false);
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [isClient]);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      // Check if user is authenticated first
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || currentUser.id !== userId) {
        console.log('User not authenticated or ID mismatch, skipping profile fetch');
        return false;
      }

      const { data, error } = await supabase
        .from('flowscape_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If it's a 406 error, the user might not exist in flowscape.users yet
        if (error.code === 'PGRST116' || error.details?.includes('0 rows')) {
          console.log('User profile not found, will be created on next signup/signin');
        }
        return false;
      }

      console.log('User profile fetched successfully:', data);
      setUserProfile(data);
      return true;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return false;
    }
  };

  const createOAuthUserProfile = async (user: User) => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    try {
      // Check if user profile already exists
      const { data: existingProfile } = await supabase
        .from('flowscape_users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // User profile already exists, just update last_login
        await supabase
          .from('flowscape_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);
        return;
      }

      // Create new user profile for OAuth user
      const { error: profileError } = await supabase
        .from('flowscape_users')
        .insert([
          {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
            user_role: 'user',
            subscription_plan: 'free',
            is_active: true,
            last_login: new Date().toISOString(),
            preferences: {},
            onboarding_completed: false
          }
        ]);

      if (profileError) {
        console.error('Error creating OAuth user profile:', profileError);
      }
    } catch (error) {
      console.error('Error in createOAuthUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    if (!supabase || !supabase.auth) {
      return { data: null, error: new Error('Supabase client not available') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // If signup is successful and user is created, insert into public.flowscape_users
      if (data.user) {
        const { error: profileError } = await supabase
          .from('flowscape_users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: userData?.full_name || '',
              company: userData?.company || '',
              phone: userData?.phone || '',
              address: userData?.address || '',
              city: userData?.city || '',
              country: userData?.country || '',
              user_role: 'user',
              subscription_plan: 'free',
              is_active: true,
              preferences: {},
              onboarding_completed: false
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase || !supabase.auth) {
      return { data: null, error: new Error('Supabase client not available') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last_login in public.flowscape_users
      if (data.user) {
        await supabase
          .from('flowscape_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (!supabase || !supabase.auth) {
      return { error: new Error('Supabase client not available') };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase || !supabase.auth) {
      return { data: null, error: new Error('Supabase client not available') };
    }

    try {
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? 'https://dashboard.flowscape.xyz/'
        : `${window.location.origin}/`;
        
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  };

  const signInWithGitHub = async () => {
    if (!supabase || !supabase.auth) {
      return { data: null, error: new Error('Supabase client not available') };
    }

    try {
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? 'https://dashboard.flowscape.xyz/'
        : `${window.location.origin}/`;
        
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('GitHub sign in error:', error);
      return { data: null, error };
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase || !supabase.auth) {
      return { data: null, error: new Error('Supabase client not available') };
    }

    try {
      // Use production URL for password reset
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? 'https://dashboard.flowscape.xyz/auth/reset-password'
        : `${window.location.origin}/auth/reset-password`;
        
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { data: null, error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    console.log('[updatePassword] Starting password update');
    
    if (!supabase || !supabase.auth) {
      console.error('[updatePassword] Supabase client not available');
      return { error: new Error('Supabase client not available') };
    }

    try {
      // First check if user is authenticated
      console.log('[updatePassword] Checking user authentication...');
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('[updatePassword] Auth error:', authError);
        throw authError;
      }
      
      if (!currentUser) {
        console.error('[updatePassword] No user found');
        throw new Error('You must be logged in to update your password');
      }

      console.log('[updatePassword] User authenticated, updating password...');
      console.log('[updatePassword] User ID:', currentUser.id);
      
      // Update the password using Supabase auth
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      console.log('[updatePassword] Supabase response:', { data, error });

      if (error) {
        console.error('[updatePassword] Supabase error:', error);
        throw error;
      }
      
      console.log('[updatePassword] Password updated successfully');
      return { data, error: null };
    } catch (error: any) {
      console.error('[updatePassword] Caught error:', error);
      console.error('[updatePassword] Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
        statusText: error.statusText
      });
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabase) return { error: 'Supabase client not available' };

    try {
      console.log('🚀 [updateProfile] Starting profile update:', updates);
      
      // Get the current authenticated user directly from Supabase
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !currentUser) {
        console.error('❌ [updateProfile] Auth error:', authError);
        return { error: authError || new Error('No user logged in') };
      }

      console.log('✅ [updateProfile] User authenticated:', currentUser.id);

      const { error } = await supabase
        .from('flowscape_users')
        .update(updates)
        .eq('id', currentUser.id);

      if (error) {
        console.error('❌ [updateProfile] Database error:', error);
        throw error;
      }

      console.log('✅ [updateProfile] Database update successful');

      // Refresh user profile
      await fetchUserProfile(currentUser.id);
      
      console.log('🎉 [updateProfile] Profile update complete');
      return { error: null };
    } catch (error: any) {
      console.error('💥 [updateProfile] Update profile error:', error);
      return { error };
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return { completed: false, error: authError }
      }

      const { data, error } = await supabase
        .from('flowscape_users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (error) {
        return { completed: false, error }
      }

      return { completed: data?.onboarding_completed || false, error: null }
    } catch (error: any) {
      return { completed: false, error }
    }
  }

  const updateOnboardingData = async (onboardingData: {
    website_purpose: string
    business_type: string
    features_needed: string[]
    business_name: string
    user_country: string
    user_display_name: string
  }) => {
    console.log("🚀 [updateOnboardingData] Starting at:", new Date().toISOString())
    console.log("📋 [updateOnboardingData] Data to submit:", onboardingData)
    
    try {
      console.log("🔐 [updateOnboardingData] Getting authenticated user...")
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error("❌ [updateOnboardingData] Auth error:", authError)
        return { data: null, error: authError || new Error("No user found") }
      }

      console.log("✅ [updateOnboardingData] User authenticated:", user.id)

      console.log("💾 [updateOnboardingData] Starting database update...")
      const updateData = {
        ...onboardingData,
        onboarding_completed: true
      }
      console.log("📤 [updateOnboardingData] Update payload:", updateData)

      const { data, error } = await supabase
        .from('flowscape_users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single()

      console.log("📡 [updateOnboardingData] Database response received")

      if (error) {
        console.error("❌ [updateOnboardingData] Database error:", error)
        console.error("❌ [updateOnboardingData] Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        return { data: null, error }
      }

      console.log("✅ [updateOnboardingData] Database update successful:", data)
      
      console.log("🔄 [updateOnboardingData] Refreshing user profile...")
      if (user?.id) {
        await fetchUserProfile(user.id)
      }
      
      console.log("🎉 [updateOnboardingData] Complete at:", new Date().toISOString())
      return { data, error: null }
    } catch (error: any) {
      console.error("💥 [updateOnboardingData] Unexpected error:", error)
      console.error("💥 [updateOnboardingData] Error stack:", error.stack)
      return { data: null, error }
    }
  }

  return {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    updatePassword,
    updateProfile,
    fetchUserProfile,
    checkOnboardingStatus,
    updateOnboardingData,
  };
}; 