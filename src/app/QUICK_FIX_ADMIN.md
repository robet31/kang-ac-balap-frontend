# ⚡ QUICK FIX ADMIN LOGIN (30 SECONDS!)

---

## 🎯 **DO THIS NOW:**

### **1. Check User Metadata** (10 seconds)

👉 **https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users**

1. Click **admin@demo.com** user
2. Check **User Metadata** section
3. Must have:
   ```json
   {"full_name": "Admin Sunest", "role": "admin"}
   ```
4. If missing → Click **Edit** → Paste above → **Save**

---

### **2. Run Fix SQL** (10 seconds)

👉 **https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql**

1. New query
2. Copy `/DEBUG_ADMIN_LOGIN.sql`
3. Paste & Run
4. Check output shows "✅ OK"

---

### **3. Test Login** (10 seconds)

1. **Logout** from app
2. **Ctrl+Shift+R** (hard refresh)
3. **Login:** `admin@demo.com` / `password123`
4. **✅ Should see Admin Dashboard!**

---

## 🆘 **STILL NOT WORKING?**

**Nuclear option - Delete & recreate user:**

1. **Delete** admin@demo.com from Auth Users
2. **Add user** with:
   ```
   Email: admin@demo.com
   Password: password123
   ✅ Auto Confirm: YES
   Metadata: {"full_name": "Admin Sunest", "role": "admin"}
   ```
3. **Refresh app** → **Login** → Done!

---

## 🔍 **VERIFY:**

Run this SQL to check:

```sql
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' AS metadata,
  p.role AS profile
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@demo.com';
```

**Must show:**
- metadata: `admin`
- profile: `admin`

---

**Time:** 30 seconds  
**Files:** `/DEBUG_ADMIN_LOGIN.sql`  
**Result:** Admin login works! 🎉
