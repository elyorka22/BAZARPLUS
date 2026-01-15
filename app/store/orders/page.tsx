'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/Navbar'
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react'

interface Order {
  id: string
  total_amount: number
  status: string
  delivery_address: string
  phone: string
  user_id: string | null
  guest_name: string | null
  guest_email: string | null
  created_at: string
  order_items: Array<{
    quantity: number
    price: number
    products: {
      name: string
      store_id: string
    }
  }>
}

export default function StoreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!store) {
      setLoading(false)
      return
    }

    const { data: allOrders } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          products (
            name,
            store_id
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (allOrders) {
      const storeOrders = allOrders.filter((order: any) =>
        order.order_items.some((item: any) => item.products?.store_id === store.id)
      )
      setOrders(storeOrders as Order[])
    }
    setLoading(false)
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = createClient()
    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    loadOrders()
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
        return 'Новый'
      case 'processing':
        return 'Готовится'
      case 'delivering':
        return 'Доставляется'
      case 'completed':
        return 'Завершен'
      case 'cancelled':
        return 'Отменен'
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
          Do'kon buyurtmalari
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Нет заказов</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const storeItems = order.order_items.filter(
                (item: any) => item.products?.store_id
              )
              const storeTotal = storeItems.reduce(
                (sum: number, item: any) => sum + item.price * item.quantity,
                0
              )

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(order.status)}
                        <span className="font-bold text-lg">Заказ #{order.id.slice(0, 8)}</span>
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
                        {storeTotal} so'm
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    {order.guest_name && order.guest_email ? (
                      <>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Клиент (гость):</strong> {order.guest_name}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Email:</strong> {order.guest_email}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Клиент:</strong> Зарегистрированный пользователь
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Адрес:</strong> {order.delivery_address}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Телефон:</strong> {order.phone}
                    </p>
                    <div>
                      <p className="text-sm font-semibold mb-2">Товары:</p>
                      <ul className="space-y-1">
                        {storeItems.map((item: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600">
                            {item.products.name} × {item.quantity} = {item.quantity * item.price} so'm
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        className="flex-1 bg-accent-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                      >
                        Принять в работу
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                      >
                        Отменить
                      </button>
                    </div>
                  )}

                  {order.status === 'processing' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivering')}
                        className="flex-1 bg-secondary-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                      >
                        Отправить на доставку
                      </button>
                    </div>
                  )}

                  {order.status === 'delivering' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="flex-1 bg-success-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                      >
                        Завершить заказ
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

