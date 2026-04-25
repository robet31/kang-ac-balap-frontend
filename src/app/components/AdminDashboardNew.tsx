import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  BarChart3,
  PieChart,
  Activity,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Star,
  FileText,
  QrCode, // Add QrCode icon
  Camera
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { publicAnonKey, projectId } from '../utils/supabase/info';
import { AssignTechnicianDialog } from './dialogs/AssignTechnicianDialog';
import { InventoryDialog } from './dialogs/InventoryDialog';
import { TechnicianDialog } from './dialogs/TechnicianDialog';
import { SettingsDialog } from './dialogs/SettingsDialog';
import { JobDetailDialog } from './dialogs/JobDetailDialog';
import { QRScannerDialog } from './dialogs/QRScannerDialog'; // Add QR Scanner
import { AdvancedAnalytics } from './dashboard/AdvancedAnalytics';
import { RealTimeJobOrdersTab } from './admin/RealTimeJobOrdersTab';
import logoImage from 'figma:asset/02aef87afa090fdbcaef1cdcae0089d551235b8e.png';
import { useRealtimeJobOrders } from '../hooks/useRealtimeJobOrders';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { createClient } from '../utils/supabase/client';
import CreateJobPage from '../pages/admin/create-job';
import InventoryForm from '../pages/admin/inventory-form';
import TechnicianForm from '../pages/admin/technician-form';
import AssignTechnician from '../pages/admin/assign-technician';
import JobDetail from '../pages/admin/job-detail';
import { populateInventory, populateTechnicians } from '../utils/populate-data';

interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  status: 'available' | 'busy';
  activeJobs: number;
  completedJobs: number;
  rating: number;
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
  lowStock: boolean;
}

interface Job {
  id: string;
  jobNumber: string;
  customer: string;
  vehicle: string;
  service: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  date: string;
}

const revenueData = [
  { month: 'Sep', revenue: 12000000, orders: 45 },
  { month: 'Oct', revenue: 15000000, orders: 52 },
  { month: 'Nov', revenue: 18000000, orders: 61 },
  { month: 'Dec', revenue: 22000000, orders: 73 },
  { month: 'Jan', revenue: 25000000, orders: 85 },
  { month: 'Feb', revenue: 28000000, orders: 92 },
];

const serviceDistribution = [
  { name: 'Basic', value: 120, color: '#3b82f6' },
  { name: 'Standard', value: 180, color: '#10b981' },
  { name: 'Premium', value: 140, color: '#f59e0b' },
];

export function AdminDashboardNew({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // ✅ Real-time Dashboard Stats Hook
  const { stats, loading: statsLoading, error: statsError, refresh: refreshStats } = useDashboardStats();
  
  // Job Orders states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [assignDialog, setAssignDialog] = useState(false);
  const [jobDetailDialog, setJobDetailDialog] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showAssignTechnician, setShowAssignTechnician] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(false);
  
  // Inventory states
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editInventoryItem, setEditInventoryItem] = useState<InventoryItem | null>(null);
  const [inventoryDialog, setInventoryDialog] = useState(false);
  const [inventoryMode, setInventoryMode] = useState<'create' | 'edit'>('create');
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  
  // Technician states
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [editTechnician, setEditTechnician] = useState<Technician | null>(null);
  const [techDialog, setTechDialog] = useState(false);
  const [techMode, setTechMode] = useState<'create' | 'edit'>('create');
  const [showTechnicianForm, setShowTechnicianForm] = useState(false);
  
  // Settings states
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: profile?.full_name || 'Admin User',
    email: user?.email || 'admin@demo.com',
    phone: profile?.phone || '081234567890'
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [users, setUsers] = useState<any[]>([]);
  
  // QR Scanner state
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleLogout = async () => {
    await signOut();
    if (onNavigate) {
      onNavigate('landing');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pending' },
      in_progress: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Cancelled' },
      available: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Aktif' },
      busy: { color: 'bg-orange-100 text-orange-800 border-orange-200', text: 'Sibuk' },
      active: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Aktif' },
      off: { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Off' },
    };

    const variant = variants[status] || variants.pending;
    return (
      <Badge className={`${variant.color} border font-medium px-3 py-1`}>
        {variant.text}
      </Badge>
    );
  };

  const initializeInventoryData = async () => {
    const data = await populateInventory();
    setInventory(data);
    toast.success('Inventory data populated!');
  };

  const initializeTechnicianData = async () => {
    const data = await populateTechnicians();
    setTechnicians(data);
    toast.success('Technician data populated!');
  };

  const loadInventory = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/prefix/inventory_`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const items = data.data || [];
        setInventory(Array.isArray(items) ? items : []);
      } else {
        setInventory([]);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      setInventory([]);
    }
  };

  const loadTechnicians = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/prefix/technician_`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const items = data.data || [];
        setTechnicians(Array.isArray(items) ? items : []);
      } else {
        setTechnicians([]);
      }
    } catch (error) {
      console.error('Error loading technicians:', error);
      setTechnicians([]);
    }
  };

  const handleDeleteInventory = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    toast.success('Item deleted successfully');
  };

  const handleDeleteTechnician = (id: string) => {
    setTechnicians(prev => prev.filter(tech => tech.id !== id));
    toast.success('Technician deleted successfully');
  };

  const handleSaveInventory = (item: InventoryItem) => {
    if (inventoryMode === 'create') {
      setInventory(prev => [...prev, item]);
      toast.success('Item added successfully');
    } else {
      setInventory(prev => prev.map(i => i.id === item.id ? item : i));
      toast.success('Item updated successfully');
    }
  };

  const handleSaveTechnician = (tech: Technician) => {
    if (techMode === 'create') {
      setTechnicians(prev => [...prev, tech]);
      toast.success('Technician added successfully');
    } else {
      setTechnicians(prev => prev.map(t => t.id === tech.id ? tech : t));
      toast.success('Technician updated successfully');
    }
  };

  const handleAssignTechnician = (jobId: string, techId: string) => {
    toast.success('Technician assigned successfully');
  };

  const refreshJobs = () => {
    // Refresh job list
    toast.success('Jobs refreshed');
  };
  
  const handleQRScanSuccess = async (qrData: string) => {
    try {
      console.log('QR Code Scanned:', qrData);
      
      // Show loading toast
      const loadingToast = toast.loading('Memproses QR Code...', {
        description: 'Validating booking...'
      });
      
      // Call QR check-in endpoint (validate + update status in one call)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/qr-checkin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ qrCode: qrData })
        }
      );

      const result = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.error || 'QR Code tidak valid atau sudah digunakan');
      }

      const updatedBooking = result.data;

      // Show success notification
      toast.success('✅ Check-in Berhasil!', {
        description: `Booking #${updatedBooking.job_number} sedang dikerjakan`,
        duration: 5000
      });
      
      // Close QR Scanner dialog
      setShowQRScanner(false);
      
      // Navigate to jobs tab to show updated booking
      setActiveTab('jobs');
      
      // The real-time subscription will automatically update the job list
      console.log('✅ Navigated to Jobs tab. Real-time updates active.');
      
    } catch (error: any) {
      console.error('QR Scan Error:', error);
      toast.error('❌ Gagal memproses QR Code', {
        description: error.message || 'QR Code tidak valid atau sudah digunakan',
        duration: 5000
      });
    }
  };

  // Load data on mount
  useEffect(() => {
    loadInventory();
    loadTechnicians();
  }, []);

  // Show page overlays
  if (showCreateJob) {
    return <CreateJobPage onBack={() => setShowCreateJob(false)} />;
  }
  if (showInventoryForm) {
    return (
      <InventoryForm
        onBack={() => {
          setShowInventoryForm(false);
          loadInventory(); // Reload data when coming back
        }}
        onSuccess={() => {
          setShowInventoryForm(false);
          loadInventory(); // Reload data after success
        }}
        item={editInventoryItem}
        mode={inventoryMode}
      />
    );
  }
  if (showTechnicianForm) {
    return (
      <TechnicianForm
        onBack={() => {
          setShowTechnicianForm(false);
          loadTechnicians(); // Reload data when coming back
        }}
        onSuccess={() => {
          setShowTechnicianForm(false);
          loadTechnicians(); // Reload data after success
        }}
        technician={editTechnician}
        mode={techMode}
      />
    );
  }
  if (showAssignTechnician && selectedJob) {
    return (
      <AssignTechnician
        onBack={() => setShowAssignTechnician(false)}
        job={selectedJob}
        technicians={technicians}
      />
    );
  }
  if (showJobDetail && selectedJob) {
    return (
      <JobDetail
        onBack={() => setShowJobDetail(false)}
        job={selectedJob}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full z-50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="YAMAHA Logo" 
              className="h-10 w-auto object-contain opacity-95"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeTab === 'overview' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeTab === 'jobs' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5" />
              <span className="font-medium">Orders</span>
            </div>
            {/* ✅ Badge with smooth animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: stats.pendingOrders > 0 ? 1 : 0,
                opacity: stats.pendingOrders > 0 ? 1 : 0 
              }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {stats.pendingOrders > 0 && (
                <Badge className={`${activeTab === 'jobs' ? 'bg-white text-red-600' : 'bg-red-600 text-white'} text-xs px-2 font-bold`}>
                  {stats.pendingOrders}
                </Badge>
              )}
            </motion.div>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeTab === 'inventory' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </div>
            {inventory.filter(i => i.lowStock).length > 0 && (
              <Badge className={`${activeTab === 'inventory' ? 'bg-white text-red-600' : 'bg-red-600 text-white'} text-xs px-2`}>
                {inventory.filter(i => i.lowStock).length}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveTab('technicians')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeTab === 'technicians' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Technicians</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeTab === 'analytics' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
        </nav>

        {/* Settings & Logout Section */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setSettingsDialog(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search orders, products, customers..."
                    className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Right Side - Admin Info & Actions */}
              <div className="flex items-center gap-4">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                  onClick={() => setShowCreateJob(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {profile?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {profile?.full_name || 'Admin User'}
                    </div>
                    <div className="text-xs text-gray-500">Super Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Page Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Monitor your business performance and key metrics</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsLoading ? (
                  // Loading State
                  Array.from({ length: 4 }).map((_, index) => (
                    <Card key={`skeleton-${index}`} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-10 bg-gray-200 rounded mb-4"></div>
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  [
                    { 
                      title: 'Total Reviews', 
                      value: stats.totalReviews.toString(), 
                      icon: FileText, 
                      color: 'bg-purple-500',
                      subtitle: 'Active testimonials'
                    },
                    { 
                      title: 'Avg Rating', 
                      value: stats.avgRating.toString(), 
                      icon: Star, 
                      color: 'bg-yellow-500',
                      subtitle: 'Out of 5 stars'
                    },
                    { 
                      title: 'Featured', 
                      value: stats.featuredCount.toString(), 
                      icon: CheckCircle2, 
                      color: 'bg-green-500',
                      subtitle: 'Featured testimonials'
                    },
                    { 
                      title: 'Total Orders', 
                      value: stats.totalOrders.toString(), 
                      icon: TrendingUp, 
                      color: 'bg-blue-500',
                      subtitle: 'All time'
                    }
                  ].map((kpi, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border border-gray-200 hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`${kpi.color} p-2 rounded-lg`}>
                                <kpi.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-sm font-medium text-gray-600">{kpi.title}</div>
                            </div>
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                              <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Quick Action: QR Code Scanner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-white hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setShowQRScanner(true)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <QrCode className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">Scan QR Code Booking</h3>
                          <p className="text-sm text-gray-600">
                            Klik untuk membuka kamera dan scan QR Code customer untuk check-in
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-600 text-white px-4 py-2 text-sm font-medium">
                          Quick Action
                        </Badge>
                        <Camera className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Charts Row 1: Top 5 Spareparts + Job Status Distribution */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* ✅ Top 5 Spareparts */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="w-5 h-5 text-red-600" />
                        Top 5 Spareparts
                      </CardTitle>
                      <CardDescription>Berdasarkan total revenue & frekuensi penggunaan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.topSpareparts.length > 0 ? (
                        <div className="space-y-4">
                          {stats.topSpareparts.map((item, index) => {
                            const maxRevenue = Math.max(...stats.topSpareparts.map(s => s.revenue));
                            const percentage = (item.revenue / maxRevenue) * 100;
                            
                            return (
                              <div key={index} className="space-y-2">
                                <div className="flex items-start justify-between text-sm gap-3">
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-900 block">
                                      {index + 1}. {item.name}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1 block">
                                      Digunakan {item.count}x dalam berbagai job
                                    </span>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className="font-bold text-red-600 whitespace-nowrap block">
                                      Rp {(item.revenue / 1000000).toFixed(2)}M
                                    </span>
                                    <span className="text-xs text-gray-500">Total Revenue</span>
                                  </div>
                                </div>
                                <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center"
                                    style={{ minWidth: percentage > 15 ? 'auto' : '60px' }}
                                  >
                                    <span className="text-xs font-bold text-white px-3">
                                      {percentage.toFixed(0)}%
                                    </span>
                                  </motion.div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Belum ada data sparepart</p>
                            <p className="text-xs mt-1">Data akan muncul setelah ada job dengan sparepart</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* ✅ Job Status Distribution (MOVED HERE) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle2 className="w-5 h-5 text-red-600" />
                        Job Status Distribution
                      </CardTitle>
                      <CardDescription>Status distribusi order bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // ✅ Calculate job status distribution with dummy fallback
                        const dummyStatusData = [
                          { name: 'Completed', value: 45, color: '#10b981', count: 18 },
                          { name: 'In Progress', value: 30, color: '#3b82f6', count: 12 },
                          { name: 'Pending', value: 20, color: '#f59e0b', count: 8 },
                          { name: 'Cancelled', value: 5, color: '#ef4444', count: 2 }
                        ];

                        const statusData = stats.jobStatusDistribution && stats.jobStatusDistribution.length > 0
                          ? stats.jobStatusDistribution
                          : dummyStatusData;

                        const totalOrders = statusData.reduce((sum, item) => sum + (item.count || item.value), 0);

                        return (
                          <div className="space-y-4">
                            {/* Donut Chart */}
                            <ResponsiveContainer width="100%" height={200}>
                              <RechartsPieChart>
                                <Pie
                                  data={statusData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={90}
                                  fill="#8884d8"
                                  paddingAngle={2}
                                  dataKey="value"
                                  animationDuration={1000}
                                >
                                  {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                  formatter={(value: any) => [`${value}%`, 'Percentage']}
                                />
                              </RechartsPieChart>
                            </ResponsiveContainer>

                            {/* Total Orders Badge */}
                            <div className="text-center -mt-2">
                              <div className="text-3xl font-bold text-gray-900">{totalOrders}</div>
                              <div className="text-sm text-gray-500">Total Orders</div>
                            </div>

                            {/* Status Legend with Stats */}
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                              {statusData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-3 h-3 rounded-full" 
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">{item.count || item.value} orders</span>
                                    <Badge 
                                      className="font-bold" 
                                      style={{ 
                                        backgroundColor: `${item.color}20`, 
                                        color: item.color,
                                        border: `1px solid ${item.color}40`
                                      }}
                                    >
                                      {item.value}%
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Charts Row 2: Service Distribution + Weekly Revenue */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Service Distribution (MOVED TO LEFT) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="w-5 h-5 text-red-600" />
                        Service Distribution
                      </CardTitle>
                      <CardDescription>Distribusi paket service</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={stats.serviceDistribution.length > 0 ? stats.serviceDistribution : serviceDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            animationDuration={1000}
                          >
                            {(stats.serviceDistribution.length > 0 ? stats.serviceDistribution : serviceDistribution).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Weekly Revenue Chart (MOVED TO RIGHT) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="w-5 h-5 text-red-600" />
                        Weekly Revenue - {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                      </CardTitle>
                      <CardDescription>Pendapatan per minggu bulan ini (real-time)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // ✅ Fallback dummy data jika stats kosong atau belum loaded
                        const dummyWeeklyData = [
                          { week: 'Week 1 (1-7)', revenue: 3500000 },
                          { week: 'Week 2 (8-14)', revenue: 4200000 },
                          { week: 'Week 3 (15-21)', revenue: 5100000 },
                          { week: 'Week 4 (22-28)', revenue: 2800000 }
                        ];

                        const displayData = stats.weeklyRevenueData && stats.weeklyRevenueData.length > 0 
                          ? stats.weeklyRevenueData 
                          : dummyWeeklyData;

                        console.log('📊 Weekly Revenue Render:', { 
                          fromStats: stats.weeklyRevenueData?.length || 0, 
                          displayData: displayData.length,
                          isUsingDummy: displayData === dummyWeeklyData
                        });

                        return (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart 
                              data={displayData} 
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="week"
                                stroke="#6b7280" 
                                style={{ fontSize: '11px' }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis 
                                stroke="#6b7280" 
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                              />
                              <Bar 
                                dataKey="revenue" 
                                fill="#dc2626" 
                                radius={[8, 8, 0, 0]}
                                animationDuration={1000}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Recent Jobs */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Recent Orders</CardTitle>
                      <CardDescription>Latest job orders from customers</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('jobs')}
                      className="border-gray-300 hover:border-red-500 hover:text-red-600"
                    >
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Wrench className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{job.jobNumber}</h4>
                            <p className="text-sm text-gray-600">{job.customer} - {job.vehicle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">{job.service}</div>
                            <div className="font-bold text-red-600">Rp {job.amount.toLocaleString('id-ID')}</div>
                          </div>
                          {getStatusBadge(job.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs content will be here - continuing with existing AdminDashboard tabs */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Orders</h1>
                <p className="text-sm text-gray-500 mt-1">Manage all service orders and bookings</p>
              </div>
              <RealTimeJobOrdersTab 
                onAssignClick={(job) => {
                  setSelectedJob(job);
                  setShowAssignTechnician(true);
                }}
                onViewDetails={(job) => {
                  setSelectedJob(job);
                  setShowJobDetail(true);
                }}
                technicians={technicians}
                onCreateJob={() => setShowCreateJob(true)}
                onScanQR={() => setShowQRScanner(true)}
              />
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage products and spare parts stock</p>
                </div>
                <div className="flex items-center gap-3">
                  {inventory.length === 0 && (
                    <Button 
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={initializeInventoryData}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Populate Data
                    </Button>
                  )}
                  <Button variant="outline" className="border-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                    onClick={() => {
                      setEditInventoryItem(null);
                      setInventoryMode('create');
                      setShowInventoryForm(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>

              {/* Low Stock Alert */}
              {inventory.filter(i => i.lowStock).length > 0 && (
                <Card className="border-2 border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-900">Low Stock Warning</h4>
                          <p className="text-sm text-red-700">
                            {inventory.filter(i => i.lowStock).length} items need restocking
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-red-600 text-white px-3 py-1">
                        Urgent
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Inventory Table */}
              {inventory.length === 0 ? (
                <Card className="border border-gray-200">
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inventory Items</h3>
                    <p className="text-sm text-gray-500 mb-6">Start by adding your first inventory item or populate with sample data.</p>
                    <div className="flex justify-center gap-3">
                      <Button 
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        onClick={initializeInventoryData}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Populate Sample Data
                      </Button>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          setEditInventoryItem(null);
                          setInventoryMode('create');
                          setShowInventoryForm(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-gray-200">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {inventory.map((item, index) => (
                            <tr key={`inventory-row-${index}-${item.sku}`} className={`hover:bg-gray-50 ${item.lowStock ? 'bg-red-50' : ''}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.sku}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.supplier}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{item.category}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-bold ${item.lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                    {item.stock}
                                  </span>
                                  <span className="text-xs text-gray-500">/ {item.minStock} min</span>
                                  {item.lowStock && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Rp {item.price.toLocaleString('id-ID')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setEditInventoryItem(item);
                                      setInventoryMode('edit');
                                      setShowInventoryForm(true);
                                    }}
                                    className="hover:bg-gray-100"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteInventory(item.id || item.sku)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'technicians' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Technician Management</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage workshop technicians and mechanics</p>
                </div>
                <div className="flex items-center gap-3">
                  {technicians.length === 0 && (
                    <Button 
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={initializeTechnicianData}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Populate Data
                    </Button>
                  )}
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                    onClick={() => {
                      setEditTechnician(null);
                      setTechMode('create');
                      setShowTechnicianForm(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Technician
                  </Button>
                </div>
              </div>

              {/* Technicians Grid */}
              {technicians.length === 0 ? (
                <Card className="border border-gray-200">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Technicians</h3>
                    <p className="text-sm text-gray-500 mb-6">Start by adding your first technician or populate with sample data.</p>
                    <div className="flex justify-center gap-3">
                      <Button 
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        onClick={initializeTechnicianData}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Populate Sample Data
                      </Button>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          setEditTechnician(null);
                          setTechMode('create');
                          setShowTechnicianForm(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Technician
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technicians.map((tech) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border border-gray-200 hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {tech.name.charAt(0)}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{tech.name}</CardTitle>
                                <CardDescription className="text-sm">{tech.phone}</CardDescription>
                              </div>
                            </div>
                            {getStatusBadge(tech.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Spesialisasi</div>
                            <Badge variant="outline" className="text-xs">{tech.specialization}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-center pt-3 border-t border-gray-100">
                            <div>
                              <div className="text-2xl font-bold text-red-600">{tech.activeJobs}</div>
                              <div className="text-xs text-gray-600">Active</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-gray-900">{tech.completedJobs}</div>
                              <div className="text-xs text-gray-600">Done</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-yellow-500">{tech.rating}</div>
                              <div className="text-xs text-gray-600">Rating</div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 border-gray-300 hover:border-red-500 hover:text-red-600"
                              onClick={() => {
                                setEditTechnician(tech);
                                setTechMode('edit');
                                setShowTechnicianForm(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => handleDeleteTechnician(tech.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
                <p className="text-sm text-gray-500 mt-1">Advanced insights and performance metrics</p>
              </div>

              <AdvancedAnalytics />
            </div>
          )}
        </div>
      </div>
      
      {/* QR Scanner Dialog */}
      <QRScannerDialog 
        open={showQRScanner}
        onOpenChange={setShowQRScanner}
        onScanSuccess={handleQRScanSuccess}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsDialog}
        onOpenChange={setSettingsDialog}
        currentUser={profile}
        accountForm={accountForm}
        setAccountForm={setAccountForm}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        users={users}
        setUsers={setUsers}
      />
    </div>
  );
}