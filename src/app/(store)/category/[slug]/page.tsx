import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { getCategoryNameFromSlug } from "@/lib/categories";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = await getCategoryNameFromSlug(resolvedParams.slug);
  return {
    title: `${categoryName} | Velora`,
    description: `Shop our wide selection of ${categoryName}.`
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryName = await getCategoryNameFromSlug(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar variant="solid" />

      {/* ── Premium Light Category Header ── */}
      <section className="bg-[#F7F5EE] pt-24 pb-28 px-6 lg:px-12 text-center rounded-b-[3rem] max-w-[1600px] mx-auto relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#BC8477]/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#7A915C]/10 rounded-full blur-3xl translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto mt-8">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-[#BC8477] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/categories" className="hover:text-[#BC8477] transition-colors">Categories</Link>
            <ChevronRight size={12} />
            <span className="text-[#BC8477]">{categoryName}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            {categoryName}
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Discover our exclusive collection of {categoryName}. Impeccable quality and modern design curated just for you.
          </p>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <section id="products" className="px-6 lg:px-12 max-w-[1600px] mx-auto w-full pb-24 -mt-12 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-sm p-8 lg:p-12 border border-gray-100 flex flex-col lg:flex-row gap-12 lg:gap-16">
          <Suspense fallback={<div className="hidden lg:block w-64 animate-pulse bg-[#F9FAFB] rounded-2xl h-[500px]"></div>}>
            <ShopSidebar categoryOverride={categoryName} />
          </Suspense>
          
          <div className="flex-1 w-full">
            <Suspense fallback={
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-[#F9FAFB] animate-pulse rounded-3xl"></div>)}
              </div>
            }>
              <ProductGrid categoryOverride={categoryName} />
            </Suspense>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
