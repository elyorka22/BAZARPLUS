-- ============================================
-- ИСПРАВИТЬ ОШИБКИ 500 В SUPABASE
-- ============================================
-- 
-- Эта миграция исправляет проблемы с RLS политиками,
-- которые вызывают ошибки 500 при запросах
--
-- ============================================

-- ШАГ 1: Проверить, что таблицы существуют
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'banners', 'product_categories', 'products', 'cart_items')
ORDER BY table_name;

-- ШАГ 2: Проверить RLS политики для user_profiles
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- ШАГ 3: Исправить RLS политики для user_profiles
-- Убедиться, что пользователи могут читать свой профиль

-- Удалить старые политики (если есть проблемы)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Создать политику заново
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Убедиться, что политика для админов работает
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ШАГ 4: Проверить RLS политики для других таблиц

-- Banners
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'banners';
-- Если политики нет, создайте:
-- CREATE POLICY "Anyone can view active banners"
--   ON banners FOR SELECT
--   USING (is_active = true);

-- Product categories
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'product_categories';
-- Если политики нет, создайте:
-- CREATE POLICY "Anyone can view active categories"
--   ON product_categories FOR SELECT
--   USING (is_active = true);

-- Products
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'products';
-- Если политики нет, создайте:
-- CREATE POLICY "Anyone can view active products"
--   ON products FOR SELECT
--   USING (is_active = true);

-- Cart items
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'cart_items';
-- Если политики нет, создайте:
-- CREATE POLICY "Users can view their own cart items"
--   ON cart_items FOR SELECT
--   USING (auth.uid() = user_id);

-- ШАГ 5: Проверить, что профиль пользователя существует
SELECT 
  u.id,
  u.email,
  up.id as profile_id,
  up.role
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.id = '7304d1a3-7120-4702-9476-0628c6149039'::uuid;

-- Если профиль не существует, создайте его:
-- INSERT INTO public.user_profiles (id, email, name, role)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'name', 'User'), 'admin'
-- FROM auth.users
-- WHERE id = '7304d1a3-7120-4702-9476-0628c6149039'::uuid;

-- ШАГ 6: Временно отключить RLS для отладки (НЕ ДЛЯ ПРОДАКШЕНА!)
-- Раскомментируйте только для тестирования:
/*
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
*/

-- После отладки включите обратно:
/*
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
*/

