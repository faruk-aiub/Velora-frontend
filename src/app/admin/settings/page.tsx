'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Shield, Settings as SettingsIcon, Plus, Save, Trash2, KeyRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-75">
      <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage platform configuration and account preferences.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        <div className="md:w-60 lg:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-colors shrink-0 whitespace-nowrap ${activeTab === 'general' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 bg-white md:bg-transparent border border-gray-100 md:border-transparent'}`}
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" /> General Config
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-colors shrink-0 whitespace-nowrap ${activeTab === 'security' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 bg-white md:bg-transparent border border-gray-100 md:border-transparent'}`}
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> Security
            </button>
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [formData, setFormData] = useState({ key: '', value: '', description: '' });
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['adminConfigs'],
    queryFn: async () => {
      const res = await api.get('/admin/config');
      return res.data.data;
    }
  });

  const upsertMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/config', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminConfigs'] });
      setIsDialogOpen(false);
      toast.success('Configuration saved successfully');
      setFormData({ key: '', value: '', description: '' });
      setEditingConfig(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save config');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (key: string) => api.delete(`/admin/config/${key}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminConfigs'] });
      setConfigToDelete(null);
      toast.success('Configuration deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete config');
      setConfigToDelete(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate(formData);
  };

  const openEdit = (config: any) => {
    setEditingConfig(config);
    setFormData({ key: config.key, value: config.value, description: config.description || '' });
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setEditingConfig(null);
    setFormData({ key: '', value: '', description: '' });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold">System Configuration</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Global variables that dictate application behavior.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-gray-900 text-white rounded-full font-bold px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg rounded-2xl p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">{editingConfig ? 'Edit Configuration' : 'New Configuration'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">Config Key (e.g. STORE_NAME)</Label>
                  <Input 
                    value={formData.key} 
                    onChange={e => setFormData({...formData, key: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                    disabled={!!editingConfig}
                    required 
                    placeholder="STORE_CURRENCY"
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">Value</Label>
                  <Input 
                    value={formData.value} 
                    onChange={e => setFormData({...formData, value: e.target.value})}
                    required 
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">Description (Optional)</Label>
                  <Input 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="rounded-xl text-sm"
                  />
                </div>
                <Button type="submit" disabled={upsertMutation.isPending} className="w-full bg-gray-900 text-white rounded-xl font-bold h-10 sm:h-11">
                  {upsertMutation.isPending ? 'Saving...' : 'Save Configuration'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="border border-gray-100 rounded-2xl overflow-x-auto overscroll-x-contain">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Key</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Value</TableHead>
                  <TableHead className="font-semibold text-gray-600 whitespace-nowrap">Description</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600 whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-24 text-gray-500">Loading...</TableCell></TableRow>
                ) : configs.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-24 text-gray-500">No configurations found.</TableCell></TableRow>
                ) : (
                  configs.map((config: any) => (
                    <TableRow key={config.key}>
                      <TableCell className="font-mono text-xs font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md max-w-fit inline-flex my-2 ml-2 shrink-0">
                        {config.key}
                      </TableCell>
                      <TableCell className="font-medium text-gray-700 max-w-[180px] sm:max-w-[200px] truncate" title={config.value}>
                        {config.value}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-gray-500 max-w-[200px] truncate">
                        {config.description || '-'}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(config)} className="h-8 px-2.5 text-xs">Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfigToDelete(config.key)} className="h-8 px-2 text-red-500 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
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
        isOpen={!!configToDelete}
        onClose={() => setConfigToDelete(null)}
        onConfirm={() => configToDelete && deleteMutation.mutate(configToDelete)}
        title="Delete Configuration"
        description={`Are you sure you want to delete the configuration key "${configToDelete}"? This may affect application behavior.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function SecuritySettings() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const passwordMutation = useMutation({
    mutationFn: () => api.post('/admin/auth/change-password', { old_password: oldPassword, new_password: newPassword }),
    onSuccess: (res: any) => {
      toast.success(res.data?.message || 'Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    passwordMutation.mutate();
  };

  return (
    <Card className="rounded-2xl sm:rounded-3xl border-0 bg-white shadow-sm ring-0 overflow-hidden max-w-2xl">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
          <KeyRound className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </div>
        <CardTitle className="text-lg sm:text-xl font-bold">Change Password</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Update your admin account password to maintain security.</CardDescription>
      </CardHeader>
      <form onSubmit={handleChangePassword}>
        <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6 pt-2 sm:pt-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="old_password" className="text-xs sm:text-sm font-semibold">Current Password</Label>
            <Input 
              className="rounded-xl h-10 sm:h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors text-sm"
              id="old_password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="new_password" className="text-xs sm:text-sm font-semibold">New Password</Label>
            <Input 
              className="rounded-xl h-10 sm:h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors text-sm"
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50/50 mt-4 sm:mt-6 p-4 sm:p-6 flex flex-col sm:flex-row justify-start">
          <Button type="submit" disabled={passwordMutation.isPending} className="w-full sm:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 h-10 font-bold shadow-sm text-xs sm:text-sm">
            {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
