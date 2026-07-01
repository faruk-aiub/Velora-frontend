import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CATEGORIES, generateCategorySlug } from "@/lib/categories";

export const metadata = {
  title: "All Categories | Velora",
  description: "Browse all product categories on Velora",
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-[#F7F5EE] py-20 px-6 lg:px-12 text-center rounded-b-[40px] max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          All Categories
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
          Explore our wide range of products across various categories to find exactly what you are looking for.
        </p>
      </section>

      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {CATEGORIES.map((cat, i) => (
            <Link 
              key={i} 
              href={`/category/${generateCategorySlug(cat.name)}`} 
              className="flex flex-col items-center gap-4 group"
            >
              <div className={`w-full aspect-square rounded-3xl ${cat.color} flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                <Image 
                  src={`https://picsum.photos/seed/${cat.img}/300/300`} 
                  alt={cat.name} 
                  fill 
                  className="object-cover mix-blend-multiply opacity-80" 
                />
              </div>
              <span className="font-bold text-gray-900 text-sm text-center group-hover:text-[#7A915C] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
