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
  getExpandedRowModel,
  ExpandedState,
  PaginationState,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  isLoading?: boolean;
  loading?: boolean;
  getSubRows?: (originalRow: TData) => TData[] | undefined;
  defaultPageSize?: number;
}

const COLUMN_LABEL_MAP: Record<string, string> = {
  images: 'Image',
  image: 'Image',
  image_url: 'Image',
  logo_url: 'Logo',
  title: 'Title',
  product_title: 'Product',
  name: 'Name',
  full_name: 'Name',
  email: 'Email',
  role: 'Role',
  category: 'Category',
  base_price: 'Price',
  discount_percent: 'Discount',
  discount_type: 'Discount Type',
  discount_value: 'Discount Value',
  brand: 'Brand',
  is_active: 'Status',
  is_approved: 'Approved',
  is_read: 'Read Status',
  status: 'Status',
  sku: 'SKU',
  quantity: 'Quantity',
  reserved_quantity: 'Reserved',
  available_quantity: 'Available',
  rating: 'Rating',
  comment: 'Comment',
  order_number: 'Order #',
  customer_name: 'Customer',
  total_amount: 'Total',
  created_at: 'Date',
  updated_at: 'Updated',
  code: 'Coupon Code',
  min_order_value: 'Min Order',
  usage: 'Redemptions',
  expires_at: 'Validity',
  parent_id: 'Level',
  slug: 'Slug',
  user: 'Customer Info',
};

function getColumnLabel(column: any): string {
  if (COLUMN_LABEL_MAP[column.id]) {
    return COLUMN_LABEL_MAP[column.id];
  }
  if (typeof column.columnDef?.header === 'string') {
    return column.columnDef.header;
  }
  return column.id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  isLoading,
  loading,
  getSubRows,
  defaultPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const isTableLoading = isLoading || loading;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

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
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      pagination,
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-6 shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center pb-4 sm:pb-6 justify-between gap-3 sm:gap-4">
        {searchKey && (
          <div className="w-full sm:max-w-sm">
            <Input
              placeholder={`Filter by ${searchKey}...`}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="w-full rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>
        )}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 ml-auto">
          <span className="text-[11px] text-gray-400 font-medium lg:hidden select-none">
            Swipe table horizontally →
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-colors hover:bg-gray-50 h-9 sm:h-11 px-4 sm:px-6 py-2 border border-gray-200 bg-white shadow-xs text-gray-700 cursor-pointer">
              Columns
              <ChevronDown className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="w-56 p-2 rounded-2xl shadow-xl border border-gray-100 bg-white"
            >
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Visible Columns
              </div>
              <div className="h-px bg-gray-100 my-1 -mx-1" />
              <div className="space-y-0.5 max-h-64 overflow-y-auto">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      column.getCanHide() &&
                      column.id !== 'actions' &&
                      column.id !== 'select'
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        className="rounded-xl px-3 py-2 text-xs sm:text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {getColumnLabel(column)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-gray-100 overflow-x-auto shadow-xs bg-white overscroll-x-contain">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs sm:text-sm px-2.5 sm:px-3">
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
            {isTableLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs sm:text-sm text-zinc-500"
                >
                  Loading data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs sm:text-sm px-2.5 sm:px-3 py-2.5 sm:py-3">
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
                  className="h-24 text-center text-xs sm:text-sm text-zinc-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Summary Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs sm:text-sm text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-900">{startRow}</span> to{' '}
            <span className="font-semibold text-gray-900">{endRow}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalRows}</span> {totalRows === 1 ? 'item' : 'items'}
          </div>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-semibold">
              {table.getFilteredSelectedRowModel().rows.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2.5 sm:gap-5 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium whitespace-nowrap">Rows</span>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 sm:h-9 w-[68px] sm:w-[74px] rounded-xl bg-gray-50 border-gray-200 text-xs font-semibold">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50, 100, 200].map((size) => (
                  <SelectItem key={size} value={`${size}`} className="text-xs font-medium">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-[11px] sm:text-xs font-semibold text-gray-700 whitespace-nowrap">
            Page {pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-xl border-gray-200"
              title="First page"
            >
              <ChevronsLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-xl border-gray-200"
              title="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-xl border-gray-200"
              title="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-xl border-gray-200"
              title="Last page"
            >
              <ChevronsRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
