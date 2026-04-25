# 🔧 FIX ADMIN LOGIN NOT WORKING (1 MINUTE!)

---

## 🚨 **PROBLEM:**
- ✅ Customer login works
- ❌ Admin login doesn't redirect to admin dashboard

---

## 🎯 **LIKELY CAUSES:**

1. **Profile not created** - Admin user exists in auth but no profile in database
2. **Role mismatch** - Profile has wrong role (customer instead of admin)
3. **Metadata missing** - User metadata doesn't have "role" field

---

## ✅ **SOLUTION: 3 STEPS** (1 minute total!)

---

### **STEP 1: Check User Metadata** (15 seconds)

1. **Go to Auth Users:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users

2. **Find admin@demo.com** in the list

3. **Click on the user**

4. **Check "User Metadata" section**

5. **Should be:**
   ```json
   {
     "full_name": "Admin Sunest",
     "role": "admin"
   }
   ```

6. **If missing or wrong:**
   - Click "Edit user"
   - Scroll to "User Metadata"
   - Click "JSON" tab
   - Paste:
     ```json
     {"full_name": "Admin Sunest", "role": "admin"}
     ```
   - Click "Save"

---

### **STEP 2: Run Debug & Fix SQL** (30 seconds)

1. **Go to SQL Editor:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql

2. **Click "New query"**

3. **Copy ENTIRE `/DEBUG_ADMIN_LOGIN.sql`**

4. **Paste & Click "Run"**

5. **Check output:**
   - Should show all users
   - Should show all profiles
   - Should show "✅ OK" for admin user

6. **If shows "❌ MISSING PROFILE" or "⚠️ ROLE MISMATCH":**
   - The SQL auto-fixes it!
   - Run it again to verify fix

---

### **STEP 3: Hard Refresh & Test** (15 seconds)

1. **Go back to app**

2. **Logout** if logged in

3. **Hard refresh:** Press **Ctrl+Shift+R** (or Cmd+Shift+R on Mac)

4. **Click "Login"**

5. **Enter:**
   ```
   Email: admin@demo.com
   Password: password123
   ```

6. **Click "Login"**

7. **✅ Should redirect to Admin Dashboard!** 🎉

---

## 🔍 **MANUAL CHECK (If still not working):**

### **Check Database Directly:**

Run in SQL Editor:

```sql
-- Check if admin profile exists with correct role
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' AS metadata_role,
  p.role AS profile_role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@demo.com';
```

**Expected output:**
```
email: admin@demo.com
metadata_role: admin
profile_role: admin
full_name: Admin Sunest
```

**If any field is wrong, fix manually:**

```sql
-- Fix admin profile role
UPDATE public.profiles
SET role = 'admin', full_name = 'Admin Sunest'
WHERE email = 'admin@demo.com';
```

---

## 🐛 **DEBUGGING TIPS:**

### **Check Browser Console:**

1. **Open DevTools:** Press F12
2. **Go to "Console" tab**
3. **Look for errors after login**
4. **Should see:**
   ```
   Profile loaded: { role: "admin", full_name: "Admin Sunest", ... }
   ```

### **Check Network Tab:**

1. **Open DevTools** (F12)
2. **Go to "Network" tab**
3. **Login as admin**
4. **Look for request to `/rest/v1/profiles?id=...`**
5. **Check response:**
   - Should return profile with `"role": "admin"`

---

## ⚠️ **COMMON MISTAKES:**

### ❌ **Mistake 1: Wrong email**
- Used `admin@sunest.com` instead of `admin@demo.com`
- **Fix:** Use exact email from demo box

### ❌ **Mistake 2: Metadata without role**
- Metadata is `{"full_name": "Admin"}` (missing role)
- **Fix:** Add role field: `{"full_name": "Admin Sunest", "role": "admin"}`

### ❌ **Mistake 3: Profile has customer role**
- User metadata says "admin" but profile table says "customer"
- **Fix:** Run `/DEBUG_ADMIN_LOGIN.sql` to sync

### ❌ **Mistake 4: No profile at all**
- User exists in auth.users but not in public.profiles
- **Fix:** Run `/DEBUG_ADMIN_LOGIN.sql` to auto-create

---

## 🎯 **QUICK FIX (Nuclear Option):**

If nothing works, **delete and recreate admin user:**

1. **Go to Auth Users:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users

2. **Find admin@demo.com** → Click kebab menu (⋮) → **Delete**

3. **Click "Add user"**

4. **Enter:**
   ```
   Email: admin@demo.com
   Password: password123
   ✅ Auto Confirm User: YES
   
   User Metadata (JSON tab):
   {"full_name": "Admin Sunest", "role": "admin"}
   ```

5. **Click "Create user"**

6. **Refresh app** → **Login** → **✅ Should work!**

---

## 📋 **CHECKLIST:**

- [ ] User metadata has "role": "admin"
- [ ] Profile exists in public.profiles table
- [ ] Profile role is "admin"
- [ ] Hard refreshed app (Ctrl+Shift+R)
- [ ] Logged out and logged in again
- [ ] No errors in browser console

---

## 🔗 **QUICK LINKS:**

**Auth Users:**  
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users

**SQL Editor:**  
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql

**Files:**
- `/DEBUG_ADMIN_LOGIN.sql` - Auto-fix script
- `/FIX_ADMIN_NOT_WORKING.md` - This guide

---

## 🚀 **NEXT:**

After admin login works:

1. **Test admin features:**
   - View all bookings
   - Approve pending jobs
   - Manage inventory

2. **Test customer features:**
   - Login as customer@demo.com
   - Book a service
   - Check tracking

---

**Run `/DEBUG_ADMIN_LOGIN.sql` first, then test login!** 💪

Kalau masih gak work, kasih tau:
1. Error message di console
2. Output dari SQL query
3. Screenshot dari user metadata

Pasti bisa fix! 😊
