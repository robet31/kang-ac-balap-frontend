# ⚡ QUICK FIX: Admin Masuk Customer Dashboard (30 DETIK!)

---

## 🎯 **LAKUKAN SEKARANG:**

### **1. Run Fix SQL** (15 detik)

👉 **https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql**

1. New query
2. Copy `/FIX_ADMIN_ROUTING.sql`
3. Paste & Run
4. Check: Should see "✅ ADMIN - Should go to Admin Dashboard"

---

### **2. Test Login + Check Console** (15 detik)

1. **Open Console:** Press **F12**
2. **Hard Refresh:** **Ctrl+Shift+R**
3. **Logout** if logged in
4. **Login:** `admin@demo.com` / `password123`

**Check Console Logs:**
```
Profile role: admin         ← MUST BE "admin"
✅ Navigating to ADMIN dashboard
```

5. **✅ Should see Admin Dashboard!**

---

## 🔍 **QUICK DEBUG:**

**If still goes to Customer Dashboard:**

Check console - if shows:
```
Profile role: customer  ← ❌ WRONG!
```

**Fix manually:**

👉 **https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql**

```sql
-- Force fix admin role
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@demo.com';
```

Run → Hard refresh → Login again → ✅ Should work!

---

## ✅ **CHECKLIST:**

- [ ] Run `/FIX_ADMIN_ROUTING.sql`
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Open Console (F12)
- [ ] Login as admin
- [ ] See `Profile role: admin` in console
- [ ] See Admin Dashboard (not Customer)
- [ ] ✅ Done!

---

**Time:** 30 seconds  
**Result:** Admin → Admin Dashboard ✅

**Full guide:** `/FIX_WRONG_DASHBOARD.md`
