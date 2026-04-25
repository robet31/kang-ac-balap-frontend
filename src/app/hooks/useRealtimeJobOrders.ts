import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

export interface JobOrder {
  id: string;
  job_number: string;
  user_id: string;
  vehicle_id: string | null;
  service_type: string;
  package_name?: string;
  customer_name?: string;
  description: string | null;
  status: 'pending' | 'scheduled' | 'in_progress' | 'awaiting_payment' | 'completed' | 'cancelled';
  scheduled_date: string | null;
  completed_date: string | null;
  amount: number;
  progress: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicles?: {
    id: string;
    plate_number: string;
    brand: string;
    model: string;
    year: number;
    notes: string | null;
    customer_id: string;
    created_at: string;
    updated_at: string;
  } | null;
}

/**
 * Hook untuk fetch dan subscribe real-time job orders dari Supabase
 * Untuk digunakan di Admin Dashboard
 */
export function useRealtimeJobOrders() {
  const [jobs, setJobs] = useState<JobOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Create client instance once when hook initializes
  const [supabase] = useState(() => createClient());

  // Fetch initial data
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Add retry logic with exponential backoff
      let retries = 3;
      let delay = 1000; // Start with 1 second
      let lastError: any = null;

      while (retries > 0) {
        try {
          // ✅ REMOVED: vehicles(*) join - no FK relationship exists
          // Vehicle info is stored in vehicle_info column and notes field
          const { data, error: fetchError } = await supabase
            .from('job_orders')
            .select('*')
            .order('created_at', { ascending: false });

          if (fetchError) {
            // Silent error for "not found" cases - these are normal when jobs are deleted
            if (fetchError.message?.includes('not found')) {
              console.log('ℹ️ Some jobs not found (already deleted)');
              setJobs([]);
              return;
            }
            
            throw fetchError;
          }

          console.log('✅ Fetched jobs from database:', data?.length || 0);
          setJobs(data || []);
          return; // Success, exit
        } catch (err: any) {
          lastError = err;
          retries--;
          
          console.log(`⚠️ Fetch error:`, {
            message: err.message,
            name: err.name,
            code: err.code,
            hint: err.hint,
            details: err.details,
            retriesLeft: retries,
            stack: err.stack?.split('\n').slice(0, 3).join('\n')
          });
          
          // If it's a network error (Failed to fetch, CORS, etc), don't retry as aggressively
          if (err.message?.includes('Failed to fetch') || err.name === 'TypeError') {
            console.error('❌ Network error detected - this may be a CORS or connectivity issue');
            // Set empty array to prevent crash
            setJobs([]);
            setLoading(false);
            return;
          }
          
          if (retries > 0) {
            console.log(`🔄 Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
          }
        }
      }
      
      // All retries failed
      console.error('❌ Error fetching jobs:', lastError);
      
      // Check if it's a table not found error
      const isTableError = lastError?.message?.includes('relation') || 
                          lastError?.message?.includes('does not exist') ||
                          lastError?.code === 'PGRST116' ||
                          lastError?.code === '42P01';
      
      if (isTableError) {
        setError('Table "job_orders" tidak ditemukan di database. Silakan setup tabel terlebih dahulu.');
        toast.error('❌ Database belum di-setup', {
          description: 'Tabel job_orders belum ada. Silakan buat tabel di Supabase Dashboard.',
          duration: 10000
        });
      } else {
        setError('Failed to fetch job orders. Please refresh the page.');
        toast.error('❌ Gagal memuat data', {
          description: 'Silakan refresh halaman atau cek koneksi internet Anda'
        });
      }
    } catch (err: any) {
      console.error('❌ Error in fetchJobs:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    // Initial fetch
    fetchJobs();

    // Subscribe to real-time changes
    console.log('🔌 Setting up real-time subscription for job_orders');
    
    const channel = supabase
      .channel('admin-job-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'job_orders'
        },
        (payload) => {
          console.log('🔔 Real-time update received:', payload);

          if (payload.eventType === 'INSERT') {
            // New job created - refetch to get complete data with joins
            console.log('📥 New job inserted, refetching...');
            fetchJobs();
            toast.success('🆕 Booking baru masuk!', {
              description: 'Job orders telah diupdate'
            });
          } else if (payload.eventType === 'UPDATE') {
            // Job updated
            console.log('✏️ Job updated, refetching...');
            fetchJobs();
          } else if (payload.eventType === 'DELETE') {
            // Job deleted
            console.log('🗑️ Job deleted, refetching...');
            fetchJobs();
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error - retrying with polling fallback');
          // Don't show toast error, just log it
          // Instead, fallback to polling mode
          const pollInterval = setInterval(() => {
            console.log('🔄 Polling for updates (subscription failed)...');
            fetchJobs();
          }, 5000); // Poll every 5 seconds
          
          // Store interval ID for cleanup
          (channel as any).pollInterval = pollInterval;
        } else if (status === 'TIMED_OUT') {
          console.warn('⏱️ Real-time subscription timed out - retrying...');
        } else if (status === 'CLOSED') {
          console.log('🔌 Real-time subscription closed');
        }
      });

    // ✅ ADD: Polling as backup (every 5 seconds for faster updates)
    console.log('⏰ Setting up polling interval for job orders (5s)...');
    const pollingInterval = setInterval(() => {
      console.log('⏰ Polling job orders...');
      fetchJobs();
    }, 5000); // Poll every 5 seconds for faster updates

    // Cleanup subscription on unmount
    return () => {
      console.log('🔌 Cleaning up real-time subscription');
      // Clear polling interval if exists
      if ((channel as any).pollInterval) {
        clearInterval((channel as any).pollInterval);
      }
      // Clear main polling interval
      clearInterval(pollingInterval);
      channel.unsubscribe();
    };
  }, []); // ✅ Empty deps - only run once on mount

  // Helper function to manually refresh jobs
  const refreshJobs = () => {
    console.log('🔄 Manual refresh triggered');
    fetchJobs();
  };

  return {
    jobs,
    loading,
    error,
    refreshJobs
  };
}