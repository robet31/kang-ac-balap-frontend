# 👥 CREATE DEMO USERS (1 MINUTE!)

---

## 🎯 **GO TO SUPABASE AUTH**

Click this link:
👉 **https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users**

---

## ➕ **CLICK "Add user" BUTTON** (kanan atas)

---

## 📝 **CREATE 2 USERS**

### **USER 1 - CUSTOMER** 👤

Fill the form:

```
Email:
customer@demo.com

Password:
password123

✅ Auto Confirm User
(CENTANG INI! WAJIB!)

User Metadata (click "+ Add field"):
Click "JSON" tab, paste this:
{
  "full_name": "John Customer",
  "role": "customer"
}
```

**Click "Create user"** → Done! ✅

---

### **USER 2 - ADMIN** 👨‍💼

Click **"Add user"** again:

```
Email:
admin@demo.com

Password:
password123

✅ Auto Confirm User
(CENTANG INI! WAJIB!)

User Metadata:
Click "JSON" tab, paste this:
{
  "full_name": "Admin Sunest",
  "role": "admin"
}
```

**Click "Create user"** → Done! ✅

---

## ✅ **VERIFY**

You should now see **2 users** in the list:
```
✅ customer@demo.com
✅ admin@demo.com
```

---

## 🧪 **TEST LOGIN**

1. **Refresh your app** (F5)
2. **Click "Login"**
3. **Enter:**
   ```
   Email: customer@demo.com
   Password: password123
   ```
4. **Click "Login"**
5. **✅ SUCCESS!** Should see Customer Dashboard! 🎉

---

## 📋 **COPY-PASTE VALUES**

**Customer Metadata:**
```json
{"full_name": "John Customer", "role": "customer"}
```

**Admin Metadata:**
```json
{"full_name": "Admin Sunest", "role": "admin"}
```

---

## ⚠️ **IMPORTANT REMINDERS:**

1. ✅ **Auto Confirm User MUST be checked!**
   - If not → email verification needed
   - We don't have email configured

2. ✅ **User Metadata MUST include "role"!**
   - Without role → permission denied
   - Format: JSON with full_name and role

3. ✅ **Use exact emails above!**
   - App shows these in demo box
   - Don't change emails

---

## 🔗 **QUICK LINK**

https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users

---

**Total time:** 1 minute  
**Users needed:** 2 (customer + admin)  
**Then:** Login and enjoy! 🚀
