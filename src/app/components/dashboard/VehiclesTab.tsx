import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { 
  Loader2, Plus, Car, Calendar, Wrench, CheckCircle2, Clock, AlertCircle, 
  ChevronDown, ChevronUp, Edit2, Trash2, Sparkles, Package, Settings, Info 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

const statusConfig: any = {
  pending: { label: 'Menunggu', icon: Clock, color: 'bg-orange-500', textColor: 'text-orange-700' },
  scheduled: { label: 'Dijadwalkan', icon: Calendar, color: 'bg-blue-500', textColor: 'text-blue-700' },
  in_progress: { label: 'Sedang Diperbaiki', icon: Wrench, color: 'bg-purple-500', textColor: 'text-purple-700' },
  awaiting_payment: { label: 'Menunggu Pembayaran', icon: AlertCircle, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  completed: { label: 'Selesai', icon: CheckCircle2, color: 'bg-green-500', textColor: 'text-green-700' },
  cancelled: { label: 'Dibatalkan', icon: AlertCircle, color: 'bg-red-500', textColor: 'text-red-700' }
};

export function VehiclesTab() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [vehicleBookings, setVehicleBookings] = useState<any>({});
  const [loadingBookings, setLoadingBookings] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    plate_number: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    engine_capacity: '',
    color: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/vehicles/customer/${user.id}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVehicles(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleBookings = async (vehicleId: string) => {
    if (vehicleBookings[vehicleId]) {
      return;
    }

    setLoadingBookings(vehicleId);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/vehicles/${vehicleId}/bookings`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVehicleBookings(prev => ({
          ...prev,
          [vehicleId]: data.data || []
        }));
      }
    } catch (error) {
      console.error('Error fetching vehicle bookings:', error);
      toast.error('Gagal memuat riwayat service');
    } finally {
      setLoadingBookings(null);
    }
  };

  const toggleExpandVehicle = (vehicleId: string) => {
    if (expandedVehicle === vehicleId) {
      setExpandedVehicle(null);
    } else {
      setExpandedVehicle(vehicleId);
      fetchVehicleBookings(vehicleId);
    }
  };

  const resetForm = () => {
    setFormData({
      plate_number: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      engine_capacity: '',
      color: ''
    });
  };

  const handleAddVehicle = async () => {
    if (!formData.plate_number || !formData.brand || !formData.model) {
      toast.error('Mohon lengkapi data kendaraan (Plat Nomor, Merk, Model)');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/vehicles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            customer_id: user?.id,
            ...formData
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Kendaraan berhasil ditambahkan! 🎉');
        setShowAddDialog(false);
        resetForm();
        fetchVehicles();
      } else {
        toast.error(data.error || 'Gagal menambahkan kendaraan');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Terjadi kesalahan saat menambahkan kendaraan');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setFormData({
      plate_number: vehicle.plate_number,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      engine_capacity: vehicle.engine_capacity || '',
      color: vehicle.color || ''
    });
    setShowEditDialog(true);
  };

  const handleEditVehicle = async () => {
    if (!selectedVehicle || !formData.plate_number || !formData.brand || !formData.model) {
      toast.error('Mohon lengkapi data kendaraan');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/vehicles/${selectedVehicle.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Kendaraan berhasil diupdate! ✅');
        setShowEditDialog(false);
        setSelectedVehicle(null);
        resetForm();
        fetchVehicles();
      } else {
        toast.error(data.error || 'Gagal mengupdate kendaraan');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Terjadi kesalahan saat mengupdate kendaraan');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setShowDeleteDialog(true);
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) {
      toast.error('Kendaraan tidak ditemukan');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/vehicles/${selectedVehicle.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const jobCount = data.deletedJobCount || 0;
        if (jobCount > 0) {
          toast.success(`Kendaraan dan ${jobCount} riwayat service berhasil dihapus! 🗑️`);
        } else {
          toast.success('Kendaraan berhasil dihapus! 🗑️');
        }
        setShowDeleteDialog(false);
        setSelectedVehicle(null);
        // Clear bookings cache for this vehicle
        setVehicleBookings(prev => {
          const newBookings = { ...prev };
          delete newBookings[selectedVehicle.id];
          return newBookings;
        });
        fetchVehicles();
      } else {
        toast.error(data.error || 'Gagal menghapus kendaraan');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Terjadi kesalahan saat menghapus kendaraan');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#2A5C82]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section with Modern Design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2A5C82] via-[#1e4460] to-[#163447] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Car className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">🚗 Kendaraan Terdaftar</h2>
                <p className="text-white/80 mt-1">Kelola semua kendaraan Anda dengan mudah</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white/70 text-sm">Total Kendaraan</div>
              <div className="text-3xl font-bold">{vehicles.length}</div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
              className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#F7931E] hover:to-[#FF6B35] text-white shadow-lg hover:shadow-xl transition-all duration-300 gap-2 px-6 py-6 text-base"
            >
              <Plus className="w-5 h-5" />
              Tambah Kendaraan Baru
            </Button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Car className="w-10 h-10 text-[#2A5C82]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Kendaraan</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Mulai dengan menambahkan kendaraan pertama Anda untuk melakukan booking service
            </p>
            <Button
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
              className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] hover:from-[#1e4460] hover:to-[#2A5C82] gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Kendaraan Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#2A5C82]/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#2A5C82] to-[#1e4460] rounded-xl shadow-lg">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </CardTitle>
                      <CardDescription className="text-base font-semibold text-[#2A5C82] mt-1">
                        {vehicle.plate_number}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white border-[#2A5C82]/20 text-[#2A5C82]">
                    {vehicle.year}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {/* Vehicle Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.engine_capacity && (
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <Settings className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-xs text-gray-500">Kapasitas</div>
                        <div className="text-sm font-semibold text-gray-900">{vehicle.engine_capacity}</div>
                      </div>
                    </div>
                  )}
                  {vehicle.color && (
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <div>
                        <div className="text-xs text-gray-500">Warna</div>
                        <div className="text-sm font-semibold text-gray-900">{vehicle.color}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => openEditDialog(vehicle)}
                    variant="outline"
                    className="flex-1 border-[#2A5C82] text-[#2A5C82] hover:bg-[#2A5C82] hover:text-white gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => openDeleteDialog(vehicle)}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </Button>
                </div>

                {/* Service History Toggle */}
                <Button
                  onClick={() => toggleExpandVehicle(vehicle.id)}
                  variant="ghost"
                  className="w-full justify-between hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2 text-gray-700">
                    <Wrench className="w-4 h-4" />
                    Riwayat Service
                  </span>
                  {expandedVehicle === vehicle.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                {/* Service History Content */}
                {expandedVehicle === vehicle.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    {loadingBookings === vehicle.id ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-[#2A5C82]" />
                      </div>
                    ) : vehicleBookings[vehicle.id]?.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {vehicleBookings[vehicle.id].map((booking: any) => {
                          const StatusIcon = statusConfig[booking.status]?.icon || Clock;
                          return (
                            <div key={booking.id} className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="font-semibold text-gray-900">{booking.job_number}</div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(booking.scheduled_date).toLocaleDateString('id-ID', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </div>
                                </div>
                                <Badge className={`${statusConfig[booking.status]?.color} text-white`}>
                                  {statusConfig[booking.status]?.label}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-700 mb-1">{booking.service_type}</div>
                              {booking.amount > 0 && (
                                <div className="text-sm font-semibold text-[#2A5C82]">
                                  {formatCurrency(booking.amount)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Belum ada riwayat service</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Vehicle Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-gradient-to-br from-[#2A5C82] to-[#1e4460] rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Tambah Kendaraan Baru
            </DialogTitle>
            <DialogDescription>
              Lengkapi informasi kendaraan Anda di bawah ini
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plate_number" className="text-sm font-semibold">
                Plat Nomor <span className="text-red-500">*</span>
              </Label>
              <Input
                id="plate_number"
                value={formData.plate_number}
                onChange={(e) => setFormData({ ...formData, plate_number: e.target.value.toUpperCase() })}
                placeholder="B 1234 XYZ"
                className="uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-semibold">
                  Merk <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Honda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-semibold">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Vario 150"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-semibold">Tahun</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
                  placeholder="2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engine_capacity" className="text-sm font-semibold">Kapasitas Mesin</Label>
                <Input
                  id="engine_capacity"
                  value={formData.engine_capacity}
                  onChange={(e) => setFormData({ ...formData, engine_capacity: e.target.value })}
                  placeholder="150cc"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-semibold">Warna</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Hitam"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleAddVehicle}
              disabled={submitting}
              className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] hover:from-[#1e4460] hover:to-[#2A5C82] gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Tambah Kendaraan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-gradient-to-br from-[#2A5C82] to-[#1e4460] rounded-lg">
                <Edit2 className="w-5 h-5 text-white" />
              </div>
              Edit Kendaraan
            </DialogTitle>
            <DialogDescription>
              Ubah informasi kendaraan {selectedVehicle?.plate_number}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_plate_number" className="text-sm font-semibold">
                Plat Nomor <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit_plate_number"
                value={formData.plate_number}
                onChange={(e) => setFormData({ ...formData, plate_number: e.target.value.toUpperCase() })}
                placeholder="B 1234 XYZ"
                className="uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_brand" className="text-sm font-semibold">
                  Merk <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit_brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Honda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_model" className="text-sm font-semibold">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit_model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Vario 150"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_year" className="text-sm font-semibold">Tahun</Label>
                <Input
                  id="edit_year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
                  placeholder="2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_engine_capacity" className="text-sm font-semibold">Kapasitas Mesin</Label>
                <Input
                  id="edit_engine_capacity"
                  value={formData.engine_capacity}
                  onChange={(e) => setFormData({ ...formData, engine_capacity: e.target.value })}
                  placeholder="150cc"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_color" className="text-sm font-semibold">Warna</Label>
              <Input
                id="edit_color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Hitam"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedVehicle(null);
              }}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditVehicle}
              disabled={submitting}
              className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] hover:from-[#1e4460] hover:to-[#2A5C82] gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Vehicle Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-red-600">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              Hapus Kendaraan?
            </DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan!
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-red-900">
                      Kendaraan yang akan dihapus:
                    </p>
                    <div className="text-sm text-red-800">
                      <div className="font-bold">{selectedVehicle.brand} {selectedVehicle.model}</div>
                      <div className="font-semibold">{selectedVehicle.plate_number}</div>
                      {selectedVehicle.year && <div>Tahun: {selectedVehicle.year}</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Perhatian:</p>
                    <p>
                      Semua riwayat service yang terkait dengan kendaraan ini juga akan ikut terhapus secara permanen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedVehicle(null);
              }}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleDeleteVehicle}
              disabled={submitting}
              className="bg-red-500 hover:bg-red-600 text-white gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Ya, Hapus Kendaraan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}