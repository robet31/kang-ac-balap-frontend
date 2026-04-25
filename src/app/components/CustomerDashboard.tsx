import { useState, useEffect } from 'react';
import { BookingTab } from './dashboard/BookingTab';
import { ReviewsTab } from './dashboard/ReviewsTab';
import { TrackingTab } from './dashboard/TrackingTab';
import { ServiceHistoryTab } from './dashboard/ServiceHistoryTab';
import { RecommendationCard } from './dashboard/RecommendationCard';
import { VehicleHistoryDialog } from './dashboard/VehicleHistoryDialog';
import { VehicleRecommendationsSection } from './dashboard/VehicleRecommendationsSection';
import { VehicleRecommendationCard } from './dashboard/VehicleRecommendationCard';
import { useVehicleRecommendations } from '../hooks/useVehicleRecommendations';
import logoImage from 'figma:asset/02aef87afa090fdbcaef1cdcae0089d551235b8e.png';

import { 
  Calendar, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  AlertCircle,
  Car,
  FileText,
  User,
  Plus,
  ArrowRight,
  Download,
  LogOut,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  Star,
  TrendingUp,
  Menu,
  MapPin,
  Bike,
  Trash2,
  History,
  DollarSign,
  Package,
  Sparkles,
  Bell,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '../utils/supabase/client';
import { publicAnonKey, projectId } from '../utils/supabase/info';
import { toast } from 'sonner';

// Mock data
const mockActiveJob = {
  id: '1',
  vehiclePlate: 'B 1234 XYZ',
  vehicleName: 'Honda CB150R',
  serviceName: 'Premium Service',
  status: 'in_progress',
  progress: 65,
  scheduledDate: '2026-02-05',
  estimatedCompletion: '14:30',
  technician: {
    name: 'Ari Wijaya',
    avatar: null,
  },
  updates: [
    { time: '10:00', text: 'Job dimulai - Inspeksi awal motor', status: 'completed' },
    { time: '10:30', text: 'Penggantian oli mesin dan filter', status: 'completed' },
    { time: '11:15', text: 'Tune up karburator sedang dikerjakan', status: 'in_progress' },
    { time: '12:00', text: 'Quality check dan test ride', status: 'pending' },
  ],
};

// Mock service history data
const mockServiceHistory = [
  {
    id: '1',
    date: '2026-01-15',
    status: 'completed',
    vehicle_id: '1',
    technician: 'Budi Santoso',
    mechanic_notes: 'Semua komponen dalam kondisi baik',
    services: {
      name: 'Premium Service',
      description: 'Service besar premium',
      base_price: 150000
    },
    parts_used: [
      { name: 'Oli Mesin Shell Helix', qty: 1, price: 85000 },
      { name: 'Filter Oli', qty: 1, price: 25000 },
      { name: 'Busi NGK', qty: 2, price: 40000 }
    ],
    vehicles: {
      plate_number: 'B 1234 XYZ',
      brand: 'Honda',
      model: 'CB150R'
    }
  },
  {
    id: '2',
    date: '2025-12-10',
    status: 'completed',
    vehicle_id: '2',
    technician: 'Ahmad Rizki',
    mechanic_notes: 'Karburator dibersihkan, mesin sudah normal',
    services: {
      name: 'Basic Tune-Up',
      description: 'Perawatan rutin lengkap',
      base_price: 60000
    },
    parts_used: [
      { name: 'Oli Mesin Yamalube', qty: 1, price: 60000 }
    ],
    vehicles: {
      plate_number: 'B 5678 ABC',
      brand: 'Yamaha',
      model: 'NMAX'
    }
  },
  {
    id: '3',
    date: '2025-11-05',
    status: 'completed',
    vehicle_id: '1',
    technician: 'Budi Santoso',
    mechanic_notes: 'Rem depan disetel, tekanan ban sudah sesuai',
    services: {
      name: 'Standard Service',
      description: 'Perawatan menyeluruh',
      base_price: 100000
    },
    parts_used: [
      { name: 'Oli Mesin', qty: 1, price: 70000 },
      { name: 'Kampas Rem', qty: 1, price: 30000 }
    ],
    vehicles: {
      plate_number: 'B 1234 XYZ',
      brand: 'Honda',
      model: 'CB150R'
    }
  }
];

export function CustomerDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState('tracking');
  const { signOut, profile, user } = useAuth();
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Vehicle management
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vehicleForm, setVehicleForm] = useState({
    plate_number: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    engine_number: '',
    frame_number: ''
  });
  const [selectedVehicleHistory, setSelectedVehicleHistory] = useState<any>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  
  // Collapse/Expand state for recommendations section
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(true);
  
  // Get recommendations
  const { recommendations, loading: loadingRecommendations, enabled: recommendationsEnabled } = useVehicleRecommendations(vehicles);
  
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    
    if (user) {
      if (isMounted) {
        fetchVehicles();
      }
      if (activeTab === 'history' && isMounted) {
        fetchServiceHistory();
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, activeTab, filterStatus]);

  const fetchVehicles = async () => {
    if (!user?.id) return;
    
    setLoadingVehicles(true);
    try {
      // Fetch vehicles from KV store via server API
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/prefix/vehicle_${user.id}_`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const vehiclesList = data.data || [];
        // Sort by created_at descending
        const sorted = vehiclesList.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setVehicles(sorted);
      } else {
        console.log('No vehicles found for user - this is OK, booking can proceed without vehicle');
        setVehicles([]);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch vehicles aborted');
        return;
      }
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!vehicleForm.plate_number || !vehicleForm.brand || !vehicleForm.model) {
      toast.error('Mohon lengkapi data kendaraan (Plat Nomor, Merk, Model)');
      return;
    }

    try {
      const vehicleId = `vehicle_${user?.id}_${Date.now()}`;
      const vehicleData = {
        id: vehicleId,
        plate_number: vehicleForm.plate_number,
        brand: vehicleForm.brand,
        model: vehicleForm.model,
        year: vehicleForm.year,
        color: vehicleForm.color || '',
        user_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to KV store via server API - Updated endpoint format
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/set/${vehicleId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(vehicleData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving vehicle:', errorData);
        throw new Error(errorData.error || 'Failed to save vehicle');
      }

      toast.success('Kendaraan berhasil ditambahkan!');
      setVehicles([vehicleData, ...vehicles]);
      setAddVehicleOpen(false);
      setVehicleForm({
        plate_number: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        engine_number: '',
        frame_number: ''
      });
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      toast.error(`Gagal menambahkan kendaraan: ${error.message}`);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string, plateNumber: string) => {
    if (!confirm(`Hapus kendaraan ${plateNumber}? Data tidak dapat dikembalikan.`)) {
      return;
    }

    try {
      // Delete from KV store via server API - Updated endpoint format
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/delete/${vehicleId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting vehicle:', errorData);
        throw new Error(errorData.error || 'Failed to delete vehicle');
      }

      toast.success('Kendaraan berhasil dihapus!');
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      toast.error(`Gagal menghapus kendaraan: ${error.message}`);
    }
  };

  const fetchServiceHistory = async () => {
    setLoadingHistory(true);
    
    setTimeout(() => {
      let data = mockServiceHistory;
      
      if (filterStatus !== 'all') {
        data = data.filter(item => item.status === filterStatus);
      }
      
      setServiceHistory(data);
      setLoadingHistory(false);
      toast.success('Riwayat service berhasil dimuat');
    }, 500);
  };

  const getVehicleHistory = (vehicleId: string) => {
    return mockServiceHistory.filter(record => record.vehicle_id === vehicleId);
  };

  const filteredHistory = serviceHistory.filter((record) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      record.services?.name?.toLowerCase().includes(searchLower) ||
      record.vehicles?.plate_number?.toLowerCase().includes(searchLower) ||
      record.vehicles?.brand?.toLowerCase().includes(searchLower) ||
      record.vehicles?.model?.toLowerCase().includes(searchLower)
    );
  });

  const handleLogout = async () => {
    await signOut();
    toast.success('Berhasil keluar');
    onNavigate('landing');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'Menunggu', className: 'bg-gray-500' },
      scheduled: { label: 'Dijadwalkan', className: 'bg-blue-500' },
      in_progress: { label: 'Sedang Dikerjakan', className: 'bg-[#F59E0B]' },
      awaiting_payment: { label: 'Menunggu Pembayaran', className: 'bg-orange-500' },
      completed: { label: 'Selesai', className: 'bg-[#10B981]' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.className} text-white border-0`}>{config.label}</Badge>;
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? 'flex flex-col space-y-2' : 'flex items-center gap-4'}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => {
          handleLogout();
          mobile && setMobileMenuOpen(false);
        }}
        className={mobile ? 'justify-start text-red-600' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Keluar
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop & Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
              <img 
                src={logoImage} 
                alt="YAMAHA Logo" 
                className="h-10 w-auto object-contain opacity-95" 
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex">
              <NavLinks />
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-8">
                    <img 
                      src={logoImage} 
                      alt="YAMAHA Logo" 
                      className="h-10 w-auto object-contain opacity-95" 
                    />
                  </div>
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Selamat datang, {profile?.name || 'Cahya'}! 👋
          </h1>
          <p className="text-gray-600">Kelola kendaraan dan tracking service Anda</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Responsive Tabs */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="grid w-full grid-cols-4 bg-[#E8F4F9]">
              <TabsTrigger value="tracking" className="data-[state=active]:bg-[#2A5C82] data-[state=active]:text-white whitespace-nowrap text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Tracking</span>
                <span className="sm:hidden">Track</span>
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="data-[state=active]:bg-[#2A5C82] data-[state=active]:text-white whitespace-nowrap text-xs sm:text-sm">
                <Bike className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Kendaraan</span>
                <span className="sm:hidden">Motor</span>
              </TabsTrigger>
              <TabsTrigger value="booking" className="data-[state=active]:bg-[#2A5C82] data-[state=active]:text-white whitespace-nowrap text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Booking
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-[#2A5C82] data-[state=active]:text-white whitespace-nowrap text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Review
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tracking Tab */}
          <TabsContent value="tracking">
            <TrackingTab onNavigate={(tab: string) => setActiveTab(tab)} />
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            {/* Vehicles Header Banner - Similar to Recommendations */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl px-6 py-4 shadow-lg mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Kendaraan Terdaftar</h3>
                    <p className="text-blue-100 text-sm">Kelola semua kendaraan Anda disini</p>
                  </div>
                </div>
                <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white hover:bg-gray-100 text-blue-600 font-semibold w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Kendaraan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Tambah Kendaraan Baru</DialogTitle>
                      <DialogDescription>
                        Lengkapi data kendaraan Anda untuk memudahkan booking service
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="plate">Plat Nomor *</Label>
                        <Input
                          id="plate"
                          placeholder="B 1234 XYZ"
                          value={vehicleForm.plate_number}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, plate_number: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="brand">Merk *</Label>
                          <Input
                            id="brand"
                            placeholder="Honda"
                            value={vehicleForm.brand}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="model">Model *</Label>
                          <Input
                            id="model"
                            placeholder="CB150R"
                            value={vehicleForm.model}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="year">Tahun</Label>
                        <Input
                          id="year"
                          type="number"
                          placeholder="2023"
                          value={vehicleForm.year || ''}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, year: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleAddVehicle} className="flex-1 bg-[#2A5C82] hover:bg-[#1e4460]">
                        <Plus className="w-4 h-4 mr-2" />
                        Simpan Kendaraan
                      </Button>
                      <Button variant="outline" onClick={() => setAddVehicleOpen(false)}>
                        Batal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {loadingVehicles ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Loader2 className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Memuat Kendaraan</h3>
                </CardContent>
              </Card>
            ) : vehicles.length > 0 ? (
              <div className="space-y-6">
                {/* Recommendations Section - Separate Grid */}
                {recommendationsEnabled && recommendations.length > 0 && (
                  <div className="space-y-4">
                    {/* Recommendations Header - Clickable to Toggle */}
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl px-6 py-4 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 select-none"
                      onClick={() => setRecommendationsExpanded(!recommendationsExpanded)}
                    >
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Bell className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Rekomendasi Service Berikutnya</h3>
                            <p className="text-orange-100 text-sm">Jangan sampai telat service ya!</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {recommendations.length} rekomendasi
                          </Badge>
                          {recommendationsExpanded ? (
                            <ChevronUp className="w-6 h-6 transition-transform duration-200" />
                          ) : (
                            <ChevronDown className="w-6 h-6 transition-transform duration-200" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Recommendations Grid - Collapsible */}
                    {recommendationsExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        {recommendations.map((rec, index) => (
                          <div
                            key={`rec-${rec.vehicleId}`}
                            className={`${
                              // Bento Layout: First overdue/upcoming spans 2 columns on large screens
                              (rec.isOverdue || rec.isUpcoming) && index === 0
                                ? 'lg:col-span-2'
                                : ''
                            }`}
                          >
                            <VehicleRecommendationCard 
                              recommendation={rec}
                              onNavigate={(tab) => setActiveTab(tab)}
                              index={index}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Vehicles Section - Separate Grid */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {vehicles.map((vehicle) => (
                      <Card 
                        key={vehicle.id} 
                        id={`vehicle-card-${vehicle.id}`}
                        className="hover:shadow-lg transition-all duration-300"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl">{vehicle.brand} {vehicle.model}</CardTitle>
                              <CardDescription className="text-lg font-mono mt-1">{vehicle.plate_number}</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-gray-600">{vehicle.year}</Badge>
                          </div>
                          {vehicle.color && (
                            <div className="text-sm text-gray-600 mt-2">
                              Warna: {vehicle.color}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <VehicleHistoryDialog
                              vehicle={vehicle}
                              open={showHistoryDialog && selectedVehicleHistory?.id === vehicle.id}
                              onOpenChange={(open) => {
                                setShowHistoryDialog(open);
                                if (!open) setSelectedVehicleHistory(null);
                              }}
                              onNavigate={(tab) => setActiveTab(tab)}
                              trigger={
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedVehicleHistory(vehicle);
                                    setShowHistoryDialog(true);
                                  }}
                                >
                                  Lihat Riwayat & Rekomendasi
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              }
                            />

                            <Button 
                              variant="destructive" 
                              className="w-full"
                              onClick={() => handleDeleteVehicle(vehicle.id, vehicle.plate_number)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus Kendaraan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Kendaraan</h3>
                  <p className="text-gray-600 mb-6">Tambahkan kendaraan Anda untuk memulai</p>
                  <Button onClick={() => setAddVehicleOpen(true)} className="bg-[#10B981] hover:bg-[#059669]">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kendaraan Pertama
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="booking"><BookingTab vehicles={vehicles} onNavigate={onNavigate} /></TabsContent>
          <TabsContent value="reviews"><ReviewsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}