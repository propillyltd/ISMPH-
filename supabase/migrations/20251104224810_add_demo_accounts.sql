/*
  # Add Demo Login Accounts

  1. Overview
    This migration adds demo account credentials for testing and demonstration purposes.
    Includes a super admin account and a staff member account.

  2. Demo Accounts to be Created
    - **Super Admin**: Full system access
      - Email: admin@ismph.org
      - Full Name: ISMPH Super Admin
      - Role: super_admin
      - State: All states access
    
    - **Staff Demo**: Staff member with limited access
      - Email: staff@ismph.org
      - Full Name: Demo Staff Member
      - Phone: 08012345678
      - Role: staff
      - State: Lagos

  3. Security Notes
    - These accounts should have strong passwords set via Supabase Auth
    - Passwords should be communicated securely to authorized personnel
    - Consider disabling these accounts in production after testing
    - Monitor usage of demo accounts for security purposes

  4. Next Steps
    - Create auth users in Supabase Auth dashboard or via API with these emails
    - Set secure passwords for both accounts
    - Test login functionality with both accounts
    - Verify role-based access controls work correctly
*/

-- Update the trigger function to include demo accounts
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Super Admin Account
  IF NEW.email = 'admin@ismph.org' THEN
    INSERT INTO profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
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
    INSERT INTO profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
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
      
  -- Lagos State SPO
  ELSIF NEW.email = 'mpeace@lsmph.org' THEN
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
      
  -- Kaduna State SPO
  ELSIF NEW.email = 'abako@lsmph.org' THEN
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

-- Add comment documenting all special accounts
COMMENT ON FUNCTION handle_new_user_profile() IS 
'Automatically creates user profiles when auth users are created. 
Special accounts configured:
- admin@ismph.org: Super Admin (full system access)
- staff@ismph.org: Demo Staff Member (Lagos, staff role)
- ysabuusa@lsmph.org: Kano State SPO (state_admin)
- mpeace@lsmph.org: Lagos State SPO (state_admin)
- abako@lsmph.org: Kaduna State SPO (state_admin)
All other emails are assigned public role by default.';
