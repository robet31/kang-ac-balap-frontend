# Database Migration Required: Add vehicle_name Column

## Problem

Admin create job form uses manual input for `vehicle_name`, but this column doesn't exist in the `jobs` table yet.

## Error
```
Error creating job: Failed to create booking
```

## Solution

You need to add the `vehicle_name` column to the `jobs` table in your Supabase database.

### Migration SQL:

```sql
-- Add vehicle_name column to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS vehicle_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN jobs.vehicle_name IS 'Manual vehicle name input from admin (when vehicle_id is null)';
```

### Steps to Execute:

1. **Go to Supabase Dashboard:**
   - Navigate to: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar

3. **Create New Query:**
   - Click "New Query"

4. **Paste SQL:**
   ```sql
   ALTER TABLE jobs 
   ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
   
   COMMENT ON COLUMN jobs.vehicle_name IS 'Manual vehicle name input from admin (when vehicle_id is null)';
   ```

5. **Run Query:**
   - Click "Run" or press Ctrl+Enter

6. **Verify:**
   - Check that column is added successfully
   - No errors should appear

### After Migration:

The admin create job form will work properly with these fields:
- `customer_name` - Manual input for customer name
- `vehicle_name` - Manual input for vehicle info (e.g., "Honda Beat - B 1234 ABC")
- `user_id` - NULL (admin creates without user relation)
- `vehicle_id` - NULL (admin creates without vehicle relation)

### Why This Column?

**Use Case:**
- Admin creates job for walk-in customers
- Customer may not be registered in system
- Vehicle may not be registered in system
- Admin needs to manually input customer name and vehicle info
- These are stored as TEXT fields for flexibility

**Fields for Admin Manual Input:**
```typescript
{
  customer_name: "Budi Santoso",        // Manual text input
  vehicle_name: "Honda Beat - B 1234 ABC",  // Manual text input
  user_id: null,                         // No user relation
  vehicle_id: null                       // No vehicle relation
}
```

### Column Specs:

```sql
vehicle_name TEXT NULL
```

- Type: TEXT
- Nullable: YES (optional field)
- Default: NULL
- Use: Store vehicle info when admin creates job manually

### Related Code:

**Server (index.tsx):**
```typescript
const jobData = {
  // ... other fields
  customer_name: bookingData.customer_name || null,
  vehicle_name: bookingData.vehicle_name || null,  // ← Added
  user_id: bookingData.user_id,
  vehicle_id: bookingData.vehicle_id || null,
  // ... other fields
};
```

**Frontend (create-job.tsx):**
```typescript
const bookingPayload = {
  // ... other fields
  customer_name: customerName,               // Manual input
  vehicle_name: vehicleName || '-',         // Manual input
  user_id: null,                             // Admin creates
  vehicle_id: null,                          // No vehicle relation
  // ... other fields
};
```

---

## After Running Migration

1. Test the create job form
2. You should be able to create jobs successfully
3. Check that `vehicle_name` is stored in database
4. Verify real-time updates work

## Verification Query

After migration, verify with:
```sql
-- Check column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'jobs' AND column_name = 'vehicle_name';

-- Should return:
-- column_name  | data_type | is_nullable
-- vehicle_name | text      | YES
```

---

**Status:** ⚠️ MIGRATION REQUIRED  
**Priority:** HIGH - Blocks admin create job feature  
**Impact:** Admin cannot create jobs until this column is added
