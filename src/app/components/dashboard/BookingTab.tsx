import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Clock, CheckCircle2, Loader2, Package, Plus, Minus, AlertTriangle, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '../../utils/supabase/client';
import { publicAnonKey, projectId } from '../../utils/supabase/info';
import { PendingBookings } from './PendingBookings';
import { fetchInventory as fetchInventoryData, InventoryItem } from '../../utils/inventory-sync';

// Service packages WITHOUT PRICES - prices will be fetched from database
const servicePackages = [
  {
    id: 'hemat-service',
    name: "Hemat Service",
    minimumPrice: 115000,
    description: "Paket service rutin harian - ganti oli dan busi",
    basePrice: 0, // FREE JASA!
    originalBasePrice: 15000, // Harga normal jasa (untuk ditampilkan coret)
    icon: Package,
    color: "from-blue-500 to-cyan-500",
    requiredItems: [
      { sku: 'OLI-001', name: 'Oli Mesin SAE 10W-40', qty: 1, unit: 'liter' },
      { sku: 'BPF-001', name: 'Busi Iridium', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'basic-tuneup',
    name: "Basic Tune-Up",
    minimumPrice: 140000,
    description: "Service berkala bulanan - oli, busi, dan filter udara",
    basePrice: 0, // FREE JASA!
    originalBasePrice: 25000,
    icon: Package,
    color: "from-green-500 to-emerald-500",
    popular: true,
    requiredItems: [
      { sku: 'OLI-001', name: 'Oli Mesin SAE 10W-40', qty: 1, unit: 'liter' },
      { sku: 'BPF-001', name: 'Busi Iridium', qty: 1, unit: 'pcs' },
      { sku: 'FLT-001', name: 'Filter Udara', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'standard-service',
    name: "Standard Service",
    minimumPrice: 250000,
    description: "Service berkala 3 bulan - oli extra, busi, filter lengkap",
    basePrice: 0, // FREE JASA!
    originalBasePrice: 35000,
    icon: Package,
    color: "from-orange-500 to-amber-500",
    requiredItems: [
      { sku: 'OLI-001', name: 'Oli Mesin SAE 10W-40', qty: 2, unit: 'liter' },
      { sku: 'BPF-001', name: 'Busi Iridium', qty: 1, unit: 'pcs' },
      { sku: 'FLT-001', name: 'Filter Udara', qty: 1, unit: 'pcs' },
      { sku: 'FLT-002', name: 'Filter Oli', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'premium-service',
    name: "Premium Service",
    minimumPrice: 300000,
    description: "Service berkala 6 bulan - oli synthetic, busi, filter lengkap, kampas rem",
    basePrice: 0, // FREE JASA!
    originalBasePrice: 50000,
    icon: Package,
    color: "from-red-500 to-rose-500",
    requiredItems: [
      { sku: 'OLI-002', name: 'Oli Mesin Fully Synthetic', qty: 2, unit: 'liter' },
      { sku: 'BPF-001', name: 'Busi Iridium', qty: 1, unit: 'pcs' },
      { sku: 'FLT-001', name: 'Filter Udara', qty: 1, unit: 'pcs' },
      { sku: 'FLT-002', name: 'Filter Oli', qty: 1, unit: 'pcs' },
      { sku: 'PAD-001', name: 'Kampas Rem Depan', qty: 1, unit: 'set' }
    ]
  }
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

export function BookingTab({ vehicles = [], onNavigate }: { vehicles?: any[], onNavigate: (view: string) => void }) {
  const { user, profile } = useAuth();
  const supabase = createClient();
  
  // Filter out mock vehicles (CRITICAL: prevent mock UUIDs from being selectable)
  const realVehicles = vehicles.filter(v => {
    const isMockUUID = v.id?.startsWith('00000000');
    if (isMockUUID) {
      console.warn('🚫 Filtering out mock vehicle:', v.id);
      return false;
    }
    return true;
  });
  
  // Debug: log user info and vehicles on mount
  useEffect(() => {
    console.log('🔐 BookingTab - User info:', {
      userId: user?.id,
      userEmail: user?.email,
      isAuthenticated: !!user
    });
    console.log('🚗 BookingTab - Vehicles received (before filter):', vehicles);
    console.log('🚗 BookingTab - Real vehicles (after filter):', realVehicles);
    
    if (realVehicles.length === 0) {
      console.log('ℹ️ No real vehicles available - user will book without vehicle (vehicle_id will be NULL)');
    } else {
      // Validate all vehicle IDs (support both UUID and KV store format)
      realVehicles.forEach((vehicle, index) => {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const kvStorePattern = /^vehicle_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_\d+$/i;
        
        const isValidUUID = uuidPattern.test(vehicle.id);
        const isValidKVStore = kvStorePattern.test(vehicle.id);
        
        if (!isValidUUID && !isValidKVStore) {
          console.error(`❌ Vehicle ${index} has INVALID ID format: "${vehicle.id}"`); 
        } else if (isValidKVStore) {
          console.log(`✅ Vehicle ${index} has valid KV store ID: ${vehicle.id}`);
        } else {
          console.log(`✅ Vehicle ${index} has valid UUID: ${vehicle.id}`);
        }
      });
    }
  }, [user, vehicles, realVehicles]);
  
  // Booking Flow Steps
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editQty, setEditQty] = useState(1);
  const [stockWarnings, setStockWarnings] = useState<string[]>([]);
  
  // Form States
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  
  // Items & Inventory States
  const [bookingItems, setBookingItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  
  // Fetch inventory dari KV Store using utility function
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      // Use centralized inventory sync utility
      const data = await fetchInventoryData();
      setInventory(data);
      console.log('✅ Inventory loaded from KV Store (permanent):', data.length, 'items');
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Gagal memuat data inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  // Handle Package Selection
  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    
    // Set booking items from package's required items WITH prices from inventory
    const items = pkg.requiredItems.map((item: any) => {
      const inventoryItem = inventory.find(inv => inv.sku === item.sku);
      return {
        ...item,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        price: inventoryItem?.price || 0, // Add price from inventory
        totalPrice: (inventoryItem?.price || 0) * item.qty
      };
    });
    
    setBookingItems(items);
    
    // Check stock availability
    checkStockAvailability(items);
  };

  // Check Stock Availability & Generate Warnings
  const checkStockAvailability = (items: any[]) => {
    const warnings: string[] = [];
    
    items.forEach(item => {
      const inventoryItem = inventory.find(inv => inv.sku === item.sku);
      
      if (!inventoryItem) {
        warnings.push(`⚠️ ${item.name} tidak ditemukan di inventory`);
      } else if (inventoryItem.stock < item.qty) {
        warnings.push(`⚠️ ${item.name} stock tidak cukup (tersedia: ${inventoryItem.stock}, dibutuhkan: ${item.qty})`);
      } else if (inventoryItem.stock - item.qty <= inventoryItem.minStock) {
        warnings.push(`⚠️ ${item.name} akan mencapai minimum stock setelah digunakan`);
      }
    });
    
    setStockWarnings(warnings);
  };

  // CRUD Operations for Booking Items
  const handleAddItem = () => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sku: '',
      name: 'Item Baru',
      qty: 1,
      unit: 'pcs',
      totalPrice: 0
    };
    setBookingItems([...bookingItems, newItem]);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setEditQty(item.qty);
  };

  const handleSaveEdit = () => {
    if (editQty <= 0) {
      toast.error('Quantity harus lebih dari 0');
      return;
    }
    
    const updatedItems = bookingItems.map(item => 
      item.id === editingItem.id ? { ...item, qty: editQty } : item
    );
    
    setBookingItems(updatedItems);
    checkStockAvailability(updatedItems);
    setEditingItem(null);
    toast.success('✅ Item berhasil diupdate!');
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Hapus item ini dari booking?')) {
      const updatedItems = bookingItems.filter(item => item.id !== itemId);
      setBookingItems(updatedItems);
      checkStockAvailability(updatedItems);
      toast.success('✅ Item berhasil dihapus!');
    }
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    const updatedItems = bookingItems.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    
    setBookingItems(updatedItems);
    checkStockAvailability(updatedItems);
  };

  // Navigate to Summary Step
  const handleProceedToSummary = () => {
    // Vehicle selection is now optional (can be NULL)
    // if (!selectedVehicle && vehicles.length > 0) {
    //   toast.error('Mohon pilih kendaraan');
    //   return;
    // }
    if (!selectedDate) {
      toast.error('Mohon pilih tanggal service');
      return;
    }
    if (!selectedTime) {
      toast.error('Mohon pilih waktu service');
      return;
    }
    
    setStep(2);
  };

  // Final Booking Submission - REAL-TIME DATABASE
  const handleConfirmBooking = async () => {
    if (!user?.id) {
      toast.error('❌ User tidak terautentikasi. Mohon login kembali.');
      console.error('User ID not found:', user);
      return;
    }

    if (!selectedPackage) {
      toast.error('❌ Mohon pilih paket service');
      return;
    }

    setSubmitting(true);
    
    try {
      console.log('📝 Creating booking with user ID:', user.id);
      console.log('📝 Selected Vehicle:', selectedVehicle);
      console.log('📝 Vehicle ID:', selectedVehicle?.id);

      // ✅ FIX: Accept BOTH UUID and KV key formats
      // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      // KV key format: vehicle_userid_timestamp
      const isValidVehicle = selectedVehicle && selectedVehicle.id && (
        // Accept real UUID (not mock 00000000)
        (selectedVehicle.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) && 
         !selectedVehicle.id.startsWith('00000000')) ||
        // OR accept KV key format
        selectedVehicle.id.includes('vehicle_')
      );

      const bookingPayload = {
        user_id: user.id,
        vehicle_id: isValidVehicle ? selectedVehicle.id : null, // Send vehicle_id (UUID or KV key)
        service_type: selectedPackage.name,
        package_name: selectedPackage.name, // ✅ Add package name
        customer_name: profile?.name || user?.email || 'Unknown Customer', // ✅ Add customer name
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        notes: notes || '',
        amount: selectedPackage.price,
        items: bookingItems.map(item => ({
          item_type: 'part',
          item_id: item.sku,
          item_name: item.name,
          quantity: item.qty,
          unit_price: 0,
          total_price: 0
        }))
      };

      console.log('📤 Booking payload:', JSON.stringify(bookingPayload, null, 2));
      console.log('🔍 Vehicle validation:', {
        hasSelectedVehicle: !!selectedVehicle,
        vehicleId: selectedVehicle?.id,
        isValidUUID: selectedVehicle?.id?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
        isKVKey: selectedVehicle?.id?.includes('vehicle_'),
        isMockUUID: selectedVehicle?.id?.startsWith('00000000'),
        finalIsValid: isValidVehicle,
        willSendToServer: isValidVehicle ? selectedVehicle.id : null
      });
      
      // Create booking in database (real-time)
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
        // Try to parse JSON error, fallback to text
        let errorMessage = 'Failed to create booking';
        try {
          const errorData = await bookingResponse.json();
          errorMessage = errorData.error || errorMessage;
          console.error('Booking error (JSON):', errorData);
        } catch (jsonError) {
          // Response is not JSON, get text instead
          const errorText = await bookingResponse.text();
          console.error('Booking error (Text):', errorText);
          errorMessage = errorText || `Server error: ${bookingResponse.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await bookingResponse.json();
      const jobNumber = result.data?.job_number || 'JO-XXXXX';

      // Success messages
      toast.success(`🎉 Booking berhasil dibuat! (${jobNumber})`);
      toast.success('✅ Job order berhasil masuk ke daftar pending!');

      // Reset form
      setStep(1);
      setSelectedPackage(null);
      setSelectedVehicle(null);
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
      setBookingItems([]);
      setStockWarnings([]);
      
      // Refresh inventory
      fetchInventory();

      // ✅ TRIGGER MANUAL REFRESH - Force PendingBookings to refresh immediately
      console.log('🔄 Triggering manual refresh for PendingBookings...');
      // Give backend a moment to process, then refresh
      setTimeout(() => {
        window.dispatchEvent(new Event('refresh-pending-bookings'));
      }, 500);

      // NO MORE WAITING MODAL - Langsung tampil di PendingBookings card
      // The PendingBookings component will auto-refresh via real-time subscription

    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(`❌ Gagal membuat booking: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Pending Bookings Section - Shown at top */}
      <PendingBookings onRefresh={() => {
        // Optional: refresh other data when pending bookings change
        console.log('Pending bookings refreshed');
      }} />

      {/* Header with Step Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-1">Booking Service</h2>
          <p className="text-sm sm:text-base text-gray-600">Pilih paket service dan jadwal Anda</p>
        </div>
        
        {/* Step Indicator - Responsive */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full ${
            step === 1 ? 'bg-[#2A5C82] text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-bold">
              1
            </div>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Pilih Paket</span>
            <span className="text-xs sm:text-sm font-medium xs:hidden">Paket</span>
          </div>
          
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300" />
          
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full ${
            step === 2 ? 'bg-[#2A5C82] text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-bold">
              2
            </div>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Ringkasan</span>
            <span className="text-xs sm:text-sm font-medium xs:hidden">Review</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Select Package & Basic Info */}
      {step === 1 && (
        <div className="space-y-4 sm:space-y-6">
          {/* Service Packages */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-3 sm:mb-4">Pilih Paket Service</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {servicePackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all hover:shadow-lg relative ${
                    selectedPackage?.id === pkg.id
                      ? 'border-2 border-[#2A5C82] shadow-xl'
                      : 'border-2 border-gray-200'
                  }`}
                  onClick={() => handleSelectPackage(pkg)}
                >
                  {pkg.popular && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] border-0 text-xs">
                      ⭐ Populer
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                    <div className={`w-full h-1.5 sm:h-2 rounded-lg bg-gradient-to-r ${pkg.color} mb-2 sm:mb-3`} />
                    <CardTitle className="text-lg sm:text-xl">{pkg.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{pkg.description}</CardDescription>
                    <div className="pt-1.5 sm:pt-2">
                      <div className="text-2xl sm:text-3xl font-bold text-[#2A5C82]">
                        {pkg.priceLabel}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-700">Items yang dibutuhkan:</p>
                      {pkg.requiredItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="line-clamp-1">{item.name} ({item.qty} {item.unit})</span>
                        </div>
                      ))}
                    </div>
                    
                    {selectedPackage?.id === pkg.id && (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-green-600 font-semibold text-xs sm:text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Paket Dipilih</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Basic Info Form */}
          {selectedPackage && (
            <Card className="border-2 border-[#2A5C82]">
              <CardHeader className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] text-white p-4 sm:py-[15px] sm:px-[24px]">
                <CardTitle className="text-base sm:text-lg">Informasi Booking</CardTitle>
                <CardDescription className="text-gray-200 text-xs sm:text-sm">
                  Lengkapi informasi booking Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:pt-5 sm:pb-5 space-y-3 sm:space-y-3.5">
                {/* Vehicle Selection */}
                {realVehicles.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-medium">Pilih Kendaraan *</Label>
                    <Select value={selectedVehicle?.id} onValueChange={(id) => {
                      const vehicle = realVehicles.find(v => v.id === id);
                      setSelectedVehicle(vehicle);
                    }}>
                      <SelectTrigger className="h-9 sm:h-10 text-sm">
                        <SelectValue placeholder="Pilih kendaraan..." />
                      </SelectTrigger>
                      <SelectContent>
                        {realVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id} className="text-sm">
                            {vehicle.brand} {vehicle.model} - {vehicle.plate_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-medium">Tanggal Service *</Label>
                    <Input
                      type="date"
                      min={minDate}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="h-9 sm:h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-medium">Waktu Service *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="h-9 sm:h-10 text-sm">
                        <SelectValue placeholder="Pilih waktu..." />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="text-sm">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm font-medium">Catatan (Opsional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Keluhan atau catatan tambahan..."
                    rows={3}
                    className="resize-none text-sm"
                  />
                </div>

                <Button
                  onClick={handleProceedToSummary}
                  className="w-full bg-[#2A5C82] hover:bg-[#1e4460] h-9 sm:h-10 mt-1 text-sm"
                >
                  Lanjut ke Ringkasan
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* STEP 2: Summary & Edit Items */}
      {step === 2 && (
        <div className="space-y-4 sm:space-y-6">
          {/* Booking Summary */}
          <Card className="border-2 border-[#2A5C82]">
            <CardHeader className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] text-white rounded-t-lg p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Ringkasan Booking
              </CardTitle>
              <CardDescription className="text-gray-200 text-xs sm:text-sm mt-1">
                Periksa kembali detail booking Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:pt-6 space-y-4 sm:space-y-6">
              {/* Booking Info - Enhanced Responsive Layout */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">Informasi Booking</h4>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-5 border border-blue-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                    {/* Paket Service */}
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2A5C82]" />
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600">Paket Service</p>
                      </div>
                      <p className="font-bold text-[#2A5C82] text-sm sm:text-base ml-5 sm:ml-6">{selectedPackage.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 ml-5 sm:ml-6 mt-0.5 sm:mt-1">{selectedPackage.description}</p>
                    </div>
                    
                    {/* Kendaraan */}
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600">Kendaraan</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm ml-5 sm:ml-6">
                        {selectedVehicle 
                          ? `${selectedVehicle.brand} ${selectedVehicle.model}`
                          : 'Belum terdaftar'}
                      </p>
                      {selectedVehicle && (
                        <p className="text-[10px] sm:text-xs text-gray-600 ml-5 sm:ml-6 mt-0.5 sm:mt-1">{selectedVehicle.plate_number}</p>
                      )}
                    </div>
                    
                    {/* Tanggal */}
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600">Tanggal Service</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm ml-5 sm:ml-6">{selectedDate}</p>
                    </div>
                    
                    {/* Waktu */}
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600">Waktu Service</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm ml-5 sm:ml-6">{selectedTime}</p>
                    </div>
                  </div>
                  
                  {/* Catatan */}
                  {notes && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-300">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600">Catatan</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800 ml-5 sm:ml-6 bg-blue-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-blue-200">
                        {notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List - Responsive */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">Sparepart & Material</h4>

                <div className="space-y-2 sm:space-y-3">
                  {bookingItems.map((item, index) => {
                    const itemPrice = item.price || (inventory.find(inv => inv.sku === item.sku)?.price || 0);
                    const itemTotal = itemPrice * item.qty;
                    
                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 flex-col sm:flex-row">
                          {/* Item Info */}
                          <div className="flex items-start gap-2 sm:gap-3 flex-1 w-full">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-[#2A5C82] flex items-center justify-center text-white font-semibold text-[10px] sm:text-xs flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-xs sm:text-sm">{item.name}</p>
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
                            </div>
                          </div>

                          {/* Price & Quantity - Mobile: Stacked */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-50 rounded px-1.5 sm:px-2 py-0.5 sm:py-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-white disabled:opacity-40"
                                onClick={() => handleUpdateQty(item.id, -1)}
                                disabled={item.qty <= 1}
                              >
                                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </Button>
                              <span className="font-semibold text-gray-900 text-xs sm:text-sm min-w-[35px] sm:min-w-[40px] text-center">
                                {item.qty} {item.unit}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-white"
                                onClick={() => handleUpdateQty(item.id, 1)}
                              >
                                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right min-w-[80px] sm:min-w-[100px]">
                              <p className="font-bold text-[#2A5C82] text-xs sm:text-sm">
                                Rp {itemTotal.toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Summary - Responsive */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border-2 border-green-300 space-y-2">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2">Rincian Biaya</h4>
                
                {/* Items Total */}
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-700">Sparepart & Material</span>
                  <span className="font-semibold text-gray-900">
                    Rp {bookingItems.reduce((sum, item) => {
                      const itemPrice = item.price || (inventory.find(inv => inv.sku === item.sku)?.price || 0);
                      return sum + (itemPrice * item.qty);
                    }, 0).toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Service Fee - FREE */}
                <div className="flex justify-between items-center text-xs sm:text-sm bg-white rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border border-green-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-gray-700">Biaya Jasa Service</span>
                    <Badge className="bg-green-600 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0">GRATIS</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-gray-400 line-through text-[10px] sm:text-xs">Rp 25.000</span>
                    <span className="font-bold text-green-600 text-xs sm:text-sm">Rp 0</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-green-400 my-2"></div>

                {/* Grand Total */}
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-gray-900 text-sm sm:text-base">Total Pembayaran</span>
                  <span className="text-xl sm:text-2xl font-bold text-green-700">
                    Rp {bookingItems.reduce((sum, item) => {
                      const itemPrice = item.price || (inventory.find(inv => inv.sku === item.sku)?.price || 0);
                      return sum + (itemPrice * item.qty);
                    }, 0).toLocaleString('id-ID')}
                  </span>
                </div>
                
                {/* Promo Info */}
                <div className="bg-green-100 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 mt-2">
                  <p className="text-[10px] sm:text-xs text-green-800 text-center font-medium">
                    🎉 Promo Booking Online - Hemat Rp 25.000!
                  </p>
                </div>
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-full sm:flex-1 h-9 sm:h-10 text-sm"
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  disabled={submitting || bookingItems.length === 0}
                  className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-9 sm:h-10 text-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      Konfirmasi Booking
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Item Modal - Responsive */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Edit Item</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Ubah quantity item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div>
                <Label className="text-xs sm:text-sm">Nama Item</Label>
                <Input value={editingItem.name} disabled className="text-sm" />
              </div>
              <div>
                <Label className="text-xs sm:text-sm">SKU</Label>
                <Input value={editingItem.sku} disabled className="text-sm" />
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={editQty}
                  onChange={(e) => setEditQty(parseInt(e.target.value) || 1)}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 h-9 sm:h-10 text-sm"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-[#2A5C82] hover:bg-[#1e4460] h-9 sm:h-10 text-sm"
                >
                  Simpan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info: No vehicles - Responsive */}
      {realVehicles.length === 0 && (
        <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
          <CardContent className="flex flex-col items-center justify-center py-6 sm:py-8 px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2 text-center">
              Info: Kendaraan Belum Terdaftar
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 text-center mb-2.5 sm:mb-3 max-w-md">
              Anda tetap bisa booking tanpa kendaraan terdaftar.
              Atau daftarkan kendaraan untuk tracking yang lebih detail.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('vehicles')}
              className="border-orange-300 text-orange-700 hover:bg-orange-100 h-8 sm:h-9 text-xs sm:text-sm"
            >
              Daftar Kendaraan (Opsional)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}