'use client';

import { useEffect, useRef, useState } from 'react';
import { Outfit } from 'next/font/google';
import { cn } from '@/lib/utils';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

interface StatItem {
  id: string;
  target: number;
  decimals: number;
  suffix: string;
  label: string;
  desc: string;
}

const STATS: StatItem[] = [
  { id: 'customers', target: 50000, decimals: 0, suffix: '+', label: 'Happy Customers', desc: 'Across the country' },
  { id: 'dispatch', target: 99.8, decimals: 1, suffix: '%', label: 'On-Time Dispatch', desc: 'Strict SLA fulfillment' },
  { id: 'products', target: 15000, decimals: 0, suffix: '+', label: 'Inspected Products', desc: '100% verified authentic' },
  { id: 'rating', target: 4.9, decimals: 1, suffix: ' / 5.0', label: 'Satisfaction Rating', desc: 'Based on 12k+ reviews' },
];

function StatCard({ stat, inView }: { stat: StatItem; inView: boolean }) {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    // Easing: easeOutExpo (smooth and satisfying deceleration)
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const val = easedProgress * stat.target;
      setCurrentVal(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentVal(stat.target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [inView, stat.target]);

  const formattedNumber = stat.decimals > 0
    ? currentVal.toFixed(stat.decimals)
    : Math.floor(currentVal).toLocaleString('en-US');

  return (
    <div className="group relative bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(188,132,119,0.12)] hover:border-[#BC8477]/40 hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden">
      {/* Top subtle terracotta glow bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#BC8477] to-[#9A6B60] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className={cn(outfit.className, "text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-gray-900 tracking-tight tabular-nums leading-none")}>
        <span>{formattedNumber}</span>
        <span className="text-[#BC8477] ml-0.5 font-bold text-xl sm:text-2xl lg:text-[26px]">
          {stat.suffix}
        </span>
      </div>

      <span className="block text-xs font-bold text-gray-700 group-hover:text-[#BC8477] uppercase tracking-wider mt-2.5 transition-colors">
        {stat.label}
      </span>

      <span className="block text-xs text-gray-400 font-medium mt-1">
        {stat.desc}
      </span>
    </div>
  );
}

export function AboutHeroStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    // Fallback trigger in case observer doesn't fire immediately on mount
    const timer = setTimeout(() => setInView(true), 250);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
      {STATS.map((stat) => (
        <StatCard key={stat.id} stat={stat} inView={inView} />
      ))}
    </div>
  );
}
