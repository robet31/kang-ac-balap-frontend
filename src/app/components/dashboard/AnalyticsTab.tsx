import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Wrench, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts@2.15.2';

const monthlyData = [
  { month: 'Agu', amount: 150000, services: 2 },
  { month: 'Sep', amount: 300000, services: 3 },
  { month: 'Okt', amount: 450000, services: 5 },
  { month: 'Nov', amount: 250000, services: 3 },
  { month: 'Des', amount: 400000, services: 4 },
  { month: 'Jan', amount: 350000, services: 3 }
];

const vehicleData = [
  { vehicle: 'B 1234 XYZ', total: 850000, count: 7 },
  { vehicle: 'B 5678 ABC', total: 750000, count: 6 }
];

const totalSpent = monthlyData.reduce((acc, curr) => acc + curr.amount, 0);
const avgMonthly = totalSpent / monthlyData.length;
const totalServices = monthlyData.reduce((acc, curr) => acc + curr.services, 0);
const trend = ((monthlyData[monthlyData.length - 1].amount - monthlyData[monthlyData.length - 2].amount) / monthlyData[monthlyData.length - 2].amount) * 100;

export function AnalyticsTab() {
  const handleExportPDF = () => {
    // Implementasi export PDF (bisa integrate dengan jsPDF atau library lain)
    alert('Fitur export PDF akan segera tersedia!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Service Analytics</h2>
          <p className="text-gray-600">Analisis pengeluaran dan riwayat service Anda</p>
        </div>
        <Button onClick={handleExportPDF} className="bg-[#2A5C82] hover:bg-[#1e4460]">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Pengeluaran</CardDescription>
            <CardTitle className="text-2xl text-[#2A5C82]">
              Rp {totalSpent.toLocaleString('id-ID')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">6 bulan terakhir</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rata-rata / Bulan</CardDescription>
            <CardTitle className="text-2xl text-[#2A5C82]">
              Rp {Math.round(avgMonthly).toLocaleString('id-ID')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Per bulan</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Service</CardDescription>
            <CardTitle className="text-2xl text-[#2A5C82]">
              {totalServices}x
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">6 bulan terakhir</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Trend Bulan Ini</CardDescription>
            <CardTitle className={`text-2xl flex items-center gap-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {Math.abs(trend).toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={trend >= 0 ? 'bg-green-500' : 'bg-red-500'}>
              {trend >= 0 ? 'Naik' : 'Turun'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pengeluaran Service Bulanan</CardTitle>
          <CardDescription>Grafik pengeluaran 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                labelFormatter={(label) => `Bulan: ${label}`}
              />
              <Bar dataKey="amount" fill="#2A5C82" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Service Frequency Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Frekuensi Service</CardTitle>
          <CardDescription>Jumlah service per bulan</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip labelFormatter={(label) => `Bulan: ${label}`} />
              <Line 
                type="monotone" 
                dataKey="services" 
                stroke="#ff7e5f" 
                strokeWidth={3}
                dot={{ fill: '#ff7e5f', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Per Vehicle Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analisis Per Kendaraan</CardTitle>
          <CardDescription>Total pengeluaran untuk setiap kendaraan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicleData.map((vehicle, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-[#111827]">{vehicle.vehicle}</h4>
                    <p className="text-sm text-gray-600">{vehicle.count} kali service</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#2A5C82]">
                      Rp {vehicle.total.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-gray-600">
                      Avg: Rp {Math.round(vehicle.total / vehicle.count).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2A5C82] rounded-full"
                    style={{ width: `${(vehicle.total / totalSpent) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Recommendations */}
      <Card className="border-2 border-[#2A5C82]">
        <CardHeader className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] text-white rounded-t-lg">
          <CardTitle>Rekomendasi Service Berikutnya</CardTitle>
          <CardDescription className="text-gray-200">
            Berdasarkan riwayat service Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <Wrench className="w-6 h-6 text-orange-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-[#111827] mb-1">Honda CB150R (B 1234 XYZ)</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Sudah 2 bulan sejak service terakhir. Disarankan untuk melakukan Basic Tune-Up.
                </p>
                <Badge className="bg-orange-500">Segera</Badge>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-[#111827] mb-1">Yamaha NMAX (B 5678 ABC)</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Service berikutnya direkomendasikan dalam 1 bulan (Standard Service).
                </p>
                <Badge className="bg-blue-500">Jadwalkan</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
