-- ============================================================================
-- SUNEST AUTO - COMPLETE DATABASE SETUP
-- ============================================================================
-- Run this ENTIRE file in Supabase SQL Editor
-- Time: ~10 seconds
-- After this, create demo users via Authentication dashboard
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE TABLES
-- ============================================================================

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  estimated_duration INTEGER NOT NULL, -- in minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_plate TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  engine_capacity INTEGER, -- cc
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_name TEXT NOT NULL,
  part_code TEXT UNIQUE,
  category TEXT NOT NULL,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10, 2) NOT NULL,
  minimum_stock INTEGER DEFAULT 10,
  supplier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Job Orders Table
CREATE TABLE IF NOT EXISTS public.job_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Job Parts Table (parts used in job)
CREATE TABLE IF NOT EXISTS public.job_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_order_id UUID NOT NULL REFERENCES public.job_orders(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE RESTRICT,
  quantity_used INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Job Updates Table (timeline)
CREATE TABLE IF NOT EXISTS public.job_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_order_id UUID NOT NULL REFERENCES public.job_orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PART 2: CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_vehicles_user ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON public.vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_job_orders_customer ON public.job_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_orders_status ON public.job_orders(status);
CREATE INDEX IF NOT EXISTS idx_job_orders_created ON public.job_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_parts_job ON public.job_parts(job_order_id);
CREATE INDEX IF NOT EXISTS idx_job_updates_job ON public.job_updates(job_order_id);

-- ============================================================================
-- PART 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_updates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Users can view own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can create own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can delete own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can view all vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated can view inventory" ON public.inventory;
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory;
DROP POLICY IF EXISTS "Customers can view own jobs" ON public.job_orders;
DROP POLICY IF EXISTS "Customers can create jobs" ON public.job_orders;
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.job_orders;
DROP POLICY IF EXISTS "Admins can update jobs" ON public.job_orders;
DROP POLICY IF EXISTS "Users can view job parts" ON public.job_parts;
DROP POLICY IF EXISTS "Admins can manage job parts" ON public.job_parts;
DROP POLICY IF EXISTS "Users can view job updates" ON public.job_updates;
DROP POLICY IF EXISTS "Admins can create job updates" ON public.job_updates;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Services Policies (everyone can read)
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Vehicles Policies
CREATE POLICY "Users can view own vehicles" ON public.vehicles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own vehicles" ON public.vehicles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own vehicles" ON public.vehicles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own vehicles" ON public.vehicles FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all vehicles" ON public.vehicles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Inventory Policies
CREATE POLICY "Authenticated can view inventory" ON public.inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage inventory" ON public.inventory FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Job Orders Policies
CREATE POLICY "Customers can view own jobs" ON public.job_orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Customers can create jobs" ON public.job_orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Admins can view all jobs" ON public.job_orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update jobs" ON public.job_orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Job Parts Policies
CREATE POLICY "Users can view job parts" ON public.job_parts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_orders 
    WHERE id = job_parts.job_order_id 
    AND (customer_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  )
);
CREATE POLICY "Admins can manage job parts" ON public.job_parts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Job Updates Policies  
CREATE POLICY "Users can view job updates" ON public.job_updates FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_orders 
    WHERE id = job_updates.job_order_id 
    AND (customer_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  )
);
CREATE POLICY "Admins can create job updates" ON public.job_updates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- PART 4: AUTO-TRIGGERS
-- ============================================================================

-- Trigger: Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.services;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.vehicles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.job_orders;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.job_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Auto-deduct inventory when parts are used
CREATE OR REPLACE FUNCTION public.decrement_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.inventory
  SET quantity_in_stock = quantity_in_stock - NEW.quantity_used
  WHERE id = NEW.inventory_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS decrement_stock_on_part_use ON public.job_parts;
CREATE TRIGGER decrement_stock_on_part_use
  AFTER INSERT ON public.job_parts
  FOR EACH ROW EXECUTE FUNCTION public.decrement_inventory_stock();

-- ============================================================================
-- PART 5: SEED DATA - SERVICES
-- ============================================================================

INSERT INTO public.services (name, description, base_price, estimated_duration) VALUES
('Hemat Service', 'Servis rutin: ganti oli, filter, cek rem, cek ban', 100000, 45),
('Basic Tune-Up', 'Tune-up standar: busi, karburator, timing belt', 150000, 60),
('Premium Service', 'Servis lengkap dengan pembersihan mesin dan injector', 350000, 120),
('Major Overhaul', 'Overhaul mesin komplit dengan penggantian komponen utama', 1500000, 480)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PART 6: SEED DATA - INVENTORY
-- ============================================================================

INSERT INTO public.inventory (part_name, part_code, category, quantity_in_stock, unit_price, minimum_stock, supplier) VALUES
-- Oli & Pelumas
('Oli Mesin Yamalube 10W-40', 'OLI-001', 'Oli', 50, 45000, 20, 'PT Yamaha Indonesia'),
('Oli Mesin MPX1 10W-30', 'OLI-002', 'Oli', 40, 35000, 15, 'PT Federal Oil'),
('Oli Gardan', 'OLI-003', 'Oli', 30, 25000, 10, 'PT Pertamina Lubricants'),
('Grease/Gemuk', 'OLI-004', 'Pelumas', 25, 15000, 10, 'PT Shell Indonesia'),

-- Filter
('Filter Oli', 'FLT-001', 'Filter', 60, 20000, 25, 'PT Astra Honda Motor'),
('Filter Udara', 'FLT-002', 'Filter', 55, 35000, 20, 'PT Astra Honda Motor'),
('Filter Bensin', 'FLT-003', 'Filter', 45, 18000, 15, 'PT Yamaha Indonesia'),

-- Busi & Kelistrikan
('Busi NGK Iridium', 'BSI-001', 'Busi', 100, 45000, 40, 'PT NGK Busi Indonesia'),
('Busi Standar', 'BSI-002', 'Busi', 80, 18000, 30, 'PT Denso Indonesia'),
('Aki/Battery 12V', 'AKI-001', 'Kelistrikan', 20, 250000, 8, 'PT GS Battery'),
('Fuse/Sekring Set', 'ELE-001', 'Kelistrikan', 50, 5000, 20, 'Toko Elektro Jaya'),

-- Rem
('Kampas Rem Depan', 'REM-001', 'Rem', 40, 65000, 15, 'PT Aspira'),
('Kampas Rem Belakang', 'REM-002', 'Rem', 35, 55000, 12, 'PT Aspira'),
('Minyak Rem DOT 4', 'REM-003', 'Rem', 30, 35000, 12, 'PT Brake Fluid Indo'),

-- Transmisi & Drive
('V-Belt/Sabuk', 'TRN-001', 'Transmisi', 25, 85000, 10, 'PT Aspira'),
('Kampas Kopling', 'TRN-002', 'Transmisi', 20, 120000, 8, 'PT Federal Parts'),
('Rantai & Gear Set', 'TRN-003', 'Transmisi', 15, 450000, 5, 'PT Indospring'),

-- Ban & Suspensi
('Ban Depan 80/90-14', 'BAN-001', 'Ban', 12, 350000, 5, 'PT IRC Tire'),
('Ban Belakang 90/90-14', 'BAN-002', 'Ban', 10, 380000, 4, 'PT IRC Tire'),
('Shock Breaker Belakang', 'SUS-001', 'Suspensi', 8, 450000, 3, 'PT Showa Indonesia'),

-- Lainnya
('Kabel Gas', 'ACC-001', 'Aksesori', 20, 45000, 8, 'PT Aspira'),
('Bearing Roda Set', 'ACC-002', 'Bearing', 30, 85000, 10, 'PT NTN Bearing'),
('Seal Set Komplit', 'ACC-003', 'Seal', 25, 150000, 8, 'PT NOK Indonesia'),
('Coolant/Air Radiator', 'ACC-004', 'Cairan', 40, 45000, 15, 'PT Pertamina Lubricants'),
('Pembersih Injector', 'ACC-005', 'Cairan', 35, 35000, 12, 'PT Shell Indonesia')
ON CONFLICT (part_code) DO NOTHING;

-- ============================================================================
-- ✅ DATABASE SETUP COMPLETE!
-- ============================================================================

-- Verify installation:
SELECT 'Tables created:' AS status, COUNT(*) AS count FROM pg_tables WHERE schemaname = 'public';
SELECT 'Services loaded:' AS status, COUNT(*) AS count FROM public.services;
SELECT 'Inventory items:' AS status, COUNT(*) AS count FROM public.inventory;

-- ============================================================================
-- 🎯 NEXT STEP: CREATE DEMO USERS
-- ============================================================================
-- Go to: Authentication → Users → Add user
--
-- Create 2 users:
--
-- USER 1 - CUSTOMER:
--   Email: customer@demo.com
--   Password: password123
--   ✅ Auto Confirm User: YES
--   User Metadata: {"full_name": "John Customer", "role": "customer"}
--
-- USER 2 - ADMIN:
--   Email: admin@demo.com
--   Password: password123
--   ✅ Auto Confirm User: YES
--   User Metadata: {"full_name": "Admin Sunest", "role": "admin"}
-- ============================================================================