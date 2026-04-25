import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Package,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  User,
  Shield,
  Mail,
  Phone,
  RefreshCw,
  CheckCircle2
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
import { AdvancedAnalytics } from './dashboard/AdvancedAnalytics';
import { RealTimeJobOrdersTab } from './admin/RealTimeJobOrdersTab';
import logoImage from 'figma:asset/02aef87afa090fdbcaef1cdcae0089d551235b8e.png';
import { useRealtimeJobOrders } from '../hooks/useRealtimeJobOrders';
import { createClient } from '../utils/supabase/client';
import CreateJobPage from '../pages/admin/create-job';
import InventoryForm from '../pages/admin/inventory-form';
import TechnicianForm from '../pages/admin/technician-form';
import AssignTechnician from '../pages/admin/assign-technician';
import JobDetail from '../pages/admin/job-detail';
import { populateInventory, populateTechnicians } from '../utils/populate-data';

// Mock data untuk charts
const revenueData = [
  { month: 'Jan', revenue: 12500000, orders: 45 },
  { month: 'Feb', revenue: 15200000, orders: 52 },
  { month: 'Mar', revenue: 13800000, orders: 48 },
  { month: 'Apr', revenue: 16900000, orders: 58 },
  { month: 'Mei', revenue: 18500000, orders: 63 },
  { month: 'Jun', revenue: 21000000, orders: 71 },
];

const serviceDistribution = [
  { name: 'Hemat Service', value: 120, color: '#3B82F6' },
  { name: 'Basic Tune-Up', value: 180, color: '#10B981' },
  { name: 'Standard Service', value: 95, color: '#F59E0B' },
  { name: 'Premium Service', value: 45, color: '#8B5CF6' },
];

const mockJobs = [
  {
    id: '1',
    jobNumber: 'JO-2026-001',
    customer: 'Budi Santoso',
    vehicle: 'B 1234 XYZ - Honda CB150R',
    service: 'Premium Service',
    status: 'in_progress',
    technician: 'Ari Wijaya',
    scheduledDate: '2026-02-03',
    amount: 500000
  },
  {
    id: '2',
    jobNumber: 'JO-2026-002',
    customer: 'Rina Kusuma',
    vehicle: 'B 5678 ABC - Yamaha NMAX',
    service: 'Basic Tune-Up',
    status: 'scheduled',
    technician: 'Dedi Susanto',
    scheduledDate: '2026-02-04',
    amount: 150000
  },
  {
    id: '3',
    jobNumber: 'JO-2026-003',
    customer: 'Ahmad Wijaya',
    vehicle: 'B 9012 DEF - Honda Vario',
    service: 'Standard Service',
    status: 'awaiting_payment',
    technician: 'Ari Wijaya',
    scheduledDate: '2026-02-02',
    amount: 300000
  },
  {
    id: '4',
    jobNumber: 'JO-2026-004',
    customer: 'Cahya Customer',
    vehicle: 'B 1111 ZZZ - Honda Beat',
    service: 'Basic Tune-Up',
    status: 'pending',
    technician: null, // Belum di-assign
    scheduledDate: '2026-02-05',
    amount: 60000,
    notes: 'Rem bunyi, tolong dicek'
  },
  {
    id: '5',
    jobNumber: 'JO-2026-005',
    customer: 'Siti Nurhaliza',
    vehicle: 'B 2222 ABC - Yamaha Mio',
    service: 'Standard Service',
    status: 'pending',
    technician: null, // Belum di-assign
    scheduledDate: '2026-02-06',
    amount: 100000,
    notes: 'Ganti oli dan cek rantai'
  }
];

const mockInventory = [
  {
    id: '1',
    sku: 'OLI-001',
    name: 'Oli Mesin SAE 10W-40',
    category: 'Oli & Pelumas',
    stock: 45,
    minStock: 20,
    price: 80000,
    supplier: 'PT Minyak Sejahtera',
    unit: 'liter'
  },
  {
    id: '2',
    sku: 'OLI-002',
    name: 'Oli Mesin Fully Synthetic',
    category: 'Oli & Pelumas',
    stock: 30,
    minStock: 15,
    price: 85000,
    supplier: 'PT Minyak Sejahtera',
    unit: 'liter'
  },
  {
    id: '3',
    sku: 'BPF-001',
    name: 'Busi Iridium',
    category: 'Busi & Pengapian',
    stock: 50,
    minStock: 20,
    price: 35000,
    supplier: 'CV Busi Indonesia',
    unit: 'pcs'
  },
  {
    id: '4',
    sku: 'FLT-001',
    name: 'Filter Udara',
    category: 'Filter',
    stock: 40,
    minStock: 15,
    price: 25000,
    supplier: 'CV Filter Indonesia',
    unit: 'pcs'
  },
  {
    id: '5',
    sku: 'FLT-002',
    name: 'Filter Oli',
    category: 'Filter',
    stock: 35,
    minStock: 15,
    price: 30000,
    supplier: 'CV Filter Indonesia',
    unit: 'pcs'
  },
  {
    id: '6',
    sku: 'PAD-001',
    name: 'Kampas Rem Depan',
    category: 'Rem',
    stock: 25,
    minStock: 10,
    price: 40000,
    supplier: 'PT Spare Part Motor',
    unit: 'set'
  }
];

const mockTechnicians = [
  {
    id: '1',
    name: 'Ari Wijaya',
    phone: '081234567890',
    specialization: 'Engine & Tune-Up',
    activeJobs: 3,
    completedJobs: 156,
    rating: 4.9,
    status: 'active'
  },
  {
    id: '2',
    name: 'Dedi Susanto',
    phone: '081234567891',
    specialization: 'Electrical & CVT',
    activeJobs: 2,
    completedJobs: 142,
    rating: 4.8,
    status: 'active'
  },
  {
    id: '3',
    name: 'Farhan Ahmad',
    phone: '081234567892',
    specialization: 'Body & Painting',
    activeJobs: 1,
    completedJobs: 98,
    rating: 4.7,
    status: 'off'
  }
];

export function AdminDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { signOut, profile } = useAuth();

  // Use realtime job orders hook
  const { jobs: realtimeJobs, loading: jobsLoading, refreshJobs } = useRealtimeJobOrders();
  
  // State for showing create job page
  const [showCreateJob, setShowCreateJob] = useState(false);

  // Dialog States
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [inventoryDialog, setInventoryDialog] = useState(false);
  const [editInventoryItem, setEditInventoryItem] = useState<any>(null);
  const [inventoryMode, setInventoryMode] = useState<'create' | 'edit'>('create');

  const [techDialog, setTechDialog] = useState(false);
  const [editTechnician, setEditTechnician] = useState<any>(null);
  const [techMode, setTechMode] = useState<'create' | 'edit'>('create');

  const [settingsDialog, setSettingsDialog] = useState(false);
  const [jobDetailDialog, setJobDetailDialog] = useState(false);
  
  // State for showing full pages (replacing dialogs)
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showTechnicianForm, setShowTechnicianForm] = useState(false);
  const [showAssignTechnician, setShowAssignTechnician] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(false);
  
  // Settings Tab States
  const [accountForm, setAccountForm] = useState({
    name: profile?.name || 'Admin User',
    email: profile?.email || 'admin@sunest.com',
    phone: profile?.phone || '081234567890'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Admin Utama',
      email: 'admin@sunest.com',
      phone: '081234567890',
      role: 'super_admin',
      status: 'active',
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      name: 'Staff Admin',
      email: 'staff@sunest.com',
      phone: '081234567891',
      role: 'admin',
      status: 'active',
      createdAt: '2025-01-15'
    },
    {
      id: '3',
      name: 'Viewer User',
      email: 'viewer@sunest.com',
      phone: '081234567892',
      role: 'viewer',
      status: 'inactive',
      createdAt: '2025-02-01'
    }
  ]);

  // State for dynamic data
  const [jobs, setJobs] = useState(mockJobs);
  const [inventory, setInventory] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  // Fetch real-time inventory
  useEffect(() => {
    fetchInventory();
  }, [activeTab]);

  // Fetch real-time technicians
  useEffect(() => {
    fetchTechnicians();
  }, [activeTab]);

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
        const items = (data.data || []).map((item: any) => ({
          ...item,
          lowStock: item.stock <= item.minStock
        }));
        setInventory(items);
        
        // Auto-populate with dummy data if empty
        if (items.length === 0) {
          await initializeInventoryData();
        }
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchTechnicians = async () => {
    setLoadingTechnicians(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/prefix/technician_`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTechnicians(data.data || []);
        
        // Auto-populate with dummy data if empty
        if ((data.data || []).length === 0) {
          await initializeTechnicianData();
        }
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  // Initialize inventory with dummy data
  const initializeInventoryData = async () => {
    try {
      const result = await populateInventory();
      if (result.success) {
        await fetchInventory();
        toast.success(`✅ ${result.count} item inventory berhasil diinisialisasi!`);
      } else {
        toast.error('❌ Gagal menginisialisasi inventory');
      }
    } catch (error) {
      console.error('Error initializing inventory:', error);
      toast.error('❌ Gagal menginisialisasi inventory');
    }
  };

  // Initialize technicians with dummy data
  const initializeTechnicianData = async () => {
    try {
      const result = await populateTechnicians();
      if (result.success) {
        await fetchTechnicians();
        toast.success(`✅ ${result.count} teknisi berhasil diinisialisasi!`);
      } else {
        toast.error('❌ Gagal menginisialisasi teknisi');
      }
    } catch (error) {
      console.error('Error initializing technicians:', error);
      toast.error('❌ Gagal menginisialisasi teknisi');
    }
  };

  // Manual populate all data
  const handlePopulateAllData = async () => {
    if (!confirm('Populate semua data (Inventory & Teknisi)? Data lama akan tetap ada.')) {
      return;
    }
    
    toast.loading('🔄 Sedang populate data...');
    
    try {
      await initializeInventoryData();
      await initializeTechnicianData();
      toast.success('✅ Semua data berhasil di-populate!');
    } catch (error) {
      console.error('Error populating all data:', error);
      toast.error('❌ Gagal populate data');
    }
  };

  // CRUD Handlers
  const handleAssignTechnician = (jobId: string, techId: string, notes: string) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const tech = technicians.find(t => t.id === techId);
        return {
          ...job,
          technician: tech?.name || null,
          status: 'scheduled',
          notes: notes || job.notes
        };
      }
      return job;
    });
    
    setJobs(updatedJobs);
    
    const tech = technicians.find(t => t.id === techId);
    const job = jobs.find(j => j.id === jobId);
    
    toast.success(`✅ ${tech?.name} berhasil ditugaskan untuk ${job?.jobNumber}!`);
  };

  const handleSaveInventory = (item: any) => {
    if (inventoryMode === 'create') {
      const newItem = {
        ...item,
        id: `inv-${Date.now()}`,
        lowStock: item.stock <= item.minStock
      };
      setInventory([...inventory, newItem]);
      toast.success('✅ Item baru berhasil ditambahkan ke inventory!');
    } else {
      const updatedInventory = inventory.map(i => 
        i.id === item.id ? { ...item, lowStock: item.stock <= item.minStock } : i
      );
      setInventory(updatedInventory);
      toast.success('✅ Item inventory berhasil diupdate!');
    }
  };

  const handleDeleteInventory = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (confirm(`Hapus item "${item?.name}"?`)) {
      setInventory(inventory.filter(i => i.id !== itemId));
      toast.success('✅ Item berhasil dihapus!');
    }
  };

  const handleSaveTechnician = (tech: any) => {
    if (techMode === 'create') {
      const newTech = {
        ...tech,
        id: `tech-${Date.now()}`,
        activeJobs: 0,
        completedJobs: 0,
        rating: 5.0
      };
      setTechnicians([...technicians, newTech]);
      toast.success('✅ Teknisi baru berhasil ditambahkan!');
    } else {
      const updatedTechs = technicians.map(t => 
        t.id === tech.id ? tech : t
      );
      setTechnicians(updatedTechs);
      toast.success('✅ Data teknisi berhasil diupdate!');
    }
  };

  const handleDeleteTechnician = (techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    if (confirm(`Hapus teknisi "${tech?.name}"?`)) {
      setTechnicians(technicians.filter(t => t.id !== techId));
      toast.success('✅ Teknisi berhasil dihapus!');
    }
  };

  const handleDeleteJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (confirm(`Hapus job "${job?.jobNumber}"?`)) {
      setJobs(jobs.filter(j => j.id !== jobId));
      toast.success('✅ Job berhasil dihapus!');
    }
  };

  const handleLogout = async () => {
    await signOut();
    onNavigate('landing');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'Menunggu', className: 'bg-gray-500' },
      scheduled: { label: 'Dijadwalkan', className: 'bg-blue-500' },
      in_progress: { label: 'Sedang Dikerjakan', className: 'bg-[#F59E0B]' },
      awaiting_payment: { label: 'Menunggu Pembayaran', className: 'bg-orange-500' },
      completed: { label: 'Selesai', className: 'bg-[#10B981]' },
      active: { label: 'Aktif', className: 'bg-green-500' },
      off: { label: 'Off', className: 'bg-gray-500' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.className} text-white border-0`}>{config.label}</Badge>;
  };
  
  // If showing create job page, render that instead
  if (showCreateJob) {
    return (
      <CreateJobPage 
        onBack={() => setShowCreateJob(false)}
        onSuccess={() => {
          setShowCreateJob(false);
          refreshJobs();
        }}
      />
    );
  }

  // Show inventory form page
  if (showInventoryForm) {
    return (
      <InventoryForm
        onBack={() => setShowInventoryForm(false)}
        onSuccess={() => {
          setShowInventoryForm(false);
          fetchInventory(); // Refresh inventory data
        }}
        item={editInventoryItem}
        mode={inventoryMode}
      />
    );
  }

  // Show technician form page
  if (showTechnicianForm) {
    return (
      <TechnicianForm
        onBack={() => setShowTechnicianForm(false)}
        onSuccess={() => {
          setShowTechnicianForm(false);
          fetchTechnicians(); // Refresh technicians data
        }}
        technician={editTechnician}
        mode={techMode}
      />
    );
  }

  // Show assign technician page
  if (showAssignTechnician) {
    return (
      <AssignTechnician
        onBack={() => setShowAssignTechnician(false)}
        onSuccess={() => {
          setShowAssignTechnician(false);
          refreshJobs();
        }}
        job={selectedJob}
        technicians={technicians}
      />
    );
  }

  // Show job detail page
  if (showJobDetail) {
    return (
      <JobDetail
        onBack={() => setShowJobDetail(false)}
        job={selectedJob}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="YAMAHA Logo" 
                className="h-10 w-auto object-contain opacity-95"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 flex-wrap h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Wrench className="w-4 h-4 mr-2" />
              Job Orders
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="technicians" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Teknisi
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Revenue Hari Ini', value: 'Rp 2.5 Jt', icon: DollarSign, color: 'bg-green-500', change: '+12%' },
                { title: 'Job Aktif', value: '8', icon: Activity, color: 'bg-blue-500', change: '+3' },
                { title: 'Menunggu Pembayaran', value: '3', icon: AlertTriangle, color: 'bg-orange-500', change: '+1' },
                { title: 'Stock Alert', value: '5 Items', icon: Package, color: 'bg-red-500', change: '!' }
              ].map((kpi, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${kpi.color} p-3 rounded-lg`}>
                          <kpi.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {kpi.change}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                      <p className="text-sm text-gray-600">{kpi.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Revenue Trend (6 Bulan)
                    </CardTitle>
                    <CardDescription>Perkembangan pendapatan bulanan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                          formatter={(value: any) => [`Rp ${(value / 1000000).toFixed(1)}M`, 'Revenue']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#ff7e5f" 
                          strokeWidth={3}
                          dot={{ fill: '#ff7e5f', r: 5 }}
                          activeDot={{ r: 7 }}
                          animationDuration={1000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Service Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-primary" />
                      Service Distribution
                    </CardTitle>
                    <CardDescription>Distribusi paket service</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={serviceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          animationDuration={1000}
                        >
                          {serviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Jobs */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Job Terbaru</CardTitle>
                  <Button variant="outline" size="sm">
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
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
                          <div className="font-bold text-primary">Rp {job.amount.toLocaleString('id-ID')}</div>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Orders Tab */}
          <TabsContent value="jobs" className="space-y-6">
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
            />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
              <div className="flex items-center gap-3">
                {inventory.length === 0 && (
                  <Button 
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={initializeInventoryData}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Populate Data Dummy
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => {
                    setEditInventoryItem(null);
                    setInventoryMode('create');
                    setShowInventoryForm(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Item
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
                        <h4 className="font-semibold text-red-900">Peringatan Stock Rendah</h4>
                        <p className="text-sm text-red-700">
                          {inventory.filter(i => i.lowStock).length} item perlu di-restock segera
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

            <Card className="border-2 border-gray-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Item</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventory.map((item) => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${item.lowStock ? 'bg-red-50' : ''}`}>
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
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteInventory(item.id)}
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
          </TabsContent>

          {/* Technicians Tab */}
          <TabsContent value="technicians" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Manage Teknisi</h2>
              <div className="flex items-center gap-3">
                {technicians.length === 0 && (
                  <Button 
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={initializeTechnicianData}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Populate Data Dummy
                  </Button>
                )}
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => {
                    setEditTechnician(null);
                    setTechMode('create');
                    setShowTechnicianForm(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Teknisi
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicians.map((tech) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{tech.activeJobs}</div>
                          <div className="text-xs text-gray-600">Aktif</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{tech.completedJobs}</div>
                          <div className="text-xs text-gray-600">Selesai</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-500">{tech.rating}</div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
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
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteTechnician(tech.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Analytics</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Monthly Orders */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle>Monthly Orders Trend</CardTitle>
                  <CardDescription>Jumlah order per bulan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="orders" 
                        fill="#feb47b" 
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Service Performance */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                  <CardDescription>Performa masing-masing paket</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceDistribution.map((service) => (
                      <div key={service.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{service.name}</span>
                          <span className="text-sm font-bold text-gray-900">{service.value} orders</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <motion.div
                            className="h-2.5 rounded-full"
                            style={{ backgroundColor: service.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(service.value / 440) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics */}
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>

        {/* Dialog Components */}
        <AssignTechnicianDialog
          open={assignDialog}
          onOpenChange={setAssignDialog}
          job={selectedJob}
          technicians={technicians}
          onAssign={handleAssignTechnician}
          onSuccess={refreshJobs}
        />

        <InventoryDialog
          open={inventoryDialog}
          onOpenChange={setInventoryDialog}
          item={editInventoryItem}
          mode={inventoryMode}
          onSave={handleSaveInventory}
        />

        <TechnicianDialog
          open={techDialog}
          onOpenChange={setTechDialog}
          technician={editTechnician}
          mode={techMode}
          onSave={handleSaveTechnician}
        />

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

        <JobDetailDialog
          open={jobDetailDialog}
          onOpenChange={setJobDetailDialog}
          job={selectedJob}
        />
      </div>
    </div>
  );
}