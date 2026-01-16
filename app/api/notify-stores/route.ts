import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint is called when an order is created
// It sends Telegram notifications to store owners

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get order details with store information
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          products (
            name,
            store_id,
            stores (
              name,
              telegram_chat_id
            )
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Error fetching order:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Group order items by store
    const storeOrders = new Map<string, { store: any; items: any[] }>()
    
    if (order.order_items && Array.isArray(order.order_items)) {
      for (const item of order.order_items) {
        const storeId = item.products?.store_id
        if (storeId) {
          if (!storeOrders.has(storeId)) {
            storeOrders.set(storeId, {
              store: item.products?.stores,
              items: []
            })
          }
          storeOrders.get(storeId)!.items.push(item)
        }
      }
    }

    // Send notifications via Telegram bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN not configured')
      return NextResponse.json({ error: 'Bot not configured' }, { status: 500 })
    }

    const notificationsSent: string[] = []

    for (const [storeId, { store, items }] of storeOrders.entries()) {
      const chatId = store?.telegram_chat_id

      if (!chatId) {
        console.log(`Store ${storeId} has no telegram_chat_id, skipping notification`)
        continue
      }

      // Calculate total for this store
      const storeTotal = items.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.price) * parseInt(item.quantity)), 0
      )
      
      // Build message
      const customerName = order.guest_name || 'Mijoz'
      const customerPhone = order.phone
      const deliveryAddress = order.delivery_address
      
      let message = `🛒 *Yangi buyurtma!*\n\n`
      message += `📦 Buyurtma ID: \`${orderId.substring(0, 8)}\`\n`
      message += `👤 Mijoz: ${customerName}\n`
      message += `📞 Telefon: ${customerPhone}\n`
      message += `📍 Manzil: ${deliveryAddress}\n\n`
      message += `*Mahsulotlar:*\n`
      
      for (const item of items) {
        const itemTotal = parseFloat(item.price) * parseInt(item.quantity)
        message += `• ${item.products?.name} - ${item.quantity} x ${item.price} so'm = ${itemTotal} so'm\n`
      }
      
      message += `\n💰 *Jami: ${storeTotal} so'm*\n`
      message += `📊 Holat: ${order.status}`

      try {
        // Send message via Telegram Bot API
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
        const response = await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        })

        if (response.ok) {
          notificationsSent.push(storeId)
          console.log(`Order notification sent to store ${storeId} (chat_id: ${chatId})`)
        } else {
          const errorData = await response.json()
          console.error(`Error sending notification to store ${storeId}:`, errorData)
        }
      } catch (error) {
        console.error(`Error sending notification to store ${storeId}:`, error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      notificationsSent: notificationsSent.length,
      stores: notificationsSent 
    })
  } catch (error) {
    console.error('Error in notify-stores API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

