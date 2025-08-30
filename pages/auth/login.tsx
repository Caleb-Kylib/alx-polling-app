import { useState } from 'react'
import LoginForm from '@/components/LoginForm'
import Head from 'next/head'

/**
 * Login Page
 * Purpose: Authentication login page using the existing LoginForm component
 * Features: Mock handlers for testing UI without Supabase integration
 * Usage: Access via /pages/auth/login route
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock login handler for testing UI without Supabase
  const handleMockLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Log form values to console for testing
      console.log('🔐 Mock Login Attempt:', { email, password })
      
      // Simulate successful login
      console.log('✅ Mock login successful - redirecting to dashboard...')
      
      // In a real app, this would redirect to dashboard
      // For now, just show success message
      alert('Mock login successful! Check console for details.')
      
    } catch (err) {
      console.error('❌ Mock login error:', err)
      setError('Mock login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - AI Polling App</title>
        <meta name="description" content="Sign in to your AI Polling App account" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access your polls and voting history
            </p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                🧪 <strong>Test Mode:</strong> This is a mock login form. 
                Check the browser console to see form data.
              </p>
            </div>
          </div>
          
          {/* Override the form's onSubmit to use our mock handler */}
          <div className="mt-8 space-y-6">
            <form 
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const email = formData.get('email') as string
                const password = formData.get('password') as string
                
                if (!email || !password) {
                  setError('Please fill in all fields')
                  return
                }
                
                await handleMockLogin(email, password)
              }}
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in (Mock)'
                  )}
                </button>
              </div>
            </form>
            
            <div className="text-center">
              <a 
                href="/pages/auth/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
