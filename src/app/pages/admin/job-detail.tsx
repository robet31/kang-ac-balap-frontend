import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, 
  Wrench, 
  User, 
  Calendar, 
  DollarSign, 
  FileText,
  Info,
  Package,
  PlayCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { createClient } from '../../utils/supabase/client';

interface JobDetailProps {
  onBack: () => void;
  job: any;
}

export default function JobDetail({ onBack, job }: JobDetailProps) {
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'Menunggu', className: 'bg-gray-500' },
      scheduled: { label: 'Dijadwalkan', className: 'bg-blue-500' },
      in_progress: { label: 'Sedang Dikerjakan', className: 'bg-[#F59E0B]' },
      awaiting_payment: { label: 'Menunggu Pembayaran', className: 'bg-orange-500' },
      completed: { label: 'Selesai', className: 'bg-[#10B981]' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.className} text-white border-0`}>{config.label}</Badge>;
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true);
      console.log('🔄 Updating job status:', { jobId: job.id, newStatus });
      
      const { data, error } = await supabase
        .from('job_orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Status updated successfully:', data);
      toast.success('✅ Status berhasil diupdate!');
      
      // Update local job object to reflect changes immediately
      job.status = newStatus;
      
      // Go back to dashboard (real-time will update the list)
      setTimeout(() => {
        onBack();
      }, 800);
      
    } catch (err: any) {
      console.error('❌ Error updating status:', err);
      toast.error(`❌ Gagal update status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Parse items from notes if available
  const parseItems = () => {
    try {
      return job?.items || [];
    } catch {
      return [];
    }
  };

  const items = parseItems();
  const serviceFee = 25000; // Fixed service fee for admin
  const sparepartsTotal = items.reduce((sum: number, item: any) => {
    if (item.item_type === 'part') {
      return sum + (item.total_price || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Detail Job Order</h1>
                <p className="text-xs text-gray-500">{job?.job_number || job?.jobNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {/* Status Banner with Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{job?.job_number || job?.jobNumber}</h3>
                <p className="text-sm text-gray-600">{job?.service_type || job?.service}</p>
              </div>
              {getStatusBadge(job?.status)}
            </div>
            
            {/* Status Action Buttons */}
            {job?.status === 'scheduled' && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Update Status Job</p>
                <Button
                  onClick={() => handleStatusUpdate('in_progress')}
                  disabled={updating}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-12"
                >
                  {updating ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <PlayCircle className="w-5 h-5 mr-2" />
                  )}
                  Mulai Service
                </Button>
              </div>
            )}
            
            {job?.status === 'in_progress' && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Update Status Job</p>
                <Button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={updating}
                  className="w-full bg-green-500 hover:bg-green-600 text-white h-12"
                >
                  {updating ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                  )}
                  Selesai Dikerjakan & Sudah Dibayar
                </Button>
              </div>
            )}
            
            {/* Temporarily removed awaiting_payment flow until database constraint is fixed */}
            {/* TODO: Run /database/FIX_STATUS_CONSTRAINT.sql to enable awaiting_payment status */}
            {/* {job?.status === 'awaiting_payment' && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Update Status Job</p>
                <Button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={updating}
                  className="w-full bg-green-500 hover:bg-green-600 text-white h-12"
                >
                  {updating ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                  )}
                  Tandai Sudah Dibayar
                </Button>
              </div>
            )} */}
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-900">Informasi Customer</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nama Customer</p>
                <p className="font-bold text-gray-900">
                  {job?.customer_name || job?.customerName || job?.customer || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">No. Telepon</p>
                <p className="font-bold text-gray-900">
                  {job?.customer_phone || job?.customerPhone || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-900">Informasi Kendaraan</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Kendaraan</p>
                <p className="font-bold text-gray-900">
                  {job?.vehicle_brand && job?.vehicle_model 
                    ? `${job.vehicle_brand} ${job.vehicle_model}`
                    : job?.vehicle_name || job?.vehicle || '-'
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Plat Nomor</p>
                <p className="font-bold text-gray-900">
                  {job?.vehicle_plate || job?.plateNumber || '-'}
                </p>
              </div>
              {job?.vehicle_year && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tahun</p>
                  <p className="font-bold text-gray-900">{job.vehicle_year}</p>
                </div>
              )}
              {job?.vehicle_color && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Warna</p>
                  <p className="font-bold text-gray-900">{job.vehicle_color}</p>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-900">Jadwal Service</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal</p>
                <p className="font-bold text-gray-900">
                  {job?.scheduled_date || job?.scheduledDate || job?.date || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Waktu</p>
                <p className="font-bold text-gray-900">
                  {job?.scheduled_time || job?.scheduledTime || job?.time || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Teknisi</p>
                <p className="font-bold text-gray-900">
                  {job?.technician_name || job?.technician || 'Belum ditugaskan'}
                </p>
              </div>
            </div>
          </div>

          {/* Items/Spareparts */}
          {items.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-900">Sparepart yang Digunakan</h3>
              </div>
              <div className="space-y-2">
                {items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.item_name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x Rp {(item.unit_price || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <p className="font-bold text-orange-600">
                      Rp {(item.total_price || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-orange-500 px-5 py-3">
              <div className="flex items-center gap-2 text-white">
                <DollarSign className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Ringkasan Biaya</h3>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Biaya Jasa Service</span>
                <span className="font-bold text-orange-600">
                  Rp {serviceFee.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Total Sparepart ({items.length} item)</span>
                <span className="font-bold text-orange-600">
                  Rp {sparepartsTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">TOTAL TAGIHAN</span>
                  <span className="font-bold text-xl text-green-600">
                    Rp {(serviceFee + sparepartsTotal).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes - Only show if there are actual custom notes */}
          {(job?.notes || job?.customer_notes || job?.additional_notes) && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-900">Catatan Tambahan</h3>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {job?.notes || job?.customer_notes || job?.additional_notes}
              </p>
            </div>
          )}

          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 text-base font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}