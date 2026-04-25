import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users } from 'lucide-react';
import { toast } from 'sonner';

interface Technician {
  id?: string;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  activeJobs?: number;
  completedJobs?: number;
  rating?: number;
  status: string;
}

interface TechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician: Technician | null;
  mode: 'create' | 'edit';
  onSave: (technician: Technician) => void;
}

const specializations = [
  'Engine & Tune-Up',
  'Electrical & CVT',
  'Body & Painting',
  'Suspension & Brake',
  'Transmission',
  'General Mechanic'
];

export function TechnicianDialog({ 
  open, 
  onOpenChange, 
  technician, 
  mode,
  onSave 
}: TechnicianDialogProps) {
  const [formData, setFormData] = useState<Technician>({
    name: '',
    phone: '',
    email: '',
    specialization: '',
    status: 'active',
    activeJobs: 0,
    completedJobs: 0,
    rating: 5.0
  });

  useEffect(() => {
    if (technician && mode === 'edit') {
      setFormData({
        ...technician,
        name: technician.name || '',
        phone: technician.phone || '',
        email: technician.email || '',
        specialization: technician.specialization || '',
        status: technician.status || 'active',
        activeJobs: technician.activeJobs || 0,
        completedJobs: technician.completedJobs || 0,
        rating: technician.rating || 5.0
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        phone: '',
        email: '',
        specialization: '',
        status: 'active',
        activeJobs: 0,
        completedJobs: 0,
        rating: 5.0
      });
    }
  }, [technician, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.email || !formData.specialization) {
      toast.error('Semua field wajib diisi!');
      return;
    }

    // Validate phone number
    if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      toast.error('Format nomor telepon tidak valid!');
      return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Format email tidak valid!');
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="w-6 h-6 text-primary" />
            {mode === 'create' ? 'Tambah Teknisi Baru' : 'Edit Data Teknisi'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Tambahkan teknisi baru ke tim' 
              : 'Update informasi teknisi'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Ari Wijaya"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">
                Nomor Telepon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="e.g., 081234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <p className="text-xs text-gray-500">Format: 08xx atau +62xxx</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., ari@sunest.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Specialization & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-semibold">
                Spesialisasi <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.specialization} 
                onValueChange={(value) => setFormData({ ...formData, specialization: value })}
              >
                <SelectTrigger id="specialization">
                  <SelectValue placeholder="Pilih spesialisasi" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">✅ Active</SelectItem>
                  <SelectItem value="off">⚠️ Off / Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Performance Metrics (Edit Mode Only) */}
          {mode === 'edit' && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activeJobs" className="text-sm">
                    Active Jobs
                  </Label>
                  <Input
                    id="activeJobs"
                    type="number"
                    min="0"
                    value={formData.activeJobs}
                    onChange={(e) => setFormData({ ...formData, activeJobs: parseInt(e.target.value) || 0 })}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">Auto-calculated</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completedJobs" className="text-sm">
                    Completed Jobs
                  </Label>
                  <Input
                    id="completedJobs"
                    type="number"
                    min="0"
                    value={formData.completedJobs}
                    onChange={(e) => setFormData({ ...formData, completedJobs: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-sm">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5.0 })}
                  />
                  <p className="text-xs text-gray-500">0.0 - 5.0</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
              {mode === 'create' ? 'Tambah Teknisi' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}