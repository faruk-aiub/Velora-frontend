'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SlideItem {
  id: string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  discountBadge: string;
  image: string;
  link: string;
}

const slides: SlideItem[] = [
  {
    id: 'laptops',
    badge: 'PREMIUM COMPUTING',
    titleLine1: 'Next-Gen Laptops &',
    titleLine2: 'Ultra-Slim Tech',
    subtitle: 'Empower Your Productivity With High-Performance Computing & Elegant Minimalist Aesthetics',
    discountBadge: 'UP TO 30% OFF',
    image: '/hero-laptop.jpg',
    link: '/shop?category=electronics-gadgets',
  },
  {
    id: 'keyboards',
    badge: 'TACTILE CRAFTSMANSHIP',
    titleLine1: 'Custom Mechanical',
    titleLine2: 'Keyboards & Setup',
    subtitle: 'Precision-Engineered Keyboards, Warm Terracotta Keycaps & Minimalist Desk Essentials',
    discountBadge: 'UP TO 35% OFF',
    image: '/hero-keyboard.jpg',
    link: '/shop?category=electronics-gadgets',
  },
  {
    id: 'appliances',
    badge: 'SMART HOME APPLIANCES',
    titleLine1: 'Aesthetic Kitchen &',
    titleLine2: 'Smart Living Appliances',
    subtitle: 'Elevate Everyday Living With Artisan Espresso Machines, Smart Kettles & Countertop Luxury',
    discountBadge: 'UP TO 40% OFF',
    image: '/hero-appliance.jpg',
    link: '/shop?category=kitchen-dining',
  },
  {
    id: 'home-decor',
    badge: 'WARM MINIMALIST LIVING',
    titleLine1: 'Elevated Home Decor &',
    titleLine2: 'Artisanal Accents',
    subtitle: 'Transform Your Spaces With Handcrafted Ceramic Vases, Earthy Tones & Timeless Japandi Furniture',
    discountBadge: 'UP TO 25% OFF',
    image: '/hero-living-decor.jpg',
    link: '/shop?category=home-living',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // 3-second auto-play transition as requested
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6">
      <div
        className="relative w-full h-[460px] sm:h-[520px] md:h-[580px] lg:h-[620px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-[0_16px_50px_rgba(188,132,119,0.12)] border border-[#BC8477]/20 group select-none bg-[#FDFBF7]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Background Images with Smooth Transition */}
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.image}
                alt={`${slide.titleLine1} ${slide.titleLine2}`}
                fill
                priority={index === 0}
                className="object-cover object-center transform scale-100 transition-transform duration-[6000ms] ease-out group-hover:scale-105"
                sizes="(max-width: 1600px) 100vw, 1600px"
              />
            </div>
          );
        })}

        {/* Warm White & Cream Gradient Overlay for Perfect Readability & Theme Harmony */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/85 to-transparent sm:via-[#FDFBF7]/75 to-transparent/10 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7]/70 via-transparent to-transparent z-20 pointer-events-none" />

        {/* Slide Content Overlay */}
        <div className="relative z-30 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 max-w-3xl">
          {slides.map((slide, index) => {
            const isActive = index === current;
            if (!isActive) return null;

            return (
              <div
                key={slide.id}
                className="space-y-4 sm:space-y-6 transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-4"
              >
                {/* Top Badge matching Velora brand */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#BC8477]/30 text-[#BC8477] text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#BC8477]" />
                  <span>{slide.badge}</span>
                </div>

                {/* Main Heading in Deep Charcoal */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-black text-gray-900 tracking-tight leading-[1.08]">
                  {slide.titleLine1}{' '}
                  <br className="hidden sm:inline" />
                  <span className="text-[#BC8477]">{slide.titleLine2}</span>
                </h1>

                {/* Subtitle in Warm Readable Tone */}
                <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium max-w-xl leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Action Buttons matching screenshot layout & Velora cream/terracotta palette */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-3">
                  {/* Button 1: Warm Terracotta/Amber Discount Badge Button */}
                  <Link
                    href={slide.link}
                    className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#BC8477]/15 hover:bg-[#BC8477]/25 text-[#9A6256] border border-[#BC8477]/40 font-bold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    {slide.discountBadge}
                  </Link>

                  {/* Button 2: Velora Signature Primary Button */}
                  <Link
                    href={slide.link}
                    className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-[#BC8477] hover:bg-[#A87569] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#BC8477]/25 hover:shadow-[#BC8477]/40 hover:scale-105 active:scale-95 transition-all duration-200 group/btn cursor-pointer"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1.5 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>



        {/* Pagination Dots (Bottom Center) in Warm Neutral & Velora Terracotta */}
        <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/70 shadow-sm">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#BC8477] shadow-[0_0_12px_rgba(188,132,119,0.7)]'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
