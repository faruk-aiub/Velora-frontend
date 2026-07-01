import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, ShieldCheck, RefreshCw, Headset, Star } from "lucide-react";
import { BestSellingProducts } from "@/components/home/BestSellingProducts";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="solid" />

      {/* ── Hero Section ── */}
      <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[1600px] mx-auto bg-[#F9FAFB] rounded-b-[40px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#BC8477]"></span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">New Arrivals</span>
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
                className="bg-[#BC8477] text-white px-8 py-4 rounded-full font-bold shadow-md hover:bg-[#A87569] transition-all flex items-center gap-2"
              >
                Shop Now <span className="ml-1">→</span>
              </Link>
              <Link 
                href="/shop?deals=true"
                className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all"
              >
                Explore Deals
              </Link>
            </div>
            
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
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
            {/* You can replace this placeholder with an actual hero image like the headphones/backpack combo */}
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
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
            { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment" },
            { icon: RefreshCw, title: "Easy Returns", desc: "30 days return policy" },
            { icon: Headset, title: "24/7 Support", desc: "Dedicated support" }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#BC8477]">
                <feature.icon size={24} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500 font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shop by Categories ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Shop by Categories</h2>
          <Link href="/categories" className="text-sm font-bold text-gray-900 hover:text-[#BC8477] transition-colors flex items-center">
            View All Categories <span className="ml-1">→</span>
          </Link>
        </div>
        
        <div className="flex overflow-x-auto pb-8 gap-8 snap-x hide-scrollbar">
          {[
            { name: "Electronics", color: "bg-blue-50", img: "headphone" },
            { name: "Fashion", color: "bg-pink-50", img: "tshirt" },
            { name: "Home & Kitchen", color: "bg-orange-50", img: "sofa" },
            { name: "Beauty", color: "bg-purple-50", img: "cosmetic" },
            { name: "Sports", color: "bg-teal-50", img: "shoe" },
            { name: "Accessories", color: "bg-yellow-50", img: "watch" }
          ].map((cat, i) => (
            <Link key={i} href={`/category/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/'/g, '')}`} className="flex flex-col items-center gap-4 snap-center shrink-0 group">
              <div className={`w-40 h-40 rounded-full ${cat.color} flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
                <Image src={`https://picsum.photos/seed/${cat.img}/300/300`} alt={cat.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover mix-blend-multiply" />
              </div>
              <span className="font-bold text-gray-900 text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <BestSellingProducts />

      {/* ── Special Offer ── */}
      <section className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="bg-[#F9FAFB] rounded-[40px] overflow-hidden flex flex-col md:flex-row items-center justify-between p-12 lg:p-20 relative">
          <div className="max-w-xl space-y-6 z-10">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Special Offer</span>
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">Up to 50% Off</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Limited time offer on selected items. Hurry up and grab the best deals before they are gone!
            </p>
            <Link href="/shop?sale=true" className="inline-block bg-[#BC8477] text-white px-8 py-4 rounded-full font-bold shadow-md hover:bg-[#A87569] transition-colors mt-4">
              Shop the Sale →
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-[300px] md:h-[400px] relative mt-12 md:mt-0">
             <Image src="https://picsum.photos/seed/bags/800/800" alt="Special Offer" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-16">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "John D.", text: "Amazing products and fast delivery! Velora is my go-to store for all my needs." },
            { name: "Sarah M.", text: "Great quality at affordable prices. The customer support is also very responsive." },
            { name: "Michael T.", text: "Very happy with my purchase. Highly recommend Velora to everyone!" }
          ].map((review, i) => (
            <div key={i} className="bg-[#F9FAFB] rounded-3xl p-8 text-left relative">
              <div className="text-[#BC8477] font-serif text-6xl absolute top-6 left-6 opacity-20">"</div>
              <p className="text-gray-900 font-medium leading-relaxed mb-8 relative z-10 pt-4">
                {review.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative">
                   <Image src={`https://i.pravatar.cc/100?img=${i+40}`} alt={review.name} fill sizes="48px" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <div className="flex text-yellow-400 mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
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
