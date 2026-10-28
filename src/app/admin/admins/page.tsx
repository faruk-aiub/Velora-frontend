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
import { Plus, Shield, ShieldCheck, UserCheck, RefreshCw, MoreHorizontal, Power, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function AdminsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '' });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [adminToDelete, setAdminToDelete] = useState<any | null>(null);

  const { data: admins = [], isLoading, isFetching } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await api.get('/admin/admins');
      setLastUpdated(new Date());
      return res.data.data;
    },
    refetchInterval: 10000,
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
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string, is_active: boolean }) => api.patch(`/admin/admins/${id}/status`, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Admin status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/admins/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setAdminToDelete(null);
      toast.success('Admin deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
      setAdminToDelete(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleToggleStatus = (admin: any) => {
    updateStatusMutation.mutate({ id: admin.id, is_active: !admin.is_active });
  };

  const activeAdmins = admins.filter((a: any) => a.is_active).length;
  const totalAdmins = admins.length;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-75">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Admins Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time view of users with administrative privileges.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-sm border border-gray-100 text-xs sm:text-sm">
            <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-medium text-gray-700">Live Updates</span>
              {isFetching && <RefreshCw className="h-3 w-3 animate-spin text-gray-400" />}
            </div>
            {lastUpdated && (
              <span className="text-[10px] sm:text-xs text-gray-400 ml-1.5 sm:ml-2 border-l pl-2 sm:pl-3">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-sm px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm font-bold">
                <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[425px] rounded-2xl p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Create New Admin</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="first_name" className="text-xs font-semibold">First Name</Label>
                    <Input id="first_name" placeholder="John" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required className="rounded-xl text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="last_name" className="text-xs font-semibold">Last Name</Label>
                    <Input id="last_name" placeholder="Doe" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required className="rounded-xl text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
                  <Input id="email" type="email" placeholder="admin@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="rounded-xl text-sm" />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full bg-[#BC8477] hover:bg-[#A67165] rounded-xl font-bold h-10 text-sm" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create Admin'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Total Admins</span>
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-xl sm:rounded-2xl shrink-0">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-gray-900 mt-2 sm:mt-3 truncate">{totalAdmins}</div>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">Admin accounts</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider truncate">Active Admins</span>
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-xl sm:rounded-2xl shrink-0">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-gray-900 mt-2 sm:mt-3 truncate">{activeAdmins}</div>
          <p className="text-[11px] sm:text-xs text-emerald-600 mt-0.5 sm:mt-1 truncate flex items-center">
            <UserCheck className="w-3.5 h-3.5 mr-1 shrink-0"/> Active
          </p>
        </Card>
      </div>

      <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Admin Users</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="border border-gray-100 rounded-2xl overflow-x-auto overscroll-x-contain">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Name</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Email</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Role</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right whitespace-nowrap">Joined</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center w-12 whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && !admins.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-48">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-gray-300" />
                        <span>Loading admins...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-48 text-gray-500 font-medium">No admins found.</TableCell></TableRow>
                ) : (
                  admins.map((admin: any) => (
                    <TableRow key={admin.id} className="border-gray-50 transition-colors hover:bg-gray-50/50">
                      <TableCell className="font-bold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                        {admin.profile ? `${admin.profile.first_name} ${admin.profile.last_name}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-600 whitespace-nowrap text-xs sm:text-sm">{admin.email}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase bg-blue-100 text-blue-800">
                          {admin.role}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase ${admin.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {new Date(admin.created_at).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                              <Power className="mr-2 h-4 w-4" />
                              {admin.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:bg-red-50 focus:text-red-600"
                              onClick={() => setAdminToDelete(admin)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDeleteModal
        isOpen={!!adminToDelete}
        onClose={() => setAdminToDelete(null)}
        onConfirm={() => adminToDelete && deleteMutation.mutate(adminToDelete.id)}
        title="Delete Admin"
        description={`Are you sure you want to delete ${adminToDelete?.profile?.first_name || 'this admin'}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
