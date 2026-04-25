-- Add QR Code token field to job_orders table
-- This field stores unique QR code for customer check-in

-- Add column if it doesn't exist
ALTER TABLE job_orders 
ADD COLUMN IF NOT EXISTS qr_code_token VARCHAR(50) UNIQUE;

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_qr_code_token 
ON job_orders(qr_code_token);

-- Add comment
COMMENT ON COLUMN job_orders.qr_code_token IS 'Unique QR code token for customer check-in. Format: SUNEST-YYYYMMDD-XXXX. Auto-deleted when booking completed.';

-- Migration complete
SELECT 'QR Code token column added successfully' AS status;
