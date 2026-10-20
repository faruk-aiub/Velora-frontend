"use client";

import { Truck, ShieldCheck, RefreshCw, Headphones, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const pillars = [
  {
    icon: Truck,
    badge: "Fast Dispatch",
    title: "Express Same-Day Delivery",
    desc: "Guaranteed 6-12 hour doorstep delivery across Dhaka and Chittagong with live rider GPS tracking and SMS alerts.",
    perks: ["Same-Day Dispatch", "Live Rider GPS Tracking", "Safe Fragile Packaging"],
    accent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    gradient: "group-hover:border-blue-500/40",
  },
  {
    icon: ShieldCheck,
    badge: "Certified Authentic",
    title: "100% Genuine Guarantee",
    desc: "Every single piece is sourced directly from verified manufacturer distributors with official warranty coverage.",
    perks: ["Authorized Importer", "Official Warranty Cards", "Serial Number Verification"],
    accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    gradient: "group-hover:border-emerald-500/40",
  },
  {
    icon: RefreshCw,
    badge: "Hassle-Free",
    title: "7-Day Doorstep Returns",
    desc: "No questions asked. If your item doesn't exceed your expectations, our rider collects it from your door.",
    perks: ["Zero Pickup Fee", "Instant Refund / Store Credit", "1-to-1 Replacement"],
    accent: "bg-[#BC8477]/10 text-[#BC8477] border-[#BC8477]/20",
    gradient: "group-hover:border-[#BC8477]/40",
  },
  {
    icon: Headphones,
    badge: "24/7 Priority",
    title: "Velora VIP Concierge",
    desc: "Dedicated personal customer specialists available around the clock via WhatsApp, live chat, or phone.",
    perks: ["Avg 45s Response Time", "Styling & Tech Guidance", "Direct WhatsApp Concierge"],
    accent: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    gradient: "group-hover:border-purple-500/40",
  },
];

export function VeloraStandard() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#BC8477] bg-[#BC8477]/10 px-4 py-1.5 rounded-full inline-block mb-3">
          The Velora Experience
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Redefining Online Shopping in Bangladesh
        </h2>
        <p className="text-sm sm:text-base text-gray-500 font-medium mt-3">
          We combine authenticated luxury goods with world-class fulfillment standards to ensure your peace of mind.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`group bg-white rounded-[28px] p-7 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.02)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-between ${pillar.gradient}`}
          >
            <div>
              {/* Icon & Badge Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-108 transition-transform duration-300 ${pillar.accent}`}>
                  <pillar.icon size={26} strokeWidth={2.2} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${pillar.accent}`}>
                  {pillar.badge}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-lg font-bold text-gray-900 mb-2.5 tracking-tight group-hover:text-[#BC8477] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mb-6">
                {pillar.desc}
              </p>
            </div>

            {/* Perks Bullet List */}
            <div className="space-y-2 pt-4 border-t border-gray-50">
              {pillar.perks.map((perk, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <CheckCircle2 size={13} className="text-[#BC8477] flex-shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Trust Banner */}
      <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#BC8477] text-white flex items-center justify-center font-bold text-sm">
            ৳
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
              Cash on Delivery & Secure Digital Payments
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
              We accept bKash, Nagad, Visa, Mastercard, AMEX, and Cash on Delivery nationwide.
            </p>
          </div>
        </div>

        <Link
          href="/about"
          className="text-xs font-bold text-[#BC8477] hover:text-[#A87569] flex items-center gap-1 group whitespace-nowrap"
        >
          <span>Learn About Velora</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
