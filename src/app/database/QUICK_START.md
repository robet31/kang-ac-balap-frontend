# 🚀 QUICK START GUIDE
## Sunest Auto - Real-Time Database Setup

---

## ⚡ **SETUP CEPAT (3 LANGKAH)**

### **Step 1: Jalankan Migration** ✅

Buka **Supabase SQL Editor** dan jalankan:

```sql
-- Copy paste semua isi file: /database/migration.sql
-- Klik "Run"
```

**Expected Output:**
- ✅ 8 Tables created
- ✅ RLS Policies applied
- ✅ Triggers & Functions created
- ✅ Indexes created

**Note:** Jika ada error "policy already exists", **it's OK!** Migration sudah pernah dijalankan sebelumnya. Lanjut ke step 2.

---

### **Step 2: Jalankan Seed Data** ✅

Buka **Supabase SQL Editor** dan jalankan:

```sql
-- Copy paste semua isi file: /database/seed_data_simple.sql
-- Klik "Run"
```

**Expected Output:**
```
✅ total_services: 4
✅ total_inventory: 25
```

**Data yang Diisi:**
- 4 Service Packages (Hemat, Basic, Standard, Premium)
- 25 Spare Parts (9 categories)

---

### **Step 3: Test Booking!** 🎉

1. **Login ke platform** sebagai customer
2. **Buka Booking Tab**
3. **Pilih service package**
4. **Isi form booking**
5. **Confirm** → Data langsung masuk database real-time!

---

## 📊 **VERIFIKASI DATABASE**

### **Cek Tables:**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Tables:**
```
- inventory
- job_orders
- job_parts
- job_updates
- profiles
- services
- vehicles
```

### **Cek Services:**

```sql
SELECT name, base_price, estimated_duration 
FROM public.services 
ORDER BY base_price;
```

**Expected Result:**
```
Hemat Service     | 100000 | 60 min
Basic Tune-Up     | 150000 | 90 min
Standard Service  | 300000 | 120 min
Premium Service   | 500000 | 180 min
```

### **Cek Inventory:**

```sql
SELECT 
  category, 
  COUNT(*) as items,
  SUM(quantity_in_stock) as total_stock
FROM public.inventory
GROUP BY category
ORDER BY category;
```

**Expected Result:**
```
Brake System  | 3 items  | 365 stock
Body Parts    | 3 items  | 258 stock
Consumables   | 3 items  | 388 stock
Drive Train   | 3 items  | 209 stock
Electrical    | 2 items  | 232 stock
Engine Parts  | 3 items  | 105 stock
Filters       | 2 items  | 354 stock
Lubricants    | 1 item   | 245 stock
Suspension    | 2 items  | 83 stock
Tires         | 3 items  | 277 stock
```

---

## 🧪 **TEST REAL-TIME BOOKING**

### **Flow:**

1. **Customer creates booking:**
   ```
   POST /bookings
   {
     customer_id: "uuid",
     service_id: "00000000-0000-0000-0000-000000000001",
     vehicle_id: "uuid",
     scheduled_date: "2026-02-04 09:00:00",
     labor_cost: 100000,
     items: [
       { sku: "OLI-FED-08L", qty: 1 },
       { sku: "FIL-HON-001", qty: 1 }
     ]
   }
   ```

2. **Backend automatically:**
   - Creates `job_orders` row
   - Creates `job_parts` rows
   - Deducts `inventory` stock
   - Calculates `total_amount`

3. **Verify in database:**
   ```sql
   SELECT * FROM job_orders ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM job_parts WHERE job_order_id = 'xxx';
   SELECT * FROM inventory WHERE part_sku IN ('OLI-FED-08L', 'FIL-HON-001');
   ```

---

## ❌ **TROUBLESHOOTING**

### **Error: "policy already exists"**

**Cause:** Migration sudah pernah dijalankan sebelumnya.

**Solution:** 
- ✅ **Ignore error ini**, policy sudah aktif
- ✅ Lanjut ke seed data

### **Error: "column subtotal cannot be updated"**

**Cause:** Trying to manually set generated column.

**Solution:**
- ✅ Sudah diperbaiki di `seed_data_simple.sql`
- ✅ Jalankan file yang baru

### **Error: "no rows returned" saat create booking**

**Cause:** Customer atau vehicle belum terdaftar.

**Solution:**
```sql
-- Cek apakah user sudah punya profile
SELECT * FROM profiles WHERE id = 'your-user-id';

-- Jika belum, akan auto-create saat login
-- Atau manual create:
INSERT INTO profiles (id, full_name, role)
VALUES ('your-user-id', 'Your Name', 'customer');
```

### **Error: "inventory not found"**

**Cause:** SKU tidak match dengan database.

**Solution:**
```sql
-- Cek SKU yang tersedia
SELECT part_sku, part_name FROM inventory WHERE is_active = true;

-- Update booking items untuk pakai SKU yang benar
```

---

## 🎯 **NEXT STEPS**

### **1. Create Demo Customer**

```sql
-- Via Supabase Auth (recommended)
-- Sign up melalui platform → auto-create profile

-- Manual (for testing)
INSERT INTO auth.users (id, email, encrypted_password)
VALUES (gen_random_uuid(), 'demo@sunest.com', 'hashed_password');
```

### **2. Create Demo Vehicle**

```sql
INSERT INTO vehicles (customer_id, plate_number, brand, model, year)
VALUES (
  'your-customer-id',
  'B 1234 XYZ',
  'Honda',
  'CB150R',
  2023
);
```

### **3. Test Complete Flow**

1. Login as customer
2. Add vehicle (if not exists)
3. Create booking
4. Check database → data masuk real-time!
5. View analytics → calculations dari real data

---

## 📈 **ANALYTICS READY!**

Setelah ada booking data, analytics akan otomatis show real numbers:

### **Revenue Analytics:**
```sql
-- Monthly revenue
SELECT 
  TO_CHAR(completed_at, 'Mon YYYY') as month,
  COUNT(*) as orders,
  SUM(total_amount) as revenue
FROM job_orders
WHERE status = 'completed'
GROUP BY TO_CHAR(completed_at, 'Mon YYYY')
ORDER BY MIN(completed_at);
```

### **Most Used Items:**
```sql
-- Top 10 items
SELECT 
  i.part_name,
  SUM(jp.quantity_used) as total_usage,
  SUM(jp.subtotal) as total_cost
FROM job_parts jp
JOIN inventory i ON i.id = jp.inventory_id
GROUP BY i.part_name
ORDER BY total_usage DESC
LIMIT 10;
```

### **Service Type Revenue:**
```sql
-- Revenue by service type
SELECT 
  s.name,
  COUNT(*) as orders,
  SUM(jo.total_amount) as revenue
FROM job_orders jo
JOIN services s ON s.id = jo.service_id
WHERE jo.status = 'completed'
GROUP BY s.name
ORDER BY revenue DESC;
```

---

## 🎊 **SELESAI!**

Database Sunest Auto sudah siap untuk:
- ✅ Real-time booking
- ✅ Inventory management
- ✅ Analytics & reporting
- ✅ Admin dashboard
- ✅ Customer tracking

**Happy coding! 🚀**

---

## 📞 **NEED HELP?**

**Common Files:**
- `/database/migration.sql` - Database schema
- `/database/seed_data_simple.sql` - Initial data
- `/supabase/functions/server/index.tsx` - API endpoints
- `/components/dashboard/BookingTab.tsx` - Booking UI

**Database Tables:**
- `services` - Service packages
- `inventory` - Spare parts
- `job_orders` - Bookings
- `job_parts` - Items used per job
- `profiles` - User profiles
- `vehicles` - Customer vehicles

---

**Last Updated:** February 3, 2026  
**Sunest Auto Platform** v1.0
