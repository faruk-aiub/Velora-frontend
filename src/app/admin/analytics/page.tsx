'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '@/lib/axios';

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ total: 0, newThisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, usersRes] = await Promise.all([
          api.get('/admin/sales-report'),
          api.get('/admin/user-stats')
        ]);
        
        if (salesRes.data?.data?.monthly) {
          setSalesData(salesRes.data.data.monthly);
        }
        if (usersRes.data?.data) {
          setUserStats(usersRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Detailed breakdown of sales and user growth.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{userStats.total}</div>
            <p className="text-sm text-green-500 font-bold mt-2">
              +{userStats.newThisMonth} new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
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
    </div>
  );
}
