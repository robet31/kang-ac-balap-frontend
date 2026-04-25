import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { createClient, supabaseUrl } from '../utils/supabase/client';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: 'customer' | 'technician' | 'admin';
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to check if error is AbortError
const isAbortError = (error: any): boolean => {
  return error?.name === 'AbortError' || 
         error?.message?.includes('AbortError') ||
         error?.message?.includes('aborted') ||
         error?.message?.includes('signal is aborted');
};

// Singleton supabase client - initialized once at module level
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const mountedRef = useRef(true);
  const initStartedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    if (!mountedRef.current) return null;
    
    try {
      console.log('🔍 Fetching profile for user ID:', userId);
      const supabase = getSupabaseClient();
      
      // ✅ SIMPLIFIED: Remove aggressive timeout, let Supabase handle it
      // The 8s timeout was causing AbortErrors unnecessarily
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!mountedRef.current) return null;

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found - try to create it
          console.warn('⚠️ Profile not found, attempting to create...');
          
          // Get user data to extract metadata
          const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !userData) {
            console.error('❌ Cannot get user data:', userError);
            return null;
          }
          
          // Determine role from email or metadata
          let role: 'customer' | 'admin' = 'customer';
          if (userData.email?.includes('admin')) {
            role = 'admin';
          } else if (userData.user_metadata?.role) {
            role = userData.user_metadata.role;
          }
          
          const fullName = userData.user_metadata?.full_name || 
                          userData.email?.split('@')[0] || 
                          'User';
          
          console.log('🔨 Creating profile:', { userId, fullName, role });
          
          // Create profile
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: fullName,
              role: role,
              phone: null,
              avatar_url: null
            })
            .select()
            .single();
          
          if (createError) {
            console.error('❌ Error creating profile:', createError);
            return null;
          }
          
          console.log('✅ Profile created successfully:', newProfile);
          return newProfile as Profile;
        }
        
        if (!isAbortError(error)) {
          console.error('❌ Error fetching profile:', error);
        }
        return null;
      }

      console.log('✅ Profile fetched successfully:', data);
      return data as Profile;
    } catch (error: any) {
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        console.warn('⚠️ Profile fetch timeout - Supabase may be slow');
        return null;
      }
      
      if (error?.message?.includes('Failed to fetch')) {
        console.error('❌ Network error - Cannot reach Supabase. Check connection.');
        return null;
      }
      
      if (!isAbortError(error)) {
        console.error('❌ Error in fetchProfile:', error);
      }
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user && mountedRef.current) {
      const profileData = await fetchProfile(user.id);
      if (mountedRef.current && profileData) {
        setProfile(profileData);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    // Prevent double initialization in strict mode
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    const initializeAuth = async () => {
      try {
        const supabase = getSupabaseClient();
        
        console.log('🚀 AuthContext: Starting initialization...');
        
        // ✅ REDUCED: Timeout from 10s to 15s to give more time for slow connections
        // This prevents premature timeout warnings
        const timeoutId = setTimeout(() => {
          if (mountedRef.current && loading) {
            console.warn('⚠️ AuthContext: Initialization timeout after 15s');
            console.warn('⚠️ This may indicate slow network or Supabase connection issues');
            setLoading(false);
          }
        }, 15000);
        
        // Get current session with error handling
        let currentSession = null;
        try {
          const { data: { session: fetchedSession }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            if (!isAbortError(sessionError)) {
              console.error('❌ Session error:', sessionError);
            }
          } else {
            currentSession = fetchedSession;
          }
        } catch (sessionErr) {
          if (!isAbortError(sessionErr)) {
            console.error('❌ Session fetch exception:', sessionErr);
          }
        }

        if (!mountedRef.current) {
          clearTimeout(timeoutId);
          return;
        }

        console.log('📊 Session status:', currentSession ? 'Active' : 'No session');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('👤 User found, fetching profile...');
          const profileData = await fetchProfile(currentSession.user.id);
          if (mountedRef.current && profileData) {
            console.log('✅ Profile loaded:', profileData);
            setProfile(profileData);
          } else {
            console.warn('⚠️ Profile not found for user:', currentSession.user.id);
          }
        }

        // Setup auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mountedRef.current) return;

          console.log('🔄 Auth state changed:', event);
          
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            const profileData = await fetchProfile(newSession.user.id);
            if (mountedRef.current && profileData) {
              setProfile(profileData);
            }
          } else {
            if (mountedRef.current) {
              setProfile(null);
            }
          }
        });

        subscriptionRef.current = subscription;
        
        // Clear timeout since we're done
        clearTimeout(timeoutId);

      } catch (error) {
        if (!isAbortError(error)) {
          console.error('❌ Auth initialization error:', error);
        }
      } finally {
        if (mountedRef.current) {
          console.log('✅ AuthContext: Initialization complete, setting loading=false');
          setLoading(false);
        }
      }
    };

    // Initialize immediately - no artificial delays
    initializeAuth();

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch (error) {
          // Silent cleanup
        }
      }
    };
  }, []); // Empty deps - run once only

  const signUp = async (email: string, password: string, fullName: string, role: string = 'customer') => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error && !isAbortError(error)) {
        console.error('Sign up error:', error);
        toast.error('Sign up error: ' + error.message);
        return { error };
      }

      return { error: null };
    } catch (error) {
      if (!isAbortError(error)) {
        console.error('Sign up exception:', error);
        toast.error('Sign up exception: ' + error.message);
      }
      return { error };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    try {
      const supabase = getSupabaseClient();
      
      console.log('🔐 Attempting sign in for:', email);
      console.log('🔗 Supabase URL:', `https://${supabaseUrl}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        return { error };
      }

      console.log('✅ Sign in successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('💥 Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      if (mountedRef.current) {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
    } catch (error) {
      if (!isAbortError(error)) {
        console.error('Sign out error:', error);
        toast.error('Sign out error: ' + error.message);
      }
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}