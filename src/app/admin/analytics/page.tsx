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

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ total: 0, newThisMonth: 0 });
  const [dashboardStats, setDashboardStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = async (isPoll = false) => {
    if (!isPoll) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [salesRes, usersRes, dashboardRes] = await Promise.all([
        api.get('/admin/sales-report'),
        api.get('/admin/user-stats'),
        api.get('/admin/dashboard')
      ]);
      
      if (salesRes.data?.data?.monthly) {
        setSalesData(salesRes.data.data.monthly);
      }
      if (usersRes.data?.data) {
        setUserStats(usersRes.data.data);
      }
      if (dashboardRes.data?.data) {
        setDashboardStats(dashboardRes.data.data);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Real-time polling every 10 seconds
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <RefreshCw className="h-8 w-8 animate-spin text-[#BC8477]" />
          <p className="text-sm font-medium animate-pulse">Loading live analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-75">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time breakdown of sales, users, and overall performance.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Live Updates</span>
            {isRefreshing && <RefreshCw className="h-3 w-3 animate-spin text-gray-400" />}
          </div>
          {lastUpdated && (
            <span className="text-xs text-gray-400 ml-2 border-l pl-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Total Revenue</CardTitle>
            <div className="p-2 bg-rose-50 rounded-2xl">
              <Banknote className="h-5 w-5 text-[#BC8477]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">৳{(dashboardStats.totalSales || 0).toLocaleString()}</div>
            <p className="text-sm font-bold text-green-500 flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +12.5% <span className="text-gray-400 font-medium ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Active Customers</CardTitle>
            <div className="p-2 bg-blue-50 rounded-2xl">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{userStats.total}</div>
            <p className="text-sm font-bold text-green-500 flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +{userStats.newThisMonth} <span className="text-gray-400 font-medium ml-1">new this month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Total Orders</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-2xl">
              <CreditCard className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardStats.totalOrders}</div>
            <p className="text-sm font-bold text-green-500 flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +8.2% <span className="text-gray-400 font-medium ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Active Products</CardTitle>
            <div className="p-2 bg-purple-50 rounded-2xl">
              <Package className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardStats.totalProducts}</div>
            <p className="text-sm font-bold text-purple-500 flex items-center mt-2">
              <Activity className="w-4 h-4 mr-1" /> Stable inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }} 
                    contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', color: '#111827', fontWeight: 'bold' }} 
                    formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="total" fill="#BC8477" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', color: '#111827', fontWeight: 'bold' }} 
                    formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#BC8477" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#BC8477', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6, fill: '#BC8477', stroke: '#fff', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
