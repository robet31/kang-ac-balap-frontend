# 🏍️ SUNEST AUTO - PLATFORM FLOW DOCUMENTATION

**Version:** 2.0  
**Project:** Sunest Auto - Digital Platform untuk Bengkel Motor  
**Supabase Project:** sunest-auto-new (ID: tvugghippwvoxsjqyxkr)  
**Last Updated:** 4 Februari 2026  

---

## 📋 TABLE OF CONTENTS

1. [Platform Overview](#platform-overview)
2. [Tech Stack](#tech-stack)
3. [User Roles & Access](#user-roles--access)
4. [Database Schema](#database-schema)
5. [Core Features Flow](#core-features-flow)
6. [Component Architecture](#component-architecture)
7. [Real-Time Integration](#real-time-integration)
8. [API Routes](#api-routes)
9. [State Management](#state-management)
10. [Important Notes](#important-notes)

---

## 🎯 PLATFORM OVERVIEW

Sunest Auto adalah platform digital komprehensif untuk bengkel motor dengan 3 fungsi utama:

### **Customer Side**
- Booking service dengan pilihan paket (Hemat, Basic, Standard, Premium)
- Real-time tracking progress service motor
- History service lengkap dengan detail parts
- Management kendaraan (add, edit, delete)

### **Admin Side**
- Dashboard analytics dengan KPI metrics
- Job Orders management dengan real-time sync
- Inventory management dengan low stock alerts
- Technician management (assign jobs, track performance)
- Advanced analytics dengan charts (Revenue, Service Distribution)

### **Technician Side** *(Currently Removed)*
- Role teknisi telah dihapus dari flow
- Fokus hanya Customer dan Admin

---

## 🛠️ TECH STACK

### **Frontend**
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui
- **Animation:** Framer Motion (motion/react)
- **Icons:** Lucide React
- **Charts:** Recharts
- **State:** React Hooks (useState, useEffect, useContext)
- **Toast Notifications:** Sonner

### **Backend**
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Edge Functions:** Supabase Functions (Hono server)
- **Storage:** Supabase Storage (for future use)

### **Key Libraries**
```json
{
  "react": "^18.x",
  "next": "^14.x",
  "tailwindcss": "^4.x",
  "motion/react": "^11.x",
  "recharts": "^2.x",
  "lucide-react": "^0.x",
  "sonner": "^2.0.3"
}
```

---

## 👥 USER ROLES & ACCESS

### **1. Customer (customer)**
- **Access:**
  - Booking service
  - Track progress service
  - Manage vehicles
  - View service history
  - Review/rating (future)

- **Main Dashboard:** CustomerDashboard.tsx
- **Tabs:**
  - Booking - Buat booking baru
  - Tracking - Track progress motor
  - Vehicles - Manage kendaraan
  - Documents - Invoice & reports (future)

### **2. Admin (admin)**
- **Access:**
  - Full access to all features
  - Manage job orders (approve, assign, update status)
  - Manage inventory (CRUD)
  - Manage technicians (CRUD)
  - View analytics & reports

- **Main Dashboard:** AdminDashboard.tsx
- **Tabs:**
  - Overview - KPI cards, charts, recent jobs
  - Job Orders - Manage all bookings & jobs
  - Inventory - Manage spare parts & stock
  - Technicians - Manage teknisi data
  - Analytics - Advanced analytics & reporting
  - Settings - (Future) Account & user management

### **3. Technician (technician)** *(REMOVED)*
- Role teknisi dihapus dari flow
- Admin yang assign dan manage jobs

---

## 🗄️ DATABASE SCHEMA

### **Tables:**

#### **1. profiles** (extends auth.users)
```sql
id              UUID PRIMARY KEY (FK to auth.users)
full_name       TEXT NOT NULL
phone           TEXT
role            TEXT CHECK (role IN ('customer', 'technician', 'admin'))
avatar_url      TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

#### **2. services**
```sql
id                  UUID PRIMARY KEY
name                TEXT NOT NULL
description         TEXT
base_price          DECIMAL(10, 2)
estimated_duration  INTEGER (minutes)
is_active           BOOLEAN
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

**Service Packages:**
- Hemat Service - Rp 40,000
- Basic Tune-Up - Rp 60,000
- Standard Service - Rp 100,000
- Premium Service - Rp 150,000

#### **3. vehicles**
```sql
id              UUID PRIMARY KEY
customer_id     UUID (FK to profiles)
plate_number    TEXT UNIQUE
brand           TEXT
model           TEXT
year            INTEGER
notes           TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

#### **4. job_orders** *(MAIN TABLE)*
```sql
id                      UUID PRIMARY KEY
job_number              TEXT UNIQUE (e.g., JO-2026-001)
vehicle_id              UUID (FK to vehicles)
customer_id             UUID (FK to profiles)
service_id              UUID (FK to services)
assigned_technician_id  UUID (FK to profiles)
status                  TEXT CHECK (status IN ('pending', 'scheduled', 'in_progress', 'awaiting_payment', 'completed', 'cancelled'))
scheduled_date          TIMESTAMPTZ
started_at              TIMESTAMPTZ
completed_at            TIMESTAMPTZ
customer_notes          TEXT
technician_diagnosis    TEXT
labor_cost              DECIMAL(10, 2)
parts_cost              DECIMAL(10, 2)
total_amount            DECIMAL(10, 2)
payment_status          TEXT CHECK (payment_status IN ('unpaid', 'partial', 'paid'))
payment_method          TEXT
created_at              TIMESTAMPTZ
updated_at              TIMESTAMPTZ
```

---

## 🔄 CORE FEATURES FLOW

### **1. BOOKING FLOW (Customer → Admin)**

```mermaid
Customer Side:
1. Select Service Package
   ├─ Hemat Service
   ├─ Basic Tune-Up
   ├─ Standard Service
   └─ Premium Service

2. Select Vehicle & Schedule
   ├─ Choose vehicle from list
   ├─ Select date (min: today)
   ├─ Select time slot (08:00-16:00)
   └─ Add notes (optional)

3. Review Items Required
   ├─ Auto-populated based on package
   ├─ Check stock availability
   ├─ Stock warnings if needed
   └─ Can edit quantities

4. Submit Booking
   ├─ POST to /bookings API
   ├─ Create job_order with status='pending'
   ├─ Generate job_number (JO-2026-XXX)
   └─ Show success toast

Admin Side:
5. Receive Booking (Real-time)
   ├─ Job appears in Admin Dashboard
   ├─ Shows in "Pending Bookings" alert
   ├─ Status: "Menunggu Assignment"
   └─ Orange badge indicator

6. Admin Actions
   ├─ Assign Technician → status='scheduled'
   ├─ Update Status → in_progress, awaiting_payment, completed
   ├─ View Job Details
   └─ Delete Job (if needed)
```

**Key Files:**
- `/components/dashboard/BookingTab.tsx` - Customer booking form
- `/components/AdminDashboard.tsx` - Admin job management
- `/supabase/functions/server/index.tsx` - API endpoint
- `/database/migration.sql` - Database schema

---

### **2. TRACKING FLOW (Real-time Status Updates)**

```mermaid
Customer Side:
1. Open TrackingTab
   ├─ View all jobs with filters
   ├─ Filter by status (Menunggu, Dijadwalkan, Sedang Diperbaiki, Selesai)
   └─ Auto-refresh every 5 seconds

2. Real-time Updates
   ├─ Admin updates status
   ├─ Database triggers update
   ├─ Supabase Realtime pushes change
   └─ Customer sees update instantly

3. Status Categories
   ├─ Menunggu (pending)
   ├─ Dijadwalkan (scheduled)
   ├─ Sedang Diperbaiki (in_progress)
   └─ Selesai (completed, awaiting_payment)
```

**Key Files:**
- `/components/dashboard/TrackingTab.tsx` - Real-time tracking
- `/hooks/useRealtimeJobs.ts` - Real-time subscription hook

---

### **3. ADMIN JOB ORDERS MANAGEMENT**

```mermaid
Admin Dashboard Flow:
1. Overview Tab
   ├─ KPI Cards (Revenue, Active Jobs, Payments, Stock Alerts)
   ├─ Revenue Chart (6 months)
   ├─ Service Distribution Pie Chart
   └─ Recent Jobs List

2. Job Orders Tab
   ├─ Pending Bookings Alert (Orange card)
   ├─ All Jobs Table with filters
   ├─ Actions per job:
   │  ├─ Assign Technician
   │  ├─ View Details
   │  ├─ Update Status
   │  └─ Delete Job
   └─ Create New Job (manual)

3. Inventory Tab
   ├─ Stock list with alerts
   ├─ Low stock warnings
   ├─ CRUD operations (Add, Edit, Delete)
   └─ Stock tracking

4. Technicians Tab
   ├─ Technician list
   ├─ Active jobs count
   ├─ Performance rating
   └─ CRUD operations

5. Analytics Tab
   ├─ Advanced charts
   ├─ Revenue trends
   ├─ Service distribution
   └─ Performance metrics
```

**Key Files:**
- `/components/AdminDashboard.tsx` - Main admin dashboard
- `/components/dialogs/AssignTechnicianDialog.tsx` - Assign tech
- `/components/dialogs/JobDetailDialog.tsx` - View job details
- `/components/dialogs/InventoryDialog.tsx` - Inventory CRUD
- `/components/dialogs/TechnicianDialog.tsx` - Technician CRUD

---

## 🏗️ COMPONENT ARCHITECTURE

### **Main App Structure**

```
/App.tsx (Main Router)
├─ AuthProvider (Context)
├─ SplashScreen (Initial load)
└─ Routes:
   ├─ LandingPage (/landing)
   ├─ LoginPage (/login)
   ├─ CustomerDashboard (/customer)
   ├─ AdminDashboard (/admin)
   └─ (TechnicianApp - REMOVED)
```

### **Customer Dashboard**

```
/components/CustomerDashboard.tsx
├─ Header (Logo, User info, Logout)
├─ Navbar (Mobile responsive)
└─ Tabs:
   ├─ BookingTab
   │  ├─ Step 1: Select Package & Schedule
   │  ├─ Step 2: Review & Confirm
   │  └─ Success Modal
   ├─ TrackingTab
   │  ├─ Filter Tabs (4 categories)
   │  ├─ Job Cards
   │  └─ Real-time updates (5s refresh)
   ├─ VehiclesTab
   │  ├─ Vehicle Cards
   │  └─ Add/Edit/Delete Dialogs
   └─ DocumentsTab (Future)
```

### **Admin Dashboard**

```
/components/AdminDashboard.tsx
├─ Header (Logo, Logout)
└─ Tabs:
   ├─ Overview
   │  ├─ KPI Cards (4 metrics)
   │  ├─ Revenue Chart (Line)
   │  ├─ Service Distribution (Pie)
   │  └─ Recent Jobs
   ├─ Job Orders
   │  ├─ Pending Bookings Alert
   │  ├─ Jobs Table
   │  └─ Action Dialogs
   ├─ Inventory
   │  ├─ Stock Table
   │  └─ CRUD Dialogs
   ├─ Technicians
   │  ├─ Tech Table
   │  └─ CRUD Dialogs
   ├─ Analytics
   │  └─ Advanced Charts
   └─ Settings (Future)
      ├─ Account Settings
      └─ User Management
```

---

## ⚡ REAL-TIME INTEGRATION

### **Supabase Realtime Channels**

#### **1. Job Orders Real-time**
```typescript
// Customer tracking real-time updates
const channel = supabase
  .channel('job-orders-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'job_orders',
      filter: `customer_id=eq.${user.id}`
    },
    (payload) => {
      // Handle real-time update
      console.log('Job order changed:', payload);
      // Update local state
    }
  )
  .subscribe();
```

#### **2. Admin Dashboard Real-time**
```typescript
// Admin sees all job changes
const channel = supabase
  .channel('admin-job-orders')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'job_orders'
    },
    (payload) => {
      // Refresh job list
      fetchJobs();
    }
  )
  .subscribe();
```

---

## 🚀 API ROUTES

### **Base URL**
```
https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280
```

### **Endpoints**

#### **1. POST /bookings** - Create Booking
```json
Request:
{
  "customer_id": "uuid",
  "vehicle_id": "uuid",
  "service_id": "uuid",
  "scheduled_date": "2026-02-05 10:00:00",
  "notes": "Rem bunyi",
  "labor_cost": 60000,
  "items": [
    {
      "sku": "OLI-001",
      "name": "Oli Mesin SAE 10W-40",
      "qty": 1,
      "unit": "liter"
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "job_number": "JO-2026-001",
    "id": "uuid",
    "status": "pending"
  }
}
```

#### **2. GET /bookings** - Get All Bookings (Admin)
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "job_number": "JO-2026-001",
      "customer": { "name": "..." },
      "vehicle": { "plate_number": "..." },
      "service": { "name": "..." },
      "status": "pending",
      "scheduled_date": "...",
      ...
    }
  ]
}
```

#### **3. PATCH /bookings/:id** - Update Job Status
```json
Request:
{
  "status": "scheduled",
  "assigned_technician_id": "uuid"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

---

## 📊 STATE MANAGEMENT

### **Context Providers**

#### **AuthContext** (`/contexts/AuthContext.tsx`)
```typescript
// Global auth state
const { user, profile, loading, signIn, signOut } = useAuth();

// Profile structure
{
  id: "uuid",
  full_name: "John Doe",
  email: "john@example.com",
  phone: "08123456789",
  role: "customer" | "admin" | "technician",
  avatar_url: "...",
  created_at: "...",
  updated_at: "..."
}
```

### **Local State Patterns**

#### **Admin Dashboard**
```typescript
// Job Orders state
const [jobs, setJobs] = useState([]);
const [selectedJob, setSelectedJob] = useState(null);

// Inventory state
const [inventory, setInventory] = useState([]);
const [inventoryDialog, setInventoryDialog] = useState(false);

// Technicians state
const [technicians, setTechnicians] = useState([]);
const [techDialog, setTechDialog] = useState(false);
```

#### **Customer Dashboard**
```typescript
// Booking state
const [step, setStep] = useState(1);
const [selectedPackage, setSelectedPackage] = useState(null);
const [selectedVehicle, setSelectedVehicle] = useState(null);
const [selectedDate, setSelectedDate] = useState('');
const [selectedTime, setSelectedTime] = useState('');
const [bookingItems, setBookingItems] = useState([]);
```

---

## ⚠️ IMPORTANT NOTES

### **1. Current Issues to Fix**
- ✅ React hooks error in AdminDashboard - FIXED
- ✅ Settings button moved to navbar
- ⚠️ **Job Orders di Admin belum real-time sync dengan database**
- ⚠️ **Layout AdminDashboard perlu improvement**

### **2. Mock Data vs Real Data**
Currently AdminDashboard uses mock data:
```typescript
// MOCK DATA - NEED TO REPLACE WITH REAL DATABASE
const mockJobs = [...];
const mockInventory = [...];
const mockTechnicians = [...];
```

**TODO: Replace with real Supabase queries**

### **3. Role Simplification**
- ❌ Technician role REMOVED
- ✅ Only Customer and Admin
- Admin manages all technician assignments

### **4. Protected Files**
**NEVER edit these files:**
- `/components/figma/ImageWithFallback.tsx`
- `/supabase/functions/server/kv_store.tsx`
- `/utils/supabase/info.tsx`

### **5. Environment Variables**
Already configured in Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

---

## 🎨 UI/UX GUIDELINES

### **Color Scheme**
- **Primary:** `#ff7e5f` (Gradient orange-pink)
- **Secondary:** `#2A5C82` (Blue)
- **Success:** `#10B981` (Green)
- **Warning:** `#F59E0B` (Orange)
- **Error:** `#EF4444` (Red)
- **Gray Scale:** `#111827` to `#F3F4F6`

### **Status Colors**
```typescript
const statusConfig = {
  pending: { label: 'Menunggu', className: 'bg-gray-500' },
  scheduled: { label: 'Dijadwalkan', className: 'bg-blue-500' },
  in_progress: { label: 'Sedang Dikerjakan', className: 'bg-[#F59E0B]' },
  awaiting_payment: { label: 'Menunggu Pembayaran', className: 'bg-orange-500' },
  completed: { label: 'Selesai', className: 'bg-[#10B981]' }
};
```

### **Responsive Breakpoints**
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

---

## 🔐 SECURITY NOTES

### **RLS Policies**
- Customers can only see their own data
- Admins can see all data
- Technicians can see assigned jobs (currently not used)

### **Auth Flow**
1. User signs up/in via Supabase Auth
2. Profile created in `profiles` table
3. Role assigned (customer/admin)
4. Auto-navigate to appropriate dashboard

---

## 📝 DEVELOPMENT WORKFLOW

### **Adding New Feature**
1. Read this documentation
2. Understand current flow
3. Check database schema
4. Update components
5. Test real-time sync
6. Update this documentation

### **Common Tasks**
- **Add new service package:** Update `servicePackages` in BookingTab
- **Add new status:** Update `statusConfig` in components
- **Add new dialog:** Create in `/components/dialogs/`
- **Add new tab:** Add to AdminDashboard or CustomerDashboard

---

## 📞 REFERENCE FILES

### **Must Read First**
1. `/PLATFORM_FLOW_DOCUMENTATION.md` - This file
2. `/database/migration.sql` - Database schema
3. `/App.tsx` - Main routing
4. `/contexts/AuthContext.tsx` - Auth state

### **Key Components**
- `/components/AdminDashboard.tsx`
- `/components/CustomerDashboard.tsx`
- `/components/dashboard/BookingTab.tsx`
- `/components/dashboard/TrackingTab.tsx`

### **API & Backend**
- `/supabase/functions/server/index.tsx`
- `/utils/supabase/client.tsx`
- `/utils/supabase-api.tsx`

---

## 🎯 ROADMAP & TODO

### **Phase 1: Current** ✅
- [x] Basic booking flow
- [x] Real-time tracking
- [x] Admin dashboard with tabs
- [x] Role-based access
- [x] Mock data working

### **Phase 2: Next Steps** 🚧
- [ ] **Fix Admin Job Orders real-time sync**
- [ ] **Improve Admin Dashboard layout**
- [ ] Replace all mock data with database
- [ ] Add Settings tab functionality
- [ ] User management in Settings

### **Phase 3: Future** 📅
- [ ] Payment integration
- [ ] Review & rating system
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Email notifications

---

**Dokumentasi ini harus selalu diupdate ketika ada perubahan fitur!**

**Last updated:** 4 Februari 2026  
**Maintained by:** Development Team  
**Project:** Sunest Auto Platform
