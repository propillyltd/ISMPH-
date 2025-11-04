# Demo Credentials Summary

## 🔑 Ready-to-Use Login Credentials

The following demo accounts are configured and ready to use once created in Supabase Dashboard:

---

## 1️⃣ Super Administrator

```
Email:    admin@ismph.org
Password: ISMPH@Admin2024
Role:     super_admin
```

**Full System Access** - Can do everything:
- ✅ Manage all states (Lagos, Kano, Kaduna, Abuja)
- ✅ Approve/reject reports
- ✅ Access admin dashboard
- ✅ Manage users
- ✅ View all analytics
- ✅ System configuration

---

## 2️⃣ Staff Member (Demo)

```
Email:    staff@ismph.org
Password: ISMPH@Staff2024
Role:     staff
State:    Lagos
```

**Limited Access** - Regular staff member:
- ✅ Submit reports (Lagos only)
- ✅ View disease data
- ✅ Access zone chat (Lagos)
- ✅ Submit feedback
- ❌ No admin access
- ❌ Cannot approve reports

---

## 📝 How to Create These Accounts

### Quick 3-Step Process:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select project: `hspnwydiyskzphjphbps`

2. **Navigate to Authentication > Users**
   - Click "Add User" button
   - For each account above:
     - Enter email
     - Enter password
     - ✅ Check "Auto Confirm User"
     - Click "Create User"

3. **Verify Profiles Created**
   - Go to Table Editor > profiles
   - Confirm both accounts have correct roles

📖 **Detailed Instructions**: See `SETUP_DEMO_ACCOUNTS.md`

---

## 🧪 Testing After Creation

### Test Super Admin:
```bash
# Login with
Email: admin@ismph.org
Password: ISMPH@Admin2024

# Verify
✓ Can access /admin route
✓ Can view all states
✓ Shows "ISMPH Super Admin" in header
```

### Test Staff Member:
```bash
# Login with
Email: staff@ismph.org
Password: ISMPH@Staff2024

# Verify
✓ Cannot access /admin route
✓ Limited to Lagos state
✓ Shows "Demo Staff Member" in header
✓ Can access zone chat for Lagos
```

---

## 🔐 Auto-Configured State Admins

These accounts will be automatically set up when users sign up with these emails:

### Kano State SPO
- Email: `ysabuusa@lsmph.org`
- Name: Sabuusa Yahay
- Phone: 08039627357

### Lagos State SPO
- Email: `mpeace@lsmph.org`
- Name: Peace Micheal
- Phone: 08033642943

### Kaduna State SPO
- Email: `abako@lsmph.org`
- Name: Bako Abdul Usman
- Phone: 0806074537

No special setup needed - just have them sign up with their email!

---

## ⚠️ Important Security Notes

**For Development/Testing:**
- ✅ Use these credentials freely
- ✅ Safe to share with dev team

**For Production:**
- 🚨 Change ALL passwords immediately
- 🚨 Use strong passwords (16+ characters)
- 🚨 Enable 2FA if available
- 🚨 Rotate passwords every 90 days
- 🚨 Monitor admin account activity

---

## 📚 Additional Resources

- **Full Setup Guide**: `SETUP_DEMO_ACCOUNTS.md`
- **Complete Documentation**: `DEMO_ACCOUNTS.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`

---

## ✅ Checklist

Before using the app, ensure:

- [ ] Both demo accounts created in Supabase Auth
- [ ] Email confirmation enabled for both
- [ ] Profiles exist in profiles table
- [ ] Super admin has role = 'super_admin'
- [ ] Staff has role = 'staff' and state = 'Lagos'
- [ ] Tested login with both accounts
- [ ] Verified role-based access control works

---

**Quick Reference Card** - Print this out:

```
┌─────────────────────────────────────────┐
│        ISMPH DEMO CREDENTIALS           │
├─────────────────────────────────────────┤
│                                         │
│  SUPER ADMIN                            │
│  Email: admin@ismph.org                 │
│  Pass:  ISMPH@Admin2024                 │
│                                         │
│  STAFF DEMO (Lagos)                     │
│  Email: staff@ismph.org                 │
│  Pass:  ISMPH@Staff2024                 │
│                                         │
└─────────────────────────────────────────┘
```

---

**Created**: November 4, 2025
**Status**: ✅ Ready for Use
**Environment**: Development
