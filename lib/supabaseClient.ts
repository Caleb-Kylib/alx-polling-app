import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client Configuration
 * 
 * Purpose: Centralized Supabase client initialization for the entire application
 * Features: Environment-based configuration, TypeScript support, error handling
 * Usage: Import this client in any component or API route that needs database access
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 */

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    'Missing Supabase environment variables. Please check your .env.local file. Using placeholder values for development.'
  )
}

/**
 * Create and export the Supabase client instance
 * 
 * This client is configured with:
 * - Your project URL and anonymous key
 * - Automatic error handling
 * - TypeScript support for your database schema
 * 
 * You can extend this with additional options like:
 * - auth.autoRefreshToken
 * - auth.persistSession
 * - realtime configuration
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Automatically refresh the token when it expires
    autoRefreshToken: true,
    // Persist the session in localStorage
    persistSession: true,
    // Detect session in URL (useful for OAuth flows)
    detectSessionInUrl: true
  },
  // Enable real-time subscriptions
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

/**
 * Helper function to get the current user
 * Useful for checking authentication status
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Helper function to get the current session
 * Useful for checking if user is authenticated
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting current session:', error)
    return null
  }
}

/**
 * Type definitions for your database schema
 * 
 * TODO: Generate these types from your Supabase database using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 * 
 * Then import and use them like:
 * import type { Database } from '@/types/database'
 * export const supabase = createClient<Database>(...)
 */
export type Database = {
  // Your database schema types will go here
  // This is a placeholder - replace with actual generated types
}

// Export the client as default for convenience
export default supabase
