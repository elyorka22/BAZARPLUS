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
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Логирование для отладки (можно убрать в продакшене)
      console.log('Profile data:', profile)
      console.log('Profile error:', profileError)
      console.log('User ID:', user.id)

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        // Если профиль не найден, попробуем создать его с ролью client
        redirect('/client')
        return
      }

      const role = profile?.role || 'client'
      console.log('User role:', role)

      if (role === 'admin') {
        redirect('/admin')
      } else if (role === 'store') {
        redirect('/store')
      } else if (role === 'client') {
        redirect('/client')
      } else {
        redirect('/client')
      }
    } catch (profileError) {
      console.error('Exception fetching profile:', profileError)
      // If profile fetch fails, redirect to client page
      redirect('/client')
    }
  } catch (error) {
    // If any error occurs, allow access to client page
    redirect('/client')
  }
}

