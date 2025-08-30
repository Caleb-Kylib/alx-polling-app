'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

/**
 * User interface defining the structure of user data
 */
interface User {
  id: string
  name: string
  email: string
  createdAt: Date
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
  }, [])

  /**
   * Check if user is already authenticated (e.g., from localStorage or cookies)
   */
  const checkAuthStatus = async () => {
    try {
      // TODO: Implement actual authentication check
      // This could check localStorage, cookies, or make an API call
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle user login
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      // TODO: Implement actual login API call
      // For now, simulate successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        createdAt: new Date()
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      router.push('/dashboard') // Redirect to dashboard after login
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle user registration
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      // TODO: Implement actual registration API call
      // For now, simulate successful registration
      const mockUser: User = {
        id: '1',
        name,
        email,
        createdAt: new Date()
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      router.push('/dashboard') // Redirect to dashboard after registration
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle user logout
   */
  const logout = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement actual logout API call
      setUser(null)
      localStorage.removeItem('user')
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
