'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { CartProvider } from './cart-context'

type UserRole = 'client' | 'store' | 'admin' | null

interface UserContextType {
  user: User | null
  role: UserRole
  loading: boolean
  setUser: (user: User | null) => void
  setRole: (role: UserRole) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  role: null,
  loading: true,
  setUser: () => {},
  setRole: () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const supabase = createClient()
      
      supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
        setUser(user)
        if (user) {
          fetchUserRole(user.id)
        } else {
          setLoading(false)
        }
      }).catch(() => {
        setLoading(false)
      })

      supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        const user = session?.user ?? null
        setUser(user)
        if (user) {
          fetchUserRole(user.id)
        } else {
          setRole(null)
          setLoading(false)
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }, [])

  async function fetchUserRole(userId: string) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single()

      // Логирование для отладки
      console.log('Fetching role for user:', userId)
      console.log('Profile data:', data)
      console.log('Profile error:', error)

      if (error || !data) {
        console.warn('Profile not found or error, defaulting to client role')
        setRole('client')
      } else {
        console.log('User role set to:', data.role)
        setRole(data.role as UserRole)
      }
    } catch (error) {
      console.error('Exception fetching role:', error)
      setRole('client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, role, loading, setUser, setRole }}>
      <CartProvider>
        {children}
      </CartProvider>
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}

