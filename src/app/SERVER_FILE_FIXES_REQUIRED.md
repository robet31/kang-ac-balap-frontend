# 🔧 SERVER FILE - MANUAL FIXES REQUIRED

## 📍 FILE: `/supabase/functions/server/index.tsx`

**Total changes needed:** 9 lines

---

## ✅ CHANGES TO MAKE:

### **Change #1 - Line 450:**
```typescript
// BEFORE:
.from('jobs')

// AFTER:
.from('job_orders')
```
**Location:** Get count of jobs for vehicle (around line 450)

---

### **Change #2 - Line 467:**
```typescript
// BEFORE:
.from('jobs')

// AFTER:
.from('job_orders')
```
**Location:** Delete jobs for vehicle (around line 467)

---

### **Change #3 - Line 512:**
```typescript
// BEFORE:
.from('jobs')

// AFTER:
.from('job_orders')
```
**Location:** Get vehicle bookings (around line 512)

---

### **Change #4 - Line 700:**
```typescript
// BEFORE:
.from('jobs')

// AFTER:
.from('job_orders')
```
**Location:** Insert new job (around line 700)

---

### **Change #5 - Line 753:**  ⚠️ **THIS ONE CAUSES "customer bookings" ERROR!**
```typescript
// BEFORE:
const { data: jobs, error } = await supabase
  .from('jobs')
  .select(`
    *,
    vehicles (*)
  `)
  .eq('user_id', customerId)

// AFTER:
const { data: jobs, error } = await supabase
  .from('job_orders')
  .select(`
    *,
    vehicles (*)
  `)
  .eq('user_id', customerId)
```
**Location:** Get customer bookings endpoint (around line 753)

---

### **Change #6 - Line 780:**
```typescript
// BEFORE:
.from('jobs')

// AFTER:
.from('job_orders')
```
**Location:** Get all bookings (around line 780)

---

### **Change #7 - Line 818:**
```typescript
// BEFORE:
.from('jobs')

// AFTER:
.from('job_orders')
```
**Location:** Update job (around line 818)

---

### **Change #8 - Line 849:**
```typescript
// BEFORE:
.from('jobs')

// AFTER:
.from('job_orders')
```
**Location:** Check if booking exists (around line 849)

---

### **Change #9 - Line 866:**
```typescript
// BEFORE:
.from('jobs')

// AFTER:
.from('job_orders')
```
**Location:** Delete booking (around line 866)

---

## 🚀 HOW TO FIX:

### **Option 1: Find & Replace (Fastest)**

1. Open file: `/supabase/functions/server/index.tsx`
2. Press: `Ctrl + H` (or Cmd + H on Mac)
3. Find: `.from('jobs')`
4. Replace with: `.from('job_orders')`
5. Click: **Replace All**
6. Should replace **9 occurrences**
7. Save file

### **Option 2: Manual Line by Line**

Go to each line number and manually change `'jobs'` to `'job_orders'`:
- Line 450 ✅
- Line 467 ✅
- Line 512 ✅
- Line 700 ✅
- Line 753 ✅ **← THIS FIXES "customer bookings" ERROR!**
- Line 780 ✅
- Line 818 ✅
- Line 849 ✅
- Line 866 ✅

---

## ✅ VERIFICATION:

After making changes, search the file for `.from('jobs')`:

**Expected result:** 0 matches (should all be `.from('job_orders')` now)

---

## 🔥 CRITICAL LINE:

**Line 753 is the one causing your current error!**

```
Error fetching customer bookings: PGRST200
Could not find a relationship between 'jobs' and 'vehicles'
```

This error comes from the customer bookings endpoint which uses `.from('jobs')` on line 753!

---

## 📝 AFTER FIX:

1. Save `/supabase/functions/server/index.tsx`
2. Refresh your app: `Ctrl + Shift + R`
3. Login again
4. Check console - error should be gone!
5. Customer dashboard should load bookings!

---

**ACTION:** Open `/supabase/functions/server/index.tsx` and do Find & Replace now!

**Find:** `.from('jobs')`  
**Replace:** `.from('job_orders')`  
**Count:** 9 replacements

**SAVE & REFRESH!** 🚀
