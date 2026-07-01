"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function BestSellingProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("ALL");
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        // Assuming the response data array is in res.data.data
        const fetchedCats = res.data.data || res.data;
        // Limit to 5 or 6 categories for the filter UI to not overflow
        setCategories(fetchedCats.slice(0, 6)); 
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const url = activeCategoryId === "ALL" 
          ? "/products?limit=8" 
          : `/products?categoryId=${activeCategoryId}&limit=8`;
          
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
    <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Best Selling Products</h2>
        
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar snap-x">
          <button
            onClick={() => setActiveCategoryId("ALL")}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all snap-center",
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
                "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all snap-center",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-[32px] aspect-[4/5] mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id as string} {...(product as unknown as React.ComponentProps<typeof ProductCard>)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[32px]">
          <p className="text-gray-500 font-medium">No products found in this category.</p>
        </div>
      )}
    </section>
  );
}
