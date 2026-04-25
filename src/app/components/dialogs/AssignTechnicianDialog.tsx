import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Users, Star, Wrench, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '../../utils/supabase/client';

interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  activeJobs: number;
  completedJobs: number;
  rating: number;
  status: string;
}

interface Job {
  id: string;
  job_number: string;
  jobNumber?: string; // backward compatibility
  customer?: string;
  customer_name?: string;
  vehicle?: string;
  vehicles?: any;
  service?: string;
  service_type?: string;
  package_name?: string;
  scheduled_date?: string;
  scheduledDate?: string;
  amount: number;
  notes?: string;
}

interface AssignTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  technicians: Technician[];
  onAssign?: (jobId: string, technicianId: string, notes: string) => void;
  onSuccess?: () => void; // Callback untuk refresh data
}

export function AssignTechnicianDialog({ 
  open, 
  onOpenChange, 
  job, 
  technicians,
  onAssign,
  onSuccess
}: AssignTechnicianDialogProps) {
  const [selectedTechId, setSelectedTechId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleAssign = async () => {
    if (!selectedTechId) {
      toast.error('Pilih teknisi terlebih dahulu!');
      return;
    }

    if (!job) return;

    setSubmitting(true);

    try {
      console.log('🔄 Starting technician assignment...');
      console.log('Job ID:', job.id);
      console.log('Technician ID:', selectedTechId);
      console.log('Notes:', notes);

      // Find technician name
      const selectedTech = technicians.find(t => t.id === selectedTechId);
      const technicianName = selectedTech?.name || 'Unknown Technician';

      console.log('👤 Technician name:', technicianName);

      // Prepare notes with technician info
      let finalNotes = `🔧 Teknisi: ${technicianName}`;
      if (notes && notes.trim()) {
        finalNotes += `\n\n${notes.trim()}`;
      }
      
      // Keep existing notes if any
      if (job.notes && job.notes.trim()) {
        finalNotes += `\n\n--- Catatan sebelumnya ---\n${job.notes}`;
      }

      // Update job status di database
      const updateData = {
        status: 'scheduled' as const,
        notes: finalNotes,
        updated_at: new Date().toISOString()
      };

      console.log('📤 Update data:', updateData);

      const { data, error: updateError } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', job.id)
        .select();

      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw updateError;
      }

      console.log('✅ Update successful:', data);

      toast.success(`✅ Teknisi ${technicianName} berhasil di-assign!`, {
        description: `Status booking telah diupdate ke "Dijadwalkan"`
      });
      
      // Call legacy onAssign if provided (for backward compatibility)
      if (onAssign) {
        onAssign(job.id, selectedTechId, notes);
      }

      // Call onSuccess callback to refresh data
      if (onSuccess) {
        console.log('🔄 Triggering refresh callback...');
        onSuccess();
      }
      
      // Reset form and close
      setSelectedTechId('');
      setNotes('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('❌ Error assigning technician:', error);
      toast.error(`❌ Gagal assign teknisi`, {
        description: error.message || 'Terjadi kesalahan tidak terduga'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return null;

  const availableTechs = technicians.filter(t => t.status === 'active' && t.activeJobs < 5);
  const selectedTech = technicians.find(t => t.id === selectedTechId);

  // Get proper values from job (support both old and new field names)
  const jobNumber = job.job_number || job.jobNumber || 'N/A';
  const customerName = job.customer_name || job.customer || 'N/A';
  const vehicleInfo = job.vehicles 
    ? `${job.vehicles.plate_number} - ${job.vehicles.brand} ${job.vehicles.model}`
    : job.vehicle || 'N/A';
  const serviceType = job.package_name || job.service_type || job.service || 'N/A';
  const scheduledDate = job.scheduled_date || job.scheduledDate || new Date().toISOString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="w-6 h-6 text-primary" />
            Assign Teknisi
          </DialogTitle>
          <DialogDescription>
            Tugaskan teknisi untuk mengerjakan job ini
          </DialogDescription>
        </DialogHeader>

        {/* Job Details */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 space-y-3 border-2 border-blue-200">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            Detail Job Order
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded p-2">
              <span className="text-gray-600 text-xs">Job Number</span>
              <p className="font-bold text-gray-900">{jobNumber}</p>
            </div>
            <div className="bg-white rounded p-2">
              <span className="text-gray-600 text-xs">Customer</span>
              <p className="font-semibold text-gray-900">{customerName}</p>
            </div>
            <div className="bg-white rounded p-2">
              <span className="text-gray-600 text-xs">Kendaraan</span>
              <p className="font-semibold text-gray-900">{vehicleInfo}</p>
            </div>
            <div className="bg-white rounded p-2">
              <span className="text-gray-600 text-xs">Paket Service</span>
              <p className="font-semibold text-primary">{serviceType}</p>
            </div>
            <div className="bg-white rounded p-2">
              <span className="text-gray-600 text-xs">Jadwal</span>
              <p className="font-semibold text-gray-900 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(scheduledDate).toLocaleDateString('id-ID', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <span className="text-gray-600 text-xs">Total Biaya</span>
              <p className="font-bold text-green-600">Rp {job.amount.toLocaleString('id-ID')}</p>
            </div>
          </div>
          {job.notes && (
            <div className="pt-2 border-t border-blue-200 bg-white rounded p-2">
              <span className="text-gray-600 text-xs">Catatan Customer</span>
              <p className="text-sm text-gray-900 mt-1">{job.notes}</p>
            </div>
          )}
        </div>

        {/* Select Technician */}
        <div className="space-y-3">
          <Label htmlFor="technician" className="text-base font-semibold">
            Pilih Teknisi ({availableTechs.length} tersedia)
          </Label>
          
          {availableTechs.length === 0 ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-700">⚠️ Tidak ada teknisi yang tersedia saat ini</p>
            </div>
          ) : (
            <Select value={selectedTechId} onValueChange={setSelectedTechId}>
              <SelectTrigger id="technician" className="w-full">
                <SelectValue placeholder="-- Pilih Teknisi --" />
              </SelectTrigger>
              <SelectContent>
                {availableTechs.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{tech.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="text-xs">{tech.specialization}</Badge>
                        <span className="text-xs text-gray-600">({tech.activeJobs} active)</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Selected Tech Details */}
          {selectedTech && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-green-900">Teknisi Terpilih</h5>
                <Badge className="bg-green-500">
                  <Star className="w-3 h-3 mr-1" />
                  {selectedTech.rating}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Nama:</span>
                  <p className="font-medium text-gray-900">{selectedTech.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Spesialisasi:</span>
                  <p className="font-medium text-gray-900">{selectedTech.specialization}</p>
                </div>
                <div>
                  <span className="text-gray-600">Job Aktif:</span>
                  <p className="font-medium text-gray-900">{selectedTech.activeJobs} jobs</p>
                </div>
                <div>
                  <span className="text-gray-600">Job Selesai:</span>
                  <p className="font-medium text-gray-900">{selectedTech.completedJobs} jobs</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-base font-semibold">
            Catatan Admin (Opsional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Tambahkan catatan khusus untuk teknisi..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedTechId('');
              setNotes('');
              onOpenChange(false);
            }}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedTechId || submitting}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Assign Teknisi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}