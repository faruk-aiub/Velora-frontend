import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { getCategoryNameFromSlug } from "@/lib/categories";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = getCategoryNameFromSlug(resolvedParams.slug);
  return {
    title: `${categoryName} | Velora`,
    description: `Shop our wide selection of ${categoryName}.`
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryName = getCategoryNameFromSlug(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Category Header ── */}
      <section className="bg-[#F7F5EE] pt-32 pb-16 px-6 lg:px-12 text-center rounded-b-[40px] max-w-[1600px] mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          {categoryName}
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
          Explore our wide range of products in the {categoryName} category.
        </p>
      </section>

      {/* ── Main Content Area (Product Grid Full Width) ── */}
      <section className="px-6 lg:px-12 max-w-[1600px] mx-auto w-full pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ShopSidebar categoryOverride={categoryName} />
          </Suspense>
          
          <div className="flex-1 w-full">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid categoryOverride={categoryName} />
            </Suspense>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
