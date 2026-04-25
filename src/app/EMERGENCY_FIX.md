# ⚡ EMERGENCY FIX - Schema Mismatch

---

## ❌ **YOUR ERROR:**
```
ERROR: 42703: column "plate_number" does not exist
QUERY: SELECT id FROM public.vehicles WHERE plate_number = 'B 1234 XYZ'
```

**Meaning:** Your vehicles table uses DIFFERENT column names!

---

## 🎯 **2-STEP EMERGENCY FIX:**

### **STEP 1: Check Your Schema** (10 seconds)

Run this in SQL Editor:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'vehicles' 
ORDER BY ordinal_position;
```

**Paste the result here so I can help!**

---

### **STEP 2: Use Ultra Safe SQL** (2 minutes)

**File:** `/ULTRA_SAFE_DUMMY_DATA.sql`

**This file:**
- ✅ AUTO-DETECTS your schema
- ✅ Works with ANY column names
- ✅ Dynamic SQL
- ✅ No hardcoded names

**Just:**
1. Login `admin@demo.com` → Logout
2. Login `customer@demo.com` → Logout  
3. Copy **entire** `/ULTRA_SAFE_DUMMY_DATA.sql`
4. Paste in SQL Editor
5. Run!

**It will adapt to YOUR schema automatically!**

---

## 🔍 **LIKELY SCENARIOS:**

### **Scenario 1: Table doesn't exist**

**Check:**
```sql
SELECT * FROM public.vehicles LIMIT 1;
```

**Error: "relation vehicles does not exist"**

**Fix:** Create table first:

```sql
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  plate_number TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vehicles"
  ON public.vehicles FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Admins can view all"
  ON public.vehicles FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));
```

Then run `/ULTRA_SAFE_DUMMY_DATA.sql`.

---

### **Scenario 2: Different column names**

**Your table might use:**
- `user_id` instead of `customer_id`
- `license_plate` instead of `plate_number`
- `registration` instead of `plate_number`
- Something else!

**Solution:** Run schema check (STEP 1 above) and paste result!

The `/ULTRA_SAFE_DUMMY_DATA.sql` will detect and adapt.

---

### **Scenario 3: Wrong migration file**

**Check which migration you ran:**
- `/SETUP_DATABASE.sql` uses: `user_id`, `license_plate`
- `/database/COMPLETE_MIGRATION.sql` uses: `customer_id`, `plate_number`
- `/database/migration.sql` uses: `customer_id`, `plate_number`

**Solution:** 
1. Check current schema
2. Run `/ULTRA_SAFE_DUMMY_DATA.sql` (auto-adapts!)

---

## 🚀 **QUICK TEST:**

### **Test 1: Does table exist?**
```sql
SELECT COUNT(*) FROM public.vehicles;
```

✅ Success: Returns a number (even 0)  
❌ Error: "relation vehicles does not exist"

---

### **Test 2: What columns exist?**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'vehicles';
```

✅ Success: Shows list of columns  
❌ Error: Empty (table doesn't exist)

---

### **Test 3: Do users exist?**
```sql
SELECT email FROM auth.users 
WHERE email IN ('admin@demo.com', 'customer@demo.com');
```

✅ Success: Shows 2 emails  
❌ Error: Empty (need to login first)

---

## 📋 **COMPLETE WORKFLOW:**

### **1. Check if table exists** (10 sec)
```sql
SELECT COUNT(*) FROM public.vehicles;
```

### **2. If missing, create it** (30 sec)
```sql
-- Use Quick Create SQL from Scenario 1
```

### **3. Check schema** (10 sec)
```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'vehicles';
```

### **4. Login users** (30 sec)
- Admin & customer login/logout

### **5. Run Ultra Safe SQL** (1 min)
- Copy `/ULTRA_SAFE_DUMMY_DATA.sql`
- Paste & Run

### **6. Check output** (5 sec)
Should see:
```
NOTICE: ✅ Schema detected - Owner column: xxx, Plate column: xxx
🎉 ALL DONE!
```

---

## 🆘 **STILL ERROR?**

**Do this:**

1. **Run schema check:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
ORDER BY ordinal_position;
```

2. **Paste the result here**

3. **I'll create custom SQL for your exact schema!**

---

## 📁 **FILES TO USE:**

```
Priority 1:
✅ /ULTRA_SAFE_DUMMY_DATA.sql    ← Try this first!

If still error:
📚 /DEBUG_SCHEMA.md              ← Read this
📚 /EMERGENCY_FIX.md             ← You are here

Then report:
🆘 Paste your schema check result
```

---

## 💡 **WHY THIS HAPPENS:**

Different migration files use different schemas:

| File | Owner Column | Plate Column |
|------|-------------|--------------|
| SETUP_DATABASE.sql | user_id | license_plate |
| COMPLETE_MIGRATION.sql | customer_id | plate_number |
| migration.sql | customer_id | plate_number |

Your database might have mixed schemas or partial migrations!

**Solution:** `/ULTRA_SAFE_DUMMY_DATA.sql` detects and adapts to ANY schema!

---

## ✅ **ACTION ITEMS:**

Right now:

1. [ ] Run schema check (paste result)
2. [ ] Login admin & customer
3. [ ] Run `/ULTRA_SAFE_DUMMY_DATA.sql`
4. [ ] Report any error with FULL output
5. [ ] Include NOTICES from PostgreSQL

---

**Sekarang:**
1. Copy query from STEP 1
2. Run in SQL Editor
3. **Paste hasil nya ke chat**
4. Saya buatkan SQL yang pas untuk schema kamu!

Tunggu hasil schema check ya! 😊
