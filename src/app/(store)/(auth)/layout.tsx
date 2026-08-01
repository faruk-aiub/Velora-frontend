'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cormorant_Garamond } from 'next/font/google';
import { Package, ShieldCheck, Star } from 'lucide-react';

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <div className={`min-h-screen flex w-full relative bg-[#F9FAFB] ${cormorant.variable}`}>
      {/* Background Image (subtle) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/auth-hero.jpg"
          alt="Premium Fashion"
          fill
          priority
          className="object-cover object-center opacity-20 mix-blend-multiply"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#F5F2F0]/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 lg:gap-24">
        
        {/* ── Left Content Panel ── */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none pt-12 lg:pt-0">
          <Link href="/" className="inline-block mb-16 lg:mb-24">
            <span className="font-serif tracking-[0.2em] text-gray-900 text-xl uppercase font-bold">Velora</span>
          </Link>

          <h2 className="font-serif font-bold text-5xl md:text-6xl text-gray-900 mb-6 tracking-tight leading-[1.1]">
            {isLogin ? (
              <>Welcome <br /> Back to <span className="italic text-[#BC8477]">Velora</span></>
            ) : (
              <>Join Velora <br /><span className="italic text-[#BC8477]">Today</span></>
            )}
          </h2>
          
          <p className="text-gray-600 text-base font-medium max-w-md mb-12 leading-relaxed">
            {isLogin 
              ? "Sign in to access your exclusive offers, fast checkout, and personalized shopping experience."
              : "Create your account and enjoy exclusive offers, fast checkout, and personalized shopping."}
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EAF0E2] flex items-center justify-center text-[#7A915C] shrink-0">
                <Package size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-500 font-medium">On all orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F5E6E3] flex items-center justify-center text-[#BC8477] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-500 font-medium">100% secure & protected</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF4E5] flex items-center justify-center text-[#E89E34] shrink-0">
                <Star size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Trusted by 50K+</h4>
                <p className="text-sm text-gray-500 font-medium">Happy customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Form Panel (White Card) ── */}
        <div className="w-full max-w-md lg:max-w-[480px] bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
          {children}
        </div>
      </div>
    </div>
  );
}
