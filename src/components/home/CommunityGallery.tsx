"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";

function InstagramIcon({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const posts = [
  {
    handle: "@tanvir.audio",
    likes: "1.4k",
    product: "Sony WH-1000XM5",
    link: "/shop?q=Sony",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
  },
  {
    handle: "@sadia_atelier",
    likes: "2.1k",
    product: "18K Celestial Pendant",
    link: "/shop?q=Necklace",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  },
  {
    handle: "@minimalist.dhaka",
    likes: "980",
    product: "Scandinavian Teak Table",
    link: "/shop?category=Home+%26+Living",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
  },
  {
    handle: "@horology.bd",
    likes: "3.2k",
    product: "Tissot PRX Powermatic 80",
    link: "/shop?q=Tissot",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
  },
  {
    handle: "@brewcraft_dhaka",
    likes: "1.8k",
    product: "Fellow Stagg EKG Kettle",
    link: "/shop?q=Kettle",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80",
  },
];

export function CommunityGallery() {
  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#BC8477] text-xs font-bold uppercase tracking-widest mb-2">
            <InstagramIcon size={15} />
            <span>Community Spotlight</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            #StyledWithVelora
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Tag @veloralifestyle on Instagram to be featured in our community edit.
          </p>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-[#BC8477] transition-colors"
        >
          <span>Follow Us on Instagram</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* 5-Image Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {posts.map((post, idx) => (
          <Link
            key={idx}
            href={post.link}
            className="group relative aspect-square rounded-[22px] overflow-hidden bg-gray-100 shadow-sm block"
          >
            <Image
              src={post.imageUrl}
              alt={post.product}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-108"
            />

            {/* Hover Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{post.handle}</span>
                <span className="flex items-center gap-1 text-red-400">
                  <Heart size={12} fill="currentColor" />
                  <span>{post.likes}</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-medium truncate">
                {post.product}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
