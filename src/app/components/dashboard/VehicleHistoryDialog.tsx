import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import {
  History,
  CheckCircle2,
  Calendar,
  Wrench,
  DollarSign,
  Clock,
  Car,
  ArrowRight,
  Loader2,
  Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { publicAnonKey, projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';
import { RecommendationCard } from './RecommendationCard';
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

interface VehicleHistoryDialogProps {
  vehicle: any;
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (tab: string) => void;
}

export function VehicleHistoryDialog({ vehicle, trigger, open, onOpenChange, onNavigate }: VehicleHistoryDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [vehicleHistory, setVehicleHistory] = useState<any[]>([]);
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
      setAutoRecommendationEnabled(false);
    }
  };

  // Fetch bookings for this specific vehicle
  const fetchVehicleHistory = async () => {
    if (!user?.id || !vehicle) return;
    
    setLoading(true);
    try {
      console.log('📡 Fetching history for vehicle:', vehicle.plate_number);
      console.log('🔍 Vehicle object:', vehicle);
      
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
      
      console.log('📦 All bookings received:', data.data?.length || 0);
      
      // Filter only completed bookings for this specific vehicle
      const allCompleted = (data.data || []).filter((booking: any) => 
        booking.status === 'completed'
      );
      
      console.log('✅ Completed bookings:', allCompleted.length);
      
      // Match by plate number - try multiple matching strategies
      const vehicleBookings = allCompleted.filter((booking: any) => {
        // Strategy 1: Check vehicles table join
        const plateFromVehicles = booking.vehicles?.plate_number;
        
        // Strategy 2: Check vehicle_id match
        const vehicleIdMatch = booking.vehicle_id === vehicle.id;
        
        // Strategy 3: Parse from notes (fallback)
        const plateFromNotes = booking.notes?.match(/🏍️ Kendaraan: ([^\s\n]+)/)?.[1];
        
        // Strategy 4: Check if notes contains the plate number anywhere
        const plateInNotes = booking.notes?.includes(vehicle.plate_number);
        
        const matches = plateFromVehicles === vehicle.plate_number || 
                       vehicleIdMatch || 
                       plateFromNotes === vehicle.plate_number ||
                       plateInNotes;
        
        if (matches) {
          console.log('✅ MATCH FOUND:', {
            jobNumber: booking.job_number,
            plateFromVehicles,
            vehicleIdMatch,
            plateFromNotes,
            targetPlate: vehicle.plate_number
          });
        }
        
        return matches;
      });
      
      console.log('🎯 Filtered vehicle bookings:', vehicleBookings.length);
      console.log('📋 Vehicle bookings details:', vehicleBookings.map(b => ({
        id: b.id,
        job_number: b.job_number,
        service_type: b.service_type,
        plate: b.vehicles?.plate_number,
        vehicle_id: b.vehicle_id
      })));
      
      // Sort by completion date (newest first)
      const sorted = vehicleBookings.sort((a: any, b: any) => 
        new Date(b.updated_at || b.created_at).getTime() - 
        new Date(a.updated_at || a.created_at).getTime()
      );
      
      setVehicleHistory(sorted);
      
      // Generate recommendations if enabled
      if (autoRecommendationEnabled && sorted.length > 0) {
        generateRecommendation(sorted[0]); // Most recent
      } else {
        setRecommendations([]);
      }
      
      console.log('✅ Found', sorted.length, 'completed bookings for this vehicle');
    } catch (error: any) {
      console.error('❌ Error fetching vehicle history:', error);
      toast.error(`Gagal memuat riwayat: ${error.message}`);
      setVehicleHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate recommendation for this vehicle
  const generateRecommendation = (lastService: any) => {
    if (!lastService) {
      setRecommendations([]);
      return;
    }

    const now = new Date();
    const serviceType = lastService.service_type;
    const interval = serviceIntervals[serviceType];
    
    if (!interval) {
      setRecommendations([]);
      return;
    }

    const lastServiceDate = new Date(lastService.updated_at || lastService.created_at);
    const nextServiceDate = new Date(lastServiceDate);
    nextServiceDate.setDate(nextServiceDate.getDate() + interval.days);
    
    const daysUntil = Math.ceil((nextServiceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntil < 0;
    const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
    
    const vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
    const nextRec = getNextRecommendation(serviceType);
    
    setRecommendations([{
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
    }]);
  };

  // Fetch data when dialog opens
  useEffect(() => {
    if (open && user?.id && vehicle) {
      fetchAutoRecommendationSetting();
      fetchVehicleHistory();
    }
  }, [open, user, vehicle]);

  // Re-generate recommendations when setting changes
  useEffect(() => {
    if (vehicleHistory.length > 0) {
      if (autoRecommendationEnabled) {
        generateRecommendation(vehicleHistory[0]);
      } else {
        setRecommendations([]);
      }
    }
  }, [autoRecommendationEnabled, vehicleHistory]);

  const getStatusBadge = (status: string) => {
    return (
      <Badge className="bg-green-500 text-white border-0">
        ✅ Selesai
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Riwayat & Rekomendasi Service</DialogTitle>
          <DialogDescription className="text-base">
            {vehicle?.brand} {vehicle?.model} ({vehicle?.plate_number})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-[#2A5C82]" />
            </div>
          ) : (
            <>
              {/* Recommendations Section - Show first if available */}
              {recommendations.length > 0 && (
                <div>
                  <RecommendationCard 
                    recommendations={recommendations} 
                    onBookingClick={() => {
                      onNavigate('booking');
                      onOpenChange(false);
                      toast.success('Silakan pilih paket service yang sesuai!');
                    }}
                  />
                </div>
              )}

              {/* Service History Section */}
              <div>
                <div className="flex items-center gap-3 mb-4 bg-gradient-to-r from-[#2A5C82] to-[#1e4460] px-5 py-3 rounded-lg">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Riwayat Service</h3>
                    <p className="text-blue-100 text-sm">
                      {vehicleHistory.length} service selesai
                    </p>
                  </div>
                </div>

                {vehicleHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <History className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum Ada Riwayat
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Belum ada riwayat service untuk kendaraan ini
                    </p>
                    <Button 
                      onClick={() => {
                        onNavigate('booking');
                        onOpenChange(false);
                      }}
                      className="bg-[#10B981] hover:bg-[#059669]"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Booking Service Sekarang
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vehicleHistory.map((booking, index) => {
                      const completedDate = new Date(booking.updated_at || booking.created_at);
                      const timeMatch = booking.notes?.match(/⏰ Waktu: ([^\n]+)/);
                      const scheduledTime = timeMatch ? timeMatch[1] : null;

                      // Parse parts from notes
                      const partsSection = booking.notes?.match(/📦 Sparepart:(.*?)(?=\n\n|$)/s)?.[1];
                      const parts = partsSection ? partsSection.split('\n').filter((line: string) => line.trim().startsWith('•')).map((line: string) => {
                        const match = line.match(/• (.+?) \((\d+)x\) - Rp ([0-9,]+)/);
                        if (match) {
                          return {
                            name: match[1],
                            qty: parseInt(match[2]),
                            price: parseInt(match[3].replace(/,/g, ''))
                          };
                        }
                        return null;
                      }).filter(Boolean) : [];

                      // Calculate next service recommendation for THIS specific booking
                      const serviceType = booking.service_type;
                      const interval = serviceIntervals[serviceType];
                      let nextServiceInfo = null;
                      
                      if (interval) {
                        const nextServiceDate = new Date(completedDate);
                        nextServiceDate.setDate(nextServiceDate.getDate() + interval.days);
                        
                        const now = new Date();
                        const daysUntil = Math.ceil((nextServiceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        const isOverdue = daysUntil < 0;
                        const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
                        const isPast = index > 0; // Not the most recent service
                        
                        nextServiceInfo = {
                          date: nextServiceDate,
                          daysUntil,
                          isOverdue,
                          isUpcoming,
                          isPast,
                          intervalDescription: interval.description
                        };
                      }

                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all">
                            <CardContent className="p-5">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900">{booking.job_number}</h4>
                                    {getStatusBadge(booking.status)}
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-xs text-gray-600">Selesai pada</p>
                                  <p className="font-semibold text-gray-900">
                                    {completedDate.toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Info Grid */}
                              <div className="grid md:grid-cols-2 gap-3 mb-3">
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

                              {/* Schedule info */}
                              {scheduledTime && (
                                <div className="p-3 bg-white rounded-lg border border-green-200 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <p className="text-xs text-gray-600">Waktu Service: {scheduledTime}</p>
                                  </div>
                                </div>
                              )}

                              {/* Parts used */}
                              {parts.length > 0 && (
                                <div className="p-3 bg-white rounded-lg border border-green-200 mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-4 h-4 text-gray-600" />
                                    <p className="text-xs text-gray-600 font-semibold">Sparepart yang Digunakan:</p>
                                  </div>
                                  <div className="space-y-1">
                                    {parts.map((part: any, idx: number) => (
                                      <div key={idx} className="flex justify-between text-xs">
                                        <span className="text-gray-700">• {part.name} (x{part.qty})</span>
                                        <span className="font-semibold text-gray-800">
                                          Rp {part.price.toLocaleString('id-ID')}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Next Service Recommendation - NEW! */}
                              {nextServiceInfo && (
                                <div className={`p-4 rounded-lg border-2 ${
                                  nextServiceInfo.isPast 
                                    ? 'bg-gray-50 border-gray-300' 
                                    : nextServiceInfo.isOverdue 
                                    ? 'bg-red-50 border-red-300 animate-pulse' 
                                    : nextServiceInfo.isUpcoming 
                                    ? 'bg-yellow-50 border-yellow-300' 
                                    : 'bg-blue-50 border-blue-300'
                                }`}>
                                  <div className="flex items-start gap-3">
                                    <Calendar className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                      nextServiceInfo.isPast 
                                        ? 'text-gray-500' 
                                        : nextServiceInfo.isOverdue 
                                        ? 'text-red-600' 
                                        : nextServiceInfo.isUpcoming 
                                        ? 'text-yellow-600' 
                                        : 'text-blue-600'
                                    }`} />
                                    <div className="flex-1">
                                      <p className="font-semibold text-sm text-gray-900 mb-1">
                                        {nextServiceInfo.isPast ? '📅 Service Berikutnya (Sudah Lewat)' : '🔔 Service Berikutnya'}
                                      </p>
                                      <p className="text-sm text-gray-700 mb-1">
                                        {nextServiceInfo.date.toLocaleDateString('id-ID', {
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric'
                                        })}
                                      </p>
                                      <p className={`text-xs font-semibold ${
                                        nextServiceInfo.isPast 
                                          ? 'text-gray-600' 
                                          : nextServiceInfo.isOverdue 
                                          ? 'text-red-600' 
                                          : nextServiceInfo.isUpcoming 
                                          ? 'text-yellow-600' 
                                          : 'text-blue-600'
                                      }`}>
                                        {nextServiceInfo.isPast 
                                          ? '(Sudah ada service terbaru)' 
                                          : nextServiceInfo.isOverdue 
                                          ? `⚠️ Sudah telat ${Math.abs(nextServiceInfo.daysUntil)} hari!` 
                                          : nextServiceInfo.isUpcoming 
                                          ? `⏰ Tinggal ${nextServiceInfo.daysUntil} hari lagi!` 
                                          : `✅ Masih ${nextServiceInfo.daysUntil} hari lagi`
                                        }
                                      </p>
                                      <p className="text-xs text-gray-600 mt-1 italic">
                                        {nextServiceInfo.intervalDescription}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}