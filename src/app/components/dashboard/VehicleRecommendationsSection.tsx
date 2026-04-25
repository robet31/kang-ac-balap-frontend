import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Car,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { publicAnonKey, projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';
import { motion } from 'motion/react';

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

interface VehicleRecommendationsSectionProps {
  vehicles: any[];
  onNavigate: (tab: string) => void;
}

// Hook to get recommendations data
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

  if (!autoRecommendationEnabled || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-t-xl px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Rekomendasi Service Berikutnya</h3>
            <p className="text-orange-100 text-sm">Jangan sampai telat service ya!</p>
          </div>
        </div>
      </div>

      {/* Recommendations Grid with Bento Layout */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-b-xl border-2 border-orange-300 border-t-0 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.vehicleId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${
                  // Bento Layout: First overdue/upcoming item spans 2 columns on large screens
                  (rec.isOverdue || rec.isUpcoming) && index === 0
                    ? 'lg:col-span-2'
                    : ''
                }`}
              >
                <Card className={`h-full border-2 ${
                  rec.isOverdue 
                    ? 'bg-red-50 border-red-300 shadow-red-200 shadow-lg' 
                    : rec.isUpcoming 
                    ? 'bg-yellow-50 border-yellow-300 shadow-yellow-200 shadow-lg' 
                    : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          rec.isOverdue 
                            ? 'bg-red-500' 
                            : rec.isUpcoming 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                        }`}>
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{rec.vehicleInfo}</h4>
                          {rec.plateNumber !== 'default' && (
                            <p className="text-sm text-gray-600 font-mono">{rec.plateNumber}</p>
                          )}
                        </div>
                      </div>
                      
                      {rec.isOverdue && (
                        <Badge className="bg-red-500 text-white animate-pulse border-0">
                          🔴 TELAT
                        </Badge>
                      )}
                      {rec.isUpcoming && (
                        <Badge className="bg-yellow-500 text-white animate-pulse border-0">
                          ⚠️ SEGERA
                        </Badge>
                      )}
                    </div>

                    {/* Service Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 font-medium">Service Terakhir</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-900 text-sm">{rec.lastServiceType}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {rec.lastServiceDate.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 font-medium">Service Berikutnya</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-900 text-sm">
                            {rec.nextServiceDate.toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className={`text-xs font-semibold ${
                          rec.isOverdue 
                            ? 'text-red-600' 
                            : rec.isUpcoming 
                            ? 'text-yellow-600' 
                            : 'text-gray-600'
                        }`}>
                          {rec.isOverdue 
                            ? `Telat ${Math.abs(rec.daysUntil)} hari!` 
                            : rec.isUpcoming 
                            ? `${rec.daysUntil} hari lagi!` 
                            : `${rec.daysUntil} hari lagi`
                          }
                        </p>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm mb-1">
                            Paket Rekomendasi: {rec.recommendedPackage}
                          </p>
                          <p className="text-xs text-gray-700">{rec.reason}</p>
                          <p className="text-xs text-gray-600 mt-1 italic">{rec.intervalDescription}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      className={`w-full h-11 text-sm font-semibold ${
                        rec.isOverdue || rec.isUpcoming
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                      } text-white`}
                      onClick={() => {
                        onNavigate('booking');
                        toast.success('Silakan pilih paket service yang sesuai!');
                      }}
                    >
                      {rec.isOverdue ? '🚨 Booking Sekarang!' : rec.isUpcoming ? '⚡ Booking Sekarang' : 'Booking Service'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {/* Secondary Button - Scroll to Vehicle Card */}
                    <Button 
                      variant="outline"
                      className="w-full h-11 text-sm font-semibold mt-2"
                      onClick={() => {
                        const vehicleCard = document.getElementById(`vehicle-card-${rec.vehicleId}`);
                        if (vehicleCard) {
                          vehicleCard.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                          });
                          // Add highlight effect
                          vehicleCard.classList.add('ring-4', 'ring-blue-500', 'ring-offset-2');
                          setTimeout(() => {
                            vehicleCard.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2');
                          }, 2000);
                          toast.success('Scroll ke detail kendaraan');
                        }
                      }}
                    >
                      📍 Lihat Detail Kendaraan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}