-- =====================================================
-- SUNEST AUTO - Complete Database Migration
-- Add missing columns for admin manual job creation
-- =====================================================

-- Add customer_name column (for manual input without user relation)
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Add vehicle_name column (for manual input without vehicle relation)
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS vehicle_name TEXT;

-- Add package_name column (to store selected package name)
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS package_name TEXT;

-- Add comments for documentation
COMMENT ON COLUMN jobs.customer_name IS 'Manual customer name input from admin (when user_id is null)';
COMMENT ON COLUMN jobs.vehicle_name IS 'Manual vehicle name input from admin (when vehicle_id is null)';
COMMENT ON COLUMN jobs.package_name IS 'Service package name (e.g., Basic Tune-Up, Premium Service)';

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'jobs' 
  AND column_name IN ('customer_name', 'vehicle_name', 'package_name')
ORDER BY column_name;
