'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  id: string
  image_url: string | null
  title: string
  description: string | null
  link_url: string | null
  position: string
  is_active: boolean
  order_index: number
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBanners()
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  async function loadBanners() {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(10)

      if (data && data.length > 0) {
        // Filter banners with image_url
        const bannersWithImages = data.filter((banner: any) => banner.image_url)
        setBanners(bannersWithImages as Banner[])
      }
    } catch (error) {
      console.error('Error loading banners:', error)
    } finally {
      setLoading(false)
    }
  }

  function goToSlide(index: number) {
    setCurrentIndex(index)
  }

  function nextSlide() {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  function prevSlide() {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (loading) {
    return (
      <div className="w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-xl animate-pulse mb-6"></div>
    )
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <div className="relative w-full mb-6 group">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full">
              {banner.link_url ? (
                <a
                  href={banner.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary-200 to-secondary-200 flex items-center justify-center">
                        <span className="text-gray-400">Banner</span>
                      </div>
                    )}
                    {(banner.title || banner.description) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
                        {banner.title && (
                          <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                            {banner.title}
                          </h3>
                        )}
                        {banner.description && (
                          <p className="text-white/90 text-sm sm:text-base mt-1">
                            {banner.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </a>
              ) : (
                <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary-200 to-secondary-200 flex items-center justify-center">
                      <span className="text-gray-400">Banner</span>
                    </div>
                  )}
                  {(banner.title || banner.description) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
                      {banner.title && (
                        <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                          {banner.title}
                        </h3>
                      )}
                      {banner.description && (
                        <p className="text-white/90 text-sm sm:text-base mt-1">
                          {banner.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Oldingi"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Keyingi"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

