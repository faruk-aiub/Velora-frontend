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
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform configuration and account preferences.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${activeTab === 'general' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <SettingsIcon className="w-5 h-5" /> General Config
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${activeTab === 'security' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Shield className="w-5 h-5" /> Security
            </button>
          </nav>
        </div>

        <div className="flex-1">
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
      <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Global variables that dictate application behavior.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-gray-900 text-white rounded-full font-bold px-6">
                <Plus className="w-4 h-4 mr-2" /> Add Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingConfig ? 'Edit Configuration' : 'New Configuration'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Config Key (e.g. STORE_NAME)</Label>
                  <Input 
                    value={formData.key} 
                    onChange={e => setFormData({...formData, key: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                    disabled={!!editingConfig}
                    required 
                    placeholder="STORE_CURRENCY"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input 
                    value={formData.value} 
                    onChange={e => setFormData({...formData, value: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <Button type="submit" disabled={upsertMutation.isPending} className="w-full">
                  {upsertMutation.isPending ? 'Saving...' : 'Save Configuration'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-600">Key</TableHead>
                  <TableHead className="font-semibold text-gray-600">Value</TableHead>
                  <TableHead className="font-semibold text-gray-600">Description</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
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
                      <TableCell className="font-mono text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md max-w-fit inline-flex mt-3 ml-2">
                        {config.key}
                      </TableCell>
                      <TableCell className="font-medium text-gray-700 max-w-[200px] truncate" title={config.value}>
                        {config.value}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {config.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(config)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfigToDelete(config.key)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
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
    <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 overflow-hidden max-w-2xl">
      <CardHeader>
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-gray-700" />
        </div>
        <CardTitle className="text-xl">Change Password</CardTitle>
        <CardDescription>Update your admin account password to maintain security.</CardDescription>
      </CardHeader>
      <form onSubmit={handleChangePassword}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="old_password">Current Password</Label>
            <Input 
              className="rounded-xl h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
              id="old_password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input 
              className="rounded-xl h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50/50 mt-6 pt-6">
          <Button type="submit" disabled={passwordMutation.isPending} className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 font-bold shadow-sm">
            {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
