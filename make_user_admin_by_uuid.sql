-- ============================================
-- СДЕЛАТЬ ПОЛЬЗОВАТЕЛЯ АДМИНОМ ПО UUID
-- ============================================
-- 
-- ИСПОЛЬЗУЙТЕ ЭТОТ КОД, ЕСЛИ ЗНАЕТЕ UUID ПОЛЬЗОВАТЕЛЯ
-- 
-- ИНСТРУКЦИЯ:
-- 1. Найдите UUID пользователя в Supabase Dashboard:
--    Authentication → Users → найдите пользователя → скопируйте UUID
-- 2. Замените '00000000-0000-0000-0000-000000000000' на реальный UUID
-- 3. Выполните этот код в Supabase SQL Editor
--
-- ============================================

-- ШАГ 1: Создать или обновить профиль пользователя с ролью 'admin'
INSERT INTO public.user_profiles (id, email, name, role)
SELECT 
  id,
  email,
  COALESCE(
    (SELECT name FROM public.user_profiles WHERE id = auth.users.id),
    'Admin User'
  ) as name,
  'admin' as role
FROM auth.users
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid  -- ⚠️ ЗАМЕНИТЕ НА UUID ПОЛЬЗОВАТЕЛЯ
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  email = EXCLUDED.email,
  updated_at = NOW();

-- ШАГ 2: Подтвердить email
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid  -- ⚠️ ЗАМЕНИТЕ НА UUID ПОЛЬЗОВАТЕЛЯ
  AND email_confirmed_at IS NULL;

-- ШАГ 3: Проверить результат
SELECT 
  u.id,
  u.email,
  up.name,
  up.role,
  u.email_confirmed_at,
  up.created_at
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.id = '00000000-0000-0000-0000-000000000000'::uuid  -- ⚠️ ЗАМЕНИТЕ НА UUID ПОЛЬЗОВАТЕЛЯ
  AND up.role = 'admin';

-- ============================================
-- ГОТОВО! Теперь этот пользователь - админ
-- ============================================

