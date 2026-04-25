-- ============================================
-- SEED DATA FOR SUNEST AUTO - SIMPLIFIED VERSION
-- Run this AFTER migration.sql
-- Data yang hanya include services dan inventory
-- ============================================

-- ============================================
-- 1. SERVICES (Paket Service)
-- ============================================
INSERT INTO public.services (id, name, description, base_price, estimated_duration, is_active) 
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Hemat Service', 'Paket service ekonomis untuk perawatan dasar motor Anda', 100000, 60, true),
  ('00000000-0000-0000-0000-000000000002', 'Basic Tune-Up', 'Tune-up standar dengan pengecekan komponen penting', 150000, 90, true),
  ('00000000-0000-0000-0000-000000000003', 'Standard Service', 'Paket service lengkap dengan perawatan menyeluruh', 300000, 120, true),
  ('00000000-0000-0000-0000-000000000004', 'Premium Service', 'Paket service premium dengan part original dan garansi', 500000, 180, true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  estimated_duration = EXCLUDED.estimated_duration;

-- ============================================
-- 2. INVENTORY (Spare Parts) - 25 Items
-- ============================================
INSERT INTO public.inventory (id, part_sku, part_name, description, category, quantity_in_stock, minimum_stock_level, unit_cost, selling_price, supplier_name, supplier_contact, is_active) 
VALUES
  -- Oli & Filter
  ('10000000-0000-0000-0000-000000000001', 'OLI-FED-08L', 'Oli Mesin Federal Matic 0.8L', 'Oli mesin khusus matic berkualitas', 'Lubricants', 245, 50, 35000, 49000, 'PT Federal Oil', '081234567890', true),
  ('10000000-0000-0000-0000-000000000002', 'FIL-HON-001', 'Filter Oli Honda', 'Filter oli original Honda', 'Filters', 198, 40, 25000, 35000, 'PT Astra Honda Motor', '081234567891', true),
  ('10000000-0000-0000-0000-000000000003', 'FIL-YAM-001', 'Filter Oli Yamaha', 'Filter oli original Yamaha', 'Filters', 156, 30, 23000, 32000, 'PT Yamaha Indonesia', '081234567892', true),
  
  -- Busi & Electrical
  ('10000000-0000-0000-0000-000000000004', 'BUS-NGK-IRI', 'Busi NGK Iridium', 'Busi iridium tahan lama', 'Electrical', 156, 30, 32000, 45000, 'PT NGK Indonesia', '081234567893', true),
  ('10000000-0000-0000-0000-000000000005', 'AKI-GSA-40Z', 'Aki GS Astra NS40ZL', 'Aki kering maintenance free', 'Electrical', 76, 15, 280000, 385000, 'PT GS Battery', '081234567894', true),
  
  -- Brake System
  ('10000000-0000-0000-0000-000000000006', 'KRM-DEP-001', 'Kampas Rem Depan', 'Kampas rem depan berkualitas', 'Brake System', 142, 25, 89000, 125000, 'PT Indoparts', '081234567895', true),
  ('10000000-0000-0000-0000-000000000007', 'KRM-BEL-001', 'Kampas Rem Belakang', 'Kampas rem belakang original', 'Brake System', 128, 25, 78000, 110000, 'PT Indoparts', '081234567896', true),
  ('10000000-0000-0000-0000-000000000008', 'MNY-REM-500', 'Minyak Rem DOT 4 500ml', 'Minyak rem berkualitas tinggi', 'Brake System', 95, 20, 28000, 40000, 'PT Federal Oil', '081234567897', true),
  
  -- Tires & Wheels
  ('10000000-0000-0000-0000-000000000009', 'BAN-IRC-809', 'Ban Luar IRC 80/90-14', 'Ban tubeless berkualitas', 'Tires', 98, 15, 135000, 185000, 'PT IRC Indonesia', '081234567898', true),
  ('10000000-0000-0000-0000-000000000010', 'BAN-FDR-100', 'Ban Luar FDR 100/80-14', 'Ban sport tubeless', 'Tires', 67, 10, 145000, 195000, 'PT FDR Indonesia', '081234567899', true),
  ('10000000-0000-0000-0000-000000000011', 'BAN-DAL-809', 'Ban Dalam 80/90-14', 'Ban dalam karet berkualitas', 'Tires', 112, 20, 18000, 25000, 'PT Suryaraya', '081234567800', true),
  
  -- Drive Train
  ('10000000-0000-0000-0000-000000000012', 'RAN-RK-428', 'Rantai RK 428', 'Rantai motor original', 'Drive Train', 87, 15, 155000, 215000, 'PT RK Chain', '081234567801', true),
  ('10000000-0000-0000-0000-000000000013', 'VBL-HON-001', 'V-Belt Honda', 'V-belt original Honda', 'Drive Train', 68, 15, 68000, 95000, 'PT Astra Honda Motor', '081234567802', true),
  ('10000000-0000-0000-0000-000000000014', 'GRS-HON-001', 'Gear Set Honda', 'Gear set komplit original', 'Drive Train', 54, 10, 310000, 425000, 'PT Astra Honda Motor', '081234567803', true),
  
  -- Suspension
  ('10000000-0000-0000-0000-000000000015', 'SHO-KYB-BEL', 'Shock Belakang KYB', 'Shockbreaker belakang premium', 'Suspension', 45, 8, 400000, 550000, 'PT KYB Indonesia', '081234567804', true),
  ('10000000-0000-0000-0000-000000000016', 'SHO-KYB-DEP', 'Shock Depan KYB', 'Shockbreaker depan premium', 'Suspension', 38, 8, 450000, 620000, 'PT KYB Indonesia', '081234567805', true),
  
  -- Engine Parts
  ('10000000-0000-0000-0000-000000000017', 'PIS-HON-150', 'Piston Kit Honda 150cc', 'Piston kit original', 'Engine Parts', 42, 8, 280000, 385000, 'PT Astra Honda Motor', '081234567806', true),
  ('10000000-0000-0000-0000-000000000018', 'KAR-MIK-001', 'Karburator Mikuni', 'Karburator original Mikuni', 'Engine Parts', 35, 5, 380000, 525000, 'PT Mikuni Indonesia', '081234567807', true),
  ('10000000-0000-0000-0000-000000000019', 'KNL-HON-001', 'Knalpot Racing', 'Knalpot racing aftermarket', 'Engine Parts', 28, 5, 420000, 575000, 'PT Racing Part', '081234567808', true),
  
  -- Body Parts
  ('10000000-0000-0000-0000-000000000020', 'SPO-DEP-001', 'Spion Kanan Kiri', 'Spion sepasang original', 'Body Parts', 92, 15, 65000, 90000, 'PT Indoparts', '081234567809', true),
  ('10000000-0000-0000-0000-000000000021', 'LAM-LED-H4', 'Lampu LED H4', 'Lampu LED hemat energi', 'Body Parts', 78, 12, 125000, 175000, 'PT Osram Indonesia', '081234567810', true),
  ('10000000-0000-0000-0000-000000000022', 'SEN-LED-001', 'Sein LED Amber', 'Lampu sein LED', 'Body Parts', 88, 15, 45000, 65000, 'PT Osram Indonesia', '081234567811', true),
  
  -- Consumables
  ('10000000-0000-0000-0000-000000000023', 'GRI-WD40-330', 'Grease WD-40 330ml', 'Pelumas serba guna', 'Consumables', 156, 25, 38000, 52000, 'PT WD-40 Indonesia', '081234567812', true),
  ('10000000-0000-0000-0000-000000000024', 'CLN-CRB-500', 'Carb Cleaner 500ml', 'Pembersih karburator', 'Consumables', 134, 20, 28000, 40000, 'PT Wurth Indonesia', '081234567813', true),
  ('10000000-0000-0000-0000-000000000025', 'SIL-RTV-100', 'Silicone RTV 100g', 'Sealant tahan panas', 'Consumables', 98, 15, 22000, 32000, 'PT 3M Indonesia', '081234567814', true)
ON CONFLICT (id) DO UPDATE SET
  quantity_in_stock = EXCLUDED.quantity_in_stock,
  unit_cost = EXCLUDED.unit_cost,
  selling_price = EXCLUDED.selling_price,
  updated_at = NOW();

-- ============================================
-- SUMMARY
-- ============================================
SELECT 'Seed data created successfully!' AS message;
SELECT COUNT(*) AS total_services FROM public.services;
SELECT COUNT(*) AS total_inventory FROM public.inventory;

-- Show services
SELECT id, name, base_price, estimated_duration FROM public.services ORDER BY base_price;

-- Show inventory by category
SELECT 
  category,
  COUNT(*) as item_count,
  SUM(quantity_in_stock) as total_stock
FROM public.inventory
GROUP BY category
ORDER BY category;

-- Show low stock items
SELECT 
  part_sku,
  part_name,
  quantity_in_stock,
  minimum_stock_level,
  (quantity_in_stock - minimum_stock_level) as buffer
FROM public.inventory
WHERE quantity_in_stock <= minimum_stock_level
ORDER BY buffer;
