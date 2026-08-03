import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

const Facebook = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const Youtube = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

export function Footer() {
  return (
    <footer className="bg-[#0F0F11] text-gray-300 pt-20 pb-10 px-6 lg:px-12 border-t border-white/5 relative overflow-hidden">
      {/* Subtle background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#BC8477]/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#BC8477]/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10">
        
        {/* Left Section - Logo & Description */}
        <div className="md:col-span-4 lg:col-span-4">
          <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
            <div className="w-10 h-10 bg-[#BC8477] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag size={20} />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              Velora
            </span>
          </Link>
          <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 max-w-sm">
            Elevating your everyday style with premium quality products at unparalleled value. Discover the Velora difference.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#BC8477] hover:text-white transition-all duration-300 hover:-translate-y-1">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#BC8477] hover:text-white transition-all duration-300 hover:-translate-y-1">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#BC8477] hover:text-white transition-all duration-300 hover:-translate-y-1">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#BC8477] hover:text-white transition-all duration-300 hover:-translate-y-1">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-4 lg:col-span-2 lg:col-start-6">
          <h3 className="font-bold text-white mb-6 tracking-tight text-lg">Quick Links</h3>
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-400">
            {['Home', 'Shop', 'Categories', 'About Us', 'Contact'].map((link) => (
              <Link key={link} href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-[#BC8477] transition-all duration-300 w-fit hover:translate-x-2 flex items-center gap-2 group">
                <span className="w-0 h-[1px] bg-[#BC8477] group-hover:w-3 transition-all duration-300"></span>
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Customer Service */}
        <div className="md:col-span-4 lg:col-span-2">
          <h3 className="font-bold text-white mb-6 tracking-tight text-lg">Customer Care</h3>
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-400">
            {['Track Order', 'Returns & Refunds', 'Shipping Policy', 'FAQ', 'Privacy Policy'].map((link) => (
              <Link key={link} href={`/${link.split(' ')[0].toLowerCase()}`} className="hover:text-[#BC8477] transition-all duration-300 w-fit hover:translate-x-2 flex items-center gap-2 group">
                <span className="w-0 h-[1px] bg-[#BC8477] group-hover:w-3 transition-all duration-300"></span>
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="md:col-span-12 lg:col-span-3">
          <h3 className="font-bold text-white mb-6 tracking-tight text-lg">Stay in the Loop</h3>
          <p className="text-gray-400 text-sm font-medium mb-6 leading-relaxed">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form className="relative group">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/50 focus:border-[#BC8477] transition-all duration-300"
            />
            <button 
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#BC8477] text-white hover:bg-[#a67468] rounded-lg px-4 flex items-center justify-center transition-colors duration-300"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1600px] mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-sm font-medium text-gray-500">
          © {new Date().getFullYear()} Velora. All rights reserved.
        </p>
        <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
