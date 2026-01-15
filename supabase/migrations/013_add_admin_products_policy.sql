-- ============================================
-- ДОБАВИТЬ RLS ПОЛИТИКУ ДЛЯ АДМИНОВ НА УПРАВЛЕНИЕ ТОВАРАМИ
-- ============================================
-- 
-- Эта миграция добавляет политику, которая позволяет админам
-- создавать, обновлять и удалять товары во всех магазинах
--
-- ============================================

-- Добавить политику для админов на управление всеми товарами
DROP POLICY IF EXISTS "Admins can manage all products" ON products;
CREATE POLICY "Admins can manage all products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Также добавить политику для админов на просмотр всех товаров (включая неактивные)
DROP POLICY IF EXISTS "Admins can view all products" ON products;
CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

