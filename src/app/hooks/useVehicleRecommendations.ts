import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { publicAnonKey, projectId } from '../utils/supabase/info';

// Service intervals based on package type (in days)
const serviceIntervals: Record<string, { days: number; description: string }> = {
  'Hemat Service': { 
    days: 30, 
    description: 'Service rutin setiap bulan untuk menjaga performa motor' 
  },
  'Basic Tune-Up': { 
    days: 60, 
    description: 'Tune-up rutin setiap 2 bulan untuk performa optimal' 
  },
  'Standard Service': { 
    days: 90, 
    description: 'Service berkala setiap 3 bulan sesuai rekomendasi pabrikan' 
  },
  'Premium Service': { 
    days: 180, 
    description: 'Service lengkap setiap 6 bulan untuk perawatan maksimal' 
  }
};

// Recommended next package based on last service
const getNextRecommendation = (lastService: string): { package: string; reason: string } => {
  const recommendations: Record<string, { package: string; reason: string }> = {
    'Hemat Service': {
      package: 'Hemat Service',
      reason: 'Lanjutkan perawatan rutin dengan paket yang sama'
    },
    'Basic Tune-Up': {
      package: 'Basic Tune-Up',
      reason: 'Pertahankan kondisi motor dengan tune-up berkala'
    },
    'Standard Service': {
      package: 'Standard Service',
      reason: 'Ikuti jadwal service berkala untuk performa terbaik'
    },
    'Premium Service': {
      package: 'Premium Service',
      reason: 'Perawatan premium untuk motor kesayangan Anda'
    }
  };

  return recommendations[lastService] || {
    package: 'Standard Service',
    reason: 'Paket standar untuk perawatan berkala'
  };
};

export function useVehicleRecommendations(vehicles: any[]) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [autoRecommendationEnabled, setAutoRecommendationEnabled] = useState(false);

  // Fetch auto recommendation setting
  const fetchAutoRecommendationSetting = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/get/settings_auto_recommendation`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAutoRecommendationEnabled(data.data?.enabled || false);
      }
    } catch (error) {
      console.error('Error fetching auto recommendation setting:', error);
      setAutoRecommendationEnabled(false);
    }
  };

  // Fetch bookings and generate recommendations
  const fetchRecommendations = async () => {
    if (!user?.id || vehicles.length === 0 || !autoRecommendationEnabled) {
      setRecommendations([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/customer/${user.id}`,
        {
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }
      
      // Filter only completed bookings
      const allCompleted = (data.data || []).filter((booking: any) => 
        booking.status === 'completed'
      );
      
      // Generate recommendations for each vehicle that has completed service
      const recs: any[] = [];
      
      for (const vehicle of vehicles) {
        // Find completed bookings for this vehicle
        const vehicleBookings = allCompleted.filter((booking: any) => {
          const plateFromVehicles = booking.vehicles?.plate_number;
          const vehicleIdMatch = booking.vehicle_id === vehicle.id;
          const plateFromNotes = booking.notes?.match(/🏍️ Kendaraan: ([^\s\n]+)/)?.[1];
          const plateInNotes = booking.notes?.includes(vehicle.plate_number);
          
          return plateFromVehicles === vehicle.plate_number || 
                 vehicleIdMatch || 
                 plateFromNotes === vehicle.plate_number ||
                 plateInNotes;
        });
        
        if (vehicleBookings.length === 0) continue;
        
        // Get most recent service
        const sorted = vehicleBookings.sort((a: any, b: any) => 
          new Date(b.updated_at || b.created_at).getTime() - 
          new Date(a.updated_at || a.created_at).getTime()
        );
        
        const lastService = sorted[0];
        const serviceType = lastService.service_type;
        const interval = serviceIntervals[serviceType];
        
        if (!interval) continue;
        
        const now = new Date();
        const lastServiceDate = new Date(lastService.updated_at || lastService.created_at);
        const nextServiceDate = new Date(lastServiceDate);
        nextServiceDate.setDate(nextServiceDate.getDate() + interval.days);
        
        const daysUntil = Math.ceil((nextServiceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntil < 0;
        const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
        
        const vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
        const nextRec = getNextRecommendation(serviceType);
        
        recs.push({
          vehicleId: vehicle.id,
          vehicleInfo,
          plateNumber: vehicle.plate_number,
          lastServiceType: serviceType,
          lastServiceDate: lastServiceDate,
          nextServiceDate: nextServiceDate,
          daysUntil,
          isOverdue,
          isUpcoming,
          recommendedPackage: nextRec.package,
          reason: nextRec.reason,
          intervalDescription: interval.description
        });
      }
      
      // Sort: overdue first, then upcoming, then by days until
      recs.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        if (a.isUpcoming && !b.isUpcoming) return -1;
        if (!a.isUpcoming && b.isUpcoming) return 1;
        return a.daysUntil - b.daysUntil;
      });
      
      setRecommendations(recs);
    } catch (error: any) {
      console.error('❌ Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAutoRecommendationSetting();
  }, []);

  // Fetch when setting changes or vehicles change
  useEffect(() => {
    if (autoRecommendationEnabled) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [autoRecommendationEnabled, vehicles, user]);

  // Poll for updates every 10 seconds
  useEffect(() => {
    if (!autoRecommendationEnabled) return;
    
    const interval = setInterval(() => {
      fetchAutoRecommendationSetting();
      fetchRecommendations();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [autoRecommendationEnabled, vehicles, user]);

  return { 
    recommendations, 
    loading, 
    enabled: autoRecommendationEnabled 
  };
}
