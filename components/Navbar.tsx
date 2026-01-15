'use client'

import Link from 'next/link'
import { useUser } from '@/app/providers'
import { useCart } from '@/app/cart-context'
import { ShoppingCart, Store, User, LogOut, Home, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, role, loading } = useUser()
  const { cartCount } = useCart()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">BazarPlus</div>
            <div className="animate-pulse text-sm sm:text-base">Yuklanmoqda...</div>
          </div>
        </div>
      </nav>
    )
  }

  return (
      <nav className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold hover:opacity-80 transition">
            BazarPlus
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Cart icon - visible for all users */}
            {(role === 'client' || !user) && (
              <Link
                href="/client/checkout"
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:opacity-80 transition rounded-lg bg-white/20"
                aria-label="Savat"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-accent-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold shadow-lg">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <>
                {role === 'client' && (
                  <>
                    <Link
                      href="/client"
                      className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/20 text-sm sm:text-base"
                    >
                      <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden md:inline">Bosh sahifa</span>
                    </Link>
                    <Link
                      href="/client/orders"
                      className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/20 text-sm sm:text-base"
                    >
                      <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden md:inline">Buyurtmalar</span>
                    </Link>
                  </>
                )}
                {role === 'store' && (
                  <>
                    <Link
                      href="/store"
                      className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/20 text-sm sm:text-base"
                    >
                      <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden md:inline">Mahsulotlar</span>
                    </Link>
                    <Link
                      href="/store/admin"
                      className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/20 text-sm sm:text-base"
                    >
                      <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden md:inline">Boshqaruv</span>
                    </Link>
                  </>
                )}
                {role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/20 text-sm sm:text-base"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden md:inline">Admin panel</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/20 text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden md:inline">Chiqish</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-sm sm:text-base"
              >
                Kirish
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

