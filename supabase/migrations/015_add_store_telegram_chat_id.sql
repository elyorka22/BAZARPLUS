-- ============================================
-- ДОБАВИТЬ TELEGRAM CHAT ID ДЛЯ МАГАЗИНОВ
-- ============================================
-- 
-- Эта миграция добавляет поле telegram_chat_id в таблицу stores
-- для отправки уведомлений о заказах через Telegram бота
--
-- ============================================

-- Добавить поле telegram_chat_id в таблицу stores
ALTER TABLE stores 
  ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Создать индекс для быстрого поиска по chat_id
CREATE INDEX IF NOT EXISTS idx_stores_telegram_chat_id ON stores(telegram_chat_id) WHERE telegram_chat_id IS NOT NULL;

