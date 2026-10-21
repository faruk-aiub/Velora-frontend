"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const collections = [
  {
    title: "Next-Gen Audio & Computing",
    subtitle: "MacBook Air M2, Sony WH-1000XM5, Galaxy Ultra & Pro Audio",
    tag: "Trending 2026",
    href: "/shop?category=Electronics+%26+Gadgets",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    cols: "md:col-span-2 md:row-span-2",
    accent: "from-slate-900/90 via-slate-900/40 to-transparent",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  },
  {
    title: "Precision Watchmaking",
    subtitle: "Swiss Automatic PRX 80 & Seiko Sports Timepieces",
    tag: "Heritage Craft",
    href: "/shop?category=Fashion+%26+Clothing&subcategory=Watches",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    cols: "md:col-span-1 md:row-span-1",
    accent: "from-amber-950/90 via-amber-950/30 to-transparent",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  },
  {
    title: "Artisanal Living & Decor",
    subtitle: "Solid Teak Tables, Fluted Vases & Handwoven Decor",
    tag: "Nordic Warmth",
    href: "/shop?category=Home+%26+Living",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    cols: "md:col-span-1 md:row-span-1",
    accent: "from-stone-900/90 via-stone-900/30 to-transparent",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  },
  {
    title: "Artisan Kitchen & Brew",
    subtitle: "Damascus Steel Knives, Gooseneck Kettles & Espresso Makers",
    tag: "Chef Grade",
    href: "/shop?category=Kitchen+%26+Appliances",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80",
    cols: "md:col-span-2 md:row-span-1",
    accent: "from-neutral-900/90 via-neutral-900/40 to-transparent",
    badgeBg: "bg-[#BC8477]/20 text-[#E8C5BD] border-[#BC8477]/30",
  },
];

export function CuratedLifestyleBento() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BC8477]/10 text-[#BC8477] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Curated Lifestyle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Designed for Modern Living
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1.5 max-w-xl">
            Explore meticulously selected departments crafted for aesthetics, uncompromising quality, and everyday function.
          </p>
        </div>

        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#BC8477] hover:text-[#A87569] group transition-colors"
        >
          <span>Browse All 87 Categories</span>
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {collections.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`group relative rounded-[28px] overflow-hidden min-h-[300px] sm:min-h-[340px] md:min-h-[380px] flex flex-col justify-end p-6 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.12)] transition-all duration-500 ${item.cols}`}
          >
            {/* Background Image */}
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${item.accent} transition-opacity duration-300`} />

            {/* Content Box */}
            <div className="relative z-10 flex flex-col items-start">
              {/* Tag Pill */}
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md mb-3 ${item.badgeBg}`}
              >
                {item.tag}
              </span>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2 group-hover:text-[#E8C5BD] transition-colors">
                {item.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-gray-200/90 font-medium line-clamp-2 max-w-md mb-5">
                {item.subtitle}
              </p>

              {/* Action Link */}
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-gray-900 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all group-hover:shadow-xl group-hover:scale-102"
              >
                <span>Discover Collection</span>
                <ArrowUpRight size={14} className="text-[#BC8477]" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
