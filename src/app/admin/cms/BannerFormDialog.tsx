'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/admin/FileUpload';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Banner } from './columns';

interface BannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bannerToEdit?: Banner | null;
}

export function BannerFormDialog({ open, onOpenChange, bannerToEdit }: BannerFormDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    position: 0,
    is_active: true,
  });

  useEffect(() => {
    if (bannerToEdit) {
      setFormData({
        title: bannerToEdit.title,
        image_url: bannerToEdit.image_url,
        link_url: bannerToEdit.link_url || '',
        position: bannerToEdit.position,
        is_active: bannerToEdit.is_active,
      });
    } else {
      setFormData({
        title: '',
        image_url: '',
        link_url: '',
        position: 0,
        is_active: true,
      });
    }
  }, [bannerToEdit, open]);

  const createMutation = useMutation({
    mutationFn: (newBanner: any) => api.post('/admin/cms/banners', newBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      toast.success('Banner created successfully');
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to create banner'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: any }) => api.put(`/admin/cms/banners/${data.id}`, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      toast.success('Banner updated successfully');
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to update banner'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error('Banner image is required');
      return;
    }

    if (bannerToEdit) {
      updateMutation.mutate({ id: bannerToEdit.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{bannerToEdit ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Banner Image <span className="text-red-500">*</span></Label>
            <FileUpload
              onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
              currentImageUrl={formData.image_url}
              folder="cms"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Summer Sale"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_url">Link URL</Label>
            <Input
              id="link_url"
              value={formData.link_url}
              onChange={e => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="/categories/summer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: Number(e.target.value) })}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="is_active"
                className="w-4 h-4 rounded border-gray-300 text-[#B58A63] focus:ring-[#B58A63]"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#B58A63] hover:bg-[#A37B55] text-white rounded-full px-8"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {bannerToEdit ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
