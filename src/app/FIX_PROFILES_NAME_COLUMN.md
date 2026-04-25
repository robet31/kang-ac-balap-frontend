# ✅ Fix: Profiles Column Name Error

## 🐛 Error Fixed
```
Error fetching customers: {
  "code": "42703",
  "details": null,
  "hint": null,
  "message": "column profiles.name does not exist"
}
```

## 🔍 Root Cause
Tabel `profiles` menggunakan kolom `full_name`, bukan `name`.

## ✅ Solution Applied

### File: `/components/dialogs/CreateJobDialog.tsx`

**Before:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('id, name, email')  // ❌ Wrong column
  .eq('role', 'customer')
  .order('name');
```

**After:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('id, full_name, email')  // ✅ Correct column
  .eq('role', 'customer')
  .order('full_name');
```

### Additional Fixes

1. **Customer dropdown display:**
```typescript
// Before
{customer.name || customer.email}

// After
{customer.full_name || customer.email}
```

2. **Summary display:**
```typescript
// Before
{selectedCustomer?.name || selectedCustomer?.email}

// After
{selectedCustomer?.full_name || selectedCustomer?.email}
```

3. **Booking payload:**
```typescript
// Before
customer_name: selectedCustomer.name || selectedCustomer.email

// After
customer_name: selectedCustomer.full_name || selectedCustomer.email
```

## 📊 Database Schema Reference

### Profiles Table Structure:
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,     -- ✅ Correct column name
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'technician', 'admin')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## ✅ Status
**Fixed and Tested** ✓

All references to `profiles.name` have been updated to `profiles.full_name` throughout the CreateJobDialog component.

---
**Date:** February 4, 2026  
**Fix Type:** Column name correction
