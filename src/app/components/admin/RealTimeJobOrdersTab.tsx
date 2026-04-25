import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import {
  Wrench,
  Users,
  Package,
  Calendar,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  Car,
  Bike,
  QrCode
} from 'lucide-react';
import { useRealtimeJobOrders } from '../../hooks/useRealtimeJobOrders';
import { toast } from 'sonner@2.0.3';
import { createClient } from '../../utils/supabase/client';

interface RealTimeJobOrdersTabProps {
  onAssignClick: (job: any) => void;
  onViewDetails: (job: any) => void;
  technicians?: any[];
  onCreateJob?: () => void;
  onScanQR?: () => void;
}

export function RealTimeJobOrdersTab({ 
  onAssignClick, 
  onViewDetails,
  technicians = [],
  onCreateJob,
  onScanQR
}: RealTimeJobOrdersTabProps) {
  const { jobs, loading, error, refreshJobs } = useRealtimeJobOrders();
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get filtered jobs
  const filteredJobs = statusFilter === 'all' 
    ? jobs 
    : jobs.filter(j => j.status === statusFilter);

  // Count by status
  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const scheduledCount = jobs.filter(j => j.status === 'scheduled').length;
  const inProgressCount = jobs.filter(j => j.status === 'in_progress').length;
  const completedCount = jobs.filter(j => j.status === 'completed' || j.status === 'awaiting_payment').length;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'Menunggu', className: 'bg-gray-500' },
      scheduled: { label: 'Dijadwalkan', className: 'bg-blue-500' },
      in_progress: { label: 'Sedang Dikerjakan', className: 'bg-[#F59E0B]' },
      awaiting_payment: { label: 'Menunggu Pembayaran', className: 'bg-orange-500' },
      completed: { label: 'Selesai', className: 'bg-[#10B981]' },
      cancelled: { label: 'Dibatalkan', className: 'bg-red-500' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.className} text-white border-0`}>{config.label}</Badge>;
  };

  // Helper function to extract technician name from notes
  const getTechnicianFromNotes = (notes: string | null): string | null => {
    if (!notes) return null;
    
    // Look for pattern: "🔧 Teknisi: [Name]"
    const match = notes.match(/🔧 Teknisi: ([^\n]+)/);
    return match ? match[1].trim() : null;
  };

  // ✅ Helper function to calculate progress based on status
  const getProgressByStatus = (status: string, currentProgress?: number): number => {
    const statusProgressMap: Record<string, number> = {
      'pending': 0,           // Baru masuk
      'scheduled': 20,        // Dijadwalkan
      'in_progress': 50,      // Sedang dikerjakan
      'awaiting_payment': 80, // Menunggu pembayaran
      'completed': 100,       // Selesai
      'cancelled': 0          // Dibatalkan
    };
    
    // Return mapped progress or fallback to current progress or 0
    return statusProgressMap[status] ?? currentProgress ?? 0;
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Yakin ingin menghapus job order ini?')) return;

    try {
      setDeleting(jobId);
      
      const { error } = await supabase
        .from('job_orders')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast.success('✅ Job berhasil dihapus!');
      refreshJobs();
    } catch (err: any) {
      console.error('Error deleting job:', err);
      toast.error(`❌ Gagal menghapus job: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) throw error;

      toast.success('✅ Status berhasil diupdate!');
      refreshJobs();
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error(`❌ Gagal update status: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="border-2 border-red-200 bg-red-50 max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-900 mb-2">Error Loading Data</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Orders Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            {jobs.length} total orders · <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Real-time auto-sync</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={onScanQR}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan QR Code
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={onCreateJob}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Job Baru
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className={statusFilter === 'all' ? 'bg-primary' : ''}
        >
          Semua ({jobs.length})
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('pending')}
          className={statusFilter === 'pending' ? 'bg-gray-500' : ''}
        >
          Menunggu ({pendingCount})
        </Button>
        <Button
          variant={statusFilter === 'scheduled' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('scheduled')}
          className={statusFilter === 'scheduled' ? 'bg-blue-500' : ''}
        >
          Dijadwalkan ({scheduledCount})
        </Button>
        <Button
          variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('in_progress')}
          className={statusFilter === 'in_progress' ? 'bg-[#F59E0B]' : ''}
        >
          Sedang Dikerjakan ({inProgressCount})
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('completed')}
          className={statusFilter === 'completed' ? 'bg-[#10B981]' : ''}
        >
          Selesai ({completedCount})
        </Button>
      </div>

      {/* Pending Bookings Alert */}
      {pendingCount > 0 && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-orange-900 mb-1">
                      {pendingCount} Booking Baru Menunggu
                    </h4>
                    <p className="text-sm text-orange-700">
                      Segera assign teknisi untuk melanjutkan proses service
                    </p>
                  </div>
                  <Badge className="bg-orange-600 text-white px-3 py-1 text-sm font-medium">
                    Urgent
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {jobs.filter(j => j.status === 'pending').map((job) => {
                    // Extract all info once for reuse
                    const customerName = (() => {
                      if (job.users?.full_name) return job.users.full_name;
                      if (job.users?.email) return job.users.email;
                      const match = job.notes?.match(/👤 Customer: ([^\n]+)/);
                      return match ? match[1].trim() : 'Walk-in Customer';
                    })();
                    
                    const vehicleInfo = (() => {
                      // Try database first
                      if (job.vehicles?.brand && job.vehicles?.model) {
                        return `${job.vehicles.brand} ${job.vehicles.model}`;
                      }
                      // Extract from notes: "🏍️ Kendaraan: B 1234 XYZ - Yamaha NMAX"
                      const match = job.notes?.match(/🏍️ Kendaraan: ([^\n]+)/);
                      if (match) {
                        const fullVehicle = match[1].trim();
                        // Try to extract just the brand/model part (after the dash)
                        const parts = fullVehicle.split(' - ');
                        return parts.length > 1 ? parts[1] : fullVehicle;
                      }
                      return 'Walk-in';
                    })();
                    
                    const plateNumber = (() => {
                      // Try database first
                      if (job.vehicles?.plate_number) return job.vehicles.plate_number;
                      // Extract from notes: "🏍️ Kendaraan: B 1234 XYZ - Yamaha NMAX"
                      const match = job.notes?.match(/🏍️ Kendaraan: ([^\n]+)/);
                      if (match) {
                        const fullVehicle = match[1].trim();
                        // Extract plate (before the dash)
                        const parts = fullVehicle.split(' - ');
                        return parts.length > 1 ? parts[0] : null;
                      }
                      return null;
                    })();
                    
                    const packageName = (() => {
                      if (job.package_name) return job.package_name;
                      if (job.service_type) return job.service_type;
                      const match = job.notes?.match(/📦 Paket: ([^\n]+)/);
                      return match ? match[1].trim() : 'Custom Service';
                    })();
                    
                    const scheduledTime = (() => {
                      // First, try to extract from notes
                      const match = job.notes?.match(/⏰ Waktu: ([^\n]+)/);
                      if (match) return match[1].trim();
                      
                      // Fallback: extract time from scheduled_date if it exists
                      if (job.scheduled_date) {
                        const date = new Date(job.scheduled_date);
                        const hours = date.getHours();
                        const minutes = date.getMinutes();
                        
                        // Only show time if it's not midnight (00:00)
                        if (hours !== 0 || minutes !== 0) {
                          return date.toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                          });
                        }
                      }
                      
                      return null;
                    })();
                    
                    const amount = (() => {
                      // If amount exists and not zero, use it
                      if (job.amount && job.amount > 0) return job.amount;
                      
                      // Try to extract from notes
                      const serviceFeeMatch = job.notes?.match(/💰 (?:Service Fee|Biaya Jasa): Rp ([0-9.,]+)/);
                      if (serviceFeeMatch) {
                        const amountStr = serviceFeeMatch[1].replace(/[,.]/g, '');
                        return parseInt(amountStr) || 0;
                      }
                      
                      return 0;
                    })();
                    
                    return (
                      <motion.div 
                        key={job.id} 
                        className="bg-gradient-to-br from-white to-orange-50/30 rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between p-5 pb-4 border-b border-orange-100 bg-white/50">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                              <Wrench className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-gray-900">{job.job_number}</h5>
                              <Badge className="bg-orange-500 text-white text-xs font-medium mt-1">Menunggu Assignment</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">
                              Rp {amount.toLocaleString('id-ID')}
                            </div>
                            <div className="text-xs text-gray-500 font-medium mt-1">
                              {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : 'No date'}
                            </div>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 space-y-4">
                          {/* Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-500 mb-1">Customer</div>
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {customerName}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 hover:border-cyan-300 transition-colors">
                              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Bike className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-cyan-700 mb-1">Kendaraan</div>
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {vehicleInfo}
                                </div>
                                {plateNumber && (
                                  <div className="text-xs text-cyan-600 font-mono font-bold mt-0.5">
                                    {plateNumber}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-colors">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-500 mb-1">Paket Service</div>
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {packageName}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-colors">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 text-orange-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-500 mb-1">Jadwal</div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {job.scheduled_date 
                                    ? new Date(job.scheduled_date).toLocaleDateString('id-ID', { 
                                        weekday: 'short', 
                                        day: 'numeric', 
                                        month: 'short',
                                        year: 'numeric'
                                      })
                                    : 'Belum dijadwalkan'
                                  }
                                  {scheduledTime && ` • ${scheduledTime}`}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notes if exists */}
                          {(() => {
                            const cleanNotes = job.notes
                              ?.replace(/👤 Customer: [^\n]+\n?/g, '')
                              ?.replace(/🏍️ Kendaraan: [^\n]+\n?/g, '')
                              ?.replace(/📦 Paket: [^\n]+\n?/g, '')
                              ?.replace(/⏰ Waktu: [^\n]+\n?/g, '')
                              ?.replace(/💰 Service Fee: [^\n]+\n?/g, '')
                              ?.replace(/💰 Biaya Jasa: [^\n]+\n?/g, '')
                              ?.replace(/🔧 Teknisi: [^\n]+\n?/g, '')
                              ?.trim();
                            
                            return cleanNotes ? (
                              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border-2 border-amber-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs font-bold text-amber-900 mb-1.5">Catatan Penting:</div>
                                    <div className="text-sm text-amber-800 leading-relaxed">{cleanNotes}</div>
                                  </div>
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>

                        {/* Action Buttons - Better Layout */}
                        <div className="flex items-center gap-3 p-5 pt-4 bg-white/50 border-t border-orange-100">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all font-semibold"
                            onClick={() => onAssignClick(job)}
                            size="lg"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Assign Teknisi
                          </Button>
                          <Button 
                            variant="outline"
                            size="lg"
                            className="border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => onViewDetails(job)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline"
                            size="lg"
                            className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deleting === job.id}
                          >
                            {deleting === job.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Jobs Table */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kendaraan</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Tidak ada job order untuk filter ini</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr 
                      key={job.id} 
                      className={`hover:bg-gray-50 transition-colors ${job.status === 'pending' ? 'bg-orange-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.job_number}</div>
                        <div className="text-xs text-gray-500">
                          {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString('id-ID') : 'No date'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">{job.vehicles?.plate_number || '-'}</div>
                        <div className="text-xs text-gray-500">{job.vehicles?.brand} {job.vehicles?.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job.package_name || job.service_type}</div>
                        {getTechnicianFromNotes(job.notes) && (
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3" />
                            {getTechnicianFromNotes(job.notes)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(job.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${getProgressByStatus(job.status, job.progress)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{getProgressByStatus(job.status, job.progress)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rp {(job.amount || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {job.status === 'pending' ? (
                            <Button 
                              key={`assign-${job.id}`}
                              variant="default" 
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => onAssignClick(job)}
                            >
                              <Users className="w-4 h-4 mr-1" />
                              Assign
                            </Button>
                          ) : job.status === 'scheduled' ? (
                            <div key={`scheduled-${job.id}`} className="flex items-center gap-2">
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => onViewDetails(job)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Kelola
                              </Button>
                            </div>
                          ) : job.status === 'in_progress' ? (
                            <Button 
                              key={`progress-${job.id}`}
                              variant="default" 
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={() => onViewDetails(job)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Kelola
                            </Button>
                          ) : job.status === 'awaiting_payment' ? (
                            <div key={`payment-${job.id}`} className="flex items-center gap-2">
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleStatusUpdate(job.id, 'completed')}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Bayar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => onViewDetails(job)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              key={`kelola-${job.id}`}
                              variant="default" 
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={() => onViewDetails(job)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Kelola Job
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deleting === job.id}
                          >
                            {deleting === job.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}