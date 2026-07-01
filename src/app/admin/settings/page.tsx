'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('admin_access_token');
      const res = await fetch('http://localhost:3000/api/v1/admin/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Password changed successfully');
        setOldPassword('');
        setNewPassword('');
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred while changing password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 max-w-2xl mx-auto">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Manage admin account preferences.</p></div>
      
      <Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 overflow-hidden">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your admin account password.</CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="old_password">Current Password</Label>
              <Input className="rounded-xl h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
                id="old_password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input className="rounded-xl h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 font-bold shadow-sm">
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
