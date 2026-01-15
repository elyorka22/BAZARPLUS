-- ============================================
-- ОТЛАДКА: Проверить роль пользователя
-- ============================================
-- 
-- Этот запрос поможет понять, почему пользователь не перенаправляется на /admin
-- Замените 'esalimov022@gmail.com' на ваш email
--
-- ============================================

-- Проверить пользователя и его роль
SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  up.id as profile_id,
  up.name,
  up.role,
  up.created_at as profile_created,
  up.updated_at as profile_updated,
  CASE 
    WHEN up.role = 'admin' THEN '✅ Админ - должен попасть на /admin'
    WHEN up.role = 'store' THEN '🏪 Магазин - должен попасть на /store'
    WHEN up.role = 'client' THEN '👤 Клиент - должен попасть на /client'
    WHEN up.role IS NULL THEN '⚠️ Роль не установлена - будет перенаправлен на /client'
    ELSE '❓ Неизвестная роль: ' || up.role
  END as role_status,
  -- Проверить, есть ли запись в user_profiles
  CASE 
    WHEN up.id IS NULL THEN '❌ Профиль НЕ создан!'
    ELSE '✅ Профиль создан'
  END as profile_exists
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.email = 'esalimov022@gmail.com';  -- ЗАМЕНИТЕ НА ВАШ EMAIL

-- ============================================
-- Если роль не 'admin', исправить:
-- ============================================
-- Раскомментируйте и выполните, если роль не 'admin':
/*
UPDATE public.user_profiles
SET 
  role = 'admin',
  updated_at = NOW()
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'esalimov022@gmail.com'
);

-- Проверить результат
SELECT email, role FROM public.user_profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'esalimov022@gmail.com');
*/

