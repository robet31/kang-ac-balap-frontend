# ⚡ QUICK START - Real-Time Booking Flow (3 menit!)

---

## 🎯 **3 LANGKAH SIMPLE:**

### **0. Login Users Dulu!** (30 detik)

**PENTING! Biar users exist di database:**

1. **Admin:** Login `admin@demo.com` / `password123` → Logout
2. **Customer:** Login `customer@demo.com` / `password123` → Logout

---

### **1. Run Complete SQL** (1 menit)

👉 **https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql**

```sql
-- Copy paste seluruh file /COMPLETE_DUMMY_DATA.sql
-- (Creates jobs table + 10 dummy jobs in ONE file!)
-- Tekan Run
-- Check output: "🎉 ALL DONE!"
```

**File ini:**
- ✅ Creates jobs table (if not exists)
- ✅ Creates 3 vehicles
- ✅ Creates 10 dummy jobs
- ✅ All-in-one solution!

---

### **2. Enable Real-Time** (30 detik)

👉 **https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/database/replication**

1. Find table: **`jobs`**
2. Toggle **ON**
3. Click **Save**

---

### **3. Test Flow** (1.5 menit)

#### **Window 1 - Customer:**
```
Login: customer@demo.com / password123
→ Go to Booking tab
→ Create booking
→ See "Menunggu Validasi Admin" modal
→ KEEP MODAL OPEN!
```

#### **Window 2 - Admin (Incognito):**
```
Login: admin@demo.com / password123
→ See new booking in "Pending Bookings"
→ Click "Approve"
```

#### **Back to Window 1:**
```
→ Watch modal auto-update! ✨
→ See "✅ Booking disetujui!"
→ Click "Lihat di Tracking →"
→ ✅ Success!
```

---

## 🎉 **DONE!**

**Real-time booking flow aktif!**

- ✅ Customer booking → Admin sees real-time
- ✅ Admin approve → Customer notified real-time
- ✅ Modal auto-updates
- ✅ Navigate to tracking works
- ✅ 10 dummy data ready to test

---

## 📋 **FILES:**

```
/DUMMY_DATA_REALTIME.sql       ← Run this first!
/hooks/useRealtimeJobs.ts      ← Real-time hook
/components/dashboard/BookingTab.tsx  ← Modal with real-time

/IMPLEMENTATION_COMPLETE.md    ← Full documentation
/REALTIME_BOOKING_GUIDE.md     ← Detailed guide
/QUICK_START_REALTIME.md       ← This file
```

---

**Total time:** 3 minutes  
**Result:** Full real-time system! 🚀