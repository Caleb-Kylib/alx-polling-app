# Shadcn/UI Login Form Integration Guide

This guide explains how to integrate the shadcn/ui login form with Supabase authentication.

## 🎯 What's Been Created

✅ **Complete shadcn/ui Component Library:**
- Button, Input, Label, Card components
- Proper TypeScript types and variants
- CSS variables for theming
- Utility functions (clsx, tailwind-merge)

✅ **Modern Login Form (`LoginFormShadcn.tsx`):**
- Clean, accessible design using shadcn/ui components
- Form validation and error handling
- Loading states with spinner animation
- Responsive layout with proper spacing

✅ **Placeholder Authentication Handlers:**
- Ready for Supabase integration
- Proper error handling structure
- Loading state management

## 🔧 Integration Steps

### Step 1: Install Dependencies

The necessary dependencies are already added to `package.json`:

```json
{
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-slot": "^1.0.2",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "lucide-react": "^0.294.0"
}
```

### Step 2: Replace Placeholder Handlers

In `components/LoginFormShadcn.tsx`, replace the placeholder `handleSubmit` function:

```typescript
// Remove this placeholder code:
// console.log('Login attempt:', formData)
// await new Promise(resolve => setTimeout(resolve, 1000))
// throw new Error('Authentication not yet implemented...')

// Replace with actual Supabase authentication:
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginFormShadcn() {
  const { login } = useAuth()
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      // Login successful - redirect handled by AuthContext
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  
  // ... rest of component
}
```

### Step 3: Use the Form in Your Pages

Replace the existing login form in your auth pages:

```typescript
// In app/auth/login/page.tsx
import LoginFormShadcn from '@/components/LoginFormShadcn'

export default function LoginPage() {
  return <LoginFormShadcn />
}
```

## 🎨 Component Features

### **Form Elements:**
- **Email Input**: Type="email" with validation
- **Password Input**: Type="password" with proper security
- **Submit Button**: Loading states and disabled states
- **Error Display**: Destructive styling for error messages

### **Accessibility:**
- Proper labels and form associations
- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management

### **Responsive Design:**
- Mobile-first approach
- Proper spacing and typography
- Card-based layout
- Consistent with shadcn/ui design system

## 🔐 Authentication Flow

1. **User Input**: Email and password fields
2. **Form Validation**: Client-side validation
3. **Submit Handler**: Calls Supabase auth
4. **Loading State**: Shows spinner and disables form
5. **Success**: Redirects to dashboard (handled by AuthContext)
6. **Error**: Displays error message with proper styling

## 🎯 Available Routes

- **Original Forms**: 
  - `/auth/login` (existing Tailwind login form)
  - `/auth/register` (existing Tailwind registration form)
- **New Shadcn Forms**: 
  - `/auth/login-shadcn` (new shadcn/ui login form)
  - `/auth/register-shadcn` (new shadcn/ui registration form)

## 🚀 Next Steps

1. **Test the Forms**: 
   - Visit `/auth/login-shadcn` to see the new login design
   - Visit `/auth/register-shadcn` to see the new registration design
2. **Integrate Supabase**: Replace placeholder handlers with real auth calls
3. **Customize Styling**: Modify CSS variables in `globals.css` for theming
4. **Add More Components**: Create profile forms, dashboard components, etc.

## 🎨 Customization

### **Theme Colors:**
Modify CSS variables in `globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;        /* Primary button color */
  --primary-foreground: 210 40% 98%;   /* Text on primary */
  --destructive: 0 84.2% 60.2%;        /* Error message color */
  --border: 214.3 31.8% 91.4%;        /* Input borders */
}
```

### **Component Variants:**
Use different button variants:

```typescript
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Save Draft</Button>
<Button variant="destructive">Delete</Button>
```

## 🔍 Troubleshooting

### **Common Issues:**

1. **Components not rendering:**
   - Check that all dependencies are installed
   - Verify CSS variables are loaded in `globals.css`

2. **Styling not applied:**
   - Ensure Tailwind config includes shadcn/ui colors
   - Check that CSS variables are properly defined

3. **TypeScript errors:**
   - Verify all component imports are correct
   - Check that utility functions are properly exported

## 📚 Resources

- **Shadcn/UI Documentation**: [ui.shadcn.com](https://ui.shadcn.com)
- **Radix UI**: [radix-ui.com](https://radix-ui.com)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

Your shadcn/ui login form is now ready! 🎉 It provides a modern, accessible, and customizable authentication experience that integrates seamlessly with your existing Supabase setup.
