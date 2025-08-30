'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser, getCurrentSession } from '@/lib/supabaseClient'
import type { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * User interface defining the structure of user data
 * Extends Supabase User with additional profile information
 */
interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  // Add any additional profile fields you want to store
}

/**
 * Authentication context interface defining available methods and state
 */
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

/**
 * AuthContext - Provides authentication state and methods throughout the app
 * 
 * Purpose: Centralized authentication management for login, register, and logout
 * Features: User state management, authentication methods, loading states
 * Usage: Wraps the app and provides auth functionality to all components
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider component that wraps the app and provides authentication context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing user session on mount
  useEffect(() => {
    checkAuthStatus()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await handleUserSession(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Check if user is already authenticated from Supabase
   */
  const checkAuthStatus = async () => {
    try {
      const session = await getCurrentSession()
      if (session?.user) {
        await handleUserSession(session.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle user session and fetch profile data
   */
  const handleUserSession = async (supabaseUser: SupabaseUser) => {
    try {
      // Fetch additional profile data from your profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, created_at')
        .eq('id', supabaseUser.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching profile:', error)
      }

      const user: User = {
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.full_name || 'User',
        email: supabaseUser.email || '',
        createdAt: profile?.created_at ? new Date(profile.created_at) : new Date()
      }

      setUser(user)
    } catch (error) {
      console.error('Error handling user session:', error)
    }
  }

  /**
   * Handle user login with Supabase
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        await handleUserSession(data.user)
        router.push('/dashboard') // Redirect to dashboard after login
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle user registration with Supabase
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: name,
              email: email,
              created_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }

        await handleUserSession(data.user)
        router.push('/dashboard') // Redirect to dashboard after registration
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle user logout with Supabase
   */
  const logout = async () => {
    try {
      setIsLoading(true)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      router.push('/') // Redirect to home page after logout
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to use the authentication context
 * Throws error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
