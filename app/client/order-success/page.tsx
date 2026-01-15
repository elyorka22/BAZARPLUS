'use client'

import { Navbar } from '@/components/Navbar'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-success-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Buyurtma berildi!
            </h1>
            <p className="text-gray-600 mb-6">
              Buyurtmangiz uchun rahmat. Tasdiqlash uchun tez orada siz bilan bog'lanamiz.
            </p>
            <Link
              href="/client"
              className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Katalogga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

