import { toast } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Settings, User, Users, Shield, Trash2, Edit, Plus, Mail, Phone, Calendar, Bell, ToggleLeft, ToggleRight } from 'lucide-react';
import { Switch } from '../ui/switch';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: any;
  accountForm: any;
  setAccountForm: (form: any) => void;
  passwordForm: any;
  setPasswordForm: (form: any) => void;
  users: any[];
  setUsers: (users: any[]) => void;
}

export function SettingsDialog({ 
  open, 
  onOpenChange, 
  currentUser,
  accountForm,
  setAccountForm,
  passwordForm,
  setPasswordForm,
  users,
  setUsers
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState('account');
  const [autoRecommendation, setAutoRecommendation] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Fetch auto recommendation setting
  useEffect(() => {
    if (open) {
      fetchAutoRecommendationSetting();
    }
  }, [open]);

  const fetchAutoRecommendationSetting = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/get/settings_auto_recommendation`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAutoRecommendation(data.data?.enabled || false);
      }
    } catch (error) {
      console.error('Error fetching auto recommendation setting:', error);
    }
  };

  const toggleAutoRecommendation = async (enabled: boolean) => {
    setLoadingSettings(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/set/settings_auto_recommendation`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ enabled })
        }
      );

      if (response.ok) {
        setAutoRecommendation(enabled);
        toast.success(enabled ? '✅ Rekomendasi Otomatis AKTIF' : '🔴 Rekomendasi Otomatis NONAKTIF');
      } else {
        throw new Error('Failed to update setting');
      }
    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast.error('Gagal mengupdate pengaturan');
    } finally {
      setLoadingSettings(false);
    }
  };
  
  const handleSaveAccount = () => {
    if (!accountForm.name || !accountForm.email) {
      toast.error('Nama dan email wajib diisi!');
      return;
    }
    toast.success('✅ Profil berhasil diupdate!');
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Semua field password wajib diisi!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password minimal 8 karakter!');
      return;
    }
    toast.success('✅ Password berhasil diubah!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; className: string }> = {
      super_admin: { label: 'Super Admin', className: 'bg-red-500 text-white' },
      admin: { label: 'Admin', className: 'bg-blue-500 text-white' },
      viewer: { label: 'Viewer', className: 'bg-gray-500 text-white' }
    };
    const config = roleConfig[role] || roleConfig.viewer;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500 text-white">Active</Badge>
    ) : (
      <Badge className="bg-gray-500 text-white">Inactive</Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="w-6 h-6 text-primary" />
            Pengaturan
          </DialogTitle>
          <DialogDescription>
            Kelola akun dan user management
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" />
              Akun Saya
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="system">
              <Bell className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-4 mt-4">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Informasi Profil
                </CardTitle>
                <CardDescription>Update informasi akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={accountForm.phone}
                    onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                  />
                </div>
                <Button onClick={handleSaveAccount} className="w-full">
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Ubah Password
                </CardTitle>
                <CardDescription>Pastikan password Anda kuat dan aman</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Minimal 8 karakter</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>
                <Button onClick={handleChangePassword} className="w-full">
                  Ubah Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Kelola User & Admin</h3>
                <p className="text-sm text-gray-600">Tambah, edit, atau hapus user</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Tambah User
              </Button>
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {users.map((user) => (
                <Card key={user.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{user.name}</h4>
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.status)}
                          </div>
                          
                          <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Joined: {new Date(user.createdAt).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.info(`Edit user: ${user.name}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => toast.error(`Delete user: ${user.name}`)}
                          disabled={user.role === 'super_admin'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Role Permissions Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">ℹ️ Role Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Badge className="bg-red-500 text-white">Super Admin</Badge>
                  <span className="text-gray-700">Full access - Kelola semua fitur termasuk user management</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-500 text-white">Admin</Badge>
                  <span className="text-gray-700">Kelola jobs, inventory, technicians - tidak bisa manage users</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-gray-500 text-white">Viewer</Badge>
                  <span className="text-gray-700">Read-only access - hanya bisa lihat data</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-4 mt-4">
            {/* Auto Recommendation Setting */}
            <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  Rekomendasi Service Otomatis
                </CardTitle>
                <CardDescription>Aktifkan fitur rekomendasi service berikutnya untuk customer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor="autoRecommendation" className="text-base font-semibold text-gray-900 cursor-pointer">
                        Status Rekomendasi Otomatis
                      </Label>
                      <Badge className={autoRecommendation ? 'bg-green-500' : 'bg-gray-500'}>
                        {autoRecommendation ? '🟢 AKTIF' : '🔴 NONAKTIF'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {autoRecommendation 
                        ? 'Customer akan melihat rekomendasi service berikutnya berdasarkan riwayat service' 
                        : 'Rekomendasi otomatis dinonaktifkan. Customer hanya melihat riwayat service'}
                    </p>
                  </div>
                  <Switch
                    id="autoRecommendation"
                    checked={autoRecommendation}
                    onCheckedChange={toggleAutoRecommendation}
                    disabled={loadingSettings}
                    className="ml-4"
                  />
                </div>
                
                {/* Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">ℹ️</div>
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Cara Kerja:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>Hemat Service: Rekomendasi setiap 30 hari</li>
                        <li>Basic Tune-Up: Rekomendasi setiap 60 hari</li>
                        <li>Standard Service: Rekomendasi setiap 90 hari</li>
                        <li>Premium Service: Rekomendasi setiap 180 hari</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}