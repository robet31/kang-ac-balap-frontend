import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
  id?: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
}

interface InventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  mode: 'create' | 'edit';
  onSave: (item: InventoryItem) => void;
}

const categories = [
  'Oli & Pelumas',
  'Filter',
  'Rem',
  'Rantai & Gear',
  'Ban',
  'Aki',
  'Lampu',
  'Body Parts',
  'Electrical',
  'Lainnya'
];

export function InventoryDialog({ 
  open, 
  onOpenChange, 
  item, 
  mode,
  onSave 
}: InventoryDialogProps) {
  const [formData, setFormData] = useState<InventoryItem>({
    sku: '',
    name: '',
    category: '',
    stock: 0,
    minStock: 0,
    price: 0,
    supplier: ''
  });

  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        ...item,
        sku: item.sku || '',
        name: item.name || '',
        category: item.category || '',
        stock: item.stock || 0,
        minStock: item.minStock || 0,
        price: item.price || 0,
        supplier: item.supplier || ''
      });
    } else if (mode === 'create') {
      setFormData({
        sku: '',
        name: '',
        category: '',
        stock: 0,
        minStock: 0,
        price: 0,
        supplier: ''
      });
    }
  }, [item, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.sku || !formData.name || !formData.category || !formData.supplier) {
      toast.error('Semua field wajib diisi!');
      return;
    }

    if (formData.stock < 0 || formData.minStock < 0 || formData.price < 0) {
      toast.error('Angka tidak boleh negatif!');
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="w-6 h-6 text-primary" />
            {mode === 'create' ? 'Tambah Item Baru' : 'Edit Item Inventory'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Tambahkan item baru ke inventory' 
              : 'Update informasi item inventory'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SKU & Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-sm font-semibold">
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sku"
                placeholder="e.g., OLI-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Nama Item <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Oli Mesin Synthetic 10W-40"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Supplier */}
          <div className="space-y-2">
            <Label htmlFor="supplier" className="text-sm font-semibold">
              Supplier <span className="text-red-500">*</span>
            </Label>
            <Input
              id="supplier"
              placeholder="e.g., PT Minyak Sejahtera"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>

          {/* Stock Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-semibold">
                Stock Saat Ini <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-gray-500">Jumlah barang tersedia</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock" className="text-sm font-semibold">
                Minimum Stock <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-gray-500">Batas minimum untuk alert</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold">
                Harga (Rp) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-gray-500">Harga satuan</p>
            </div>
          </div>

          {/* Stock Status Info */}
          {formData.stock > 0 && formData.minStock > 0 && (
            <div className={`p-3 rounded-lg border ${
              formData.stock <= formData.minStock 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <p className="text-sm font-medium">
                {formData.stock <= formData.minStock ? (
                  <>⚠️ Stock rendah! {formData.stock} ≤ {formData.minStock} (minimum)</>
                ) : (
                  <>✅ Stock aman: {formData.stock} &gt; {formData.minStock} (minimum)</>
                )}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
              {mode === 'create' ? 'Tambah Item' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}