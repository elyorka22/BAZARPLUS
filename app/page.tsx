import { redirect } from 'next/navigation'

export default async function Home() {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, always redirect to client page (guest access)
  if (!supabaseUrl || !supabaseKey) {
    redirect('/client')
    return
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    // If error or no user, allow guest access
    if (error || !user) {
      redirect('/client')
      return
    }

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role || 'client'

      if (role === 'client') {
        redirect('/client')
      } else if (role === 'store') {
        redirect('/store')
      } else if (role === 'admin') {
        redirect('/admin')
      } else {
        redirect('/client')
      }
    } catch (profileError) {
      // If profile fetch fails, redirect to client page
      redirect('/client')
    }
  } catch (error) {
    // If any error occurs, allow access to client page
    redirect('/client')
  }
}

