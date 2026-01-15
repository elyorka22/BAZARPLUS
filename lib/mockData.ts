export interface MockProduct {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  store_name: string
  store_id: string
  stock: number
}

export const mockProducts: MockProduct[] = [
  {
    id: 'mock_1',
    name: 'Sariq banan',
    description: 'Tabiiy, shirin va mazali bananlar. Vitaminlar bilan to\'ldirilgan.',
    price: 25000,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    store_name: 'Fresh Market',
    store_id: 'store1',
    stock: 50,
  },
  {
    id: 'mock_2',
    name: 'Qizil olma',
    description: 'Yangi yig\'ilgan, xushbo\'y va shirin olmalar. Sog\'liq uchun foydali.',
    price: 18000,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    store_name: 'Fresh Market',
    store_id: 'store1',
    stock: 75,
  },
  {
    id: 'mock_3',
    name: 'Sabzi',
    description: 'Tabiiy sabzavot, ko\'z va teri uchun juda foydali.',
    price: 12000,
    image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    store_name: 'Vegetable Store',
    store_id: 'store2',
    stock: 100,
  },
  {
    id: 'mock_4',
    name: 'Pomidor',
    description: 'Yangi, sersuv va mazali pomidorlar. Salatlar uchun ideal.',
    price: 15000,
    image_url: 'https://images.unsplash.com/photo-1546094097-1c0c5e5a2d3b?w=400',
    store_name: 'Vegetable Store',
    store_id: 'store2',
    stock: 80,
  },
  {
    id: 'mock_5',
    name: 'Kartoshka',
    description: 'Yangi kartoshka, barcha taomlar uchun mos.',
    price: 8000,
    image_url: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400',
    store_name: 'Vegetable Store',
    store_id: 'store2',
    stock: 200,
  },
  {
    id: 'mock_6',
    name: 'Non',
    description: 'Yangi pishirilgan non, har kuni yangi.',
    price: 5000,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    store_name: 'Bakery Plus',
    store_id: 'store3',
    stock: 150,
  },
  {
    id: 'mock_7',
    name: 'Sut',
    description: 'Tabiiy sut, 1 litr. Sog\'liq uchun foydali.',
    price: 12000,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    store_name: 'Dairy Products',
    store_id: 'store4',
    stock: 60,
  },
  {
    id: 'mock_8',
    name: 'Tuxum',
    description: 'Fermerlik tuxumlari, 10 dona. Oqsil manbai.',
    price: 15000,
    image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    store_name: 'Dairy Products',
    store_id: 'store4',
    stock: 90,
  },
  {
    id: 'mock_9',
    name: 'Go\'sht',
    description: 'Yangi mol go\'shti, 1 kg. Sifatli va xavfsiz.',
    price: 85000,
    image_url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400',
    store_name: 'Meat Market',
    store_id: 'store5',
    stock: 30,
  },
  {
    id: 'mock_10',
    name: 'Tovuq go\'shti',
    description: 'Yangi tovuq go\'shti, 1 kg. Oqsil bilan boy.',
    price: 45000,
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    store_name: 'Meat Market',
    store_id: 'store5',
    stock: 40,
  },
  {
    id: 'mock_11',
    name: 'Baliq',
    description: 'Yangi baliq, 1 kg. Omega-3 bilan boy.',
    price: 65000,
    image_url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    store_name: 'Fish Market',
    store_id: 'store6',
    stock: 25,
  },
  {
    id: 'mock_12',
    name: 'Guruch',
    description: 'Oq guruch, 1 kg. O\'zbekiston guruchi.',
    price: 18000,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    store_name: 'Grocery Store',
    store_id: 'store7',
    stock: 120,
  },
]

