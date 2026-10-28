'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  UserCog,
  UploadCloud,
  Trash2,
  Camera,
  Loader2,
  Mail,
  Phone,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  Link2,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface AdminProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminProfileDialog({ open, onOpenChange }: AdminProfileDialogProps) {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever the dialog opens or user changes
  useEffect(() => {
    if (open && user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatar_url || '');
      setShowUrlInput(false);
    }
  }, [open, user]);

  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() ||
    (user?.email?.[0]?.toUpperCase() || 'SA');

  const fullNamePreview = [firstName, lastName].filter(Boolean).join(' ') || 'Super Admin';
  const emailPreview = user?.email || 'admin@velora.com';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WEBP, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must not exceed 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.data?.url) {
        let url = response.data.data.url;
        if (url.startsWith('/uploads')) {
          url = `http://localhost:3000${url}`;
        }
        setAvatarUrl(url);
        toast.success('Avatar uploaded successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    toast.info('Avatar removed. Will revert to initials upon saving.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
        avatar_url: avatarUrl.trim() || undefined,
      };

      const res = await userService.updateProfile(payload);

      if (res?.data) {
        // Update user in Zustand auth store & localStorage immediately for real-time reactivity
        setUser(res.data);
      } else {
        // Fallback update if data wrapper differs
        if (user) {
          setUser({
            ...user,
            first_name: payload.first_name,
            last_name: payload.last_name,
            phone: payload.phone,
            avatar_url: payload.avatar_url,
          });
        }
      }

      toast.success('Profile updated successfully!');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-24px)] sm:max-w-[520px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 shadow-2xl">
        <DialogHeader className="pb-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#BC8477] uppercase tracking-wider mb-1">
            <UserCog className="w-4 h-4" />
            Administrator Profile
          </div>
          <DialogTitle className="text-xl font-bold text-stone-900 leading-snug">
            Admin Profile & Avatar
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500 mt-0.5">
            Update your display picture, personal details, and administrator credentials in real-time.
          </DialogDescription>
        </DialogHeader>

        {/* Live Topbar Snapshot Preview */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 mt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BC8477]" />
              Real-time Topbar Preview
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#BC8477]/10 text-[#BC8477]">
              <ShieldCheck className="w-3 h-3" />
              Super Admin
            </div>
          </div>

          <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-xs">
            <div className="text-xs font-semibold text-stone-400">Header Bar View:</div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold text-stone-900 leading-tight">
                  {fullNamePreview}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                  {emailPreview}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-stone-100 overflow-hidden shrink-0 border border-stone-200/70 flex items-center justify-center font-bold text-xs text-[#BC8477] shadow-xs">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          {/* Avatar Section */}
          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 flex flex-col sm:flex-row items-center gap-4">
            {/* Avatar Circle Preview */}
            <div className="relative group shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-stone-100 overflow-hidden border-2 border-stone-200/90 shadow-sm flex items-center justify-center font-bold text-xl text-[#BC8477] cursor-pointer relative transition-all group-hover:border-[#BC8477]"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-semibold tracking-wide">Change</span>
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-[9px] mt-1 font-semibold">Uploading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar Actions */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="text-xs font-bold text-stone-800">Profile Picture</div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Upload your picture (max 5MB, JPG, PNG, WEBP). It will be automatically optimized and displayed in the header.
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-xl h-8 px-3 text-xs font-semibold border-stone-200 hover:bg-stone-100 text-stone-700"
                >
                  <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
                  Upload Photo
                </Button>

                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading}
                    className="rounded-xl h-8 px-2.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="rounded-xl h-8 px-2.5 text-[11px] font-semibold text-stone-500 hover:text-stone-800"
                >
                  <Link2 className="w-3 h-3 mr-1" />
                  {showUrlInput ? 'Hide URL' : 'Image URL'}
                </Button>
              </div>

              {/* Direct URL input if user prefers pasting external link */}
              {showUrlInput && (
                <div className="pt-2">
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="h-8 text-xs rounded-lg bg-white border-stone-200"
                  />
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-700">First Name</Label>
              <div className="relative">
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Super"
                  required
                  className="h-10 pl-8 rounded-xl bg-stone-50 border-stone-200 text-sm font-medium focus:bg-white"
                />
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-700">Last Name</Label>
              <div className="relative">
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Admin"
                  required
                  className="h-10 pl-8 rounded-xl bg-stone-50 border-stone-200 text-sm font-medium focus:bg-white"
                />
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Email (Readonly account ID) & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-stone-700">Email Address</Label>
                <span className="text-[10px] text-stone-400 font-semibold">Account ID</span>
              </div>
              <div className="relative">
                <Input
                  value={emailPreview}
                  disabled
                  className="h-10 pl-8 rounded-xl bg-stone-100 border-stone-200 text-sm font-medium text-stone-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-700">Phone Number</Label>
              <div className="relative">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1700-000000"
                  className="h-10 pl-8 rounded-xl bg-stone-50 border-stone-200 text-sm font-medium focus:bg-white"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-xl px-5 h-10 border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="rounded-xl px-6 h-10 bg-[#BC8477] hover:bg-[#a67266] text-white shadow-sm font-bold flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
