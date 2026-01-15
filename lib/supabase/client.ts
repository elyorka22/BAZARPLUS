import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client that will fail gracefully
    // This allows the app to work without Supabase configured
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({ data: null, error: null }),
          gt: () => ({ data: null, error: null }),
          in: () => ({ data: null, error: null }),
          single: async () => ({ data: null, error: null }),
        }),
        insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        update: () => ({
          eq: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        }),
        delete: () => ({
          eq: async () => ({ data: null, error: null }),
        }),
      }),
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

