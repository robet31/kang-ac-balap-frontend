import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Wrench,
  ClipboardList, 
  QrCode,
  User,
  Play,
  CheckCircle2,
  Clock,
  Camera,
  Package,
  FileText,
  AlertCircle,
  Plus,
  Search,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

// Mock data
const mockTasks = [
  {
    id: '1',
    jobOrderId: 'JO-2026-001',
    vehicle: { plate: 'B 1234 XYZ', brand: 'Honda', model: 'CB150R' },
    customer: 'Cahya Pradipta',
    service: 'Premium Service',
    status: 'in_progress',
    scheduledTime: '10:00',
    estimatedDuration: 120,
    startedAt: '2026-02-03T10:00:00',
  },
  {
    id: '2',
    jobOrderId: 'JO-2026-002',
    vehicle: { plate: 'B 5678 ABC', brand: 'Yamaha', model: 'NMAX' },
    customer: 'Budi Santoso',
    service: 'Basic Tune-Up',
    status: 'scheduled',
    scheduledTime: '14:00',
    estimatedDuration: 45,
    startedAt: null,
  },
];

const mockParts = [
  { id: '1', sku: 'OIL-001', name: 'Oli Mesin 10W-40', stock: 25, price: 45000 },
  { id: '2', sku: 'FILTER-001', name: 'Filter Oli', stock: 18, price: 25000 },
  { id: '3', sku: 'BRAKE-001', name: 'Kampas Rem Depan', stock: 8, price: 85000 },
];

export function TechnicianApp({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [jobNotes, setJobNotes] = useState('');
  const [usedParts, setUsedParts] = useState<any[]>([]);
  const { signOut } = useAuth();

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      scheduled: { label: 'Dijadwalkan', className: 'bg-blue-500' },
      in_progress: { label: 'Sedang Dikerjakan', className: 'bg-[#F59E0B]' },
      completed: { label: 'Selesai', className: 'bg-[#10B981]' },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    return <Badge className={`${config.className} text-white border-0`}>{config.label}</Badge>;
  };

  const handleStartJob = (task: any) => {
    setSelectedTask({ ...task, status: 'in_progress', startedAt: new Date().toISOString() });
  };

  const handleCompleteJob = () => {
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, status: 'completed' });
      // In real app: send to Supabase
    }
  };

  const addPartToJob = (part: any) => {
    const existingPart = usedParts.find(p => p.id === part.id);
    if (existingPart) {
      setUsedParts(usedParts.map(p => 
        p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setUsedParts([...usedParts, { ...part, quantity: 1 }]);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Berhasil logout!');
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <header className="bg-[#2A5C82] text-white sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">YAMAHA</h1>
              <p className="text-sm text-gray-200">Technician App</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">Ari Wijaya</div>
                <div className="text-xs text-gray-300">Teknisi Senior</div>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#2A5C82]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Mobile Bottom Navigation Style Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-1">
            <TabsList className="w-full grid grid-cols-3 bg-transparent">
              <TabsTrigger 
                value="tasks" 
                className="data-[state=active]:bg-[#2A5C82] data-[state=active]:text-white flex flex-col items-center gap-1 py-3"
              >
                <ClipboardList className="w-5 h-5" />
                <span className="text-xs">Tugas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="scanner" 
                className="data-[state=active]:bg-[#2A5C82] data-[state=active]:text-white flex flex-col items-center gap-1 py-3"
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs">Scanner</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-[#2A5C82] data-[state=active]:text-white flex flex-col items-center gap-1 py-3"
              >
                <User className="w-5 h-5" />
                <span className="text-xs">Profil</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">Tugas Hari Ini</h2>
              <Badge className="bg-[#10B981] text-white border-0">
                {mockTasks.length} Tugas
              </Badge>
            </div>

            {/* Task List */}
            {!selectedTask ? (
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className={`cursor-pointer hover:shadow-lg transition-shadow ${
                      task.status === 'in_progress' ? 'border-2 border-[#F59E0B]' : ''
                    }`}
                    onClick={() => setSelectedTask(task)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">{task.jobOrderId}</div>
                          <CardTitle className="text-lg">
                            {task.vehicle.brand} {task.vehicle.model}
                          </CardTitle>
                          <CardDescription className="font-mono">{task.vehicle.plate}</CardDescription>
                        </div>
                        {getStatusBadge(task.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{task.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Wrench className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{task.service}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{task.scheduledTime}</span>
                          </div>
                          <span className="text-xs text-gray-600">{task.estimatedDuration} menit</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Job Detail View */
              <div className="space-y-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedTask(null)}
                  className="mb-2"
                >
                  ← Kembali ke Daftar
                </Button>

                <Card className="border-2 border-[#2A5C82]">
                  <CardHeader className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-gray-200 mb-1">{selectedTask.jobOrderId}</div>
                        <CardTitle className="text-xl mb-1">
                          {selectedTask.vehicle.brand} {selectedTask.vehicle.model}
                        </CardTitle>
                        <CardDescription className="text-gray-200 font-mono text-lg">
                          {selectedTask.vehicle.plate}
                        </CardDescription>
                      </div>
                      {getStatusBadge(selectedTask.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Informasi Pelanggan</h4>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{selectedTask.customer}</span>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Layanan</h4>
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{selectedTask.service}</span>
                      </div>
                    </div>

                    {/* Parts Used */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm text-gray-600">Part yang Digunakan</h4>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // In real app: open part selector modal
                            if (mockParts.length > 0) {
                              addPartToJob(mockParts[0]);
                            }
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Tambah Part
                        </Button>
                      </div>
                      {usedParts.length > 0 ? (
                        <div className="space-y-2">
                          {usedParts.map((part, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-sm">{part.name}</div>
                                <div className="text-xs text-gray-600">SKU: {part.sku}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-sm">Qty: {part.quantity}</div>
                                <div className="text-xs text-gray-600">Rp {(part.price * part.quantity).toLocaleString('id-ID')}</div>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between font-bold">
                              <span>Total Part:</span>
                              <span className="text-[#2A5C82]">
                                Rp {usedParts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          Belum ada part yang digunakan
                        </div>
                      )}
                    </div>

                    {/* Diagnosis/Notes */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Catatan & Diagnosis</h4>
                      <Textarea
                        placeholder="Tulis catatan pekerjaan, diagnosis, atau rekomendasi..."
                        value={jobNotes}
                        onChange={(e) => setJobNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    {/* Photos */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Foto Pekerjaan</h4>
                      <Button variant="outline" className="w-full">
                        <Camera className="w-4 h-4 mr-2" />
                        Ambil Foto
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      {selectedTask.status === 'scheduled' && (
                        <Button 
                          onClick={() => handleStartJob(selectedTask)}
                          className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
                          size="lg"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Mulai Pekerjaan
                        </Button>
                      )}

                      {selectedTask.status === 'in_progress' && (
                        <>
                          <Button 
                            onClick={handleCompleteJob}
                            className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
                            size="lg"
                          >
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Tandai Selesai
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Update Status
                          </Button>
                        </>
                      )}

                      {selectedTask.status === 'completed' && (
                        <div className="text-center py-4">
                          <CheckCircle2 className="w-16 h-16 text-[#10B981] mx-auto mb-2" />
                          <p className="text-lg font-semibold text-gray-700">Pekerjaan Selesai!</p>
                          <p className="text-sm text-gray-600">Menunggu pembayaran pelanggan</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Scanner Tab */}
          <TabsContent value="scanner" className="space-y-4 mt-4">
            <h2 className="text-xl font-bold text-[#111827]">Scanner Part & Job</h2>

            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="text-center py-12">
                <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Scan QR Code</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Scan barcode part atau QR code job order
                </p>
                <Button className="bg-[#2A5C82] hover:bg-[#1e4460]">
                  <Camera className="w-4 h-4 mr-2" />
                  Buka Kamera
                </Button>
              </CardContent>
            </Card>

            {/* Manual Part Search */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Atau Cari Manual</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input 
                  placeholder="Cari part berdasarkan SKU atau nama..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              {mockParts.slice(0, 3).map((part) => (
                <Card key={part.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#2A5C82] rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{part.name}</div>
                        <div className="text-xs text-gray-600">SKU: {part.sku}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-[#2A5C82]">
                        Rp {part.price.toLocaleString('id-ID')}
                      </div>
                      <div className={`text-xs ${part.stock > 10 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                        Stock: {part.stock}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <h2 className="text-xl font-bold text-[#111827]">Profil & Statistik</h2>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#2A5C82] rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827]">Ari Wijaya</h3>
                  <p className="text-gray-600">Teknisi Senior</p>
                  <Badge className="bg-[#10B981] text-white border-0 mt-2">Aktif</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#2A5C82]">47</div>
                    <div className="text-xs text-gray-600">Job Bulan Ini</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#10B981]">4.9</div>
                    <div className="text-xs text-gray-600">Rating Avg</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#F59E0B]">92%</div>
                    <div className="text-xs text-gray-600">On-Time</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Riwayat Pekerjaan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Laporan Performa
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}