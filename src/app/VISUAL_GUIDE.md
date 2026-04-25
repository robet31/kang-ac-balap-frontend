# 🎨 VISUAL GUIDE - SUNEST AUTO

Panduan visual untuk memahami arsitektur dan flow project.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                             │
│  📱 Mobile Browser      💻 Desktop Browser      📱 Mobile App    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FRONTEND LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 Application                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │   Landing   │  │  Customer   │  │    Admin    │     │  │
│  │  │    Page     │  │  Dashboard  │  │  Dashboard  │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  │                                                           │  │
│  │  React Components + Tailwind CSS + Framer Motion        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API / Realtime WebSocket
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      SUPABASE LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication  │  Edge Functions  │  Realtime           │  │
│  │  (Auth.js)       │  (Hono Server)   │  (WebSockets)       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               PostgreSQL Database                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐            │  │
│  │  │ profiles │  │ vehicles │  │ job_orders │            │  │
│  │  └──────────┘  └──────────┘  └────────────┘            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐            │  │
│  │  │inventory │  │ services │  │ job_parts  │            │  │
│  │  └──────────┘  └──────────┘  └────────────┘            │  │
│  │                                                           │  │
│  │  Row Level Security (RLS) + Triggers + Indexes          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Journey Flow

### Customer Journey

```
┌───────────────────────────────────────────────────────────────┐
│                     CUSTOMER FLOW                              │
└───────────────────────────────────────────────────────────────┘

1. Landing Page
   │
   ├──[Register]──> Sign Up ──> Verify Email
   │                              │
   └──[Login]─────────────────────┘
                                  │
                                  ▼
2. Customer Dashboard
   ├─ Overview (stats, recent service)
   ├─ My Vehicles (add/edit/view history)
   ├─ Book Service
   │  │
   │  ├─ Select Vehicle
   │  ├─ Choose Service Package (GRATIS biaya jasa!)
   │  ├─ Select Spare Parts (optional)
   │  ├─ Choose Date & Time
   │  └─ Confirm Booking
   │     │
   │     ▼
   ├─ Track Service (Real-time updates)
   │  │
   │  ├─ Status: Pending → Scheduled → In Progress → Completed
   │  ├─ Photos & Notes from Technician
   │  └─ Final Invoice
   │     │
   │     ▼
   ├─ Service History
   │  └─ View past jobs, invoices, vehicle recommendations
   │
   ├─ Loyalty & Rewards
   │  └─ Points balance, free oil counter, redeem rewards
   │
   └─ Profile Settings
      └─ Edit info, change password, notifications
```

### Admin Journey

```
┌───────────────────────────────────────────────────────────────┐
│                      ADMIN FLOW                                │
└───────────────────────────────────────────────────────────────┘

1. Admin Login
   │
   ▼
2. Admin Dashboard
   ├─ Overview
   │  ├─ Today's Stats (bookings, revenue, customers)
   │  ├─ Charts & Analytics
   │  └─ Quick Actions
   │
   ├─ Job Orders Management
   │  │
   │  ├─ View All Jobs (Real-time updates)
   │  ├─ Create Walk-in Job
   │  │  │
   │  │  ├─ Select/Create Customer
   │  │  ├─ Select/Add Vehicle
   │  │  ├─ Choose Service (Rp 25,000 labor cost)
   │  │  ├─ Add Spare Parts
   │  │  └─ Assign Technician (optional)
   │  │
   │  ├─ Update Job Status
   │  ├─ Add Notes/Photos
   │  └─ Complete & Generate Invoice
   │
   ├─ Pending Bookings
   │  └─ Review online bookings → Convert to job orders
   │
   ├─ Customer CRM
   │  ├─ View All Customers
   │  ├─ Segmentation (New, Active, Dormant, VIP)
   │  ├─ Service History per Customer
   │  └─ Send Bulk Notifications
   │
   ├─ Inventory Management
   │  ├─ View Stock Levels
   │  ├─ Add/Edit/Delete Parts
   │  ├─ Low Stock Alerts
   │  └─ Supplier Management
   │
   ├─ Technician Management (Future)
   │  ├─ Add/Edit Technicians
   │  ├─ Assign Jobs
   │  └─ Performance Tracking
   │
   ├─ Reports & Analytics
   │  ├─ Financial Reports
   │  ├─ Customer Analytics
   │  ├─ Inventory Reports
   │  └─ Export Data
   │
   └─ Settings
      ├─ Service Packages
      ├─ Loyalty Program Rules
      ├─ Notification Templates
      └─ Workshop Info
```

---

## 🗄️ Database Relationships

```
                    ┌─────────────────┐
                    │   auth.users    │
                    │  (Supabase)     │
                    └────────┬────────┘
                             │ extends
                             │
                    ┌────────▼────────┐
           ┌───────►│    profiles     │◄──────┐
           │        │  (User data)    │       │
           │        └────────┬────────┘       │
           │                 │                │
           │                 │ customer_id    │ assigned_tech_id
           │                 │                │
           │        ┌────────▼────────┐       │
           │        │    vehicles     │       │
           │        │ (Customer cars) │       │
           │        └────────┬────────┘       │
           │                 │                │
           │                 │ vehicle_id     │
           │                 │                │
           │        ┌────────▼────────────────┴────┐
           │        │        job_orders             │
           │        │    (Main job record)          │
           │        └──────────┬───────────────┬───┘
           │                   │               │
           │        ┌──────────▼───────┐       │ service_id
           │        │    job_parts     │       │
           │        │  (Parts used)    │       │
           │        └──────────┬───────┘       │
           │                   │               │
           │                   │ inventory_id  │
           │                   │               │
           │        ┌──────────▼───────┐       │
           └────────┤    inventory     │       │
    updates         │   (Spare parts)  │       │
                    └──────────────────┘       │
                                               │
                                    ┌──────────▼────────┐
                                    │     services      │
                                    │ (Service packages)│
                                    └───────────────────┘
```

---

## 💰 Pricing Logic Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   PRICING CALCULATION                        │
└─────────────────────────────────────────────────────────────┘

Customer Booking (Online via Dashboard):
  ┌─────────────────────────────────┐
  │ Labor Cost = Rp 0               │ ← PROMO GRATIS!
  │ Parts Cost = Sum(parts.price)   │
  │ Total = Rp 0 + Parts Cost       │
  └─────────────────────────────────┘

Admin Booking (Walk-in):
  ┌─────────────────────────────────┐
  │ Labor Cost = Rp 25,000          │ ← Fixed service fee
  │ Parts Cost = Sum(parts.price)   │
  │ Total = Rp 25,000 + Parts Cost  │
  └─────────────────────────────────┘

Example:
  Customer books online, uses Oli Federal (Rp 35,000)
  └─> Total: Rp 0 + Rp 35,000 = Rp 35,000

  Admin creates walk-in, same oil
  └─> Total: Rp 25,000 + Rp 35,000 = Rp 60,000
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   SIGN UP FLOW                               │
└─────────────────────────────────────────────────────────────┘

User submits registration form
  │
  ├─> Frontend: Validate input
  │
  ├─> Supabase Auth: Create user in auth.users
  │   │
  │   └─> Success?
  │       │
  │       ├─ YES:
  │       │   ├─> Database Trigger fires
  │       │   │   └─> Auto-create record in profiles table
  │       │   │
  │       │   └─> Return JWT token + user session
  │       │       └─> Redirect to dashboard
  │       │
  │       └─ NO:
  │           └─> Return error (email exists, weak password, etc.)


┌─────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                                │
└─────────────────────────────────────────────────────────────┘

User submits login credentials
  │
  ├─> Frontend: Validate input
  │
  ├─> Supabase Auth: signInWithPassword()
  │   │
  │   └─> Success?
  │       │
  │       ├─ YES:
  │       │   ├─> Return JWT token
  │       │   ├─> Store in HTTP-only cookie
  │       │   ├─> Fetch user profile from profiles table
  │       │   │
  │       │   └─> Check role:
  │       │       │
  │       │       ├─ customer → /dashboard
  │       │       └─ admin → /admin/dashboard
  │       │
  │       └─ NO:
  │           └─> Return error (invalid credentials)


┌─────────────────────────────────────────────────────────────┐
│               PROTECTED ROUTE CHECK                          │
└─────────────────────────────────────────────────────────────┘

User tries to access protected route
  │
  ├─> Middleware checks:
  │   │
  │   ├─> Session exists?
  │   │   │
  │   │   ├─ NO → Redirect to /login
  │   │   │
  │   │   └─ YES → Continue
  │
  ├─> Check user role from profiles table
  │   │
  │   ├─> Route requires admin?
  │   │   │
  │   │   ├─ User is admin? → Allow access
  │   │   └─ User is customer? → Redirect to /dashboard
  │   │
  │   └─> Route is public → Allow access
  │
  └─> Load page with authorized data (filtered by RLS)
```

---

## 🔄 Real-time Updates Flow

```
┌─────────────────────────────────────────────────────────────┐
│              REAL-TIME TRACKING SYSTEM                       │
└─────────────────────────────────────────────────────────────┘

Customer View:
  ┌──────────────────────────────────────────────┐
  │ Customer Dashboard (React Component)         │
  │                                              │
  │  useEffect(() => {                           │
  │    // Subscribe to job_orders changes       │
  │    const subscription = supabase            │
  │      .channel('job_updates')                │
  │      .on('UPDATE', handleUpdate)            │
  │      .subscribe()                           │
  │  }, [])                                     │
  └──────────────────┬───────────────────────────┘
                     │
                     │ WebSocket Connection
                     │
  ┌──────────────────▼───────────────────────────┐
  │        Supabase Realtime Server             │
  │                                              │
  │  Listens to PostgreSQL changes via:         │
  │  - WAL (Write-Ahead Log)                    │
  │  - Publication/Subscription                  │
  └──────────────────┬───────────────────────────┘
                     │
                     │ Database Trigger
                     │
  ┌──────────────────▼───────────────────────────┐
  │        PostgreSQL Database                   │
  │                                              │
  │  UPDATE job_orders                           │
  │  SET status = 'in_progress'                 │
  │  WHERE id = 'xxx'                            │
  │                                              │
  │  ↓ Trigger fires                            │
  │  ↓ Notify Realtime Server                   │
  └──────────────────────────────────────────────┘

Admin Updates Job → Database Updated → Realtime Broadcast → Customer UI Updates

Timeline:
  T0: Admin clicks "Start Service"
  T1: API call to update job_orders.status
  T2: Database updated
  T3: Realtime server detects change
  T4: Broadcast to all subscribed clients
  T5: Customer UI updates automatically (< 100ms total)
```

---

## 📦 Component Hierarchy

```
App.tsx (Root)
│
├─ AuthContext.Provider
│  │
│  ├─ LandingPage (/)
│  │  ├─ Header
│  │  ├─ Hero
│  │  ├─ Features
│  │  ├─ Services
│  │  ├─ Testimonials
│  │  └─ Footer
│  │
│  ├─ LoginPage (/login)
│  │  └─ AuthModal
│  │
│  ├─ CustomerDashboard (/dashboard)
│  │  ├─ Sidebar
│  │  ├─ Header
│  │  └─ Content
│  │     ├─ OverviewTab
│  │     │  ├─ StatsCards
│  │     │  ├─ RecentServices
│  │     │  └─ QuickActions
│  │     │
│  │     ├─ BookingTab
│  │     │  ├─ ServicePackageCards
│  │     │  ├─ VehicleSelector
│  │     │  ├─ DateTimePicker
│  │     │  └─ PartsSelector
│  │     │
│  │     ├─ TrackingTab
│  │     │  ├─ JobStatusCard (real-time)
│  │     │  ├─ ProgressTimeline
│  │     │  ├─ TechnicianInfo
│  │     │  └─ UpdatesLog
│  │     │
│  │     ├─ VehiclesTab
│  │     │  ├─ VehicleList
│  │     │  ├─ AddVehicleButton
│  │     │  └─ VehicleHistoryDialog
│  │     │
│  │     └─ ServiceHistoryTab
│  │        ├─ JobsTable
│  │        └─ InvoiceViewer
│  │
│  └─ AdminDashboard (/admin/dashboard)
│     ├─ Sidebar
│     ├─ Header
│     └─ Content
│        ├─ OverviewTab
│        │  ├─ StatsCards
│        │  ├─ Charts (Recharts)
│        │  └─ RecentActivity
│        │
│        ├─ JobOrdersTab
│        │  ├─ JobsTable (real-time)
│        │  ├─ CreateJobButton → /admin/create-job
│        │  └─ JobDetailDialog
│        │
│        ├─ PendingBookingsTab
│        │  ├─ BookingsList
│        │  └─ ApproveButton
│        │
│        ├─ CustomersTab
│        │  ├─ CustomerTable
│        │  ├─ Segmentation
│        │  └─ CustomerDetailView
│        │
│        ├─ InventoryTab
│        │  ├─ PartsTable
│        │  ├─ AddPartButton
│        │  └─ LowStockAlert
│        │
│        └─ ReportsTab
│           ├─ DateRangePicker
│           ├─ RevenueChart
│           └─ ExportButton
```

---

## 🎯 Data Flow Example: Create Booking

```
┌─────────────────────────────────────────────────────────────┐
│        CUSTOMER CREATES BOOKING (Step-by-step)              │
└─────────────────────────────────────────────────────────────┘

Step 1: User clicks "Book Service"
  │
  └─> Frontend: Navigate to BookingTab
      │
      └─> Fetch data:
          ├─> GET /api/vehicles (customer's vehicles)
          ├─> GET /api/services (service packages)
          └─> GET /api/inventory (available spare parts)

Step 2: User fills form
  ├─> Select Vehicle: Honda Beat 2020 (B 1234 XYZ)
  ├─> Select Service: Basic Tune-Up (Rp 150,000 → Rp 0)
  ├─> Select Parts: Oli Federal (Rp 35,000)
  ├─> Select Date: 2026-02-15 10:00 AM
  └─> Add Notes: "Suara mesin agak berisik"

Step 3: User clicks "Confirm Booking"
  │
  └─> Frontend validation
      │
      ├─> All fields filled? ✅
      └─> Date not in past? ✅

Step 4: Frontend sends request
  │
  POST /api/bookings
  {
    "vehicle_id": "xxx",
    "service_id": "xxx",
    "parts": [{ "id": "yyy", "quantity": 1 }],
    "scheduled_date": "2026-02-15T10:00:00",
    "customer_notes": "...",
    "booking_source": "customer_dashboard"  ← Important!
  }

Step 5: Backend processes
  │
  ├─> Validate auth token
  ├─> Check user owns vehicle
  ├─> Calculate pricing:
  │   │
  │   ├─> Labor cost = Rp 0 (customer booking)
  │   ├─> Parts cost = Rp 35,000
  │   └─> Total = Rp 35,000
  │
  ├─> Create job_order record:
  │   │
  │   INSERT INTO job_orders (
  │     job_number,          ← Auto: "JO-20260215-001"
  │     vehicle_id,
  │     customer_id,
  │     service_id,
  │     status,              ← 'pending'
  │     scheduled_date,
  │     labor_cost,          ← Rp 0
  │     parts_cost,          ← Rp 35,000
  │     total_amount         ← Rp 35,000
  │   )
  │
  └─> Create job_parts records:
      │
      INSERT INTO job_parts (
        job_order_id,
        inventory_id,
        quantity_used,        ← 1
        unit_price_at_time,   ← Rp 35,000
        subtotal              ← Rp 35,000
      )

Step 6: Database triggers fire
  │
  ├─> Auto-decrement inventory
  │   UPDATE inventory
  │   SET quantity_in_stock = quantity_in_stock - 1
  │   WHERE id = 'yyy'
  │
  └─> Realtime notification sent
      └─> Admin dashboard updates instantly

Step 7: Backend returns response
  {
    "success": true,
    "data": {
      "job_number": "JO-20260215-001",
      "total_amount": 35000,
      "status": "pending"
    }
  }

Step 8: Frontend handles response
  │
  ├─> Show success toast
  ├─> Redirect to TrackingTab
  └─> Start real-time subscription for updates

DONE! 🎉
Customer can now track their service in real-time.
Admin sees new booking in "Pending Bookings" tab.
```

---

## 🔍 Debug Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              WHEN SOMETHING DOESN'T WORK                     │
└─────────────────────────────────────────────────────────────┘

Problem: App won't start
  │
  ├─> Check 1: Node version
  │   │
  │   └─> node --version >= 18? 
  │       ├─ NO → Install Node.js 18+
  │       └─ YES → Continue
  │
  ├─> Check 2: Dependencies installed
  │   │
  │   └─> node_modules exists?
  │       ├─ NO → Run npm install
  │       └─ YES → Continue
  │
  ├─> Check 3: Environment variables
  │   │
  │   └─> npm run check-env
  │       ├─ FAIL → Fix .env.local
  │       └─ PASS → Continue
  │
  └─> Check 4: Port availability
      │
      └─> Port 3000 available?
          ├─ NO → Kill process or use PORT=3001 npm run dev
          └─ YES → Should work now!

Problem: Supabase errors
  │
  ├─> Check 1: Credentials
  │   └─> .env.local has correct SUPABASE_URL & keys?
  │
  ├─> Check 2: Project active
  │   └─> Login to Supabase Dashboard, project running?
  │
  ├─> Check 3: Database tables
  │   └─> Run COMPLETE_MIGRATION.sql?
  │
  └─> Check 4: RLS policies
      └─> User has permission for this action?

Problem: UI not updating
  │
  ├─> Check 1: Realtime enabled
  │   └─> Supabase Dashboard → Database → Replication
  │
  ├─> Check 2: Subscription active
  │   └─> Check browser console for WebSocket errors
  │
  └─> Check 3: Component lifecycle
      └─> useEffect cleanup function exists?
```

---

## 📱 Responsive Breakpoints

```
┌─────────────────────────────────────────────────────────────┐
│                  RESPONSIVE DESIGN                           │
└─────────────────────────────────────────────────────────────┘

Mobile (< 640px):
  ├─ Single column layout
  ├─ Hamburger menu
  ├─ Stacked cards
  ├─ Touch-friendly buttons (min 44px)
  └─ Hide non-essential info

Tablet (640px - 1024px):
  ├─ 2 column layout
  ├─ Collapsible sidebar
  ├─ Grid cards (2 per row)
  └─ Show more details

Desktop (> 1024px):
  ├─ Multi-column layout
  ├─ Persistent sidebar
  ├─ Grid cards (3-4 per row)
  ├─ Hover interactions
  └─ Full details visible

Tailwind Classes:
  - Mobile first: `text-sm p-2`
  - Tablet: `md:text-base md:p-4`
  - Desktop: `lg:text-lg lg:p-6`

Example:
  <div className="
    grid 
    grid-cols-1      ← Mobile: 1 column
    sm:grid-cols-2   ← Tablet: 2 columns
    lg:grid-cols-4   ← Desktop: 4 columns
    gap-4
  ">
```

---

**Visual Guide Complete! 🎨**

Gunakan diagram ini sebagai referensi cepat untuk memahami:
- Arsitektur system
- Flow data
- Database relationships
- Component hierarchy
- Debugging process

**Last Updated:** February 2026  
**Version:** 2.0.0
