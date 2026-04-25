import { projectId, publicAnonKey } from './supabase/info';

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch all inventory items from KV Store
 * Data is permanent and synchronized across all components
 */
export async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/prefix/inventory_`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch inventory:', response.statusText);
      return [];
    }

    const result = await response.json();
    console.log('📦 Inventory loaded:', result.data?.length || 0, 'items');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}

/**
 * Check if inventory data has been seeded
 */
export function isInventorySeeded(): boolean {
  return localStorage.getItem('sunest_inventory_seeded') === 'true';
}

/**
 * Get inventory item by SKU
 */
export async function getInventoryBySku(sku: string): Promise<InventoryItem | null> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/get/inventory_${sku}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error(`Error fetching inventory for SKU ${sku}:`, error);
    return null;
  }
}

/**
 * Update inventory stock
 */
export async function updateInventoryStock(sku: string, newStock: number): Promise<boolean> {
  try {
    // First get current data
    const currentItem = await getInventoryBySku(sku);
    if (!currentItem) {
      console.error(`Inventory item ${sku} not found`);
      return false;
    }

    // Update with new stock
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/set/inventory_${sku}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...currentItem,
          stock: newStock,
          updatedAt: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      console.error(`Failed to update inventory ${sku}:`, response.statusText);
      return false;
    }

    console.log(`✅ Updated inventory ${sku} stock to ${newStock}`);
    return true;
  } catch (error) {
    console.error(`Error updating inventory ${sku}:`, error);
    return false;
  }
}