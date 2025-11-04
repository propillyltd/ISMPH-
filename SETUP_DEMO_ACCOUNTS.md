# Setup Demo Accounts - Step by Step Guide

This guide will help you create the demo login accounts for testing the ISMPH Media Tracker application.

---

## 🎯 Quick Start

Follow these steps to create working demo accounts in 5 minutes:

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your ISMPH project: `hspnwydiyskzphjphbps`

### Step 2: Navigate to Authentication

1. In the left sidebar, click on **"Authentication"**
2. Click on **"Users"** tab
3. You should see a list of users (may be empty)

### Step 3: Create Super Admin Account

1. Click the **"Add User"** button (top right)
2. Fill in the form:
   ```
   Email:           admin@ismph.org
   Password:        ISMPH@Admin2024
   Auto Confirm:    ✅ Enable (checked)
   ```
3. Click **"Create User"**
4. You should see a success message

### Step 4: Create Staff Demo Account

1. Click the **"Add User"** button again
2. Fill in the form:
   ```
   Email:           staff@ismph.org
   Password:        ISMPH@Staff2024
   Auto Confirm:    ✅ Enable (checked)
   ```
3. Click **"Create User"**
4. You should see a success message

### Step 5: Verify Profiles Were Created

1. In the left sidebar, click on **"Table Editor"**
2. Select the **"profiles"** table from the dropdown
3. You should see 2 new rows:

   **Row 1:**
   ```
   email:     admin@ismph.org
   full_name: ISMPH Super Admin
   role:      super_admin
   state:     (null)
   ```

   **Row 2:**
   ```
   email:     staff@ismph.org
   full_name: Demo Staff Member
   role:      staff
   state:     Lagos
   phone:     08012345678
   ```

✅ **Done!** Your demo accounts are now ready to use.

---

## 🧪 Testing the Accounts

### Test 1: Super Admin Login

1. Open your ISMPH app
2. Go to the login screen
3. Enter credentials:
   - **Email**: `admin@ismph.org`
   - **Password**: `ISMPH@Admin2024`
4. Click **"Sign In"**

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to home dashboard
- ✅ Header shows "ISMPH Super Admin"
- ✅ Can access all features

**What Super Admin Can Do:**
- View all disease tracking data across all states
- Approve/reject reports from any state
- Access admin dashboard (`/admin`)
- Manage users and feedback
- Full system access

### Test 2: Staff Member Login

1. Open your ISMPH app (or open in incognito/new session)
2. Go to the login screen
3. Enter credentials:
   - **Email**: `staff@ismph.org`
   - **Password**: `ISMPH@Staff2024`
4. Click **"Sign In"**

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to home dashboard
- ✅ Header shows "Demo Staff Member"
- ✅ Profile shows Lagos state badge

**What Staff Member Can Do:**
- Submit reports for Lagos state
- View disease tracking data
- Access zone chat for Lagos
- Submit feedback
- View news and updates
- ❌ Cannot access admin dashboard
- ❌ Cannot approve/reject reports
- ❌ Limited to Lagos state data

---

## 📋 Complete Credentials Reference

### Demo Accounts (Created by You)

| Account Type | Email | Password | Role | State | Access Level |
|-------------|-------|----------|------|-------|--------------|
| Super Admin | `admin@ismph.org` | `ISMPH@Admin2024` | super_admin | All | Full system |
| Staff Demo | `staff@ismph.org` | `ISMPH@Staff2024` | staff | Lagos | Limited |

### State Program Officers (Auto-configured)

These accounts will be automatically configured when these emails sign up:

| SPO | Email | Role | State | Phone |
|-----|-------|------|-------|-------|
| Sabuusa Yahay | `ysabuusa@lsmph.org` | state_admin | Kano | 08039627357 |
| Peace Micheal | `mpeace@lsmph.org` | state_admin | Lagos | 08033642943 |
| Bako Abdul Usman | `abako@lsmph.org` | state_admin | Kaduna | 0806074537 |

---

## 🔧 Troubleshooting

### Problem: "Invalid login credentials"

**Solution:**
1. Go back to Supabase Dashboard > Authentication > Users
2. Find the user in the list
3. Click on the user
4. Verify:
   - Email is exactly correct (check for typos)
   - "Email Confirmed At" has a timestamp (not null)
5. If "Email Confirmed At" is null:
   - Click "Send Confirmation Email" or
   - Manually set the timestamp

### Problem: Profile not created / Wrong role

**Solution:**
1. Go to Table Editor > profiles
2. Check if profile exists for the email
3. If missing, manually insert:

   **For Super Admin:**
   ```sql
   INSERT INTO profiles (id, email, full_name, role, language_preference, notification_enabled, created_at, updated_at)
   VALUES (
     'user-id-from-auth-users',
     'admin@ismph.org',
     'ISMPH Super Admin',
     'super_admin',
     'en',
     true,
     now(),
     now()
   );
   ```

   **For Staff:**
   ```sql
   INSERT INTO profiles (id, email, full_name, phone, role, state, language_preference, notification_enabled, created_at, updated_at)
   VALUES (
     'user-id-from-auth-users',
     'staff@ismph.org',
     'Demo Staff Member',
     '08012345678',
     'staff',
     'Lagos',
     'en',
     true,
     now(),
     now()
   );
   ```

4. Replace `'user-id-from-auth-users'` with actual UUID from auth.users table

### Problem: Cannot access admin features with super_admin role

**Solution:**
1. Verify role in profiles table:
   ```sql
   SELECT id, email, role, state FROM profiles WHERE email = 'admin@ismph.org';
   ```
2. Should show: `role: super_admin`
3. If wrong, update:
   ```sql
   UPDATE profiles SET role = 'super_admin' WHERE email = 'admin@ismph.org';
   ```
4. Log out and log back in

### Problem: Staff member can see all states data

**Solution:**
1. Verify state in profiles table:
   ```sql
   SELECT id, email, role, state FROM profiles WHERE email = 'staff@ismph.org';
   ```
2. Should show: `role: staff, state: Lagos`
3. If wrong, update:
   ```sql
   UPDATE profiles SET role = 'staff', state = 'Lagos' WHERE email = 'staff@ismph.org';
   ```
4. Log out and log back in

---

## 🔒 Security Reminders

### Development/Testing
- ✅ These passwords are fine for development
- ✅ Share freely with your team
- ✅ Commit to private repositories only

### Production
- 🚨 **CRITICAL**: Change these passwords before going live
- 🚨 Use passwords with at least 16 characters
- 🚨 Include uppercase, lowercase, numbers, and symbols
- 🚨 Never commit production passwords to git
- 🚨 Use environment variables for sensitive data
- 🚨 Enable 2FA when available
- 🚨 Rotate passwords every 90 days

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Super admin account created in Supabase Auth
- [ ] Staff demo account created in Supabase Auth
- [ ] Both accounts show "Email Confirmed At" timestamp
- [ ] Super admin profile exists with role=super_admin
- [ ] Staff profile exists with role=staff, state=Lagos
- [ ] Can login with admin@ismph.org
- [ ] Can login with staff@ismph.org
- [ ] Admin account can access /admin route
- [ ] Staff account cannot access /admin route
- [ ] Staff account shows Lagos state in profile
- [ ] Both accounts show proper names in header

---

## 📸 Visual Guide

### Creating User in Supabase Dashboard

**Step 1:** Click "Add User"
```
┌─────────────────────────────────────┐
│  Authentication > Users             │
│                    [+ Add User]     │
└─────────────────────────────────────┘
```

**Step 2:** Fill in Form
```
┌────────────────────────────────────┐
│  Create New User                   │
│                                    │
│  Email *                           │
│  ┌──────────────────────────────┐ │
│  │ admin@ismph.org              │ │
│  └──────────────────────────────┘ │
│                                    │
│  Password *                        │
│  ┌──────────────────────────────┐ │
│  │ ISMPH@Admin2024              │ │
│  └──────────────────────────────┘ │
│                                    │
│  ☑ Auto Confirm User               │
│                                    │
│         [Cancel]  [Create User]   │
└────────────────────────────────────┘
```

**Step 3:** Verify in Profiles Table
```
┌─────────────────────────────────────────────────────────┐
│  Table Editor > profiles                                │
├─────────────┬───────────────────┬──────────────┬───────┤
│  email      │ full_name         │ role         │ state │
├─────────────┼───────────────────┼──────────────┼───────┤
│ admin@...   │ ISMPH Super Admin │ super_admin  │ null  │
│ staff@...   │ Demo Staff Member │ staff        │ Lagos │
└─────────────┴───────────────────┴──────────────┴───────┘
```

---

## 🎉 Success!

You now have working demo accounts. You can:
- Test all features with different permission levels
- Demo the app to stakeholders
- Develop new features with proper role testing
- Train new team members on the system

**Next Steps:**
1. Test login with both accounts
2. Verify role-based access control works
3. Create real user accounts for actual staff
4. Document any custom workflows needed

---

**Need Help?**
- Check the troubleshooting section above
- Review Supabase Auth documentation
- Check application logs for error messages
- Verify RLS policies in database

---

**Last Updated:** November 4, 2025
**Status:** Ready for Use
**Version:** 1.0
