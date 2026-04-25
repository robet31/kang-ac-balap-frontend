# 🔧 FIX: Tracking Data Tidak Muncul

---

## ❌ **MASALAHNYA:**

Data TRACKING_10_DUMMY_DATA.sql sudah dimasukkan tapi **TIDAK MUNCUL** di customer dashboard dan admin dashboard.

---

## 🎯 **ROOT CAUSE:**

1. **Endpoint tidak ada!** 
   - TrackingTab fetch dari: `/bookings/customer/:id`
   - Endpoint ini BELUM DIBUAT di server!

2. **SQL belum link ke vehicle**
   - Jobs created tanpa `vehicle_id`
   - Join query gagal karena no relation

---

## ✅ **SUDAH DI-FIX:**

### **1. Server Endpoint DITAMBAH** ✅
File: `/supabase/functions/server/index.tsx`

**New Endpoints:**
```typescript
// Customer bookings (for tracking tab)
GET /make-server-c1ef5280/bookings/customer/:customerId
  → Fetch jobs dari table 'jobs' 
  → Filter by user_id
  → Join dengan vehicles

// All bookings (for admin dashboard)  
GET /make-server-c1ef5280/bookings
  → Fetch all jobs
  → Join dengan vehicles & profiles

// Update booking status
PUT /make-server-c1ef5280/bookings/:id/status
  → Update status, progress, scheduled_date, etc.
```

### **2. SQL Updated dengan Vehicle ID** ✅
File: `/TRACKING_FIXED.sql`

**Features:**
- ✅ Auto-detect customer vehicles
- ✅ Use customer's actual vehicles
- ✅ Proper vehicle_id references
- ✅ Reuse vehicles if customer has < 3
- ✅ Verification with vehicle info

---

## 🚀 **HOW TO FIX:**

### **STEP 1: Deploy Server Changes** (IMPORTANT!)

Server sudah di-update otomatis karena auto-deploy, tapi **restart Edge Function**:

1. Go to: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/functions
2. Find: **`make-server-c1ef5280`**
3. Click **"..."** → **Restart**
4. Wait ~30 seconds

**Or just wait 2-3 minutes** (auto-deploy akan kick in)

### **STEP 2: Run NEW SQL with Vehicle IDs**

**Prerequisites:**
- ✅ Customer must be logged in first (creates user)
- ✅ Customer must have at least 1 vehicle

**Run SQL:**

1. **Ensure customer has vehicles:**
   ```sql
   -- Check vehicles for customer
   SELECT v.* FROM vehicles v
   JOIN auth.users u ON v.customer_id = u.id
   WHERE u.email = 'customer@demo.com';
   ```
   
   If **empty**, add a vehicle first:
   ```sql
   -- Quick add vehicle
   INSERT INTO public.vehicles (customer_id, plate_number, brand, model, year)
   SELECT 
     id, 
     'B 1234 TEST', 
     'Honda', 
     'Beat', 
     2023
   FROM auth.users 
   WHERE email = 'customer@demo.com';
   ```

2. **Run tracking SQL:**
   - Copy **ENTIRE** `/TRACKING_FIXED.sql`
   - Paste in SQL Editor
   - Run!

3. **Verify output:**
   ```
   ✅ Customer ID: xxx-xxx-xxx
   ✅ Customer has 2 vehicles
   📌 Using vehicle IDs: xxx, yyy, zzz
   ✅ 10 tracking jobs created successfully with vehicle IDs!
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📊 TRACKING DATA SUMMARY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⏳ Menunggu           | 3
   📅 Dijadwalkan        | 2
   🔧 Sedang Diperbaiki  | 3
   ✅ Selesai            | 2
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📊 TOTAL TRACKING     | 10
   
   📋 JOB DETAILS WITH VEHICLES
   TRACK-001 | ⏳ Menunggu | Honda Beat | B 1234 TEST | ...
   ...
   
   🎉 ALL DONE!
   ```

### **STEP 3: Test Customer Dashboard**

1. **Login as customer:**
   - Email: `customer@demo.com`
   - Password: `password123`

2. **Go to Tracking tab**

3. **Should see 10 bookings!**
   - Filter buttons with badges
   - "Menunggu (3)", "Dijadwalkan (2)", etc.
   - Each job shows vehicle info

4. **Test filters:**
   - Click "Menunggu" → See 3 jobs
   - Click "Sedang Diperbaiki" → See 3 jobs
   - Click "Selesai" → See 2 jobs

### **STEP 4: Test Admin Dashboard (Real-Time!)**

1. **Open incognito window**

2. **Login as admin:**
   - Email: `admin@demo.com`
   - Password: `password123`

3. **Should see all 10 bookings in dashboard**

4. **Test real-time:**
   - Admin: Click "Approve" on a pending job
   - Customer window: Auto-refresh → See status change!

---

## 🔍 **DEBUGGING:**

### **If still no data in customer dashboard:**

1. **Check browser console (F12):**
   ```
   Error fetching bookings: ...
   ```
   
2. **Test endpoint manually:**
   ```bash
   # Get customer ID
   SELECT id FROM auth.users WHERE email = 'customer@demo.com';
   
   # Then test endpoint (replace YOUR_CUSTOMER_ID)
   curl https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280/bookings/customer/YOUR_CUSTOMER_ID \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

3. **Check server logs:**
   - https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/logs/edge-functions

### **If endpoint returns empty:**

1. **Check if jobs exist:**
   ```sql
   SELECT * FROM public.jobs WHERE job_number LIKE 'TRACK-%';
   ```
   
   Should show 10 jobs.

2. **Check user_id matches:**
   ```sql
   SELECT 
     j.job_number,
     j.user_id,
     u.email
   FROM jobs j
   JOIN auth.users u ON j.user_id = u.id
   WHERE j.job_number LIKE 'TRACK-%';
   ```
   
   All should show `customer@demo.com`.

3. **Check RLS policies:**
   ```sql
   -- Test with service role (bypasses RLS)
   SELECT * FROM public.jobs WHERE job_number LIKE 'TRACK-%';
   ```

---

## 📁 **FILES:**

```
✅ /supabase/functions/server/index.tsx  - Updated (endpoints added)
✅ /TRACKING_FIXED.sql                   - New SQL with vehicle IDs
✅ /FIX_TRACKING_DATA.md                 - This guide

Old files (ignore):
❌ /TRACKING_10_DUMMY_DATA.sql          - Old (no vehicle_id)
```

---

## 🎯 **CHECKLIST:**

- [ ] Server restarted (or wait 2-3 mins)
- [ ] Customer logged in at least once
- [ ] Customer has at least 1 vehicle
- [ ] Run `/TRACKING_FIXED.sql`
- [ ] See success output (10 jobs created)
- [ ] Refresh customer dashboard
- [ ] Click Tracking tab
- [ ] See 10 bookings with filters
- [ ] Test filter buttons
- [ ] Login as admin (incognito)
- [ ] See all bookings in admin dashboard
- [ ] Test real-time sync

---

## 🔥 **EXPECTED RESULT:**

### **Customer Dashboard → Tracking Tab:**
```
┌─────────────────────────────────────┐
│ Tracking Service                    │
│ Pantau status booking real-time     │
├─────────────────────────────────────┤
│ [Semua 10] [Menunggu 3]             │
│ [Dijadwalkan 2] [Sedang Diperbaiki 3│
│ [Selesai 2]                         │
├─────────────────────────────────────┤
│ TRACK-001                           │
│ Service Rutin                       │
│ Honda Beat - B 1234 TEST            │
│ ⏳ Menunggu                          │
│ Rp 250,000                          │
│ 1 menit yang lalu                   │
├─────────────────────────────────────┤
│ TRACK-006                           │
│ Service Premium                     │
│ Yamaha NMAX - B 5678 ABC            │
│ 🔧 Sedang Diperbaiki (45%)          │
│ Rp 550,000                          │
│ 5 jam yang lalu                     │
└─────────────────────────────────────┘
```

### **Admin Dashboard:**
```
Recent Bookings: 10 items
- TRACK-001 | customer@demo.com | Honda Beat | Pending
- TRACK-002 | customer@demo.com | Yamaha NMAX | Pending
...
```

---

## 💡 **TIPS:**

1. **Auto-refresh 5s** - Customer dashboard auto-refreshes tracking
2. **Real-time sync** - Admin changes → Customer sees instantly
3. **Vehicle info** - Each job shows vehicle brand, model, plate
4. **Filter counts** - Badges show exact count per status

---

**Now:**
1. ✅ **Wait 2-3 mins** (or restart function)
2. ✅ **Run** `/TRACKING_FIXED.sql`
3. ✅ **Refresh** customer dashboard
4. ✅ **Test** tracking tab
5. ✅ **Enjoy!** 🚀

Kalau masih error, share:
- Console error message
- SQL output
- Screenshot

Saya bantu debug lagi! 😊
