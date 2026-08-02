'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Shield, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '' });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { data: admins = [], isLoading, isFetching } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await api.get('/admin/admins');
      setLastUpdated(new Date());
      return res.data.data;
    },
    refetchInterval: 10000, // Real-time polling
  });

  const createMutation = useMutation({
    mutationFn: (newAdmin: any) => api.post('/admin/admins', newAdmin),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); 
      setIsDialogOpen(false); 
      setFormData({ email: '', password: '', first_name: '', last_name: '' });
      toast.success('Admin created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create admin.');
      console.error(error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const activeAdmins = admins.filter((a: any) => a.is_active).length;
  const totalAdmins = admins.length;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admins Management</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time view of users with administrative privileges.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hidden md:flex">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Live Updates</span>
              {isFetching && <RefreshCw className="h-3 w-3 animate-spin text-gray-400" />}
            </div>
            {lastUpdated && (
              <span className="text-xs text-gray-400 ml-2 border-l pl-3">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-sm px-6 font-bold">
                <Plus className="mr-2 h-4 w-4" /> Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" placeholder="John" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" placeholder="Doe" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="admin@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full bg-[#BC8477] hover:bg-[#A67165]" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create Admin'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Total Admins</CardTitle>
            <div className="p-2 bg-blue-50 rounded-2xl">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{totalAdmins}</div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Registered admin accounts</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500">Active Admins</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-2xl">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{activeAdmins}</div>
            <p className="text-xs text-emerald-500 mt-2 font-bold flex items-center">
              <UserCheck className="w-4 h-4 mr-1"/> Accounts active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-600">Name</TableHead>
                  <TableHead className="font-semibold text-gray-600">Email</TableHead>
                  <TableHead className="font-semibold text-gray-600">Role</TableHead>
                  <TableHead className="font-semibold text-gray-600">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && !admins.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-48">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-gray-300" />
                        <span>Loading admins...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-48 text-gray-500 font-medium">No admins found.</TableCell></TableRow>
                ) : (
                  admins.map((admin: any) => (
                    <TableRow key={admin.id} className="border-gray-50 transition-colors hover:bg-gray-50/50">
                      <TableCell className="font-bold text-gray-900">
                        {admin.profile ? `${admin.profile.first_name} ${admin.profile.last_name}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-600">{admin.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-100 text-blue-800">
                          {admin.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${admin.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {new Date(admin.created_at).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
