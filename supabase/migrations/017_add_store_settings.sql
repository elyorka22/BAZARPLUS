-- ============================================
-- ДОБАВИТЬ НАСТРОЙКИ МАГАЗИНА
-- ============================================
-- 
-- Эта миграция добавляет поля для управления настройками магазина:
-- - status (актив/пауза/закрыт)
-- - working_hours (время работы)
-- - delivery_radius (радиус доставки)
-- - delivery_price (цена доставки)
--
-- ============================================

-- Добавить поле status в таблицу stores
ALTER TABLE stores 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed'));

-- Добавить поле working_hours в таблицу stores
ALTER TABLE stores 
  ADD COLUMN IF NOT EXISTS working_hours TEXT;

-- Добавить поле delivery_radius в таблицу stores (в километрах)
ALTER TABLE stores 
  ADD COLUMN IF NOT EXISTS delivery_radius DECIMAL(10, 2) DEFAULT 0 CHECK (delivery_radius >= 0);

-- Добавить поле delivery_price в таблицу stores (цена доставки в so'm)
ALTER TABLE stores 
  ADD COLUMN IF NOT EXISTS delivery_price DECIMAL(10, 2) DEFAULT 0 CHECK (delivery_price >= 0);

-- Создать индекс для статуса магазина
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);

