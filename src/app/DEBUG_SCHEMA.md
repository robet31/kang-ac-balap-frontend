# 🔍 DEBUG: Check Your Vehicles Table Schema

---

## 🎯 **FIRST - Check Vehicles Table Schema!**

Before running dummy data, let's see what columns you actually have:

---

## 📋 **STEP 1: Run This Query**

Copy paste di SQL Editor:

```sql
-- Check vehicles table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'vehicles'
ORDER BY ordinal_position;
```

**Expected columns (one of these patterns):**

### **Pattern A (SETUP_DATABASE.sql):**
```
id              | uuid      | NO
user_id         | uuid      | NO
license_plate   | text      | NO
brand           | text      | NO
model           | text      | NO
year            | integer   | NO
engine_capacity | integer   | YES
color           | text      | YES
created_at      | timestamp | YES
updated_at      | timestamp | YES
```

### **Pattern B (COMPLETE_MIGRATION.sql):**
```
id              | uuid      | NO
customer_id     | uuid      | NO
plate_number    | text      | NO
brand           | text      | NO
model           | text      | NO
year            | integer   | YES
engine_capacity | text      | YES
color           | text      | YES
notes           | text      | YES
is_active       | boolean   | YES
created_at      | timestamp | YES
updated_at      | timestamp | YES
```

---

## ⚠️ **IF TABLE DOESN'T EXIST:**

### **Error:**
```
ERROR: relation "vehicles" does not exist
```

### **Solution:**

Run one of these migrations first:

#### **Option 1: Complete Migration (Recommended)**
```sql
-- Run this in SQL Editor
-- Copy paste from /database/COMPLETE_MIGRATION.sql
```

#### **Option 2: Quick Create**
```sql
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plate_number TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  engine_capacity TEXT,
  color TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Users can view own vehicles
CREATE POLICY "Users can view own vehicles"
  ON public.vehicles FOR SELECT
  USING (customer_id = auth.uid());

-- Admins can view all vehicles
CREATE POLICY "Admins can view all vehicles"
  ON public.vehicles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can insert own vehicles
CREATE POLICY "Users can insert own vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Users can update own vehicles
CREATE POLICY "Users can update own vehicles"
  ON public.vehicles FOR UPDATE
  USING (customer_id = auth.uid());

-- Admins can manage all vehicles
CREATE POLICY "Admins can manage all vehicles"
  ON public.vehicles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## ✅ **AFTER CHECKING SCHEMA:**

### **USE THIS FILE:**

👉 **`/ULTRA_SAFE_DUMMY_DATA.sql`**

**Why?**
- ✅ Auto-detects your schema
- ✅ Works with ANY column names
- ✅ Dynamic SQL based on detection
- ✅ Clear error messages
- ✅ No hardcoded column names

---

## 🚀 **FULL WORKFLOW:**

### **1. Check Schema** (30 seconds)
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vehicles';
```

### **2. If table missing, create it** (1 minute)
```sql
-- Use Quick Create SQL above
-- Or run /database/COMPLETE_MIGRATION.sql
```

### **3. Login users** (30 seconds)
- Login `admin@demo.com` / `password123` → Logout
- Login `customer@demo.com` / `password123` → Logout

### **4. Run Ultra Safe SQL** (1 minute)
```sql
-- Copy paste /ULTRA_SAFE_DUMMY_DATA.sql
-- It will auto-detect and adapt!
```

### **5. Enable Real-Time** (30 seconds)
- Database > Replication > jobs (toggle ON)

---

## 🎯 **EXPECTED OUTPUT:**

When you run `/ULTRA_SAFE_DUMMY_DATA.sql`:

```
NOTICE: 📋 Vehicles table columns: id, customer_id, brand, model, year, plate_number, color, created_at
NOTICE: ✅ Schema detected - Owner column: customer_id, Plate column: plate_number
NOTICE: ✅ Admin ID: xxx-xxx-xxx
NOTICE: ✅ Customer ID: xxx-xxx-xxx
NOTICE: ✅ 3 vehicles created using columns: customer_id and plate_number
NOTICE: ✅ 10 dummy jobs created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DUMMY DATA SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Pending            | 3
📅 Scheduled          | 2
🔧 In Progress        | 2
💰 Awaiting Payment   | 1
✅ Completed          | 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TOTAL JOBS         | 10

🎉 ALL DONE!
```

---

## ❌ **POSSIBLE ERRORS & FIXES:**

### **Error: "Table vehicles does not exist"**
```
❌ Table "vehicles" does not exist! Please run database migration first.
```

**Fix:** Create table using Quick Create SQL above.

---

### **Error: "Cannot find owner column"**
```
❌ Cannot find owner column (customer_id or user_id) in vehicles table!
```

**Fix:** Your vehicles table has a different column for owner. Show me your schema!

---

### **Error: "Cannot find plate column"**
```
❌ Cannot find plate column (plate_number or license_plate) in vehicles table!
```

**Fix:** Your vehicles table has a different column for plate. Show me your schema!

---

### **Error: "Admin user not found"**
```
❌ Admin user not found! Please login as admin@demo.com first.
```

**Fix:** Login as `admin@demo.com` / `password123`, logout, run again.

---

### **Error: "Customer user not found"**
```
❌ Customer user not found! Please login as customer@demo.com first.
```

**Fix:** Login as `customer@demo.com` / `password123`, logout, run again.

---

## 🔧 **DEBUGGING TIPS:**

### **Show me your vehicles schema:**

Run this and paste output:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'vehicles'
ORDER BY ordinal_position;
```

### **Check if users exist:**
```sql
SELECT id, email FROM auth.users 
WHERE email IN ('admin@demo.com', 'customer@demo.com');
```

Should show 2 rows. If empty, login first!

### **Check if profiles exist:**
```sql
SELECT id, email, role FROM public.profiles 
WHERE email IN ('admin@demo.com', 'customer@demo.com');
```

Should show 2 rows with roles.

---

## 📁 **FILES:**

```
✅ /ULTRA_SAFE_DUMMY_DATA.sql    ← USE THIS! (Auto-detect)
📚 /DEBUG_SCHEMA.md              ← This guide
📚 /START_HERE.md                ← Main guide

Old files (ignore):
❌ /COMPLETE_DUMMY_DATA.sql
❌ /DUMMY_DATA_FIXED.sql
❌ /DUMMY_DATA_REALTIME.sql
```

---

## ✅ **CHECKLIST:**

- [ ] Run schema check query
- [ ] Verify vehicles table exists
- [ ] Verify column names (customer_id/user_id, plate_number/license_plate)
- [ ] If missing, create vehicles table
- [ ] Login as admin@demo.com
- [ ] Login as customer@demo.com
- [ ] Run `/ULTRA_SAFE_DUMMY_DATA.sql`
- [ ] Check output: "✅ Schema detected"
- [ ] Check output: "🎉 ALL DONE!"
- [ ] Enable real-time for jobs
- [ ] ✅ Test booking flow!

---

**Sekarang:**
1. **Check schema** (paste query results)
2. **Run** `/ULTRA_SAFE_DUMMY_DATA.sql`
3. **Report** any errors with full output!

Kasih tau hasil schema check ya! 😊
