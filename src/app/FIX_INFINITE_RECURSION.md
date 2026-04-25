# 🔥 FIX INFINITE RECURSION ERROR (10 SECONDS!)

---

## 🚨 **ERROR:**
```
infinite recursion detected in policy for relation "profiles"
```

---

## ✅ **SOLUTION: Run This SQL** (10 seconds!)

1. **Go to SQL Editor:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql

2. **Click "New query"**

3. **Copy ENTIRE `/FIX_RLS_POLICIES.sql`** file

4. **Paste & Click "Run"**

5. **✅ DONE!** Error fixed!

---

## 🧪 **TEST AGAIN:**

1. **Refresh app** (Ctrl+Shift+R untuk hard refresh)
2. **Login:** `customer@demo.com` / `password123`
3. **✅ Should work now!** No more infinite recursion!

---

## 📋 **WHAT WAS THE PROBLEM?**

**Old Policy (BAD):**
```sql
-- This checks profiles table to see if user is admin
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  -- ❌ CIRCULAR! Checking profiles table triggers same policy → infinite loop!
);
```

**New Policy (FIXED):**
```sql
-- This checks JWT token directly, no table query!
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  -- ✅ NO CIRCULAR! Checks JWT token directly, no table access!
);
```

---

## 🎯 **KEY CHANGE:**

- ❌ **Before:** Query `profiles` table to check role → circular reference
- ✅ **After:** Check `auth.jwt()` token metadata → no table access!

---

## ⚠️ **IMPORTANT:**

After running fix, **user metadata must have "role" field!**

When creating users, make sure metadata is:
```json
{"full_name": "John Customer", "role": "customer"}
```

The `role` field is stored in JWT token and used by policies!

---

## 🔗 **QUICK LINK:**

**SQL Editor:**  
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql

**File to run:**  
`/FIX_RLS_POLICIES.sql`

---

**Time:** 10 seconds  
**Action:** Copy file → Paste → Run  
**Result:** Infinite recursion fixed! 🎉
