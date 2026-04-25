import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft,
  Users,
  Info,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

interface TechnicianFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
  technician?: any;
  mode?: 'create' | 'edit';
}

const SPECIALIZATIONS = [
  'Engine & Tune-Up',
  'Electrical & CVT',
  'Body & Painting',
  'Suspension & Brake',
  'Transmission',
  'General Service'
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Aktif' },
  { value: 'off', label: 'Off / Tidak Aktif' }
];

export default function TechnicianForm({ onBack, onSuccess, technician, mode = 'create' }: TechnicianFormProps) {
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [name, setName] = useState(technician?.name || '');
  const [phone, setPhone] = useState(technician?.phone || '');
  const [specialization, setSpecialization] = useState(technician?.specialization || '');
  const [status, setStatus] = useState(technician?.status || 'active');
  const [notes, setNotes] = useState(technician?.notes || '');

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      toast.error('❌ Nama teknisi harus diisi');
      return;
    }

    if (!phone.trim()) {
      toast.error('❌ Nomor telepon harus diisi');
      return;
    }

    if (!specialization) {
      toast.error('❌ Pilih spesialisasi');
      return;
    }

    setSubmitting(true);

    try {
      const techId = technician?.id || `tech_${Date.now()}`;
      
      const payload = {
        id: techId,
        name: name.trim(),
        phone: phone.trim(),
        specialization,
        status,
        notes: notes.trim() || '',
        activeJobs: technician?.activeJobs || 0,
        completedJobs: technician?.completedJobs || 0,
        rating: technician?.rating || 5.0,
        updatedAt: new Date().toISOString()
      };

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/set/technician_${techId}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan teknisi');
      }

      toast.success(`✅ Teknisi ${mode === 'create' ? 'berhasil ditambahkan' : 'berhasil diupdate'}!`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving technician:', error);
      toast.error(`❌ ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {mode === 'create' ? 'Tambah Teknisi' : 'Edit Teknisi'}
                </h1>
                <p className="text-xs text-gray-500">
                  {mode === 'create' ? 'Tambahkan teknisi baru' : `Edit: ${technician?.name}`}
                </p>
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
                <h4 className="font-semibold text-base mb-1">Kelola Teknisi</h4>
                <p className="text-sm text-blue-50 leading-relaxed">
                  Data teknisi akan digunakan untuk assignment job order dan tracking performa.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Nama Teknisi *</Label>
                <Input
                  placeholder="Contoh: Ari Wijaya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Phone */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Nomor Telepon *</Label>
                <Input
                  placeholder="08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Specialization */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Spesialisasi *</Label>
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Pilih spesialisasi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Status *</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <Label className="text-sm text-gray-700 mb-1.5 block">Catatan (Opsional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tambahan untuk teknisi ini..."
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
            </div>

            {/* Stats Info for Edit Mode */}
            {mode === 'edit' && technician && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Statistik</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{technician.activeJobs || 0}</div>
                    <div className="text-xs text-gray-600">Job Aktif</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{technician.completedJobs || 0}</div>
                    <div className="text-xs text-gray-600">Job Selesai</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">{technician.rating || 5.0}</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base font-semibold shadow-lg"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {mode === 'create' ? 'Tambah Teknisi' : 'Simpan Perubahan'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}