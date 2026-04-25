import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// True singleton instance
let supabaseInstance: SupabaseClient | null = null;
let initializationPromise: Promise<SupabaseClient> | null = null;

// Store the URL for debugging
export const supabaseUrl = `https://${projectId}.supabase.co`;

export function createClient(): SupabaseClient {
  // Return existing instance immediately if already created
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // If initialization is in progress, return a promise (though we make it sync)
  if (initializationPromise) {
    throw new Error('Supabase client is being initialized');
  }

  console.log('🔧 Creating Supabase client...');
  console.log('🔗 Supabase URL:', supabaseUrl);
  console.log('🔑 Anon Key:', publicAnonKey ? `${publicAnonKey.substring(0, 20)}...` : 'MISSING');
  
  // Create client with optimized settings to prevent AbortError
  supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
      storageKey: 'sunest-auto-auth-v1',
    },
    global: {
      headers: {
        'X-Client-Info': 'sunest-auto@1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  console.log('✅ Supabase client created successfully');
  return supabaseInstance;
}

// Get existing instance without creating new one
export function getClient(): SupabaseClient | null {
  return supabaseInstance;
}

// Reset instance (for testing or hot reload)
export function resetClient() {
  if (supabaseInstance) {
    // Clean up existing instance
    try {
      // Supabase doesn't have a formal cleanup method, but we can nullify
      supabaseInstance = null;
    } catch (error) {
      // Silent cleanup
    }
  }
  initializationPromise = null;
}