-- ============================================
-- СОЗДАТЬ ДЕФОЛТНЫЕ КНОПКИ БОТА
-- ============================================
-- 
-- Эта миграция создает дефолтные кнопки бота,
-- которые можно редактировать в админ-панели
--
-- ============================================

-- Создать дефолтные кнопки бота, если их еще нет (только для главного бота, store_id = NULL)
DO $$
BEGIN
  -- Создать первую кнопку, если её нет
  IF NOT EXISTS (
    SELECT 1 FROM bot_buttons 
    WHERE text = '🌐 Sayt haqida' AND store_id IS NULL
  ) THEN
    INSERT INTO bot_buttons (text, action, order_index, is_active, store_id)
    VALUES ('🌐 Sayt haqida', NULL, 1, true, NULL);
  END IF;

  -- Создать вторую кнопку, если её нет
  IF NOT EXISTS (
    SELECT 1 FROM bot_buttons 
    WHERE text = '🏪 Sotuvchi bo''lish' AND store_id IS NULL
  ) THEN
    INSERT INTO bot_buttons (text, action, order_index, is_active, store_id)
    VALUES ('🏪 Sotuvchi bo''lish', NULL, 2, true, NULL);
  END IF;
END $$;

