# Supabase Environment Variables Setup Guide

## 🚨 **Current Issue**
You're seeing this error: `"Missing Supabase environment variables. Please check your .env.local file. Using placeholder values for development."`

This happens because the `.env.local` file doesn't exist or has placeholder values.

## ✅ **Solution: Create .env.local File**

### Step 1: Create the File
Create a new file called `.env.local` in your project root directory (same level as `package.json`).

### Step 2: Add the Content
Copy and paste this content into your `.env.local` file:

```env
# Supabase Configuration
# Replace these placeholder values with your actual Supabase project credentials

# Your Supabase project URL
# Format: https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anonymous/public key
# Find this in your Supabase dashboard under Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service role key for server-side operations (keep secret!)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: Database connection string for direct database access
# DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## 🔍 **How to Find Your Supabase Credentials**

### 1. **Go to Your Supabase Dashboard**
- Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Sign in to your account

### 2. **Select Your Project**
- Click on your project from the dashboard
- If you don't have a project yet, create one first

### 3. **Get Your Project URL**
- Go to **Settings** → **API**
- Copy the **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
- Replace `https://your-project-id.supabase.co` in your `.env.local` file

### 4. **Get Your Anonymous Key**
- In the same **Settings** → **API** page
- Copy the **anon public** key (starts with `eyJ...`)
- Replace `your-anon-key-here` in your `.env.local` file

### 5. **Example of Real Values**
Your `.env.local` should look like this (with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2MjQwMCwiZXhwIjoyMDE0MzM4NDAwfQ.example-signature
```

## 🚀 **After Setting Up**

### 1. **Restart Your Development Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### 2. **Verify the Setup**
- The warning message should disappear
- Your auth forms should now work with Supabase
- Check the browser console - no more environment variable warnings

## 🌐 **Production Setup (Vercel)**

### 1. **Add Environment Variables to Vercel**
- Go to your Vercel dashboard
- Select your project
- Go to **Settings** → **Environment Variables**
- Add the same variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. **Redeploy**
- After adding the environment variables, redeploy your project
- Your production app will now have access to Supabase

## 🔒 **Security Notes**

- ✅ **Safe to commit**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to expose
- ❌ **Never commit**: `SUPABASE_SERVICE_ROLE_KEY` (if you use it) - keep this secret
- ✅ **Already ignored**: `.env.local` is in your `.gitignore` file

## 🧪 **Testing Your Setup**

1. **Create the `.env.local` file** with your real Supabase credentials
2. **Restart your dev server**: `npm run dev`
3. **Visit your app**: Go to `/auth/login` or `/auth/register`
4. **Try to register/login**: The forms should now work with Supabase
5. **Check console**: No more environment variable warnings

## 🆘 **Troubleshooting**

### Still seeing the warning?
- Make sure `.env.local` is in the project root (same level as `package.json`)
- Restart your development server completely
- Check that the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Getting Supabase errors?
- Verify your project URL and anon key are correct
- Make sure your Supabase project is active
- Check that you have the right permissions in your Supabase project

Your Supabase integration should work perfectly once you add the real credentials to `.env.local`!
