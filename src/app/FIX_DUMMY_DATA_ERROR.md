# 🔧 FIX: Dummy Data SQL Error

---

## ❌ **ERROR:**
```
ERROR: 42703: column "name" of relation "vehicles" does not exist
```

---

## ✅ **SOLUTION:**

### **Gunakan file yang sudah difix:**

**File:** `/DUMMY_DATA_FIXED.sql`

**Features:**
- ✅ Auto-detects schema (customer_id OR user_id)
- ✅ Supports plate_number OR license_plate
- ✅ Clear error messages if users don't exist
- ✅ Better verification output

---

## 🚀 **HOW TO USE:**

### **STEP 1: Make sure users exist**

Kalau belum pernah login, lakukan ini dulu:

1. **Login sebagai admin:**
   - Email: `admin@demo.com`
   - Password: `password123`
   - Logout

2. **Login sebagai customer:**
   - Email: `customer@demo.com`
   - Password: `password123`
   - Logout

**Ini penting!** SQL script butuh user IDs dari auth.users table.

---

### **STEP 2: Run Fixed SQL**

1. **Open SQL Editor:**
   👉 https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql

2. **New query**

3. **Copy seluruh `/DUMMY_DATA_FIXED.sql`**

4. **Paste & Run**

5. **Check output:**
   ```
   📊 DUMMY DATA CREATED!
   
   ⏳ Pending: 3
   📅 Scheduled: 2
   🔧 In Progress: 2
   💰 Awaiting Payment: 1
   ✅ Completed: 2
   📊 Total: 10
   
   🎉 All done! 10 dummy jobs created.
   ```

---

## ⚠️ **TROUBLESHOOTING:**

### **Error: "Admin user not found"**

**Solution:**
1. Login ke aplikasi sebagai `admin@demo.com` / `password123`
2. Logout
3. Run SQL lagi

### **Error: "Customer user not found"**

**Solution:**
1. Login ke aplikasi sebagai `customer@demo.com` / `password123`
2. Logout
3. Run SQL lagi

### **Error: "relation vehicles does not exist"**

**Solution:**
1. Run `/SETUP_DATABASE.sql` first
2. Or run `/database/COMPLETE_MIGRATION.sql`
3. Then run `/DUMMY_DATA_FIXED.sql`

### **Error: "relation jobs does not exist"**

**Solution:**
Table `jobs` doesn't exist yet. Need to create it first.

**Quick fix SQL:**
```sql
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  job_number TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN (
    'pending', 'scheduled', 'in_progress', 
    'awaiting_payment', 'completed', 'cancelled'
  )),
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP,
  amount DECIMAL(10,2) NOT NULL,
  progress INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📋 **VERIFICATION:**

After running SQL, verify:

```sql
-- Check vehicles
SELECT COUNT(*) FROM public.vehicles;
-- Should return: 3

-- Check jobs by status
SELECT status, COUNT(*) 
FROM public.jobs 
WHERE job_number LIKE 'DEMO%'
GROUP BY status;

-- Expected:
-- pending: 3
-- scheduled: 2
-- in_progress: 2
-- awaiting_payment: 1
-- completed: 2
```

---

## ✅ **FILES:**

```
❌ /DUMMY_DATA_REALTIME.sql    - OLD (has bugs)
✅ /DUMMY_DATA_FIXED.sql        - USE THIS! (fixed)
📚 /FIX_DUMMY_DATA_ERROR.md     - This guide
```

---

## 🎯 **NEXT STEPS:**

After dummy data created:

1. **Enable Real-Time:**
   - Go to: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/database/replication
   - Find table: `jobs`
   - Toggle ON
   - Save

2. **Test Real-Time Flow:**
   - Login as customer → Create booking
   - Login as admin (incognito) → See pending
   - Admin approve
   - Customer modal auto-updates ✨

---

**Total time:** 2 minutes  
**Result:** 10 dummy jobs ready for testing! 🚀
