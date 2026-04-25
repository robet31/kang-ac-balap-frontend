import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft,
  Wrench,
  User,
  Calendar,
  ShoppingCart,
  DollarSign,
  Info,
  Search,
  Package,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

const ADMIN_SERVICE_FEE = 25000;

interface CreateJobPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function CreateJobPage({ onBack, onSuccess }: CreateJobPageProps) {
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  // Sparepart states
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedSpareparts, setSelectedSpareparts] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

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
        // Filter only available stock
        const availableItems = (data.data || []).filter((item: any) => item.stock > 0);
        setInventory(availableItems);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Gagal memuat data inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  const handleAddSparepart = (inventoryItem: any) => {
    const existing = selectedSpareparts.find(sp => sp.sku === inventoryItem.sku);
    
    if (existing) {
      handleUpdateSparepartQty(existing.id, existing.qty + 1);
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

  const handleUpdateSparepartQty = (id: string, newQty: number) => {
    setSelectedSpareparts(selectedSpareparts.map(sp => {
      if (sp.id === id) {
        const qty = Math.max(1, newQty);
        
        if (qty > sp.stock) {
          toast.error(`Stock tidak cukup! Tersedia: ${sp.stock}`);
          return sp;
        }

        return {
          ...sp,
          qty,
          totalPrice: sp.price * qty
        };
      }
      return sp;
    }));
  };

  const handleRemoveSparepart = (id: string) => {
    setSelectedSpareparts(selectedSpareparts.filter(sp => sp.id !== id));
    toast.success('Sparepart dihapus');
  };

  const serviceFee = ADMIN_SERVICE_FEE;
  const sparepartsTotal = selectedSpareparts.reduce((sum, sp) => sum + sp.totalPrice, 0);
  const grandTotal = serviceFee + sparepartsTotal;

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast.error('❌ Masukkan nama customer');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('❌ Pilih tanggal dan waktu service');
      return;
    }

    setSubmitting(true);

    try {
      // Build detailed notes with sparepart breakdown
      let detailedNotes = '';
      
      if (notes) {
        detailedNotes += `📝 ${notes}\n\n`;
      }
      
      // Add sparepart details to notes
      if (selectedSpareparts.length > 0) {
        detailedNotes += `🔧 Sparepart:\n`;
        selectedSpareparts.forEach(sp => {
          detailedNotes += `• ${sp.name} (${sp.sku}) - ${sp.qty}x @ Rp ${sp.price.toLocaleString('id-ID')} = Rp ${sp.totalPrice.toLocaleString('id-ID')}\n`;
        });
        detailedNotes += `\nTotal Sparepart: Rp ${sparepartsTotal.toLocaleString('id-ID')}\n`;
      }
      
      detailedNotes += `💰 Biaya Jasa: Rp ${serviceFee.toLocaleString('id-ID')}`;

      const bookingPayload = {
        user_id: null,
        vehicle_id: null,
        service_type: 'Custom Service (Admin)',
        package_name: 'Custom Service',
        customer_name: customerName,
        vehicle_name: vehicleName || '-',
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        notes: detailedNotes,
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

      const response = await fetch(
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server error response:', errorData);
        const errorMsg = errorData.message || errorData.error || 'Failed to create job';
        const errorDetails = errorData.hint || errorData.details?.message || '';
        throw new Error(`${errorMsg}${errorDetails ? ': ' + errorDetails : ''}`);
      }

      const result = await response.json();
      console.log('✅ Booking created successfully:', result);
      const jobNumber = result.data?.job_number;

      toast.success(`🎉 Job berhasil dibuat! (${jobNumber})`);
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Error creating job:', error);
      toast.error(`❌ Gagal membuat job: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Simple */}
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
                <h1 className="text-lg font-bold text-gray-900">Buat Job Order Baru</h1>
                <p className="text-xs text-gray-500">Harga Jasa Service <span className="font-semibold text-green-600">Rp 25.000</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT COLUMN - Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Info Banner */}
            <div className="bg-blue-500 rounded-xl p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-1">Harga Jasa Service Fixed</h4>
                  <p className="text-sm text-blue-50 leading-relaxed">
                    Setiap job dari admin dikenakan biaya jasa <span className="font-bold">Rp 25.000</span>. Pilih sparepart sesuai kebutuhan customer.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-900">Informasi Customer</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-700 mb-1.5 block">Atas Nama *</Label>
                  <Input
                    placeholder="Nama customer..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <Label className="text-sm text-gray-700 mb-1.5 block">Nama Kendaraan (Opsional)</Label>
                  <Input
                    placeholder="Contoh: Honda Beat - B 1234 ABC"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-400 mt-1">Isi jika ada info kendaraan</p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-900">Jadwal Service</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-700 mb-1.5 block">Tanggal *</Label>
                  <Input
                    type="date"
                    min={minDate}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 mb-1.5 block">Waktu *</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="h-10">
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
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Catatan (Opsional)</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Keluhan atau catatan khusus dari customer..."
                rows={4}
                className="resize-none text-sm"
              />
            </div>
            
            {/* Submit Button - Integrated in Layout */}
            <Button
              onClick={handleSubmit}
              disabled={submitting || !customerName || !selectedDate || !selectedTime}
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
                  Buat Job Order
                </>
              )}
            </Button>
          </div>

          {/* RIGHT COLUMN - Pricing & Sparepart */}
          <div className="lg:col-span-3 space-y-4">
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
                  <span className="font-bold text-orange-600">Rp {serviceFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Total Sparepart ({selectedSpareparts.length} item)</span>
                  <span className="font-bold text-orange-600">Rp {sparepartsTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">TOTAL TAGIHAN</span>
                    <span className="font-bold text-xl text-green-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilih Sparepart */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-orange-500 px-5 py-3">
                <div className="flex items-center gap-2 text-white">
                  <ShoppingCart className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Pilih Sparepart</h3>
                </div>
              </div>
              <div className="p-5">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari sparepart..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                {/* Selected Spareparts List */}
                {selectedSpareparts.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {selectedSpareparts.map((sp) => (
                      <div
                        key={sp.id}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{sp.name}</p>
                          <p className="text-xs text-gray-500">SKU: {sp.sku}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateSparepartQty(sp.id, sp.qty - 1)}
                              disabled={sp.qty <= 1}
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 text-sm"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold w-8 text-center">{sp.qty}</span>
                            <button
                              onClick={() => handleUpdateSparepartQty(sp.id, sp.qty + 1)}
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-bold text-orange-600 w-24 text-right">
                            Rp {sp.totalPrice.toLocaleString('id-ID')}
                          </span>
                          <button
                            onClick={() => handleRemoveSparepart(sp.id)}
                            className="text-red-600 hover:text-red-700 text-xs underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inventory Grid */}
                {loadingInventory ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-gray-500">Loading inventory...</p>
                  </div>
                ) : filteredInventory.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      {searchQuery ? 'Tidak ada hasil' : 'Inventory kosong'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {filteredInventory.map((item, index) => {
                      const alreadySelected = selectedSpareparts.some(sp => sp.sku === item.sku);
                      
                      return (
                        <button
                          key={`inventory-${item.sku}-${index}`}
                          onClick={() => handleAddSparepart(item)}
                          className={`p-3 text-left border rounded-lg transition-all ${
                            alreadySelected
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-200 hover:border-orange-400 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-900 flex-1 pr-2 line-clamp-2">
                              {item.name}
                            </p>
                            {alreadySelected && (
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">SKU: {item.sku}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-orange-600">
                              Rp {(item.price || 0).toLocaleString('id-ID')}
                            </p>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Stock: {item.stock}
                            </Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}