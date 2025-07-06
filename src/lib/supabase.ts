import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://')

if (!isConfigured) {
  console.warn('⚠️ Supabase is not configured. Please set up your environment variables:')
  console.warn('1. VITE_SUPABASE_URL - Your Supabase project URL (https://your-project-id.supabase.co)')
  console.warn('2. VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key')
  console.warn('The app will run in demo mode without database functionality.')
}

// Create a mock client or real client based on configuration
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
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
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : createClient('https://demo.supabase.co', 'demo-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })

// Test the connection only if properly configured
if (isConfigured) {
  supabase.from('resumes').select('count', { count: 'exact', head: true }).then(
    () => {
      console.log('✅ Supabase connection successful')
    }
  ).catch((error) => {
    console.error('❌ Supabase connection failed:', error.message)
    console.error('Please check:')
    console.error('1. Your VITE_SUPABASE_URL is correct:', supabaseUrl)
    console.error('2. Your VITE_SUPABASE_ANON_KEY is valid')
    console.error('3. Your Supabase project is active and accessible')
    console.error('4. Row Level Security policies are properly configured')
  })
}

// Export a flag to check if Supabase is configured
export const isSupabaseConfigured = isConfigured