import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProcessFlowchart } from "@/components/about/ProcessFlowchart";
import { 
  ShieldCheck, 
  Target, 
  Sparkles, 
  Award, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Headphones, 
  Truck,
  Heart,
  Eye,
  Check
} from "lucide-react";

export const metadata = {
  title: "About Us | Velora",
  description: "Discover Velora's journey, our commitment to uncompromising quality, and our transparent fulfillment flowchart.",
};

export const revalidate = 300; // Cache static About page for ultra-fast response

export default function AboutPage() {
  const stats = [
    { label: "Happy Customers", value: "50,000+", desc: "Across the country" },
    { label: "On-Time Dispatch", value: "99.8%", desc: "Strict SLA fulfillment" },
    { label: "Inspected Products", value: "15,000+", desc: "100% verified authentic" },
    { label: "Satisfaction Rating", value: "4.9 / 5.0", desc: "Based on 12k+ reviews" },
  ];

  const coreValues = [
    {
      icon: ShieldCheck,
      title: "Quality First",
      desc: "We never compromise on the quality of our products. Every item undergoes rigorous inspection before arriving at your door.",
      tag: "Dual Verification"
    },
    {
      icon: Target,
      title: "Customer-Centric",
      desc: "Your satisfaction guides every decision we make. Our dedicated care specialists are here for you 24 hours a day, 7 days a week.",
      tag: "24/7 Priority Support"
    },
    {
      icon: Sparkles,
      title: "Curated Excellence",
      desc: "Instead of overwhelming you with endless catalogs, we handpick and curate only high-durability, stylish, and premium lifestyle items.",
      tag: "Handpicked Catalog"
    },
    {
      icon: Heart,
      title: "Sustainable & Ethical",
      desc: "We partner directly with ethical manufacturers and prioritize eco-friendly, recyclable protective boxing to safeguard our planet.",
      tag: "Eco-Conscious"
    }
  ];

  const valuePillars = [
    {
      icon: Truck,
      title: "Lightning Express Shipping",
      desc: "Fast dispatch through our integrated regional courier hubs with real-time GPS tracking."
    },
    {
      icon: RefreshCw,
      title: "7-Day Hassle-Free Returns",
      desc: "Not 100% satisfied? Enjoy instant exchanges or seamless refund processing within 7 days."
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic Guarantee",
      desc: "Zero tolerance for counterfeit goods. All products come with manufacturer verification."
    },
    {
      icon: Headphones,
      title: "Dedicated Human Support",
      desc: "Connect directly with our support concierge via live chat, call, or email anytime."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="bg-[#F7F5EE] pt-32 pb-20 px-6 lg:px-12 text-center rounded-b-[48px] max-w-[1600px] mx-auto border-b border-[#E8E1DE]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#BC8477] font-bold text-xs uppercase tracking-wider mb-6 border border-gray-200/80 shadow-sm">
          <Sparkles size={14} />
          <span>Curated Quality · Everyday Elegance</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
          Redefining Your Shopping Experience With <br className="hidden md:block" />
          <span className="text-[#BC8477]">Uncompromising Quality</span>
        </h1>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
          At Velora, we combine artisanal curation, strict quality gates, and transparent order tracking to elevate your everyday living.
        </p>

        {/* ── Key Numbers Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/80 shadow-sm text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {stat.value}
              </span>
              <span className="block text-xs font-bold text-[#BC8477] uppercase tracking-wider mt-1">
                {stat.label}
              </span>
              <span className="block text-[11px] text-gray-400 font-medium mt-0.5">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story & Mission/Vision ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Story Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF0E2] text-[#7A915C] font-bold text-xs uppercase tracking-wider">
              <span>Our Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Crafted With Passion, Built On Lasting Trust.
            </h2>
            <p className="text-gray-600 font-medium leading-relaxed">
              Founded with a burning passion for design, durability, and customer satisfaction, Velora started with a straightforward vision: to eliminate the guesswork from online shopping.
            </p>
            <p className="text-gray-600 font-medium leading-relaxed">
              Over the years, we have evolved into a trusted marketplace connecting conscious shoppers with curated collections spanning fashion, gadgets, home decor, and lifestyle essentials. Every item on Velora passes strict quality benchmarks to ensure you receive nothing short of perfection.
            </p>

            {/* Mission & Vision Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-[#F7F5EE] p-6 rounded-2xl border border-[#E8E1DE]">
                <div className="w-10 h-10 rounded-xl bg-white text-[#BC8477] flex items-center justify-center font-bold mb-3 shadow-sm">
                  <Target size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Our Mission</h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  To democratize access to premium, authentic products with radical operational transparency and warm customer care.
                </p>
              </div>

              <div className="bg-[#EAF0E2]/50 p-6 rounded-2xl border border-[#D5E2C8]">
                <div className="w-10 h-10 rounded-xl bg-white text-[#7A915C] flex items-center justify-center font-bold mb-3 shadow-sm">
                  <Eye size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Our Vision</h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  To be the nation’s benchmark for e-commerce excellence—where every customer purchase is met with absolute delight.
                </p>
              </div>
            </div>
          </div>

          {/* Story Visual */}
          <div className="lg:col-span-6 w-full relative h-[420px] sm:h-[500px]">
            <div className="absolute inset-0 bg-[#EAF0E2] rounded-[40px] rotate-3 scale-105"></div>
            <Image 
              src="/our-story.png" 
              alt="Velora Craftsmanship and Story" 
              fill 
              className="object-cover rounded-[40px] relative z-10 shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Core Values Section ── */}
      <section className="py-20 px-6 lg:px-12 max-w-[1600px] mx-auto bg-gray-50/70 rounded-[40px] border border-gray-100 my-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#BC8477] uppercase tracking-wider bg-[#BC8477]/10 px-3 py-1 rounded-full">
            Our Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3 mb-4">
            The Principles That Guide Velora
          </h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-base">
            Every product we list, parcel we pack, and conversation we have with you is shaped by our core values.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, i) => {
            const Icon = value.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#BC8477]/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F5EE] flex items-center justify-center text-[#BC8477] mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    {value.tag}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed text-sm">
                    {value.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Operational & Quality Flowchart Section (Centerpiece) ── */}
      <ProcessFlowchart />

      {/* ── Why Choose Velora / Customer Guarantee Pillars ── */}
      <section className="py-20 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="bg-[#1C1917] rounded-[40px] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#BC8477]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7A915C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BC8477] bg-white/10 px-3 py-1 rounded-full">
              Customer First Guarantee
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
              Why Discerning Shoppers Choose Velora
            </h2>
            <p className="text-gray-300 font-medium text-base">
              We eliminate the friction and uncertainty of online shopping with transparent policies, insured transit, and customer-first support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {valuePillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#BC8477] text-white flex items-center justify-center mb-5 shadow-lg">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{pillar.title}</h3>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="mt-14 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <h4 className="text-xl font-bold text-white">Ready to experience the Velora standard?</h4>
              <p className="text-sm text-gray-400 mt-1">Explore our curated collections or talk with our team.</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link 
                href="/shop" 
                className="bg-[#BC8477] hover:bg-[#A87569] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-md transition-colors flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/contact" 
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-bold text-sm transition-colors"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
