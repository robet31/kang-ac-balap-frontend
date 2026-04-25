import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Package, 
  Users,
  Car,
  ShoppingCart,
  Wrench,
  DollarSign,
  Info,
  Search
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { createClient } from '../../utils/supabase/client';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

// Fixed service fee untuk admin
const ADMIN_SERVICE_FEE = 25000;

export function CreateJobDialog({ open, onOpenChange, onSuccess }: CreateJobDialogProps) {
  const supabase = createClient();
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerVehicles, setCustomerVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  // Sparepart states
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedSpareparts, setSelectedSpareparts] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch customers and inventory on open
  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchInventory();
    }
  }, [open]);

  // Fetch customer vehicles when customer selected
  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerVehicles(selectedCustomer.id);
    } else {
      setCustomerVehicles([]);
      setSelectedVehicle(null);
    }
  }, [selectedCustomer]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'customer')
        .order('full_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error('Gagal memuat data customer');
    }
  };

  const fetchCustomerVehicles = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', customerId);

      if (error) throw error;
      setCustomerVehicles(data || []);
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      toast.error('Gagal memuat data kendaraan');
    }
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
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
      toast.error('Gagal memuat data inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  // Sparepart management
  const handleAddSparepart = (inventoryItem: any) => {
    const existing = selectedSpareparts.find(sp => sp.sku === inventoryItem.sku);
    
    if (existing) {
      // Increment quantity instead
      handleUpdateSparepartQty(existing.id, 1);
      return;
    }

    const newSparepart = {
      id: `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sku: inventoryItem.sku,
      name: inventoryItem.name,
      price: inventoryItem.price || 0,
      qty: 1,
      unit: inventoryItem.unit || 'pcs',
      totalPrice: inventoryItem.price || 0,
      stock: inventoryItem.stock
    };

    setSelectedSpareparts([...selectedSpareparts, newSparepart]);
    toast.success(`✅ ${inventoryItem.name} ditambahkan`);
  };

  const handleUpdateSparepartQty = (id: string, delta: number) => {
    setSelectedSpareparts(selectedSpareparts.map(sp => {
      if (sp.id === id) {
        const newQty = Math.max(1, sp.qty + delta);
        
        // Check stock availability
        if (newQty > sp.stock) {
          toast.error(`Stock tidak cukup! Tersedia: ${sp.stock}`);
          return sp;
        }

        return {
          ...sp,
          qty: newQty,
          totalPrice: sp.price * newQty
        };
      }
      return sp;
    }));
  };

  const handleRemoveSparepart = (id: string) => {
    setSelectedSpareparts(selectedSpareparts.filter(sp => sp.id !== id));
    toast.success('Sparepart dihapus');
  };

  // Calculate totals
  const serviceFee = ADMIN_SERVICE_FEE;
  const sparepartsTotal = selectedSpareparts.reduce((sum, sp) => sum + sp.totalPrice, 0);
  const grandTotal = serviceFee + sparepartsTotal;

  // Filter inventory by search
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle booking submission
  const handleConfirmBooking = async () => {
    // Validation
    if (!selectedCustomer) {
      toast.error('❌ Pilih customer terlebih dahulu');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('❌ Pilih tanggal dan waktu service');
      return;
    }

    setSubmitting(true);

    try {
      const bookingPayload = {
        user_id: selectedCustomer.id,
        vehicle_id: selectedVehicle?.id || null,
        service_type: 'Custom Service (Admin)',
        package_name: 'Custom Service',
        customer_name: selectedCustomer.full_name || selectedCustomer.email,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        notes: notes 
          ? `📝 Admin Note: ${notes}\n💰 Service Fee (Admin): Rp ${serviceFee.toLocaleString('id-ID')}` 
          : `💰 Service Fee (Admin): Rp ${serviceFee.toLocaleString('id-ID')}`,
        amount: grandTotal,
        items: selectedSpareparts.map(sp => ({
          item_type: 'part',
          item_id: sp.sku,
          item_name: sp.name,
          quantity: sp.qty,
          unit_price: sp.price,
          total_price: sp.totalPrice
        }))
      };

      console.log('📤 Creating job from admin:', bookingPayload);

      const bookingResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingPayload)
        }
      );

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      const result = await bookingResponse.json();
      const jobNumber = result.data?.job_number;

      toast.success(`🎉 Job berhasil dibuat! (${jobNumber})`);
      
      // Reset form
      resetForm();
      
      // Close dialog and refresh
      onOpenChange(false);
      onSuccess?.();

    } catch (error: any) {
      console.error('Error creating job:', error);
      toast.error(`❌ Gagal membuat job: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setSelectedVehicle(null);
    setCustomerVehicles([]);
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
    setSelectedSpareparts([]);
    setSearchQuery('');
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-[1400px] w-[95vw] max-h-[92vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-8 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-3xl">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <div>Buat Job Order Baru</div>
              <DialogDescription className="text-base mt-1">
                Buat job order langsung dari admin dengan harga jasa service <span className="font-bold text-green-600">Rp 25.000</span>
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-12 gap-8">
            {/* LEFT COLUMN - Form (5 cols) */}
            <div className="col-span-5 space-y-6">
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Harga Jasa Service Fixed</h4>
                    <p className="text-blue-50 text-sm leading-relaxed">
                      Setiap job dari admin dikenakan biaya jasa <span className="font-bold text-white">Rp 25.000</span>. 
                      Pilih sparepart sesuai kebutuhan customer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-gray-900">Informasi Customer</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base mb-2 block">Pilih Customer *</Label>
                    <Select 
                      value={selectedCustomer?.id} 
                      onValueChange={(id) => {
                        const customer = customers.find(c => c.id === id);
                        setSelectedCustomer(customer);
                      }}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Pilih customer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id} className="text-base py-3">
                            {customer.full_name || customer.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCustomer && customerVehicles.length > 0 && (
                    <div>
                      <Label className="text-base mb-2 block">Pilih Kendaraan (Opsional)</Label>
                      <Select 
                        value={selectedVehicle?.id || ''} 
                        onValueChange={(id) => {
                          const vehicle = customerVehicles.find(v => v.id === id);
                          setSelectedVehicle(vehicle);
                        }}
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Pilih kendaraan..." />
                        </SelectTrigger>
                        <SelectContent>
                          {customerVehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id} className="text-base py-3">
                              <div className="flex items-center gap-2">
                                <Car className="w-4 h-4" />
                                {vehicle.brand} {vehicle.model} - {vehicle.plate_number}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-gray-900">Jadwal Service</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base mb-2 block">Tanggal *</Label>
                    <Input
                      type="date"
                      min={minDate}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-base mb-2 block">Waktu *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Pilih waktu..." />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="text-base py-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <Label className="text-base">Catatan (Opsional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keluhan atau catatan khusus dari customer..."
                  rows={4}
                  className="resize-none text-base"
                />
              </div>
            </div>

            {/* RIGHT COLUMN - Sparepart & Summary (7 cols) */}
            <div className="col-span-7 space-y-6">
              {/* Pricing Summary - Always visible at top */}
              <Card className="border-2 border-primary shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-xl pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Ringkasan Biaya
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
                      <span className="text-base text-gray-700">Biaya Jasa Service</span>
                      <span className="font-bold text-xl text-primary">
                        Rp {serviceFee.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
                      <span className="text-base text-gray-700">
                        Total Sparepart ({selectedSpareparts.length} item)
                      </span>
                      <span className="font-bold text-xl text-orange-600">
                        Rp {sparepartsTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-gray-900">TOTAL TAGIHAN</span>
                        <span className="font-bold text-3xl text-green-600">
                          Rp {grandTotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Spareparts */}
              {selectedSpareparts.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Sparepart Dipilih ({selectedSpareparts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {selectedSpareparts.map((sp) => (
                        <div
                          key={sp.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-primary transition-all group"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-base">{sp.name}</p>
                              <p className="text-sm text-gray-600">
                                SKU: {sp.sku} • @ Rp {sp.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-3 py-2">
                              <button
                                onClick={() => handleUpdateSparepartQty(sp.id, -1)}
                                disabled={sp.qty <= 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-base font-bold w-12 text-center">{sp.qty}</span>
                              <button
                                onClick={() => handleUpdateSparepartQty(sp.id, 1)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-lg font-bold text-primary w-32 text-right">
                              Rp {sp.totalPrice.toLocaleString('id-ID')}
                            </span>
                            <button
                              onClick={() => handleRemoveSparepart(sp.id)}
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Inventory Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Pilih Sparepart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Cari sparepart berdasarkan nama atau SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-base"
                    />
                  </div>

                  {/* Inventory Grid */}
                  {loadingInventory ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600">Loading inventory...</p>
                    </div>
                  ) : filteredInventory.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-base">
                        {searchQuery ? 'Tidak ada hasil pencarian' : 'Inventory kosong'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                      {filteredInventory.map((item) => {
                        const alreadySelected = selectedSpareparts.some(sp => sp.sku === item.sku);
                        
                        return (
                          <button
                            key={item.sku}
                            onClick={() => handleAddSparepart(item)}
                            disabled={item.stock <= 0}
                            className={`p-4 text-left border-2 rounded-xl transition-all ${
                              alreadySelected
                                ? 'border-green-400 bg-green-50 shadow-md'
                                : item.stock <= 0
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                : 'border-gray-200 hover:border-primary hover:shadow-lg hover:scale-[1.02]'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-semibold text-sm leading-tight flex-1 pr-2">{item.name}</p>
                              {alreadySelected && (
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-3">SKU: {item.sku}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-base font-bold text-primary">
                                Rp {(item.price || 0).toLocaleString('id-ID')}
                              </p>
                              <Badge 
                                variant={item.stock > 0 ? 'default' : 'destructive'}
                                className={`text-xs px-2 py-1 ${item.stock > 0 ? 'bg-green-100 text-green-800 border-green-300' : ''}`}
                              >
                                {item.stock}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-8 py-5 bg-gray-50 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="h-12 px-8 text-base"
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmBooking}
            disabled={submitting || !selectedCustomer || !selectedDate || !selectedTime}
            className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 text-base min-w-[220px] shadow-lg"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Buat Job Order
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
