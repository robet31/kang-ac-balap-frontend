import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Percent,
  ArrowUp,
  ArrowDown,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats'; // ✅ Import hook

// Mock data untuk analytics yang lebih comprehensive
const revenueForecastData = [
  { month: 'Jan', actual: 12500000, forecast: null },
  { month: 'Feb', actual: 15200000, forecast: null },
  { month: 'Mar', actual: 13800000, forecast: null },
  { month: 'Apr', actual: 16900000, forecast: null },
  { month: 'Mei', actual: 18500000, forecast: null },
  { month: 'Jun', actual: 21000000, forecast: null },
  { month: 'Jul', actual: null, forecast: 23500000 }, // Predicted
];

const revenueByServiceType = [
  { name: 'Premium Service', revenue: 8500000, percentage: 35, color: '#DC2626' },
  { name: 'Standard Service', revenue: 6200000, percentage: 26, color: '#F59E0B' },
  { name: 'Basic Tune-Up', revenue: 5400000, percentage: 22, color: '#10B981' },
  { name: 'Oil Change', revenue: 4100000, percentage: 17, color: '#3B82F6' },
];

const monthlyComparison = [
  { month: 'Jan', thisYear: 12500000, lastYear: 10200000 },
  { month: 'Feb', thisYear: 15200000, lastYear: 11800000 },
  { month: 'Mar', thisYear: 13800000, lastYear: 12100000 },
  { month: 'Apr', thisYear: 16900000, lastYear: 13500000 },
  { month: 'Mei', thisYear: 18500000, lastYear: 14200000 },
  { month: 'Jun', thisYear: 21000000, lastYear: 15800000 },
];

const mostUsedItems = [
  { name: 'Oli Mesin Castrol', quantity: 145, revenue: 7250000, category: 'Oil & Lubricants', usage: 145, cost: 50000, totalCost: 7250000, trend: 'up' },
  { name: 'Brake Pad Brembo', quantity: 98, revenue: 9800000, category: 'Brake System', usage: 98, cost: 100000, totalCost: 9800000, trend: 'up' },
  { name: 'Air Filter K&N', quantity: 87, revenue: 4350000, category: 'Air System', usage: 87, cost: 50000, totalCost: 4350000, trend: 'stable' },
  { name: 'Spark Plug NGK', quantity: 156, revenue: 3120000, category: 'Ignition', usage: 156, cost: 20000, totalCost: 3120000, trend: 'down' },
  { name: 'Chain Set RK', quantity: 45, revenue: 6750000, category: 'Drive Train', usage: 45, cost: 150000, totalCost: 6750000, trend: 'up' },
];

const inventoryCostAnalysis = [
  { month: 'Jan', spareParts: 12000000, labor: 6000000 },
  { month: 'Feb', spareParts: 13000000, labor: 6500000 },
  { month: 'Mar', spareParts: 11500000, labor: 6200000 },
  { month: 'Apr', spareParts: 14000000, labor: 7000000 },
  { month: 'Mei', spareParts: 14500000, labor: 7200000 },
  { month: 'Jun', spareParts: 13500000, labor: 7500000 },
];

const stockMovementTrends = [
  { week: 'Week 1', incoming: 150, outgoing: 120, net: 30 },
  { week: 'Week 2', incoming: 180, outgoing: 165, net: 15 },
  { week: 'Week 3', incoming: 140, outgoing: 155, net: -15 },
  { week: 'Week 4', incoming: 200, outgoing: 145, net: 55 },
];

const profitMarginPerService = [
  { service: 'Premium Service', cost: 350000, price: 500000, margin: 30, orders: 45 },
  { service: 'Standard Service', cost: 180000, price: 250000, margin: 28, orders: 78 },
  { service: 'Basic Tune-Up', cost: 80000, price: 120000, margin: 33, orders: 120 },
  { service: 'Oil Change', cost: 45000, price: 75000, margin: 40, orders: 95 },
];

const costBreakdown = [
  { name: 'Labor', value: 12250000, amount: 12250000, color: '#DC2626', percentage: 35 },
  { name: 'Parts', value: 15750000, amount: 15750000, color: '#F59E0B', percentage: 45 },
  { name: 'Overhead', value: 5250000, amount: 5250000, color: '#10B981', percentage: 15 },
  { name: 'Other', value: 1750000, amount: 1750000, color: '#3B82F6', percentage: 5 },
];

export function AdvancedAnalytics() {
  // TODO: Use hook for real-time stats (keeping mock data for now)
  // const { stats } = useDashboardStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive business insights and forecasting</p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-4 py-2">
          <Activity className="w-4 h-4 mr-2" />
          Real-time Data
        </Badge>
      </motion.div>

      {/* Revenue Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-primary pl-4">
          <DollarSign className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 1. Revenue Forecasting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Revenue Forecasting
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    +12% Growth
                  </Badge>
                </div>
                <CardDescription>Prediksi pendapatan bulan Juli based on trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueForecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `${value / 1000000}jt`} />
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB' }}
                    />
                    <Legend />
                    <Bar dataKey="actual" fill="#DC2626" name="Actual Revenue" radius={[8, 8, 0, 0]} />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Forecast"
                      dot={{ fill: '#F59E0B', r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Predicted July Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(23500000)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="w-5 h-5" />
                      <span className="font-semibold">+12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. Revenue by Service Type */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-primary" />
                  Revenue by Service Type
                </CardTitle>
                <CardDescription>Service mana yang paling menguntungkan</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={revenueByServiceType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {revenueByServiceType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {revenueByServiceType.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: service.color }} />
                        <span className="text-sm font-medium text-gray-700">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(service.revenue)}</p>
                        <p className="text-xs text-gray-500">{service.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3. Monthly Revenue Comparison */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Monthly Revenue Comparison
                </CardTitle>
                <CardDescription>Perbandingan performa bulan ini vs bulan lalu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Current Month */}
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-primary/20">
                    <p className="text-sm font-medium text-gray-600 mb-2">{monthlyComparison[5].month}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-4">{formatCurrency(monthlyComparison[5].thisYear)}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Orders</span>
                        <span className="font-semibold text-gray-900">120</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Order Value</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(monthlyComparison[5].thisYear / 120)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Previous Month */}
                  <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">{monthlyComparison[4].month}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-4">{formatCurrency(monthlyComparison[4].thisYear)}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Orders</span>
                        <span className="font-semibold text-gray-900">115</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Order Value</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(monthlyComparison[4].thisYear / 115)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Growth Indicators */}
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">Growth Rate</p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600">Revenue</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">+{((monthlyComparison[5].thisYear - monthlyComparison[4].thisYear) / monthlyComparison[4].thisYear * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600">Orders</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">+{((120 - 115) / 115 * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600">Avg Order</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">+{(((monthlyComparison[5].thisYear / 120) - (monthlyComparison[4].thisYear / 115)) / (monthlyComparison[4].thisYear / 115) * 100).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Inventory Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-accent pl-4">
          <Package className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold text-gray-900">Inventory Analytics</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 4. Most Used Items */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Most Used Items
                </CardTitle>
                <CardDescription>Top 10 items yang paling sering dipakai</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Item Name</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Usage</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Unit Cost</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Cost</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mostUsedItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <Badge className={`${index < 3 ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-gray-200 text-gray-700'} border-0`}>
                              #{index + 1}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">{item.name}</p>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-bold text-gray-900">{item.usage}</span>
                            <span className="text-xs text-gray-500 ml-1">units</span>
                          </td>
                          <td className="py-4 px-4 text-right text-gray-700">{formatCurrency(item.cost)}</td>
                          <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatCurrency(item.totalCost)}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center">
                              {item.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                              {item.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                              {item.trend === 'stable' && <Activity className="w-5 h-5 text-gray-400" />}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 5. Inventory Cost Analysis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Inventory Cost Analysis
                </CardTitle>
                <CardDescription>Breakdown biaya inventory per bulan</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={inventoryCostAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `${value / 1000000}jt`} />
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB' }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="spareParts" 
                      stackId="1"
                      stroke="#DC2626" 
                      fill="#DC2626" 
                      fillOpacity={0.6}
                      name="Spare Parts"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="labor" 
                      stackId="1"
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      name="Labor"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs text-gray-600 mb-1">Spare Parts (Juni)</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(13500000)}</p>
                    <p className="text-xs text-red-600 mt-1">64.3% of total</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Labor (Juni)</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(7500000)}</p>
                    <p className="text-xs text-green-600 mt-1">35.7% of total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 6. Stock Movement Trends */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Stock Movement Trends
                </CardTitle>
                <CardDescription>Grafik pergerakan stock masuk dan keluar</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={stockMovementTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="week" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB' }} />
                    <Legend />
                    <Bar dataKey="incoming" fill="#10B981" name="Stock Masuk" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="outgoing" fill="#DC2626" name="Stock Keluar" radius={[8, 8, 0, 0]} />
                    <Line 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Net Movement"
                      dot={{ fill: '#F59E0B', r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Net Stock Movement (This Month)</p>
                      <p className="text-2xl font-bold text-gray-900">+49 units</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 7. Profit Margin per Service */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-primary" />
                  Profit Margin per Service
                </CardTitle>
                <CardDescription>Service mana yang paling menguntungkan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profitMarginPerService.map((service, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900">{service.service}</span>
                        <Badge className={`${service.margin >= 30 ? 'bg-green-500' : service.margin >= 25 ? 'bg-yellow-500' : 'bg-orange-500'} text-white border-0`}>
                          {service.margin}% Margin
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Cost</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(service.cost)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(service.price)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Orders</p>
                          <p className="font-semibold text-gray-900">{service.orders}</p>
                        </div>
                      </div>
                      {/* Progress bar for margin */}
                      <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${service.margin * 3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Average Profit Margin</p>
                  <p className="text-3xl font-bold text-gray-900">29.2%</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 8. Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-primary" />
                  Cost Breakdown
                </CardTitle>
                <CardDescription>Biaya spare parts vs labor</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-3">
                  {costBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(item.value)}</p>
                        <p className="text-sm text-gray-500">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Operating Cost</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(21000000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}