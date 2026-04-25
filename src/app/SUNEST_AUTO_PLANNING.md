# 🏍️ SUNEST AUTO - Platform Digital Bengkel Motor
## Complete Planning & Documentation

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Tech Stack](#tech-stack)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Database Schema](#database-schema)
5. [Feature Breakdown](#feature-breakdown)
6. [User Flows](#user-flows)
7. [Admin Dashboard Features](#admin-dashboard-features)
8. [Customer Dashboard Features](#customer-dashboard-features)
9. [UI/UX Structure](#uiux-structure)
10. [Business Rules](#business-rules)
11. [API Endpoints](#api-endpoints)
12. [Future Enhancements](#future-enhancements)

---

## 🎯 EXECUTIVE SUMMARY

**Sunest Auto** adalah platform digital komprehensif untuk bengkel motor yang memungkinkan:
- **Customer**: Booking service online, tracking progress real-time, dan manage kendaraan
- **Admin**: Mengelola operasi bengkel melalui dashboard dengan scheduling, inventory, dan financial reporting

### Key Features
- ✅ Online booking system dengan promo gratis biaya jasa
- ✅ Real-time job tracking
- ✅ Transparent pricing dengan breakdown detail
- ✅ Inventory management
- ✅ Financial reporting & analytics
- ✅ Customer & vehicle management

---

## 🛠️ TECH STACK

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)
- **Charts**: Recharts
- **State Management**: React Hooks + Local State

### Backend
- **Database**: Supabase (PostgreSQL)
  - Project ID: `tvugghippwvoxsjqyxkr`
  - Project Name: `sunest-auto-new`
- **API**: Supabase Edge Functions (Hono server)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (untuk foto kendaraan, bukti pembayaran)
- **Real-time**: Supabase Real-time subscriptions

### Architecture
- **Pattern**: Three-tier architecture
  - Frontend → Server → Database
- **API Routing**: `/functions/v1/make-server-c1ef5280/<route>`
- **Data Storage**: Key-Value Store (`kv_store_c1ef5280` table)

---

## 👥 USER ROLES & PERMISSIONS

### 1. **Customer (User)**
**Akses:**
- ✅ Dashboard pribadi
- ✅ Booking service baru
- ✅ Lihat history booking
- ✅ Track job progress real-time
- ✅ Manage data kendaraan
- ✅ View invoices & payment history
- ✅ Update profile

**Tidak Bisa:**
- ❌ Akses admin dashboard
- ❌ Manage inventory
- ❌ Lihat data customer lain
- ❌ Edit pricing
- ❌ Manage teknisi

### 2. **Admin (Bengkel)**
**Akses:**
- ✅ Full admin dashboard
- ✅ Manage semua job orders
- ✅ Create booking untuk walk-in customer
- ✅ Assign teknisi ke job
- ✅ Update job status & progress
- ✅ Manage spare parts inventory
- ✅ Financial reporting
- ✅ Customer management
- ✅ Vehicle database
- ✅ Teknisi management
- ✅ Analytics & statistics

**Tidak Bisa:**
- ❌ Login sebagai customer
- ❌ Hapus historical data (soft delete only)

### 3. **Teknisi** ⚠️ (DIHAPUS - Flow Disederhanakan)
Role teknisi sudah dihapus untuk menyederhanakan flow. Admin yang akan manage semua aspek teknisi.

---

## 🗄️ DATABASE SCHEMA

### Main Table: `kv_store_c1ef5280`
Key-Value store untuk semua data dengan prefix-based organization

```typescript
interface KVStore {
  key: string;      // Format: "prefix_id" (e.g., "booking_20260205001")
  value: any;       // JSON object dengan struktur data
  created_at: Date;
  updated_at: Date;
}
```

### Data Models by Prefix

#### 1. **Bookings** (`booking_`)
```typescript
interface Booking {
  id: string;                    // "booking_20260205001"
  job_number: string;            // "JOB-2026-001"
  customer_id: string;           // Reference to customer
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  
  vehicle_id: string;            // Reference to vehicle
  vehicle_name: string;          // "Yamaha NMAX"
  vehicle_plate: string;         // "B 1234 XYZ"
  
  service_type: string;          // "Basic Tune-Up", "Oil Change", etc.
  service_package?: string;      // "Basic", "Standard", "Premium" (deprecated for admin)
  
  scheduled_date: string;        // ISO date
  scheduled_time?: string;       // "09:00", "14:00"
  
  status: 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  
  technician_id?: string;        // Reference to technician
  technician_name?: string;
  
  // Pricing
  service_fee: number;           // 0 for customer booking, 25000 for admin booking
  spare_parts: SparePartItem[];  // Array of parts used
  total_amount: number;          // service_fee + sum(spare_parts prices)
  
  // Additional
  notes?: string;                // Catatan khusus
  complaints?: string;           // Keluhan customer
  recommendations?: string;      // Rekomendasi teknisi
  
  // Metadata
  booking_source: 'customer' | 'admin';  // Track booking origin
  created_by: string;            // user_id or admin_id
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface SparePartItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
```

#### 2. **Customers** (`customer_`)
```typescript
interface Customer {
  id: string;                    // "customer_001"
  user_id?: string;              // Supabase Auth ID (if registered)
  
  name: string;
  email?: string;
  phone: string;
  address?: string;
  
  // Stats
  total_visits: number;
  total_spent: number;
  last_visit?: string;
  
  // Vehicles owned
  vehicle_ids: string[];         // ["vehicle_001", "vehicle_002"]
  
  // Metadata
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

#### 3. **Vehicles** (`vehicle_`)
```typescript
interface Vehicle {
  id: string;                    // "vehicle_001"
  customer_id: string;
  
  brand: string;                 // "Yamaha", "Honda", "Suzuki"
  model: string;                 // "NMAX", "PCX", "Vario"
  year?: number;                 // 2020
  plate_number: string;          // "B 1234 XYZ"
  color?: string;
  engine_capacity?: string;      // "155cc"
  
  // Service history
  last_service_date?: string;
  last_service_km?: number;
  current_km?: number;
  
  // Metadata
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

#### 4. **Spare Parts** (`sparepart_`)
```typescript
interface SparePart {
  id: string;                    // "sparepart_001"
  sku?: string;                  // "SP-OIL-001"
  
  name: string;                  // "Oli Yamalube 10W-40"
  category: string;              // "Oil", "Battery", "Brake", "Filter", etc.
  brand?: string;                // "Yamalube", "Federal", "NGK"
  
  stock: number;
  min_stock: number;             // Alert threshold
  unit: string;                  // "pcs", "liter", "set"
  
  // Pricing
  purchase_price: number;        // Harga beli
  selling_price: number;         // Harga jual
  
  // Metadata
  status: 'available' | 'out_of_stock' | 'discontinued';
  supplier?: string;
  last_restock?: string;
  created_at: string;
  updated_at: string;
}
```

#### 5. **Technicians** (`technician_`)
```typescript
interface Technician {
  id: string;                    // "technician_001"
  
  name: string;
  phone: string;
  email?: string;
  
  specialization: string;        // "Engine", "Electrical", "General"
  experience_years?: number;
  
  // Performance
  rating: number;                // 1-5
  total_jobs_completed: number;
  active_jobs: number;
  
  // Schedule
  working_days: string[];        // ["monday", "tuesday", "wednesday"]
  working_hours: {
    start: string;               // "08:00"
    end: string;                 // "17:00"
  };
  
  // Metadata
  status: 'active' | 'inactive' | 'on_leave';
  hire_date?: string;
  created_at: string;
  updated_at: string;
}
```

#### 6. **Services** (`service_`)
```typescript
interface Service {
  id: string;                    // "service_001"
  
  name: string;                  // "Basic Tune-Up"
  category: string;              // "Maintenance", "Repair", "Custom"
  description?: string;
  
  // Pricing (DEPRECATED - sekarang fixed Rp 25.000 untuk admin)
  base_price: number;            // Kept for reference
  
  estimated_duration: number;    // in minutes
  
  // Common parts
  recommended_parts?: string[];  // ["sparepart_001", "sparepart_002"]
  
  // Metadata
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

#### 7. **Invoices** (`invoice_`)
```typescript
interface Invoice {
  id: string;                    // "invoice_001"
  invoice_number: string;        // "INV-2026-001"
  booking_id: string;
  
  customer_id: string;
  customer_name: string;
  
  // Items
  service_fee: number;
  spare_parts: SparePartItem[];
  
  // Totals
  subtotal: number;
  tax?: number;
  discount?: number;
  total_amount: number;
  
  // Payment
  payment_status: 'unpaid' | 'partial' | 'paid';
  payment_method?: 'cash' | 'transfer' | 'qris';
  paid_amount: number;
  paid_at?: string;
  
  // Metadata
  issued_at: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}
```

#### 8. **Analytics** (`analytics_`)
```typescript
interface DailyAnalytics {
  id: string;                    // "analytics_20260205"
  date: string;                  // "2026-02-05"
  
  // Revenue
  total_revenue: number;
  service_revenue: number;
  parts_revenue: number;
  
  // Operations
  total_jobs: number;
  completed_jobs: number;
  pending_jobs: number;
  cancelled_jobs: number;
  
  // Customer
  new_customers: number;
  returning_customers: number;
  
  // Inventory
  parts_sold: number;
  low_stock_alerts: number;
  
  created_at: string;
  updated_at: string;
}
```

---

## ⚡ FEATURE BREAKDOWN

### 🔵 CUSTOMER FEATURES

#### 1. **Dashboard Customer**
**Path**: `/customer/dashboard`

**Widgets:**
- 📊 Quick Stats
  - Total kendaraan terdaftar
  - Service aktif (ongoing)
  - Service selesai (history)
  - Total pengeluaran
  
- 🏍️ Kendaraan Saya
  - List semua kendaraan
  - Status service terakhir
  - Quick action: Book service
  
- 📅 Service Aktif
  - Job number & status
  - Estimated completion
  - Real-time progress tracking
  
- 📜 Recent History
  - 5 service terakhir
  - Quick view invoice

**Actions:**
- ➕ Booking service baru
- 🏍️ Tambah kendaraan baru
- 👤 Edit profile

---

#### 2. **Booking Service** (Customer)
**Path**: `/customer/booking/new`

**Flow:**
```
Step 1: Pilih Kendaraan
├─ Pilih dari kendaraan terdaftar
└─ Atau tambah kendaraan baru
    ├─ Merk & Model
    ├─ Plat nomor
    ├─ Tahun
    └─ Warna (optional)

Step 2: Pilih Service
├─ Service Type (dropdown/cards)
│   ├─ Basic Tune-Up
│   ├─ Oil Change
│   ├─ Brake Service
│   ├─ Electrical Check
│   └─ Custom
└─ Keluhan/Notes (textarea)

Step 3: Pilih Jadwal
├─ Tanggal (date picker)
│   └─ Disabled: hari ini & tanggal lalu
└─ Waktu (time slots)
    ├─ 08:00 - 10:00
    ├─ 10:00 - 12:00
    ├─ 13:00 - 15:00
    └─ 15:00 - 17:00

Step 4: Konfirmasi & Submit
├─ Review booking details
├─ Pricing breakdown:
│   ├─ Service Fee: Rp 0 (GRATIS - Promo Online Booking! 🎉)
│   ├─ Spare parts: TBD (akan ditentukan teknisi)
│   └─ Estimated Total: Mulai dari Rp 0
└─ Submit button
    └─ Success: Redirect to tracking page
```

**Business Rules:**
- ✅ Service fee GRATIS (Rp 0) untuk customer booking
- ✅ Spare parts akan ditentukan saat service
- ✅ Customer dapat cancel booking sebelum status "in_progress"
- ✅ Notification via email/SMS (future)

---

#### 3. **Track Job Order**
**Path**: `/customer/jobs/[id]`

**Components:**
- 📍 Progress Timeline
  ```
  ✅ Booking Created (2026-02-05 09:00)
  ✅ Confirmed by Admin (2026-02-05 09:30)
  ✅ Technician Assigned: Budi (2026-02-05 10:00)
  🔄 In Progress - Checking engine... (Current)
  ⏳ Quality Check (Pending)
  ⏳ Completed (Pending)
  ```

- 📋 Job Details
  - Job Number
  - Status badge (color-coded)
  - Scheduled date/time
  - Teknisi assigned
  - Service type
  - Kendaraan info

- 💰 Pricing Breakdown (Real-time update)
  ```
  Service Fee: Rp 0 (Promo Online Booking)
  
  Spare Parts:
  ├─ Oli Yamalube 10W-40 (1x) - Rp 75.000
  ├─ Filter Oli (1x) - Rp 25.000
  └─ Busi NGK (1x) - Rp 35.000
  
  Total: Rp 135.000
  ```

- 💬 Notes & Recommendations
  - Keluhan customer
  - Temuan teknisi
  - Rekomendasi service berikutnya

**Real-time Updates:**
- Auto-refresh setiap 10 detik
- Status changes notification
- Parts added notification

---

#### 4. **History & Invoices**
**Path**: `/customer/history`

**Features:**
- 📊 Filter & Search
  - By date range
  - By vehicle
  - By status
  - By service type

- 📋 List View
  - Job number
  - Date
  - Vehicle
  - Service
  - Total amount
  - Status
  - Quick actions: View detail, Download invoice

- 📄 Invoice Detail
  - Full breakdown
  - Payment status
  - Download PDF (future)

---

#### 5. **Manage Kendaraan**
**Path**: `/customer/vehicles`

**Features:**
- ➕ Tambah kendaraan baru
- ✏️ Edit data kendaraan
- 🗑️ Hapus kendaraan (soft delete)
- 📊 Service history per kendaraan
- 📅 Service reminder (future)

**Kendaraan Card:**
```
┌─────────────────────────────┐
│ 🏍️ Yamaha NMAX             │
│ B 1234 XYZ                  │
│                             │
│ Last Service: 15 Jan 2026   │
│ Total Service: 12x          │
│                             │
│ [Book Service] [Edit] [...]│
└─────────────────────────────┘
```

---

### 🔴 ADMIN FEATURES

#### 1. **Admin Dashboard**
**Path**: `/admin/dashboard`

**Main Sections:**

##### A. **Stats Overview** (Top Cards)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 💰 Revenue   │ 📋 Jobs      │ 👥 Customers │ 📦 Low Stock │
│ Rp 2.5M      │ 45 Active    │ 128 Total    │ 8 Items      │
│ +12% ↑       │ +5 Today     │ +3 New       │ ⚠️ Alert     │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

##### B. **Quick Actions**
- ➕ Buat Job Baru (Walk-in customer)
- 👥 Tambah Customer
- 📦 Update Stock
- 👨‍🔧 Manage Teknisi

##### C. **Active Jobs Table**
```
Job Number | Customer | Vehicle | Service | Status | Technician | Actions
-----------|----------|---------|---------|--------|------------|--------
JOB-001    | Budi     | NMAX    | Tune-Up | In Prog| Andi       | [View][Edit]
JOB-002    | Siti     | Vario   | Oil Chg | Pending| -          | [Assign]
...
```

##### D. **Charts & Analytics**
- 📊 Revenue Chart (7 hari terakhir)
- 📈 Jobs Trend (bulanan)
- 🏆 Top Services
- 👨‍🔧 Technician Performance

##### E. **Calendar View**
- 📅 Scheduled jobs by date
- Color-coded by status
- Drag & drop reschedule (future)

---

#### 2. **Create Job (Admin)**
**Path**: `/admin/jobs/new`

**Flow:**
```
Step 1: Customer Selection
├─ Search existing customer (autocomplete)
│   ├─ By name
│   ├─ By phone
│   └─ By vehicle plate
└─ Or create new customer
    ├─ Name *
    ├─ Phone *
    ├─ Email (optional)
    └─ Address (optional)

Step 2: Vehicle Selection
├─ If existing customer: Select from their vehicles
└─ Or add new vehicle
    ├─ Merk & Model *
    ├─ Plat Nomor *
    ├─ Tahun
    └─ Warna

Step 3: Service Details
├─ Service Type *
├─ Keluhan customer (textarea)
├─ Scheduled Date & Time *
└─ Priority (optional)

Step 4: Pricing (SIMPLIFIED)
├─ Service Fee: Rp 25.000 (FIXED - No package selection)
├─ Spare Parts: (Add as needed)
│   ├─ Search part
│   ├─ Quantity
│   └─ Auto-calculate subtotal
└─ Total Preview

Step 5: Assignment (Optional)
├─ Assign technician now
└─ Or assign later

Step 6: Confirm & Create
└─ Generate job number automatically
```

**Business Rules:**
- ✅ Service fee FIXED Rp 25.000 (no package selection)
- ✅ Admin dapat langsung assign teknisi atau nanti
- ✅ Job number auto-generated: JOB-YYYYMMDD-XXX
- ✅ Status awal: 'confirmed' (skip pending for walk-in)

---

#### 3. **Job Management**
**Path**: `/admin/jobs`

**Views:**

##### A. **All Jobs Table** (Default)
- Sortable columns
- Filter by status, date, technician
- Search by job number, customer, vehicle
- Bulk actions (future)

##### B. **Job Detail View**
**Path**: `/admin/jobs/[id]`

**Tabs:**
1. **Overview**
   - Job info
   - Customer & vehicle details
   - Status timeline
   - Assigned technician
   
2. **Service Details**
   - Service type & description
   - Keluhan customer
   - Findings & recommendations
   - Photos (future)
   
3. **Pricing & Parts**
   - Service fee
   - Parts list (editable)
   - Add/remove parts
   - Total calculation
   
4. **History**
   - Status changes log
   - Who updated & when
   - Notes history

**Actions:**
- ✏️ Edit job details
- 👨‍🔧 Assign/reassign technician
- 🔄 Update status
- 💰 Update pricing/parts
- 📄 Generate invoice
- ❌ Cancel job

---

#### 4. **Assign Technician**
**Path**: `/admin/jobs/[id]/assign-technician`

**Features:**
- 📋 Job summary at top
- 👨‍🔧 List available technicians
  ```
  ┌─────────────────────────────┐
  │ ✅ Andi Pratama             │ [SELECTED]
  │ Specialist: Engine          │
  │ 2 Active | 156 Done | ⭐ 4.8│
  └─────────────────────────────┘
  
  ┌─────────────────────────────┐
  │ Budi Santoso                │
  │ Specialist: Electrical      │
  │ 1 Active | 98 Done | ⭐ 4.9 │
  └─────────────────────────────┘
  ```
- 📝 Notes untuk teknisi (optional)
- ✅ Confirm button
- 🔔 Notification to technician (future)

**Business Rules:**
- ✅ Only show active technicians
- ✅ Show current workload
- ✅ Suggest based on specialization (future AI)
- ✅ Update job status to 'scheduled' after assign

---

#### 5. **Inventory Management**
**Path**: `/admin/inventory`

**Features:**

##### A. **Parts List**
```
SKU     | Name            | Category | Stock | Price  | Status  | Actions
--------|-----------------|----------|-------|--------|---------|--------
SP-001  | Oli Yamalube    | Oil      | 15    | 75.000 | ✅ OK   | [Edit]
SP-002  | Filter Oli      | Filter   | 3     | 25.000 | ⚠️ Low  | [Restock]
SP-003  | Busi NGK        | Spark    | 0     | 35.000 | 🔴 Out  | [Restock]
```

##### B. **Low Stock Alerts**
- Dashboard widget
- Email notification (future)
- Restock suggestions

##### C. **Add/Edit Spare Part**
**Path**: `/admin/inventory/new` or `/admin/inventory/[id]/edit`

**Form:**
```
Basic Info:
├─ SKU (auto-generate or custom)
├─ Name *
├─ Category * (dropdown)
├─ Brand
└─ Description

Stock:
├─ Current Stock *
├─ Min Stock (alert threshold) *
└─ Unit * (pcs, liter, set)

Pricing:
├─ Purchase Price
└─ Selling Price *

Additional:
├─ Supplier
└─ Last Restock Date
```

##### D. **Stock Movement History**
- Track in/out movements
- Link to jobs (parts used)
- Restock history

---

#### 6. **Customer Management**
**Path**: `/admin/customers`

**Features:**

##### A. **Customer List**
```
Name         | Phone        | Vehicles | Total Visits | Total Spent | Last Visit
-------------|--------------|----------|--------------|-------------|------------
Budi S.      | 0812xxx      | 2        | 12           | Rp 1.2M     | 2 Feb 2026
Siti A.      | 0813xxx      | 1        | 5            | Rp 450K     | 1 Feb 2026
```

##### B. **Customer Detail**
**Path**: `/admin/customers/[id]`

**Tabs:**
1. **Profile**
   - Personal info
   - Contact details
   - Edit button
   
2. **Vehicles**
   - List kendaraan customer
   - Add new vehicle
   
3. **Service History**
   - All jobs for this customer
   - Total revenue from customer
   - Favorite services
   
4. **Invoices**
   - All invoices
   - Payment status
   - Outstanding balance

---

#### 7. **Financial Reports**
**Path**: `/admin/reports`

**Sections:**

##### A. **Revenue Overview**
```
Period Selector: [Daily] [Weekly] [Monthly] [Custom Range]

Today's Revenue: Rp 850.000
This Week: Rp 4.2M
This Month: Rp 15.8M

Breakdown:
├─ Service Fees: Rp 625.000 (12% - fixed Rp 25k per job)
└─ Spare Parts: Rp 7.175.000 (88%)
```

##### B. **Charts**
- 📊 Revenue trend (line chart)
- 🥧 Revenue by category (pie chart)
- 📈 Jobs completion rate
- 💰 Average order value

##### C. **Top Performers**
- 🏆 Top selling spare parts
- 👨‍🔧 Best technician (by jobs completed)
- 👥 Top customers (by spending)

##### D. **Export Options**
- 📄 Export to Excel
- 📊 Generate PDF report
- 📧 Email report (future)

---

#### 8. **Technician Management**
**Path**: `/admin/technicians`

**Features:**

##### A. **Technician List**
```
Name         | Specialization | Rating | Active Jobs | Total Done | Status
-------------|----------------|--------|-------------|------------|--------
Andi P.      | Engine         | ⭐ 4.8 | 2           | 156        | ✅ Active
Budi S.      | Electrical     | ⭐ 4.9 | 1           | 98         | ✅ Active
```

##### B. **Add/Edit Technician**
**Form:**
```
Personal:
├─ Name *
├─ Phone *
└─ Email

Professional:
├─ Specialization * (Engine, Electrical, General)
├─ Experience (years)
└─ Hire Date

Schedule:
├─ Working Days (checkbox: Mon-Sun)
└─ Working Hours (start - end)

Status: [Active] [Inactive] [On Leave]
```

##### C. **Technician Performance**
**Path**: `/admin/technicians/[id]`

**Metrics:**
- Total jobs completed
- Average completion time
- Customer rating
- Current workload
- Recent jobs

---

## 🔄 USER FLOWS

### Flow 1: Customer Booking Service (Happy Path)

```mermaid
Customer Journey:
1. Login/Register → Customer Dashboard
2. Click "Booking Service Baru"
3. Pilih Kendaraan (atau tambah baru)
4. Pilih Service Type + Tulis Keluhan
5. Pilih Tanggal & Waktu
6. Review: Service Fee = Rp 0 (PROMO!) 🎉
7. Submit Booking
8. Dapat Job Number (JOB-2026-XXX)
9. Redirect ke Tracking Page
10. Terima notifikasi konfirmasi (email/SMS)

Admin Side:
11. Admin dapat notifikasi booking baru
12. Admin review & confirm booking
13. Admin assign teknisi
14. Teknisi mulai kerja → update progress
15. Teknisi tambah spare parts jika perlu
16. Job completed
17. Generate invoice
18. Customer bayar & review

Customer:
19. Terima invoice
20. Lihat breakdown pricing
21. Bayar (cash/transfer)
22. Service selesai! ✅
```

### Flow 2: Admin Create Walk-in Booking

```mermaid
Admin Journey:
1. Walk-in customer datang ke bengkel
2. Admin login → Admin Dashboard
3. Click "Buat Job Baru"
4. Cari customer existing ATAU buat baru
   ├─ Input: Nama, Phone, Email
5. Pilih/Tambah kendaraan
   ├─ Input: Merk, Model, Plat
6. Input Service Details
   ├─ Service Type
   ├─ Keluhan customer
   ├─ Schedule (bisa hari ini)
7. Pricing Section:
   ├─ Service Fee: Rp 25.000 (FIXED)
   ├─ Add Spare Parts (search & add)
   └─ Total Auto-calculate
8. Assign Technician (optional, bisa nanti)
9. Submit → Job Created!
10. Status: "Confirmed" (skip pending)
11. Print job order (future)
12. Assign teknisi jika belum
13. Teknisi mulai kerja
14. Update progress & parts
15. Complete → Generate invoice
16. Customer bayar & selesai
```

### Flow 3: Job Progress Update (Admin/Teknisi)

```mermaid
1. Admin Dashboard → Active Jobs
2. Click job untuk view detail
3. Current Status: "Scheduled"
4. Click "Update Status" → "In Progress"
5. Add notes: "Sedang cek mesin..."
6. Customer dapat real-time update
7. Teknisi temukan masalah → Add parts
   ├─ Search part dari inventory
   ├─ Set quantity
   ├─ Part auto-deduct dari stock
   └─ Price auto-add ke total
8. Continue work...
9. Update status → "Quality Check"
10. Final check OK
11. Update status → "Completed"
12. Generate Invoice
13. Customer notification → job selesai
14. Customer lihat final invoice
15. Payment → Close job
```

---

## 🎨 UI/UX STRUCTURE

### Color Scheme
```css
Primary: Orange (#FF6B00)
  - Buttons, CTAs, highlights
  - rgb(255, 107, 0)

Secondary: Blue (#2563EB)
  - Info, links, badges
  - rgb(37, 99, 235)

Success: Green (#10B981)
  - Completed, success states
  - rgb(16, 185, 129)

Warning: Yellow (#F59E0B)
  - Warnings, pending states
  - rgb(245, 158, 11)

Danger: Red (#EF4444)
  - Errors, cancelled, alerts
  - rgb(239, 68, 68)

Neutral:
  - Gray-900: #111827 (text)
  - Gray-600: #4B5563 (secondary text)
  - Gray-200: #E5E7EB (borders)
  - Gray-100: #F3F4F6 (backgrounds)
```

### Typography
```css
Font Family: System UI Stack
  - font-family: ui-sans-serif, system-ui, sans-serif

Headings:
  - H1: text-2xl font-bold (24px)
  - H2: text-xl font-bold (20px)
  - H3: text-lg font-semibold (18px)
  - H4: text-base font-semibold (16px)

Body:
  - Regular: text-sm (14px)
  - Small: text-xs (12px)
```

### Component Library (Shadcn/ui)
```
✅ Button (variants: default, ghost, outline, destructive)
✅ Input (text, email, tel, number, date, time)
✅ Textarea
✅ Select/Dropdown
✅ Checkbox
✅ Radio
✅ Badge (status indicators)
✅ Card (containers)
✅ Dialog/Modal (confirmations)
✅ Toast (notifications via Sonner)
✅ Table (data lists)
✅ Tabs
✅ Calendar/Date Picker
```

### Layout Structure

#### Customer Layout
```
┌─────────────────────────────────────────┐
│ [Logo] Sunest Auto    [User] [Logout]  │ ← Header
├─────────────────────────────────────────┤
│ ┌─────┐                                 │
│ │ Nav │  Main Content Area              │
│ │ ├─ 🏠 Dashboard                       │
│ │ ├─ 📅 Booking                         │
│ │ ├─ 🏍️ Kendaraan                      │
│ │ ├─ 📋 History                         │
│ │ └─ 👤 Profile                         │
│ └─────┘                                 │
└─────────────────────────────────────────┘
```

#### Admin Layout
```
┌─────────────────────────────────────────┐
│ [Logo] Admin Panel    [Admin] [Logout] │ ← Header
├─────────────────────────────────────────┤
│ ┌─────┐                                 │
│ │ Nav │  Main Content Area              │
│ │ ├─ 📊 Dashboard                       │
│ │ ├─ 📋 Jobs                            │
│ │ ├─ 👥 Customers                       │
│ │ ├─ 🏍️ Vehicles                       │
│ │ ├─ 📦 Inventory                       │
│ │ ├─ 👨‍🔧 Technicians                   │
│ │ ├─ 💰 Reports                         │
│ │ └─ ⚙️ Settings                        │
│ └─────┘                                 │
└─────────────────────────────────────────┘
```

### Status Badges & Colors
```
Booking Status:
├─ pending: 🟡 Yellow (Menunggu konfirmasi)
├─ confirmed: 🔵 Blue (Dikonfirmasi admin)
├─ scheduled: 🟣 Purple (Teknisi assigned)
├─ in_progress: 🟠 Orange (Sedang dikerjakan)
├─ completed: 🟢 Green (Selesai)
└─ cancelled: 🔴 Red (Dibatalkan)

Payment Status:
├─ unpaid: 🔴 Red
├─ partial: 🟡 Yellow
└─ paid: 🟢 Green

Stock Status:
├─ available: 🟢 Green (Stock > min_stock)
├─ low_stock: 🟡 Yellow (Stock ≤ min_stock)
└─ out_of_stock: 🔴 Red (Stock = 0)
```

---

## 📐 BUSINESS RULES

### Pricing Rules
1. **Customer Booking via Dashboard:**
   - ✅ Service Fee = **Rp 0** (GRATIS - Promo Online Booking)
   - ✅ Spare parts charged based on usage
   - ✅ Total = Rp 0 + spare parts

2. **Admin Booking (Walk-in):**
   - ✅ Service Fee = **Rp 25.000** (FIXED - No package selection)
   - ✅ Spare parts charged based on usage
   - ✅ Total = Rp 25.000 + spare parts

3. **Spare Parts Pricing:**
   - ✅ Use selling_price from inventory
   - ✅ Auto-calculate: quantity × unit_price
   - ✅ Real-time update total saat parts ditambah/dikurangi

### Job Status Flow
```
Customer Booking:
pending → confirmed → scheduled → in_progress → completed
   ↓          ↓           ↓            ↓
cancelled  cancelled  cancelled   cancelled

Admin Booking (Walk-in):
confirmed → scheduled → in_progress → completed
    ↓           ↓           ↓
cancelled   cancelled  cancelled
```

**Transition Rules:**
- `pending → confirmed`: Admin review & approve
- `confirmed → scheduled`: Teknisi assigned
- `scheduled → in_progress`: Teknisi mulai kerja
- `in_progress → completed`: All work done, invoice ready
- `any → cancelled`: Customer/admin cancel (with reason)

### Inventory Rules
1. **Auto-deduct stock** saat spare part ditambahkan ke job
2. **Alert** jika stock ≤ min_stock
3. **Block usage** jika stock = 0 (must restock first)
4. **Stock history** untuk audit trail

### Scheduling Rules
1. **Customer booking:**
   - ❌ Cannot book same day (must be tomorrow or later)
   - ❌ Cannot book past dates
   - ✅ Time slots: 08:00, 10:00, 13:00, 15:00

2. **Admin booking:**
   - ✅ Can book same day (walk-in)
   - ✅ Can book any future date
   - ✅ Custom time slots

3. **Capacity limit (future):**
   - Max 2 jobs per technician per time slot
   - Auto-suggest available slots

### Validation Rules
```javascript
// Customer data
customer.name: required, min 3 chars
customer.phone: required, format: 08xxx (10-13 digits)
customer.email: optional, valid email format

// Vehicle data
vehicle.brand: required
vehicle.model: required
vehicle.plate_number: required, unique, format: X 0000 XXX

// Booking data
booking.service_type: required
booking.scheduled_date: required, future date
booking.vehicle_id: required

// Parts data
part.name: required
part.stock: required, number ≥ 0
part.selling_price: required, number > 0
```

---

## 🔌 API ENDPOINTS

### Base URL
```
https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280
```

### Authentication
```
Headers:
  Authorization: Bearer {publicAnonKey}
  Content-Type: application/json
```

### Endpoints

#### Bookings
```
GET    /bookings                 - List all bookings
GET    /bookings/:id             - Get booking detail
POST   /bookings                 - Create new booking
PUT    /bookings/:id             - Update booking
DELETE /bookings/:id             - Cancel booking (soft delete)

GET    /bookings/customer/:id    - Get customer's bookings
GET    /bookings/status/:status  - Filter by status
```

#### Customers
```
GET    /customers                - List all customers
GET    /customers/:id            - Get customer detail
POST   /customers                - Create customer
PUT    /customers/:id            - Update customer
DELETE /customers/:id            - Soft delete customer

GET    /customers/search?q=      - Search by name/phone
```

#### Vehicles
```
GET    /vehicles                 - List all vehicles
GET    /vehicles/:id             - Get vehicle detail
POST   /vehicles                 - Create vehicle
PUT    /vehicles/:id             - Update vehicle
DELETE /vehicles/:id             - Soft delete vehicle

GET    /vehicles/customer/:id    - Get customer's vehicles
GET    /vehicles/search?plate=   - Search by plate number
```

#### Spare Parts
```
GET    /parts                    - List all parts
GET    /parts/:id                - Get part detail
POST   /parts                    - Create part
PUT    /parts/:id                - Update part (including stock)
DELETE /parts/:id                - Soft delete part

GET    /parts/low-stock          - Get parts with stock ≤ min_stock
GET    /parts/category/:cat      - Filter by category
GET    /parts/search?q=          - Search parts
```

#### Technicians
```
GET    /technicians              - List all technicians
GET    /technicians/:id          - Get technician detail
POST   /technicians              - Create technician
PUT    /technicians/:id          - Update technician
DELETE /technicians/:id          - Soft delete technician

GET    /technicians/available    - Get active technicians
GET    /technicians/:id/jobs     - Get technician's jobs
```

#### Invoices
```
GET    /invoices                 - List all invoices
GET    /invoices/:id             - Get invoice detail
POST   /invoices                 - Generate invoice (from booking)
PUT    /invoices/:id/payment     - Update payment status

GET    /invoices/booking/:id     - Get invoice by booking
GET    /invoices/customer/:id    - Get customer's invoices
```

#### Analytics
```
GET    /analytics/dashboard      - Dashboard stats
GET    /analytics/revenue        - Revenue reports
  ?period=daily|weekly|monthly
  &start=YYYY-MM-DD
  &end=YYYY-MM-DD

GET    /analytics/top-parts      - Best selling parts
GET    /analytics/top-customers  - Top customers by spending
GET    /analytics/technician-performance
```

#### KV Store (Generic)
```
GET    /kv/:key                  - Get single value
POST   /kv                       - Set value
  Body: { key, value }
DELETE /kv/:key                  - Delete key

GET    /kv/prefix/:prefix        - Get all by prefix
POST   /kv/batch                 - Set multiple values
  Body: { items: [{key, value}] }
DELETE /kv/batch                 - Delete multiple keys
  Body: { keys: [] }
```

---

## 🚀 FUTURE ENHANCEMENTS

### Phase 2 (Short-term)
- [ ] 📧 Email & SMS notifications
- [ ] 💳 Online payment integration (Midtrans/Xendit)
- [ ] 📸 Photo upload (before/after service)
- [ ] ⭐ Customer rating & review system
- [ ] 📱 Push notifications (PWA)
- [ ] 🔔 Real-time notifications (toast/popup)
- [ ] 📄 PDF invoice generation & download
- [ ] 📊 Export reports to Excel/PDF

### Phase 3 (Mid-term)
- [ ] 🤖 AI-powered recommendations
  - Suggest service based on vehicle age/km
  - Auto-suggest parts for service type
  - Predict maintenance schedule
- [ ] 📅 Drag & drop calendar reschedule
- [ ] 💬 In-app chat (customer ↔ admin)
- [ ] 🎫 Promo code & discount system
- [ ] 👥 Multi-branch support
- [ ] 📦 Supplier management
- [ ] 🔐 Role-based access control (RBAC)
- [ ] 📱 Mobile app (React Native)

### Phase 4 (Long-term)
- [ ] 🚀 Marketplace (spare parts e-commerce)
- [ ] 🤝 Partnership with spare parts suppliers
- [ ] 📊 Advanced analytics & BI dashboard
- [ ] 🌐 Multi-language support
- [ ] 💰 Loyalty program & points
- [ ] 🔄 Recurring service subscriptions
- [ ] 🚗 Expand to car service
- [ ] 🏢 B2B corporate accounts

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Mobile-First Approach
- ✅ Stack cards vertically on mobile
- ✅ Hamburger menu for navigation
- ✅ Bottom navigation for key actions
- ✅ Touch-friendly buttons (min 44px height)
- ✅ Swipe gestures for tables/cards
- ✅ Optimized images for mobile data

---

## 🔒 SECURITY & PERMISSIONS

### Authentication
- ✅ Supabase Auth (email/password)
- ✅ Social login: Google, Facebook (future)
- ✅ JWT token-based auth
- ✅ Auto-logout after 24h inactivity

### Authorization
```javascript
// Customer permissions
if (user.role === 'customer') {
  allow: [
    'view own bookings',
    'create booking',
    'view own vehicles',
    'update own profile'
  ]
  deny: [
    'view other customer data',
    'access admin dashboard',
    'modify inventory',
    'view financial reports'
  ]
}

// Admin permissions
if (user.role === 'admin') {
  allow: [
    'all customer permissions',
    'view all bookings',
    'create/edit/delete any booking',
    'manage customers',
    'manage inventory',
    'manage technicians',
    'view financial reports',
    'system settings'
  ]
}
```

### Data Privacy
- ✅ Customer data encrypted at rest
- ✅ HTTPS only (SSL/TLS)
- ✅ No password stored in plain text
- ✅ GDPR compliance (data export/delete)
- ✅ Audit logs for sensitive operations

---

## 🧪 TESTING CHECKLIST

### Unit Tests
- [ ] API endpoints response validation
- [ ] Pricing calculation accuracy
- [ ] Stock deduction logic
- [ ] Date/time validation
- [ ] Search & filter functions

### Integration Tests
- [ ] Complete booking flow (customer)
- [ ] Complete job creation (admin)
- [ ] Payment processing
- [ ] Inventory update on job complete
- [ ] Real-time updates propagation

### E2E Tests
- [ ] Customer registration → booking → tracking → payment
- [ ] Admin create job → assign → update → invoice
- [ ] Inventory low stock alert
- [ ] Report generation

### Performance Tests
- [ ] Load test: 100 concurrent users
- [ ] Database query optimization
- [ ] Image loading optimization
- [ ] Mobile performance audit

---

## 📊 SUCCESS METRICS (KPIs)

### Business Metrics
- 📈 Monthly Revenue
- 📊 Number of Jobs Completed
- 👥 Customer Acquisition Rate
- 🔄 Customer Retention Rate
- ⭐ Average Customer Rating

### Operational Metrics
- ⏱️ Average Job Completion Time
- 📦 Inventory Turnover Rate
- 👨‍🔧 Technician Utilization Rate
- 📅 Booking Fulfillment Rate

### Technical Metrics
- ⚡ Page Load Time (< 3s)
- 🔄 API Response Time (< 500ms)
- 🐛 Error Rate (< 1%)
- ✅ Uptime (> 99.5%)

---

## 🎯 CONCLUSION

Sunest Auto adalah platform komprehensif yang mendigitalisasi seluruh operasi bengkel motor, dari booking hingga financial reporting. Dengan fokus pada:

✅ **User Experience**: Simple, intuitive, mobile-friendly
✅ **Transparency**: Clear pricing breakdown
✅ **Efficiency**: Streamlined workflow untuk admin & customer
✅ **Scalability**: Arsitektur yang siap untuk growth
✅ **Security**: Data protection & proper authentication

**Next Steps:**
1. ✅ Complete core features (booking, tracking, inventory)
2. 🔄 Implement real-time notifications
3. 📧 Add email/SMS integration
4. 💳 Integrate payment gateway
5. 📱 Develop mobile app
6. 🚀 Scale & optimize!

---

**Document Version:** 1.0
**Last Updated:** February 5, 2026
**Maintained by:** Sunest Auto Development Team

---

*"Transforming traditional bengkel into smart, digital-first service centers."* 🏍️✨
