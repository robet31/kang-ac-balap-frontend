# 📦 KONFIGURASI LENGKAP SUNEST AUTO

Dokumen ini berisi semua konfigurasi yang diperlukan untuk menjalankan Sunest Auto Platform.

---

## 📋 Table of Contents

1. [Project Information](#project-information)
2. [Technology Stack](#technology-stack)
3. [Environment Variables](#environment-variables)
4. [Supabase Configuration](#supabase-configuration)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication Flow](#authentication-flow)
8. [Project Structure](#project-structure)

---

## 1. Project Information

```yaml
Project Name: Sunest Auto
Version: 2.0.0
Description: Platform Digital Komprehensif untuk Bengkel Motor
Type: Full-stack Web Application

Repository: https://github.com/yourusername/sunest-auto
License: MIT

Maintainers:
  - Sunest Auto Team
```

---

## 2. Technology Stack

### Frontend
```yaml
Framework: Next.js 14.0.0
Language: TypeScript 5.3.0
Styling: Tailwind CSS 4.0.0
UI Components: Shadcn/ui
Icons: Lucide React
Charts: Recharts 2.10.0
Animations: Framer Motion (motion 10.16.0)
Forms: React Hook Form 7.55.0
Date Utils: date-fns 2.30.0
State Management: React Context API
```

### Backend
```yaml
Database: PostgreSQL (via Supabase)
Backend Service: Supabase
Authentication: Supabase Auth
Storage: Supabase Storage (optional)
Edge Functions: Supabase Edge Functions
Realtime: Supabase Realtime Subscriptions
```

### Development Tools
```yaml
Package Manager: npm 9.0.0+
Node Version: 18.0.0+
Code Linting: ESLint 8.55.0
Type Checking: TypeScript
Git: Version Control
```

---

## 3. Environment Variables

### `.env.local` (Development)

```bash
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dWdnaGlwcHd2b3hzanF5eGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjgwODEsImV4cCI6MjA4NTc0NDA4MX0.KTfejXXgrrdy4gUMekm--v2jtqXO0DARPAjzYmfqv30

# ⚠️ SERVICE ROLE KEY - JANGAN EXPOSE KE FRONTEND!
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key_here>

# ============================================
# DATABASE
# ============================================
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.tvugghippwvoxsjqyxkr.supabase.co:5432/postgres

# ============================================
# APPLICATION
# ============================================
NEXT_PUBLIC_APP_NAME=Sunest Auto
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### `.env.production` (Production - Vercel/Netlify)

```bash
# Supabase (sama seperti development)
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Application
NEXT_PUBLIC_APP_URL=https://sunest-auto.vercel.app
NODE_ENV=production
```

### Variable Explanations

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | URL project Supabase, bisa diakses dari browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Key untuk authenticated requests, safe untuk frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Full access key, HANYA untuk server-side operations |
| `SUPABASE_DB_URL` | Secret | Direct database connection string |
| `NEXT_PUBLIC_APP_URL` | Public | Base URL aplikasi |

---

## 4. Supabase Configuration

### Project Details
```yaml
Project ID: tvugghippwvoxsjqyxkr
Project Name: sunest-auto-new
Region: Southeast Asia (Singapore)
Database: PostgreSQL 15
Plan: Free Tier

URL: https://tvugghippwvoxsjqyxkr.supabase.co
Dashboard: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr
```

### Authentication Settings

**Email Provider:**
```yaml
Enabled: true
Autoconfirm: true (for development)
Email Template: Default
```

**Security:**
```yaml
JWT Expiry: 3600 seconds (1 hour)
Refresh Token Rotation: Enabled
Session Management: Cookie-based
```

### Row Level Security (RLS)

All tables memiliki RLS policies:
- **Profiles**: Users can view all, update own
- **Vehicles**: Users can CRUD own vehicles, admins can view all
- **Job Orders**: Customers view own, admins manage all
- **Inventory**: Everyone can view, only admins can manage
- **Services**: Everyone can view active, admins manage

### Realtime Subscriptions

Enabled untuk tables:
- `job_orders` - Track status updates
- `profiles` - User updates
- `vehicles` - Vehicle changes
- `inventory` - Stock level changes

---

## 5. Database Schema

### Entity Relationship Diagram (Simplified)

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Profiles  │         │   Vehicles   │         │ Job Orders   │
│─────────────│         │──────────────│         │──────────────│
│ id (PK)     │────────<│ id (PK)      │>───────<│ id (PK)      │
│ full_name   │         │ customer_id  │         │ job_number   │
│ email       │         │ plate_number │         │ vehicle_id   │
│ role        │         │ brand        │         │ customer_id  │
│ is_active   │         │ model        │         │ service_id   │
└─────────────┘         └──────────────┘         │ status       │
                                                  │ total_amount │
                                                  └──────────────┘
                                                         │
                                                         │
                                                         v
                                                  ┌──────────────┐
                                                  │  Job Parts   │
                                                  │──────────────│
                                                  │ id (PK)      │
                                                  │ job_order_id │
                                                  │ inventory_id │
                                                  │ quantity     │
                                                  │ unit_price   │
                                                  └──────────────┘
                                                         │
                                                         │
                                                         v
                                                  ┌──────────────┐
                                                  │  Inventory   │
                                                  │──────────────│
                                                  │ id (PK)      │
                                                  │ part_sku     │
                                                  │ part_name    │
                                                  │ quantity     │
                                                  │ price        │
                                                  └──────────────┘

┌──────────────┐
│  Services    │
│──────────────│
│ id (PK)      │
│ name         │
│ base_price   │
│ duration     │
└──────────────┘
```

### Tables Overview

#### 1. **profiles**
Extends `auth.users` dengan data tambahan
```sql
- id: UUID (PK, FK to auth.users)
- full_name: TEXT
- email: TEXT
- phone: TEXT
- role: TEXT (customer, technician, admin)
- avatar_url: TEXT
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

#### 2. **vehicles**
Motor customer
```sql
- id: UUID (PK)
- customer_id: UUID (FK to profiles)
- plate_number: TEXT (UNIQUE)
- brand, model: TEXT
- year: INTEGER
- engine_capacity, color: TEXT
- notes: TEXT
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

#### 3. **services**
Paket service
```sql
- id: UUID (PK)
- name: TEXT
- description: TEXT
- base_price: DECIMAL(10,2)
- estimated_duration: INTEGER (minutes)
- service_type: TEXT (basic, standard, premium, overhaul)
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

#### 4. **job_orders**
Job service utama
```sql
- id: UUID (PK)
- job_number: TEXT (UNIQUE)
- vehicle_id: UUID (FK to vehicles)
- customer_id: UUID (FK to profiles)
- service_id: UUID (FK to services)
- assigned_technician_id: UUID (FK to profiles)
- status: TEXT (pending, scheduled, in_progress, awaiting_payment, completed, cancelled)
- scheduled_date: TIMESTAMPTZ
- started_at, completed_at: TIMESTAMPTZ
- customer_notes, technician_diagnosis: TEXT
- labor_cost, parts_cost, total_amount: DECIMAL(10,2)
- payment_status: TEXT (unpaid, partial, paid)
- payment_method: TEXT
- created_at, updated_at: TIMESTAMPTZ
```

#### 5. **inventory**
Stok sparepart
```sql
- id: UUID (PK)
- part_sku: TEXT (UNIQUE)
- part_name: TEXT
- description: TEXT
- category: TEXT
- quantity_in_stock: INTEGER
- minimum_stock_level: INTEGER
- unit_cost, selling_price: DECIMAL(10,2)
- supplier_name, supplier_contact: TEXT
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

#### 6. **job_parts**
Junction table: job orders ↔ inventory
```sql
- id: UUID (PK)
- job_order_id: UUID (FK to job_orders)
- inventory_id: UUID (FK to inventory)
- quantity_used: INTEGER
- unit_price_at_time: DECIMAL(10,2)
- subtotal: DECIMAL(10,2)
- created_at: TIMESTAMPTZ
```

#### 7. **job_updates**
History updates job
```sql
- id: UUID (PK)
- job_order_id: UUID (FK to job_orders)
- user_id: UUID (FK to profiles)
- update_type: TEXT (status_change, note, photo)
- content: TEXT
- photo_url: TEXT
- created_at: TIMESTAMPTZ
```

---

## 6. API Endpoints

### Base URL
```
Local: http://localhost:3000/api
Production: https://sunest-auto.vercel.app/api
```

### Supabase Edge Functions
```
Base: https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/
```

### Endpoints (Planned)

#### Authentication
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/user
```

#### Job Orders
```
GET    /api/job-orders          # List all (filtered by role)
GET    /api/job-orders/:id      # Get single
POST   /api/job-orders          # Create new
PATCH  /api/job-orders/:id      # Update
DELETE /api/job-orders/:id      # Cancel
```

#### Vehicles
```
GET    /api/vehicles            # List user vehicles
GET    /api/vehicles/:id        # Get single
POST   /api/vehicles            # Add new
PATCH  /api/vehicles/:id        # Update
DELETE /api/vehicles/:id        # Soft delete
```

#### Inventory
```
GET    /api/inventory           # List all parts
GET    /api/inventory/:id       # Get single
POST   /api/inventory           # Add new (admin)
PATCH  /api/inventory/:id       # Update (admin)
DELETE /api/inventory/:id       # Delete (admin)
```

#### Services
```
GET    /api/services            # List all packages
GET    /api/services/:id        # Get single
POST   /api/services            # Create (admin)
PATCH  /api/services/:id        # Update (admin)
DELETE /api/services/:id        # Delete (admin)
```

---

## 7. Authentication Flow

### Sign Up Flow
```
1. User enters email + password + full_name
2. Frontend calls Supabase Auth signup()
3. Supabase creates user in auth.users
4. Database trigger creates profile in public.profiles
5. User redirected to dashboard
```

### Login Flow
```
1. User enters email + password
2. Frontend calls Supabase Auth signIn()
3. Supabase validates credentials
4. Returns JWT token + user session
5. Frontend stores session in cookie
6. Redirect based on role:
   - customer → /dashboard
   - admin → /admin/dashboard
```

### Session Management
```
- Session stored in HTTP-only cookie
- Auto-refresh on token expiry
- Logout clears cookie + invalidates token
- Protected routes check auth state
```

### Role-Based Access Control (RBAC)
```typescript
Roles:
  - customer: Can book, view own data
  - admin: Full access to all features
  - technician: (removed in simplified flow)

Protected Routes:
  /dashboard/*      → customer + admin
  /admin/*          → admin only
  /api/admin/*      → admin only
```

---

## 8. Project Structure

```
sunest-auto/
│
├── 📁 components/              # React Components
│   ├── 📁 admin/              # Admin-specific components
│   │   ├── CreateJobForm.tsx
│   │   ├── PendingBookings.tsx
│   │   └── RealTimeJobOrdersTab.tsx
│   │
│   ├── 📁 dashboard/          # Customer Dashboard
│   │   ├── BookingTab.tsx
│   │   ├── TrackingTab.tsx
│   │   ├── VehiclesTab.tsx
│   │   └── ServiceHistoryTab.tsx
│   │
│   ├── 📁 dialogs/            # Modal Components
│   │   ├── CreateJobDialog.tsx
│   │   ├── InventoryDialog.tsx
│   │   └── QRScannerDialog.tsx
│   │
│   ├── 📁 ui/                 # Shadcn UI Components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── AdminDashboard.tsx
│   ├── CustomerDashboard.tsx
│   ├── LandingPage.tsx
│   └── AuthModal.tsx
│
├── 📁 pages/                   # Next.js Pages (Routes)
│   ├── 📁 admin/
│   │   ├── create-job.tsx     # /admin/create-job
│   │   ├── job-detail.tsx     # /admin/job-detail
│   │   └── inventory-form.tsx
│   │
│   ├── 📁 customer/
│   │   ├── add-vehicle.tsx    # /customer/add-vehicle
│   │   └── vehicle-history.tsx
│   │
│   └── 📁 api/                # API Routes (future)
│       ├── auth/
│       └── job-orders/
│
├── 📁 contexts/                # React Contexts
│   └── AuthContext.tsx        # Global auth state
│
├── 📁 hooks/                   # Custom Hooks
│   ├── useDashboardStats.ts
│   ├── useRealtimeJobOrders.ts
│   └── useVehicleRecommendations.ts
│
├── 📁 utils/                   # Utility Functions
│   ├── 📁 supabase/
│   │   ├── client.tsx         # Supabase client
│   │   └── info.tsx           # Project credentials
│   │
│   ├── api.tsx                # API helper functions
│   └── qr-code.ts             # QR code utilities
│
├── 📁 database/                # SQL Scripts
│   ├── COMPLETE_MIGRATION.sql # Full schema
│   ├── SEED_DATA.sql          # Initial data
│   └── seed_data_simple.sql
│
├── 📁 supabase/               # Supabase Edge Functions
│   └── 📁 functions/
│       └── 📁 server/
│           ├── index.tsx      # Main server
│           ├── bookings.tsx   # Booking endpoints
│           └── kv_store.tsx   # KV helpers
│
├── 📁 styles/
│   └── globals.css            # Global styles + Tailwind
│
├── 📁 public/                 # Static assets
│   ├── logo.svg
│   └── favicon.ico
│
├── 📄 App.tsx                 # Main App Component
├── 📄 package.json            # Dependencies
├── 📄 tsconfig.json           # TypeScript config
├── 📄 tailwind.config.js      # Tailwind config
├── 📄 next.config.js          # Next.js config
│
├── 📄 .env.local              # Environment variables (gitignored)
├── 📄 .env.example            # Template
├── 📄 .gitignore
│
└── 📄 README.md
```

---

## 📌 Important Files

### `package.json`
Contains all dependencies and npm scripts.

### `App.tsx`
Main entry point, handles routing and auth.

### `contexts/AuthContext.tsx`
Global authentication state management.

### `utils/supabase/client.tsx`
Supabase client initialization.

### `database/COMPLETE_MIGRATION.sql`
Complete database schema - run this first!

### `database/SEED_DATA.sql`
Initial data (services, inventory) - run after migration.

---

## 🔧 NPM Scripts

```json
{
  "dev": "next dev",              // Start development server
  "build": "next build",          // Build for production
  "start": "next start",          // Start production server
  "lint": "next lint",            // Lint code
  "type-check": "tsc --noEmit",   // Check TypeScript errors
  "check-env": "node scripts/check-env.js",  // Verify env vars
  "seed": "node scripts/seed-data.js"        // Seed database
}
```

---

## 📊 Feature Flags & Pricing Logic

### Service Pricing Rules

```typescript
// Customer booking (via dashboard) → FREE
if (bookingSource === 'customer_dashboard') {
  laborCost = 0;  // Promo online booking
}

// Admin booking (walk-in) → Rp 25,000
if (bookingSource === 'admin_create') {
  laborCost = 25000;  // Fixed service fee
}

// Parts cost: Always calculated based on actual parts used
partsCost = sum(job_parts.subtotal);

// Total
totalAmount = laborCost + partsCost;
```

### User Roles

```typescript
enum UserRole {
  CUSTOMER = 'customer',  // End users
  ADMIN = 'admin',        // Workshop owners/managers
  // TECHNICIAN removed in simplified flow
}
```

---

## 🔐 Security Considerations

### Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use Vercel/Netlify environment settings for production
- ❌ Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend

### RLS Policies
- All tables have Row Level Security enabled
- Users can only access their own data (unless admin)
- Admin role bypasses most restrictions

### Authentication
- JWT tokens with 1-hour expiry
- Auto-refresh on expiry
- HTTP-only cookies for session storage

### Data Validation
- Frontend: React Hook Form validation
- Backend: Supabase validation + constraints
- Database: CHECK constraints, NOT NULL, UNIQUE

---

## 📈 Performance Optimization

### Database Indexes
```sql
-- Already created in COMPLETE_MIGRATION.sql
idx_profiles_role
idx_profiles_email
idx_vehicles_customer_id
idx_job_orders_customer_id
idx_job_orders_status
idx_inventory_sku
```

### Realtime Optimization
- Subscribe only to relevant channels
- Filter subscriptions by user role
- Unsubscribe on component unmount

### Frontend Optimization
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image
- Lazy load components
- Memoize expensive computations

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up new customer
- [ ] Login as customer
- [ ] Login as admin
- [ ] Logout
- [ ] Session persistence

**Customer Features:**
- [ ] Create booking
- [ ] View service history
- [ ] Add vehicle
- [ ] Track job status
- [ ] View profile

**Admin Features:**
- [ ] Create walk-in job
- [ ] Manage inventory
- [ ] View all bookings
- [ ] Update job status
- [ ] View analytics

---

## 📞 Support & Contact

**Project Repository:** https://github.com/yourusername/sunest-auto
**Documentation:** See `/docs` folder
**Issues:** GitHub Issues
**Email:** support@sunest-auto.com

---

**Last Updated:** February 2026
**Version:** 2.0.0
**Status:** ✅ Production Ready
