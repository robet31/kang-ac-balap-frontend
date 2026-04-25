/**
 * Utility script untuk populate data Inventory dan Technician
 * Gunakan script ini untuk menambahkan data dummy ke backend
 */

import { publicAnonKey, projectId } from './supabase/info';

/**
 * Data Inventory Dummy - UPDATED with consistent prices
 */
export const DUMMY_INVENTORY = [
  {
    sku: 'OLI-001',
    name: 'Oli Mesin SAE 10W-40',
    category: 'Oli & Pelumas',
    stock: 45,
    minStock: 20,
    price: 80000,
    unit: 'liter',
    supplier: 'PT Minyak Sejahtera',
    description: 'Oli mesin berkualitas tinggi untuk performa optimal',
  },
  {
    sku: 'OLI-002',
    name: 'Oli Mesin Fully Synthetic',
    category: 'Oli & Pelumas',
    stock: 30,
    minStock: 15,
    price: 85000,
    unit: 'liter',
    supplier: 'PT Minyak Sejahtera',
    description: 'Oli mesin fully synthetic untuk performa maksimal',
  },
  {
    sku: 'BPF-001',
    name: 'Busi Iridium',
    category: 'Busi & Pengapian',
    stock: 50,
    minStock: 20,
    price: 35000,
    unit: 'pcs',
    supplier: 'CV Busi Indonesia',
    description: 'Busi iridium untuk pembakaran optimal',
  },
  {
    sku: 'FLT-001',
    name: 'Filter Udara',
    category: 'Filter',
    stock: 40,
    minStock: 15,
    price: 25000,
    unit: 'pcs',
    supplier: 'CV Filter Indonesia',
    description: 'Filter udara untuk berbagai tipe motor',
  },
  {
    sku: 'FLT-002',
    name: 'Filter Oli',
    category: 'Filter',
    stock: 35,
    minStock: 15,
    price: 30000,
    unit: 'pcs',
    supplier: 'CV Filter Indonesia',
    description: 'Filter oli berkualitas',
  },
  {
    sku: 'PAD-001',
    name: 'Kampas Rem Depan',
    category: 'Rem',
    stock: 25,
    minStock: 10,
    price: 40000,
    unit: 'set',
    supplier: 'PT Spare Part Motor',
    description: 'Kampas rem depan berkualitas',
  },
  {
    sku: 'BAN-001',
    name: 'Ban Luar 80/90-14 Tubeless',
    category: 'Ban',
    stock: 12,
    minStock: 8,
    price: 350000,
    unit: 'pcs',
    supplier: 'PT Ban Motor',
    description: 'Ban tubeless berkualitas',
  },
  {
    sku: 'BAN-002',
    name: 'Ban Dalam 80/90-14',
    category: 'Ban',
    stock: 15,
    minStock: 8,
    price: 45000,
    unit: 'pcs',
    supplier: 'PT Ban Motor',
    description: 'Ban dalam standar',
  },
  {
    sku: 'AKI-001',
    name: 'Aki Motor 12V 5Ah',
    category: 'Aki',
    stock: 6,
    minStock: 5,
    price: 275000,
    unit: 'pcs',
    supplier: 'CV Aki Jaya',
    description: 'Aki kering maintenance free',
  },
  {
    sku: 'AKI-002',
    name: 'Aki Motor 12V 7Ah',
    category: 'Aki',
    stock: 4,
    minStock: 3,
    price: 325000,
    unit: 'pcs',
    supplier: 'CV Aki Jaya',
    description: 'Aki kering kapasitas besar',
  },
  {
    sku: 'RANTAI-001',
    name: 'Rantai Drive Chain 428',
    category: 'Rantai & Gir',
    stock: 10,
    minStock: 5,
    price: 185000,
    unit: 'pcs',
    supplier: 'CV Transmisi Jaya',
    description: 'Rantai berkualitas tinggi',
  },
  {
    sku: 'GIR-001',
    name: 'Gir Set Depan-Belakang',
    category: 'Rantai & Gir',
    stock: 8,
    minStock: 5,
    price: 225000,
    unit: 'set',
    supplier: 'CV Transmisi Jaya',
    description: 'Gir set lengkap',
  },
  {
    sku: 'LAMPU-001',
    name: 'Lampu LED Headlight',
    category: 'Lampu',
    stock: 14,
    minStock: 8,
    price: 165000,
    unit: 'pcs',
    supplier: 'PT Cahaya Motor',
    description: 'Lampu LED terang dan hemat energi',
  }
];

/**
 * Data Technician Dummy
 */
export const DUMMY_TECHNICIANS = [
  {
    id: 'tech_1',
    name: 'Ari Wijaya',
    phone: '081234567890',
    specialization: 'Engine & Tune-Up',
    status: 'active',
    notes: 'Teknisi senior dengan pengalaman 8 tahun di bidang engine dan tune-up',
    activeJobs: 0,
    completedJobs: 156,
    rating: 4.9,
  },
  {
    id: 'tech_2',
    name: 'Dedi Susanto',
    phone: '081234567891',
    specialization: 'Electrical & CVT',
    status: 'active',
    notes: 'Spesialis kelistrikan motor dan sistem CVT',
    activeJobs: 0,
    completedJobs: 142,
    rating: 4.8,
  },
  {
    id: 'tech_3',
    name: 'Farhan Ahmad',
    phone: '081234567892',
    specialization: 'Body & Painting',
    status: 'active',
    notes: 'Ahli body repair dan pengecatan motor',
    activeJobs: 0,
    completedJobs: 98,
    rating: 4.7,
  },
  {
    id: 'tech_4',
    name: 'Budi Hartono',
    phone: '081234567893',
    specialization: 'Suspension & Brake',
    status: 'active',
    notes: 'Spesialis sistem suspensi dan rem',
    activeJobs: 0,
    completedJobs: 89,
    rating: 4.6,
  },
  {
    id: 'tech_5',
    name: 'Cahya Pratama',
    phone: '081234567894',
    specialization: 'Transmission',
    status: 'active',
    notes: 'Ahli sistem transmisi manual dan otomatis',
    activeJobs: 0,
    completedJobs: 67,
    rating: 4.5,
  }
];

/**
 * Function untuk populate inventory ke backend
 */
export async function populateInventory(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    console.log('🔄 Starting inventory population...');
    let successCount = 0;

    for (const item of DUMMY_INVENTORY) {
      const payload = {
        ...item,
        updatedAt: new Date().toISOString()
      };

      // FIXED: Use 'inventory:' prefix instead of 'inventory_'
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/inventory`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        successCount++;
        console.log(`✅ Saved: ${item.name}`);
      } else {
        const errorData = await response.text();
        console.error(`❌ Failed to save: ${item.name}`, errorData);
      }
    }

    return {
      success: true,
      message: `Successfully populated ${successCount} inventory items`,
      count: successCount
    };
  } catch (error: any) {
    console.error('❌ Error populating inventory:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Function untuk populate technicians ke backend
 */
export async function populateTechnicians(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    console.log('🔄 Starting technicians population...');
    let successCount = 0;

    for (const tech of DUMMY_TECHNICIANS) {
      const payload = {
        ...tech,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/set/technician_${tech.id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        successCount++;
        console.log(`✅ Saved: ${tech.name}`);
      } else {
        console.error(`❌ Failed to save: ${tech.name}`);
      }
    }

    return {
      success: true,
      message: `Successfully populated ${successCount} technicians`,
      count: successCount
    };
  } catch (error: any) {
    console.error('❌ Error populating technicians:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Function untuk populate semua data sekaligus
 */
export async function populateAllData(): Promise<{
  inventory: { success: boolean; message: string; count?: number };
  technicians: { success: boolean; message: string; count?: number };
}> {
  console.log('🚀 Starting full data population...');
  
  const inventoryResult = await populateInventory();
  const techniciansResult = await populateTechnicians();

  console.log('✅ Population complete!');
  console.log('📊 Results:', {
    inventory: inventoryResult,
    technicians: techniciansResult
  });

  return {
    inventory: inventoryResult,
    technicians: techniciansResult
  };
}