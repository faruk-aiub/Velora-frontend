'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Banknote, 
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

import apiClient from '@/lib/axios';

// Static mock data removed
export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: []
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/dashboard');
        if (res.data?.success) {
          setStats(res.data.data);
        }
        
        const salesRes = await apiClient.get('/admin/sales-report');
        if (salesRes.data?.data) {
          const salesDataRaw = salesRes.data;
          if (salesDataRaw.data?.monthly) {
            setSalesData(salesDataRaw.data.monthly);
          }
          if (salesDataRaw.data?.weekly) {
            setWeeklyData(salesDataRaw.data.weekly);
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
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <Card className="rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500">Total Revenue</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#BC8477]/10 flex items-center justify-center shrink-0">
              <Banknote className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#BC8477]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">৳{(stats.totalSales || 0).toLocaleString()}</div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 flex items-center mt-1 truncate">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> +20.1% <span className="text-stone-400 font-normal ml-1 hidden xs:inline">vs last month</span>
            </p>
          </div>
        </Card>

        <Card className="rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500">Total Orders</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#BC8477]/10 flex items-center justify-center shrink-0">
              <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#BC8477]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">+{stats.totalOrders || 0}</div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 flex items-center mt-1 truncate">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> +15% <span className="text-stone-400 font-normal ml-1 hidden xs:inline">vs last month</span>
            </p>
          </div>
        </Card>

        <Card className="rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500">Customers</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#BC8477]/10 flex items-center justify-center shrink-0">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#BC8477]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">+{stats.totalCustomers || 0}</div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 flex items-center mt-1 truncate">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> +7% <span className="text-stone-400 font-normal ml-1 hidden xs:inline">vs last month</span>
            </p>
          </div>
        </Card>

        <Card className="rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500">Products</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#BC8477]/10 flex items-center justify-center shrink-0">
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#BC8477]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">{stats.totalProducts || 0}</div>
            <p className="text-[11px] sm:text-xs font-semibold text-rose-500 flex items-center mt-1 truncate">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> -2 <span className="text-stone-400 font-normal ml-1 hidden xs:inline">vs last month</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5 min-w-0">
          <div className="mb-3">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">Sales Overview</h3>
            <p className="text-xs text-stone-400">Monthly revenue distribution</p>
          </div>
          <div className="h-[210px] sm:h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '12px', color: '#111827', fontWeight: 'bold' }} />
                <Bar dataKey="total" fill="#BC8477" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-3 rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5 min-w-0">
          <div className="mb-3">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">Weekly Revenue</h3>
            <p className="text-xs text-stone-400">Past 7 days performance</p>
          </div>
          <div className="h-[210px] sm:h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '12px', color: '#111827', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="revenue" stroke="#BC8477" strokeWidth={3} dot={{ r: 4, fill: '#BC8477' }} activeDot={{ r: 6, fill: '#BC8477', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-5 min-w-0">
          <DataTable columns={columns} data={stats.recentOrders as Order[]} searchKey="customer" />
        </div>
        <Card className="lg:col-span-2 rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5 min-w-0">
          <div className="mb-3">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">Top Selling Products</h3>
            <p className="text-xs text-stone-400">Best performers by volume</p>
          </div>
          <div className="space-y-3">
            {(stats.topProducts || []).map((product: any, i: number) => (
              <div key={i} className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-[#BC8477]/10 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-[#BC8477]" />
                </div>
                <div className="ml-3 space-y-0.5 flex-1 min-w-0">
                  <p className="text-xs font-bold leading-none text-stone-900 truncate">{product.name}</p>
                  <p className="text-[11px] text-stone-400 font-medium">
                    {product.sales} sales
                  </p>
                </div>
                <div className="font-bold text-xs text-stone-900 ml-2 shrink-0">{product.price}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
