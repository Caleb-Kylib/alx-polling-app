'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

/**
 * RegisterFormShadcn Component
 * 
 * Purpose: Modern registration form using shadcn/ui components with validation
 * Features: Email, password, confirm password fields with validation
 * Usage: Imported by registration pages, ready for Supabase auth integration
 * 
 * TODO: Replace placeholder handlers with actual Supabase signUp calls
 */
export default function RegisterFormShadcn() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  const { register } = useAuth()

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required'
        return ''
        
      case 'email':
        if (!value) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
        return ''
      
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters long'
        return ''
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
        return ''
      
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSubmitError('')

    try {
      await register(formData.name, formData.email, formData.password)
      // Redirect will be handled by the auth context
    } catch (err) {
      setSubmitError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName: string): string => {
    return errors[fieldName] || ''
  }

  const hasFieldError = (fieldName: string): boolean => {
    return !!errors[fieldName]
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {submitError && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {submitError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`w-full ${hasFieldError('name') ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {hasFieldError('name') && (
                <p className="text-sm text-destructive">{getFieldError('name')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`w-full ${hasFieldError('email') ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {hasFieldError('email') && (
                <p className="text-sm text-destructive">{getFieldError('email')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`w-full ${hasFieldError('password') ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {hasFieldError('password') && (
                <p className="text-sm text-destructive">{getFieldError('password')}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`w-full ${hasFieldError('confirmPassword') ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {hasFieldError('confirmPassword') && (
                <p className="text-sm text-destructive">{getFieldError('confirmPassword')}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link 
                href="/auth/login-shadcn"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
