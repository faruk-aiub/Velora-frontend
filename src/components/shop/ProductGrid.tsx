'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types/product.types';

export function ProductGrid({ categoryOverride }: { categoryOverride?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryFilter = categoryOverride || searchParams.get('category');
  const subcategoryFilter = searchParams.get('subcategory');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const sort = searchParams.get('sort') || '';
  const searchQuery = searchParams.get('q');

  // Determine the active category filter (if subcategory is selected, it overrides main category)
  const activeCategoryId = subcategoryFilter || categoryFilter || undefined;

  const { data, isLoading, isError, error } = useProducts({
    category: activeCategoryId,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    sort: sort || undefined,
    search: searchQuery || undefined,
    limit: 20
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isError) {
    console.error("Products Fetch Error:", error);
  }

  const products = data?.data || [];

  return (
    <div className="flex-1 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="hidden font-bold text-4xl text-gray-900 tracking-tight">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sort By</span>
          <select 
            value={sort}
            onChange={handleSortChange}
            className="bg-transparent border-b border-[#E8E1DE] text-sm text-gray-900 pb-1 focus:outline-none focus:border-[#7A915C]"
          >
            <option value="">Featured</option>
            <option value="created_at:desc">Newest Arrivals</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full py-20 flex justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4 text-[#7A915C]">
            <div className="w-8 h-8 rounded-full border-2 border-t-[#7A915C] border-r-[#7A915C] border-b-transparent border-l-transparent animate-spin" />
            <p className="text-sm font-bold tracking-widest uppercase">Loading products...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="w-full py-20 text-center text-red-500">
          <p className="font-bold text-2xl mb-2">Failed to load products</p>
          <p className="text-sm">Please try refreshing the page.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.length > 0 ? (
              products.map((product: Product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500">
                <p className="font-bold text-2xl mb-2">No products found</p>
                <p className="text-sm">Try selecting a different category or clearing filters.</p>
              </div>
            )}
          </div>

          {products.length > 0 && (
            <div className="mt-16 flex justify-center">
              <button className="h-12 px-8 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm">
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
