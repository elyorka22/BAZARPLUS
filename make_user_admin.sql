-- ============================================
-- СДЕЛАТЬ СУЩЕСТВУЮЩЕГО ПОЛЬЗОВАТЕЛЯ АДМИНОМ
-- ============================================
-- 
-- ИНСТРУКЦИЯ:
-- 1. Замените 'user@example.com' на email существующего пользователя
-- 2. Замените 'Имя Админа' на имя (опционально)
-- 3. Выполните этот код в Supabase SQL Editor
--
-- ============================================

-- ШАГ 1: Создать или обновить профиль пользователя с ролью 'admin'
INSERT INTO public.user_profiles (id, email, name, role)
SELECT 
  id,                              -- UUID пользователя
  email,                           -- Email пользователя
  COALESCE(
    (SELECT name FROM public.user_profiles WHERE id = auth.users.id),
    'Admin User'                    -- Имя по умолчанию, если не указано
  ) as name,
  'admin' as role                  -- Установить роль 'admin'
FROM auth.users
WHERE email = 'user@example.com'   -- ⚠️ ЗАМЕНИТЕ НА EMAIL ПОЛЬЗОВАТЕЛЯ
LIMIT 1
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',                  -- Обновить роль на 'admin'
  email = EXCLUDED.email,
  updated_at = NOW();

-- ШАГ 2: Подтвердить email (чтобы можно было войти)
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'user@example.com'   -- ⚠️ ЗАМЕНИТЕ НА EMAIL ПОЛЬЗОВАТЕЛЯ
  AND email_confirmed_at IS NULL;

-- ШАГ 3: Проверить результат
SELECT 
  u.id,
  u.email,
  up.name,
  up.role,
  u.email_confirmed_at,
  up.created_at,
  up.updated_at
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.email = 'user@example.com'  -- ⚠️ ЗАМЕНИТЕ НА EMAIL ПОЛЬЗОВАТЕЛЯ
  AND up.role = 'admin';

-- ============================================
-- ГОТОВО! Теперь этот пользователь - админ
-- ============================================

