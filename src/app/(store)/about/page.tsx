import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProcessFlowchart } from "@/components/about/ProcessFlowchart";
import { 
  ShieldCheck, 
  Target, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Headphones, 
  Truck, 
  Heart, 
  Eye
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
      icon: Award,
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
      <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Story Text */}
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BC8477]/10 text-[#BC8477] font-bold text-xs uppercase tracking-wider">
              <span>Our Heritage & Craftsmanship</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Crafted With Passion, <br className="hidden sm:block" />
              <span className="text-[#BC8477]">Built On Lasting Trust.</span>
            </h2>

            <p className="text-gray-600 font-medium leading-relaxed text-base sm:text-lg">
              Founded with a burning passion for design, durability, and customer satisfaction, Velora started with a straightforward vision: to eliminate the guesswork from online shopping in Bangladesh.
            </p>

            <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
              Over the years, we have evolved into a trusted marketplace connecting conscious shoppers with curated collections spanning handcrafted leather, precision timepieces, modern computing, and artisanal home decor. Every piece passes strict quality benchmarks to ensure you receive nothing short of perfection.
            </p>

            {/* Key Trust Guarantees */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-gray-800">
              <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E1DE]/70">
                <CheckCircle2 size={16} className="text-[#BC8477] shrink-0" />
                <span>100% Verified Authentic Sourcing</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E1DE]/70">
                <CheckCircle2 size={16} className="text-[#BC8477] shrink-0" />
                <span>Dual Inspection Before Dispatch</span>
              </div>
            </div>

            {/* Mission & Vision Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#FAF8F5] hover:bg-white p-6 rounded-3xl border border-[#E8E1DE] transition-all duration-300 shadow-sm hover:shadow-md hover:border-[#BC8477]/40 group">
                <div className="w-11 h-11 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center font-bold mb-4 shadow-sm border border-gray-100 group-hover:scale-105 group-hover:bg-[#BC8477] group-hover:text-white transition-all duration-300">
                  <Target size={20} />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-extrabold text-gray-900 text-base tracking-tight">Our Mission</h3>
                  <span className="text-[10px] font-bold text-[#BC8477] uppercase tracking-wider bg-[#BC8477]/10 px-2 py-0.5 rounded-full">Purpose</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  To democratize access to premium, authentic products with radical operational transparency and warm customer care.
                </p>
              </div>

              <div className="bg-[#FAF8F5] hover:bg-white p-6 rounded-3xl border border-[#E8E1DE] transition-all duration-300 shadow-sm hover:shadow-md hover:border-[#BC8477]/40 group">
                <div className="w-11 h-11 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center font-bold mb-4 shadow-sm border border-gray-100 group-hover:scale-105 group-hover:bg-[#BC8477] group-hover:text-white transition-all duration-300">
                  <Eye size={20} />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-extrabold text-gray-900 text-base tracking-tight">Our Vision</h3>
                  <span className="text-[10px] font-bold text-[#BC8477] uppercase tracking-wider bg-[#BC8477]/10 px-2 py-0.5 rounded-full">Horizon</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  To be the nation’s benchmark for e-commerce excellence—where every customer purchase is met with absolute delight.
                </p>
              </div>
            </div>

          </div>

          {/* Story Visuals Collage with Picture */}
          <div className="lg:col-span-6 relative mt-8 lg:mt-0">
            
            {/* Ambient Background Warm Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#BC8477]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Decorative Offset Frame */}
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-[#F7F5EE] via-[#FAF8F5] to-[#E8E1DE]/40 rounded-[44px] sm:rounded-[52px] -rotate-1 pointer-events-none border border-[#E8E1DE]/60" />

            {/* Main Picture: Artisan Atelier Studio */}
            <div className="relative rounded-[36px] sm:rounded-[44px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] w-full z-10 bg-gray-100 group">
              <Image 
                src="/about-craftsmanship.jpg" 
                alt="Velora Craftsmanship and Design Studio Atelier" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Badge Overlay */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/60 flex items-center gap-2 z-20">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-900 tracking-tight">Velora Design Atelier · Dhaka</span>
              </div>
            </div>

            {/* Overlapping Secondary Picture: Handcrafted Artisan Detail */}
            <div className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-5 w-40 sm:w-52 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20 bg-gray-100 group hover:-translate-y-1 transition-transform duration-300">
              <Image 
                src="/about-artisan-detail.jpg" 
                alt="Handcrafted leather detail by Velora artisans" 
                fill 
                sizes="(max-width: 640px) 160px, 208px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-white drop-shadow">
                  Handcrafted
                </span>
              </div>
            </div>

            {/* Floating Trust Stamp Badge (Top Left Corner) */}
            <div className="absolute -top-5 -left-2 sm:-top-7 sm:-left-5 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl shadow-xl border border-gray-100 z-20 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center font-bold">
                <Award size={20} />
              </div>
              <div>
                <span className="block text-sm font-extrabold text-gray-900 tracking-tight">100% Authentic</span>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verified Craft</span>
              </div>
            </div>

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
