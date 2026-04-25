-- Fix job_orders status constraint to include 'awaiting_payment'
-- Run this SQL in Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE public.job_orders 
DROP CONSTRAINT IF EXISTS job_orders_status_check;

-- Add new constraint with 'awaiting_payment' included
ALTER TABLE public.job_orders
ADD CONSTRAINT job_orders_status_check 
CHECK (status IN ('pending', 'scheduled', 'in_progress', 'awaiting_payment', 'completed', 'cancelled'));

-- Verify the constraint
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.job_orders'::regclass
  AND conname = 'job_orders_status_check';
