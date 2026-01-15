'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Save, MessageSquare } from 'lucide-react'

interface BotButton {
  id: string
  text: string
  action: string | null
  order_index: number
  is_active: boolean
  store_id: string
}

export function StoreBotManagementTab() {
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [botButtons, setBotButtons] = useState<BotButton[]>([])
  const [loading, setLoading] = useState(true)
  const [showButtonForm, setShowButtonForm] = useState(false)
  const [editingButton, setEditingButton] = useState<BotButton | null>(null)
  const [buttonForm, setButtonForm] = useState({
    text: '',
    action: '',
    order_index: 0,
    is_active: true,
  })
  const [storeId, setStoreId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get store
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!store) {
        setLoading(false)
        return
      }

      setStoreId(store.id)

      // Load welcome message for store
      const { data: welcomeData } = await supabase
        .from('bot_settings')
        .select('*')
        .eq('key', `store_${store.id}_welcome_message`)
        .single()

      if (welcomeData) {
        setWelcomeMessage(welcomeData.value)
      }

      // Load bot buttons for store (we'll use a custom table or extend bot_buttons)
      // For now, we'll use bot_buttons with store_id filter
      const { data: buttonsData } = await supabase
        .from('bot_buttons')
        .select('*')
        .eq('store_id', store.id)
        .order('order_index', { ascending: true })

      if (buttonsData) {
        setBotButtons(buttonsData as BotButton[])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveWelcomeMessage() {
    if (!storeId) return
    
    try {
      const supabase = createClient()
      
      const { data: existing } = await supabase
        .from('bot_settings')
        .select('id')
        .eq('key', `store_${storeId}_welcome_message`)
        .single()

      if (existing) {
        await supabase
          .from('bot_settings')
          .update({ value: welcomeMessage })
          .eq('key', `store_${storeId}_welcome_message`)
      } else {
        await supabase
          .from('bot_settings')
          .insert({
            key: `store_${storeId}_welcome_message`,
            value: welcomeMessage,
            description: `Do'kon ${storeId} uchun xush kelibsiz xabari`,
          })
      }
      
      alert('Xabar saqlandi')
    } catch (error) {
      alert('Xabarni saqlashda xatolik')
    }
  }

  function openButtonForm(button?: BotButton) {
    if (button) {
      setEditingButton(button)
      setButtonForm({
        text: button.text,
        action: button.action || '',
        order_index: button.order_index,
        is_active: button.is_active,
      })
    } else {
      setEditingButton(null)
      setButtonForm({
        text: '',
        action: '',
        order_index: botButtons.length,
        is_active: true,
      })
    }
    setShowButtonForm(true)
  }

  async function saveButton(e: React.FormEvent) {
    e.preventDefault()
    if (!storeId) return

    try {
      const supabase = createClient()
      
      const buttonData = {
        ...buttonForm,
        store_id: storeId,
      }

      if (editingButton) {
        await supabase
          .from('bot_buttons')
          .update(buttonData)
          .eq('id', editingButton.id)
      } else {
        await supabase.from('bot_buttons').insert(buttonData)
      }
      
      setShowButtonForm(false)
      loadData()
    } catch (error) {
      alert('Tugmani saqlashda xatolik')
    }
  }

  async function deleteButton(id: string) {
    if (!confirm('Tugmani o\'chirishni xohlaysizmi?')) return
    try {
      const supabase = createClient()
      await supabase.from('bot_buttons').delete().eq('id', id)
      loadData()
    } catch (error) {
      alert('Tugmani o\'chirishda xatolik')
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
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Xush kelibsiz xabari
        </h2>
        <div className="space-y-4">
          <textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Bot uchun xush kelibsiz xabarini kiriting..."
          />
          <button
            onClick={saveWelcomeMessage}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Xabarni saqlash
          </button>
        </div>
      </div>

      {/* Bot Buttons */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Bot tugmalari</h2>
          <button
            onClick={() => openButtonForm()}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tugma qo'shish
          </button>
        </div>

        <div className="space-y-3">
          {botButtons.map((button) => (
            <div key={button.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold">{button.text}</span>
                  <span className={`px-2 py-1 rounded text-xs ${button.is_active ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'}`}>
                    {button.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                  <span className="text-xs text-gray-500">Tartib: {button.order_index}</span>
                </div>
                {button.action && (
                  <p className="text-sm text-gray-600">Harakat: {button.action}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openButtonForm(button)}
                  className="bg-secondary-500 text-white px-3 py-1 rounded text-sm hover:opacity-90"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Tahrirlash
                </button>
                <button
                  onClick={() => deleteButton(button.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:opacity-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {botButtons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tugmalar yo'q. Birinchi tugmani qo'shing.
          </div>
        )}
      </div>

      {/* Button Form */}
      {showButtonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">{editingButton ? 'Tahrirlash' : 'Qo\'shish'} tugma</h3>
            <form onSubmit={saveButton} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tugma matni *</label>
                <input
                  type="text"
                  value={buttonForm.text}
                  onChange={(e) => setButtonForm({ ...buttonForm, text: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Masalan: Mahsulotlar katalogi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Harakat</label>
                <input
                  type="text"
                  value={buttonForm.action}
                  onChange={(e) => setButtonForm({ ...buttonForm, action: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Masalan: /catalog"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tartib</label>
                <input
                  type="number"
                  value={buttonForm.order_index}
                  onChange={(e) => setButtonForm({ ...buttonForm, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={buttonForm.is_active}
                    onChange={(e) => setButtonForm({ ...buttonForm, is_active: e.target.checked })}
                  />
                  Faol
                </label>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 rounded-lg font-semibold hover:opacity-90">
                  <Save className="w-4 h-4 inline mr-2" />
                  Saqlash
                </button>
                <button type="button" onClick={() => setShowButtonForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300">
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

