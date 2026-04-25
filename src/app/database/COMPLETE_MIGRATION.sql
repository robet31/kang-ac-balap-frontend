-- ============================================
-- SUNEST AUTO - COMPLETE DATABASE MIGRATION
-- Platform Digital Komprehensif untuk Bengkel Motor
-- ============================================
-- Run this script in your NEW Supabase project SQL Editor
-- This will create all tables, triggers, and seed data
-- ============================================

-- ============================================
-- 1. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================
-- 2. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'technician', 'admin')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  estimated_duration INTEGER NOT NULL, -- in minutes
  service_type TEXT DEFAULT 'standard',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Only admins can manage services" ON public.services;
CREATE POLICY "Only admins can manage services"
  ON public.services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 4. VEHICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plate_number TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  engine_capacity TEXT,
  color TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicles
DROP POLICY IF EXISTS "Users can view own vehicles" ON public.vehicles;
CREATE POLICY "Users can view own vehicles"
  ON public.vehicles FOR SELECT
  USING (customer_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'technician')));

DROP POLICY IF EXISTS "Users can insert own vehicles" ON public.vehicles;
CREATE POLICY "Users can insert own vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;
CREATE POLICY "Users can update own vehicles"
  ON public.vehicles FOR UPDATE
  USING (customer_id = auth.uid());

-- ============================================
-- 5. INVENTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_sku TEXT NOT NULL UNIQUE,
  part_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  minimum_stock_level INTEGER NOT NULL DEFAULT 0,
  unit_cost DECIMAL(10, 2) NOT NULL,
  selling_price DECIMAL(10, 2) NOT NULL,
  supplier_name TEXT,
  supplier_contact TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory
DROP POLICY IF EXISTS "Everyone can view active inventory" ON public.inventory;
CREATE POLICY "Everyone can view active inventory"
  ON public.inventory FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Only admins can manage inventory" ON public.inventory;
CREATE POLICY "Only admins can manage inventory"
  ON public.inventory FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 6. JOB ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.job_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT NOT NULL UNIQUE,
  vehicle_id UUID REFERENCES public.vehicles(id),
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  service_id UUID REFERENCES public.services(id),
  assigned_technician_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'awaiting_payment', 'completed', 'cancelled')),
  scheduled_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  customer_notes TEXT,
  technician_diagnosis TEXT,
  labor_cost DECIMAL(10, 2) DEFAULT 0,
  parts_cost DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_orders
DROP POLICY IF EXISTS "Customers can view own job orders" ON public.job_orders;
CREATE POLICY "Customers can view own job orders"
  ON public.job_orders FOR SELECT
  USING (customer_id = auth.uid() OR 
         assigned_technician_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Customers can create job orders" ON public.job_orders;
CREATE POLICY "Customers can create job orders"
  ON public.job_orders FOR INSERT
  WITH CHECK (customer_id = auth.uid() OR 
              EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'technician')));

DROP POLICY IF EXISTS "Admins can manage all job orders" ON public.job_orders;
CREATE POLICY "Admins can manage all job orders"
  ON public.job_orders FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Technicians can update assigned jobs" ON public.job_orders;
CREATE POLICY "Technicians can update assigned jobs"
  ON public.job_orders FOR UPDATE
  USING (assigned_technician_id = auth.uid());

-- ============================================
-- 7. JOB PARTS TABLE (Junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.job_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_order_id UUID NOT NULL REFERENCES public.job_orders(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id),
  quantity_used INTEGER NOT NULL,
  unit_price_at_time DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL, -- Not generated, manually calculated
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_parts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_parts
DROP POLICY IF EXISTS "Users can view job parts for their jobs" ON public.job_parts;
CREATE POLICY "Users can view job parts for their jobs"
  ON public.job_parts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.job_orders jo
      WHERE jo.id = job_parts.job_order_id
      AND (jo.customer_id = auth.uid() OR jo.assigned_technician_id = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Technicians and admins can manage job parts" ON public.job_parts;
CREATE POLICY "Technicians and admins can manage job parts"
  ON public.job_parts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.job_orders jo
      WHERE jo.id = job_parts.job_order_id
      AND jo.assigned_technician_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'customer'))
  );

-- ============================================
-- 8. JOB UPDATES TABLE (Status history & notes)
-- ============================================
CREATE TABLE IF NOT EXISTS public.job_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_order_id UUID NOT NULL REFERENCES public.job_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  update_type TEXT NOT NULL CHECK (update_type IN ('status_change', 'note', 'photo')),
  content TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_updates
DROP POLICY IF EXISTS "Users can view updates for their jobs" ON public.job_updates;
CREATE POLICY "Users can view updates for their jobs"
  ON public.job_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.job_orders jo
      WHERE jo.id = job_updates.job_order_id
      AND (jo.customer_id = auth.uid() OR jo.assigned_technician_id = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Technicians and admins can add updates" ON public.job_updates;
CREATE POLICY "Technicians and admins can add updates"
  ON public.job_updates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.job_orders jo
      WHERE jo.id = job_order_id
      AND jo.assigned_technician_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 9. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_orders_updated_at ON public.job_orders;
CREATE TRIGGER update_job_orders_updated_at BEFORE UPDATE ON public.job_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_updated_at ON public.inventory;
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update job order total when parts are added/removed
CREATE OR REPLACE FUNCTION update_job_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.job_orders
  SET 
    parts_cost = (
      SELECT COALESCE(SUM(subtotal), 0)
      FROM public.job_parts
      WHERE job_order_id = COALESCE(NEW.job_order_id, OLD.job_order_id)
    ),
    total_amount = labor_cost + (
      SELECT COALESCE(SUM(subtotal), 0)
      FROM public.job_parts
      WHERE job_order_id = COALESCE(NEW.job_order_id, OLD.job_order_id)
    )
  WHERE id = COALESCE(NEW.job_order_id, OLD.job_order_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for job parts changes
DROP TRIGGER IF EXISTS update_job_total_on_parts_change ON public.job_parts;
CREATE TRIGGER update_job_total_on_parts_change
  AFTER INSERT OR UPDATE OR DELETE ON public.job_parts
  FOR EACH ROW EXECUTE FUNCTION update_job_order_total();

-- Function to auto-decrement inventory when parts are used
CREATE OR REPLACE FUNCTION decrement_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.inventory
  SET quantity_in_stock = quantity_in_stock - NEW.quantity_used
  WHERE id = NEW.inventory_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item not found';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for inventory decrement
DROP TRIGGER IF EXISTS decrement_stock_on_part_use ON public.job_parts;
CREATE TRIGGER decrement_stock_on_part_use
  AFTER INSERT ON public.job_parts
  FOR EACH ROW EXECUTE FUNCTION decrement_inventory_stock();

-- ============================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON public.vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON public.vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_job_orders_customer_id ON public.job_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_orders_vehicle_id ON public.job_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_job_orders_technician_id ON public.job_orders(assigned_technician_id);
CREATE INDEX IF NOT EXISTS idx_job_orders_status ON public.job_orders(status);
CREATE INDEX IF NOT EXISTS idx_job_orders_created_at ON public.job_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_parts_job_id ON public.job_parts(job_order_id);
CREATE INDEX IF NOT EXISTS idx_job_parts_inventory_id ON public.job_parts(inventory_id);
CREATE INDEX IF NOT EXISTS idx_job_updates_job_id ON public.job_updates(job_order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON public.inventory(part_sku);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_level ON public.inventory(quantity_in_stock, minimum_stock_level);

-- ============================================
-- 11. GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant access to sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- 12. VERIFICATION
-- ============================================

-- Verify tables
SELECT 
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- MIGRATION COMPLETE ✅
-- ============================================
-- Next step: Run SEED_DATA.sql to populate initial data
-- ============================================
