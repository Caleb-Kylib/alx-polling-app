# Supabase Setup Guide for AI Polling App

This guide will walk you through setting up Supabase with your Next.js project, including authentication, database setup, and environment configuration.

## 🚀 Step 1: Create a Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/sign in
2. **Click "New Project"**
3. **Choose your organization** (or create one)
4. **Enter project details:**
   - Name: `ai-polling-app` (or your preferred name)
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to your users
5. **Click "Create new project"**
6. **Wait for setup to complete** (usually 2-3 minutes)

## 🔑 Step 2: Get Your API Keys

1. **In your Supabase dashboard, go to Settings > API**
2. **Copy these values:**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: The long string under "anon public"
   - **service_role key**: The long string under "service_role" (keep this secret!)

## 📁 Step 3: Set Up Environment Variables

1. **Create a `.env.local` file** in your project root:
   ```bash
   # Copy from env.example
   cp env.example .env.local
   ```

2. **Edit `.env.local`** and add your actual values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

3. **Restart your development server** after adding environment variables

## 🗄️ Step 4: Set Up Database Schema

1. **In your Supabase dashboard, go to SQL Editor**
2. **Copy the contents of `supabase-setup.sql`**
3. **Paste and run the SQL** in the SQL Editor
4. **Verify the tables were created** in the Table Editor

## 🔐 Step 5: Configure Authentication

1. **Go to Authentication > Settings** in your Supabase dashboard
2. **Configure your site URL:**
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: `http://localhost:3000/auth/callback`
3. **Optional: Configure email templates** under Email Templates
4. **Optional: Set up OAuth providers** (Google, GitHub, etc.)

## 🧪 Step 6: Test the Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Test authentication:**
   - Go to `http://localhost:3000`
   - Try registering a new user
   - Check your Supabase dashboard for the new user

## 📊 Step 7: Generate TypeScript Types (Optional but Recommended)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Generate types:**
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
   ```

3. **Update `lib/supabaseClient.ts`:**
   ```typescript
   import type { Database } from '@/types/database'
   export const supabase = createClient<Database>(...)
   ```

## 🔧 Configuration Options

### Authentication Settings

You can customize authentication behavior in `lib/supabaseClient.ts`:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,        // Auto-refresh expired tokens
    persistSession: true,          // Save session in localStorage
    detectSessionInUrl: true,      // Detect auth in URL (OAuth)
    flowType: 'pkce'              // Use PKCE flow for security
  }
})
```

### Row Level Security (RLS)

The SQL setup includes RLS policies that:
- Users can only access their own profile data
- Anyone can view active polls
- Users can only create/update their own polls
- Users can only vote once per poll

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env.local` file exists
   - Verify variable names start with `NEXT_PUBLIC_`
   - Restart your dev server

2. **"Invalid API key"**
   - Double-check your anon key from Supabase dashboard
   - Ensure no extra spaces or characters

3. **"Table doesn't exist"**
   - Run the SQL setup script in Supabase SQL Editor
   - Check the Table Editor to verify tables were created

4. **Authentication not working**
   - Check your site URL in Supabase Auth settings
   - Verify redirect URLs are correct
   - Check browser console for errors

### Debug Mode

Enable debug logging in your Supabase client:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true  // Enable debug logging
  }
})
```

## 🔒 Security Best Practices

1. **Never expose your service_role key** in client-side code
2. **Use RLS policies** to control data access
3. **Validate user input** before sending to database
4. **Use HTTPS in production**
5. **Regularly rotate API keys**

## 📚 Next Steps

After setup, you can:

1. **Create custom authentication flows**
2. **Add real-time subscriptions** for live poll updates
3. **Implement file uploads** using Supabase Storage
4. **Add edge functions** for serverless backend logic
5. **Set up monitoring** and analytics

## 🆘 Need Help?

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Community Discord**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: Check existing issues or create new ones

---

Your Supabase setup is now complete! 🎉 You can start building your polling app with real authentication and database functionality.
