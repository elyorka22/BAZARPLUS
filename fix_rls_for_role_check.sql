-- ============================================
-- ИСПРАВИТЬ RLS ПОЛИТИКИ ДЛЯ ПРОВЕРКИ РОЛИ
-- ============================================
-- 
-- Эта миграция гарантирует, что пользователи могут читать свой профиль
-- для проверки роли при перенаправлении
--
-- ============================================

-- Убедиться, что пользователи могут читать свой профиль
-- (политика уже должна существовать, но проверим)

-- Проверить существующие политики
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Если политика "Users can view their own profile" не работает,
-- пересоздадим её
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Также убедимся, что пользователи могут читать свою роль
-- для проверки при перенаправлении
-- (это должно работать через политику выше, но добавим явную проверку)

-- Проверить, что политика работает
-- Выполните этот запрос от имени пользователя (через приложение):
-- SELECT role FROM user_profiles WHERE id = auth.uid();

