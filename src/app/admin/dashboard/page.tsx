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

const salesData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
];

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
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    };
    fetchStats();
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalSales || 45231.89).toLocaleString()}</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalOrders || 2350}</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalCustomers || 12234}</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +7% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Products</CardTitle>
            <Package className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts || 573}</div>
            <p className="text-xs text-rose-500 flex items-center mt-1">
              <ArrowDownRight className="w-3 h-3 mr-1" /> -2 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} />
                  <Bar dataKey="total" fill="#0f172a" radius={[4, 4, 0, 0]} className="dark:fill-zinc-50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 mt-6">
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={stats.recentOrders as Order[]} searchKey="customer" />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: 'Wireless Headphones', sales: 245, price: '$120' },
                { name: 'Smart Watch Series 7', sales: 190, price: '$299' },
                { name: 'Mechanical Keyboard', sales: 154, price: '$150' },
                { name: 'Gaming Mouse', sales: 121, price: '$80' },
                { name: 'USB-C Hub', sales: 98, price: '$45' },
              ].map((product, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-4">
                    <Package className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="font-medium text-sm">{product.price}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
