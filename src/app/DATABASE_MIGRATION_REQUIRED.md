# ⚠️ DATABASE MIGRATION REQUIRED

## Problem
QR Scanner tidak bisa update status booking karena database constraint `job_orders_status_check` di production database belum include status yang diperlukan.

## Error Message
```
new row for relation "job_orders" violates check constraint "job_orders_status_check"
```

## Solution: Run Migration Script

### 1. Login ke Supabase Dashboard
Go to: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr

### 2. Open SQL Editor
- Sidebar → SQL Editor
- Click "New Query"

### 3. Run This Migration Script

```sql
-- ============================================
-- FIX: Update job_orders status constraint
-- ============================================

-- Drop old constraint if exists
ALTER TABLE public.job_orders 
DROP CONSTRAINT IF EXISTS job_orders_status_check;

-- Add new constraint with all required statuses
ALTER TABLE public.job_orders 
ADD CONSTRAINT job_orders_status_check 
CHECK (status IN ('pending', 'scheduled', 'in_progress', 'awaiting_payment', 'completed', 'cancelled'));

-- Verify the constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.job_orders'::regclass 
AND conname = 'job_orders_status_check';
```

### 4. Verify Migration Success

Run this query to check:
```sql
SELECT 
  status, 
  COUNT(*) as count 
FROM public.job_orders 
GROUP BY status;
```

Expected output: Should show all statuses without error.

### 5. Test QR Scanner

After migration:
1. Go to Admin Dashboard → QR Scanner
2. Scan or input QR Code: `SUNEST-1770381226715-YSJ99JH`
3. Status should update from `pending` → `in_progress` ✅
4. Real-time update should show in Jobs tab

---

## Alternative: If Migration Fails

If you cannot run migrations (restricted access), the current code will use `in_progress` status directly after QR scan, which should work with most database setups.

**Status Flow:**
- Customer booking → `pending` (with QR Code)
- Admin scan QR → `in_progress` (service started)
- Assign technician → continue `in_progress`
- Complete → `completed`

---

## Database Schema Reference

Current `/database/COMPLETE_MIGRATION.sql` already has correct constraint:

```sql
status TEXT NOT NULL DEFAULT 'pending' 
CHECK (status IN ('pending', 'scheduled', 'in_progress', 'awaiting_payment', 'completed', 'cancelled'))
```

Production database just needs to match this schema.
