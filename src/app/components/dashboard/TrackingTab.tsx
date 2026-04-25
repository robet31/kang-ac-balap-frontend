import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Loader2, Clock, CheckCircle2, XCircle, AlertCircle, Package, Calendar, Wrench, Car, DollarSign, List, Gift, Tag, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '../../utils/supabase/client';
import { publicAnonKey, projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';
import { ServiceHistoryTab } from './ServiceHistoryTab';
import { motion } from 'motion/react';

// Service Packages WITHOUT PRICES - prices will be fetched from database inventory
const servicePackages = [
  {
    id: 'hemat-service',
    name: "Hemat Service",
    minimumPrice: 40000,
    basePrice: 0, // FREE JASA!
    originalBasePrice: 15000, // Harga normal jasa (untuk ditampilkan coret)
    requiredItems: [
      { sku: 'OLI-001', name: 'Oli Mesin SAE 10W-40', qty: 1, unit: 'liter' },
      { sku: 'BPF-001', name: 'Busi Iridium', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'basic-tuneup',
    name: "Basic Tune-Up",
    minimumPrice: 60000,
    basePrice: 0, // FREE JASA!
    originalBasePrice: 25000,
    requiredItems: [
      { sku: 'OLI-001', name: 'Oli Mesin SAE 10W-40', qty: 1, unit: 'liter' },
      { sku: 'BPF-001', name: 'Busi Iridium', qty: 1, unit: 'pcs' },
      { sku: 'FLT-001', name: 'Filter Udara', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'standard-service',
    name: "Standard Service",
    minimumPrice: 100000,
    basePrice: 0, // FREE JASA!
    originalBasePrice: 35000,
    requiredItems: [
      { sku: 'OLI-001', name: 'Oli Mesin SAE 10W-40', qty: 2, unit: 'liter' },
      { sku: 'BPF-001', name: 'Busi Iridium', qty: 1, unit: 'pcs' },
      { sku: 'FLT-001', name: 'Filter Udara', qty: 1, unit: 'pcs' },
      { sku: 'FLT-002', name: 'Filter Oli', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'premium-service',
    name: "Premium Service",
    minimumPrice: 150000,
    basePrice: 0, // FREE JASA!
    originalBasePrice: 50000,
    requiredItems: [
      { sku: 'OLI-002', name: 'Oli Mesin Fully Synthetic', qty: 2, unit: 'liter' },
      { sku: 'BPF-001', name: 'Busi Iridium', qty: 1, unit: 'pcs' },
      { sku: 'FLT-001', name: 'Filter Udara', qty: 1, unit: 'pcs' },
      { sku: 'FLT-002', name: 'Filter Oli', qty: 1, unit: 'pcs' },
      { sku: 'PAD-001', name: 'Kampas Rem Depan', qty: 1, unit: 'set' }
    ]
  }
];

const statusConfig: any = {
  pending: {
    label: 'Menunggu Validasi',
    icon: Clock,
    color: 'bg-gradient-to-br from-orange-500 to-amber-600',
    textColor: 'text-orange-700',
    bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
    borderColor: 'border-orange-300',
    stepNumber: 1,
    description: 'Booking Anda sedang menunggu validasi dari admin',
    emoji: '⏳'
  },
  scheduled: {
    label: 'Dijadwalkan',
    icon: Calendar,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    textColor: 'text-blue-700',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    borderColor: 'border-blue-300',
    stepNumber: 2,
    description: 'Booking telah disetujui, menunggu jadwal service',
    emoji: '📅'
  },
  in_progress: {
    label: 'Sedang Diperbaiki',
    icon: Wrench,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    textColor: 'text-blue-700',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    borderColor: 'border-blue-300',
    stepNumber: 3,
    description: 'Teknisi sedang mengerjakan service kendaraan Anda',
    emoji: '🔧'
  },
  awaiting_payment: {
    label: 'Menunggu Pembayaran',
    icon: AlertCircle,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    textColor: 'text-yellow-700',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-300',
    stepNumber: 4,
    description: 'Service selesai, silakan lakukan pembayaran',
    emoji: '💳'
  },
  completed: {
    label: 'Selesai',
    icon: CheckCircle2,
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    textColor: 'text-green-700',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-green-300',
    stepNumber: 5,
    description: 'Service telah selesai dan lunas',
    emoji: '✅'
  },
  cancelled: {
    label: 'Dibatalkan',
    icon: XCircle,
    color: 'bg-gradient-to-br from-red-500 to-rose-600',
    textColor: 'text-red-700',
    bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
    borderColor: 'border-red-300',
    stepNumber: 0,
    description: 'Booking dibatalkan',
    emoji: '❌'
  }
};

export function TrackingTab() {
  const { user } = useAuth();
  const supabase = createClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  
  // Accordion state - track which booking cards are expanded
  const [expandedBookings, setExpandedBookings] = useState<Record<string, boolean>>({});

  // Fetch inventory from database
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/prefix/inventory_`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setInventory(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Fetch bookings
  const fetchCustomerBookings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('📡 Fetching customer bookings for user:', user.id);
      
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
      
      // ✅ FILTER: Exclude cancelled and completed bookings
      const activeBookings = (data.data || []).filter((booking: any) => 
        booking.status !== 'cancelled' && booking.status !== 'completed'
      );
      
      // Sort: active jobs first, then by created date
      const sorted = activeBookings.sort((a: any, b: any) => {
        // Active statuses first
        const activeStatuses = ['in_progress', 'scheduled', 'pending', 'awaiting_payment'];
        const aActive = activeStatuses.includes(a.status);
        const bActive = activeStatuses.includes(b.status);
        
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        
        // Then by created date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setBookings(sorted);
      console.log('✅ Successfully fetched', sorted.length, 'active bookings');
    } catch (error: any) {
      console.error('❌ Error fetching bookings:', error);
      toast.error(`Gagal memuat data tracking: ${error.message}`);
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchCustomerBookings();
    }
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    
    console.log('🔌 Setting up real-time tracking subscription');
    
    const channel = supabase
      .channel('customer-tracking-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_orders', // ✅ FIXED: Changed from 'jobs' to 'job_orders'
          filter: `customer_id=eq.${user.id}`, // ✅ FIXED: Changed from user_id to customer_id
        },
        (payload: any) => {
          console.log('🔔 Tracking update received:', payload);
          
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new?.status;
            const oldStatus = payload.old?.status;
            
            if (newStatus !== oldStatus) {
              const statusInfo = statusConfig[newStatus];
              if (statusInfo) {
                toast.success(`${statusInfo.emoji} Status Update: ${statusInfo.label}`);
              }
            }
            
            if (payload.new?.progress !== payload.old?.progress) {
              toast.info(`⚡ Progress: ${payload.new?.progress}%`);
            }
          }
          
          // Refresh data
          fetchCustomerBookings();
        }
      )
      .subscribe((status) => {
        console.log('📡 Tracking subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Tracking real-time subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Tracking subscription error - using polling fallback');
          // Fallback to polling
          const pollInterval = setInterval(() => {
            console.log('🔄 Polling tracking updates...');
            fetchCustomerBookings();
          }, 10000); // Poll every 10 seconds
          
          // Store for cleanup
          (channel as any).pollInterval = pollInterval;
        }
      });
    
    return () => {
      console.log('🔌 Cleaning up tracking subscription');
      supabase.removeChannel(channel);
      
      // Clear polling interval if set
      if ((channel as any).pollInterval) {
        clearInterval((channel as any).pollInterval);
      }
    };
  }, [user?.id, supabase]);

  // Render progress timeline - Modern & Attractive
  const renderProgressTimeline = (booking: any) => {
    const currentStatus = statusConfig[booking.status];
    const currentStep = currentStatus?.stepNumber || 0;
    
    const steps = [
      { status: 'pending', label: 'Menunggu', emoji: '⏳', icon: Clock },
      { status: 'scheduled', label: 'Dijadwalkan', emoji: '📅', icon: Calendar },
      { status: 'in_progress', label: 'Dikerjakan', emoji: '🔧', icon: Wrench },
      { status: 'awaiting_payment', label: 'Pembayaran', emoji: '💳', icon: DollarSign },
      { status: 'completed', label: 'Selesai', emoji: '✅', icon: CheckCircle2 }
    ];
    
    return (
      <div className="relative py-4 px-2">
        {/* Animated Progress Bar */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
          </div>
        </div>
        
        {/* Steps with hover effects */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepStatus = statusConfig[step.status];
            const isCompleted = currentStep > stepStatus.stepNumber;
            const isCurrent = currentStep === stepStatus.stepNumber;
            const StepIcon = step.icon;
            
            return (
              <div 
                key={step.status} 
                className="flex flex-col items-center gap-2 group cursor-default"
              >
                {/* Step Circle with icon */}
                <div className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center 
                  border-3 transition-all duration-300 transform
                  ${isCompleted 
                    ? 'bg-gradient-to-br from-green-500 to-green-700 border-green-600 shadow-lg shadow-green-500/50 scale-100' 
                    : isCurrent 
                    ? 'bg-white border-green-600 shadow-lg shadow-green-600/30 scale-110 ring-4 ring-green-100' 
                    : 'bg-white border-gray-300 scale-90 opacity-60'
                  }
                  group-hover:scale-110 group-hover:shadow-xl
                `}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <StepIcon className={`w-5 h-5 ${isCurrent ? 'text-green-600' : 'text-gray-400'}`} />
                  )}
                  
                  {/* Pulse animation for current step */}
                  {isCurrent && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
                      <span className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-40" />
                    </>
                  )}
                </div>
                
                {/* Label with status indicator */}
                <div className="flex flex-col items-center">
                  <span className={`
                    text-xs font-semibold text-center transition-all duration-300
                    ${isCurrent 
                      ? 'text-green-700 scale-105' 
                      : isCompleted 
                      ? 'text-gray-700' 
                      : 'text-gray-500'
                    }
                  `}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress percentage indicator */}
        <div className="mt-3 flex items-center justify-center">
          <div className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
            <span className="text-xs font-semibold text-green-700">
              Progress: {Math.round((currentStep / 5) * 100)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="border-none shadow-xl">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#2A5C82]" />
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-[#2A5C82] to-[#3d7ca8] rounded-full flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Service
          </h3>
          <p className="text-gray-600 text-center">
            Anda belum memiliki riwayat service. Buat booking pertama Anda sekarang!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Modern & Clean */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-br from-[#2A5C82] to-[#1e4460] rounded-2xl shadow-xl">
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8" />
            Tracking Service Kendaraan
          </h2>
          <p className="text-blue-100">
            Pantau progress service kendaraan Anda secara real-time
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-white">Live Updates</span>
        </div>
      </div>

      {/* Bookings List - Redesigned Cards */}
      <div className="grid gap-6">
        {bookings.map((booking) => {
          const status = statusConfig[booking.status] || statusConfig.pending;
          const StatusIcon = status.icon;
          const isActive = ['pending', 'scheduled', 'in_progress', 'awaiting_payment'].includes(booking.status);
          
          // Extract time from notes
          const timeMatch = booking.notes?.match(/Waktu: (\d{2}:\d{2})/);
          const scheduledTime = timeMatch ? timeMatch[1] : '';
          const notesWithoutTime = booking.notes?.replace(/Waktu: \d{2}:\d{2}\n?/, '') || '';
          
          // Get package info - enrich with prices from inventory
          const matchedPackage = servicePackages.find(pkg => 
            pkg.name.toLowerCase() === booking.service_type?.toLowerCase()
          );
          
          // Enrich package items with prices from inventory
          const packageWithPrices = matchedPackage ? {
            ...matchedPackage,
            requiredItems: matchedPackage.requiredItems.map(item => ({
              ...item,
              price: inventory.find(inv => inv.sku === item.sku)?.price || 0
            }))
          } : null;
          
          const sparepartTotal = packageWithPrices ? packageWithPrices.requiredItems.reduce((sum, item) => 
            sum + (item.price * item.qty), 0
          ) : 0;
          
          // Check if this booking is expanded
          const isExpanded = expandedBookings[booking.id] !== false; // Default to expanded
          
          return (
            <Card 
              key={booking.id} 
              className={`border-2 ${status.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                isActive ? 'ring-2 ring-[#2A5C82] ring-offset-2' : ''
              }`}
            >
              {/* Header Section - Clickable to Toggle */}
              <div 
                className={`${status.bgColor} px-6 py-5 border-b-2 ${status.borderColor} cursor-pointer hover:opacity-90 transition-opacity duration-200 select-none`}
                onClick={() => setExpandedBookings(prev => ({ ...prev, [booking.id]: !isExpanded }))}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-2xl ${status.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{status.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{booking.job_number}</h3>
                        {isActive && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 animate-pulse">
                            🔴 ACTIVE
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${status.color} text-white text-sm px-3 py-1`}>
                          {status.label}
                        </Badge>
                        <span className="text-sm text-gray-700 font-medium">
                          {booking.service_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Vehicle Info Badge */}
                    {(() => {
                      if (booking.vehicles?.brand && booking.vehicles?.model) {
                        return (
                          <div className="text-right">
                            <Badge variant="outline" className="text-sm px-3 py-2 bg-white/80 backdrop-blur-sm border-gray-300">
                              <Car className="w-4 h-4 mr-1.5" />
                              {booking.vehicles.brand} {booking.vehicles.model}
                            </Badge>
                            {booking.vehicles.plate_number && (
                              <div className="text-xs text-gray-600 mt-1 font-mono font-semibold">
                                {booking.vehicles.plate_number}
                              </div>
                            )}
                          </div>
                        );
                      }
                      const vehicleMatch = booking.notes?.match(/🏍️ Kendaraan: ([^\n]+)/);
                      if (vehicleMatch) {
                        return (
                          <Badge variant="outline" className="text-sm px-3 py-2 bg-white/80 backdrop-blur-sm border-gray-300">
                            <Car className="w-4 h-4 mr-1.5" />
                            {vehicleMatch[1]}
                          </Badge>
                        );
                      }
                      return (
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-100 text-gray-500 border-gray-200">
                          Walk-in
                        </Badge>
                      );
                    })()}
                    
                    {/* Chevron Icon */}
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-700 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-700 transition-transform duration-200" />
                    )}
                  </div>
                </div>
                
                {/* Progress Timeline - Always Visible */}
                {booking.status !== 'cancelled' && (
                  <div className="mt-6">
                    {renderProgressTimeline(booking)}
                  </div>
                )}
              </div>

              {/* Content Section - Collapsible */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <CardContent className="p-6 space-y-6">
                    {/* Quick Info Grid - WITH CATATAN */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Jenis Service</p>
                        <p className="font-semibold text-gray-900 text-sm">{booking.service_type}</p>
                      </div>
                      
                      {/* JADWAL & WAKTU SERVICE - COMBINED */}
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 mb-1 font-medium flex items-center gap-1">
                          <Clock className="size-3" />
                          Jadwal Service
                        </p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {(() => {
                            // Extract time from notes (⏰ Waktu: HH:MM)
                            const timeMatch = booking.notes?.match(/⏰ Waktu: ([^\n]+)/);
                            const time = timeMatch ? timeMatch[1] : null;
                            
                            // Use created_at date as fallback for date
                            const date = booking.created_at ? 
                              new Date(booking.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }) : null;
                            
                            if (date && time) {
                              return `${date}, ${time}`;
                            } else if (time) {
                              return `Hari ini, ${time}`;
                            } else if (date) {
                              return date;
                            } else {
                              return '-';
                            }
                          })()}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Teknisi</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {(() => {
                            // Extract technician from notes
                            const techMatch = booking.notes?.match(/🔧 Teknisi: ([^\n]+)/);
                            return techMatch ? techMatch[1] : 'Belum ditugaskan';
                          })()}
                        </p>
                      </div>
                      
                      {/* CATATAN - NEW DIV */}
                      {(() => {
                        // ✅ Extract ONLY user notes (after metadata)
                        // Backend format:
                        // 👤 Customer: xxx
                        // 🏍️ Kendaraan: xxx
                        // 📦 Paket: xxx
                        // ⏰ Waktu: xxx
                        // 💰 Biaya Jasa: xxx
                        // [blank line]
                        // [USER NOTES HERE]
                        
                        let userNotes = booking.notes || '';
                        
                        // Split by double newline to separate metadata from user notes
                        const parts = userNotes.split('\n\n');
                        if (parts.length > 1) {
                          // User notes are after metadata
                          userNotes = parts.slice(1).join('\n\n').trim();
                        } else {
                          // Fallback: Remove all metadata lines manually
                          userNotes = userNotes
                            .replace(/👤 Customer: [^\n]+\n?/g, '')
                            .replace(/🏍️ Kendaraan: [^\n]+\n?/g, '')
                            .replace(/📦 Paket: [^\n]+\n?/g, '')
                            .replace(/⏰ Waktu: [^\n]+\n?/g, '')
                            .replace(/🔧 Teknisi: [^\n]+\n?/g, '')
                            .replace(/💰 Biaya Jasa: [^\n]+\n?/g, '')
                            .replace(/💰 Service Fee: [^\n]+\n?/g, '')
                            .replace(/📝 /g, '')
                            .trim();
                        }
                        
                        return userNotes ? (
                          <div className="md:col-span-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs text-amber-600 mb-1 font-medium">Catatan</p>
                            <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                              {userNotes}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Package Details - SIMPLIFIED */}
                    {packageWithPrices && (
                      <div className="p-5 bg-white rounded-lg border border-gray-200">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-600" />
                            Rincian Paket
                          </h4>
                        </div>

                        {/* FREE JASA PROMO */}
                        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <Gift className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">GRATIS Biaya Jasa!</p>
                                <p className="text-xs text-gray-600">Promo khusus booking online</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs line-through text-gray-500">
                                Rp {packageWithPrices.originalBasePrice.toLocaleString('id-ID')}
                              </p>
                              <p className="text-lg font-bold text-green-600">Rp 0</p>
                            </div>
                          </div>
                        </div>

                        {/* Sparepart List */}
                        <div className="space-y-2 mb-4">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Sparepart yang Digunakan:
                          </p>
                          {packageWithPrices.requiredItems.map((item: any, index: number) => {
                            const itemTotal = item.price * item.qty;
                            return (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-600">
                                      {item.qty} {item.unit} × Rp {item.price.toLocaleString('id-ID')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    Rp {itemTotal.toLocaleString('id-ID')}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Total Summary */}
                        <div className="p-4 bg-gray-900 rounded-lg">
                          <div className="space-y-2 text-white">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                              <span className="text-sm">Subtotal Sparepart:</span>
                              <span className="font-semibold">Rp {sparepartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                              <span className="text-sm flex items-center gap-2">
                                <Gift className="w-4 h-4" />
                                Biaya Jasa:
                              </span>
                              <div className="text-right">
                                <p className="text-xs line-through text-gray-400">
                                  Rp {packageWithPrices.originalBasePrice.toLocaleString('id-ID')}
                                </p>
                                <span className="text-sm font-semibold text-green-400">GRATIS!</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="font-semibold">Total Bayar:</span>
                              <span className="text-xl font-bold">
                                Rp {sparepartTotal.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Info Note */}
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-blue-900">
                              <p className="font-semibold">Hemat hingga Rp {packageWithPrices.originalBasePrice.toLocaleString('id-ID')}!</p>
                              <p className="text-blue-700 mt-1">
                                Anda mendapatkan gratis biaya jasa service. Cukup bayar harga sparepart saja!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Items (if any) */}
                    {booking.job_items && booking.job_items.length > 0 && (
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <List className="w-5 h-5 text-gray-600" />
                          Item Tambahan
                        </h4>
                        <div className="space-y-2">
                          {booking.job_items.map((item: any, index: number) => (
                            <div 
                              key={item.id || index} 
                              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <Package className="w-5 h-5 text-gray-600" />
                                <div>
                                  <p className="font-semibold text-sm text-gray-900">{item.item_name || 'Item'}</p>
                                  <p className="text-xs text-gray-600">
                                    {item.quantity} × Rp {(item.unit_price || 0).toLocaleString('id-ID')}
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold text-gray-900">
                                Rp {(item.total_price || 0).toLocaleString('id-ID')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completed Date */}
                    {booking.completed_date && (
                      <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">
                          Selesai pada {new Date(booking.completed_date).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}