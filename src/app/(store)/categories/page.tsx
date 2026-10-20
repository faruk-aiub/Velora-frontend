import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchCategoryTree } from "@/lib/categories";
import { CategoriesExplorer } from "@/components/categories/CategoriesExplorer";
import { ChevronRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export const metadata = {
  title: "All Categories | Velora - Curated Lifestyle & Essentials",
  description: "Browse all curated product categories on Velora with verified authenticity, realistic imagery, and modern collections.",
};

export const revalidate = 60; // Cache page with ISR for fast sub-100ms response

export default async function CategoriesPage() {
  const categories = await fetchCategoryTree();

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar variant="solid" />

      {/* Hero Section */}
      <section className="bg-[#F7F5EE] pt-28 pb-20 px-6 lg:px-12 text-center rounded-b-[48px] max-w-[1600px] mx-auto relative overflow-hidden border-b border-[#E8E1DE]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BC8477]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7A915C]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/80 text-gray-500 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Link href="/" className="hover:text-[#BC8477] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#BC8477]">Categories</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
            Curated Collections <br className="hidden sm:block" />
            <span className="text-[#BC8477]">For Modern Everyday Life</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Discover our meticulously organized departments. From cutting-edge electronics to tailored fashion and artisan home essentials, everything is verified for exceptional durability and design.
          </p>

          {/* Quick Trust Badges Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-200/60 text-xs font-bold text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#BC8477]" />
              <span>100% Authentic Quality</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-[#BC8477]" />
              <span>Express Regional Delivery</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-[#BC8477]" />
              <span>7-Day Return Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Explorer Component */}
      <main className="py-8">
        <CategoriesExplorer categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
