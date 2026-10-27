'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, MoreHorizontal, Trash, ChevronDown, ChevronRight, FolderTree, Tag, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CategoryTree } from '@/lib/categories';
export type Category = CategoryTree;

export const createColumns = (
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: 'image_url',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string | null;
      return (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200/60 shadow-xs shrink-0">
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={(row.getValue('name') as string) || 'Category'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <FolderTree className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 hover:bg-gray-100 font-semibold text-gray-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Category Name
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const hasChildren = row.original.children && row.original.children.length > 0;
      const isSub = row.depth > 0 || !!row.original.parent_id;

      return (
        <div
          style={{ paddingLeft: `${row.depth * 1.5}rem` }}
          className="flex items-center gap-2 max-w-[320px]"
        >
          {row.getCanExpand() ? (
            <button
              type="button"
              onClick={row.getToggleExpandedHandler()}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer shrink-0"
              title={row.getIsExpanded() ? 'Collapse' : 'Expand'}
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="w-4 h-4 text-gray-700" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-700" />
              )}
            </button>
          ) : isSub ? (
            <span className="w-4 h-4 flex items-center justify-center text-gray-300 shrink-0">
              ↳
            </span>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          <div>
            <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <span>{row.getValue('name')}</span>
              {hasChildren && (
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md">
                  {row.original.children?.length}
                </span>
              )}
            </div>
            {isSub && (
              <span className="text-[11px] text-gray-400 font-medium">Subcategory</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs text-gray-600 bg-gray-50 border-gray-200">
        {row.getValue('slug')}
      </Badge>
    ),
  },
  {
    accessorKey: 'parent_id',
    header: 'Level',
    cell: ({ row }) => {
      const parentId = row.getValue('parent_id') as string | null;
      if (!parentId) {
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <FolderTree className="w-3 h-3 text-blue-600" />
            Root Department
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          <Tag className="w-3 h-3 text-purple-600" />
          Subcategory
        </span>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 px-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-xs flex items-center gap-1 cursor-pointer"
            title="Edit Category"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-2xl shadow-xl border border-gray-100 bg-white">
              <DropdownMenuLabel className="px-2.5 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Category Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onEdit(category)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 mr-2 text-gray-500" />
                Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(`/shop?category=${category.slug}`, '_blank')}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 mr-2 text-gray-500" />
                View in Store
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem
                onClick={() => onDelete(category)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5 mr-2 text-red-600" />
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
