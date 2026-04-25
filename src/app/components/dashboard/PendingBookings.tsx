import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Clock, Calendar, Edit2, Trash2, Loader2, Car, AlertCircle, CheckCircle2, Bike, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '../../utils/supabase/client';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

interface PendingBookingsProps {
  onRefresh?: () => void;
}

export function PendingBookings({ onRefresh }: PendingBookingsProps) {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Edit form state
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  
  // Fetch pending bookings
  useEffect(() => {
    if (user?.id) {
      fetchPendingBookings();
    }
  }, [user]);
  
  // Real-time subscription for booking updates
  useEffect(() => {
    if (!user?.id) return;
    
    console.log('🔌 Setting up real-time subscription for pending bookings');
    
    const channel = supabase
      .channel('pending-bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_orders', // ✅ FIXED: Changed from 'jobs' to 'job_orders'
          filter: `customer_id=eq.${user.id}`, // ✅ FIXED: Changed from user_id to customer_id
        },
        (payload: any) => {
          console.log('🔔 Booking update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.success('📥 Booking baru diterima!');
          } else if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new?.status;
            if (newStatus === 'scheduled') {
              toast.success('✅ Booking Anda disetujui admin!');
            } else if (newStatus === 'cancelled') {
              toast.error('❌ Booking Anda dibatalkan');
            }
          } else if (payload.eventType === 'DELETE') {
            toast.info('🗑️ Booking dihapus');
          }
          
          // Refresh list
          fetchPendingBookings();
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Pending bookings real-time subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Pending bookings subscription error - using polling fallback');
          // Don't show error toast, just fallback to polling
          const pollInterval = setInterval(() => {
            console.log('🔄 Polling pending bookings...');
            fetchPendingBookings();
          }, 10000); // Poll every 10 seconds
          
          // Store for cleanup
          (channel as any).pollInterval = pollInterval;
        }
      });
    
    // ✅ Listen for manual refresh events
    const handleManualRefresh = () => {
      console.log('🔄 Manual refresh triggered');
      fetchPendingBookings();
    };
    
    window.addEventListener('refresh-pending-bookings', handleManualRefresh);
    
    return () => {
      console.log('🔌 Cleaning up subscription');
      // Clear polling if exists
      if ((channel as any).pollInterval) {
        clearInterval((channel as any).pollInterval);
      }
      supabase.removeChannel(channel);
      window.removeEventListener('refresh-pending-bookings', handleManualRefresh);
    };
  }, [user?.id]); // ✅ FIXED: Removed supabase from deps to prevent re-subscription
  
  const fetchPendingBookings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('📡 Fetching pending bookings for user:', user.id);
      
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
      
      // Filter only pending bookings
      const pendingOnly = (data.data || []).filter((b: any) => b.status === 'pending');
      
      // 🔍 ENHANCEMENT: Fetch vehicle data from KV store if vehicle_id is KV key
      const enrichedBookings = await Promise.all(
        pendingOnly.map(async (booking: any) => {
          // If vehicle_id looks like a KV key and no vehicle relation data
          if (booking.vehicle_id?.includes('vehicle_') && !booking.vehicles?.brand) {
            console.log('🔍 Fetching vehicle from KV store:', booking.vehicle_id);
            try {
              const kvResponse = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/get/${booking.vehicle_id}`,
                {
                  headers: { 'Authorization': `Bearer ${publicAnonKey}` }
                }
              );
              
              if (kvResponse.ok) {
                const kvData = await kvResponse.json();
                if (kvData.success && kvData.data) {
                  console.log('✅ Fetched vehicle from KV:', kvData.data);
                  // Inject vehicle data into booking object
                  booking.vehicles = {
                    brand: kvData.data.brand,
                    model: kvData.data.model,
                    plate_number: kvData.data.plate_number || kvData.data.plateNumber
                  };
                }
              }
            } catch (kvError) {
              console.error('❌ Failed to fetch vehicle from KV:', kvError);
            }
          }
          return booking;
        })
      );
      
      setBookings(enrichedBookings);
      console.log('✅ Successfully fetched', enrichedBookings.length, 'pending bookings');
    } catch (error: any) {
      console.error('❌ Error fetching pending bookings:', error);
      toast.error(`Gagal memuat booking pending: ${error.message}`);
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (booking: any) => {
    setSelectedBooking(booking);
    setEditDate(booking.scheduled_date?.split('T')[0] || '');
    
    // Extract time from notes if present
    const timeMatch = booking.notes?.match(/⏰ Waktu: ([^\n]+)/);
    setEditTime(timeMatch ? timeMatch[1] : '');
    
    // ✅ FIX: Extract ONLY user notes (remove ALL metadata)
    // Backend format:
    // 👤 Customer: xxx
    // 🏍️ Kendaraan: xxx
    // 📦 Paket: xxx
    // ⏰ Waktu: xxx
    // 💰 Biaya Jasa: xxx
    // 
    // [USER NOTES HERE]  ← ONLY THIS
    
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
    
    setEditNotes(userNotes);
    setEditDialog(true);
  };
  
  const handleSaveEdit = async () => {
    if (!selectedBooking) return;
    
    if (!editDate) {
      toast.error('Mohon pilih tanggal');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // ✅ FIX: Rebuild comprehensive notes with metadata preserved
      const oldNotes = selectedBooking.notes || '';
      
      // Extract existing metadata
      const customerMatch = oldNotes.match(/👤 Customer: ([^\n]+)/);
      const vehicleMatch = oldNotes.match(/🏍️ Kendaraan: ([^\n]+)/);
      const packageMatch = oldNotes.match(/📦 Paket: ([^\n]+)/);
      const serviceFeeMatch = oldNotes.match(/💰 Biaya Jasa: ([^\n]+)/);
      const techMatch = oldNotes.match(/🔧 Teknisi: ([^\n]+)/);
      
      // Rebuild comprehensive notes with metadata + updated time + user notes
      let comprehensiveNotes = '';
      
      // Preserve customer metadata
      if (customerMatch) {
        comprehensiveNotes += `👤 Customer: ${customerMatch[1]}\n`;
      }
      
      // Preserve vehicle metadata
      if (vehicleMatch) {
        comprehensiveNotes += `🏍️ Kendaraan: ${vehicleMatch[1]}\n`;
      }
      
      // Preserve package metadata
      if (packageMatch) {
        comprehensiveNotes += `📦 Paket: ${packageMatch[1]}\n`;
      }
      
      // Add updated time
      if (editTime) {
        comprehensiveNotes += `⏰ Waktu: ${editTime}\n`;
      }
      
      // Preserve technician metadata (if exists)
      if (techMatch) {
        comprehensiveNotes += `🔧 Teknisi: ${techMatch[1]}\n`;
      }
      
      // Preserve service fee metadata
      if (serviceFeeMatch) {
        comprehensiveNotes += `💰 Biaya Jasa: ${serviceFeeMatch[1]}\n`;
      }
      
      // Add user notes (if exists)
      if (editNotes) {
        comprehensiveNotes += `\n${editNotes}`;
      }
      
      console.log('📝 Rebuilt comprehensive notes:', comprehensiveNotes);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/${selectedBooking.id}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'pending', // Keep as pending
            scheduled_date: editDate,
            notes: comprehensiveNotes
          })
        }
      );
      
      if (response.ok) {
        toast.success('✅ Booking berhasil diupdate!');
        setEditDialog(false);
        fetchPendingBookings();
        onRefresh?.();
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast.error(`❌ Gagal update booking: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = async (booking: any) => {
    if (!confirm(`Batalkan dan hapus booking ${booking.job_number}?\n\nBooking ini akan dihapus permanen dari sistem.`)) {
      return;
    }
    
    try {
      console.log('🗑️ Deleting booking:', booking.job_number);
      
      // ✅ DELETE booking instead of setting status to cancelled
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/${booking.job_number}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Booking deleted:', result);
        
        toast.success('✅ Booking berhasil dibatalkan dan dihapus dari sistem');
        fetchPendingBookings();
        onRefresh?.();
      } else {
        const error = await response.json();
        console.error('❌ Failed to delete booking:', error);
        throw new Error(error.error || 'Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(`❌ Gagal batalkan booking: ${error.message}`);
    }
  };
  
  const minDate = new Date().toISOString().split('T')[0];
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#2A5C82]" />
        </CardContent>
      </Card>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak Ada Booking Pending
          </h3>
          <p className="text-gray-600 text-center">
            Semua booking Anda sudah diproses
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/30 to-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Clock className="w-5 h-5" />
                Menunggu Validasi Admin
              </CardTitle>
              <CardDescription className="text-orange-700 mt-1">
                {bookings.length} booking menunggu persetujuan admin
              </CardDescription>
            </div>
            <Badge className="bg-orange-500 text-white px-3 py-1.5 font-semibold">
              {bookings.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookings.map((booking) => {
            // 🔍 DEBUG: Log booking data untuk troubleshooting
            console.log('📋 Booking data:', {
              job_number: booking.job_number,
              notes: booking.notes,
              vehicle_id: booking.vehicle_id,
              vehicles: booking.vehicles,
              scheduled_date: booking.scheduled_date
            });
            
            // Extract time from notes - MULTIPLE PATTERNS + FALLBACK
            let scheduledTime = '';
            const timeMatch = booking.notes?.match(/⏰ Waktu: ([^\n]+)/) || 
                             booking.notes?.match(/Waktu: ([^\n]+)/);
            if (timeMatch) {
              scheduledTime = timeMatch[1].trim();
            } else {
              // FALLBACK: Try to parse from scheduled_date if it includes time
              try {
                const dateObj = new Date(booking.scheduled_date);
                const hours = dateObj.getHours();
                const minutes = dateObj.getMinutes();
                // Only show time if it's not midnight (00:00)
                if (hours !== 0 || minutes !== 0) {
                  scheduledTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                }
              } catch (e) {
                // Date parsing failed, leave empty
              }
            }
            
            console.log('🕐 Extracted scheduledTime:', scheduledTime);
            
            // Extract vehicle info - ROBUST PARSING with FALLBACK
            const vehicleInfo = (() => {
              // Priority 1: Try database relation from KV fetch
              if (booking.vehicles?.brand || booking.vehicles?.model) {
                const brand = booking.vehicles.brand || '';
                const model = booking.vehicles.model || '';
                const result = `${brand} ${model}`.trim();
                console.log('✅ Vehicle from database relation:', result);
                return result || 'Belum terdaftar';
              }
              
              // Priority 2: Extract from notes "🏍️ Kendaraan: PLAT - BRAND MODEL"
              const vehicleMatch = booking.notes?.match(/🏍️ Kendaraan: ([^\n]+)/) ||
                                   booking.notes?.match(/Kendaraan: ([^\n]+)/);
              if (vehicleMatch) {
                const fullVehicle = vehicleMatch[1].trim();
                console.log('🔍 Full vehicle string from notes:', fullVehicle);
                
                // Split by " - " to get brand/model part
                const parts = fullVehicle.split(' - ');
                if (parts.length > 1) {
                  const brandModel = parts[1].trim();
                  console.log('✅ Extracted brand/model from notes:', brandModel);
                  return brandModel; // "YAMAHA NMAX" or "YAMANCAL RODA 2"
                }
                // If no " - ", return whole string (might be just brand/model)
                console.log('⚠️ No " - " separator, using full string:', fullVehicle);
                return fullVehicle;
              }
              
              console.log('❌ No vehicle info found in notes or database');
              return 'Belum terdaftar';
            })();
            
            // Extract plate number - MULTIPLE PATTERNS
            const plateNumber = (() => {
              // Priority 1: Try database relation from KV fetch
              if (booking.vehicles?.plate_number) {
                console.log('✅ Plate from database relation:', booking.vehicles.plate_number);
                return booking.vehicles.plate_number;
              }
              
              // Priority 2: Extract from notes "🏍️ Kendaraan: PLAT - BRAND MODEL"
              const vehicleMatch = booking.notes?.match(/🏍️ Kendaraan: ([^\n]+)/) ||
                                   booking.notes?.match(/Kendaraan: ([^\n]+)/);
              if (vehicleMatch) {
                const fullVehicle = vehicleMatch[1].trim();
                // Split by " - " to get plate part
                const parts = fullVehicle.split(' - ');
                if (parts.length > 1) {
                  const plate = parts[0].trim();
                  console.log('✅ Extracted plate from notes:', plate);
                  return plate; // "B 1234 XYZ" or "W 2974 TRF"
                }
                // If no " - ", might be just plate number without brand
                console.log('⚠️ No " - " separator for plate');
                return null;
              }
              
              console.log('❌ No plate number found');
              return null;
            })();
            
            // 🐞 FINAL DEBUG LOG
            console.log('🎯 FINAL EXTRACTED DATA:', {
              job_number: booking.job_number,
              scheduledTime: scheduledTime || 'KOSONG',
              vehicleInfo: vehicleInfo || 'KOSONG',
              plateNumber: plateNumber || 'KOSONG'
            });
            
            // Clean notes
            const cleanNotes = booking.notes
              ?.replace(/👤 Customer: [^\n]+\n?/g, '')
              ?.replace(/🏍️ Kendaraan: [^\n]+\n?/g, '')
              ?.replace(/📦 Paket: [^\n]+\n?/g, '')
              ?.replace(/⏰ Waktu: [^\n]+\n?/g, '')
              ?.replace(/🔧 Teknisi: [^\n]+\n?/g, '')
              ?.replace(/💰 Service Fee: [^\n]+\n?/g, '')
              ?.replace(/💰 Biaya Jasa: [^\n]+\n?/g, '')
              ?.replace(/📝 /g, '')
              ?.trim();
            
            return (
              <div
                key={booking.id}
                className="bg-white border-2 border-orange-200 rounded-xl hover:border-orange-400 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header Section */}
                <div className="flex items-start justify-between p-4 pb-3 border-b border-orange-100 bg-orange-50/50">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg text-gray-900">{booking.job_number}</h4>
                        <Badge variant="outline" className="text-orange-600 border-orange-400 bg-orange-50 text-xs font-medium">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-600">{booking.service_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(booking)}
                      className="border-orange-400 text-orange-600 hover:bg-orange-50 h-9 w-9 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(booking)}
                      className="border-red-400 text-red-600 hover:bg-red-50 h-9 w-9 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Content Section - 2 Column Grid Layout */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    
                    {/* LEFT COLUMN: Booking Info - Separated Cards */}
                    <div className="space-y-3">
                      {/* Jadwal Service */}
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Jadwal Service</p>
                        <p className="text-base font-bold text-gray-900">
                          {booking.scheduled_date ? 
                            new Date(booking.scheduled_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            }) : '-'
                          }
                          {scheduledTime && (
                            <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                              <Clock className="w-3 h-3" />
                              {scheduledTime}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {/* Plat Nomor */}
                      {plateNumber && (
                        <div className="p-4 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-lg">
                          <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wide mb-2">Plat Nomor</p>
                          <p className="text-lg font-black text-gray-900 font-mono tracking-wider">
                            {plateNumber}
                          </p>
                        </div>
                      )}
                      
                      {/* Nama Kendaraan */}
                      <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg">
                        <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2">Nama Kendaraan</p>
                        {vehicleInfo && vehicleInfo !== 'Belum terdaftar' ? (
                          <p className="text-base font-bold text-gray-900 uppercase">{vehicleInfo}</p>
                        ) : (
                          <p className="text-sm text-amber-600 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Kendaraan belum terdaftar
                          </p>
                        )}
                      </div>
                      
                      {/* Catatan */}
                      {cleanNotes && (
                        <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Catatan</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{cleanNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* RIGHT COLUMN: QR Code */}
                    {booking.qr_code_token && (
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                        <div className="space-y-6">
                          {/* QR Code */}
                          <div className="flex flex-col items-center">
                            <div className="bg-white p-3 rounded-lg shadow-md border border-purple-200 mb-3">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(booking.qr_code_token)}`}
                                alt="QR Code"
                                className="w-[140px] h-[140px] md:w-[160px] md:h-[160px]"
                              />
                            </div>
                            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">QR CODE</p>
                          </div>
                          
                          {/* Kode Credential */}
                          <div>
                            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">Kode Credential</p>
                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-3 rounded-lg border-2 border-dashed border-purple-400">
                              <p className="text-center font-mono font-bold text-base md:text-lg text-purple-700 tracking-wider break-all">
                                {booking.qr_code_token}
                              </p>
                            </div>
                          </div>
                          
                          {/* Cara Pakai */}
                          <div>
                            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">Cara Pakai</p>
                            <p className="text-xs text-purple-600 leading-relaxed mb-3">
                              Screenshot atau simpan kode ini untuk check-in saat datang ke bengkel
                            </p>
                            <button
                              onClick={async () => {
                                // ✅ IMPROVED: Check clipboard permission first before attempting
                                const copyToClipboard = async (text: string) => {
                                  // Method 1: Try modern Clipboard API (only if definitely available)
                                  if (navigator.clipboard && window.isSecureContext) {
                                    try {
                                      await navigator.clipboard.writeText(text);
                                      return true;
                                    } catch (err) {
                                      // Silently fail and try fallback
                                      console.log('Clipboard API not available, using fallback');
                                    }
                                  }
                                  
                                  // Method 2: Fallback using document.execCommand
                                  try {
                                    const textarea = document.createElement('textarea');
                                    textarea.value = text;
                                    textarea.style.position = 'fixed';
                                    textarea.style.left = '-9999px';
                                    textarea.style.top = '-9999px';
                                    textarea.setAttribute('readonly', '');
                                    document.body.appendChild(textarea);
                                    
                                    // Select text
                                    textarea.select();
                                    textarea.setSelectionRange(0, text.length);
                                    
                                    // Try to copy
                                    const successful = document.execCommand('copy');
                                    document.body.removeChild(textarea);
                                    
                                    if (successful) {
                                      return true;
                                    }
                                  } catch (err) {
                                    console.log('Fallback copy method also failed');
                                  }
                                  
                                  return false;
                                };
                                
                                const success = await copyToClipboard(booking.qr_code_token);
                                
                                if (success) {
                                  toast.success('✅ Kode berhasil disalin!');
                                } else {
                                  // Show code in toast for manual copy
                                  toast.info('Kode Anda: ' + booking.qr_code_token, {
                                    duration: 15000,
                                    description: 'Salin kode secara manual dari toast ini'
                                  });
                                }
                              }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Salin Kode
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom Status Bar */}
                  <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-100 px-3 py-2.5 rounded-lg border border-orange-200">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">Booking ini menunggu validasi admin. Anda masih bisa edit atau batalkan.</span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Ubah jadwal atau catatan booking Anda
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">{selectedBooking.job_number}</p>
                <p className="text-sm text-gray-600">{selectedBooking.service_type}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Service *</Label>
                  <Input
                    type="date"
                    min={minDate}
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Waktu Service</Label>
                  <Select value={editTime} onValueChange={setEditTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih waktu..." />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Catatan (Opsional)</Label>
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Keluhan atau catatan tambahan..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={submitting}
              className="bg-[#2A5C82] hover:bg-[#1e4460]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}