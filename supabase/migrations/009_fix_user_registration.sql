-- Fix user registration by allowing users to insert their own profile
-- This migration adds an INSERT policy for user_profiles

-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also allow the trigger function to insert profiles (it uses SECURITY DEFINER, but this ensures it works)
-- The trigger function already has SECURITY DEFINER, so it should work, but this policy helps

