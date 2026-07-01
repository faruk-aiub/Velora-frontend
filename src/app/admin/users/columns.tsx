'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type User = {
 id: string;
 email: string;
 full_name: string;
 role: 'ADMIN' | 'CUSTOMER';
 avatar_url: string | null;
 created_at: string;
 is_active: boolean;
};

export const createColumns = (
 onDelete: (user: User) => void
): ColumnDef<User>[] => [
 {
 accessorKey: 'full_name',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 >
 Name
 <ArrowUpDown className="ml-2 h-4 w-4"/>
 </Button>
 );
 },
 cell: ({ row }) => (
 <div className="font-medium">{row.getValue('full_name') || 'N/A'}</div>
 )
 },
 {
 accessorKey: 'email',
 header: 'Email',
 },
 {
 accessorKey: 'role',
 header: 'Role',
 cell: ({ row }) => {
 const role = row.getValue('role') as string;
 return (
 <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
 {role}
 </Badge>
 );
 },
 },
 {
 accessorKey: 'created_at',
 header: 'Joined',
 cell: ({ row }) => {
 const date = new Date(row.getValue('created_at'));
 return <span>{date.toLocaleDateString()}</span>;
 }
 },
 {
 id: 'actions',
 cell: ({ row }) => {
 const user = row.original;
 
 // Prevent deleting other admins or yourself safely
 if (user.role === 'ADMIN') return null;

 return (
 <DropdownMenu>
 <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100">
 <span className="sr-only">Open menu</span>
 <MoreHorizontal className="h-4 w-4"/>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuLabel>Actions</DropdownMenuLabel>
 <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
 Copy Email
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
 <Trash className="w-4 h-4 mr-2"/>
 Delete User
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
];
