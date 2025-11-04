# Demo Account Credentials

This document contains the login credentials for demo and testing accounts in the ISMPH Media Tracker application.

---

## 🔐 Login Credentials

### 1. Super Administrator Account

**Use Case**: Full system access, manage all states, view all reports, administrative functions

```
Email:    admin@ismph.org
Password: ISMPH@Admin2024
Role:     super_admin
Access:   All states and features
```

**Permissions**:
- ✅ View and manage all reports across all states
- ✅ Approve/reject reports from any state
- ✅ Manage users and roles
- ✅ View all disease tracking data
- ✅ Access admin dashboard and analytics
- ✅ Manage feedback and alerts
- ✅ Full system configuration

---

### 2. Staff Member (Demo Account)

**Use Case**: Regular staff member with zone access, can submit reports and view data

```
Email:    staff@ismph.org
Password: ISMPH@Staff2024
Role:     staff
State:    Lagos
Phone:    08012345678
```

**Permissions**:
- ✅ Submit reports for Lagos state
- ✅ View disease tracking data
- ✅ Access zone chat for Lagos
- ✅ Submit feedback
- ✅ View news and updates
- ✅ Manage own profile
- ❌ Cannot approve/reject reports
- ❌ Cannot manage other users
- ❌ Limited to Lagos state data

---

## 📋 State Program Officers (Admin Accounts)

These accounts will be activated when the designated officers sign up:

### Kano State SPO
```
Email:    ysabuusa@lsmph.org
Name:     Sabuusa Yahay
Phone:    08039627357
Role:     state_admin
State:    Kano
```

### Lagos State SPO
```
Email:    mpeace@lsmph.org
Name:     Peace Micheal
Phone:    08033642943
Role:     state_admin
State:    Lagos
```

### Kaduna State SPO
```
Email:    abako@lsmph.org
Name:     Bako Abdul Usman
Phone:    0806074537
Role:     state_admin
State:    Kaduna
```

---

## 🚀 How to Create Demo Accounts

### Option 1: Using the Script (Recommended)

1. **Get Supabase Service Role Key**:
   - Go to Supabase Dashboard
   - Navigate to Settings > API
   - Copy the `service_role` key (NOT the anon key)

2. **Add to .env file**:
   ```bash
   echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here" >> .env
   ```

3. **Run the creation script**:
   ```bash
   node scripts/create-demo-accounts.js
   ```

### Option 2: Manual Creation via Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - Navigate to Authentication > Users

2. **Create Super Admin**:
   - Click "Add User"
   - Email: `admin@ismph.org`
   - Password: `ISMPH@Admin2024`
   - Auto-confirm: ✅ Yes
   - Click "Create User"

3. **Create Staff Demo**:
   - Click "Add User"
   - Email: `staff@ismph.org`
   - Password: `ISMPH@Staff2024`
   - Auto-confirm: ✅ Yes
   - Click "Create User"

4. **Verify Profiles**:
   - The trigger function will automatically create profiles
   - Go to Table Editor > profiles
   - Verify both accounts have correct roles

---

## ✅ Testing the Accounts

### Test Super Admin Login
1. Open the ISMPH app
2. Navigate to Login screen
3. Enter:
   - Email: `admin@ismph.org`
   - Password: `ISMPH@Admin2024`
4. Verify:
   - Login successful
   - Redirected to home dashboard
   - Profile shows "Super Admin" role
   - Can access admin menu
   - Can view all state data

### Test Staff Login
1. Open the ISMPH app
2. Navigate to Login screen
3. Enter:
   - Email: `staff@ismph.org`
   - Password: `ISMPH@Staff2024`
4. Verify:
   - Login successful
   - Profile shows "Staff" role and Lagos state
   - Can submit reports
   - Can access zone chat
   - Cannot access admin features

---

## 🔒 Security Best Practices

### For Development/Testing
- ✅ Use these demo credentials freely
- ✅ Share with development team as needed
- ✅ Test all role-based features

### For Staging
- ⚠️ Change passwords to more complex ones
- ⚠️ Limit sharing of credentials
- ⚠️ Monitor login activity

### For Production
- 🚨 **CRITICAL**: Change all demo passwords immediately
- 🚨 Use strong, unique passwords (min 16 characters)
- 🚨 Enable 2FA if available
- 🚨 Rotate passwords regularly (every 90 days)
- 🚨 Monitor and audit all admin actions
- 🚨 Consider disabling demo accounts in production
- 🚨 Use individual accounts for real staff members

---

## 🐛 Troubleshooting

### Login Fails with "Invalid credentials"
1. Check if accounts were created successfully
2. Verify in Supabase Dashboard > Authentication > Users
3. Ensure email confirmation is bypassed (auto-confirm enabled)
4. Check profiles table for matching user entries

### Profile Not Created
1. Check if trigger function is active:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Manually run the trigger for existing users
3. Verify RLS policies allow profile reads

### Wrong Role Assigned
1. Check profiles table directly:
   ```sql
   SELECT email, role, state FROM profiles WHERE email IN ('admin@ismph.org', 'staff@ismph.org');
   ```
2. Update role if incorrect:
   ```sql
   UPDATE profiles SET role = 'super_admin' WHERE email = 'admin@ismph.org';
   UPDATE profiles SET role = 'staff', state = 'Lagos' WHERE email = 'staff@ismph.org';
   ```

### Cannot Access Features
1. Verify role in profile matches expected role
2. Check RLS policies are correctly configured
3. Ensure user session is fresh (logout and login again)
4. Check console for any error messages

---

## 📞 Support

If you encounter issues with demo accounts:

1. **Check Database**:
   - Verify users exist in `auth.users` table
   - Verify profiles exist in `profiles` table
   - Check role assignments are correct

2. **Check Logs**:
   - Supabase Dashboard > Logs
   - Look for authentication errors
   - Check for trigger function errors

3. **Reset Accounts**:
   - Delete users from Supabase Dashboard
   - Re-run creation script or manually recreate
   - Verify trigger function creates profiles correctly

---

## 📝 Change Log

### November 4, 2025
- Initial demo account credentials created
- Super admin account: admin@ismph.org
- Staff demo account: staff@ismph.org
- Trigger function updated to auto-create profiles
- Documentation created

---

**Last Updated**: November 4, 2025
**Status**: Ready for Testing
**Environment**: Development/Staging

⚠️ **REMEMBER**: Always change demo passwords in production environments!
