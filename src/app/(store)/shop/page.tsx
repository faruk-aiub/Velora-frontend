import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Suspense } from "react";

export const metadata = {
  title: "Shop All | Velora",
  description: "Browse our extensive collection of premium lifestyle products.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar variant="solid" />

      {/* ── Page Header ── */}
      <div className="w-full bg-[#E8E1DE] py-16 px-6 lg:px-12 text-center">
        <h1 className="font-serif text-5xl text-[#3A3331] font-light mb-4">Shop</h1>
        <p className="text-[#7A7371] text-sm tracking-wide">
          <span className="hover:text-[#BC8477] cursor-pointer transition-colors">Home</span>
          <span className="mx-2">/</span>
          <span className="text-[#3A3331]">All Products</span>
        </p>
      </div>

      {/* ── Main Content Area ── */}
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 lg:px-12 py-16 flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        <Suspense fallback={<div>Loading filters...</div>}>
          <ShopSidebar />
        </Suspense>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
