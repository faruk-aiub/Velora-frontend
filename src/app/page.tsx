import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar variant="transparent" />

      {/* ── Hero Section ── */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#E8E1DE]">
        {/* User's Reference Image goes here */}
        <Image
          src="/home-hero.png"
          alt="Premium E-commerce Marketplace"
          fill
          priority
          className="object-cover object-center scale-105 animate-in fade-in zoom-in duration-1000"
        />
        
        {/* Gradient Overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 mix-blend-multiply opacity-80" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-16">
          <span className="text-[#BC8477] text-[10px] font-bold tracking-[0.3em] uppercase mb-6 block drop-shadow-md">
            The Ultimate Marketplace
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[1.1] mb-6 drop-shadow-sm">
            Everything You Need. <br />
            <span className="italic text-[#E8E1DE]">Elevated.</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-sans font-light tracking-wide max-w-xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
            Discover a curated collection of premium lifestyle products, fashion, and everyday essentials, all in one elegant destination.
          </p>
          <Link 
            href="/shop"
            className="h-14 px-10 bg-[#BC8477] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#9A6B60] transition-all duration-300 flex items-center justify-center w-fit mx-auto shadow-xl hover:shadow-2xl"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-[#3A3331] font-light mb-4">
            Shop by <span className="italic text-[#BC8477]">Category</span>
          </h2>
          <div className="w-12 h-[1px] bg-[#BC8477] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Fashion & Clothing', slug: 'fashion-clothing', imageQuery: 'fashion', colSpan: false },
            { name: 'Electronics & Gadgets', slug: 'electronics-gadgets', imageQuery: 'electronics', colSpan: false },
            { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', imageQuery: 'beauty', colSpan: false },
            { name: 'Home & Living', slug: 'home-living', imageQuery: 'interior-design', colSpan: false },
            { name: 'Kitchen & Appliances', slug: 'kitchen-appliances', imageQuery: 'kitchen', colSpan: false },
            { name: 'Sports & Fitness', slug: 'sports-fitness', imageQuery: 'fitness', colSpan: false }
          ].map((cat, i) => (
            <Link 
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.slug)}`} 
              className={`group relative h-[450px] overflow-hidden bg-[#E8E1DE] ${cat.colSpan ? 'md:col-span-2' : ''}`}
            >
              <Image
                src={`https://loremflickr.com/800/1000/${cat.imageQuery}?random=${i + 20}`}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:via-black/30 transition-colors z-10" />
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col items-center text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-serif text-3xl font-light tracking-wide mb-2">
                  {cat.name}
                </h3>
                <span className="text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Explore Now
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Link 
            href="/shop"
            className="h-12 px-8 border border-[#BC8477] text-[#BC8477] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477] hover:text-white transition-colors flex items-center justify-center"
          >
            View All Categories
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
