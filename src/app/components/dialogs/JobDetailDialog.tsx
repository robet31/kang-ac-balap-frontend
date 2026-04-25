import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { 
  Wrench, 
  User, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  Car,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface Job {
  id: string;
  jobNumber: string;
  customer: string;
  vehicle: string;
  service: string;
  status: string;
  technician: string | null;
  scheduledDate: string;
  amount: number;
  notes?: string;
}

interface JobDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

export function JobDetailDialog({ open, onOpenChange, job }: JobDetailDialogProps) {
  if (!job) return null;

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: any }> = {
      pending: { label: 'Menunggu', className: 'bg-gray-500', icon: Clock },
      scheduled: { label: 'Dijadwalkan', className: 'bg-blue-500', icon: Calendar },
      in_progress: { label: 'Sedang Dikerjakan', className: 'bg-orange-500', icon: Wrench },
      awaiting_payment: { label: 'Menunggu Pembayaran', className: 'bg-yellow-500', icon: DollarSign },
      completed: { label: 'Selesai', className: 'bg-green-500', icon: CheckCircle2 }
    };
    return config[status] || config.pending;
  };

  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wrench className="w-6 h-6 text-primary" />
            Job Details
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap job order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{job.jobNumber}</h3>
                  <p className="text-sm text-gray-600">Job Order Number</p>
                </div>
                <Badge className={`${statusConfig.className} text-white text-sm px-4 py-2`}>
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                <DollarSign className="w-6 h-6" />
                Rp {job.amount.toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>

          {/* Customer & Vehicle Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                  <User className="w-5 h-5" />
                  Customer Information
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama Customer</p>
                  <p className="font-semibold text-gray-900">{job.customer}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                  <Car className="w-5 h-5" />
                  Vehicle Information
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kendaraan</p>
                  <p className="font-semibold text-gray-900">{job.vehicle}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service & Schedule */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Paket Service</p>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-gray-900">{job.service}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Jadwal Service</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-gray-900">
                      {new Date(job.scheduledDate).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600 mb-1">Teknisi Assigned</p>
                <div className="flex items-center gap-2">
                  {job.technician ? (
                    <>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {job.technician.charAt(0)}
                      </div>
                      <p className="font-semibold text-gray-900">{job.technician}</p>
                    </>
                  ) : (
                    <Badge className="bg-orange-500 text-white">Belum di-assign</Badge>
                  )}
                </div>
              </div>

              {job.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <p className="text-sm font-semibold">Catatan Customer</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-700">{job.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timeline (Future Enhancement) */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-blue-900 mb-3">📋 Job Timeline</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Booking created - {new Date(job.scheduledDate).toLocaleDateString('id-ID')}</span>
                </div>
                {job.status !== 'pending' && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Teknisi assigned - {job.technician}</span>
                  </div>
                )}
                {job.status === 'completed' && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Service completed</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Print Detail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
