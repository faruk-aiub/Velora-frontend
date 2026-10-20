'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types/product.types';
import { 
  Grid3X3, 
  LayoutGrid, 
  ArrowUpDown, 
  X, 
  RotateCcw, 
  PackageOpen, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { PaginatedResponse } from '@/types/auth.types';

export function ProductGrid({ 
  categoryOverride,
  initialData,
}: { 
  categoryOverride?: string;
  initialData?: PaginatedResponse<Product> | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [columns, setColumns] = useState<3 | 4>(4);

  const categoryFilter = categoryOverride || searchParams.get('category');
  const subcategoryFilter = searchParams.get('subcategory');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const sort = searchParams.get('sort') || '';
  const searchQuery = searchParams.get('q');

  const pageParam = Number(searchParams.get('page')) || 1;
  const currentPage = Math.max(1, pageParam);
  const pageSize = 20; // 20 items per page

  const activeCategoryId = subcategoryFilter || categoryFilter || undefined;

  const isDefaultView = currentPage === 1 && !activeCategoryId && !minPrice && !maxPrice && !sort && !searchQuery;

  const { data, isLoading, isError, error } = useProducts({
    page: currentPage,
    limit: pageSize,
    category: activeCategoryId,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    sort: sort || undefined,
    search: searchQuery || undefined,
  }, isDefaultView ? initialData : undefined);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset to page 1 on sort change
    if (e.target.value) {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort');
    }
    router.push(`${pathname}?${params.toString()}#products`, { scroll: true });
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset to page 1 on filter remove
    params.delete(key);
    if (key === 'category') params.delete('subcategory');
    router.push(`${pathname}?${params.toString()}#products`, { scroll: true });
  };

  const clearAllFilters = () => {
    router.push('/shop#products', { scroll: true });
  };

  const products = data?.data || [];
  const totalCount = data?.meta?.total ?? products.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}#products`, { scroll: true });
    
    // Smooth scroll to products top
    if (typeof window !== 'undefined') {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }
  };

  const getPaginationItems = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const hasActiveFilters = Boolean(categoryFilter || subcategoryFilter || minPrice || maxPrice || searchQuery || sort);

  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex-1 w-full space-y-6">
      {/* ── Filter & Sort Control Toolbar ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Results Info */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-extrabold text-gray-900 tracking-tight">
            {isLoading 
              ? 'Loading products...' 
              : `Showing ${startItem}–${endItem} of ${totalCount} Products`
            }
          </span>
          {categoryFilter && (
            <span className="text-xs font-bold text-[#BC8477] bg-[#BC8477]/10 px-2.5 py-0.5 rounded-full">
              {subcategoryFilter || categoryFilter}
            </span>
          )}
        </div>

        {/* View Density & Sort Dropdown */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Column Toggle (Desktop only) */}
          <div className="hidden xl:flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
            <button
              onClick={() => setColumns(3)}
              title="3 Columns"
              className={`p-1.5 rounded-lg transition-colors ${
                columns === 3 ? 'bg-white shadow-xs text-[#BC8477]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setColumns(4)}
              title="4 Columns"
              className={`p-1.5 rounded-lg transition-colors ${
                columns === 4 ? 'bg-white shadow-xs text-[#BC8477]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3X3 size={15} />
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/80">
            <ArrowUpDown size={13} className="text-gray-400" />
            <select 
              value={sort}
              onChange={handleSortChange}
              className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="">Featured First</option>
              <option value="created_at:desc">Newest Arrivals</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Active Filter Badges Strip ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-gray-400 mr-1">Active:</span>

          {categoryFilter && (
            <button
              onClick={() => removeFilter('category')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500 transition-colors shadow-xs"
            >
              <span>{subcategoryFilter ? `${categoryFilter}: ${subcategoryFilter}` : categoryFilter}</span>
              <X size={12} />
            </button>
          )}

          {(minPrice || maxPrice) && (
            <button
              onClick={() => {
                removeFilter('min_price');
                removeFilter('max_price');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500 transition-colors shadow-xs"
            >
              <span>৳{minPrice || '0'} – ৳{maxPrice || '∞'}</span>
              <X size={12} />
            </button>
          )}

          {searchQuery && (
            <button
              onClick={() => removeFilter('q')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500 transition-colors shadow-xs"
            >
              <span>Search: "{searchQuery}"</span>
              <X size={12} />
            </button>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-[#BC8477] hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Product Grid or Skeleton State ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[24px] p-4 border border-gray-100 animate-pulse space-y-3">
              <div className="aspect-square bg-gray-100 rounded-[18px]" />
              <div className="h-3 bg-gray-100 rounded-full w-2/3" />
              <div className="h-4 bg-gray-100 rounded-full w-4/5" />
              <div className="h-4 bg-gray-100 rounded-full w-1/3" />
              <div className="h-9 bg-gray-100 rounded-xl w-full pt-2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="w-full py-20 text-center bg-white rounded-3xl border border-red-100 p-8 max-w-md mx-auto">
          <p className="font-bold text-xl text-red-600 mb-2">Unable to load products</p>
          <p className="text-xs text-gray-500 mb-6">Please check your connection and try refreshing.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-xs font-bold shadow-md hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="col-span-full py-24 text-center bg-white rounded-[32px] border border-gray-100 p-8 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#F7F5EE] text-[#BC8477] flex items-center justify-center mx-auto mb-4">
            <PackageOpen size={30} />
          </div>
          <h3 className="font-extrabold text-xl text-gray-900 mb-2">No matching products</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            We couldn't find any products matching your current filters. Try adjusting price range or choosing another category.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 rounded-full bg-[#BC8477] hover:bg-[#A87569] text-white text-xs font-bold shadow-md transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 ${
            columns === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
          } gap-4 sm:gap-6`}>
            {products.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
              />
            ))}
          </div>

          {/* ── Modern Pagination Bar ── */}
          {totalPages > 1 && (
            <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Pagination Info */}
              <div className="text-xs font-semibold text-gray-500">
                Showing <span className="text-gray-900 font-bold">{startItem}–{endItem}</span> of <span className="text-gray-900 font-bold">{totalCount}</span> items (Page <span className="text-[#BC8477] font-bold">{currentPage}</span> of {totalPages})
              </div>

              {/* Page Buttons Controls */}
              <div className="flex items-center gap-1.5">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-bold flex items-center gap-1 text-gray-700 hover:border-[#BC8477] hover:text-[#BC8477] disabled:opacity-30 disabled:pointer-events-none transition-all bg-white shadow-xs"
                >
                  <ChevronLeft size={15} />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Number Pills */}
                {getPaginationItems().map((item, idx) => {
                  if (item === '...') {
                    return (
                      <span key={`dots-${idx}`} className="w-8 h-10 flex items-center justify-center text-xs font-bold text-gray-400">
                        ...
                      </span>
                    );
                  }

                  const pageNum = item as number;
                  const isActive = pageNum === currentPage;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-extrabold transition-all shadow-xs ${
                        isActive
                          ? 'bg-[#BC8477] text-white shadow-sm scale-105'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#BC8477] hover:text-[#BC8477]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-bold flex items-center gap-1 text-gray-700 hover:border-[#BC8477] hover:text-[#BC8477] disabled:opacity-30 disabled:pointer-events-none transition-all bg-white shadow-xs"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
