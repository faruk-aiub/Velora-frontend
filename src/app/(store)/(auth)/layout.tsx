'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Truck, ShieldCheck, Tag, ShoppingBag, Smartphone, Shirt, Home, Sparkles, Gamepad2 } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={`min-h-screen flex w-full relative bg-[#F8F5F1] overflow-hidden ${plusJakarta.variable}`} style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
      {/* Background Arch Shape */}
      <div className="absolute top-0 left-0 w-full lg:w-[50%] h-full bg-white rounded-tr-[250px] rounded-br-[150px] z-0" />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between p-6 lg:p-12 gap-8 h-full min-h-screen">
        
        {/* ── Left Content Panel ── */}
        <div className="flex-1 w-full h-full flex flex-col justify-between pt-4 lg:pt-8 pb-4">
          
          {/* Header */}
          <div>
            <Link href="/" className="flex flex-col w-fit group mb-2">
              <div className="flex items-center gap-1.5 mb-1 text-gray-900">
                <ShoppingBag size={24} strokeWidth={2} />
              </div>
              <span className="tracking-[0.1em] text-gray-900 text-[22px] uppercase font-bold leading-none">VELORA</span>
            </Link>
            <p className="text-[13px] text-gray-500 font-medium">Everything you need, in one place.</p>
          </div>

          {/* Middle Section: Text/Features on Left, Image on Right */}
          <div className="flex flex-col xl:flex-row items-center w-full my-auto py-12">
            
            {/* Text & Features */}
            <div className="w-full xl:w-[45%] z-10 relative pr-4">
              <h2 className="font-bold text-5xl xl:text-[56px] text-gray-900 mb-6 tracking-tight leading-[1.05]">
                Shop Everything.<br />
                <span className="text-[#B58A63]">Live Better.</span>
              </h2>
              
              <p className="text-gray-600 text-sm font-medium max-w-[340px] mb-10 leading-relaxed">
                Create your account and enjoy a seamless shopping experience with exclusive benefits.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FDF8F5] flex items-center justify-center text-[#B58A63] shrink-0 border border-[#F5EDE6]">
                    <Truck size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-900 mb-0.5">Free Delivery</h4>
                    <p className="text-[12px] text-gray-500 font-medium">On orders over ৳500</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FDF8F5] flex items-center justify-center text-[#B58A63] shrink-0 border border-[#F5EDE6]">
                    <ShieldCheck size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-900 mb-0.5">Secure Payment</h4>
                    <p className="text-[12px] text-gray-500 font-medium">100% secure & protected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FDF8F5] flex items-center justify-center text-[#B58A63] shrink-0 border border-[#F5EDE6]">
                    <Tag size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-900 mb-0.5">Top Quality</h4>
                    <p className="text-[12px] text-gray-500 font-medium">Premium products & brands</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="w-full xl:w-[55%] h-[400px] xl:h-[550px] relative mt-12 xl:mt-0 right-0 xl:-right-12 pointer-events-none">
              <Image
                src="/auth-hero-products.png"
                alt="Velora Products"
                fill
                sizes="(max-width: 1280px) 100vw, 50vw"
                className="object-contain object-bottom xl:object-right-bottom scale-[1.15] origin-bottom xl:origin-bottom-right"
                priority
              />
            </div>
          </div>
          
          {/* Categories Bar */}
          <div className="bg-white rounded-3xl p-4 px-6 md:px-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-start md:justify-between overflow-x-auto gap-6 w-full max-w-[700px] relative z-20 mx-auto xl:mx-0 hide-scrollbar">
            {[
              { icon: ShoppingBag, label: "Grocery" },
              { icon: Smartphone, label: "Electronics" },
              { icon: Shirt, label: "Clothing" },
              { icon: Home, label: "Home & Living" },
              { icon: Sparkles, label: "Beauty" },
              { icon: Gamepad2, label: "Toys & More" },
            ].map((Cat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-gray-500 hover:text-[#B58A63] cursor-pointer transition-colors shrink-0">
                <Cat.icon size={22} strokeWidth={1.5} className="text-[#8B7F7A]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800 whitespace-nowrap">{Cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Form Panel (White Card) ── */}
        <div className="w-full max-w-md lg:max-w-[500px] bg-white rounded-[40px] p-8 md:p-12 shadow-[0_12px_60px_rgba(0,0,0,0.06)] relative z-20 mt-12 lg:mt-0 shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}
