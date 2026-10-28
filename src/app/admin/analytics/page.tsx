'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import api from '@/lib/axios';
import { 
  ArrowUpRight, 
  Users, 
  CreditCard, 
  Package,
  Banknote,
  RefreshCw,
  Activity
} from 'lucide-react';

// Client-side in-memory cache for instant 0ms tab switching
let inMemoryAnalyticsCache: {
  salesData: any[];
  userStats: { total: number; newThisMonth: number };
  dashboardStats: { totalSales: number; totalOrders: number; totalProducts: number };
  lastUpdated: Date;
} | null = null;

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState<any[]>(inMemoryAnalyticsCache?.salesData || []);
  const [userStats, setUserStats] = useState(inMemoryAnalyticsCache?.userStats || { total: 0, newThisMonth: 0 });
  const [dashboardStats, setDashboardStats] = useState(inMemoryAnalyticsCache?.dashboardStats || { totalSales: 0, totalOrders: 0, totalProducts: 0 });
  const [isLoading, setIsLoading] = useState(!inMemoryAnalyticsCache);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(inMemoryAnalyticsCache?.lastUpdated || null);

  const fetchAnalytics = async (isPoll = false) => {
    if (!inMemoryAnalyticsCache && !isPoll) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [salesRes, usersRes, dashboardRes] = await Promise.all([
        api.get('/admin/sales-report'),
        api.get('/admin/user-stats'),
        api.get('/admin/dashboard')
      ]);
      
      const newSales = salesRes.data?.data?.monthly || [];
      const newUsers = usersRes.data?.data || { total: 0, newThisMonth: 0 };
      const newDashboard = dashboardRes.data?.data || { totalSales: 0, totalOrders: 0, totalProducts: 0 };
      const now = new Date();

      setSalesData(newSales);
      setUserStats(newUsers);
      setDashboardStats(newDashboard);
      setLastUpdated(now);

      inMemoryAnalyticsCache = {
        salesData: newSales,
        userStats: newUsers,
        dashboardStats: newDashboard,
        lastUpdated: now
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Polling every 15 seconds
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900">Analytics Overview</h1>
          <p className="text-xs text-stone-500">
            Real-time breakdown of revenue, customer acquisition, and store performance.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-stone-200/70 shrink-0 self-start sm:self-auto">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-semibold text-stone-700">Live Sync</span>
          {isRefreshing && <RefreshCw className="h-3 w-3 animate-spin text-stone-400" />}
          {lastUpdated && (
            <span className="text-[11px] text-stone-400 border-l border-stone-200 pl-2">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

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
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">৳{(dashboardStats.totalSales || 0).toLocaleString()}</div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 flex items-center mt-1 truncate">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> +12.5% <span className="text-stone-400 font-normal ml-1 hidden xs:inline">vs last month</span>
            </p>
          </div>
        </Card>
        
        <Card className="rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500">Customers</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">{userStats.total}</div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 flex items-center mt-1 truncate">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> +{userStats.newThisMonth} <span className="text-stone-400 font-normal ml-1 hidden xs:inline">new</span>
            </p>
          </div>
        </Card>
        
        <Card className="rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500">Total Orders</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">{dashboardStats.totalOrders}</div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 flex items-center mt-1 truncate">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" /> +8.2% <span className="text-stone-400 font-normal ml-1 hidden xs:inline">vs last month</span>
            </p>
          </div>
        </Card>
        
        <Card className="rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500">Products</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">{dashboardStats.totalProducts}</div>
            <p className="text-[11px] sm:text-xs font-semibold text-purple-600 flex items-center mt-1 truncate">
              <Activity className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Stable inventory
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5 min-w-0">
          <div className="mb-3">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">Revenue Growth</h3>
            <p className="text-xs text-stone-400">Monthly revenue distribution</p>
          </div>
          <div className="h-[210px] sm:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }} 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '12px', color: '#111827', fontWeight: 'bold' }} 
                  formatter={(value: any) => [`৳${Number(value || 0).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="total" fill="#BC8477" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-3 rounded-2xl border border-stone-200/70 bg-white shadow-xs p-3.5 sm:p-5 min-w-0">
          <div className="mb-3">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">Sales Trend</h3>
            <p className="text-xs text-stone-400">Past performance momentum</p>
          </div>
          <div className="h-[210px] sm:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '12px', color: '#111827', fontWeight: 'bold' }} 
                  formatter={(value: any) => [`৳${Number(value || 0).toLocaleString()}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#BC8477" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#BC8477', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, fill: '#BC8477', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
