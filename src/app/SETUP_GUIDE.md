# 🚀 SUNEST AUTO - Complete Setup Guide

Panduan lengkap untuk setup dan menjalankan Sunest Auto di lokal development environment.

---

## 📋 Table of Contents

1. [Prerequisites Check](#1-prerequisites-check)
2. [Clone & Install](#2-clone--install)
3. [Supabase Setup](#3-supabase-setup)
4. [Environment Configuration](#4-environment-configuration)
5. [Database Initialization](#5-database-initialization)
6. [Running the App](#6-running-the-app)
7. [Creating Test Accounts](#7-creating-test-accounts)
8. [Testing Features](#8-testing-features)
9. [Common Issues](#9-common-issues)
10. [Production Deployment](#10-production-deployment)

---

## 1. Prerequisites Check

### Install Required Software

#### A. Node.js (>= 18.0.0)

**Download**: https://nodejs.org/

**Verify installation:**
```bash
node --version
# Expected: v18.0.0 or higher

npm --version
# Expected: 9.0.0 or higher
```

**Troubleshooting:**
- If version too old, download latest LTS from nodejs.org
- On Mac: `brew install node`
- On Windows: Download installer from nodejs.org

#### B. Git

**Download**: https://git-scm.com/

**Verify installation:**
```bash
git --version
# Expected: git version 2.x.x
```

#### C. Code Editor (Recommended)

- **VS Code**: https://code.visualstudio.com/
  - Install extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - TypeScript + React

---

## 2. Clone & Install

### Step 1: Clone Repository

```bash
# Via HTTPS
git clone https://github.com/yourusername/sunest-auto.git

# Or via SSH
git clone git@github.com:yourusername/sunest-auto.git

# Navigate to project
cd sunest-auto
```

### Step 2: Install Dependencies

```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Expected output:**
```
added 350 packages in 45s
```

**If errors occur:**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 3. Supabase Setup

### Step 1: Access Supabase Project

1. Go to https://supabase.com/dashboard
2. Login with your account
3. Select project: **sunest-auto-new**
   - Project ID: `tvugghippwvoxsjqyxkr`

### Step 2: Get API Credentials

1. In Supabase Dashboard, go to **Settings** (⚙️ icon)
2. Click **API** in sidebar
3. You'll see:

```
Project URL:
https://tvugghippwvoxsjqyxkr.supabase.co

Project API keys:
├─ anon public (client-side)
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
│
└─ service_role (server-side - SECRET!)
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **COPY THESE KEYS** - You'll need them next!

### Step 3: Enable Required Services

#### A. Enable Realtime

1. Go to **Database** → **Replication**
2. Find table: `kv_store_c1ef5280`
3. Toggle **Enable Realtime** ON
4. Click **Save**

#### B. Enable Storage (for QR codes, photos)

1. Go to **Storage**
2. Click **Create bucket**
3. Create buckets:
   - Name: `make-c1ef5280-qr-codes` (Private)
   - Name: `make-c1ef5280-vehicles` (Private)
   - Name: `make-c1ef5280-invoices` (Private)

#### C. Enable Auth

1. Go to **Authentication** → **Providers**
2. Enable:
   - ✅ Email (already enabled)
   - ✅ Google (optional - for social login)
3. Configure email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation email

---

## 4. Environment Configuration

### Step 1: Create `.env.local`

```bash
# Copy example file
cp .env.example .env.local
```

### Step 2: Edit `.env.local`

Open `.env.local` in your editor and fill in:

```env
# ============================================
# REQUIRED - Get from Supabase Dashboard
# ============================================

NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here

# ============================================
# REQUIRED - Project Info
# ============================================

NEXT_PUBLIC_PROJECT_ID=tvugghippwvoxsjqyxkr
NEXT_PUBLIC_PROJECT_NAME=sunest-auto-new

# ============================================
# REQUIRED - App URLs
# ============================================

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280

# ============================================
# OPTIONAL - Feature Flags
# ============================================

NEXT_PUBLIC_ENABLE_LOYALTY=true
NEXT_PUBLIC_ENABLE_CHATBOT=false  # Set true when ready
NEXT_PUBLIC_ENABLE_QR_CHECKIN=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=false  # Set true when ready

# ============================================
# DEVELOPMENT
# ============================================

NODE_ENV=development
```

### Step 3: Verify Configuration

```bash
# Test if env variables loaded
npm run check-env
```

**Expected output:**
```
✅ NEXT_PUBLIC_SUPABASE_URL: Configured
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Configured
✅ NEXT_PUBLIC_PROJECT_ID: Configured
✅ All required environment variables set!
```

---

## 5. Database Initialization

### Step 1: Verify Table Exists

1. Go to Supabase Dashboard → **Database** → **Tables**
2. Look for table: `kv_store_c1ef5280`
3. If NOT exists, create it:

```sql
-- Run in SQL Editor
CREATE TABLE IF NOT EXISTS kv_store_c1ef5280 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_key_prefix 
  ON kv_store_c1ef5280(key text_pattern_ops);
  
CREATE INDEX IF NOT EXISTS idx_updated_at 
  ON kv_store_c1ef5280(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE kv_store_c1ef5280 ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow authenticated access" 
  ON kv_store_c1ef5280 
  FOR ALL 
  USING (auth.role() = 'authenticated');
```

### Step 2: Seed Sample Data (Optional)

Create sample customers, vehicles, spare parts:

```bash
npm run seed
```

**Sample data includes:**
- 5 customers
- 10 vehicles
- 20 spare parts
- 3 technicians
- 5 bookings
- Loyalty data

**Or manually via SQL:**

```sql
-- Sample Customer
INSERT INTO kv_store_c1ef5280 (key, value) VALUES (
  'customer_001',
  '{
    "id": "customer_001",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "phone": "081234567890",
    "status": "active",
    "total_visits": 12,
    "total_spent": 1200000,
    "created_at": "2025-01-15T08:00:00Z"
  }'::jsonb
);

-- Sample Vehicle
INSERT INTO kv_store_c1ef5280 (key, value) VALUES (
  'vehicle_001',
  '{
    "id": "vehicle_001",
    "user_id": "customer_001",
    "brand": "Yamaha",
    "model": "NMAX",
    "plate_number": "B 1234 XYZ",
    "year": 2020,
    "color": "Hitam",
    "current_mileage": 3500,
    "status": "active",
    "created_at": "2025-01-15T08:00:00Z"
  }'::jsonb
);

-- Sample Spare Part
INSERT INTO kv_store_c1ef5280 (key, value) VALUES (
  'sparepart_001',
  '{
    "id": "sparepart_001",
    "sku": "SP-OIL-001",
    "name": "Oli Yamalube 10W-40 1L",
    "category": "Oil",
    "brand": "Yamalube",
    "stock": 25,
    "min_stock": 10,
    "unit": "liter",
    "purchase_price": 50000,
    "selling_price": 75000,
    "status": "available",
    "created_at": "2025-01-15T08:00:00Z"
  }'::jsonb
);

-- Sample Technician
INSERT INTO kv_store_c1ef5280 (key, value) VALUES (
  'technician_001',
  '{
    "id": "technician_001",
    "name": "Andi Pratama",
    "phone": "081298765432",
    "specialization": "Engine",
    "rating": 4.8,
    "total_jobs_completed": 156,
    "active_jobs": 2,
    "status": "active",
    "working_days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    "working_hours": {"start": "08:00", "end": "17:00"},
    "created_at": "2025-01-01T08:00:00Z"
  }'::jsonb
);
```

---

## 6. Running the App

### Step 1: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
> sunest-auto@2.0.0 dev
> next dev

   ▲ Next.js 14.0.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000

 ✓ Ready in 3.2s
```

### Step 2: Open in Browser

Navigate to: **http://localhost:3000**

You should see the landing page!

### Step 3: Verify Pages Load

Test these URLs:
- Landing: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Register: http://localhost:3000/auth/register
- Customer Dashboard: http://localhost:3000/customer/dashboard (requires login)
- Admin Dashboard: http://localhost:3000/admin/dashboard (requires admin login)

---

## 7. Creating Test Accounts

### Method 1: Via Supabase Dashboard (Quick)

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   ```
   Email: admin@test.com
   Password: admin123456
   Auto Confirm: ✅ YES (important!)
   ```
4. Click **Create user**
5. Repeat for customer:
   ```
   Email: customer@test.com
   Password: customer123456
   Auto Confirm: ✅ YES
   ```

### Method 2: Via Registration Flow

1. Go to http://localhost:3000/auth/register
2. Fill registration form:
   ```
   Name: Test Customer
   Email: test@example.com
   Phone: 081234567890
   Password: test123456
   ```
3. Click **Register**
4. If email confirmation required:
   - Check Supabase Dashboard → **Authentication** → **Users**
   - Click user → **Send confirmation email**
   - Or manually confirm in dashboard

### Method 3: Via SQL (Advanced)

```sql
-- Create user via SQL (Supabase Auth)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  crypt('admin123456', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User","role":"admin"}',
  NOW(),
  NOW()
);

-- Then create user profile in KV store
INSERT INTO kv_store_c1ef5280 (key, value) VALUES (
  'user_admin001',
  '{
    "id": "user_admin001",
    "role": "admin",
    "name": "Admin User",
    "email": "admin@test.com",
    "phone": "081234567890",
    "status": "active",
    "created_at": "2026-02-07T08:00:00Z"
  }'::jsonb
);
```

---

## 8. Testing Features

### Test Customer Flow

1. **Login as Customer**
   - Email: `customer@test.com`
   - Password: `customer123456`

2. **Add Vehicle**
   - Go to Dashboard → Kendaraan
   - Click "Tambah Kendaraan"
   - Fill: Yamaha NMAX, B 1234 XYZ

3. **Book Service**
   - Click "Booking Service Baru"
   - Select vehicle
   - Choose "Oil Change"
   - Select tomorrow's date
   - Submit booking

4. **Track Job**
   - Go to Dashboard → Service Aktif
   - Click job to see tracking

### Test Admin Flow

1. **Login as Admin**
   - Email: `admin@test.com`
   - Password: `admin123456`

2. **View Dashboard**
   - Should see stats, charts, active jobs

3. **Create Manual Booking (Walk-in)**
   - Click "Buat Job Baru"
   - Create/select customer
   - Fill service details
   - Assign technician
   - Submit

4. **Manage Inventory**
   - Go to Inventory
   - Add spare part
   - Update stock

5. **View Reports**
   - Go to Reports
   - Check revenue chart
   - Export data

---

## 9. Common Issues

### Issue 1: "Failed to fetch" errors

**Symptom:**
```
Error: Failed to fetch bookings
NetworkError when attempting to fetch resource
```

**Solutions:**

A. **Check Supabase connection:**
```bash
# Test API
curl https://tvugghippwvoxsjqyxkr.supabase.co
```

B. **Verify environment variables:**
```bash
# Print env vars (sensitive!)
npm run check-env
```

C. **Check CORS in Supabase:**
- Dashboard → Settings → API
- Ensure CORS allows `http://localhost:3000`

D. **Restart dev server:**
```bash
# Kill server (Ctrl+C)
# Clear cache
rm -rf .next
# Restart
npm run dev
```

### Issue 2: "Unauthorized" / 401 errors

**Symptom:**
```
Error: Unauthorized
Status: 401
```

**Solutions:**

A. **Regenerate API keys:**
- Supabase Dashboard → Settings → API
- Click "Reset" next to keys
- Update `.env.local`

B. **Check user is logged in:**
```javascript
// In browser console
localStorage.getItem('supabase.auth.token')
// Should return JWT token
```

C. **Clear auth tokens:**
```javascript
// In browser console
localStorage.clear()
// Then login again
```

### Issue 3: Build/compilation errors

**Symptom:**
```
Error: Module not found
Cannot find module 'xyz'
```

**Solutions:**

A. **Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

B. **Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

C. **Check TypeScript:**
```bash
npm run type-check
```

### Issue 4: Tailwind CSS not working

**Symptom:**
- Styles not applied
- No colors/spacing

**Solutions:**

A. **Verify Tailwind config:**
```javascript
// tailwind.config.js should exist
// Check content paths include your files
```

B. **Rebuild CSS:**
```bash
npm run build
npm run dev
```

C. **Check globals.css import:**
```typescript
// pages/_app.tsx should have:
import '../styles/globals.css'
```

### Issue 5: Database queries fail

**Symptom:**
```
Error: relation "kv_store_c1ef5280" does not exist
```

**Solutions:**

A. **Create table:**
```sql
-- See step 5 for SQL
```

B. **Check RLS policies:**
```sql
-- Verify policies exist
SELECT * FROM pg_policies 
WHERE tablename = 'kv_store_c1ef5280';
```

C. **Grant permissions:**
```sql
-- Grant access to authenticated users
GRANT ALL ON kv_store_c1ef5280 TO authenticated;
```

### Issue 6: Real-time not working

**Symptom:**
- No live updates
- Need to refresh manually

**Solutions:**

A. **Enable Realtime:**
- Dashboard → Database → Replication
- Toggle ON for `kv_store_c1ef5280`

B. **Check WebSocket connection:**
```javascript
// Browser console
// Should see WebSocket connection in Network tab
```

C. **Verify subscription:**
```typescript
// In code, check subscription is active
const subscription = supabase
  .channel('jobs')
  .on('postgres_changes', ...)
  .subscribe()

console.log(subscription.state) // should be 'subscribed'
```

---

## 10. Production Deployment

### A. Deploy to Vercel

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Import to Vercel

1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_PROJECT_ID=tvugghippwvoxsjqyxkr
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280
```

#### Step 4: Deploy

Click "Deploy" → Wait for build → Done! 🎉

### B. Deploy Supabase Edge Functions

#### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

#### Step 2: Login

```bash
supabase login
```

#### Step 3: Link Project

```bash
supabase link --project-ref tvugghippwvoxsjqyxkr
```

#### Step 4: Deploy Functions

```bash
supabase functions deploy make-server-c1ef5280
```

### C. Update Supabase Settings

1. **Add production URL to CORS:**
   - Dashboard → Settings → API
   - Add `https://your-app.vercel.app`

2. **Update Auth redirect URLs:**
   - Dashboard → Authentication → URL Configuration
   - Add redirect: `https://your-app.vercel.app/auth/callback`

3. **Configure email templates:**
   - Use production URLs in email links

---

## 🎉 Congratulations!

You're all set! Your Sunest Auto app should be running smoothly.

### Next Steps:

1. ✅ **Customize**: Edit branding, colors, content
2. ✅ **Add features**: Implement Phase 2 (QR, Loyalty, Chatbot)
3. ✅ **Test thoroughly**: Create test bookings, check all flows
4. ✅ **Deploy**: Launch to production
5. ✅ **Monitor**: Set up analytics, error tracking

### Need Help?

- 📖 Read: `SUNEST_AUTO_COMPLETE_PLANNING.md`
- 📖 FAQ: `README.md`
- 📧 Email: support@sunest-auto.com
- 💬 Discord: [Join our community](#)

---

**Happy Coding! 🚀**

Made with ❤️ for Indonesian motorcycle workshops 🏍️
