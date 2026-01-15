'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { BarChart3, ShoppingBag, MessageSquare } from 'lucide-react'
import { StatisticsTab } from '../components/StatisticsTab'
import { OrdersManagementTab } from '../components/OrdersManagementTab'
import { StoreBotManagementTab } from '../components/StoreBotManagementTab'

type TabType = 'statistics' | 'orders' | 'bot'

export default function StoreAdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('statistics')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent flex items-center gap-3">
          <BarChart3 className="w-10 h-10" />
          Do'kon boshqaruv paneli
        </h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'statistics'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Statistika
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Buyurtmalarni boshqarish
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
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'statistics' && <StatisticsTab />}
          {activeTab === 'orders' && <OrdersManagementTab />}
          {activeTab === 'bot' && <StoreBotManagementTab />}
        </div>
      </div>
    </div>
  )
}

