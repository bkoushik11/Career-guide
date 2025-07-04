import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Enhanced validation with better error messages
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined. Please add it to your .env file with a valid Supabase URL like: VITE_SUPABASE_URL=https://your-project-id.supabase.co')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined. Please add it to your .env file with your Supabase anonymous key.')
}

// Clean the URL - remove any whitespace or quotes
const cleanUrl = supabaseUrl.trim().replace(/^["']|["']$/g, '')

// Validate URL format with better error reporting
let validatedUrl: string
try {
  const urlObj = new URL(cleanUrl)
  validatedUrl = urlObj.toString()
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: "${cleanUrl}". Please ensure it's a complete URL starting with https:// like https://your-project-id.supabase.co`)
}

// Validate that the URL looks like a Supabase URL
if (!validatedUrl.includes('supabase.co') && !validatedUrl.includes('localhost')) {
  console.warn(`VITE_SUPABASE_URL "${validatedUrl}" does not appear to be a valid Supabase URL. Expected format: https://your-project-id.supabase.co`)
}

// Create Supabase client with additional options to handle CORS and connection issues
export const supabase = createClient(validatedUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  // Add retry logic for failed requests
  db: {
    schema: 'public',
  },
  // Configure realtime options
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Test the connection and provide helpful error messages
supabase.from('resumes').select('count', { count: 'exact', head: true }).then(
  () => {
    console.log('✅ Supabase connection successful')
  }
).catch((error) => {
  console.error('❌ Supabase connection failed:', error.message)
  console.error('Please check:')
  console.error('1. Your VITE_SUPABASE_URL is correct:', validatedUrl)
  console.error('2. Your VITE_SUPABASE_ANON_KEY is valid')
  console.error('3. Your Supabase project is active and accessible')
  console.error('4. Row Level Security policies are properly configured')
})