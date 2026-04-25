# 🌱 SEED DATA SETUP GUIDE
## Sunest Auto - Real-Time Database & Analytics

---

## 📋 **OVERVIEW**

Seed data ini akan mengisi database Sunest Auto dengan data dummy yang realistic untuk:
- ✅ **25 Spare Parts** dengan berbagai kategori
- ✅ **4 Service Packages** (Hemat, Basic, Standard, Premium)
- ✅ **200+ Completed Jobs** (6 bulan historical data)
- ✅ **Real-Time Analytics** support

---

## 🚀 **CARA SETUP**

### **Step 1: Pastikan Migration Sudah Dijalankan**

Sebelum seed data, pastikan migration sudah running:

```bash
# Login ke Supabase SQL Editor
# Jalankan file: /database/migration.sql
```

### **Step 2: Jalankan Seed Data**

Di Supabase SQL Editor, jalankan:

```sql
-- Jalankan file: /database/seed_data.sql
```

### **Step 3: Verifikasi Data**

```sql
-- Cek jumlah data
SELECT 'Services' as table_name, COUNT(*) as count FROM public.services
UNION ALL
SELECT 'Inventory', COUNT(*) FROM public.inventory
UNION ALL
SELECT 'Job Orders', COUNT(*) FROM public.job_orders
UNION ALL
SELECT 'Job Parts', COUNT(*) FROM public.job_parts
UNION ALL
SELECT 'Reviews', COUNT(*) FROM public.reviews;
```

**Expected Result:**
```
Services: 4
Inventory: 25
Job Orders: ~200+
Job Parts: ~500+
Reviews: ~140+
```

---

## 📦 **DATA YANG DIISI**

### **1. Services (4 Paket)**

| Service Name | Price | Duration | Description |
|-------------|-------|----------|-------------|
| Hemat Service | Rp 100,000 | 60 min | Paket ekonomis |
| Basic Tune-Up | Rp 150,000 | 90 min | Tune-up standar |
| Standard Service | Rp 300,000 | 120 min | Service lengkap |
| Premium Service | Rp 500,000 | 180 min | Premium dengan garansi |

### **2. Inventory (25 Spare Parts)**

**Categories:**
- 🛢️ Lubricants (Oli, Filter) - 3 items
- ⚡ Electrical (Busi, Aki) - 2 items
- 🛑 Brake System (Kampas, Minyak Rem) - 3 items
- 🛞 Tires (Ban Luar, Ban Dalam) - 3 items
- ⚙️ Drive Train (Rantai, V-Belt, Gear) - 3 items
- 🔧 Suspension (Shock) - 2 items
- 🏍️ Engine Parts (Piston, Karburator, Knalpot) - 3 items
- 🎨 Body Parts (Spion, Lampu) - 3 items
- 🧴 Consumables (Grease, Cleaner) - 3 items

**Sample Items:**
```
- Oli Mesin Federal Matic 0.8L (Stock: 245)
- Filter Oli Honda (Stock: 198)
- Busi NGK Iridium (Stock: 156)
- Kampas Rem Depan (Stock: 142)
- Ban Luar IRC 80/90-14 (Stock: 98)
- Rantai RK 428 (Stock: 87)
- Aki GS Astra NS40ZL (Stock: 76)
- Shock Belakang KYB (Stock: 45)
```

### **3. Job Orders (Historical Data)**

**Distribution by Month (Jan-Jun 2026):**
- January: 45 completed jobs
- February: 52 completed jobs
- March: 48 completed jobs (auto-generated)
- April: 58 completed jobs (auto-generated)
- May: 63 completed jobs (auto-generated)
- June: 71 completed jobs (auto-generated)

**Job Details:**
- Status: `completed`
- Labor Cost: Rp 50,000 - 150,000
- Parts Cost: Rp 30,000 - 180,000
- Total Amount: Labor + Parts
- Payment Status: `paid`

### **4. Job Parts (Usage Data)**

Each job order has **2-5 random parts** from inventory:
- Quantity Used: 1-3 units
- Unit Price: Captured at time of job
- Subtotal: Qty × Unit Price

This creates realistic analytics for:
- Most Used Items
- Inventory Cost Analysis
- Stock Movement Trends

### **5. Reviews (~70% of jobs)**

Random reviews with:
- Rating: 4-5 stars
- Sample Comments:
  - "Service sangat memuaskan, teknisi ramah dan profesional!"
  - "Pekerjaan rapi dan cepat. Harga terjangkau."
  - "Recommended! Motor jadi lebih halus."
  - "Pelayanan bagus, akan service lagi disini."
  - "Puas dengan hasilnya. Terima kasih Sunest Auto!"

---

## 🎯 **FITUR YANG DIDUKUNG**

### **1. Real-Time Booking**
✅ Booking baru masuk langsung ke `job_orders` table  
✅ Auto-deduct inventory stock  
✅ Calculate parts cost automatically  
✅ Generate unique job number  

### **2. Analytics (8 Features)**

**Revenue Analytics:**
1. **Revenue Forecasting** - Historical data untuk prediksi
2. **Revenue by Service Type** - Breakdown per service package
3. **Monthly Comparison** - Current vs previous month

**Inventory Analytics:**
4. **Most Used Items** - Top 10 dari `job_parts`
5. **Inventory Cost Analysis** - Labor vs Parts cost per month
6. **Stock Movement Trends** - Weekly stock in/out
7. **Profit Margin per Service** - Margin calculation
8. **Cost Breakdown** - Spare parts vs labor pie chart

### **3. Admin Dashboard**
✅ Real-time KPIs dari database  
✅ Job management (status updates)  
✅ Inventory tracking  
✅ Customer bookings view  

### **4. Customer Dashboard**
✅ View booking history  
✅ Real-time tracking  
✅ Service reviews  

---

## 🔄 **CARA MENGGUNAKAN SETELAH SEED**

### **Test Booking Flow:**

1. **Login sebagai Customer**
2. **Pilih Service Package** di BookingTab
3. **Pilih Items** - Akan auto-load dari inventory
4. **Konfirmasi Booking** - Data masuk ke database real-time

```javascript
// Booking akan create:
// 1. New row di job_orders
// 2. Multiple rows di job_parts
// 3. Update quantity_in_stock di inventory
```

### **Test Analytics:**

```javascript
// Analytics akan fetch real data dari:
GET /analytics/revenue        // Monthly revenue grouping
GET /analytics/inventory      // Most used items aggregation
GET /analytics/services       // Revenue by service type
```

### **Test Admin Functions:**

```javascript
// Admin dapat:
GET /bookings                 // View all bookings
PUT /bookings/:id/status      // Update job status
GET /inventory                // View all inventory
```

---

## 📊 **SAMPLE ANALYTICS OUTPUT**

### Revenue Forecast (dari historical data):

```javascript
{
  "Jan 2026": { revenue: 12500000, orders: 45 },
  "Feb 2026": { revenue: 15200000, orders: 52 },
  "Mar 2026": { revenue: 13800000, orders: 48 },
  "Apr 2026": { revenue: 16900000, orders: 58 },
  "Mei 2026": { revenue: 18500000, orders: 63 },
  "Jun 2026": { revenue: 21000000, orders: 71 },
  "Jul 2026": { revenue: 23500000, forecast: true } // Predicted
}
```

### Most Used Items:

```javascript
[
  {
    name: "Oli Mesin Federal Matic 0.8L",
    usage: 245,
    totalCost: 12005000
  },
  {
    name: "Filter Oli Honda",
    usage: 198,
    totalCost: 6930000
  },
  // ... top 10
]
```

---

## ⚠️ **IMPORTANT NOTES**

1. **UUID Requirements:**
   - Services use fixed UUIDs for mapping
   - Job orders use `gen_random_uuid()`
   - Inventory uses fixed UUIDs for consistency

2. **Dependencies:**
   - Seed data requires existing customer and vehicle records
   - Random functions used for realistic distribution
   - Job orders link to random vehicles and customers

3. **Data Integrity:**
   - All FK constraints respected
   - RLS policies remain active
   - Timestamps are realistic (spread over 6 months)

4. **Customization:**
   - Edit `seed_data.sql` to add more items
   - Adjust job count per month as needed
   - Modify price ranges in random functions

---

## 🔧 **TROUBLESHOOTING**

### Issue: "Foreign key violation"
**Solution:** Make sure customers and vehicles exist first

```sql
-- Check if customers exist
SELECT COUNT(*) FROM public.profiles WHERE role = 'customer';

-- If 0, create demo customer first
INSERT INTO auth.users ...
```

### Issue: "Insufficient data for analytics"
**Solution:** Adjust job count in seed data

```sql
-- Change FROM generate_series(1, 45)
-- To FROM generate_series(1, 100)  -- More jobs
```

### Issue: "Inventory stock negative"
**Solution:** Reset inventory stock

```sql
UPDATE public.inventory 
SET quantity_in_stock = 500 
WHERE quantity_in_stock < minimum_stock_level;
```

---

## 🎊 **SUCCESS!**

Setelah seed data berhasil:
- ✅ Booking flow akan fully functional
- ✅ Analytics akan show real data
- ✅ Dashboard KPIs akan real-time
- ✅ Stock management akan accurate

**Happy coding! 🚀**

---

**Last Updated:** February 3, 2026  
**Sunest Auto Platform** - Real-Time Workshop Management System
