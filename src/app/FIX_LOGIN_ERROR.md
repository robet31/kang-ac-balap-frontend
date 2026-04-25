# 🔧 FIX: Invalid Login Credentials

---

## 🚨 **ERROR:**
```
AuthApiError: Invalid login credentials
```

---

## ✅ **SOLUTION: Create Demo Users**

**Time needed:** 2 minutes

---

## 📍 **STEP 1: Go to Supabase**

Click this link:
👉 **https://supabase.com/dashboard/project/ljrlmntctssaiplghkaz/auth/users**

Or manually:
1. https://supabase.com/dashboard
2. Select project: ljrlmntctssaiplghkaz
3. Click "Authentication" → "Users"

---

## 👤 **STEP 2: Click "Add user" (kanan atas)**

You'll see a form. Fill it **3 times** for 3 users.

---

## 📝 **STEP 3: Create 3 Users**

### **USER 1 - CUSTOMER:**

```
┌─────────────────────────────────────┐
│ Email:                              │
│ customer@test.com                   │
│                                     │
│ Password:                           │
│ customer123                         │
│                                     │
│ ✅ Auto Confirm User (CHECK THIS!) │
│                                     │
│ User Metadata (click "+ Add"):     │
│   full_name: John Doe              │
│   role: customer                   │
│                                     │
│ [Create user]                      │
└─────────────────────────────────────┘
```

Click **"Create user"** → User 1 done! ✅

---

### **USER 2 - ADMIN:**

```
┌─────────────────────────────────────┐
│ Email:                              │
│ admin@sunest.auto                   │
│                                     │
│ Password:                           │
│ admin123                            │
│                                     │
│ ✅ Auto Confirm User (CHECK THIS!) │
│                                     │
│ User Metadata:                     │
│   full_name: Admin Sunest          │
│   role: admin                      │
│                                     │
│ [Create user]                      │
└─────────────────────────────────────┘
```

Click **"Create user"** → User 2 done! ✅

---

### **USER 3 - TECHNICIAN:**

```
┌─────────────────────────────────────┐
│ Email:                              │
│ technician@sunest.auto              │
│                                     │
│ Password:                           │
│ tech123                             │
│                                     │
│ ✅ Auto Confirm User (CHECK THIS!) │
│                                     │
│ User Metadata:                     │
│   full_name: Budi Teknisi          │
│   role: technician                 │
│                                     │
│ [Create user]                      │
└─────────────────────────────────────┘
```

Click **"Create user"** → User 3 done! ✅

---

## ✅ **STEP 4: Verify**

You should now see **3 users** in the list:
```
✅ customer@test.com
✅ admin@sunest.auto
✅ technician@sunest.auto
```

---

## 🧪 **STEP 5: Test Login**

1. **Refresh your app** (press F5 or Ctrl+R)
2. **Click "Login" button**
3. **Enter:**
   ```
   Email: customer@test.com
   Password: customer123
   ```
4. **Click "Login"**
5. **✅ SUCCESS! Should see Customer Dashboard!** 🎉

---

## 🎯 **WHAT IF IT STILL FAILS?**

### **Check 1: Users created?**
```sql
-- Run in SQL Editor:
SELECT email, email_confirmed_at FROM auth.users;
```
Should show 3 users with confirmed dates.

### **Check 2: Auto Confirm checked?**
- Go back to Authentication → Users
- Click on user → Check if "Email Confirmed" = Yes
- If No → Click "..." menu → "Confirm email"

### **Check 3: User Metadata correct?**
```sql
-- Run in SQL Editor:
SELECT * FROM public.profiles;
```
Should show 3 profiles with correct roles.

### **Check 4: Re-create user**
If all else fails:
1. Delete user (... menu → Delete)
2. Create again with correct metadata
3. Make sure to check "Auto Confirm User"!

---

## 📋 **COPY-PASTE VALUES**

For easy copy-paste:

**Customer:**
```
email: customer@test.com
password: customer123
metadata: {"full_name": "John Doe", "role": "customer"}
```

**Admin:**
```
email: admin@sunest.auto
password: admin123
metadata: {"full_name": "Admin Sunest", "role": "admin"}
```

**Technician:**
```
email: technician@sunest.auto
password: tech123
metadata: {"full_name": "Budi Teknisi", "role": "technician"}
```

---

## ⚠️ **IMPORTANT REMINDERS:**

1. ✅ **Always check "Auto Confirm User"**
   - If unchecked → email verification needed
   - We don't have email configured yet

2. ✅ **Always add User Metadata**
   - Format: JSON with "full_name" and "role"
   - Role must be: customer, admin, or technician
   - Without role → permission denied errors

3. ✅ **Password minimum 6 characters**
   - Use simple passwords for demo
   - Case sensitive!

---

## 🎊 **DONE!**

After creating 3 users:
- ✅ Login error fixed
- ✅ Can access dashboard
- ✅ Can book services
- ✅ Real-time system working

**You're all set! 🚀**

---

**Quick Link:** https://supabase.com/dashboard/project/ljrlmntctssaiplghkaz/auth/users

**Status:** ⏳ Waiting for users to be created  
**Next:** Test login and start booking!
