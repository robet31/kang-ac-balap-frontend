-- ============================================
-- SUNEST AUTO - SEED DATA
-- Initial data untuk testing & development
-- ============================================
-- Run this AFTER COMPLETE_MIGRATION.sql
-- ============================================

-- ============================================
-- 1. SERVICE PACKAGES (4 Packages)
-- ============================================
INSERT INTO public.services (id, name, description, base_price, estimated_duration, service_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Hemat Service', 'Ganti oli mesin + filter oli + cek rem & ban', 100000, 30, 'basic'),
  ('00000000-0000-0000-0000-000000000002', 'Basic Tune-Up', 'Ganti oli mesin, cek rem & kampas, pembersihan filter, inflasi ban, safety check', 150000, 45, 'standard'),
  ('00000000-0000-0000-0000-000000000003', 'Premium Service', 'Basic Tune-Up + ganti oli gardan, tune up karburator, pembersihan injector, detailing motor, free cuci steam', 350000, 120, 'premium'),
  ('00000000-0000-0000-0000-000000000004', 'Major Overhaul', 'Complete engine check, ganti part sesuai kebutuhan, transmission service, electrical diagnostic, test ride quality check', 1500000, 480, 'overhaul')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  estimated_duration = EXCLUDED.estimated_duration;

-- ============================================
-- 2. INVENTORY ITEMS (25 Items)
-- ============================================
INSERT INTO public.inventory (part_sku, part_name, description, category, quantity_in_stock, minimum_stock_level, unit_cost, selling_price, supplier_name, supplier_contact) VALUES
  -- Oils & Lubricants (5)
  ('OLI-FED-08L', 'Oli Mesin Federal 0.8L', 'Oli mesin Federal Matic SAE 10W-30 0.8 Liter', 'Lubricants', 100, 50, 28000, 35000, 'PT Federal Oil', '031-5678901'),
  ('OLI-SHL-08L', 'Oli Shell AX7 0.8L', 'Shell Advance AX7 10W-40 0.8L', 'Lubricants', 80, 40, 42000, 55000, 'PT Shell Indonesia', '031-5678902'),
  ('OLI-GAR-120', 'Oli Gardan SAE 90', 'Gear oil SAE 90 120ml', 'Lubricants', 60, 30, 15000, 20000, 'PT Federal Oil', '031-5678901'),
  ('OLI-REM-250', 'Minyak Rem DOT 4', 'Brake fluid DOT 4 250ml', 'Brake System', 50, 25, 25000, 35000, 'PT Brake Indonesia', '031-5678903'),
  ('GRS-CHN-50G', 'Grease Rantai 50g', 'Chain grease premium waterproof', 'Lubricants', 40, 20, 12000, 18000, 'PT Chain Master', '031-5678904'),

  -- Filters (5)
  ('FLT-OLI-HND', 'Filter Oli Honda', 'Filter oli original quality Honda', 'Filters', 120, 50, 15000, 22000, 'PT Filter Jaya', '031-5678905'),
  ('FLT-OLI-YMH', 'Filter Oli Yamaha', 'Filter oli original quality Yamaha', 'Filters', 100, 50, 15000, 22000, 'PT Filter Jaya', '031-5678905'),
  ('FLT-UDR-HND', 'Filter Udara Honda', 'Air filter high flow Honda', 'Filters', 80, 40, 25000, 38000, 'PT Filter Jaya', '031-5678905'),
  ('FLT-UDR-YMH', 'Filter Udara Yamaha', 'Air filter high flow Yamaha', 'Filters', 75, 40, 25000, 38000, 'PT Filter Jaya', '031-5678905'),
  ('FLT-BNS-UNI', 'Filter Bensin Universal', 'Fuel filter universal motorcycle', 'Filters', 60, 30, 18000, 28000, 'PT Filter Jaya', '031-5678905'),

  -- Brake System (5)
  ('BRK-KMP-DPN', 'Kampas Rem Depan', 'Brake pad front non-asbestos premium', 'Brake System', 50, 25, 55000, 75000, 'PT Brake Indonesia', '031-5678903'),
  ('BRK-KMP-BLK', 'Kampas Rem Belakang', 'Brake pad rear non-asbestos premium', 'Brake System', 45, 25, 48000, 68000, 'PT Brake Indonesia', '031-5678903'),
  ('BRK-DSK-DPN', 'Cakram Disc Depan', 'Brake disc front premium quality', 'Brake System', 25, 10, 180000, 250000, 'PT Brake Indonesia', '031-5678903'),
  ('BRK-SLG-DPN', 'Selang Rem Depan', 'Brake hose front stainless steel', 'Brake System', 30, 15, 65000, 95000, 'PT Brake Indonesia', '031-5678903'),
  ('BRK-MST-DPN', 'Master Rem Depan', 'Brake master cylinder front original quality', 'Brake System', 15, 8, 220000, 320000, 'PT Brake Indonesia', '031-5678903'),

  -- Drivetrain (5)
  ('CHN-428-120', 'Rantai 428-120L', 'Chain 428 pitch 120 links premium quality', 'Drivetrain', 40, 20, 150000, 220000, 'PT Chain Master', '031-5678904'),
  ('SPR-DPN-428', 'Sprocket Depan 428', 'Front sprocket 428 14T original quality', 'Drivetrain', 35, 15, 45000, 68000, 'PT Chain Master', '031-5678904'),
  ('SPR-BLK-428', 'Sprocket Belakang 428', 'Rear sprocket 428 33T original quality', 'Drivetrain', 30, 15, 85000, 125000, 'PT Chain Master', '031-5678904'),
  ('VBL-STD-90', 'V-Belt Standard 90', 'Drive belt standard 90 premium rubber', 'Drivetrain', 25, 12, 75000, 110000, 'PT Belt Indonesia', '031-5678906'),
  ('KPL-CVT-STD', 'Kampas Kopling CVT', 'CVT clutch pad standard premium', 'Drivetrain', 20, 10, 95000, 140000, 'PT Belt Indonesia', '031-5678906'),

  -- Ignition & Electrical (5)
  ('BSI-IRI-NGK', 'Busi Iridium NGK', 'Spark plug iridium NGK long life', 'Ignition', 100, 50, 35000, 52000, 'PT Spark Tech', '031-5678907'),
  ('BSI-PLT-DEN', 'Busi Platinum Denso', 'Spark plug platinum Denso high performance', 'Ignition', 80, 40, 42000, 62000, 'PT Spark Tech', '031-5678907'),
  ('KOP-BSI-HND', 'Kop Busi Honda', 'Spark plug cap Honda original', 'Ignition', 50, 25, 18000, 28000, 'PT Spark Tech', '031-5678907'),
  ('AKI-YTX7-MF', 'Aki YTX7A-BS MF', 'Battery maintenance free 12V 7Ah', 'Electrical', 20, 10, 280000, 380000, 'PT Battery Indo', '031-5678908'),
  ('SKR-STR-UNI', 'Sekring Starter', 'Fuse starter 15A universal', 'Electrical', 100, 50, 3000, 5000, 'PT Electrical', '031-5678909')
ON CONFLICT (part_sku) DO UPDATE SET
  part_name = EXCLUDED.part_name,
  description = EXCLUDED.description,
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  minimum_stock_level = EXCLUDED.minimum_stock_level,
  unit_cost = EXCLUDED.unit_cost,
  selling_price = EXCLUDED.selling_price;

-- ============================================
-- SEED DATA COMPLETE ✅
-- ============================================
-- Total Services: 4
-- Total Inventory Items: 25
-- 
-- Next steps:
-- 1. Create demo users via Supabase Auth Dashboard
-- 2. Add vehicles for customers
-- 3. Create test bookings
-- ============================================

-- Verify data
SELECT 'SERVICES' as type, COUNT(*) as count FROM public.services
UNION ALL
SELECT 'INVENTORY' as type, COUNT(*) as count FROM public.inventory
ORDER BY type;
