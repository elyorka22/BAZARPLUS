'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/Navbar'
import { Package, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Order {
  id: string
  total_amount: number
  status: string
  delivery_address: string
  phone: string
  created_at: string
  order_items: Array<{
    quantity: number
    price: number
    products: {
      name: string
    }
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          products (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data as Order[])
    }
    setLoading(false)
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-accent-500" />
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'pending':
        return 'Ko\'rib chiqilmoqda'
      case 'processing':
        return 'Tayyorlanmoqda'
      case 'delivering':
        return 'Yetkazilmoqda'
      case 'completed':
        return 'Yakunlangan'
      case 'cancelled':
        return 'Bekor qilingan'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Mening buyurtmalarim
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Hozircha buyurtmalaringiz yo'q</p>
            <a href="/client" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Katalogga o'tish
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(order.status)}
                      <span className="font-bold text-lg">Buyurtma #{order.id.slice(0, 8)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                      {getStatusText(order.status)}
                    </span>
                    <p className="text-2xl font-bold text-primary-600 mt-2">
                      {order.total_amount} so'm
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Manzil:</strong> {order.delivery_address}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Telefon:</strong> {order.phone}
                  </p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Mahsulotlar:</p>
                    <ul className="space-y-1">
                      {order.order_items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          {item.products.name} × {item.quantity} = {item.quantity * item.price} so'm
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

