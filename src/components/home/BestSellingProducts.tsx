"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import axios from "@/lib/axios";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";
import { ShopSidebar, FilterValues } from "@/components/shop/ShopSidebar";
import { X, RotateCcw } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BestSellingProductsProps {
  initialProducts?: Record<string, unknown>[];
  initialCategories?: any[];
}

export function BestSellingProducts({
  initialProducts = [],
  initialCategories = [],
}: BestSellingProductsProps) {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (initialCategories && initialCategories.length > 0) {
      const rootCats = initialCategories.filter((c: any) => !c.parent_id);
      return rootCats.slice(0, 6);
    }
    return [];
  });
  
  const [activeCategoryId, setActiveCategoryId] = useState<string>("ALL");
  const [products, setProducts] = useState<Record<string, unknown>[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);
  const isFirstMount = useRef(true);

  // Filter state for in-place filtering on BestSellingProducts
  const [filterValues, setFilterValues] = useState<FilterValues>({
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
  });

  // Fetch categories only if not passed from server
  useEffect(() => {
    if (categories.length > 0) return;
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        const fetchedCats = res.data.data || res.data;
        const rootCats = fetchedCats.filter((c: any) => !c.parent_id);
        setCategories(rootCats.slice(0, 6)); 
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [categories.length]);

  // Fetch products based on selected category, subcategory, price range, and sort
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      const hasExtraFilters = filterValues.subcategory || filterValues.minPrice || filterValues.maxPrice || filterValues.sort;
      if (initialProducts.length > 0 && activeCategoryId === "ALL" && !hasExtraFilters) {
        return;
      }
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string | number> = { limit: 10 };

        // Category precedence: subcategory > filterValues.category > activeCategoryId
        const cat = filterValues.subcategory || filterValues.category || (activeCategoryId !== "ALL" ? activeCategoryId : undefined);
        if (cat && cat !== "ALL") {
          params.category_id = cat;
        }

        // Price range
        if (filterValues.minPrice) {
          params.min_price = Number(filterValues.minPrice);
        }
        if (filterValues.maxPrice) {
          params.max_price = Number(filterValues.maxPrice);
        }

        // Sort
        if (filterValues.sort) {
          params.sort = filterValues.sort;
        }

        const res = await axios.get("/products", { params });
        const fetched = res.data.data || res.data || [];
        setProducts(fetched);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeCategoryId, filterValues]);

  const handleTabClick = (catId: string, catName?: string) => {
    setActiveCategoryId(catId);
    setFilterValues((prev) => ({
      ...prev,
      category: catId === "ALL" ? "" : (catName || catId),
      subcategory: "",
    }));
  };

  const removeFilterBadge = (key: 'category' | 'subcategory' | 'price' | 'sort') => {
    setFilterValues((prev) => {
      const next = { ...prev };
      if (key === 'category') {
        next.category = '';
        next.subcategory = '';
        setActiveCategoryId("ALL");
      } else if (key === 'subcategory') {
        next.subcategory = '';
      } else if (key === 'price') {
        next.minPrice = '';
        next.maxPrice = '';
      } else if (key === 'sort') {
        next.sort = '';
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setActiveCategoryId("ALL");
    setFilterValues({
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
    });
  };

  const hasActiveFilters = Boolean(
    (filterValues.category && filterValues.category !== 'ALL') || 
    filterValues.subcategory || 
    filterValues.minPrice || 
    filterValues.maxPrice || 
    filterValues.sort
  );

  return (
    <section 
      id="best-selling-products" 
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1600px] mx-auto w-full scroll-mt-24 relative"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative">
        <Suspense fallback={<div className="hidden lg:block w-64 h-96 bg-gray-50 rounded-3xl animate-pulse" />}>
          <ShopSidebar 
            initialCategories={initialCategories}
            targetSectionId="best-selling-products"
            onFilterChange={(newFilters) => {
              setFilterValues(newFilters);
              if (!newFilters.category || newFilters.category === 'ALL') {
                setActiveCategoryId("ALL");
              } else {
                const matched = categories.find(c => c.name === newFilters.category || c.id === newFilters.category);
                if (matched) setActiveCategoryId(matched.id);
                else setActiveCategoryId(newFilters.category);
              }
            }}
            externalFilters={filterValues}
          />
        </Suspense>
        
        <div className="flex-1 w-full min-w-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Best Selling Products</h2>
        
            {/* Horizontal Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar snap-x">
              <button
                type="button"
                onClick={() => handleTabClick("ALL")}
                className={cn(
                  "px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all snap-center",
                  activeCategoryId === "ALL" && !filterValues.subcategory
                    ? "bg-[#BC8477] text-white shadow-md shadow-[#BC8477]/30" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                All
              </button>
              
              {categories.map((cat) => {
                const isActive = (activeCategoryId === cat.id || filterValues.category === cat.name) && !filterValues.subcategory;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleTabClick(cat.id, cat.name)}
                    className={cn(
                      "px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all snap-center",
                      isActive
                        ? "bg-[#BC8477] text-white shadow-md shadow-[#BC8477]/30" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Badges Strip for BestSellingProducts */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-[#F9F7F6] border border-[#E8E1DE]/60">
              <span className="text-xs font-bold text-gray-500 mr-1">Active Filters:</span>
              
              {filterValues.category && filterValues.category !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => removeFilterBadge('category')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#BC8477] border border-[#BC8477]/30 hover:border-red-300 hover:text-red-500 transition-colors shadow-xs"
                >
                  <span>{filterValues.category}</span>
                  <X size={12} />
                </button>
              )}

              {filterValues.subcategory && (
                <button
                  type="button"
                  onClick={() => removeFilterBadge('subcategory')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#BC8477] border border-[#BC8477]/30 hover:border-red-300 hover:text-red-500 transition-colors shadow-xs"
                >
                  <span>Sub: {filterValues.subcategory}</span>
                  <X size={12} />
                </button>
              )}

              {(filterValues.minPrice || filterValues.maxPrice) && (
                <button
                  type="button"
                  onClick={() => removeFilterBadge('price')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#BC8477] border border-[#BC8477]/30 hover:border-red-300 hover:text-red-500 transition-colors shadow-xs"
                >
                  <span>৳{filterValues.minPrice || '0'} – ৳{filterValues.maxPrice || '∞'}</span>
                  <X size={12} />
                </button>
              )}

              {filterValues.sort && (
                <button
                  type="button"
                  onClick={() => removeFilterBadge('sort')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#BC8477] border border-[#BC8477]/30 hover:border-red-300 hover:text-red-500 transition-colors shadow-xs"
                >
                  <span>Sort: {filterValues.sort}</span>
                  <X size={12} />
                </button>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#BC8477] hover:text-[#A87569] flex items-center gap-1 ml-auto px-2 py-1 rounded-lg hover:bg-white/80 transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="animate-pulse bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-gray-100">
                  <div className="bg-gray-200 rounded-lg sm:rounded-xl aspect-square mb-2.5"></div>
                  <div className="h-2.5 bg-gray-200 rounded-full w-1/3 mb-1.5"></div>
                  <div className="h-3.5 bg-gray-200 rounded-full w-3/4 mb-1.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id as string} {...(product as unknown as React.ComponentProps<typeof ProductCard>)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#F9F7F6] rounded-2xl border border-[#E8E1DE]/60 px-4">
              <p className="text-gray-700 font-semibold mb-1">No products found matching these filters.</p>
              <p className="text-gray-500 text-xs mb-4">Try broadening your price range or selecting another category.</p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#BC8477] hover:bg-[#A87569] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
