import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Car,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface VehicleRecommendationCardProps {
  recommendation: any;
  onNavigate: (tab: string) => void;
  index: number;
}

export function VehicleRecommendationCard({ 
  recommendation: rec, 
  onNavigate,
  index 
}: VehicleRecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`h-full border-2 ${
        rec.isOverdue 
          ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 shadow-red-200 shadow-lg' 
          : rec.isUpcoming 
          ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-yellow-200 shadow-lg' 
          : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
      }`}>
        <CardContent className="p-5">
          {/* Header with Bell Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                rec.isOverdue 
                  ? 'bg-red-500' 
                  : rec.isUpcoming 
                  ? 'bg-yellow-500' 
                  : 'bg-orange-500'
              }`}>
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Rekomendasi Service</h4>
                <p className="text-xs text-gray-600">Jangan sampai telat!</p>
              </div>
            </div>
            
            {rec.isOverdue && (
              <Badge className="bg-red-500 text-white animate-pulse border-0 text-xs">
                🔴 TELAT
              </Badge>
            )}
            {rec.isUpcoming && (
              <Badge className="bg-yellow-500 text-white animate-pulse border-0 text-xs">
                ⚠️ SEGERA
              </Badge>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              rec.isOverdue 
                ? 'bg-red-500' 
                : rec.isUpcoming 
                ? 'bg-yellow-500' 
                : 'bg-blue-500'
            }`}>
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{rec.vehicleInfo}</h4>
              {rec.plateNumber !== 'default' && (
                <p className="text-sm text-gray-600 font-mono">{rec.plateNumber}</p>
              )}
            </div>
          </div>

          {/* Service Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-600 font-medium">Service Terakhir</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-sm">{rec.lastServiceType}</span>
              </div>
              <p className="text-xs text-gray-600">
                {rec.lastServiceDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-600 font-medium">Service Berikutnya</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-sm">
                  {rec.nextServiceDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
              <p className={`text-xs font-semibold ${
                rec.isOverdue 
                  ? 'text-red-600' 
                  : rec.isUpcoming 
                  ? 'text-yellow-600' 
                  : 'text-gray-600'
              }`}>
                {rec.isOverdue 
                  ? `Telat ${Math.abs(rec.daysUntil)} hari!` 
                  : rec.isUpcoming 
                  ? `${rec.daysUntil} hari lagi!` 
                  : `${rec.daysUntil} hari lagi`
                }
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm mb-1">
                  {rec.recommendedPackage}
                </p>
                <p className="text-xs text-gray-700">{rec.reason}</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Button 
              className={`w-full h-11 text-sm font-semibold ${
                rec.isOverdue || rec.isUpcoming
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
              } text-white`}
              onClick={() => {
                onNavigate('booking');
                toast.success('Silakan pilih paket service yang sesuai!');
              }}
            >
              {rec.isOverdue ? '🚨 Booking Sekarang!' : rec.isUpcoming ? '⚡ Booking Sekarang' : 'Booking Service'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button 
              variant="outline"
              className="w-full h-10 text-sm font-semibold"
              onClick={() => {
                const vehicleCard = document.getElementById(`vehicle-card-${rec.vehicleId}`);
                if (vehicleCard) {
                  vehicleCard.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                  });
                  vehicleCard.classList.add('ring-4', 'ring-blue-500', 'ring-offset-2');
                  setTimeout(() => {
                    vehicleCard.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2');
                  }, 2000);
                  toast.success('Scroll ke detail kendaraan');
                }
              }}
            >
              📍 Lihat Detail Kendaraan
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
