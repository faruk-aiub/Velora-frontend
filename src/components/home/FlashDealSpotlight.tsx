"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ShoppingBag, ShieldCheck, Zap, ArrowRight, Check, Flame } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@/types/product.types";

export function FlashDealSpotlight() {
  // Deal countdown timer: 14 hours 28 mins 42 secs initial offset
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 28,
    seconds: 42,
  });

  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaimDeal = () => {
    const spotlightProduct: Product = {
      id: "spotlight-sony-wh1000xm5",
      title: "Sony WH-1000XM5 Noise-Canceling Wireless Over-Ear Headphones",
      slug: "sony-wh-1000xm5-wireless-noise-canceling-headphones",
      description: "Industry-leading noise cancellation powered by dual processors and 8 microphones. Enjoy 30 hours of battery life, crystal clear hands-free calls, and LDAC audio.",
      category_id: "electronics-gadgets-headphone-earbuds",
      base_price: 38500,
      discount_percent: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        {
          id: "img-sony-wh1000xm5",
          product_id: "spotlight-sony-wh1000xm5",
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
          alt_text: "Sony WH-1000XM5 Headphones",
        },
      ],
      variants: [
        {
          id: "var-sony-wh1000xm5-black",
          product_id: "spotlight-sony-wh1000xm5",
          sku: "SNY-WH1000XM5-BLK",
          price: 38500,
          compare_price: 43000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    };

    addItem(spotlightProduct, spotlightProduct.variants[0] as ProductVariant, 1);
    setIsAdded(true);
    toast.success("Deal applied: Sony WH-1000XM5 added to cart!");
    setTimeout(() => setIsAdded(false), 2000);
    openCart();
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
      <div className="relative rounded-[36px] sm:rounded-[44px] overflow-hidden bg-[#0F172A] border border-slate-800 shadow-[0_25px_60px_rgb(0,0,0,0.25)] p-8 sm:p-12 lg:p-16">
        {/* Ambient Decorative Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#BC8477]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                <Flame size={14} className="animate-pulse text-red-500" />
                Limited Flash Spotlight
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                <ShieldCheck size={14} className="text-emerald-400" />
                Official 1-Year Warranty
              </span>
            </div>

            {/* Product Title */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#BC8477] mb-2 block">
                Flagship Audio Drop
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Sony WH-1000XM5 Noise Canceling
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-medium mt-3 leading-relaxed max-w-xl">
                Industry-defining noise reduction powered by dual processors and 8 microphones. Up to 30 hours of continuous high-resolution audio on a single charge.
              </p>
            </div>

            {/* Price & Savings Tag */}
            <div className="flex items-baseline gap-4 pt-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  ৳38,500
                </span>
                <span className="text-lg sm:text-xl text-slate-400 line-through font-medium">
                  ৳43,000
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#BC8477] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
                Save ৳4,500 (-10%)
              </span>
            </div>

            {/* Countdown Timer Block */}
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <Clock size={14} className="text-[#BC8477]" />
                <span>Offer Expires In</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-center">
                {[
                  { label: "Hours", val: String(timeLeft.hours).padStart(2, "0") },
                  { label: "Mins", val: String(timeLeft.minutes).padStart(2, "0") },
                  { label: "Secs", val: String(timeLeft.seconds).padStart(2, "0") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl w-16 sm:w-20 py-2.5 sm:py-3 shadow-inner">
                      <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                        {item.val}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {item.label}
                      </span>
                    </div>
                    {i < 2 && <span className="text-slate-500 font-bold text-xl sm:text-2xl">:</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Scarcity Bar */}
            <div className="space-y-1.5 max-w-md pt-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Stock Allocation</span>
                <span className="text-amber-400 font-bold">Only 6 units left!</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div className="h-full bg-gradient-to-r from-amber-500 via-[#BC8477] to-red-500 rounded-full w-[88%] transition-all duration-1000" />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={handleClaimDeal}
                className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl ${isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-[#BC8477] hover:bg-[#A87569] text-white hover:scale-102 active:scale-98 shadow-[#BC8477]/25"
                  }`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Claim Deal Now</span>
                  </>
                )}
              </button>

              <Link
                href="/shop?q=Sony"
                className="px-6 py-4 rounded-2xl font-bold text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <span>View Specs</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Product Visual Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Pulsing Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#BC8477]/30 to-blue-500/20 rounded-full blur-2xl transform scale-90" />

            <div className="relative w-full aspect-square max-w-[480px] rounded-[32px] overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900/60 backdrop-blur-md p-4 group">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="Sony WH-1000XM5 Wireless Headphones"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover rounded-[24px] transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Spec Tags */}
              <div className="absolute top-7 left-7 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-1.5 text-white text-xs font-semibold shadow-lg">
                ⚡ 30-Hour Battery
              </div>

              <div className="absolute bottom-7 right-7 bg-[#BC8477]/90 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-1.5 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                <Zap size={14} />
                <span>Hi-Res Audio LDAC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
