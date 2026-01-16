-- ============================================
-- СОЗДАТЬ ДЕФОЛТНЫЕ КНОПКИ БОТА
-- ============================================
-- 
-- Эта миграция создает дефолтные кнопки бота,
-- которые можно редактировать в админ-панели
--
-- ============================================

-- Создать дефолтные кнопки бота, если их еще нет
INSERT INTO bot_buttons (text, action, order_index, is_active)
VALUES 
  ('🌐 Sayt haqida', NULL, 1, true),
  ('🏪 Sotuvchi bo''lish', NULL, 2, true)
ON CONFLICT DO NOTHING;

-- Если кнопки уже существуют, обновить их текст (но только если они пустые или имеют старые значения)
DO $$
BEGIN
  -- Обновить первую кнопку, если она существует
  UPDATE bot_buttons 
  SET text = '🌐 Sayt haqida', order_index = 1, is_active = true
  WHERE id IN (
    SELECT id FROM bot_buttons 
    WHERE order_index = 1 OR text LIKE '%Sayt%' OR text LIKE '%sayt%'
    LIMIT 1
  )
  AND (text IS NULL OR text = '' OR text != '🌐 Sayt haqida');

  -- Если первой кнопки нет, создать её
  IF NOT EXISTS (SELECT 1 FROM bot_buttons WHERE text = '🌐 Sayt haqida' OR order_index = 1) THEN
    INSERT INTO bot_buttons (text, action, order_index, is_active)
    VALUES ('🌐 Sayt haqida', NULL, 1, true);
  END IF;

  -- Обновить вторую кнопку, если она существует
  UPDATE bot_buttons 
  SET text = '🏪 Sotuvchi bo''lish', order_index = 2, is_active = true
  WHERE id IN (
    SELECT id FROM bot_buttons 
    WHERE order_index = 2 OR text LIKE '%Sotuvchi%' OR text LIKE '%sotuvchi%'
    LIMIT 1
  )
  AND (text IS NULL OR text = '' OR text != '🏪 Sotuvchi bo''lish');

  -- Если второй кнопки нет, создать её
  IF NOT EXISTS (SELECT 1 FROM bot_buttons WHERE text = '🏪 Sotuvchi bo''lish' OR order_index = 2) THEN
    INSERT INTO bot_buttons (text, action, order_index, is_active)
    VALUES ('🏪 Sotuvchi bo''lish', NULL, 2, true);
  END IF;
END $$;

