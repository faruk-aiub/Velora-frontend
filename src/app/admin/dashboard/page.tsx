'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  CreditCard, 
  Activity,
  Package
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { DataTable } from '@/components/ui/data-table';
import { columns, Order } from './columns';

// removed static salesData

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];


export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: []
  });
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        const res = await fetch('http://localhost:3000/api/v1/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStats(data.data);
          }
        }
        
        const salesRes = await fetch('http://localhost:3000/api/v1/admin/sales-report', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (salesRes.ok) {
          const salesDataRaw = await salesRes.json();
          if (salesDataRaw.data?.monthly) {
            setSalesData(salesDataRaw.data.monthly);
          }
        }
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    };
    fetchStats();
    
    // Poll for real-time order updates
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-[#BC8477]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">${(stats.totalSales || 45231.89).toLocaleString()}</div>
            <p className="text-sm font-bold text-green-500 flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +20.1% <span className="text-gray-400 font-medium ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Total Orders</CardTitle>
            <CreditCard className="h-5 w-5 text-[#BC8477]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">+{stats.totalOrders || 2350}</div>
            <p className="text-sm font-bold text-green-500 flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +15% <span className="text-gray-400 font-medium ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Active Customers</CardTitle>
            <Users className="h-5 w-5 text-[#BC8477]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">+{stats.totalCustomers || 12234}</div>
            <p className="text-sm font-bold text-green-500 flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +7% <span className="text-gray-400 font-medium ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Total Products</CardTitle>
            <Package className="h-5 w-5 text-[#BC8477]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{stats.totalProducts || 573}</div>
            <p className="text-sm font-bold text-red-500 flex items-center mt-2">
              <ArrowDownRight className="w-4 h-4 mr-1" /> -2 <span className="text-gray-400 font-medium ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '16px', color: '#111827', fontWeight: 'bold' }} />
                  <Bar dataKey="total" fill="#BC8477" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '16px', color: '#111827', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#BC8477" strokeWidth={4} dot={{ r: 5, fill: '#BC8477' }} activeDot={{ r: 7, fill: '#BC8477', stroke: '#fff', strokeWidth: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 mt-6">
        <Card className="col-span-5 rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={stats.recentOrders as Order[]} searchKey="customer" />
          </CardContent>
        </Card>
        <Card className="col-span-2 rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Wireless Headphones', sales: 245, price: '$120' },
                { name: 'Smart Watch Series 7', sales: 190, price: '$299' },
                { name: 'Mechanical Keyboard', sales: 154, price: '$150' },
                { name: 'Gaming Mouse', sales: 121, price: '$80' },
                { name: 'USB-C Hub', sales: 98, price: '$45' },
              ].map((product, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-12 h-12 rounded-[20px] bg-gray-50 flex items-center justify-center mr-4">
                    <Package className="w-5 h-5 text-[#BC8477]" />
                  </div>
                  <div className="ml-2 space-y-1 flex-1">
                    <p className="text-sm font-bold leading-none text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="font-bold text-sm text-gray-900">{product.price}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
