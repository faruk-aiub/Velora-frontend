import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchCategoryTree } from "@/lib/categories";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "All Categories | Velora",
  description: "Browse all product categories on Velora",
};

const COLORS = ['bg-[#E8F0FA]', 'bg-[#FBEBEB]', 'bg-[#F4EAFC]', 'bg-[#FCF5EA]', 'bg-[#F5F5F5]', 'bg-[#EBF5EE]'];

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await fetchCategoryTree();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar variant="solid" />

      {/* Hero Section */}
      <section className="bg-[#F7F5EE] pt-24 pb-32 px-6 lg:px-12 text-center rounded-b-[3rem] max-w-[1600px] mx-auto relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BC8477]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7A915C]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-3xl mx-auto mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-[#BC8477] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#BC8477]">Categories</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Curated Collections
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Explore our thoughtfully organized categories. Discover premium products tailored perfectly for your lifestyle and needs.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto relative -mt-16 z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 justify-items-center">
          {categories.map((cat, i) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`} 
              className="group flex flex-col items-center text-center transition-all duration-300 w-full max-w-[160px]"
            >
              <div className={`w-full aspect-square rounded-full ${COLORS[i % COLORS.length]} mb-5 relative overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-4 border-white group-hover:shadow-[0_8px_30px_rgb(188,132,119,0.15)] group-hover:border-[#F7F5EE] transition-all duration-500 group-hover:-translate-y-2`}>
                <Image 
                  src={cat.image_url || `https://picsum.photos/seed/${cat.slug}/300/300`} 
                  alt={cat.name} 
                  fill 
                  className="object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700 p-2" 
                />
              </div>
              <h3 className="font-bold text-sm md:text-[15px] text-gray-900 group-hover:text-[#BC8477] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-1.5 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
