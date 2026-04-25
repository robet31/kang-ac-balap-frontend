# 🚨 CREATE DEMO USERS NOW!

## ⚠️ ERROR: "Invalid login credentials"

**Problem:** Demo users belum dibuat di Supabase Auth!

**Solution:** Buat 3 demo users sekarang (2 menit!)

---

## 📍 **GO TO SUPABASE DASHBOARD**

```
1. Open: https://supabase.com/dashboard
2. Select project: ljrlmntctssaiplghkaz
3. Click: "Authentication" (sidebar kiri)
4. Click: "Users" tab
5. Click: "Add user" button (kanan atas)
```

---

## 👥 **CREATE 3 USERS**

### **USER 1: CUSTOMER** ✅

```
Email: customer@test.com
Password: customer123

✅ Auto Confirm User: YES (IMPORTANT!)

User Metadata (click "+ Add field"):
{
  "full_name": "John Doe",
  "role": "customer"
}

Click "Create user"
```

---

### **USER 2: ADMIN** ✅

```
Email: admin@sunest.auto
Password: admin123

✅ Auto Confirm User: YES (IMPORTANT!)

User Metadata:
{
  "full_name": "Admin Sunest",
  "role": "admin"
}

Click "Create user"
```

---

### **USER 3: TECHNICIAN** ✅

```
Email: technician@sunest.auto
Password: tech123

✅ Auto Confirm User: YES (IMPORTANT!)

User Metadata:
{
  "full_name": "Budi Teknisi",
  "role": "technician"
}

Click "Create user"
```

---

## ⚠️ **IMPORTANT NOTES:**

### **1. Auto Confirm User:**
- ✅ **MUST be checked!**
- If not checked → user needs email confirmation
- We don't have email configured yet
- So always check this!

### **2. User Metadata:**
- ✅ **MUST include "role" field!**
- Format: `{"full_name": "Name", "role": "customer"}`
- This is used by RLS policies
- Without role → permission denied errors

### **3. Password Requirements:**
- Minimum 6 characters
- No special characters required
- Case sensitive

---

## 🧪 **VERIFY USERS CREATED**

### **Option 1: Supabase Dashboard**
```
Authentication → Users
Should show 3 users with green status
```

### **Option 2: SQL Editor**
```sql
-- Check auth users
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Check profiles (auto-created by trigger)
SELECT id, full_name, email, role 
FROM public.profiles 
ORDER BY created_at DESC;
```

**Expected:**
- 3 rows in auth.users
- 3 rows in public.profiles
- All with email_confirmed_at NOT NULL

---

## ✅ **AFTER USERS CREATED**

### **Test Login:**

1. **Refresh your app** (Ctrl+R)
2. **Click "Login"**
3. **Try customer login:**
   ```
   Email: customer@test.com
   Password: customer123
   ```
4. **Should redirect to Customer Dashboard!** 🎉

---

## 🔥 **QUICK COPY-PASTE**

### **Customer User:**
```
Email: customer@test.com
Password: customer123
Metadata: {"full_name": "John Doe", "role": "customer"}
```

### **Admin User:**
```
Email: admin@sunest.auto
Password: admin123
Metadata: {"full_name": "Admin Sunest", "role": "admin"}
```

### **Technician User:**
```
Email: technician@sunest.auto
Password: tech123
Metadata: {"full_name": "Budi Teknisi", "role": "technician"}
```

---

## 🎯 **STEP-BY-STEP SCREENSHOTS**

### **1. Click "Add user":**
```
[+ Add user] button → kanan atas
```

### **2. Fill form:**
```
Email: [enter email]
Password: [enter password]
✅ Auto Confirm User: YES
✅ User Metadata: 
   Key: full_name, Value: John Doe
   Key: role, Value: customer
```

### **3. Click "Create user"**
```
User will appear in list immediately
```

### **4. Repeat for other 2 users**
```
Total: 3 users (customer, admin, technician)
```

---

## ⚠️ **TROUBLESHOOTING**

### **Error: "User already exists"**
```
Solution: User already created! Skip this user.
```

### **Error: "Invalid email"**
```
Solution: Check email format (must have @ and .)
```

### **Error: "Password too short"**
```
Solution: Use at least 6 characters
```

### **User created but login fails:**
```
Solution:
1. Check "Auto Confirm User" was checked
2. Verify password is correct (case sensitive)
3. Check user metadata has "role" field
4. Try SQL: SELECT * FROM auth.users WHERE email = 'email@test.com';
```

### **Permission denied after login:**
```
Solution:
1. Check profiles table: SELECT * FROM public.profiles;
2. Verify role field exists and correct
3. Re-run COMPLETE_MIGRATION.sql if needed
```

---

## 🎊 **DONE!**

After creating 3 users:
- ✅ Login should work
- ✅ Customer dashboard accessible
- ✅ Admin dashboard accessible
- ✅ Technician app accessible

**GO CREATE USERS NOW! Takes only 2 minutes! 🚀**

---

**Current Database:** ljrlmntctssaiplghkaz.supabase.co  
**Status:** ⏳ Waiting for users to be created  
**Next:** Test login with customer@test.com
