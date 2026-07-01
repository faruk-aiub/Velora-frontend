'use client';

import { useState } from 'react';
import {
 ColumnDef,
 flexRender,
 getCoreRowModel,
 useReactTable,
 getPaginationRowModel,
 SortingState,
 getSortedRowModel,
 ColumnFiltersState,
 getFilteredRowModel,
 VisibilityState,
} from '@tanstack/react-table';

import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
 DropdownMenu,
 DropdownMenuCheckboxItem,
 DropdownMenuContent,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
 columns: ColumnDef<TData, TValue>[];
 data: TData[];
 searchKey?: string;
 isLoading?: boolean;
}

export function DataTable<TData, TValue>({
 columns,
 data,
 searchKey,
 isLoading,
}: DataTableProps<TData, TValue>) {
 const [sorting, setSorting] = useState<SortingState>([]);
 const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
 const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
 const [rowSelection, setRowSelection] = useState({});

 const table = useReactTable({
 data,
 columns,
 getCoreRowModel: getCoreRowModel(),
 getPaginationRowModel: getPaginationRowModel(),
 onSortingChange: setSorting,
 getSortedRowModel: getSortedRowModel(),
 onColumnFiltersChange: setColumnFilters,
 getFilteredRowModel: getFilteredRowModel(),
 onColumnVisibilityChange: setColumnVisibility,
 onRowSelectionChange: setRowSelection,
 state: {
 sorting,
 columnFilters,
 columnVisibility,
 rowSelection,
 },
 });

 return (
 <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm">
 <div className="flex items-center pb-6 justify-between">
 {searchKey && (
 <Input
 placeholder={`Filter ${searchKey}...`}
 value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
 onChange={(event) =>
 table.getColumn(searchKey)?.setFilterValue(event.target.value)
 }
 className="max-w-sm rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-colors h-11"
 />
 )}
 <DropdownMenu>
 <DropdownMenuTrigger className="ml-auto inline-flex items-center justify-center rounded-full text-sm font-bold transition-colors hover:bg-gray-50 h-11 px-6 py-2 border border-gray-200 bg-white shadow-sm text-gray-700">
 Columns
 <ChevronDown className="ml-2 h-4 w-4" />
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 {table
 .getAllColumns()
 .filter((column) => column.getCanHide())
 .map((column) => {
 return (
 <DropdownMenuCheckboxItem
 key={column.id}
 className="capitalize"
 checked={column.getIsVisible()}
 onCheckedChange={(value) => column.toggleVisibility(!!value)}
 >
 {column.id}
 </DropdownMenuCheckboxItem>
 );
 })}
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
 <Table>
 <TableHeader>
 {table.getHeaderGroups().map((headerGroup) => (
 <TableRow key={headerGroup.id}>
 {headerGroup.headers.map((header) => {
 return (
 <TableHead key={header.id}>
 {header.isPlaceholder
 ? null
 : flexRender(
 header.column.columnDef.header,
 header.getContext()
 )}
 </TableHead>
 );
 })}
 </TableRow>
 ))}
 </TableHeader>
 <TableBody>
 {table.getRowModel().rows?.length ? (
 table.getRowModel().rows.map((row) => (
 <TableRow
 key={row.id}
 data-state={row.getIsSelected() && 'selected'}
 >
 {row.getVisibleCells().map((cell) => (
 <TableCell key={cell.id}>
 {flexRender(
 cell.column.columnDef.cell,
 cell.getContext()
 )}
 </TableCell>
 ))}
 </TableRow>
 ))
 ) : (
 <TableRow>
 <TableCell
 colSpan={columns.length}
 className="h-24 text-center text-zinc-500"
 >
 No results.
 </TableCell>
 </TableRow>
 )}
 </TableBody>
 </Table>
 </div>
 <div className="flex items-center justify-end space-x-2 pt-6">
 <div className="flex-1 text-sm font-medium text-gray-500">
 {table.getFilteredSelectedRowModel().rows.length} of{' '}
 {table.getFilteredRowModel().rows.length} row(s) selected.
 </div>
 <Button
 variant="outline"
 size="sm"
 onClick={() => table.previousPage()}
 disabled={!table.getCanPreviousPage()}
 className="rounded-full font-bold h-9 px-4"
 >
 Previous
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => table.nextPage()}
 disabled={!table.getCanNextPage()}
 className="rounded-full font-bold h-9 px-4"
 >
 Next
 </Button>
 </div>
 </div>
 );
}
