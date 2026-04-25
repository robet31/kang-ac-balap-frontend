# 🔧 FIX: Admin Masuk ke Customer Dashboard

---

## 🚨 **PROBLEM:**
- Login sebagai **admin@demo.com**
- Tapi malah masuk ke **Customer Dashboard** ❌
- Harusnya masuk ke **Admin Dashboard** ✅

---

## 🎯 **ROOT CAUSE:**

**Profile role di database tidak match dengan user metadata!**

Kemungkinan:
1. **Profile role = "customer"** tapi seharusnya **"admin"**
2. **Profile tidak exist** di table `profiles`
3. **User metadata tidak punya field "role"**

---

## ✅ **SOLUTION: 2 LANGKAH** (1 menit!)

---

### **STEP 1: Run Fix SQL** (30 detik)

1. **Buka SQL Editor:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql

2. **New query**

3. **Copy seluruh `/FIX_ADMIN_ROUTING.sql`**

4. **Paste & Run**

5. **Check output:**
   - Should see "✅ ADMIN - Should go to Admin Dashboard" for admin@demo.com
   - Should see "✅ CUSTOMER - Should go to Customer Dashboard" for customer@demo.com

---

### **STEP 2: Test Login with Debug** (30 detik)

1. **Open Browser Console:**
   - Press **F12**
   - Go to **Console** tab

2. **Hard Refresh:**
   - Press **Ctrl+Shift+R** (Windows)
   - Or **Cmd+Shift+R** (Mac)

3. **Logout** if logged in

4. **Login as admin:**
   ```
   Email: admin@demo.com
   Password: password123
   ```

5. **Check Console Logs:**
   ```
   🔍 Fetching profile for user ID: ...
   ✅ Profile fetched successfully: {role: "admin", ...}
   🔍 AUTO-NAVIGATE DEBUG:
   User email: admin@demo.com
   Profile role: admin
   ✅ Navigating to ADMIN dashboard
   ```

6. **✅ Should see Admin Dashboard!**

---

## 🔍 **DEBUGGING CHECKLIST:**

Open Console (F12) dan check logs:

### ✅ **Expected Logs for Admin:**
```
🔍 Fetching profile for user ID: abc-123-xyz
✅ Profile fetched successfully: {
  id: "abc-123-xyz",
  email: "admin@demo.com",
  role: "admin",          ← HARUS "admin"
  full_name: "Admin Sunest"
}
🔍 AUTO-NAVIGATE DEBUG:
User email: admin@demo.com
Profile role: admin       ← HARUS "admin"
✅ Navigating to ADMIN dashboard
```

### ❌ **Wrong Logs (Problem):**
```
✅ Profile fetched successfully: {
  role: "customer"        ← ❌ SALAH! Harusnya "admin"
}
Profile role: customer    ← ❌ SALAH! Harusnya "admin"
✅ Navigating to CUSTOMER dashboard  ← ❌ Wrong dashboard!
```

**If you see this:** Run `/FIX_ADMIN_ROUTING.sql` again!

---

## 🛠️ **MANUAL FIX (If SQL doesn't work):**

### **Check User Metadata:**

1. **Go to Auth Users:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users

2. **Click admin@demo.com**

3. **Check "User Metadata":**
   ```json
   {
     "full_name": "Admin Sunest",
     "role": "admin"         ← MUST BE HERE!
   }
   ```

4. **If missing or wrong:**
   - Click **Edit user**
   - Scroll to **User Metadata**
   - Click **JSON** tab
   - Paste:
     ```json
     {"full_name": "Admin Sunest", "role": "admin"}
     ```
   - Click **Save**

### **Check Profile Table:**

Run in SQL Editor:

```sql
-- Check what role admin has in profiles table
SELECT email, role, full_name
FROM public.profiles
WHERE email = 'admin@demo.com';
```

**Expected:**
```
email: admin@demo.com
role: admin          ← MUST BE "admin"
full_name: Admin Sunest
```

**If wrong, fix manually:**

```sql
-- Force update admin role
UPDATE public.profiles
SET role = 'admin', full_name = 'Admin Sunest'
WHERE email = 'admin@demo.com';
```

---

## 🔄 **TEST BOTH USERS:**

### **Test Admin:**
1. Login: `admin@demo.com` / `password123`
2. Check console: Should see `Profile role: admin`
3. ✅ Should land on **Admin Dashboard**

### **Test Customer:**
1. Logout
2. Login: `customer@demo.com` / `password123`
3. Check console: Should see `Profile role: customer`
4. ✅ Should land on **Customer Dashboard**

---

## ⚠️ **COMMON ISSUES:**

### **Issue 1: No console logs appear**
**Solution:** 
- Make sure Console is open (F12)
- Hard refresh (Ctrl+Shift+R)
- Clear cache and try again

### **Issue 2: Profile role shows "customer" for admin**
**Solution:**
- Run `/FIX_ADMIN_ROUTING.sql` again
- Check user metadata has `"role": "admin"`
- Manually update profile table

### **Issue 3: Console shows "Profile fetched: null"**
**Solution:**
- Profile doesn't exist in database
- Run `/FIX_ADMIN_ROUTING.sql` to create it
- Or manually create profile:
  ```sql
  INSERT INTO public.profiles (id, email, full_name, role)
  SELECT id, email, 
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'role'
  FROM auth.users
  WHERE email = 'admin@demo.com'
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
  ```

### **Issue 4: Still goes to wrong dashboard**
**Solution:**
- Clear browser cache completely
- Logout
- Hard refresh (Ctrl+Shift+R)
- Login again
- Check console logs carefully

---

## 🆘 **NUCLEAR OPTION - Recreate Users:**

If nothing works, delete and recreate users:

### **Delete Users:**

1. **Go to Auth Users:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users

2. **For each user (admin & customer):**
   - Click kebab menu (⋮)
   - Click **Delete**
   - Confirm

### **Recreate Admin:**

1. **Click "Add user"**

2. **Fill in:**
   ```
   Email: admin@demo.com
   Password: password123
   ✅ Auto Confirm User: YES
   
   User Metadata (click JSON tab):
   {"full_name": "Admin Sunest", "role": "admin"}
   ```

3. **Click "Create user"**

### **Recreate Customer:**

1. **Click "Add user"** again

2. **Fill in:**
   ```
   Email: customer@demo.com
   Password: password123
   ✅ Auto Confirm User: YES
   
   User Metadata (click JSON tab):
   {"full_name": "John Customer", "role": "customer"}
   ```

3. **Click "Create user"**

### **Run Fix SQL:**

Run `/FIX_ADMIN_ROUTING.sql` to create profiles for new users.

### **Test Login:**

1. Hard refresh (Ctrl+Shift+R)
2. Login as admin → ✅ Admin Dashboard
3. Logout
4. Login as customer → ✅ Customer Dashboard

---

## 📋 **VERIFICATION CHECKLIST:**

After fix, verify everything:

- [ ] Run `/FIX_ADMIN_ROUTING.sql`
- [ ] See "✅ ADMIN" status in final verification
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Logout from any session
- [ ] Open Console (F12)
- [ ] Login as admin@demo.com
- [ ] Check console: `Profile role: admin`
- [ ] See Admin Dashboard (not Customer)
- [ ] Logout
- [ ] Login as customer@demo.com
- [ ] Check console: `Profile role: customer`
- [ ] See Customer Dashboard (not Admin)
- [ ] ✅ Both work correctly!

---

## 🎯 **EXPECTED BEHAVIOR:**

| User | Email | Password | Role | Dashboard |
|------|-------|----------|------|-----------|
| Admin | admin@demo.com | password123 | admin | **Admin Dashboard** |
| Customer | customer@demo.com | password123 | customer | **Customer Dashboard** |

---

## 📁 **FILES:**

- `/FIX_ADMIN_ROUTING.sql` - Auto-fix script
- `/FIX_WRONG_DASHBOARD.md` - This guide
- `/App.tsx` - Now has debug logging
- `/contexts/AuthContext.tsx` - Now has debug logging

---

## 🚀 **NEXT STEPS:**

1. **Run `/FIX_ADMIN_ROUTING.sql`**
2. **Hard refresh & logout**
3. **Test admin login** → Check console
4. **Test customer login** → Check console
5. **✅ Both should work!**

---

**Kalau masih bermasalah, screenshot console logs nya dan kirim!** 📸

Debug logs sekarang aktif, jadi kita bisa tau persis dimana problemnya! 🔍
