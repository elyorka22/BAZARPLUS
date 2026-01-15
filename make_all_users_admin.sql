-- ============================================
-- ⚠️ ВНИМАНИЕ: СДЕЛАТЬ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ АДМИНАМИ
-- ============================================
-- 
-- ЭТОТ КОД СДЕЛАЕТ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ АДМИНАМИ!
-- ИСПОЛЬЗУЙТЕ ТОЛЬКО ДЛЯ ТЕСТИРОВАНИЯ ИЛИ ЕСЛИ УВЕРЕНЫ!
--
-- ============================================

-- Сделать всех существующих пользователей админами
INSERT INTO public.user_profiles (id, email, name, role)
SELECT 
  id,
  email,
  COALESCE(
    (SELECT name FROM public.user_profiles WHERE id = auth.users.id),
    'User'
  ) as name,
  'admin' as role
FROM auth.users
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Подтвердить email всех пользователей
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- Показать всех админов
SELECT 
  u.email,
  up.name,
  up.role,
  u.email_confirmed_at
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE up.role = 'admin'
ORDER BY up.created_at DESC;

