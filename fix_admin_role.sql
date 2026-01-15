-- ============================================
-- ИСПРАВИТЬ РОЛЬ ПОЛЬЗОВАТЕЛЯ НА АДМИНА
-- ============================================
-- 
-- Этот код проверит и исправит роль пользователя
-- Используйте email или UUID пользователя
--
-- ============================================

-- ВАРИАНТ 1: По EMAIL (рекомендуется)
-- Замените 'esalimov022@gmail.com' на email пользователя

-- ШАГ 1: Проверить текущее состояние
SELECT 
  u.id,
  u.email,
  up.id as profile_exists,
  up.role as current_role,
  up.name
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.email = 'esalimov022@gmail.com';

-- ШАГ 2: Создать или обновить профиль с ролью 'admin'
INSERT INTO public.user_profiles (id, email, name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(up.name, COALESCE(u.raw_user_meta_data->>'name', 'Admin User')) as name,
  'admin' as role
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.email = 'esalimov022@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, user_profiles.name),
  updated_at = NOW();

-- ШАГ 3: Проверить результат (должно показать role = 'admin')
SELECT 
  u.id,
  u.email,
  up.name,
  up.role,
  up.created_at,
  up.updated_at
FROM auth.users u
INNER JOIN public.user_profiles up ON u.id = up.id
WHERE u.email = 'esalimov022@gmail.com';

-- ============================================
-- ВАРИАНТ 2: По UUID (если знаете UUID)
-- ============================================
-- Раскомментируйте и используйте, если нужно по UUID:
/*
INSERT INTO public.user_profiles (id, email, name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(up.name, COALESCE(u.raw_user_meta_data->>'name', 'Admin User')) as name,
  'admin' as role
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.id = '7304d1a3-7120-4702-9476-0628c6149039'::uuid
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, user_profiles.name),
  updated_at = NOW();

SELECT 
  u.id,
  u.email,
  up.name,
  up.role
FROM auth.users u
INNER JOIN public.user_profiles up ON u.id = up.id
WHERE u.id = '7304d1a3-7120-4702-9476-0628c6149039'::uuid;
*/

