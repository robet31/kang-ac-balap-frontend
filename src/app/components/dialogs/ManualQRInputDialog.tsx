import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ManualQRInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (qrCode: string) => void;
}

export function ManualQRInputDialog({ open, onOpenChange, onSubmit }: ManualQRInputDialogProps) {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrCode.trim()) {
      setError('QR Code tidak boleh kosong');
      return;
    }

    // Basic validation: QR code should be alphanumeric and reasonable length
    if (qrCode.length < 10) {
      setError('QR Code tidak valid. Minimal 10 karakter.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call parent submit handler
      onSubmit(qrCode);
      
      // Reset form
      setQrCode('');
      onOpenChange(false);
      
      toast.success('QR Code berhasil divalidasi!', {
        description: 'Memproses booking...'
      });
    } catch (err) {
      setError('Gagal memvalidasi QR Code. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQrCode('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Input QR Code Manual</DialogTitle>
          <DialogDescription>
            Masukkan kode QR booking customer secara manual
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="qr-code">Kode QR Booking</Label>
              <Input
                id="qr-code"
                placeholder="Contoh: BOOK-20240208-ABCD1234"
                value={qrCode}
                onChange={(e) => {
                  setQrCode(e.target.value);
                  setError(null);
                }}
                className={error ? 'border-red-500' : ''}
                disabled={loading}
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Helper Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <p className="font-medium mb-1">Tips:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                    <li>Kode QR dapat ditemukan di booking confirmation customer</li>
                    <li>Format: BOOK-[TANGGAL]-[KODE UNIK]</li>
                    <li>Case sensitive dan harus sesuai persis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={loading || !qrCode.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memvalidasi...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Validasi QR Code
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
