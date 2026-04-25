# 🚨 URGENT: Database Migration Required

## ❌ Current Error:

```
Could not find the 'customer_name' column of 'jobs' in the schema cache
```

## 🔍 Root Cause:

Table `jobs` tidak memiliki columns yang dibutuhkan untuk admin manual job creation:
- ❌ `customer_name` - MISSING
- ❌ `vehicle_name` - MISSING  
- ❌ `package_name` - MISSING

## ✅ Solution: Run Migration SQL

### 📋 Step-by-Step Instructions:

#### 1. **Open Supabase Dashboard**
```
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr
```

#### 2. **Click "SQL Editor"** (Left Sidebar)

#### 3. **Click "New Query"**

#### 4. **Copy & Paste This SQL:**

```sql
-- Add missing columns for admin manual job creation
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS customer_name TEXT;

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS vehicle_name TEXT;

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS package_name TEXT;

-- Add documentation comments
COMMENT ON COLUMN jobs.customer_name IS 'Manual customer name input from admin (when user_id is null)';
COMMENT ON COLUMN jobs.vehicle_name IS 'Manual vehicle name input from admin (when vehicle_id is null)';
COMMENT ON COLUMN jobs.package_name IS 'Service package name (e.g., Basic Tune-Up, Premium Service)';
```

#### 5. **Click "RUN"** or Press **Ctrl+Enter**

#### 6. **Verify Success**

You should see:
```
Success. No rows returned
```

#### 7. **Verify Columns Added** (Optional)

Run this query to check:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'jobs' 
  AND column_name IN ('customer_name', 'vehicle_name', 'package_name')
ORDER BY column_name;
```

Should return:
```
customer_name | text | YES
package_name  | text | YES
vehicle_name  | text | YES
```

---

## 🎯 What These Columns Do:

### `customer_name` (TEXT, NULLABLE)
**Purpose:** Store customer name for walk-in customers (no user registration required)

**Example:** "Budi Santoso"

**Use Case:**
- Admin creates job manually
- Customer not registered in system
- No `user_id` relation needed

---

### `vehicle_name` (TEXT, NULLABLE)
**Purpose:** Store vehicle info as text (no vehicle registration required)

**Example:** "Honda Beat - B 1234 ABC"

**Use Case:**
- Admin creates job manually
- Vehicle not registered in system
- No `vehicle_id` relation needed

---

### `package_name` (TEXT, NULLABLE)
**Purpose:** Store selected service package name

**Example:** "Basic Tune-Up", "Premium Service", "Custom Service"

**Use Case:**
- Display package name in job list
- Track which package was selected
- For admin dashboard analytics

---

## 📊 Data Model Comparison:

### Before (Customer App - With Relations):
```json
{
  "user_id": "uuid-123",           // FK to users table
  "vehicle_id": "uuid-456",        // FK to vehicles table
  "customer_name": null,           // Not used
  "vehicle_name": null,            // Not used
  "service_type": "Basic Tune-Up",
  "package_name": "Basic Tune-Up"
}
```

### After (Admin Manual - No Relations):
```json
{
  "user_id": null,                      // No user relation
  "vehicle_id": null,                   // No vehicle relation
  "customer_name": "Budi Santoso",      // ✅ Manual input
  "vehicle_name": "Honda Beat - B 1234 ABC",  // ✅ Manual input
  "service_type": "Custom Service (Admin)",
  "package_name": "Custom Service"
}
```

---

## 🚀 After Migration:

1. ✅ Columns will be added to `jobs` table
2. ✅ Admin can create jobs with manual input
3. ✅ No user/vehicle registration required
4. ✅ Form will work successfully

---

## 🧪 Test After Migration:

1. Go to Admin Dashboard
2. Click "Job Orders" tab
3. Click "Buat Job Baru"
4. Fill form:
   - Atas Nama: "Test Customer"
   - Nama Kendaraan: "Test Vehicle"
   - Select date & time
5. Click "Buat Job Order"
6. ✅ Should succeed!

---

## ⚠️ Important Notes:

- **These columns are NULLABLE** - they're only used for admin manual input
- **Customer bookings** will still use `user_id` and `vehicle_id` relations
- **Backward compatible** - existing jobs won't be affected
- **No data loss** - safe to run

---

## 📁 Files Updated:

1. `/supabase/functions/server/index.tsx` - Server endpoint
2. `/pages/admin/create-job.tsx` - Admin form
3. `/DATABASE_MIGRATION_COMPLETE.sql` - Migration script
4. `/MIGRATION_INSTRUCTIONS.md` - This file

---

## ✅ Checklist:

- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Paste migration SQL
- [ ] Run query
- [ ] Verify success (no errors)
- [ ] Test create job form
- [ ] Confirm job created successfully

---

**Status:** 🚨 BLOCKED - Migration required before system can work  
**Priority:** 🔴 CRITICAL  
**Time Required:** ~2 minutes  
**Risk:** ✅ LOW - Safe migration, backward compatible

---

## Need Help?

If you encounter any issues:

1. **Check Supabase project is active**
2. **Verify you have admin permissions**
3. **Check SQL syntax** (copy-paste exactly as shown)
4. **Look for error messages** in SQL Editor
5. **Share error details** if migration fails

---

## Quick Copy-Paste SQL:

```sql
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS package_name TEXT;
```

That's it! Just 3 lines. Copy, paste, run. Done! ✨
