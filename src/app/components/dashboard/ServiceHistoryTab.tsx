import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  History, 
  CheckCircle2, 
  Calendar, 
  Wrench, 
  Package, 
  DollarSign, 
  Clock,
  Car,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '../../utils/supabase/client';
import { publicAnonKey, projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { RecommendationCard } from './RecommendationCard';

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

export function ServiceHistoryTab() {
  const { user } = useAuth();
  const supabase = createClient();
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [autoRecommendationEnabled, setAutoRecommendationEnabled] = useState(false);

  // Fetch auto recommendation setting from server
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
      setAutoRecommendationEnabled(false); // Default to disabled
    }
  };

  // Fetch completed bookings
  const fetchCompletedBookings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('📡 Fetching completed bookings for user:', user.id);
      
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
      const completed = (data.data || []).filter((booking: any) => 
        booking.status === 'completed'
      );
      
      // Sort by completion date (newest first)
      const sorted = completed.sort((a: any, b: any) => 
        new Date(b.updated_at || b.created_at).getTime() - 
        new Date(a.updated_at || a.created_at).getTime()
      );
      
      setCompletedBookings(sorted);
      
      // Generate recommendations based on completed services
      if (autoRecommendationEnabled) {
        generateRecommendations(sorted);
      }
      
      console.log('✅ Successfully fetched', sorted.length, 'completed bookings');
    } catch (error: any) {
      console.error('❌ Error fetching bookings:', error);
      toast.error(`Gagal memuat riwayat: ${error.message}`);
      setCompletedBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate service recommendations
  const generateRecommendations = (bookings: any[]) => {
    if (bookings.length === 0) {
      setRecommendations([]);
      return;
    }

    const now = new Date();
    const recs: any[] = [];

    // Group bookings by vehicle
    const vehicleGroups: Record<string, any[]> = {};
    
    bookings.forEach(booking => {
      // Try to get vehicle identifier
      const vehicleKey = booking.vehicles?.plate_number || 
                        booking.notes?.match(/🏍️ Kendaraan: ([^\n]+)/)?.[1] || 
                        'default';
      
      if (!vehicleGroups[vehicleKey]) {
        vehicleGroups[vehicleKey] = [];
      }
      vehicleGroups[vehicleKey].push(booking);
    });

    // Generate recommendation for each vehicle
    Object.entries(vehicleGroups).forEach(([vehicleKey, vehicleBookings]) => {
      const lastService = vehicleBookings[0]; // Most recent
      const serviceType = lastService.service_type;
      const interval = serviceIntervals[serviceType];
      
      if (!interval) return;

      const lastServiceDate = new Date(lastService.updated_at || lastService.created_at);
      const nextServiceDate = new Date(lastServiceDate);
      nextServiceDate.setDate(nextServiceDate.getDate() + interval.days);
      
      const daysUntil = Math.ceil((nextServiceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isOverdue = daysUntil < 0;
      const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
      
      // Get vehicle info
      const vehicleInfo = lastService.vehicles?.brand && lastService.vehicles?.model
        ? `${lastService.vehicles.brand} ${lastService.vehicles.model}`
        : lastService.notes?.match(/🏍️ Kendaraan: ([^\n]+)/)?.[1] || 'Motor Anda';
      
      const plateNumber = lastService.vehicles?.plate_number || vehicleKey;
      
      // Get next recommended package
      const nextRec = getNextRecommendation(serviceType);
      
      recs.push({
        vehicleInfo,
        plateNumber,
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
    });

    // Sort: overdue first, then upcoming, then by date
    recs.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      if (a.isUpcoming && !b.isUpcoming) return -1;
      if (!a.isUpcoming && b.isUpcoming) return 1;
      return a.daysUntil - b.daysUntil;
    });

    setRecommendations(recs);
  };

  useEffect(() => {
    if (user?.id) {
      fetchAutoRecommendationSetting();
      fetchCompletedBookings();
    }
  }, [user]);

  // Re-fetch when autoRecommendationEnabled changes
  useEffect(() => {
    if (user?.id && completedBookings.length > 0) {
      if (autoRecommendationEnabled) {
        generateRecommendations(completedBookings);
      } else {
        setRecommendations([]);
      }
    }
  }, [autoRecommendationEnabled]);

  // Poll for setting changes every 10 seconds
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      fetchAutoRecommendationSetting();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A5C82]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recommendations Section - ALWAYS SHOW FIRST if available */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-4">
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

            <CardContent className="p-6 space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-xl border-2 ${
                    rec.isOverdue 
                      ? 'bg-red-50 border-red-300' 
                      : rec.isUpcoming 
                      ? 'bg-yellow-50 border-yellow-300' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        rec.isOverdue 
                          ? 'bg-red-500' 
                          : rec.isUpcoming 
                          ? 'bg-yellow-500' 
                          : 'bg-blue-500'
                      }`}>
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{rec.vehicleInfo}</h4>
                        {rec.plateNumber !== 'default' && (
                          <p className="text-sm text-gray-600 font-mono">{rec.plateNumber}</p>
                        )}
                      </div>
                    </div>
                    
                    {rec.isOverdue && (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        🔴 OVERDUE
                      </Badge>
                    )}
                    {rec.isUpcoming && (
                      <Badge className="bg-yellow-500 text-white animate-pulse">
                        ⚠️ SEGERA
                      </Badge>
                    )}
                  </div>

                  {/* Service Info Grid */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 font-medium">Service Terakhir</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-900">{rec.lastServiceType}</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {rec.lastServiceDate.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 font-medium">Service Berikutnya</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">
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
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          Paket Rekomendasi: {rec.recommendedPackage}
                        </p>
                        <p className="text-sm text-gray-700">{rec.reason}</p>
                        <p className="text-xs text-gray-600 mt-2 italic">{rec.intervalDescription}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full h-12 text-base font-semibold ${
                      rec.isOverdue || rec.isUpcoming
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                    } text-white`}
                    onClick={() => {
                      // Navigate to booking tab
                      const bookingTabButton = document.querySelector('[data-tab="booking"]') as HTMLElement;
                      if (bookingTabButton) {
                        bookingTabButton.click();
                        toast.success('Silakan pilih paket service yang sesuai!');
                      }
                    }}
                  >
                    {rec.isOverdue ? '🚨 Booking Sekarang!' : rec.isUpcoming ? '⚡ Booking Sekarang' : 'Booking Service'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Service History Section */}
      <Card className="border-none shadow-xl">
        <div className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Riwayat Service</h3>
              <p className="text-blue-100 text-sm">
                {completedBookings.length} service selesai
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {completedBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Riwayat
              </h4>
              <p className="text-gray-600 text-sm">
                Riwayat service Anda akan muncul di sini setelah service selesai
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedBookings.map((booking, index) => {
                // Extract vehicle info
                const vehicleInfo = booking.vehicles?.brand && booking.vehicles?.model
                  ? `${booking.vehicles.brand} ${booking.vehicles.model}`
                  : booking.notes?.match(/🏍️ Kendaraan: ([^\n]+)/)?.[1] || 'Motor';
                
                const plateNumber = booking.vehicles?.plate_number || 
                                  booking.notes?.match(/🏍️ Kendaraan: ([^\s]+)/)?.[1];

                const completedDate = new Date(booking.updated_at || booking.created_at);
                const timeMatch = booking.notes?.match(/⏰ Waktu: ([^\n]+)/);
                const scheduledTime = timeMatch ? timeMatch[1] : null;

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{booking.job_number}</h4>
                          <Badge className="bg-green-500 text-white text-xs mt-1">
                            ✅ Selesai
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Selesai pada</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {completedDate.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid md:grid-cols-3 gap-3 mb-3">
                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Car className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Kendaraan</p>
                        </div>
                        <p className="font-semibold text-sm text-gray-900">{vehicleInfo}</p>
                        {plateNumber && (
                          <p className="text-xs text-gray-600 font-mono mt-1">{plateNumber}</p>
                        )}
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Wrench className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Paket Service</p>
                        </div>
                        <p className="font-semibold text-sm text-gray-900">{booking.service_type}</p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Total Bayar</p>
                        </div>
                        <p className="font-semibold text-sm text-green-600">
                          Rp {(booking.total_amount || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {/* Schedule info if available */}
                    {scheduledTime && (
                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Waktu Service: {scheduledTime}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}