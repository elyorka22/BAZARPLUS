-- Fix user registration by allowing users to insert their own profile
-- This migration adds an INSERT policy for user_profiles

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Allow users to insert their own profile (for registration)
-- This is needed in case the trigger doesn't fire or fails
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also ensure users can update their profile immediately after creation
-- The existing UPDATE policy should handle this, but let's make sure it's correct

