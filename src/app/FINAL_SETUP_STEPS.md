# ✅ FINAL SETUP STEPS - SUNEST AUTO

## 🎯 Credentials Updated!

Your Supabase credentials have been configured:
```
✅ Project ID: ljrlmntctssaiplghkaz
✅ Project URL: https://ljrlmntctssaiplghkaz.supabase.co
✅ Anon Key: Updated in /utils/supabase/info.tsx
```

---

## ⚙️ STEP 1: SET ENVIRONMENT VARIABLES

You need to set these environment variables in your Figma Make environment:

### **Required Variables:**

```bash
SUPABASE_URL=https://ljrlmntctssaiplghkaz.supabase.co

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcmxtbnRjdHNzYWlwbGdoa2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzc2MjEsImV4cCI6MjA4NTc1MzYyMX0.X-rh3exTiYS1WILIT0xuxd59Q2tRh_pIG4cfn0_2WCA

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcmxtbnRjdHNzYWlwbGdoa2F6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE3NzYyMSwiZXhwIjoyMDg1NzUzNjIxfQ.dbLIiUM0cWaeaxoVIPPmMQw_nz2vkgyRb0qnl5ZLegY
```

⚠️ **IMPORTANT:** Service Role Key is SECRET! Never expose to frontend!

---

## 👥 STEP 2: CREATE DEMO USERS

Go to Supabase Dashboard → **Authentication → Users → Add User**

Create 3 users:

### **User 1: ADMIN**
```
Email: admin@sunest.auto
Password: admin123
✅ Auto Confirm User: YES

User Metadata (click "Add field"):
{
  "full_name": "Admin Sunest",
  "role": "admin"
}
```

### **User 2: CUSTOMER**
```
Email: customer@test.com
Password: customer123
✅ Auto Confirm User: YES

User Metadata:
{
  "full_name": "John Doe",
  "role": "customer"
}
```

### **User 3: TECHNICIAN**
```
Email: technician@sunest.auto
Password: tech123
✅ Auto Confirm User: YES

User Metadata:
{
  "full_name": "Budi Teknisi",
  "role": "technician"
}
```

**Important Notes:**
- ✅ **Auto Confirm User** MUST be checked (otherwise email verification needed)
- ✅ User Metadata must include `role` field for RLS policies to work
- ✅ `full_name` will be used in profile display

---

## 🧪 STEP 3: VERIFY SETUP

### **3.1 Check Database Tables**
Run in Supabase SQL Editor:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- Should show: profiles, services, vehicles, inventory, job_orders, job_parts, job_updates, kv_store_c1ef5280

-- Check services loaded
SELECT name, base_price FROM public.services;
-- Should show 4 services

-- Check inventory loaded
SELECT part_name, quantity_in_stock FROM public.inventory LIMIT 10;
-- Should show 25 items

-- Check users/profiles
SELECT id, full_name, email, role FROM public.profiles;
-- Should show 3 users after they're created
```

### **3.2 Test App Connection**

1. **Run your app**
2. **Login with customer:**
   ```
   Email: customer@test.com
   Password: customer123
   ```
3. **Check Booking Tab:**
   - Should see 4 service packages:
     - Hemat Service (Rp 100,000)
     - Basic Tune-Up (Rp 150,000)
     - Premium Service (Rp 350,000)
     - Major Overhaul (Rp 1,500,000)

4. **If you see services → ✅ Database connected!**

---

## 🚀 STEP 4: TEST COMPLETE FLOW

### **Test 1: Add Vehicle**
```
1. Login as customer@test.com
2. Go to "Vehicles" tab
3. Click "Tambah Kendaraan"
4. Fill form:
   - Plat: B 1234 XYZ
   - Merk: Honda
   - Model: Beat
   - Tahun: 2023
   - CC: 110
   - Warna: Hitam
5. Click "Simpan"
6. ✅ Vehicle should appear in list
```

### **Test 2: Create Booking**
```
1. Go to "Booking" tab
2. Select "Hemat Service"
3. Select vehicle (B 1234 XYZ)
4. Add notes (optional)
5. Click "Konfirmasi Booking"
6. ✅ Pop-up "Menunggu Validasi Admin" should appear
7. ✅ Check inventory - stock should be deducted
```

### **Test 3: Admin Validation**
```
1. Logout
2. Login as admin@sunest.auto / admin123
3. Dashboard → "Pending Bookings" section
4. Should see booking from customer
5. Click "Setujui"
6. Set scheduled date/time
7. Click "Konfirmasi"
8. ✅ Booking approved → status = "scheduled"
```

### **Test 4: Customer Tracking**
```
1. Logout
2. Login as customer@test.com
3. Go to "Tracking" tab
4. Click filter "Dijadwalkan"
5. ✅ Should see approved booking
6. ✅ Timeline should show progress
7. Wait 5 seconds → should auto-refresh
```

### **Test 5: Vehicle History**
```
1. Go to "Vehicles" tab
2. Click "Lihat Riwayat" on B 1234 XYZ
3. ✅ Should show booking history
4. ✅ Should show items used, status, total
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Environment variables set (3 variables)
- [ ] 3 demo users created
- [ ] Login works with customer@test.com
- [ ] Booking tab shows 4 services
- [ ] Can add vehicle
- [ ] Can create booking
- [ ] Stock auto-deducts
- [ ] Admin can see pending booking
- [ ] Admin can approve booking
- [ ] Customer tracking shows updated status
- [ ] Real-time refresh working (5s)
- [ ] Vehicle history shows bookings

---

## 🎊 ALL DONE!

If all checkboxes ✅ → **Your Sunest Auto is FULLY OPERATIONAL!**

### **Demo Credentials:**
```
ADMIN:
Email: admin@sunest.auto
Password: admin123
→ Full dashboard access, approve bookings, manage inventory

CUSTOMER:
Email: customer@test.com
Password: customer123
→ Book services, track jobs, manage vehicles

TECHNICIAN:
Email: technician@sunest.auto
Password: tech123
→ Mobile app, update job status, add notes
```

---

## ⚠️ TROUBLESHOOTING

### **Problem: Can't see services in Booking tab**
```
Solution:
1. Check SQL Editor: SELECT * FROM public.services;
2. If empty → re-run SEED_DATA.sql
3. Check console for errors
4. Verify credentials in info.tsx
```

### **Problem: Login not working**
```
Solution:
1. Check users exist: Authentication → Users
2. Verify "Auto Confirm" was checked
3. Try reset password
4. Check user metadata has "role" field
```

### **Problem: Permission denied**
```
Solution:
1. Check user profile: SELECT * FROM public.profiles WHERE email = 'user@email';
2. Verify role is correct
3. Re-run COMPLETE_MIGRATION.sql to fix RLS policies
```

### **Problem: Stock not deducting**
```
Solution:
1. Check trigger: SELECT tgname FROM pg_trigger WHERE tgname = 'decrement_stock_on_part_use';
2. If not found → re-run COMPLETE_MIGRATION.sql
3. Check job_parts table for records
```

---

## 📞 NEED HELP?

See complete troubleshooting guide:
📄 `/database/TROUBLESHOOTING.md`

Or review setup guide:
📄 `/DATABASE_SETUP_QUICK.md`

---

## 🚀 NEXT STEPS

After everything works:
1. ✅ Test all features thoroughly
2. ✅ Customize service packages
3. ✅ Add more inventory items
4. ✅ Configure email notifications (optional)
5. ✅ Deploy to production!

---

**Your Sunest Auto platform is READY! 🎉**

Last Updated: February 4, 2026  
Database: ljrlmntctssaiplghkaz.supabase.co  
Status: ✅ CONFIGURED & READY TO TEST
