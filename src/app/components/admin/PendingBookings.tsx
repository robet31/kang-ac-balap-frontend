import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock, User, Calendar, Package, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

export function PendingBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingBookings();
    
    // Auto-refresh setiap 10 detik untuk real-time updates
    const interval = setInterval(fetchPendingBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter hanya pending bookings
        const pending = (data.data || []).filter((b: any) => b.status === 'pending');
        setBookings(pending);
      }
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId: string, jobNumber: string) => {
    setProcessing(bookingId);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/${bookingId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'scheduled',
            notes: 'Booking disetujui oleh admin'
          })
        }
      );

      if (response.ok) {
        toast.success(`✅ Booking ${jobNumber} disetujui!`);
        toast.success('📱 Customer akan menerima notifikasi');
        fetchPendingBookings(); // Refresh list
      } else {
        throw new Error('Failed to approve booking');
      }
    } catch (error: any) {
      console.error('Error approving booking:', error);
      toast.error(`❌ Gagal menyetujui booking: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectBooking = async (bookingId: string, jobNumber: string) => {
    if (!confirm(`Yakin ingin menolak dan hapus booking ${jobNumber}?\n\nBooking ini akan dihapus permanen dari sistem.`)) return;
    
    setProcessing(bookingId);
    
    try {
      console.log('🗑️ Deleting rejected booking:', jobNumber);
      
      // ✅ DELETE booking instead of setting status to cancelled
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/${jobNumber}`,
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
        
        toast.success(`✅ Booking ${jobNumber} ditolak dan dihapus dari sistem`);
        toast.success('📱 Customer akan menerima notifikasi');
        fetchPendingBookings(); // Refresh list
      } else {
        const error = await response.json();
        console.error('❌ Failed to delete booking:', error);
        throw new Error(error.error || 'Failed to reject booking');
      }
    } catch (error: any) {
      console.error('Error rejecting booking:', error);
      toast.error(`❌ Gagal menolak booking: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#2A5C82]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Pending Bookings</h2>
          <p className="text-gray-600">Validasi booking dari customer</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          {bookings.length} Menunggu Validasi
        </Badge>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak Ada Booking Pending
            </h3>
            <p className="text-gray-600 text-center">
              Semua booking telah divalidasi
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-2 border-orange-400 bg-orange-50/50 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{booking.job_number}</CardTitle>
                      <Badge className="bg-orange-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <CardDescription>
                      Dibuat: {new Date(booking.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#2A5C82]">
                      Rp {(booking.total_amount || 0).toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-600">Total Amount</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2A5C82]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-[#2A5C82]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Customer</p>
                      <p className="font-semibold text-sm">{booking.customer?.full_name || 'Customer'}</p>
                      <p className="text-xs text-gray-500">{booking.customer?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Jadwal Service</p>
                      <p className="font-semibold text-sm">
                        {booking.scheduled_date ? new Date(booking.scheduled_date).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Belum ditentukan'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service & Vehicle */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Service Package</p>
                    <p className="font-semibold text-sm">{booking.service?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">Labor: Rp {(booking.labor_cost || 0).toLocaleString('id-ID')}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Kendaraan</p>
                    <p className="font-semibold text-sm">
                      {booking.vehicle 
                        ? `${booking.vehicle.brand} ${booking.vehicle.model}` 
                        : 'Belum terdaftar'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.vehicle?.plate_number || '-'}
                    </p>
                  </div>
                </div>

                {/* Items */}
                {booking.job_parts && booking.job_parts.length > 0 && (
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-[#2A5C82]" />
                      <p className="font-semibold text-sm">Items yang Digunakan</p>
                    </div>
                    <div className="space-y-2">
                      {booking.job_parts.map((part: any) => (
                        <div key={part.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2A5C82]" />
                            <span className="text-gray-700">{part.inventory?.part_name || 'Unknown Item'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-600">{part.quantity_used}x</span>
                            <span className="font-semibold text-[#2A5C82]">
                              Rp {(part.subtotal || 0).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span>Parts Cost:</span>
                          <span className="text-[#2A5C82]">
                            Rp {(booking.parts_cost || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Notes */}
                {booking.customer_notes && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-blue-600 font-semibold mb-1">Catatan Customer:</p>
                        <p className="text-sm text-gray-700">{booking.customer_notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => handleRejectBooking(booking.id, booking.job_number)}
                    disabled={processing === booking.id}
                  >
                    {processing === booking.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    Tolak
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    onClick={() => handleApproveBooking(booking.id, booking.job_number)}
                    disabled={processing === booking.id}
                  >
                    {processing === booking.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Setujui Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}