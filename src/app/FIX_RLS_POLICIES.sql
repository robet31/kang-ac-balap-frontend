-- ============================================================================
-- FIX INFINITE RECURSION - RLS POLICIES
-- ============================================================================
-- Run this to fix the circular reference in profiles policies
-- ============================================================================

-- Drop all existing policies
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

-- ============================================================================
-- FIXED: Profiles Policies (NO CIRCULAR REFERENCE!)
-- ============================================================================

-- Users can always view and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Check admin from JWT token metadata instead of querying profiles table
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    (auth.jwt()->>'role')::text = 'admin' 
    OR 
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

CREATE POLICY "Admins can manage all profiles" 
  ON public.profiles FOR ALL 
  USING (
    (auth.jwt()->>'role')::text = 'admin' 
    OR 
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- ============================================================================
-- FIXED: Services Policies
-- ============================================================================

CREATE POLICY "Anyone can view services" 
  ON public.services FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins can manage services" 
  ON public.services FOR ALL 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- ============================================================================
-- FIXED: Vehicles Policies
-- ============================================================================

CREATE POLICY "Users can view own vehicles" 
  ON public.vehicles FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own vehicles" 
  ON public.vehicles FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own vehicles" 
  ON public.vehicles FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own vehicles" 
  ON public.vehicles FOR DELETE 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all vehicles" 
  ON public.vehicles FOR SELECT 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- ============================================================================
-- FIXED: Inventory Policies
-- ============================================================================

CREATE POLICY "Authenticated can view inventory" 
  ON public.inventory FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins can manage inventory" 
  ON public.inventory FOR ALL 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- ============================================================================
-- FIXED: Job Orders Policies
-- ============================================================================

CREATE POLICY "Customers can view own jobs" 
  ON public.job_orders FOR SELECT 
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create jobs" 
  ON public.job_orders FOR INSERT 
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can view all jobs" 
  ON public.job_orders FOR SELECT 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

CREATE POLICY "Admins can update jobs" 
  ON public.job_orders FOR UPDATE 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

CREATE POLICY "Admins can delete jobs" 
  ON public.job_orders FOR DELETE 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- ============================================================================
-- FIXED: Job Parts Policies
-- ============================================================================

CREATE POLICY "Users can view job parts for own jobs" 
  ON public.job_parts FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.job_orders 
      WHERE id = job_parts.job_order_id 
      AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all job parts" 
  ON public.job_parts FOR SELECT 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

CREATE POLICY "Admins can manage job parts" 
  ON public.job_parts FOR ALL 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- ============================================================================
-- FIXED: Job Updates Policies
-- ============================================================================

CREATE POLICY "Users can view updates for own jobs" 
  ON public.job_updates FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.job_orders 
      WHERE id = job_updates.job_order_id 
      AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all updates" 
  ON public.job_updates FOR SELECT 
  USING (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

CREATE POLICY "Admins can create job updates" 
  ON public.job_updates FOR INSERT 
  WITH CHECK (
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- ============================================================================
-- ✅ FIXED! NO MORE INFINITE RECURSION!
-- ============================================================================

SELECT 'RLS Policies fixed!' AS status;
