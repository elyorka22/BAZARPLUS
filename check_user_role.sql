-- ============================================
-- ПРОВЕРИТЬ РОЛЬ ПОЛЬЗОВАТЕЛЯ
-- ============================================
-- 
-- Этот код покажет реальную роль пользователя из таблицы user_profiles
-- Роль хранится в user_profiles, а НЕ в auth.users!
--
-- ============================================

-- Проверить роль по EMAIL
SELECT 
  u.id,
  u.email,
  up.role as real_role,                    -- Это реальная роль из user_profiles
  up.name,
  u.raw_user_meta_data->>'role' as meta_role,  -- Это метаданные (не используется)
  up.created_at as profile_created,
  up.updated_at as profile_updated
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.email = 'esalimov022@gmail.com';  -- Замените на нужный email

-- Проверить роль по UUID
SELECT 
  u.id,
  u.email,
  up.role as real_role,
  up.name,
  u.raw_user_meta_data->>'role' as meta_role,
  up.created_at,
  up.updated_at
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.id = '7304d1a3-7120-4702-9476-0628c6149039'::uuid;

-- Показать всех админов
SELECT 
  u.email,
  up.name,
  up.role,
  up.created_at
FROM auth.users u
INNER JOIN public.user_profiles up ON u.id = up.id
WHERE up.role = 'admin'
ORDER BY up.created_at DESC;

