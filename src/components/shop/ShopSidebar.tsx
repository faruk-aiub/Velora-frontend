'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCategoryTree, CategoryTree } from "@/lib/categories";

interface ShopSidebarProps {
  initialCategories?: CategoryTree[];
  categoryOverride?: string;
}

export function ShopSidebar({ initialCategories, categoryOverride }: ShopSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentCategory = categoryOverride || searchParams.get('category');
  const currentSubcategory = searchParams.get('subcategory');
  
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  
  const [categories, setCategories] = useState<CategoryTree[]>(initialCategories || []);

  // Sync state with URL params
  useEffect(() => {
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
  }, [searchParams]);

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetchCategoryTree().then(setCategories);
    }
  }, [initialCategories]);

  const applyPriceFilter = (min?: string, max?: string) => {
    const minVal = min !== undefined ? min : minPrice;
    const maxVal = max !== undefined ? max : maxPrice;

    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset to page 1
    if (minVal) params.set('min_price', minVal);
    else params.delete('min_price');
    
    if (maxVal) params.set('max_price', maxVal);
    else params.delete('max_price');
    
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: true });
  };

  const clearAllFilters = () => {
    router.push('/shop#products', { scroll: true });
  };

  const hasActiveFilters = Boolean(currentCategory || currentSubcategory || minPriceParam || maxPriceParam);

  const pricePresets = [
    { label: "All Prices", min: "", max: "" },
    { label: "Under ৳1,000", min: "", max: "1000" },
    { label: "৳1,000 – ৳5,000", min: "1000", max: "5000" },
    { label: "৳5,000 – ৳25,000", min: "5000", max: "25000" },
    { label: "৳25,000 – ৳60,000", min: "25000", max: "60000" },
    { label: "৳60,000+", min: "60000", max: "" },
  ];

  const [openCategory, setOpenCategory] = useState<string | null>(currentCategory || null);

  const toggleCategory = (name: string, slug: string) => {
    setOpenCategory(openCategory === name ? null : name);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset to page 1
    params.delete('subcategory');
    if (openCategory !== name) {
      params.set('category', name);
    } else {
      params.delete('category');
    }
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: true });
  };

  const selectSubcategory = (categoryName: string, subName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset to page 1
    params.set('category', categoryName);
    params.set('subcategory', subName);
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: true });
  };

  return (
    <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.02)] sticky top-28">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center">
              <SlidersHorizontal size={16} />
            </div>
            <h2 className="font-extrabold text-lg text-gray-900 tracking-tight">Filters</h2>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-[#BC8477] hover:text-[#A87569] flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Categories Accordion */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Categories</h3>
              <span className="text-[11px] font-bold text-gray-400">{categories.length}</span>
            </div>

            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
              {categories.map((category) => {
                const isOpen = openCategory === category.name || currentCategory === category.name;
                const isSelected = currentCategory === category.name && !currentSubcategory;
                
                return (
                  <div key={category.id} className="rounded-xl overflow-hidden transition-colors">
                    <button
                      onClick={() => toggleCategory(category.name, category.slug)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all group",
                        isSelected 
                          ? "bg-[#BC8477]/10 text-[#BC8477] font-bold" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span className="truncate">{category.name}</span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200 text-gray-400 shrink-0 ml-1",
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
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="pt-1 pb-2 space-y-1 pl-4 pr-1">
                            {category.children.map((sub) => {
                              const isSubActive = currentSubcategory === sub.name;
                              return (
                                <li key={sub.id}>
                                  <button 
                                    onClick={() => selectSubcategory(category.name, sub.name)}
                                    className={cn(
                                      "text-[11px] py-1.5 px-2.5 rounded-lg w-full text-left transition-all flex items-center justify-between",
                                      isSubActive 
                                        ? "bg-[#BC8477] text-white font-bold shadow-xs" 
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                                    )}
                                  >
                                    <span className="truncate">{sub.name}</span>
                                    {isSubActive && <Check size={12} />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Price Range Presets */}
          <div className="pt-5 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Price Range</h3>
            <div className="space-y-1.5 mb-4">
              {pricePresets.map((preset, idx) => {
                const isActive = minPriceParam === preset.min && maxPriceParam === preset.max;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setMinPrice(preset.min);
                      setMaxPrice(preset.max);
                      applyPriceFilter(preset.min, preset.max);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between",
                      isActive
                        ? "bg-[#BC8477]/10 text-[#BC8477] font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <span>{preset.label}</span>
                    {isActive && <Check size={13} className="text-[#BC8477]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Min / Max inputs */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Custom Range (৳)
              </span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-9 bg-gray-50 rounded-xl px-3 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200 transition-all placeholder-gray-400" 
                />
                <span className="text-gray-400 text-xs">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-9 bg-gray-50 rounded-xl px-3 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200 transition-all placeholder-gray-400" 
                />
              </div>
              <button 
                onClick={() => applyPriceFilter()}
                className="w-full h-9 bg-[#BC8477] hover:bg-[#A87569] text-white text-xs font-bold rounded-xl transition-colors shadow-xs mt-2"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
