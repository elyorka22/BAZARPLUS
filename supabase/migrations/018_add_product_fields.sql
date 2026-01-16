-- ============================================
-- ДОБАВИТЬ НОВЫЕ ПОЛЯ ДЛЯ ТОВАРОВ
-- ============================================
-- 
-- Эта миграция добавляет новые поля для управления товарами:
-- - package_type (вид упаковки: 1kg, 3kg, 5kg, 10kg)
-- - min_order (минимальный заказ)
-- - max_order (максимальный заказ)
-- - badge (надпись: top, discount, recommended)
-- - sale_type (как продается: by_kg, by_piece, by_package)
--
-- ============================================

-- Добавить поле package_type в таблицу products
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS package_type TEXT CHECK (package_type IN ('1kg', '3kg', '5kg', '10kg'));

-- Добавить поле min_order в таблицу products (минимальный заказ)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS min_order DECIMAL(10, 2) DEFAULT 1 CHECK (min_order >= 0);

-- Добавить поле max_order в таблицу products (максимальный заказ)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS max_order DECIMAL(10, 2) CHECK (max_order IS NULL OR max_order >= 0);

-- Добавить поле badge в таблицу products (надпись: top, discount, recommended)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS badge TEXT CHECK (badge IS NULL OR badge IN ('top', 'discount', 'recommended'));

-- Добавить поле sale_type в таблицу products (как продается)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS sale_type TEXT DEFAULT 'by_piece' CHECK (sale_type IN ('by_kg', 'by_piece', 'by_package'));

-- Создать индексы для новых полей
CREATE INDEX IF NOT EXISTS idx_products_sale_type ON products(sale_type);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products(badge) WHERE badge IS NOT NULL;

