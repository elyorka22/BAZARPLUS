'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Shield, Settings, Package, MessageSquare, Store } from 'lucide-react'
import { SiteSettingsTab } from './components/SiteSettingsTab'
import { ProductsManagementTab } from './components/ProductsManagementTab'
import { BotManagementTab } from './components/BotManagementTab'
import { CreateStoreTab } from './components/CreateStoreTab'

type TabType = 'settings' | 'products' | 'bot' | 'create-store'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('settings')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent flex items-center gap-3">
          <Shield className="w-10 h-10" />
          Administrator paneli
        </h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Settings className="w-5 h-5" />
            Sayt sozlamalari
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Package className="w-5 h-5" />
            Mahsulotlarni boshqarish
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'bot'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Botni boshqarish
          </button>
          <button
            onClick={() => setActiveTab('create-store')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'create-store'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Store className="w-5 h-5" />
            Do'kon yaratish
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'settings' && <SiteSettingsTab />}
          {activeTab === 'products' && <ProductsManagementTab />}
          {activeTab === 'bot' && <BotManagementTab />}
          {activeTab === 'create-store' && <CreateStoreTab />}
        </div>
      </div>
    </div>
  )
}
