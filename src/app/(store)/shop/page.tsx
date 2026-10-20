import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { fetchCategoryTree } from "@/lib/categories";
import { 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Sparkles,
  Layers
} from "lucide-react";

export const revalidate = 60; // Cache SSR route with ISR for sub-70ms response

export const metadata = {
  title: "Shop All Products | Velora - Curated Lifestyle & Fashion",
  description: "Browse our extensive collection of verified lifestyle products with realistic photography, transparent pricing, and fast dispatch.",
};

export default async function ShopPage() {
  const apiUrl = process.env.INTERNAL_API_URL || 'http://127.0.0.1:3000/api/v1';

  const [categories, initialProductsRes] = await Promise.all([
    fetchCategoryTree(),
    fetch(`${apiUrl}/products?page=1&limit=20`, {
      next: { revalidate: 60 },
    }).then(r => r.ok ? r.json() : null).catch(() => null),
  ]);

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar variant="solid" />

      {/* ── Modern Hero Header ── */}
      <section className="bg-[#F7F5EE] pt-28 pb-16 px-6 lg:px-12 rounded-b-[48px] max-w-[1600px] mx-auto border-b border-[#E8E1DE] relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BC8477]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7A915C]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10 text-center sm:text-left">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/80 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 shadow-xs">
            <Link href="/" className="hover:text-[#BC8477] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#BC8477]">Shop Catalog</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Curated Lifestyle <span className="text-[#BC8477]">Catalog</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium max-w-2xl mt-2 leading-relaxed">
                Explore handpicked essentials verified for exceptional durability and design. Filter by department, price, and newest arrivals.
              </p>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="flex items-center gap-4 text-xs font-bold text-gray-600 shrink-0 self-center md:self-auto">
              <div className="flex items-center gap-1.5 bg-white/90 px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-xs">
                <ShieldCheck size={15} className="text-[#BC8477]" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-xs">
                <Truck size={15} className="text-[#BC8477]" />
                <span>Fast Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Catalog Section ── */}
      <section id="products" className="px-6 lg:px-12 max-w-[1600px] mx-auto w-full py-12 scroll-mt-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Sidebar Filters */}
          <Suspense fallback={<div className="w-64 h-96 bg-gray-50 rounded-3xl animate-pulse" />}>
            <ShopSidebar initialCategories={categories} />
          </Suspense>
          
          {/* Product Grid Area */}
          <div className="flex-1 w-full min-w-0">
            <Suspense fallback={
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            }>
              <ProductGrid initialData={initialProductsRes} />
            </Suspense>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
