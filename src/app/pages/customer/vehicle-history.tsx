import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ArrowLeft, Car, Wrench, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import logoImage from 'figma:asset/02aef87afa090fdbcaef1cdcae0089d551235b8e.png';

interface VehicleHistoryProps {
  onBack: () => void;
  vehicle: any;
  history: any[];
}

export default function VehicleHistory({ onBack, vehicle, history }: VehicleHistoryProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'Menunggu', className: 'bg-gray-500' },
      scheduled: { label: 'Dijadwalkan', className: 'bg-blue-500' },
      in_progress: { label: 'Sedang Dikerjakan', className: 'bg-[#F59E0B]' },
      awaiting_payment: { label: 'Menunggu Pembayaran', className: 'bg-orange-500' },
      completed: { label: 'Selesai', className: 'bg-[#10B981]' },
      cancelled: { label: 'Dibatalkan', className: 'bg-red-500' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.className} text-white border-0`}>{config.label}</Badge>;
  };

  const totalSpent = history.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const totalServices = history.length;

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
          className="max-w-5xl mx-auto space-y-6"
        >
          {/* Vehicle Info Card */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {vehicle.brand} {vehicle.model}
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    {vehicle.plate_number} • {vehicle.year}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-900">{totalServices}</div>
                  <div className="text-sm text-blue-700 mt-1">Total Service</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-900">
                    Rp {(totalSpent / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm text-green-700 mt-1">Total Biaya</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-900">
                    {vehicle.color || 'N/A'}
                  </div>
                  <div className="text-sm text-purple-700 mt-1">Warna</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Riwayat Service
              </CardTitle>
              <CardDescription>
                Berikut adalah riwayat lengkap service untuk kendaraan ini
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {history.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900">
                                  {item.service_package || 'Service'}
                                </h4>
                                {getStatusBadge(item.status)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              {item.notes && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <p className="text-sm text-gray-700">{item.notes}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <div className="flex items-center justify-between md:justify-end gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-xl font-bold text-green-600">
                              Rp {item.total_price?.toLocaleString('id-ID') || '0'}
                            </span>
                          </div>
                          {item.spareparts && item.spareparts.length > 0 && (
                            <p className="text-xs text-gray-500">
                              + {item.spareparts.length} sparepart
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Spareparts Detail */}
                      {item.spareparts && item.spareparts.length > 0 && (
                        <div className="mt-4 pl-[52px]">
                          <Separator className="mb-3" />
                          <p className="text-xs font-semibold text-gray-700 mb-2">Sparepart yang digunakan:</p>
                          <div className="grid md:grid-cols-2 gap-2">
                            {item.spareparts.map((spare: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                                <span className="text-gray-700">{spare.name}</span>
                                <span className="font-semibold text-gray-900">
                                  Rp {spare.price?.toLocaleString('id-ID')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Belum Ada Riwayat Service
                  </h3>
                  <p className="text-gray-600">
                    Kendaraan ini belum pernah melakukan service di Sunest Auto
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
