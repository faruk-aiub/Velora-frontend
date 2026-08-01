'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchCategoryTree, CategoryTree } from "@/lib/categories";

export function ShopSidebar({ categoryOverride }: { categoryOverride?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentCategory = categoryOverride || searchParams.get('category');
  const currentSubcategory = searchParams.get('subcategory');
  
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  
  const [categories, setCategories] = useState<CategoryTree[]>([]);

  // Sync state with URL params
  useEffect(() => {
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchCategoryTree().then(setCategories);
  }, []);

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('min_price', minPrice);
    else params.delete('min_price');
    
    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');
    
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: true });
  };

  const [openCategory, setOpenCategory] = useState<string | null>(currentCategory || 'Agricultural Products');

  const toggleCategory = (name: string, slug: string) => {
    setOpenCategory(openCategory === name ? null : name);
    if (openCategory !== name) {
      router.push(`/category/${slug}#products`, { scroll: true });
    } else {
      router.push('/shop#products', { scroll: true });
    }
  };

  const selectSubcategory = (categoryName: string, subName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', categoryName);
    params.set('subcategory', subName);
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: true });
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <SlidersHorizontal size={20} className="text-gray-900" />
        <h2 className="font-bold text-2xl text-gray-900 tracking-tight">Filters</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const isOpen = openCategory === category.name;
              
              return (
                <div key={category.id} className="border-b border-gray-100 last:border-0 pb-2">
                  <button
                    onClick={() => toggleCategory(category.name, category.slug)}
                    className="w-full flex items-center justify-between py-2 text-left group"
                  >
                    <span className={cn(
                      "text-sm transition-colors duration-200",
                      isOpen ? "text-[#BC8477] font-medium" : "text-gray-900 group-hover:text-[#BC8477]"
                    )}>
                      {category.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform duration-300 text-gray-500",
                        isOpen && "rotate-180 text-[#BC8477]"
                      )}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && category.children && category.children.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <ul className="pt-2 pb-4 space-y-2 pl-4">
                          {category.children.map((sub) => (
                            <li key={sub.id}>
                              <button 
                                onClick={() => selectSubcategory(category.name, sub.name)}
                                className={cn(
                                  "text-sm hover:text-[#BC8477] transition-colors flex items-center gap-2 w-full text-left",
                                  currentSubcategory === sub.name ? "text-[#BC8477] font-medium" : "text-gray-500"
                                )}
                              >
                                <span className="text-gray-400 text-xs mr-1">•</span>
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Filter */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Price Range</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                placeholder="৳ Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200 transition-all" 
              />
              <span className="text-gray-500">-</span>
              <input 
                type="number" 
                placeholder="৳ Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200 transition-all" 
              />
            </div>
            <button 
              onClick={applyPriceFilter}
              className="w-full h-10 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
