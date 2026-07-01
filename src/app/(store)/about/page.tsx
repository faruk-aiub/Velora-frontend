import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Target, ShieldCheck, Heart } from "lucide-react";

export const metadata = {
  title: "About Us | Velora",
  description: "Learn more about Velora's mission, vision, and team.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="bg-[#F7F5EE] pt-32 pb-24 px-6 lg:px-12 text-center rounded-b-[40px] max-w-[1600px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
          Redefining Your <br className="hidden md:block" /> Shopping Experience
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          At Velora, we believe in bringing you the best quality products with a seamless, modern, and enjoyable shopping journey.
        </p>
      </section>

      {/* ── Our Story ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Our Story</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Founded with a passion for quality and design, Velora started as a small idea to curate premium products for everyday life. Over the years, we have grown into a trusted marketplace that connects thousands of customers with products they love.
            </p>
            <p className="text-gray-500 font-medium leading-relaxed">
              Our journey is fueled by a commitment to excellence. From fashion to electronics, we carefully select every item in our store to ensure it meets our high standards of quality, durability, and style.
            </p>
          </div>
          <div className="flex-1 w-full relative h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-[#EAF0E2] rounded-[40px] rotate-3 scale-105"></div>
            <Image 
              src="/our-story.png" 
              alt="Our Story" 
              fill 
              className="object-cover rounded-[40px] relative z-10"
            />
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto bg-gray-50 rounded-[40px] my-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Our Core Values</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            The principles that guide everything we do.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Quality First", desc: "We never compromise on the quality of our products. Every item is tested and verified." },
            { icon: Users, title: "Customer Focus", desc: "Your satisfaction is our top priority. We are here to support you 24/7." },
            { icon: Target, title: "Innovation", desc: "We continuously look for new ways to improve your shopping experience." },
            { icon: Heart, title: "Passion", desc: "We love what we do, and it reflects in the products we deliver to you." }
          ].map((value, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-[#F7F5EE] flex items-center justify-center text-[#7A915C] mb-6 group-hover:scale-110 transition-transform">
                <value.icon size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto mb-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Meet Our Team</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            The passionate people behind Velora.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { name: "Alex Morgan", role: "Founder & CEO", img: "11" },
            { name: "Sarah Chen", role: "Head of Product", img: "21" },
            { name: "David Miller", role: "Lead Designer", img: "32" }
          ].map((member, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 relative group-hover:-translate-y-2 transition-transform duration-300 shadow-lg">
                <Image 
                  src={`https://i.pravatar.cc/300?img=${member.img}`} 
                  alt={member.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-[#7A915C] font-medium mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
