import { useState } from 'react'
import RegisterForm from '@/components/RegisterForm'
import Head from 'next/head'

/**
 * Register Page
 * Purpose: Authentication registration page using the existing RegisterForm component
 * Features: Mock handlers for testing UI without Supabase integration
 * Usage: Access via /pages/auth/register route
 */
export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock registration handler for testing UI without Supabase
  const handleMockRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Log form values to console for testing
      console.log('📝 Mock Registration Attempt:', { name, email, password })
      
      // Simulate successful registration
      console.log('✅ Mock registration successful - account created!')
      console.log('📧 Mock email verification sent to:', email)
      
      // In a real app, this would redirect to email verification or dashboard
      // For now, just show success message
      alert('Mock registration successful! Check console for details.')
      
    } catch (err) {
      console.error('❌ Mock registration error:', err)
      setError('Mock registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Register - AI Polling App</title>
        <meta name="description" content="Create your AI Polling App account" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join the community and start participating in polls
            </p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                🧪 <strong>Test Mode:</strong> This is a mock registration form. 
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
                const name = formData.get('name') as string
                const email = formData.get('email') as string
                const password = formData.get('password') as string
                const confirmPassword = formData.get('confirmPassword') as string
                
                if (!name || !email || !password || !confirmPassword) {
                  setError('Please fill in all fields')
                  return
                }
                
                if (password !== confirmPassword) {
                  setError('Passwords do not match')
                  return
                }
                
                if (password.length < 6) {
                  setError('Password must be at least 6 characters long')
                  return
                }
                
                await handleMockRegister(name, email, password)
              }}
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    disabled={isLoading}
                  />
                </div>
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
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
                      Creating account...
                    </>
                  ) : (
                    'Create account (Mock)'
                  )}
                </button>
              </div>
            </form>
            
            <div className="text-center">
              <a 
                href="/pages/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Already have an account? Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
