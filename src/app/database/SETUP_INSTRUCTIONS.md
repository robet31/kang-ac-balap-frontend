# 🚀 SUNEST AUTO - DATABASE SETUP INSTRUCTIONS

## ✅ Complete Step-by-Step Guide

---

## 📋 **PREREQUISITES**

- [ ] Supabase account (free tier OK)
- [ ] Browser with internet connection
- [ ] 15 minutes waktu setup

---

## 🎯 **STEP 1: CREATE NEW SUPABASE PROJECT**

### **1.1 Login ke Supabase**
```
1. Go to: https://supabase.com
2. Click "Sign In" (atau "Start your project")
3. Login dengan GitHub/Google/Email
```

### **1.2 Create New Project**
```
1. Click "New Project"
2. Fill in:
   - Name: sunest-auto (atau nama lain)
   - Database Password: [buat password kuat, SIMPAN!]
   - Region: Southeast Asia (Singapore) - recommended
   - Pricing Plan: Free
3. Click "Create new project"
4. ⏱️ Wait 2-3 minutes (project sedang di-setup)
```

---

## 🗄️ **STEP 2: RUN DATABASE MIGRATION**

### **2.1 Open SQL Editor**
```
1. Di Supabase dashboard → klik "SQL Editor" (di sidebar kiri)
2. Click "+ New query"
```

### **2.2 Run Migration Script**
```
1. Copy ENTIRE content dari file: /database/COMPLETE_MIGRATION.sql
2. Paste ke SQL Editor
3. Click "Run" (atau Ctrl+Enter)
4. ✅ Success message akan muncul
5. Scroll down → verify tables created
```

**Expected Result:**
```
✅ 8 tables created:
   - profiles
   - services
   - vehicles
   - inventory
   - job_orders
   - job_parts
   - job_updates
```

---

## 🌱 **STEP 3: SEED INITIAL DATA**

### **3.1 Run Seed Data**
```
1. SQL Editor → "+ New query"
2. Copy ENTIRE content dari file: /database/SEED_DATA.sql
3. Paste ke SQL Editor
4. Click "Run"
5. ✅ Success!
```

**Expected Result:**
```
✅ Data inserted:
   - 4 service packages
   - 25 inventory items
```

### **3.2 Verify Data**
```sql
-- Check services
SELECT * FROM public.services;
-- Should show 4 rows

-- Check inventory
SELECT * FROM public.inventory;
-- Should show 25 rows
```

---

## 👥 **STEP 4: CREATE DEMO USERS**

### **4.1 Enable Email Auth**
```
1. Supabase dashboard → "Authentication" → "Providers"
2. Find "Email" → make sure it's enabled
3. Scroll down:
   - ✅ Enable email confirmations: OFF (for testing)
   - ✅ Enable email signup: ON
```

### **4.2 Create Admin User**
```
1. Authentication → "Users" → "Add user"
2. Fill in:
   - Email: admin@sunest.auto
   - Password: admin123
   - Auto Confirm: ✅ YES
   - User metadata (click "Add field"):
     {
       "full_name": "Admin Sunest",
       "role": "admin"
     }
3. Click "Create user"
```

### **4.3 Create Customer User**
```
1. Authentication → "Users" → "Add user"
2. Fill in:
   - Email: customer@test.com
   - Password: customer123
   - Auto Confirm: ✅ YES
   - User metadata:
     {
       "full_name": "John Doe",
       "role": "customer"
     }
3. Click "Create user"
```

### **4.4 Create Technician User**
```
1. Authentication → "Users" → "Add user"
2. Fill in:
   - Email: technician@sunest.auto
   - Password: tech123
   - Auto Confirm: ✅ YES
   - User metadata:
     {
       "full_name": "Budi Teknisi",
       "role": "technician"
     }
3. Click "Create user"
```

---

## 🔑 **STEP 5: GET API CREDENTIALS**

### **5.1 Get Project URL & Keys**
```
1. Supabase dashboard → "Settings" → "API"
2. Copy these values:

   📋 Project URL:
   https://[your-project-id].supabase.co

   📋 Anon/Public Key:
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   📋 Service Role Key (IMPORTANT - KEEP SECRET):
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚙️ **STEP 6: CONFIGURE FIGMA MAKE**

### **6.1 Update Supabase Info**
```
1. Open file: /utils/supabase/info.tsx
2. Replace with your credentials:

export const projectId = "YOUR_PROJECT_ID"; // from URL
export const publicAnonKey = "YOUR_ANON_KEY"; // from API settings
```

### **6.2 Set Environment Variables**
```
1. In Figma Make → Settings → Environment Variables
2. Add these variables:

   Name: SUPABASE_URL
   Value: https://[your-project-id].supabase.co

   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [your-service-role-key]

   Name: SUPABASE_ANON_KEY
   Value: [your-anon-public-key]
```

---

## 🧪 **STEP 7: TEST DATABASE CONNECTION**

### **7.1 Test Authentication**
```
1. Run your Figma Make app
2. Login with:
   - Email: customer@test.com
   - Password: customer123
3. ✅ Should redirect to customer dashboard
```

### **7.2 Test Data Fetching**
```
1. Go to "Booking" tab
2. Should see 4 service packages:
   - Hemat Service (Rp 100,000)
   - Basic Tune-Up (Rp 150,000)
   - Premium Service (Rp 350,000)
   - Major Overhaul (Rp 1,500,000)
3. ✅ If visible, database is connected!
```

### **7.3 Test Booking Flow**
```
1. Add a vehicle:
   - Vehicles tab → Add kendaraan
   - Fill form → Save
   - ✅ Should save to database

2. Create booking:
   - Booking tab → Select service
   - Fill form → Konfirmasi
   - ✅ Should create job order
   - ✅ Stock auto-deducted

3. Admin validation:
   - Login as admin@sunest.auto
   - See pending booking
   - Click "Setujui"
   - ✅ Status should update

4. Customer tracking:
   - Back to customer account
   - Tracking tab
   - ✅ Status should show "Dijadwalkan"
```

---

## 🔍 **VERIFY DATABASE STRUCTURE**

### **Run Verification Queries:**

```sql
-- Check all tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check profiles
SELECT id, full_name, email, role 
FROM public.profiles;

-- Check services
SELECT name, base_price, estimated_duration 
FROM public.services;

-- Check inventory
SELECT part_sku, part_name, quantity_in_stock, minimum_stock_level
FROM public.inventory
ORDER BY category, part_name;

-- Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## ⚠️ **TROUBLESHOOTING**

### **Problem: "relation does not exist"**
```
Solution:
1. Make sure you ran COMPLETE_MIGRATION.sql first
2. Check table exists: SELECT * FROM pg_tables WHERE schemaname = 'public'
3. Re-run migration if needed
```

### **Problem: "permission denied"**
```
Solution:
1. Check RLS policies are created
2. Make sure user has correct role in profiles table
3. Verify: SELECT * FROM public.profiles WHERE email = 'your-email'
```

### **Problem: "insert or update on table violates foreign key constraint"**
```
Solution:
1. Make sure parent records exist first
2. For job_orders: vehicle, customer, and service must exist
3. Check: SELECT * FROM public.vehicles WHERE customer_id = 'uuid'
```

### **Problem: Stock not deducting**
```
Solution:
1. Check trigger exists:
   SELECT tgname FROM pg_trigger WHERE tgname = 'decrement_stock_on_part_use';
2. Verify inventory_id is correct in job_parts
3. Check: SELECT * FROM public.inventory WHERE id = 'uuid'
```

### **Problem: Can't connect from app**
```
Solution:
1. Verify credentials in /utils/supabase/info.tsx
2. Check SUPABASE_URL and keys are correct
3. Make sure RLS policies allow access
4. Test with SQL Editor first
```

---

## 📊 **DATABASE SCHEMA OVERVIEW**

```
profiles (users)
  ├── id (UUID, FK to auth.users)
  ├── full_name, email, phone
  ├── role (customer/technician/admin)
  └── created_at, updated_at

services (packages)
  ├── id (UUID)
  ├── name, description
  ├── base_price, estimated_duration
  └── is_active

vehicles
  ├── id (UUID)
  ├── customer_id (FK to profiles)
  ├── plate_number, brand, model
  ├── year, engine_capacity, color
  └── created_at, updated_at

inventory (spare parts)
  ├── id (UUID)
  ├── part_sku, part_name
  ├── quantity_in_stock, minimum_stock_level
  ├── unit_cost, selling_price
  └── supplier info

job_orders (bookings)
  ├── id (UUID)
  ├── job_number (unique)
  ├── customer_id, vehicle_id, service_id
  ├── assigned_technician_id
  ├── status (pending/scheduled/in_progress/completed)
  ├── labor_cost, parts_cost, total_amount
  └── payment info

job_parts (items used)
  ├── id (UUID)
  ├── job_order_id (FK)
  ├── inventory_id (FK)
  ├── quantity_used, unit_price_at_time
  └── subtotal

job_updates (history/notes)
  ├── id (UUID)
  ├── job_order_id (FK)
  ├── user_id (FK)
  ├── update_type, content
  └── created_at
```

---

## 🎯 **KEY FEATURES**

### **Auto-Triggers:**
- ✅ Auto-create profile on user signup
- ✅ Auto-update `updated_at` on record changes
- ✅ Auto-calculate job order totals
- ✅ Auto-deduct inventory stock on part usage

### **Row Level Security (RLS):**
- ✅ Customers see only their own data
- ✅ Technicians see assigned jobs
- ✅ Admins see everything
- ✅ Public can view services & inventory

### **Real-Time Features:**
- ✅ Booking status updates
- ✅ Inventory tracking
- ✅ Job order synchronization
- ✅ Multi-user access control

---

## ✅ **FINAL CHECKLIST**

- [ ] Supabase project created
- [ ] COMPLETE_MIGRATION.sql executed
- [ ] SEED_DATA.sql executed
- [ ] 3 demo users created (admin, customer, technician)
- [ ] API credentials copied
- [ ] /utils/supabase/info.tsx updated
- [ ] Environment variables set
- [ ] App tested with customer login
- [ ] Booking flow tested
- [ ] Admin validation tested
- [ ] Real-time updates working

---

## 🎊 **SUCCESS!**

If all steps completed:
- ✅ Database fully configured
- ✅ 8 tables with RLS policies
- ✅ 4 service packages
- ✅ 25 inventory items
- ✅ 3 demo users
- ✅ Real-time booking system ready
- ✅ Auto-stock deduction working
- ✅ Admin dashboard functional

**Your Sunest Auto platform is READY! 🚀**

---

## 📞 **NEED HELP?**

### **Common Issues:**
1. Check Supabase status: https://status.supabase.com
2. Review SQL logs: Supabase → Database → Logs
3. Test queries in SQL Editor first
4. Verify RLS policies are correct

### **Documentation:**
- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Figma Make Docs: [internal]

---

**Last Updated:** February 4, 2026  
**Sunest Auto Platform** - Production Database Setup
