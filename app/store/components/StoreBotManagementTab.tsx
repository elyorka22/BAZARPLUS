'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Bell, Info } from 'lucide-react'

export function StoreBotManagementTab() {
  const [telegramChatId, setTelegramChatId] = useState('')
  const [loading, setLoading] = useState(true)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Get store
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, telegram_chat_id')
        .eq('owner_id', user.id)
        .single()

      if (storeError) {
        console.error('Error loading store:', storeError)
        setLoading(false)
        return
      }

      if (!store) {
        setLoading(false)
        return
      }

      setStoreId(store.id)
      setTelegramChatId(store.telegram_chat_id || '')
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveTelegramChatId(e: React.FormEvent) {
    e.preventDefault()
    if (!storeId) return

    setSaving(true)
    try {
      const supabase = createClient()
      
      // Валидация chat_id (должен быть числом)
      const chatId = telegramChatId.trim()
      if (chatId && isNaN(Number(chatId))) {
        alert('Chat ID должен быть числом')
        setSaving(false)
        return
      }

      const { error } = await supabase
        .from('stores')
        .update({ telegram_chat_id: chatId || null })
        .eq('id', storeId)

      if (error) {
        alert('Xatolik: ' + error.message)
        setSaving(false)
        return
      }
      
      alert('Telegram Chat ID muvaffaqiyatli saqlandi!')
      loadData()
    } catch (error) {
      console.error('Error saving chat ID:', error)
      alert('Xatolik: ' + (error instanceof Error ? error.message : 'Noma\'lum xatolik'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Telegram Chat ID Settings */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Buyurtmalar haqida xabarnoma
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Qanday ishlaydi:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Telegram botga o'ting: <span className="font-mono bg-blue-100 px-1 rounded">@YourBotUsername</span></li>
                <li>Botga <span className="font-mono bg-blue-100 px-1 rounded">/start</span> yuboring</li>
                <li>Bot sizga Chat ID ni yuboradi</li>
                <li>Chat ID ni quyidagi maydonga kiriting</li>
                <li>Keyin siz yangi buyurtmalar haqida xabarnoma olasiz</li>
              </ol>
            </div>
          </div>
        </div>

        <form onSubmit={saveTelegramChatId} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Telegram Chat ID *
            </label>
            <input
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="Masalan: 123456789"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Chat ID ni olish uchun botga /start yuboring. Agar xabarnomalarni o'chirishni xohlasangiz, maydonni bo'sh qoldiring.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>

        {telegramChatId && (
          <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-800">
              ✅ Xabarnomalar faollashtirilgan. Chat ID: <span className="font-mono font-semibold">{telegramChatId}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
