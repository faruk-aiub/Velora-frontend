'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function CMSPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', image_url: '', link_url: '', position: 0, is_active: true });

  const { data: banners, isLoading } = useQuery({
    queryKey: ['adminBanners'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/banners');
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newBanner: any) => api.post('/admin/cms/banners', newBanner),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminBanners'] }); setIsDialogOpen(false); }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: any }) => api.put(`/admin/cms/banners/${data.id}`, data.payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminBanners'] }); setIsDialogOpen(false); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/cms/banners/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminBanners'] })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (banner: any) => {
    setFormData({ title: banner.title, image_url: banner.image_url, link_url: banner.link_url || '', position: banner.position, is_active: banner.is_active });
    setEditingId(banner.id);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setFormData({ title: '', image_url: '', link_url: '', position: 0, is_active: true });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">CMS Management (Banners)</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="bg-black hover:bg-zinc-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL</Label>
                <Input id="link_url" value={formData.link_url} onChange={e => setFormData({...formData, link_url: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" type="number" value={formData.position} onChange={e => setFormData({...formData, position: Number(e.target.value)})} />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
            ) : banners?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">No banners found.</TableCell></TableRow>
            ) : (
              banners?.map((banner: any) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <img src={banner.image_url} alt={banner.title} className="w-24 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>{banner.position}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800'}`}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(banner.id); }}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
