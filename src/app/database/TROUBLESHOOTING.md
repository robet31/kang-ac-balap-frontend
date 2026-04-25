# 🔧 TROUBLESHOOTING GUIDE - SUNEST AUTO DATABASE

## Common Issues & Solutions

---

## 🚨 **CONNECTION ERRORS**

### **Error: "Failed to fetch"**
```
Problem: App tidak bisa connect ke Supabase

Solutions:
1. Check /utils/supabase/info.tsx:
   - projectId harus match dengan Supabase URL
   - publicAnonKey harus correct

2. Verify credentials:
   - Supabase Dashboard → Settings → API
   - Copy Project URL & Anon key
   - Update info.tsx

3. Check environment variables:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - SUPABASE_ANON_KEY
```

### **Error: "Invalid API key"**
```
Problem: API key salah atau expired

Solutions:
1. Regenerate keys:
   - Supabase → Settings → API
   - Copy new keys
   - Update app config

2. Clear cache:
   - Refresh browser
   - Clear localStorage
   - Re-login
```

---

## 🗄️ **DATABASE ERRORS**

### **Error: "relation does not exist"**
```
Problem: Table belum dibuat

Solutions:
1. Run migration:
   - SQL Editor → New Query
   - Copy COMPLETE_MIGRATION.sql
   - Run script

2. Verify tables:
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';

3. Check specific table:
   SELECT * FROM public.services;
```

### **Error: "permission denied for table"**
```
Problem: RLS policy blocking access

Solutions:
1. Check user role:
   SELECT id, email, role FROM public.profiles;

2. Verify RLS policies exist:
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';

3. Test with admin:
   - Login as admin@sunest.auto
   - If works → RLS issue
   - If not → different problem

4. Re-run migration to fix policies
```

### **Error: "violates foreign key constraint"**
```
Problem: Referenced record doesn't exist

Solutions:
1. Check parent records exist:
   - For vehicles: customer must exist in profiles
   - For job_orders: vehicle, customer, service must exist
   - For job_parts: job_order and inventory must exist

2. Verify IDs:
   SELECT * FROM public.profiles WHERE id = 'uuid';
   SELECT * FROM public.vehicles WHERE id = 'uuid';

3. Create parent record first, then child
```

### **Error: "duplicate key value violates unique constraint"**
```
Problem: Trying to insert duplicate value

Solutions:
1. Check existing records:
   SELECT * FROM public.services WHERE id = 'uuid';
   SELECT * FROM public.inventory WHERE part_sku = 'SKU';

2. Use ON CONFLICT in INSERT:
   INSERT INTO services (id, name, ...) VALUES (...)
   ON CONFLICT (id) DO UPDATE SET ...;

3. Generate new UUID:
   Use uuid_generate_v4() for new records
```

---

## 👤 **AUTHENTICATION ERRORS**

### **Error: "Email not confirmed"**
```
Problem: User email not auto-confirmed

Solutions:
1. Disable email confirmation:
   - Authentication → Settings → Email Auth
   - Toggle OFF "Enable email confirmations"

2. Manually confirm user:
   - Authentication → Users
   - Find user → "..." menu → Confirm email
```

### **Error: "Invalid login credentials"**
```
Problem: Email/password wrong

Solutions:
1. Verify credentials:
   - Check for typos
   - Case-sensitive password

2. Reset password:
   - Authentication → Users → Edit user
   - Set new password

3. Check user exists:
   SELECT * FROM auth.users WHERE email = 'user@example.com';
```

### **Error: "User already registered"**
```
Problem: Email already exists

Solutions:
1. Use different email
2. Delete existing user:
   - Authentication → Users → Delete
3. Or login with existing account
```

---

## 📦 **BOOKING ERRORS**

### **Error: "Stock insufficient"**
```
Problem: Inventory stock too low

Solutions:
1. Check stock:
   SELECT part_name, quantity_in_stock 
   FROM public.inventory 
   WHERE part_sku = 'SKU';

2. Update stock:
   UPDATE public.inventory 
   SET quantity_in_stock = 100 
   WHERE part_sku = 'SKU';

3. Adjust minimum_stock_level:
   UPDATE public.inventory 
   SET minimum_stock_level = 10 
   WHERE part_sku = 'SKU';
```

### **Error: "Service not found"**
```
Problem: Service ID doesn't exist

Solutions:
1. Check services:
   SELECT * FROM public.services;

2. Verify service is active:
   SELECT * FROM public.services WHERE is_active = true;

3. Re-run SEED_DATA.sql if services missing
```

### **Error: "Vehicle not found"**
```
Problem: Vehicle doesn't exist for customer

Solutions:
1. Add vehicle first:
   - Vehicles tab → Add kendaraan
   - Or insert via SQL

2. Check vehicle exists:
   SELECT * FROM public.vehicles WHERE customer_id = 'uuid';

3. Verify vehicle ownership:
   SELECT * FROM public.vehicles 
   WHERE id = 'uuid' AND customer_id = 'uuid';
```

---

## 🔄 **REAL-TIME ERRORS**

### **Error: "Status not updating"**
```
Problem: Real-time updates not working

Solutions:
1. Check auto-refresh running:
   - Should refresh every 5-10 seconds
   - Check browser console for errors

2. Verify endpoint:
   - Test in SQL Editor:
     SELECT * FROM public.job_orders WHERE status = 'pending';

3. Clear cache and reload:
   - Ctrl+Shift+R (hard reload)
   - Clear browser cache

4. Check server endpoint:
   - Test: GET /bookings/customer/:id
   - Verify response in Network tab
```

### **Error: "Inventory not deducting"**
```
Problem: Stock not auto-deducting after booking

Solutions:
1. Check trigger exists:
   SELECT tgname, tgtype 
   FROM pg_trigger 
   WHERE tgname = 'decrement_stock_on_part_use';

2. Re-create trigger:
   - Run COMPLETE_MIGRATION.sql again
   - Or create trigger manually

3. Verify job_parts inserted:
   SELECT * FROM public.job_parts 
   WHERE job_order_id = 'uuid';

4. Check inventory updated:
   SELECT part_name, quantity_in_stock 
   FROM public.inventory 
   WHERE id = 'inventory_id';
```

---

## 💰 **CALCULATION ERRORS**

### **Error: "Total amount incorrect"**
```
Problem: Job order total not calculating

Solutions:
1. Check trigger:
   SELECT tgname FROM pg_trigger 
   WHERE tgname = 'update_job_total_on_parts_change';

2. Manually recalculate:
   UPDATE public.job_orders 
   SET 
     parts_cost = (SELECT SUM(subtotal) FROM job_parts WHERE job_order_id = 'uuid'),
     total_amount = labor_cost + (SELECT SUM(subtotal) FROM job_parts WHERE job_order_id = 'uuid')
   WHERE id = 'uuid';

3. Verify job_parts subtotals:
   SELECT *, (quantity_used * unit_price_at_time) as calculated_subtotal
   FROM public.job_parts 
   WHERE job_order_id = 'uuid';
```

### **Error: "Subtotal null or zero"**
```
Problem: Job parts subtotal not calculated

Solutions:
1. Ensure subtotal is set on INSERT:
   INSERT INTO job_parts (job_order_id, inventory_id, quantity_used, unit_price_at_time, subtotal)
   VALUES ('uuid1', 'uuid2', 1, 35000, 35000); -- subtotal = qty * price

2. Update existing records:
   UPDATE public.job_parts 
   SET subtotal = quantity_used * unit_price_at_time 
   WHERE subtotal IS NULL;

3. Note: subtotal is NOT a generated column anymore
   (changed from GENERATED ALWAYS to regular column)
```

---

## 🔐 **RLS POLICY ERRORS**

### **Error: "new row violates row-level security policy"**
```
Problem: RLS policy blocking INSERT/UPDATE

Solutions:
1. Check user authenticated:
   SELECT auth.uid(); -- Should return UUID

2. Verify user role:
   SELECT role FROM public.profiles WHERE id = auth.uid();

3. Review policy:
   SELECT * FROM pg_policies 
   WHERE tablename = 'table_name';

4. Temporary disable RLS for testing:
   ALTER TABLE public.table_name DISABLE ROW LEVEL SECURITY;
   -- Test insert/update
   ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

5. Re-run migration to fix policies
```

---

## 🧪 **TESTING QUERIES**

### **Test Database Connection:**
```sql
-- Simple query
SELECT NOW();

-- Check tables exist
SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';

-- Test auth
SELECT auth.uid(), auth.email();
```

### **Test Data Exists:**
```sql
-- Count records
SELECT 
  'profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'services', COUNT(*) FROM public.services
UNION ALL
SELECT 'vehicles', COUNT(*) FROM public.vehicles
UNION ALL
SELECT 'inventory', COUNT(*) FROM public.inventory
UNION ALL
SELECT 'job_orders', COUNT(*) FROM public.job_orders;
```

### **Test RLS Policies:**
```sql
-- Check all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### **Test Triggers:**
```sql
-- List all triggers
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as enabled
FROM pg_trigger
WHERE tgname NOT LIKE 'RI_%'
ORDER BY table_name, trigger_name;
```

---

## 🆘 **EMERGENCY FIXES**

### **Nuclear Option: Reset Everything**
```sql
-- ⚠️ WARNING: This deletes ALL data!

-- Drop all tables
DROP TABLE IF EXISTS public.job_updates CASCADE;
DROP TABLE IF EXISTS public.job_parts CASCADE;
DROP TABLE IF EXISTS public.job_orders CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Then re-run:
-- 1. COMPLETE_MIGRATION.sql
-- 2. SEED_DATA.sql
```

### **Reset Just Data:**
```sql
-- Keep structure, delete data only
TRUNCATE TABLE public.job_updates CASCADE;
TRUNCATE TABLE public.job_parts CASCADE;
TRUNCATE TABLE public.job_orders CASCADE;
TRUNCATE TABLE public.vehicles CASCADE;

-- Keep services & inventory (seed data)
-- Then re-run SEED_DATA.sql if needed
```

---

## 📞 **STILL STUCK?**

### **Debug Checklist:**
- [ ] Check Supabase project is active
- [ ] Verify credentials in info.tsx
- [ ] Test queries in SQL Editor
- [ ] Check browser console for errors
- [ ] Review Network tab in DevTools
- [ ] Verify user has correct role
- [ ] Check RLS policies exist
- [ ] Confirm triggers are active

### **Get Logs:**
```
1. Supabase → Database → Logs
2. Look for error messages
3. Check timestamps match your actions
4. Review query patterns
```

### **Test Endpoints:**
```
1. Use Postman or curl
2. Test: GET /health
3. Test: GET /services
4. Test: GET /inventory
5. Check response status & body
```

---

**If all else fails:**
1. Delete Supabase project
2. Create new project
3. Re-run COMPLETE_MIGRATION.sql
4. Re-run SEED_DATA.sql
5. Start fresh!

---

**Last Updated:** February 4, 2026  
**Sunest Auto Platform** - Database Troubleshooting Guide
