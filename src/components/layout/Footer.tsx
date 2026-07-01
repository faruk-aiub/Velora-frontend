import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#F9FAFB] text-gray-900 pt-16 pb-8 px-6 lg:px-12 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Left Section - Logo & Description */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-8 h-8 bg-[#BC8477] text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
              <ShoppingBag size={16} />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Velora
            </span>
          </Link>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
            Your one-stop shop for quality products at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-gray-900 mb-6 tracking-tight">Quick Links</h3>
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#BC8477] transition-colors w-fit">Home</Link>
            <Link href="/shop" className="hover:text-[#BC8477] transition-colors w-fit">Shop</Link>
            <Link href="/categories" className="hover:text-[#BC8477] transition-colors w-fit">Categories</Link>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-bold text-gray-900 mb-6 tracking-tight">Customer Service</h3>
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
            <Link href="/account" className="hover:text-[#BC8477] transition-colors w-fit">Track Order</Link>
            <Link href="/returns" className="hover:text-[#BC8477] transition-colors w-fit">Returns & Refunds</Link>
            <Link href="/shipping" className="hover:text-[#BC8477] transition-colors w-fit">Shipping Policy</Link>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="font-bold text-gray-900 mb-6 tracking-tight">Subscribe to our newsletter</h3>
          <p className="text-gray-500 text-sm font-medium mb-4 leading-relaxed">
            Get the latest updates on new products and upcoming sales.
          </p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 rounded-full bg-white border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] transition-all"
            />
            <button 
              type="submit"
              className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 py-2.5 font-bold text-sm shadow-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1600px] mx-auto border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-500">
          © 2026 Velora. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
          <Link href="/privacy" className="hover:text-[#BC8477] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#BC8477] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
