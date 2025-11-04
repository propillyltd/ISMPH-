/*
  # Setup Automatic Admin Profile Creation

  1. Overview
    This migration creates an automated system for admin account setup.
    When designated admin emails sign up, they are automatically assigned the correct role and state.

  2. Admin Accounts to be Created
    - **Kano State SPO**: Sabuusa Yahay (ysabuusa@lsmph.org) - Phone: 08039627357
    - **Lagos State SPO**: Peace Micheal (mpeace@lsmph.org) - Phone: 08033642943
    - **Kaduna State SPO**: Bako Abdul Usman (abako@lsmph.org) - Phone: 0806074537

  3. How It Works
    - A trigger function monitors new auth.users insertions
    - When admin emails sign up, they are automatically assigned state_admin role
    - Profile is created with correct state assignment
    - Regular users get public role by default

  4. Security
    - Function runs with SECURITY DEFINER to bypass RLS
    - Only works on auth.users table inserts
    - Admins can manage their assigned state's data via existing RLS policies

  5. Next Steps
    - Admin accounts should be created via Supabase Auth dashboard or API
    - Each admin should reset their password on first login
    - Verify admin access by checking their profile role and state
*/

-- Create or replace the trigger function for admin profile creation
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user's email matches any of our designated admin emails
  IF NEW.email = 'ysabuusa@lsmph.org' THEN
    -- Kano State SPO
    INSERT INTO profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
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
      
  ELSIF NEW.email = 'mpeace@lsmph.org' THEN
    -- Lagos State SPO
    INSERT INTO profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
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
      
  ELSIF NEW.email = 'abako@lsmph.org' THEN
    -- Kaduna State SPO
    INSERT INTO profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
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
    -- For regular users, create a standard profile
    INSERT INTO profiles (id, email, role, language_preference, notification_enabled, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      'public',
      'en',
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      email = EXCLUDED.email,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profiles for new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- Add a comment to document the admin emails
COMMENT ON FUNCTION handle_new_user_profile() IS 
'Automatically creates user profiles when auth users are created. 
Designated admin emails (ysabuusa@lsmph.org, mpeace@lsmph.org, abako@lsmph.org) 
are automatically assigned state_admin role with their respective states.';
