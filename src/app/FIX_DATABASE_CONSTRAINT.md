# Fix Database Constraint Error - Status Check

## 🔴 Error yang Terjadi

```
❌ Supabase error: {
  "code": "23514",
  "message": "new row for relation \"job_orders\" violates check constraint \"job_orders_status_check\""
}
```

## 🔍 Root Cause

Database constraint `job_orders_status_check` hanya mengizinkan status:
- ✅ `pending`
- ✅ `scheduled`
- ✅ `in_progress`
- ✅ `completed`
- ✅ `cancelled`

**TIDAK ADA `awaiting_payment`** ❌

Ini terjadi karena file `/SETUP_DATABASE.sql` yang digunakan tidak include status `awaiting_payment`, sementara migration files yang lebih baru (`/database/migration.sql` dan `/database/COMPLETE_MIGRATION.sql`) sudah memilikinya.

## ✅ Solusi

### Opsi A: Update Database Constraint (RECOMMENDED)

**Langkah-langkah:**

1. **Buka Supabase Dashboard** → SQL Editor
2. **Run SQL berikut:**

```sql
-- Drop the old constraint
ALTER TABLE public.job_orders 
DROP CONSTRAINT IF EXISTS job_orders_status_check;

-- Add new constraint with 'awaiting_payment' included
ALTER TABLE public.job_orders
ADD CONSTRAINT job_orders_status_check 
CHECK (status IN ('pending', 'scheduled', 'in_progress', 'awaiting_payment', 'completed', 'cancelled'));
```

3. **Verify constraint berhasil:**

```sql
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.job_orders'::regclass
  AND conname = 'job_orders_status_check';
```

4. **Restore 3-step flow** - Setelah constraint diperbaiki, uncomment code di `/pages/admin/job-detail.tsx` untuk restore flow:
   - `in_progress` → `awaiting_payment` → `completed`

### Opsi B: Simplified Flow (CURRENT - Temporary)

Code saat ini menggunakan **2-step flow** yang skip `awaiting_payment`:
- `scheduled` → `in_progress` → `completed`

Button berubah dari "Selesai Dikerjakan" menjadi **"Selesai Dikerjakan & Sudah Dibayar"** yang langsung set status ke `completed`.

## 📂 Files yang Terlibat

### Modified:
- ✅ `/pages/admin/job-detail.tsx` - Temporary fix menggunakan `completed` langsung
- ✅ `/database/FIX_STATUS_CONSTRAINT.sql` - SQL script untuk fix constraint

### Reference Files:
- `/SETUP_DATABASE.sql` (line 69) - Current constraint WITHOUT `awaiting_payment`
- `/database/migration.sql` (line 122) - Migration WITH `awaiting_payment`
- `/database/COMPLETE_MIGRATION.sql` (line 165) - Migration WITH `awaiting_payment`

## 🎯 Recommended Action

**Untuk menggunakan flow lengkap 3-step:**

1. Run `/database/FIX_STATUS_CONSTRAINT.sql` di Supabase SQL Editor
2. Uncomment code di `/pages/admin/job-detail.tsx`:
   ```typescript
   // Remove this temporary fix
   {job?.status === 'in_progress' && (
     <Button onClick={() => handleStatusUpdate('completed')}>
       Selesai Dikerjakan & Sudah Dibayar
     </Button>
   )}
   
   // Restore original 3-step flow
   {job?.status === 'in_progress' && (
     <Button onClick={() => handleStatusUpdate('awaiting_payment')}>
       Selesai Dikerjakan
     </Button>
   )}
   
   {job?.status === 'awaiting_payment' && (
     <Button onClick={() => handleStatusUpdate('completed')}>
       Tandai Sudah Dibayar
     </Button>
   )}
   ```

## 🔄 Status Flow Comparison

### Current (Temporary):
```
pending → scheduled → in_progress → completed
                                     ↑
                              (skip awaiting_payment)
```

### After Fix (Original Plan):
```
pending → scheduled → in_progress → awaiting_payment → completed
```

## ⚠️ Important Notes

- Current flow works but loses the "waiting for payment" tracking
- Badge system masih support `awaiting_payment` status untuk future use
- Real-time updates akan tetap berfungsi dengan flow mana pun
- Tidak perlu restart aplikasi setelah update constraint
