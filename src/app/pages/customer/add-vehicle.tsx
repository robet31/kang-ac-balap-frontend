import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Car, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import logoImage from 'figma:asset/02aef87afa090fdbcaef1cdcae0089d551235b8e.png';
import { createClient } from '../../utils/supabase/client';

interface AddVehicleProps {
  onBack: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function AddVehicle({ onBack, onSuccess, userId }: AddVehicleProps) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    color: '',
    engineCapacity: ''
  });

  const [loading, setLoading] = useState(false);

  const brands = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'TVS', 'Vespa', 'Benelli'];
  const colors = ['Hitam', 'Putih', 'Merah', 'Biru', 'Silver', 'Abu-abu', 'Hijau', 'Kuning'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.brand || !formData.model || !formData.plateNumber) {
      toast.error('❌ Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    // Plate number validation (Indonesian format)
    const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/i;
    if (!plateRegex.test(formData.plateNumber)) {
      toast.error('❌ Format nomor plat tidak valid! Contoh: B 1234 XYZ');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert([
          {
            user_id: userId,
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            plate_number: formData.plateNumber.toUpperCase(),
            color: formData.color,
            engine_capacity: formData.engineCapacity
          }
        ]);

      if (error) throw error;

      toast.success('✅ Kendaraan berhasil ditambahkan!');
      onSuccess();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('❌ Gagal menambahkan kendaraan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

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
            <Button 
              variant="outline" 
              onClick={onBack}
              className="border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-2xl mx-auto border-2 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Tambah Kendaraan Baru</CardTitle>
                  <CardDescription className="text-white/90">
                    Lengkapi data kendaraan Anda untuk memudahkan booking service
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-gray-700 font-semibold">
                    Merk Motor <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Pilih merk motor" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-gray-700 font-semibold">
                    Model/Tipe <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="model"
                    placeholder="Contoh: Vario 160, NMAX, Beat Street"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-gray-700 font-semibold">
                      Tahun
                    </Label>
                    <Select 
                      value={formData.year.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-gray-700 font-semibold">
                      Warna
                    </Label>
                    <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Pilih warna" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Plate Number */}
                <div className="space-y-2">
                  <Label htmlFor="plateNumber" className="text-gray-700 font-semibold">
                    Nomor Plat <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="plateNumber"
                    placeholder="Contoh: B 1234 XYZ"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                    className="border-gray-300 uppercase"
                  />
                  <p className="text-xs text-gray-500">Format: B 1234 XYZ</p>
                </div>

                {/* Engine Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="engineCapacity" className="text-gray-700 font-semibold">
                    Kapasitas Mesin (cc)
                  </Label>
                  <Input
                    id="engineCapacity"
                    placeholder="Contoh: 150cc, 125cc"
                    value={formData.engineCapacity}
                    onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                {/* Info Card */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Info:</strong> Data kendaraan akan digunakan untuk riwayat service dan mempermudah proses booking selanjutnya.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 border-gray-300"
                    disabled={loading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#10B981] to-[#059669] hover:opacity-90"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Menyimpan...' : 'Simpan Kendaraan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
