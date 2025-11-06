/*
  # Fix Profiles Table RLS Policies

  1. Overview
    This migration fixes authentication issues during signup by adding proper RLS policies.
    The profiles table had SELECT and UPDATE policies but was missing INSERT and DELETE policies.

  2. Changes
    - Add INSERT policy to allow users to create their own profile during signup
    - Add DELETE policy for admins to manage users
    - Update trigger function to use SECURITY DEFINER properly

  3. Security
    - INSERT: Users can only insert their own profile (auth.uid() = id)
    - SELECT: Users can view their own profile
    - UPDATE: Users can update their own profile
    - DELETE: Only super_admins can delete profiles

  4. Important Notes
    - These policies work in conjunction with the trigger function
    - The trigger creates profiles automatically for auth users
    - Manual profile creation is also allowed for flexibility
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- SELECT: Users can view their own profile
-- Admins and super_admins can view all profiles
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'state_admin')
    )
  );

-- INSERT: Allow users to create their own profile during signup
-- Also allow the trigger function to insert (SECURITY DEFINER)
CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own profile
-- Admins can update any profile
CREATE POLICY "Users can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- DELETE: Only super admins can delete profiles
CREATE POLICY "Super admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- Ensure the trigger function has proper permissions
-- Recreate with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Super Admin Account
  IF NEW.email = 'admin@ismph.org' THEN
    INSERT INTO public.profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      'ISMPH Super Admin',
      NULL,
      'super_admin',
      NULL,
      'en',
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      updated_at = now();
  
  -- Staff Demo Account
  ELSIF NEW.email = 'staff@ismph.org' THEN
    INSERT INTO public.profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      'Demo Staff Member',
      '08012345678',
      'staff',
      'Lagos',
      'en',
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      state = EXCLUDED.state,
      updated_at = now();
  
  -- Kano State SPO
  ELSIF NEW.email = 'ysabuusa@lsmph.org' THEN
    INSERT INTO public.profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      'Sabuusa Yahay',
      '08039627357',
      'state_admin',
      'Kano',
      'en',
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      state = EXCLUDED.state,
      updated_at = now();
      
  -- Lagos State SPO
  ELSIF NEW.email = 'mpeace@lsmph.org' THEN
    INSERT INTO public.profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      'Peace Micheal',
      '08033642943',
      'state_admin',
      'Lagos',
      'en',
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      state = EXCLUDED.state,
      updated_at = now();
      
  -- Kaduna State SPO
  ELSIF NEW.email = 'abako@lsmph.org' THEN
    INSERT INTO public.profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      'Bako Abdul Usman',
      '0806074537',
      'state_admin',
      'Kaduna',
      'en',
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      state = EXCLUDED.state,
      updated_at = now();
      
  ELSE
    -- For regular users, DON'T create profile here
    -- Let the application handle it with the INSERT policy
    NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is properly set
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

COMMENT ON FUNCTION handle_new_user_profile() IS 
'Automatically creates profiles for designated admin emails only.
Regular users must create their own profile via the INSERT policy.
This function runs with SECURITY DEFINER to bypass RLS.';
