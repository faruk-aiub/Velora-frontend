"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, Heart, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import axios from "@/lib/axios";

interface NavbarProps {
  variant?: 'transparent' | 'solid';
}

export function Navbar({ variant = 'solid' }: NavbarProps) {
  const isTransparent = variant === 'transparent';
  
  const openCart = useCartStore((state) => state.openCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const fetchNotifications = async () => {
      if (isAuthenticated) {
        try {
          const res = await axios.get('/notifications/unread-count');
          setUnreadCount(res.data.count);
        } catch (error) {
          console.error("Failed to fetch notifications");
        }
      }
    };

    if (mounted && isAuthenticated) {
      fetchNotifications();
      interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mounted, isAuthenticated]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };
  
  return (
    <nav className={cn(
      "w-full z-50 px-6 py-6 lg:px-12 flex items-center justify-between transition-colors duration-300",
      isTransparent ? "absolute top-0 text-white" : "sticky top-0 bg-white text-gray-900 border-b border-gray-100"
    )}>
      <div className="flex items-center gap-4 lg:hidden">
        <button className={cn("hover:text-[#BC8477] transition-colors", isTransparent ? "text-white" : "text-gray-900")}>
          <Menu size={24} />
        </button>
      </div>

      <Link href="/" className="flex items-center gap-3 group">
        <div className={cn(
          "w-10 h-10 rounded-full border-[1.5px] flex items-center justify-center transition-colors",
          isTransparent ? "border-white/80 backdrop-blur-md group-hover:bg-white/10" : "border-gray-900 group-hover:bg-gray-900 group-hover:text-white"
        )}>
          <span className="font-bold text-xl font-light">V</span>
        </div>
        <span className="font-sans text-xl font-bold tracking-wide hidden sm:block">
          Velora
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-8">
        <Link href="/shop" className={cn("text-sm font-bold transition-colors", isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-[#BC8477]")}>Shop</Link>
        <Link href="/categories" className={cn("text-sm font-bold transition-colors", isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-[#BC8477]")}>Categories</Link>
        <Link href="/about" className={cn("text-sm font-bold transition-colors", isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-[#BC8477]")}>About</Link>
        <Link href="/contact" className={cn("text-sm font-bold transition-colors", isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-[#BC8477]")}>Contact</Link>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={cn("hover:text-[#BC8477] transition-colors hidden sm:block", isTransparent ? "text-white" : "text-gray-900")}
        >
          <Search size={20} />
        </button>
        <Link href={mounted && isAuthenticated ? "/account" : "/login"} className={cn("hover:text-[#BC8477] transition-colors", isTransparent ? "text-white" : "text-gray-900")}>
          <User size={20} />
        </Link>
        {mounted && isAuthenticated && (
          <Link href="/account?tab=messages" className={cn("hover:text-[#BC8477] transition-colors relative", isTransparent ? "text-white" : "text-gray-900")}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#BC8477] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        )}
        <Link href={mounted && isAuthenticated ? "/account?tab=wishlist" : "/login"} className={cn("hover:text-[#BC8477] transition-colors", isTransparent ? "text-white" : "text-gray-900")}>
          <Heart size={20} />
        </Link>
        <button onClick={openCart} className={cn("hover:text-[#BC8477] transition-colors relative", isTransparent ? "text-white" : "text-gray-900")}>
          <ShoppingBag size={20} />
          {mounted && getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#BC8477] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>

      {/* Search Dropdown */}
      <div 
        className={cn(
          "absolute top-full left-0 w-full bg-white border-b border-gray-100 transition-all duration-300 origin-top overflow-hidden",
          isSearchOpen ? "scale-y-100 opacity-100 h-[72px]" : "scale-y-0 opacity-0 h-0"
        )}
      >
        <form 
          onSubmit={handleSearchSubmit}
          className="h-full max-w-[800px] mx-auto px-6 flex items-center gap-4"
        >
          <Search size={20} className="text-gray-400" />
          <input 
            ref={searchInputRef}
            type="text"
            placeholder="Search for products, brands, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-full bg-transparent text-sm text-gray-900 focus:outline-none"
          />
          <button 
            type="button" 
            onClick={() => setIsSearchOpen(false)}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7371] hover:text-gray-900"
          >
            Close
          </button>
        </form>
      </div>
    </nav>
  );
}
