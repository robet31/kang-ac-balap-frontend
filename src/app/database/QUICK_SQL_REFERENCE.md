# 📝 Quick SQL Commands Reference

## Useful SQL queries untuk testing dan debugging MotoCare Pro

---

## 🔍 View All Tables

```sql
-- List all tables in public schema
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

## 👥 User Management

### View All Users with Roles
```sql
SELECT 
  au.id,
  au.email,
  au.created_at as user_created,
  p.full_name,
  p.role,
  p.phone
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
```

### Create Admin User
```sql
-- Note: Replace 'admin@yourdomain.com' with actual email
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@yourdomain.com',
  crypt('YourSecurePassword123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Your Name","role":"admin"}',
  NOW(),
  NOW()
);
```

### Delete User (and cascade profile)
```sql
-- WARNING: This deletes user and all related data!
DELETE FROM auth.users WHERE email = 'user@example.com';
```

---

## 🏍️ Job Orders

### View All Active Jobs
```sql
SELECT 
  jo.id,
  jo.job_number,
  jo.status,
  jo.scheduled_date,
  c.full_name as customer_name,
  v.plate_number,
  v.brand || ' ' || v.model as vehicle,
  t.full_name as technician_name,
  s.name as service_name,
  jo.total_amount
FROM job_orders jo
LEFT JOIN profiles c ON jo.customer_id = c.id
LEFT JOIN vehicles v ON jo.vehicle_id = v.id
LEFT JOIN profiles t ON jo.assigned_technician_id = t.id
LEFT JOIN services s ON jo.service_id = s.id
WHERE jo.status IN ('scheduled', 'in_progress')
ORDER BY jo.scheduled_date;
```

### View Completed Jobs Today
```sql
SELECT 
  jo.job_number,
  c.full_name as customer,
  jo.total_amount,
  jo.payment_status,
  jo.completed_at
FROM job_orders jo
LEFT JOIN profiles c ON jo.customer_id = c.id
WHERE jo.status = 'completed'
  AND DATE(jo.completed_at) = CURRENT_DATE
ORDER BY jo.completed_at DESC;
```

### Calculate Today's Revenue
```sql
SELECT 
  COUNT(*) as jobs_completed,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value
FROM job_orders
WHERE status = 'completed'
  AND payment_status = 'paid'
  AND DATE(completed_at) = CURRENT_DATE;
```

---

## 📦 Inventory Management

### View Low Stock Items
```sql
SELECT 
  part_sku,
  part_name,
  quantity_in_stock,
  minimum_stock_level,
  (minimum_stock_level - quantity_in_stock) as shortage,
  unit_cost,
  selling_price,
  supplier_name
FROM inventory
WHERE is_active = true
  AND quantity_in_stock <= minimum_stock_level
ORDER BY (minimum_stock_level - quantity_in_stock) DESC;
```

### View Most Used Parts (Last 30 Days)
```sql
SELECT 
  i.part_name,
  i.part_sku,
  COUNT(jp.id) as times_used,
  SUM(jp.quantity_used) as total_quantity,
  SUM(jp.subtotal) as total_revenue
FROM job_parts jp
JOIN inventory i ON jp.inventory_id = i.id
JOIN job_orders jo ON jp.job_order_id = jo.id
WHERE jo.created_at >= NOW() - INTERVAL '30 days'
GROUP BY i.id, i.part_name, i.part_sku
ORDER BY total_quantity DESC
LIMIT 10;
```

### Update Stock Quantity
```sql
-- Add stock (receiving new parts)
UPDATE inventory
SET quantity_in_stock = quantity_in_stock + 20
WHERE part_sku = 'OIL-001';

-- Subtract stock (manual adjustment)
UPDATE inventory
SET quantity_in_stock = quantity_in_stock - 5
WHERE part_sku = 'BRAKE-001';
```

---

## 🚗 Vehicles & Service History

### View Customer's Vehicles with Service Count
```sql
SELECT 
  v.plate_number,
  v.brand,
  v.model,
  v.year,
  p.full_name as owner_name,
  p.phone,
  COUNT(jo.id) as total_services,
  MAX(jo.completed_at) as last_service_date
FROM vehicles v
LEFT JOIN profiles p ON v.customer_id = p.id
LEFT JOIN job_orders jo ON v.id = jo.vehicle_id AND jo.status = 'completed'
GROUP BY v.id, v.plate_number, v.brand, v.model, v.year, p.full_name, p.phone
ORDER BY total_services DESC;
```

### Vehicle Service History
```sql
-- Replace 'B 1234 XYZ' with actual plate number
SELECT 
  jo.job_number,
  jo.scheduled_date,
  jo.completed_at,
  s.name as service,
  t.full_name as technician,
  jo.total_amount,
  jo.payment_status,
  jo.technician_diagnosis
FROM job_orders jo
LEFT JOIN vehicles v ON jo.vehicle_id = v.id
LEFT JOIN services s ON jo.service_id = s.id
LEFT JOIN profiles t ON jo.assigned_technician_id = t.id
WHERE v.plate_number = 'B 1234 XYZ'
ORDER BY jo.completed_at DESC;
```

---

## 👨‍🔧 Technician Performance

### Technician Stats (Current Month)
```sql
SELECT 
  t.full_name,
  COUNT(jo.id) as jobs_completed,
  SUM(jo.total_amount) as revenue_generated,
  AVG(jo.total_amount) as avg_job_value,
  AVG(EXTRACT(EPOCH FROM (jo.completed_at - jo.started_at)) / 3600) as avg_hours_per_job
FROM profiles t
LEFT JOIN job_orders jo ON t.id = jo.assigned_technician_id
WHERE t.role = 'technician'
  AND jo.status = 'completed'
  AND EXTRACT(MONTH FROM jo.completed_at) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM jo.completed_at) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY t.id, t.full_name
ORDER BY jobs_completed DESC;
```

### Technician Workload (Current)
```sql
SELECT 
  t.full_name,
  COUNT(CASE WHEN jo.status = 'in_progress' THEN 1 END) as active_jobs,
  COUNT(CASE WHEN jo.status = 'scheduled' THEN 1 END) as scheduled_jobs,
  COUNT(jo.id) as total_assigned
FROM profiles t
LEFT JOIN job_orders jo ON t.id = jo.assigned_technician_id
WHERE t.role = 'technician'
  AND jo.status IN ('scheduled', 'in_progress')
GROUP BY t.id, t.full_name
ORDER BY active_jobs DESC;
```

---

## 💰 Financial Reports

### Monthly Revenue Report
```sql
SELECT 
  TO_CHAR(completed_at, 'YYYY-MM') as month,
  COUNT(*) as total_jobs,
  SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as revenue_paid,
  SUM(CASE WHEN payment_status = 'unpaid' THEN total_amount ELSE 0 END) as revenue_pending,
  SUM(total_amount) as revenue_total
FROM job_orders
WHERE status = 'completed'
  AND completed_at >= NOW() - INTERVAL '12 months'
GROUP BY TO_CHAR(completed_at, 'YYYY-MM')
ORDER BY month DESC;
```

### Outstanding Invoices
```sql
SELECT 
  jo.job_number,
  c.full_name as customer,
  c.phone,
  v.plate_number,
  jo.completed_at,
  jo.total_amount,
  EXTRACT(DAY FROM NOW() - jo.completed_at) as days_overdue
FROM job_orders jo
LEFT JOIN profiles c ON jo.customer_id = c.id
LEFT JOIN vehicles v ON jo.vehicle_id = v.id
WHERE jo.status = 'completed'
  AND jo.payment_status IN ('unpaid', 'partial')
ORDER BY jo.completed_at;
```

### Revenue by Service Type
```sql
SELECT 
  s.name as service,
  COUNT(jo.id) as times_sold,
  SUM(jo.total_amount) as total_revenue,
  AVG(jo.total_amount) as avg_price
FROM services s
LEFT JOIN job_orders jo ON s.id = jo.service_id
WHERE jo.status = 'completed'
  AND jo.completed_at >= NOW() - INTERVAL '3 months'
GROUP BY s.id, s.name
ORDER BY total_revenue DESC;
```

---

## 🔧 Maintenance & Cleanup

### Reset All Job Orders (Development Only!)
```sql
-- WARNING: This deletes ALL job data!
TRUNCATE TABLE job_updates CASCADE;
TRUNCATE TABLE job_parts CASCADE;
TRUNCATE TABLE job_orders CASCADE;
```

### Reset Demo Data
```sql
-- Delete all data but keep structure
TRUNCATE TABLE job_updates CASCADE;
TRUNCATE TABLE job_parts CASCADE;
TRUNCATE TABLE job_orders CASCADE;
TRUNCATE TABLE vehicles CASCADE;
TRUNCATE TABLE inventory CASCADE;
TRUNCATE TABLE services CASCADE;

-- Re-run seed data from migration.sql
```

### Check Database Size
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🐛 Debugging

### Check RLS Policies
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Check Triggers
```sql
SELECT 
  event_object_table as table_name,
  trigger_name,
  event_manipulation as event,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

### View Recent Errors (if logging enabled)
```sql
-- This requires pgaudit or custom logging
-- Check Supabase dashboard > Logs for error logs
```

---

## 📊 Analytics Queries

### Customer Lifetime Value
```sql
SELECT 
  c.full_name,
  c.email,
  COUNT(jo.id) as total_visits,
  SUM(jo.total_amount) as lifetime_value,
  AVG(jo.total_amount) as avg_order_value,
  MIN(jo.created_at) as first_visit,
  MAX(jo.completed_at) as last_visit
FROM profiles c
LEFT JOIN job_orders jo ON c.id = jo.customer_id
WHERE c.role = 'customer'
  AND jo.status = 'completed'
GROUP BY c.id, c.full_name, c.email
ORDER BY lifetime_value DESC
LIMIT 20;
```

### Daily Performance Dashboard
```sql
WITH daily_stats AS (
  SELECT 
    DATE(completed_at) as date,
    COUNT(*) as jobs_completed,
    SUM(total_amount) as revenue,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 3600) as avg_job_hours
  FROM job_orders
  WHERE status = 'completed'
    AND completed_at >= NOW() - INTERVAL '30 days'
  GROUP BY DATE(completed_at)
)
SELECT 
  date,
  jobs_completed,
  revenue,
  ROUND(avg_job_hours::numeric, 2) as avg_hours,
  ROUND((revenue / jobs_completed)::numeric, 2) as avg_order_value
FROM daily_stats
ORDER BY date DESC;
```

---

**💡 Tip**: Save these queries in Supabase SQL Editor as "saved queries" for quick access!
