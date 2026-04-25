#!/usr/bin/env node

/**
 * Seed Sample Data Script
 * Creates sample customers, vehicles, spare parts, etc.
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data
const sampleCustomers = [
  {
    key: 'customer_001',
    value: {
      id: 'customer_001',
      name: 'Budi Santoso',
      email: 'budi@example.com',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      status: 'active',
      total_visits: 12,
      total_spent: 1200000,
      created_at: new Date().toISOString()
    }
  },
  {
    key: 'customer_002',
    value: {
      id: 'customer_002',
      name: 'Siti Aminah',
      email: 'siti@example.com',
      phone: '081387654321',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      status: 'active',
      total_visits: 5,
      total_spent: 450000,
      created_at: new Date().toISOString()
    }
  }
];

const sampleVehicles = [
  {
    key: 'vehicle_001',
    value: {
      id: 'vehicle_001',
      user_id: 'customer_001',
      brand: 'Yamaha',
      model: 'NMAX',
      plate_number: 'B 1234 XYZ',
      year: 2020,
      color: 'Hitam',
      current_mileage: 3500,
      status: 'active',
      created_at: new Date().toISOString()
    }
  },
  {
    key: 'vehicle_002',
    value: {
      id: 'vehicle_002',
      user_id: 'customer_001',
      brand: 'Honda',
      model: 'Vario 160',
      plate_number: 'B 5678 ABC',
      year: 2021,
      color: 'Merah',
      current_mileage: 2100,
      status: 'active',
      created_at: new Date().toISOString()
    }
  },
  {
    key: 'vehicle_003',
    value: {
      id: 'vehicle_003',
      user_id: 'customer_002',
      brand: 'Yamaha',
      model: 'Aerox',
      plate_number: 'B 9012 DEF',
      year: 2022,
      color: 'Biru',
      current_mileage: 1500,
      status: 'active',
      created_at: new Date().toISOString()
    }
  }
];

const sampleSpareParts = [
  {
    key: 'sparepart_001',
    value: {
      id: 'sparepart_001',
      sku: 'SP-OIL-001',
      name: 'Oli Yamalube 10W-40 1L',
      category: 'Oil',
      brand: 'Yamalube',
      stock: 25,
      min_stock: 10,
      unit: 'liter',
      purchase_price: 50000,
      selling_price: 75000,
      status: 'available',
      created_at: new Date().toISOString()
    }
  },
  {
    key: 'sparepart_002',
    value: {
      id: 'sparepart_002',
      sku: 'SP-FILTER-001',
      name: 'Filter Oli Standard',
      category: 'Filter',
      brand: 'NGK',
      stock: 15,
      min_stock: 5,
      unit: 'pcs',
      purchase_price: 15000,
      selling_price: 25000,
      status: 'available',
      created_at: new Date().toISOString()
    }
  },
  {
    key: 'sparepart_003',
    value: {
      id: 'sparepart_003',
      sku: 'SP-SPARK-001',
      name: 'Busi NGK Iridium',
      category: 'Spark Plug',
      brand: 'NGK',
      stock: 30,
      min_stock: 10,
      unit: 'pcs',
      purchase_price: 25000,
      selling_price: 35000,
      status: 'available',
      created_at: new Date().toISOString()
    }
  }
];

const sampleTechnicians = [
  {
    key: 'technician_001',
    value: {
      id: 'technician_001',
      name: 'Andi Pratama',
      phone: '081298765432',
      specialization: 'Engine',
      rating: 4.8,
      total_jobs_completed: 156,
      active_jobs: 2,
      completed_jobs: 156,
      status: 'active',
      working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      working_hours: { start: '08:00', end: '17:00' },
      created_at: new Date().toISOString()
    }
  },
  {
    key: 'technician_002',
    value: {
      id: 'technician_002',
      name: 'Budi Santoso',
      phone: '081287654321',
      specialization: 'Electrical',
      rating: 4.9,
      total_jobs_completed: 98,
      active_jobs: 1,
      completed_jobs: 98,
      status: 'active',
      working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      working_hours: { start: '08:00', end: '17:00' },
      created_at: new Date().toISOString()
    }
  }
];

async function seedData() {
  console.log('\n🌱 Seeding sample data to Supabase...\n');

  try {
    // Seed customers
    console.log('📦 Seeding customers...');
    for (const customer of sampleCustomers) {
      const { error } = await supabase
        .from('kv_store_c1ef5280')
        .upsert({ key: customer.key, value: customer.value });
      
      if (error) throw error;
      console.log(`  ✅ ${customer.value.name}`);
    }

    // Seed vehicles
    console.log('\n🏍️  Seeding vehicles...');
    for (const vehicle of sampleVehicles) {
      const { error } = await supabase
        .from('kv_store_c1ef5280')
        .upsert({ key: vehicle.key, value: vehicle.value });
      
      if (error) throw error;
      console.log(`  ✅ ${vehicle.value.brand} ${vehicle.value.model} (${vehicle.value.plate_number})`);
    }

    // Seed spare parts
    console.log('\n🔧 Seeding spare parts...');
    for (const part of sampleSpareParts) {
      const { error } = await supabase
        .from('kv_store_c1ef5280')
        .upsert({ key: part.key, value: part.value });
      
      if (error) throw error;
      console.log(`  ✅ ${part.value.name}`);
    }

    // Seed technicians
    console.log('\n👨‍🔧 Seeding technicians...');
    for (const tech of sampleTechnicians) {
      const { error } = await supabase
        .from('kv_store_c1ef5280')
        .upsert({ key: tech.key, value: tech.value });
      
      if (error) throw error;
      console.log(`  ✅ ${tech.value.name} (${tech.value.specialization})`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Sample data seeded successfully!');
    console.log('🚀 You can now test the app with sample data\n');
    
  } catch (error) {
    console.error('\n❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

// Run seed
seedData();
