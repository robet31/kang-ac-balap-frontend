import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  CheckCircle2, 
  Calendar, 
  Car,
  Sparkles,
  ArrowRight,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Recommendation {
  vehicleInfo: string;
  plateNumber: string;
  lastServiceType: string;
  lastServiceDate: Date;
  nextServiceDate: Date;
  daysUntil: number;
  isOverdue: boolean;
  isUpcoming: boolean;
  recommendedPackage: string;
  reason: string;
  intervalDescription: string;
}

interface RecommendationCardProps {
  recommendations: Recommendation[];
  onBookingClick?: () => void;
}

export function RecommendationCard({ recommendations, onBookingClick }: RecommendationCardProps) {
  if (recommendations.length === 0) return null;

  const handleBookingClick = () => {
    if (onBookingClick) {
      onBookingClick();
    } else {
      // Default behavior: navigate to booking tab
      const bookingTabButton = document.querySelector('[data-tab="booking"]') as HTMLElement;
      if (bookingTabButton) {
        bookingTabButton.click();
        toast.success('Silakan pilih paket service yang sesuai!');
      }
    }
  };

  return (
    <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Rekomendasi Service Berikutnya</h3>
            <p className="text-orange-100 text-sm">Jangan sampai telat service ya!</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-xl border-2 ${
              rec.isOverdue 
                ? 'bg-red-50 border-red-300' 
                : rec.isUpcoming 
                ? 'bg-yellow-50 border-yellow-300' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  rec.isOverdue 
                    ? 'bg-red-500' 
                    : rec.isUpcoming 
                    ? 'bg-yellow-500' 
                    : 'bg-blue-500'
                }`}>
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{rec.vehicleInfo}</h4>
                  {rec.plateNumber !== 'default' && (
                    <p className="text-sm text-gray-600 font-mono">{rec.plateNumber}</p>
                  )}
                </div>
              </div>
              
              {rec.isOverdue && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  🔴 OVERDUE
                </Badge>
              )}
              {rec.isUpcoming && (
                <Badge className="bg-yellow-500 text-white animate-pulse">
                  ⚠️ SEGERA
                </Badge>
              )}
            </div>

            {/* Service Info Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">Service Terakhir</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-gray-900">{rec.lastServiceType}</span>
                </div>
                <p className="text-xs text-gray-600">
                  {rec.lastServiceDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">Service Berikutnya</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {rec.nextServiceDate.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
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
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">
                    Paket Rekomendasi: {rec.recommendedPackage}
                  </p>
                  <p className="text-sm text-gray-700">{rec.reason}</p>
                  <p className="text-xs text-gray-600 mt-2 italic">{rec.intervalDescription}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className={`w-full h-12 text-base font-semibold ${
                rec.isOverdue || rec.isUpcoming
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
              } text-white`}
              onClick={handleBookingClick}
            >
              {rec.isOverdue ? '🚨 Booking Sekarang!' : rec.isUpcoming ? '⚡ Booking Sekarang' : 'Booking Service'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
