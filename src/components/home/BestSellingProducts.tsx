"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import axios from "@/lib/axios";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";
import { ShopSidebar } from "@/components/shop/ShopSidebar";

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

  // Fetch products based on selected category (skipping initial fetch if server provided them)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (initialProducts.length > 0 && activeCategoryId === "ALL") {
        return;
      }
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const url = activeCategoryId === "ALL" 
          ? "/products?limit=10" 
          : `/products?category_id=${activeCategoryId}&limit=10`;
          
        const res = await axios.get(url);
        setProducts(res.data.data || res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeCategoryId]);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative">
        <Suspense fallback={<div>Loading filters...</div>}>
          <ShopSidebar initialCategories={initialCategories} />
        </Suspense>
        
        <div className="flex-1 w-full min-w-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Best Selling Products</h2>
        
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar snap-x">
          <button
            onClick={() => setActiveCategoryId("ALL")}
            className={cn(
              "px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all snap-center",
              activeCategoryId === "ALL" 
                ? "bg-gray-900 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            All
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={cn(
                "px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all snap-center",
                activeCategoryId === cat.id
                  ? "bg-gray-900 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
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
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 font-medium">No products found in this category.</p>
        </div>
      )}
        </div>
      </div>
    </section>
  );
}
