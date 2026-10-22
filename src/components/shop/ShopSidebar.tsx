'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  X, 
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCategoryTree, CategoryTree } from "@/lib/categories";

export interface FilterValues {
  category?: string;
  subcategory?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

interface ShopSidebarProps {
  initialCategories?: CategoryTree[];
  categoryOverride?: string;
  targetSectionId?: string;
  onFilterChange?: (filters: FilterValues) => void;
  externalFilters?: FilterValues;
}

export function ShopSidebar({ 
  initialCategories, 
  categoryOverride,
  targetSectionId,
  onFilterChange,
  externalFilters
}: ShopSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isHomePage = pathname === '/';

  // Determine active filter values (from props if controlled, else from URL searchParams)
  const currentCategory = externalFilters?.category !== undefined 
    ? externalFilters.category 
    : (categoryOverride || searchParams.get('category') || '');

  const currentSubcategory = externalFilters?.subcategory !== undefined 
    ? externalFilters.subcategory 
    : (searchParams.get('subcategory') || '');

  const currentSort = externalFilters?.sort !== undefined 
    ? externalFilters.sort 
    : (searchParams.get('sort') || '');
  
  const minPriceParam = externalFilters?.minPrice !== undefined 
    ? externalFilters.minPrice 
    : (searchParams.get('min_price') || '');

  const maxPriceParam = externalFilters?.maxPrice !== undefined 
    ? externalFilters.maxPrice 
    : (searchParams.get('max_price') || '');
  
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const [categories, setCategories] = useState<CategoryTree[]>(initialCategories || []);
  const [openCategory, setOpenCategory] = useState<string | null>(currentCategory || null);

  const [showFloatingButton, setShowFloatingButton] = useState(false);

  // Sync state with URL / external params
  useEffect(() => {
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
  }, [minPriceParam, maxPriceParam]);

  useEffect(() => {
    if (currentCategory) {
      setOpenCategory(currentCategory);
    }
  }, [currentCategory]);

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetchCategoryTree().then(setCategories);
    }
  }, [initialCategories]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  // Scroll detection: Strictly show floating button ONLY when the user arrives at the target section
  useEffect(() => {
    const targetId = targetSectionId || (isHomePage ? 'best-selling-products' : 'products');

    let ticking = false;

    const updateVisibility = () => {
      const el = document.getElementById(targetId);
      if (!el) {
        setShowFloatingButton(false);
        return;
      }

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Strictly show ONLY when user has actually arrived at this section:
      // 1. The top of the section has reached the upper region of the screen (<= 220px or 30% of screen height)
      // 2. The bottom of the section has not scrolled past the top of the screen (>= 120px)
      // Before arriving at the section (e.g. at Hero Slider or Features strip), rect.top is > 220px, so it will NOT show.
      const thresholdTop = Math.min(220, windowHeight * 0.3);
      const isArrivedAtSection = rect.top <= thresholdTop && rect.bottom >= 120;
      
      setShowFloatingButton(isArrivedAtSection);
    };

    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    updateVisibility();

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isHomePage, targetSectionId]);

  const activeFilterState: FilterValues = {
    category: currentCategory,
    subcategory: currentSubcategory,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    sort: currentSort,
  };

  const applyPriceFilter = (min?: string, max?: string, closeMobileDrawer = false) => {
    const minVal = min !== undefined ? min : minPrice;
    const maxVal = max !== undefined ? max : maxPrice;

    if (onFilterChange) {
      onFilterChange({
        ...activeFilterState,
        minPrice: minVal,
        maxPrice: maxVal,
      });
      if (closeMobileDrawer) setIsMobileDrawerOpen(false);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (minVal) params.set('min_price', minVal);
    else params.delete('min_price');
    
    if (maxVal) params.set('max_price', maxVal);
    else params.delete('max_price');
    
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: !closeMobileDrawer });
    
    if (closeMobileDrawer) {
      setIsMobileDrawerOpen(false);
    }
  };

  const clearAllFilters = (closeMobileDrawer = false) => {
    setMinPrice('');
    setMaxPrice('');
    setOpenCategory(null);

    if (onFilterChange) {
      onFilterChange({
        category: '',
        subcategory: '',
        minPrice: '',
        maxPrice: '',
        sort: '',
      });
      if (closeMobileDrawer) setIsMobileDrawerOpen(false);
      return;
    }

    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}#products`, { scroll: true });
    if (closeMobileDrawer) {
      setIsMobileDrawerOpen(false);
    }
  };

  const removeSingleFilter = (key: 'category' | 'subcategory' | 'price' | 'sort') => {
    if (onFilterChange) {
      const updated = { ...activeFilterState };
      if (key === 'category') {
        updated.category = '';
        updated.subcategory = '';
        setOpenCategory(null);
      } else if (key === 'subcategory') {
        updated.subcategory = '';
      } else if (key === 'price') {
        updated.minPrice = '';
        updated.maxPrice = '';
        setMinPrice('');
        setMaxPrice('');
      } else if (key === 'sort') {
        updated.sort = '';
      }
      onFilterChange(updated);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (key === 'category') {
      params.delete('category');
      params.delete('subcategory');
      setOpenCategory(null);
    } else if (key === 'subcategory') {
      params.delete('subcategory');
    } else if (key === 'price') {
      params.delete('min_price');
      params.delete('max_price');
      setMinPrice('');
      setMaxPrice('');
    } else if (key === 'sort') {
      params.delete('sort');
    }
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: false });
  };

  const pricePresets = [
    { label: "All Prices", min: "", max: "" },
    { label: "Under ৳1,000", min: "", max: "1000" },
    { label: "৳1,000 – ৳5,000", min: "1000", max: "5000" },
    { label: "৳5,000 – ৳25,000", min: "5000", max: "25000" },
    { label: "৳25,000 – ৳60,000", min: "25000", max: "60000" },
    { label: "৳60,000+", min: "60000", max: "" },
  ];

  const sortOptions = [
    { label: "Featured First", value: "" },
    { label: "Newest Arrivals", value: "created_at:desc" },
    { label: "Price: Low to High", value: "price:asc" },
    { label: "Price: High to Low", value: "price:desc" },
  ];

  const toggleCategory = (name: string, slug: string, isMobile = false) => {
    const nextCat = openCategory === name ? null : name;
    setOpenCategory(nextCat);

    if (onFilterChange) {
      onFilterChange({
        ...activeFilterState,
        category: nextCat || '',
        subcategory: '',
      });
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    params.delete('subcategory');
    if (nextCat) {
      params.set('category', name);
    } else {
      params.delete('category');
    }
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: !isMobile });
  };

  const selectSubcategory = (categoryName: string, subName: string, isMobile = false) => {
    if (onFilterChange) {
      onFilterChange({
        ...activeFilterState,
        category: categoryName,
        subcategory: subName,
      });
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    params.set('category', categoryName);
    params.set('subcategory', subName);
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: !isMobile });
  };

  const setSortOption = (val: string) => {
    if (onFilterChange) {
      onFilterChange({
        ...activeFilterState,
        sort: val,
      });
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (val) {
      params.set('sort', val);
    } else {
      params.delete('sort');
    }
    const targetPath = pathname === '/' ? '/shop' : pathname;
    router.push(`${targetPath}?${params.toString()}#products`, { scroll: false });
  };

  // Calculate active filter count
  let activeFilterCount = 0;
  if (currentCategory && currentCategory !== 'ALL') activeFilterCount++;
  if (currentSubcategory) activeFilterCount++;
  if (minPriceParam || maxPriceParam) activeFilterCount++;
  if (currentSort) activeFilterCount++;

  const hasActiveFilters = Boolean(
    (currentCategory && currentCategory !== 'ALL') || 
    currentSubcategory || 
    minPriceParam || 
    maxPriceParam || 
    currentSort
  );

  return (
    <>
      {/* ─────────────────────────────────────────────────────────── */}
      {/* ── 1. DESKTOP VIEW: Classical Sidebar (hidden on mobile) ── */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
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
                onClick={() => clearAllFilters(false)}
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
                        onClick={() => toggleCategory(category.name, category.slug, false)}
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
                                      onClick={() => selectSubcategory(category.name, sub.name, false)}
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
                        applyPriceFilter(preset.min, preset.max, false);
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
                  onClick={() => applyPriceFilter(undefined, undefined, false)}
                  className="w-full h-9 bg-[#BC8477] hover:bg-[#A87569] text-white text-xs font-bold rounded-xl transition-colors shadow-xs mt-2"
                >
                  Apply Range
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ── 2. MOBILE VIEW: Floating Theme-Matched Filter Button ─── */}
      {/* ─────────────────────────────────────────────────────────── */}
      
      {/* Floating Button (Appears ONLY when scrolled onto the products section) */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden pointer-events-auto"
          >
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-[#BC8477] hover:bg-[#A87569] active:scale-95 text-white font-semibold text-[15px] rounded-xl shadow-[0_8px_25px_rgba(188,132,119,0.45),0_2px_10px_rgba(0,0,0,0.1)] border border-white/20 transition-all cursor-pointer"
            >
              <SlidersHorizontal size={18} className="text-white shrink-0 stroke-[2.2]" />
              <span className="tracking-wide">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-2 py-0.5 bg-white text-[#BC8477] text-xs font-black rounded-full leading-none shadow-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ── 3. MOBILE VIEW: Bottom Sheet Drawer with Project Theme ── */}
      {/* ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Bottom Sheet Panel matching project background */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10 w-full bg-[#FDFCFB] rounded-t-[28px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border-t border-[#E8E1DE]"
            >
              {/* Drag Handle Indicator */}
              <div className="w-12 h-1.5 bg-[#E8E1DE] rounded-full mx-auto my-3 shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4 border-b border-[#E8E1DE]/70 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center">
                    <SlidersHorizontal size={16} className="stroke-[2.2]" />
                  </div>
                  <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#BC8477]/10 text-[#BC8477] text-xs font-bold">
                      {activeFilterCount} active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => clearAllFilters(false)}
                      className="text-xs font-bold text-[#BC8477] hover:text-[#A87569] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#BC8477]/10 transition-colors"
                    >
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 overscroll-contain">
                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Applied Filters
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentCategory && currentCategory !== 'ALL' && (
                        <button
                          type="button"
                          onClick={() => removeSingleFilter('category')}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#BC8477]/10 text-[#BC8477] border border-[#BC8477]/25 hover:bg-[#BC8477]/20 transition-colors"
                        >
                          <span>{currentCategory}</span>
                          <X size={12} />
                        </button>
                      )}
                      {currentSubcategory && (
                        <button
                          type="button"
                          onClick={() => removeSingleFilter('subcategory')}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#BC8477]/10 text-[#BC8477] border border-[#BC8477]/25 hover:bg-[#BC8477]/20 transition-colors"
                        >
                          <span>{currentSubcategory}</span>
                          <X size={12} />
                        </button>
                      )}
                      {(minPriceParam || maxPriceParam) && (
                        <button
                          type="button"
                          onClick={() => removeSingleFilter('price')}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#BC8477]/10 text-[#BC8477] border border-[#BC8477]/25 hover:bg-[#BC8477]/20 transition-colors"
                        >
                          <span>৳{minPriceParam || '0'} – ৳{maxPriceParam || '∞'}</span>
                          <X size={12} />
                        </button>
                      )}
                      {currentSort && (
                        <button
                          type="button"
                          onClick={() => removeSingleFilter('sort')}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#BC8477]/10 text-[#BC8477] border border-[#BC8477]/25 hover:bg-[#BC8477]/20 transition-colors"
                        >
                          <span>Sort: {sortOptions.find(s => s.value === currentSort)?.label || currentSort}</span>
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Categories
                    </h3>
                    <span className="text-[11px] font-bold text-gray-400">{categories.length}</span>
                  </div>

                  <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                    {categories.map((category) => {
                      const isOpen = openCategory === category.name || currentCategory === category.name;
                      const isSelected = currentCategory === category.name && !currentSubcategory;
                      
                      return (
                        <div key={category.id} className="rounded-xl border border-gray-100 overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => toggleCategory(category.name, category.slug, true)}
                            className={cn(
                              "w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold transition-all",
                              isSelected 
                                ? "bg-[#BC8477]/10 text-[#BC8477] font-bold" 
                                : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <span className="truncate">{category.name}</span>
                            <ChevronDown
                              size={15}
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
                                className="overflow-hidden bg-[#F9F7F6] border-t border-gray-100"
                              >
                                <ul className="p-2 space-y-1">
                                  {category.children.map((sub) => {
                                    const isSubActive = currentSubcategory === sub.name;
                                    return (
                                      <li key={sub.id}>
                                        <button 
                                          type="button"
                                          onClick={() => selectSubcategory(category.name, sub.name, true)}
                                          className={cn(
                                            "text-[12px] py-2 px-3 rounded-lg w-full text-left transition-all flex items-center justify-between",
                                            isSubActive 
                                              ? "bg-[#BC8477] text-white font-bold shadow-xs" 
                                              : "text-gray-600 hover:bg-white font-medium"
                                          )}
                                        >
                                          <span className="truncate">{sub.name}</span>
                                          {isSubActive && <Check size={14} />}
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

                {/* Price Range */}
                <div className="pt-4 border-t border-[#E8E1DE]/70">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Price Range
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {pricePresets.map((preset, idx) => {
                      const isActive = minPriceParam === preset.min && maxPriceParam === preset.max;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setMinPrice(preset.min);
                            setMaxPrice(preset.max);
                            applyPriceFilter(preset.min, preset.max, false);
                          }}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between",
                            isActive
                              ? "bg-[#BC8477]/10 text-[#BC8477] border-[#BC8477]/40 font-bold"
                              : "bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <span className="truncate">{preset.label}</span>
                          {isActive && <Check size={13} className="text-[#BC8477] shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Min / Max inputs */}
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                      Custom Range (৳)
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">৳</span>
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full h-10 bg-[#F9F7F6] rounded-xl pl-7 pr-3 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200 transition-all placeholder-gray-400" 
                        />
                      </div>
                      <span className="text-gray-400 text-xs font-bold">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">৳</span>
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full h-10 bg-[#F9F7F6] rounded-xl pl-7 pr-3 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-gray-200 transition-all placeholder-gray-400" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sort By Options */}
                <div className="pt-4 border-t border-[#E8E1DE]/70">
                  <div className="flex items-center gap-1.5 mb-3">
                    <ArrowUpDown size={13} className="text-gray-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Sort Products By
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map((opt) => {
                      const isSelected = currentSort === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSortOption(opt.value)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between",
                            isSelected
                              ? "bg-[#BC8477]/10 text-[#BC8477] border-[#BC8477]/40 font-bold"
                              : "bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && <Check size={13} className="text-[#BC8477] shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky Footer inside Drawer */}
              <div className="p-4 bg-white border-t border-[#E8E1DE] flex items-center gap-3 shrink-0">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => clearAllFilters(true)}
                    className="w-1/3 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    applyPriceFilter(minPrice, maxPrice, true);
                    const targetId = targetSectionId || (isHomePage ? 'best-selling-products' : 'products');
                    if (typeof window !== 'undefined') {
                      const el = document.getElementById(targetId);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 py-3 bg-[#BC8477] hover:bg-[#A87569] active:scale-[0.99] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-[#BC8477]/30 flex items-center justify-center gap-2"
                >
                  <span>Apply Filters</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
