import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft,
  Package,
  Info,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

interface InventoryFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
  item?: any;
  mode?: 'create' | 'edit';
}

const CATEGORIES = [
  'Oli & Pelumas',
  'Filter',
  'Rem',
  'Ban',
  'Aki',
  'Busi',
  'Rantai & Gir',
  'Lampu',
  'Body Parts',
  'Lainnya'
];

const UNITS = ['pcs', 'liter', 'set', 'pack', 'botol', 'dus'];

export default function InventoryForm({ onBack, onSuccess, item, mode = 'create' }: InventoryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [sku, setSku] = useState(item?.sku || '');
  const [name, setName] = useState(item?.name || '');
  const [category, setCategory] = useState(item?.category || '');
  const [stock, setStock] = useState(item?.stock?.toString() || '');
  const [minStock, setMinStock] = useState(item?.minStock?.toString() || '');
  const [price, setPrice] = useState(item?.price?.toString() || '');
  const [unit, setUnit] = useState(item?.unit || 'pcs');
  const [supplier, setSupplier] = useState(item?.supplier || '');
  const [description, setDescription] = useState(item?.description || '');

  const handleSubmit = async () => {
    // Validation
    if (!sku.trim()) {
      toast.error('❌ SKU harus diisi');
      return;
    }

    if (!name.trim()) {
      toast.error('❌ Nama item harus diisi');
      return;
    }

    if (!category) {
      toast.error('❌ Pilih kategori');
      return;
    }

    if (!stock || parseInt(stock) < 0) {
      toast.error('❌ Stock harus diisi dengan angka valid');
      return;
    }

    if (!minStock || parseInt(minStock) < 0) {
      toast.error('❌ Minimum stock harus diisi');
      return;
    }

    if (!price || parseFloat(price) < 0) {
      toast.error('❌ Harga harus diisi');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        sku: sku.trim(),
        name: name.trim(),
        category,
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        price: parseFloat(price),
        unit,
        supplier: supplier.trim() || '-',
        description: description.trim() || '',
        updatedAt: new Date().toISOString()
      };

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/set/inventory_${sku.trim()}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan item');
      }

      toast.success(`✅ Item ${mode === 'create' ? 'berhasil ditambahkan' : 'berhasil diupdate'}!`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving inventory:', error);
      toast.error(`❌ ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {mode === 'create' ? 'Tambah Item Inventory' : 'Edit Item Inventory'}
                </h1>
                <p className="text-xs text-gray-500">
                  {mode === 'create' ? 'Tambahkan item baru ke inventory' : `Edit: ${item?.name}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="bg-blue-500 rounded-xl p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-1">Kelola Inventory</h4>
                <p className="text-sm text-blue-50 leading-relaxed">
                  Pastikan data yang dimasukkan akurat. SKU harus unik untuk setiap item.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* SKU */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">SKU / Kode Item *</Label>
                <Input
                  placeholder="Contoh: OLI-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  disabled={mode === 'edit'}
                  className="h-10"
                />
                {mode === 'edit' && (
                  <p className="text-xs text-gray-400 mt-1">SKU tidak bisa diubah</p>
                )}
              </div>

              {/* Name */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Nama Item *</Label>
                <Input
                  placeholder="Contoh: Oli Mesin Synthetic 10W-40"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Kategori *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Pilih kategori..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Unit */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Satuan *</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Pilih satuan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stock */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Stock *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  className="h-10"
                />
              </div>

              {/* Min Stock */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Minimum Stock *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  min="0"
                  className="h-10"
                />
                <p className="text-xs text-gray-400 mt-1">Alert jika stock kurang dari ini</p>
              </div>

              {/* Price */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Harga (Rp) *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  className="h-10"
                />
              </div>

              {/* Supplier */}
              <div>
                <Label className="text-sm text-gray-700 mb-1.5 block">Supplier</Label>
                <Input
                  placeholder="Nama supplier..."
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Label className="text-sm text-gray-700 mb-1.5 block">Deskripsi / Catatan</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Catatan tambahan untuk item ini..."
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base font-semibold shadow-lg"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {mode === 'create' ? 'Tambah Item' : 'Simpan Perubahan'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}