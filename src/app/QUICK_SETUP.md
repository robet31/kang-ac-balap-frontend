# 🚀 SUNEST AUTO - QUICK SETUP (3 MINUTES!)

---

## ✅ **CREDENTIALS** (DONE! ✓)

```
✅ Project: tvugghippwvoxsjqyxkr
✅ URL: https://tvugghippwvoxsjqyxkr.supabase.co
✅ Credentials updated in app
```

---

## 🗃️ **STEP 1: Run Database Setup** (30 seconds)

### **Copy & Run SQL:**

1. **Open SQL Editor:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql

2. **Click "New query"**

3. **Copy ENTIRE `/SETUP_DATABASE.sql`** file content

4. **Paste into SQL Editor**

5. **Click "Run"** (kanan bawah)

6. **Wait ~10 seconds**

7. **✅ Done!** Should see success messages

---

## 🔥 **STEP 2: Fix RLS Policies** (10 seconds)

**IMPORTANT:** This fixes infinite recursion error!

1. **SQL Editor** (same place)

2. **New query**

3. **Copy `/FIX_RLS_POLICIES.sql`**

4. **Paste & Run**

5. **✅ Done!** Should see "RLS Policies fixed!"

---

## 👥 **STEP 3: Create Demo Users** (1 minute)

### **Quick Guide:**

1. **Go to Auth:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users

2. **Click "Add user"** (kanan atas)

3. **Create USER 1 - CUSTOMER:**
   ```
   Email: customer@demo.com
   Password: password123
   ✅ Auto Confirm User: YES
   
   User Metadata (JSON tab):
   {"full_name": "John Customer", "role": "customer"}
   ```
   Click **"Create user"**

4. **Click "Add user"** again

5. **Create USER 2 - ADMIN:**
   ```
   Email: admin@demo.com
   Password: password123
   ✅ Auto Confirm User: YES
   
   User Metadata (JSON tab):
   {"full_name": "Admin Sunest", "role": "admin"}
   ```
   Click **"Create user"**

6. **✅ Done!** Should see 2 users in list

📄 **Detailed guide:** See `/CREATE_USERS.md`

---

## 🔧 **STEP 4: Sync Profiles** (10 seconds)

**This ensures profiles are created correctly:**

1. **SQL Editor**

2. **New query**

3. **Copy `/DEBUG_ADMIN_LOGIN.sql`**

4. **Paste & Run**

5. **Check output** - should show "✅ OK" for both users

6. **✅ Done!**

---

## 🧪 **STEP 5: Test Login** (30 seconds)

### **Test Customer:**

1. **Refresh app** (Ctrl+Shift+R - hard refresh!)
2. **Click "Login"**
3. **Enter:**
   ```
   Email: customer@demo.com
   Password: password123
   ```
4. **Click "Login"**
5. **✅ Should see Customer Dashboard!** 🎉

### **Test Admin:**

1. **Logout**
2. **Login with:**
   ```
   Email: admin@demo.com
   Password: password123
   ```
3. **✅ Should see Admin Dashboard!** 🎉

---

## 🎯 **DEMO CREDENTIALS**

```
CUSTOMER:
Email: customer@demo.com
Password: password123
→ Book services, track orders

ADMIN:
Email: admin@demo.com
Password: password123
→ Approve bookings, manage inventory
```

---

## ⚠️ **TROUBLESHOOTING**

### **Problem: Infinite recursion error**
**Solution:** Run `/FIX_RLS_POLICIES.sql`

### **Problem: Admin can't login**
**Solution:** Run `/DEBUG_ADMIN_LOGIN.sql`  
📄 **Guide:** `/QUICK_FIX_ADMIN.md`

### **Problem: Customer can't login**
**Solution:** 
1. Check user metadata has `"role": "customer"`
2. Run `/DEBUG_ADMIN_LOGIN.sql`

### **Problem: Login works but no redirect**
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check console for errors (F12)

---

## ✅ **VERIFY SETUP**

Run in SQL Editor:

```sql
-- Should show 2 users with correct roles
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' AS metadata,
  p.role AS profile,
  CASE 
    WHEN p.id IS NULL THEN '❌ NO PROFILE'
    WHEN p.role != u.raw_user_meta_data->>'role' THEN '⚠️ MISMATCH'
    ELSE '✅ OK'
  END AS status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
```

**Expected:**
```
customer@demo.com | customer | customer | ✅ OK
admin@demo.com    | admin    | admin    | ✅ OK
```

---

## 🎊 **WHAT'S INCLUDED**

✅ **7 Tables:** profiles, services, vehicles, inventory, job_orders, job_parts, job_updates  
✅ **Security:** RLS policies enabled (no infinite recursion!)  
✅ **Automation:** Auto triggers for inventory & timestamps  
✅ **Data:** 4 services + 25 inventory items  
✅ **Users:** 2 demo accounts ready to use  
✅ **Fixed:** All common login issues!

---

## 🔥 **NEXT STEPS**

### **Test Customer Flow:**
1. Login as customer@demo.com
2. Add vehicle (e.g., Honda Beat, B1234XYZ)
3. Book service (choose Hemat Service)
4. Check tracking tab

### **Test Admin Flow:**
1. Login as admin@demo.com
2. Go to Bookings tab
3. See customer's pending booking
4. Approve & set schedule
5. Customer can see status update in tracking!

---

## 📁 **FILES REFERENCE**

```
/SETUP_DATABASE.sql          ← Step 1: Database schema + seed data
/FIX_RLS_POLICIES.sql        ← Step 2: Fix infinite recursion
/CREATE_USERS.md             ← Step 3: User creation guide
/DEBUG_ADMIN_LOGIN.sql       ← Step 4: Sync profiles
/QUICK_FIX_ADMIN.md          ← Admin login troubleshooting
/FIX_INFINITE_RECURSION.md   ← RLS policy explanation
/QUICK_SETUP.md              ← This file
```

---

## 🎯 **COMPLETE CHECKLIST**

- [ ] Run `/SETUP_DATABASE.sql`
- [ ] Run `/FIX_RLS_POLICIES.sql`
- [ ] Create customer@demo.com user
- [ ] Create admin@demo.com user
- [ ] Run `/DEBUG_ADMIN_LOGIN.sql`
- [ ] Hard refresh app (Ctrl+Shift+R)
- [ ] Test customer login
- [ ] Test admin login
- [ ] Book a service as customer
- [ ] Approve booking as admin
- [ ] ✅ Everything works!

---

## 🔗 **QUICK LINKS**

**SQL Editor:**  
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql

**Auth Users:**  
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users

**Database Tables:**  
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/database/tables

---

## 🚀 **READY?**

**Total time:** 3 minutes  
**Steps:** 5 easy steps  
**Result:** Fully working system with no errors!

**Start now:** 
1. Copy `/SETUP_DATABASE.sql` → Run
2. Copy `/FIX_RLS_POLICIES.sql` → Run  
3. Create 2 users
4. Copy `/DEBUG_ADMIN_LOGIN.sql` → Run
5. Refresh & Login! 💪

**Need help?** All troubleshooting guides included! 📚