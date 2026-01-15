'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Image as ImageIcon, Save } from 'lucide-react'

interface Banner {
  id: string
  title: string
  description: string | null
  image_url: string | null
  link_url: string | null
  position: string
  is_active: boolean
  order_index: number
}

interface BecomeSellerPage {
  id: string
  title: string
  content: string
  image_url: string | null
  is_active: boolean
}

export function SiteSettingsTab() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [becomeSellerPage, setBecomeSellerPage] = useState<BecomeSellerPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBannerForm, setShowBannerForm] = useState(false)
  const [showSellerForm, setShowSellerForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    position: 'top' as 'top' | 'middle' | 'bottom',
    is_active: true,
    order_index: 0,
  })
  const [sellerForm, setSellerForm] = useState({
    title: '',
    content: '',
    image_url: '',
    is_active: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const supabase = createClient()
      
      const { data: bannersData } = await supabase
        .from('banners')
        .select('*')
        .order('order_index', { ascending: true })

      if (bannersData) {
        setBanners(bannersData)
      }

      const { data: sellerData } = await supabase
        .from('become_seller_page')
        .select('*')
        .single()

      if (sellerData) {
        setBecomeSellerPage(sellerData)
        setSellerForm({
          title: sellerData.title,
          content: sellerData.content,
          image_url: sellerData.image_url || '',
          is_active: sellerData.is_active,
        })
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function openBannerForm(banner?: Banner) {
    if (banner) {
      setEditingBanner(banner)
      setBannerForm({
        title: banner.title,
        description: banner.description || '',
        image_url: banner.image_url || '',
        link_url: banner.link_url || '',
        position: banner.position as 'top' | 'middle' | 'bottom',
        is_active: banner.is_active,
        order_index: banner.order_index,
      })
    } else {
      setEditingBanner(null)
      setBannerForm({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        position: 'top',
        is_active: true,
        order_index: banners.length,
      })
    }
    setShowBannerForm(true)
  }

  async function saveBanner(e: React.FormEvent) {
    e.preventDefault()
    try {
      const supabase = createClient()
      
      if (editingBanner) {
        await supabase
          .from('banners')
          .update(bannerForm)
          .eq('id', editingBanner.id)
      } else {
        await supabase.from('banners').insert(bannerForm)
      }
      
      setShowBannerForm(false)
      loadData()
    } catch (error) {
      alert('Ошибка сохранения баннера')
    }
  }

  async function deleteBanner(id: string) {
    if (!confirm('Удалить баннер?')) return
    try {
      const supabase = createClient()
      await supabase.from('banners').delete().eq('id', id)
      loadData()
    } catch (error) {
      alert('Ошибка удаления баннера')
    }
  }

  async function saveSellerPage(e: React.FormEvent) {
    e.preventDefault()
    try {
      const supabase = createClient()
      
      if (becomeSellerPage) {
        await supabase
          .from('become_seller_page')
          .update(sellerForm)
          .eq('id', becomeSellerPage.id)
      } else {
        await supabase.from('become_seller_page').insert(sellerForm)
      }
      
      setShowSellerForm(false)
      loadData()
    } catch (error) {
      alert('Ошибка сохранения страницы')
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
      {/* Баннеры */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Управление баннерами</h2>
          <button
            onClick={() => openBannerForm()}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить баннер
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="border rounded-lg p-4">
              <div className="mb-2">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title} className="w-full h-32 object-cover rounded" />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="font-bold mb-1">{banner.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs ${banner.is_active ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'}`}>
                  {banner.is_active ? 'Активен' : 'Неактивен'}
                </span>
                <span className="text-xs text-gray-500">Позиция: {banner.position}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openBannerForm(banner)}
                  className="flex-1 bg-secondary-500 text-white px-3 py-1 rounded text-sm hover:opacity-90"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Изменить
                </button>
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:opacity-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Страница "Стать продавцом" */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Страница "Стать продавцом"</h2>
          <button
            onClick={() => setShowSellerForm(true)}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <Edit className="w-5 h-5" />
            {becomeSellerPage ? 'Изменить' : 'Создать'}
          </button>
        </div>

        {becomeSellerPage && !showSellerForm && (
          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">{becomeSellerPage.title}</h3>
            {becomeSellerPage.image_url && (
              <img src={becomeSellerPage.image_url} alt={becomeSellerPage.title} className="w-full max-w-md h-48 object-cover rounded mb-4" />
            )}
            <p className="text-gray-700 whitespace-pre-line">{becomeSellerPage.content}</p>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded text-xs ${becomeSellerPage.is_active ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'}`}>
                {becomeSellerPage.is_active ? 'Активна' : 'Неактивна'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Форма баннера */}
      {showBannerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editingBanner ? 'Изменить' : 'Добавить'} баннер</h3>
            <form onSubmit={saveBanner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL изображения</label>
                <input
                  type="url"
                  value={bannerForm.image_url}
                  onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ссылка</label>
                <input
                  type="url"
                  value={bannerForm.link_url}
                  onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Позиция</label>
                <select
                  value={bannerForm.position}
                  onChange={(e) => setBannerForm({ ...bannerForm, position: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="top">Верх</option>
                  <option value="middle">Середина</option>
                  <option value="bottom">Низ</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bannerForm.is_active}
                    onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                  />
                  Активен
                </label>
                <div>
                  <label className="block text-sm font-medium mb-2">Порядок</label>
                  <input
                    type="number"
                    value={bannerForm.order_index}
                    onChange={(e) => setBannerForm({ ...bannerForm, order_index: parseInt(e.target.value) })}
                    className="w-24 px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 rounded-lg font-semibold hover:opacity-90">
                  <Save className="w-4 h-4 inline mr-2" />
                  Сохранить
                </button>
                <button type="button" onClick={() => setShowBannerForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Форма страницы "Стать продавцом" */}
      {showSellerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Редактировать страницу "Стать продавцом"</h3>
            <form onSubmit={saveSellerPage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Заголовок</label>
                <input
                  type="text"
                  value={sellerForm.title}
                  onChange={(e) => setSellerForm({ ...sellerForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL изображения</label>
                <input
                  type="url"
                  value={sellerForm.image_url}
                  onChange={(e) => setSellerForm({ ...sellerForm, image_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Содержание</label>
                <textarea
                  value={sellerForm.content}
                  onChange={(e) => setSellerForm({ ...sellerForm, content: e.target.value })}
                  required
                  rows={10}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sellerForm.is_active}
                    onChange={(e) => setSellerForm({ ...sellerForm, is_active: e.target.checked })}
                  />
                  Активна
                </label>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 rounded-lg font-semibold hover:opacity-90">
                  <Save className="w-4 h-4 inline mr-2" />
                  Сохранить
                </button>
                <button type="button" onClick={() => setShowSellerForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

