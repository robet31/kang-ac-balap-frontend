import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';

export interface Job {
  id: string;
  user_id: string;
  vehicle_id: string;
  job_number: string;
  service_type: string;
  description: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'awaiting_payment' | 'completed' | 'cancelled';
  scheduled_date?: string;
  completed_date?: string;
  amount: number;
  progress?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

interface UseRealtimeJobsOptions {
  userId?: string;
  status?: string;
  autoRefresh?: boolean;
}

export function useRealtimeJobs(options: UseRealtimeJobsOptions = {}) {
  const { userId, status, autoRefresh = true } = options;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async () => {
    try {
      const supabase = createClient();
      let query = supabase
        .from('job_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      console.log('✅ Jobs fetched:', data?.length || 0, 'jobs');
      setJobs(data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching jobs:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchJobs();

    if (!autoRefresh) return;

    // Setup real-time subscription
    const supabase = createClient();
    
    console.log('🔌 Setting up real-time subscription for jobs...');
    
    let channel = supabase
      .channel('jobs-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_orders',
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        (payload) => {
          console.log('🔔 Real-time update received:', payload);

          if (payload.eventType === 'INSERT') {
            console.log('➕ New job created:', payload.new);
            setJobs((prev) => [payload.new as Job, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            console.log('✏️ Job updated:', payload.new);
            setJobs((prev) =>
              prev.map((job) =>
                job.id === (payload.new as Job).id ? (payload.new as Job) : job
              )
            );
          } else if (payload.eventType === 'DELETE') {
            console.log('🗑️ Job deleted:', payload.old);
            setJobs((prev) => prev.filter((job) => job.id !== (payload.old as Job).id));
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
      });

    // Cleanup
    return () => {
      console.log('🔌 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, status, autoRefresh]);

  return { jobs, loading, error, refetch: fetchJobs };
}