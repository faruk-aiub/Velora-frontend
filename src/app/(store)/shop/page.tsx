import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, ShieldCheck, RefreshCw, Headset, Star, Filter } from "lucide-react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopSidebar } from "@/components/shop/ShopSidebar";

import { fetchCategoryTree } from "@/lib/categories";

export const revalidate = 60; // Cache SSR route for 60 seconds

export const metadata = {
  title: "Shop All | Velora",
  description: "Browse our extensive collection of premium lifestyle products.",
};

const COLORS = ['bg-[#E8F0FA]', 'bg-[#FBEBEB]', 'bg-[#F4EAFC]', 'bg-[#FCF5EA]', 'bg-[#F5F5F5]', 'bg-[#EBF5EE]'];

export default async function ShopPage() {
  const categories = await fetchCategoryTree();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Page Header ── */}
      <section className="bg-[#F9FAFB] pt-32 pb-12 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Shop All Products</h1>
          <p className="text-gray-600 max-w-2xl">Browse our extensive collection of premium products. Find exactly what you're looking for with our filters.</p>
        </div>
      </section>

      {/* ── Main Content Area (Product Grid Full Width) ── */}
      <section id="products" className="px-6 lg:px-12 max-w-[1600px] mx-auto w-full pb-24 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Best Selling Products</h2>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-sm font-bold text-gray-900 hover:text-[#BC8477] transition-colors flex items-center hidden sm:flex">
              View All Products <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ShopSidebar />
          </Suspense>
          
          <div className="flex-1 w-full">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
