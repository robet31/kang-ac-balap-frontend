import { createClient } from './supabase/client';

/**
 * Supabase Database API Helper
 * 
 * This file contains helper functions for interacting with Supabase tables directly
 * Use these instead of KV store for production-ready apps
 */

// Get singleton Supabase client - reuse the same instance
const getSupabase = () => createClient();

// ========================================
// JOB ORDERS
// ========================================

export const jobOrdersApi = {
  /**
   * Get all job orders with related data
   */
  async getAll() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('job_orders')
      .select(`
        *,
        customer:profiles!customer_id(id, full_name, phone),
        technician:profiles!assigned_technician_id(id, full_name),
        vehicle:vehicles(id, plate_number, brand, model),
        service:services(id, name, base_price)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching job orders:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get job orders by customer ID
   */
  async getByCustomer(customerId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('job_orders')
      .select(`
        *,
        vehicle:vehicles(plate_number, brand, model),
        service:services(name),
        technician:profiles!assigned_technician_id(full_name)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get job orders by technician ID
   */
  async getByTechnician(technicianId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('job_orders')
      .select(`
        *,
        customer:profiles!customer_id(full_name, phone),
        vehicle:vehicles(plate_number, brand, model),
        service:services(name)
      `)
      .eq('assigned_technician_id', technicianId)
      .in('status', ['scheduled', 'in_progress'])
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Create new job order
   */
  async create(jobData: any) {
    const supabase = getSupabase();
    
    // Generate job number
    const jobNumber = `JO-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('job_orders')
      .insert({
        job_number: jobNumber,
        ...jobData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update job order status
   */
  async updateStatus(jobId: string, status: string, updates: any = {}) {
    const supabase = getSupabase();
    
    const updateData: any = {
      status,
      ...updates,
    };

    // Auto-set timestamps based on status
    if (status === 'in_progress' && !updates.started_at) {
      updateData.started_at = new Date().toISOString();
    }
    
    if (status === 'completed' && !updates.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('job_orders')
      .update(updateData)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ========================================
// VEHICLES
// ========================================

export const vehiclesApi = {
  async getByCustomer(customerId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(vehicleData: any) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getServiceHistory(vehicleId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('job_orders')
      .select(`
        *,
        service:services(name),
        technician:profiles!assigned_technician_id(full_name)
      `)
      .eq('vehicle_id', vehicleId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// ========================================
// INVENTORY
// ========================================

export const inventoryApi = {
  async getAll() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('is_active', true)
      .order('part_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getLowStock() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('is_active', true)
      .filter('quantity_in_stock', 'lte', 'minimum_stock_level')
      .order('quantity_in_stock', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateStock(itemId: string, newQuantity: number) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('inventory')
      .update({ quantity_in_stock: newQuantity })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ========================================
// JOB PARTS
// ========================================

export const jobPartsApi = {
  async getByJob(jobOrderId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('job_parts')
      .select(`
        *,
        part:inventory(part_sku, part_name, selling_price)
      `)
      .eq('job_order_id', jobOrderId);

    if (error) throw error;
    return data;
  },

  async addPart(jobOrderId: string, inventoryId: string, quantity: number) {
    const supabase = getSupabase();
    
    // Get current selling price
    const { data: inventory } = await supabase
      .from('inventory')
      .select('selling_price')
      .eq('id', inventoryId)
      .single();

    if (!inventory) throw new Error('Inventory item not found');

    const { data, error } = await supabase
      .from('job_parts')
      .insert({
        job_order_id: jobOrderId,
        inventory_id: inventoryId,
        quantity_used: quantity,
        unit_price_at_time: inventory.selling_price,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ========================================
// JOB UPDATES (Timeline)
// ========================================

export const jobUpdatesApi = {
  async getByJob(jobOrderId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('job_updates')
      .select(`
        *,
        user:profiles(full_name, role)
      `)
      .eq('job_order_id', jobOrderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addUpdate(jobOrderId: string, userId: string, updateType: string, content: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('job_updates')
      .insert({
        job_order_id: jobOrderId,
        user_id: userId,
        update_type: updateType,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ========================================
// SERVICES
// ========================================

export const servicesApi = {
  async getAll() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('base_price', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// ========================================
// KPI & ANALYTICS
// ========================================

export const kpiApi = {
  async getDashboardKPIs() {
    const supabase = getSupabase();
    const today = new Date().toISOString().split('T')[0];

    // Get active jobs
    const { count: activeJobs } = await supabase
      .from('job_orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['scheduled', 'in_progress']);

    // Get completed today
    const { count: completedToday } = await supabase
      .from('job_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('completed_at', `${today}T00:00:00`)
      .lte('completed_at', `${today}T23:59:59`);

    // Get pending payment
    const { count: pendingPayment } = await supabase
      .from('job_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'awaiting_payment');

    // Get today's revenue
    const { data: completedJobs } = await supabase
      .from('job_orders')
      .select('total_amount')
      .eq('status', 'completed')
      .eq('payment_status', 'paid')
      .gte('completed_at', `${today}T00:00:00`)
      .lte('completed_at', `${today}T23:59:59`);

    const todayRevenue = completedJobs?.reduce((sum, job) => sum + Number(job.total_amount || 0), 0) || 0;

    // Get low stock count
    const { count: lowStockItems } = await supabase
      .from('inventory')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .filter('quantity_in_stock', 'lte', 'minimum_stock_level');

    return {
      activeJobs: activeJobs || 0,
      completedToday: completedToday || 0,
      pendingPayment: pendingPayment || 0,
      todayRevenue,
      lowStockItems: lowStockItems || 0,
      todayTarget: 5000000, // This could be fetched from settings table
    };
  },
};

// ========================================
// REALTIME SUBSCRIPTIONS
// ========================================

export const realtimeApi = {
  /**
   * Subscribe to job order changes
   */
  subscribeToJobOrders(callback: (payload: any) => void) {
    const supabase = getSupabase();
    
    const subscription = supabase
      .channel('job_orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_orders',
        },
        callback
      )
      .subscribe();

    return subscription;
  },

  /**
   * Subscribe to specific job updates
   */
  subscribeToJob(jobId: string, callback: (payload: any) => void) {
    const supabase = getSupabase();
    
    const subscription = supabase
      .channel(`job_${jobId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_orders',
          filter: `id=eq.${jobId}`,
        },
        callback
      )
      .subscribe();

    return subscription;
  },

  /**
   * Unsubscribe from channel
   */
  unsubscribe(subscription: any) {
    subscription.unsubscribe();
  },
};

// ========================================
// EXAMPLE USAGE
// ========================================

/*
// In your React component:

import { useEffect, useState } from 'react';
import { jobOrdersApi, realtimeApi } from './utils/supabase-api';

function CustomerDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch initial data
    async function fetchJobs() {
      const data = await jobOrdersApi.getByCustomer(customerId);
      setJobs(data);
    }
    fetchJobs();

    // Subscribe to real-time updates
    const subscription = realtimeApi.subscribeToJobOrders((payload) => {
      console.log('Job order changed:', payload);
      // Refresh data
      fetchJobs();
    });

    // Cleanup
    return () => {
      realtimeApi.unsubscribe(subscription);
    };
  }, [customerId]);

  return (
    // Your component JSX
  );
}
*/