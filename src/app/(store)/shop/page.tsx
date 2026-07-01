import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, ShieldCheck, RefreshCw, Headset, Star, Filter } from "lucide-react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopSidebar } from "@/components/shop/ShopSidebar";

export const metadata = {
  title: "Shop All | Velora",
  description: "Browse our extensive collection of premium lifestyle products.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[1600px] mx-auto bg-[#F7F5EE] rounded-b-[40px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF0E2]">
              <span className="w-2 h-2 rounded-full bg-[#7A915C]"></span>
              <span className="text-[10px] font-bold text-[#7A915C] uppercase tracking-wider">New Arrivals</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Discover The Best Products for You
            </h1>
            
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-medium">
              Explore our wide range of high-quality products at affordable prices. Shop now and enjoy the best deals!
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <Link 
                href="/shop"
                className="bg-[#7A915C] text-white px-8 py-4 rounded-full font-bold shadow-md hover:bg-[#687C4D] transition-all flex items-center gap-2"
              >
                Shop Now <span className="ml-1">→</span>
              </Link>
              <Link 
                href="/shop?deals=true"
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
              >
                Explore Deals
              </Link>
            </div>
            
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#F7F5EE] bg-gray-200 overflow-hidden relative">
                    <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Customer" fill sizes="40px" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-500">
                Trusted by <span className="font-bold text-gray-900">10,000+</span> Happy Customers
              </p>
            </div>
          </div>
          
          <div className="relative h-[400px] lg:h-[600px] w-full hidden md:block">
            <Image
              src="https://picsum.photos/seed/hero-commerce/1000/1000"
              alt="Hero Products"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl z-10"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 -mt-10 relative z-20">
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
            { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment" },
            { icon: RefreshCw, title: "Easy Returns", desc: "30 days return policy" },
            { icon: Headset, title: "24/7 Support", desc: "Dedicated support" }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F3F6EF] flex items-center justify-center text-[#7A915C]">
                <feature.icon size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-[13px]">{feature.title}</h3>
                <p className="text-[11px] text-gray-500 font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shop by Categories ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Shop by Categories</h2>
          <Link href="/categories" className="text-[13px] font-bold text-gray-900 hover:text-[#7A915C] transition-colors flex items-center">
            View All Categories <span className="ml-1">→</span>
          </Link>
        </div>
        
        <div className="flex overflow-x-auto pb-8 gap-8 snap-x hide-scrollbar">
          {[
            { name: "Electronics", color: "bg-[#E8F0FA]", img: "headphone" },
            { name: "Fashion", color: "bg-[#FBEBEB]", img: "tshirt" },
            { name: "Home & Kitchen", color: "bg-[#FCF5EA]", img: "sofa" },
            { name: "Beauty", color: "bg-[#F4EAFC]", img: "cosmetic" },
            { name: "Sports", color: "bg-[#EAF6F5]", img: "shoe" },
            { name: "Accessories", color: "bg-[#FDF4E5]", img: "watch" }
          ].map((cat, i) => (
            <Link key={i} href={`/category/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/'/g, '')}`} className="flex flex-col items-center gap-4 snap-center shrink-0 group">
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${cat.color} flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
                <Image src={`https://picsum.photos/seed/${cat.img}/300/300`} alt={cat.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover mix-blend-multiply opacity-80" />
              </div>
              <span className="font-bold text-gray-900 text-[13px]">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Main Content Area (Product Grid Full Width) ── */}
      <section className="px-6 lg:px-12 max-w-[1600px] mx-auto w-full pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Best Selling Products</h2>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-[13px] font-bold text-gray-900 hover:text-[#7A915C] transition-colors flex items-center hidden sm:flex">
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

      {/* ── Special Offer ── */}
      <section className="pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="bg-[#F7F5EE] rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center justify-between p-12 lg:p-16 relative">
          <div className="max-w-xl space-y-6 z-10">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Special Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Up to 50% Off</h2>
            <p className="text-gray-500 text-[15px] font-medium leading-relaxed max-w-sm">
              Limited time offer on selected items. Hurry up and grab the best deals!
            </p>
            <Link href="/shop?sale=true" className="inline-flex bg-[#7A915C] text-white px-8 py-4 rounded-lg text-sm font-bold hover:bg-[#687C4D] transition-colors mt-2 items-center gap-2">
              Shop the Sale <span className="ml-1">→</span>
            </Link>
          </div>
          <div className="w-full md:w-[45%] h-[300px] md:h-[350px] relative mt-12 md:mt-0">
             <Image src="https://picsum.photos/seed/bags/800/800" alt="Special Offer" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto text-center">
        <h2 className="text-[28px] font-bold text-gray-900 tracking-tight mb-12">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "John D.", text: "Amazing products and fast delivery! ShopMate is my go-to store for all my needs." },
            { name: "Sarah M.", text: "Great quality at affordable prices. The customer support is also very responsive." },
            { name: "Michael T.", text: "Very happy with my purchase. Highly recommend ShopMate to everyone!" }
          ].map((review, i) => (
            <div key={i} className="bg-[#F9FAF9] rounded-[24px] p-8 text-left relative flex flex-col">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EAF0E2] text-[#7A915C] mb-6 font-serif text-2xl pt-2 opacity-80">
                "
              </div>
              <p className="text-gray-600 text-[13px] font-medium leading-relaxed mb-8 flex-grow">
                {review.text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                   <Image src={`https://i.pravatar.cc/100?img=${i+40}`} alt={review.name} fill sizes="40px" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">{review.name}</h4>
                  <div className="flex text-[#EAB308] mt-1 gap-[2px]">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
