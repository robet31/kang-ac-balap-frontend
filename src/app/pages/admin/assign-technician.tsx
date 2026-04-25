import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, 
  UserCheck, 
  Info,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Calendar,
  User
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

interface AssignTechnicianProps {
  onBack: () => void;
  onSuccess: () => void;
  job: any;
  technicians: any[];
}

export default function AssignTechnician({ onBack, onSuccess, job, technicians }: AssignTechnicianProps) {
  const [selectedTechId, setSelectedTechId] = useState<string>('');
  
  // ✅ Filter out structured data from notes, only keep custom notes
  const getCleanNotes = (rawNotes: string | null): string => {
    if (!rawNotes) return '';
    
    return rawNotes
      .replace(/👤 Customer: [^\n]+\n?/g, '')
      .replace(/🏍️ Kendaraan: [^\n]+\n?/g, '')
      .replace(/📦 Paket: [^\n]+\n?/g, '')
      .replace(/⏰ Waktu: [^\n]+\n?/g, '')
      .replace(/💰 Service Fee: [^\n]+\n?/g, '')
      .replace(/💰 Biaya Jasa: [^\n]+\n?/g, '')
      .replace(/🔧 Teknisi: [^\n]+\n?/g, '')
      .trim();
  };
  
  // ✅ Extract vehicle info from job data or notes
  const getVehicleInfo = (): string => {
    // Try database first
    if (job?.vehicles?.brand && job?.vehicles?.model) {
      const plate = job.vehicles.plate_number ? ` (${job.vehicles.plate_number})` : '';
      return `${job.vehicles.brand} ${job.vehicles.model}${plate}`;
    }
    
    // Try vehicle_name field
    if (job?.vehicle_name) return job.vehicle_name;
    
    // Extract from notes: "🏍️ Kendaraan: B 1234 XYZ - Yamaha NMAX"
    const match = job?.notes?.match(/🏍️ Kendaraan: ([^\n]+)/);
    if (match) {
      return match[1].trim();
    }
    
    return '-';
  };
  
  // ✅ Format scheduled date
  const getScheduledDate = (): string => {
    const dateStr = job?.scheduled_date || job?.scheduledDate;
    if (!dateStr) return 'Belum dijadwalkan';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };
  
  // ✅ Get total amount
  const getTotalAmount = (): number => {
    if (job?.amount && job.amount > 0) return job.amount;
    
    // Try to extract from notes
    const serviceFeeMatch = job?.notes?.match(/💰 (?:Service Fee|Biaya Jasa): Rp ([0-9.,]+)/);
    if (serviceFeeMatch) {
      const amountStr = serviceFeeMatch[1].replace(/[,.]/g, '');
      return parseInt(amountStr) || 0;
    }
    
    return 0;
  };
  
  const [notes, setNotes] = useState(getCleanNotes(job?.notes));
  const [submitting, setSubmitting] = useState(false);
  const [realTimeTechnicians, setRealTimeTechnicians] = useState<any[]>([]);
  const [loadingTechs, setLoadingTechs] = useState(false);

  // Fetch real-time technicians
  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    setLoadingTechs(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/prefix/technician_`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRealTimeTechnicians(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    } finally {
      setLoadingTechs(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTechId) {
      toast.error('❌ Mohon pilih teknisi terlebih dahulu!');
      return;
    }

    setSubmitting(true);

    try {
      const selectedTech = activeTechnicians.find(t => t.id === selectedTechId);
      
      // Update job with technician assignment
      const updatePayload = {
        ...job,
        technician_id: selectedTechId,
        technician_name: selectedTech?.name,
        status: 'scheduled',
        notes: notes || job.notes,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/${job.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatePayload)
        }
      );

      if (!response.ok) {
        throw new Error('Gagal assign teknisi');
      }

      toast.success(`✅ ${selectedTech?.name} berhasil ditugaskan untuk ${job?.job_number}!`);
      onSuccess();
    } catch (error: any) {
      console.error('Error assigning technician:', error);
      toast.error(`❌ ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Use real-time technicians if available, otherwise fallback to props
  const techList = realTimeTechnicians.length > 0 ? realTimeTechnicians : technicians;
  const activeTechnicians = techList.filter(t => t.status === 'active');

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
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Assign Teknisi</h1>
                <p className="text-xs text-gray-500">Tugaskan teknisi untuk job order</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="bg-blue-500 rounded-xl p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-1">Assign Teknisi ke Job Order</h4>
                <p className="text-sm text-blue-50 leading-relaxed">
                  Pilih teknisi yang tersedia dan aktif untuk mengerjakan job order ini.
                </p>
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-900">Informasi Job Order</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Job Number</p>
                <p className="font-bold text-gray-900">{job?.job_number || job?.jobNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Customer</p>
                <p className="font-bold text-gray-900">{job?.customer_name || job?.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Kendaraan</p>
                <p className="font-bold text-gray-900">{getVehicleInfo()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Service</p>
                <p className="font-bold text-gray-900">{job?.service_type || job?.service}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal</p>
                <p className="font-bold text-gray-900">{getScheduledDate()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total</p>
                <p className="font-bold text-orange-600">Rp {getTotalAmount().toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* Technician Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-900">Pilih Teknisi *</h3>
            </div>

            {loadingTechs ? (
              <div className="text-center py-12">
                <div className="inline-block w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-500">Loading teknisi...</p>
              </div>
            ) : activeTechnicians.length === 0 ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800">
                    <strong>Tidak ada teknisi aktif!</strong> Mohon tambahkan atau aktifkan teknisi terlebih dahulu.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {activeTechnicians.map((tech) => (
                  <motion.button
                    key={tech.id}
                    type="button"
                    onClick={() => setSelectedTechId(tech.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTechId === tech.id
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{tech.name}</h4>
                        <p className="text-xs text-gray-600">{tech.specialization}</p>
                      </div>
                      {selectedTechId === tech.id && (
                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {tech.activeJobs || 0} Active
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tech.completedJobs || 0} Done
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ⭐ {tech.rating || 5.0}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Catatan Tambahan (Opsional)</h3>
            <Textarea
              placeholder="Tambahkan catatan khusus untuk teknisi..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={submitting || !selectedTechId || activeTechnicians.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base font-semibold shadow-lg"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Assign Teknisi
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}