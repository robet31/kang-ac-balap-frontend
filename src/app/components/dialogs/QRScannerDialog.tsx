import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Camera, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import jsQR from 'jsqr';
import { ManualQRInputDialog } from './ManualQRInputDialog';

interface QRScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess: (qrData: string) => void;
}

export function QRScannerDialog({ open, onOpenChange, onScanSuccess }: QRScannerDialogProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start camera when dialog opens
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    try {
      setError(null);
      setScanning(true);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
        setCameraReady(true);
        
        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          startScanning();
        };
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      
      let errorMessage = 'Tidak dapat mengakses kamera. ';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Izin kamera ditolak. Silakan gunakan Input Manual atau aktifkan izin kamera di pengaturan browser.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'Kamera tidak ditemukan. Silakan gunakan Input Manual.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Kamera sedang digunakan oleh aplikasi lain. Silakan tutup aplikasi lain dan coba lagi.';
      } else if (err.message === 'Camera API not supported in this browser') {
        errorMessage = 'Browser Anda tidak mendukung akses kamera. Silakan gunakan Input Manual.';
      } else {
        errorMessage = 'Terjadi kesalahan saat mengakses kamera. Silakan gunakan Input Manual.';
      }
      
      setError(errorMessage);
      setScanning(false);
      
      // Don't show error toast immediately - user can see the error message
      // and decide whether to retry or use manual input
    }
  };

  const stopCamera = () => {
    // Stop all video tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear scan interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setCameraReady(false);
    setScanning(false);
  };

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Scan for QR code every 500ms
    scanIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          // QR Code detected!
          handleQRDetected(code.data);
        }
      }
    }, 500);
  };

  const handleQRDetected = (qrData: string) => {
    // Stop scanning
    stopCamera();
    
    // Vibrate if supported (mobile)
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }

    // Show success toast
    toast.success('QR Code berhasil dipindai!', {
      description: 'Memproses data booking...'
    });

    // Call success callback
    onScanSuccess(qrData);
    
    // Close dialog
    onOpenChange(false);
  };

  const handleManualInput = () => {
    // Close scanner dialog and open manual input dialog
    setShowManualInput(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-red-600" />
              Scan QR Code Booking
            </DialogTitle>
            <DialogDescription>
              Arahkan kamera ke QR Code yang ditampilkan customer untuk check-in
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Camera Preview */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Hidden canvas for QR processing */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Overlay */}
              {scanning && cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Scanning Frame */}
                  <div className="relative w-64 h-64 border-4 border-red-500 rounded-lg">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                    
                    {/* Scanning Line Animation */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="w-full h-1 bg-red-500 shadow-lg shadow-red-500/50 animate-scan"></div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white text-sm font-medium bg-black/50 backdrop-blur px-4 py-2 rounded-full inline-block">
                      Posisikan QR Code di dalam bingkai
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {scanning && !cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-3" />
                    <p className="text-white text-sm">Mengaktifkan kamera...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
                  <div className="text-center p-6">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-white text-sm mb-4">{error}</p>
                    <Button 
                      onClick={startCamera}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Coba Lagi
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleManualInput}
              >
                Input Manual
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Tips untuk scan yang sukses:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Pastikan pencahayaan cukup terang</li>
                    <li>Jaga jarak 20-30cm dari kamera</li>
                    <li>QR Code harus terlihat jelas dan tidak buram</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual QR Input Dialog */}
      <ManualQRInputDialog 
        open={showManualInput}
        onOpenChange={setShowManualInput}
        onSubmit={onScanSuccess}
      />
    </>
  );
}