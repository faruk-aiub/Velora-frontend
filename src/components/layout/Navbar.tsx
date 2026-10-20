"use client";

import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  Heart, 
  Bell, 
  Sparkles, 
  ChevronDown, 
  ArrowRight,
  Package,
  LogOut,
  Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import axios from "@/lib/axios";
import { VeloraLogo } from "./VeloraLogo";
import Image from "next/image";

interface NavbarProps {
  variant?: 'transparent' | 'solid';
}

interface QuickSearchResult {
  id: string;
  title: string;
  slug: string;
  base_price?: number;
  price?: number;
  images?: { url: string }[];
  category?: { name: string };
}

const FEATURED_CATEGORIES = [
  { name: 'Leather Goods & Travel', slug: 'others-handmade-products', badge: 'Handcrafted' },
  { name: 'Home Living & Artisanal', slug: 'home-kitchen', badge: 'Artisan' },
  { name: 'Electronics & Audio', slug: 'electronics-gadgets', badge: 'Popular' },
  { name: 'Fashion & Essentials', slug: 'clothing-fashion', badge: 'Trending' },
];

const TRENDING_SEARCHES = [
  'Weekender Duffle Bag',
  'Artisan Planter Basket',
  'Electronics Cable Pouch',
  'Organic Pure Honey',
  'iPhone 15 Pro Max',
];

export function Navbar({ variant = 'solid' }: NavbarProps) {
  const isTransparentProp = variant === 'transparent';
  
  const openCart = useCartStore((state) => state.openCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<QuickSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle dynamic scroll state for glassmorphic transitions
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global keyboard shortcut for Command+K search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsAccountDropdownOpen(false);
        setIsShopHovered(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Poll for notifications if logged in
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const fetchNotifications = async () => {
      if (isAuthenticated) {
        try {
          const res = await axios.get('/notifications/unread-count');
          setUnreadCount(res.data.count || 0);
        } catch (error) {
          // Graceful fallback
        }
      }
    };

    if (mounted && isAuthenticated) {
      fetchNotifications();
      interval = setInterval(fetchNotifications, 20000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mounted, isAuthenticated]);

  // Focus search input when search modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Live search query autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
        const res = await fetch(`${apiUrl}/products?search=${encodeURIComponent(searchQuery.trim())}&limit=4`);
        if (res.ok) {
          const json = await res.json();
          setSearchResults(json.data || []);
        }
      } catch (err) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isTransparent = isTransparentProp && !isScrolled;

  return (
    <>
      {/* ── Main Modern Glassmorphic Header ── */}
      <header
        className={cn(
          "w-full z-40 sticky top-0 transition-all duration-300",
          isTransparent
            ? "bg-transparent text-white border-b border-white/10"
            : isScrolled
            ? "bg-[#FAF8F5]/90 backdrop-blur-xl text-stone-900 border-b border-stone-200/60 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.06)]"
            : "bg-[#FAF8F5] text-stone-900 border-b border-stone-200/40"
        )}
      >
        <div className={cn(
          "max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-12 flex items-center justify-between transition-all duration-300",
          isScrolled ? "h-16 sm:h-18" : "h-16 sm:h-20"
        )}>
          {/* Mobile Menu Trigger (Left side only) */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 -ml-1 rounded-xl transition-all duration-200",
                isTransparent 
                  ? "text-white hover:bg-white/10" 
                  : "text-stone-800 hover:bg-stone-200/50 hover:text-[#BC8477]"
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Maison Brand Logo */}
          <div className="flex items-center shrink-0">
            <VeloraLogo variant={isTransparent ? "white" : "dark"} size={36} />
          </div>

          {/* Desktop Luxury Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className={cn(
                "px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] rounded-full transition-all duration-200",
                pathname === "/"
                  ? "text-[#BC8477] bg-[#BC8477]/10"
                  : isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/40"
              )}
            >
              Home
            </Link>

            {/* Shop with Dropdown Hover Flyout */}
            <div 
              className="relative"
              onMouseEnter={() => setIsShopHovered(true)}
              onMouseLeave={() => setIsShopHovered(false)}
            >
              <Link
                href="/shop"
                className={cn(
                  "px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] rounded-full transition-all duration-200 flex items-center gap-1.5",
                  pathname.startsWith("/shop")
                    ? "text-[#BC8477] bg-[#BC8477]/10"
                    : isTransparent
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/40"
                )}
              >
                <span>Shop</span>
                <ChevronDown size={13} className={cn("transition-transform duration-200", isShopHovered && "rotate-180")} />
              </Link>

              {/* Flyout Menu */}
              {isShopHovered && (
                <div className="absolute top-full left-0 pt-2 w-[460px] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-stone-200/80 p-5 grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BC8477] block">
                        Curated Collections
                      </span>
                      <Link 
                        href="/shop?sort=created_at:desc" 
                        onClick={() => setIsShopHovered(false)}
                        className="flex items-center justify-between text-xs font-semibold text-stone-800 hover:text-[#BC8477] p-2 rounded-xl hover:bg-stone-50 transition-colors group"
                      >
                        <span>New Arrivals</span>
                        <span className="text-[9px] bg-[#BC8477]/15 text-[#BC8477] font-bold px-2 py-0.5 rounded-full">New</span>
                      </Link>
                      <Link 
                        href="/shop" 
                        onClick={() => setIsShopHovered(false)}
                        className="flex items-center justify-between text-xs font-semibold text-stone-800 hover:text-[#BC8477] p-2 rounded-xl hover:bg-stone-50 transition-colors"
                      >
                        <span>Best Selling Icons</span>
                        <Sparkles size={12} className="text-[#BC8477]" />
                      </Link>
                      <Link 
                        href="/shop?sort=price:desc" 
                        onClick={() => setIsShopHovered(false)}
                        className="flex items-center justify-between text-xs font-semibold text-stone-800 hover:text-[#BC8477] p-2 rounded-xl hover:bg-stone-50 transition-colors"
                      >
                        <span>Haute Luxury Tier</span>
                      </Link>
                    </div>

                    <div className="space-y-3 border-l border-stone-100 pl-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block">
                        Departments
                      </span>
                      {FEATURED_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/shop?category=${cat.slug}`}
                          onClick={() => setIsShopHovered(false)}
                          className="flex items-center justify-between text-xs font-medium text-stone-700 hover:text-[#BC8477] py-1.5 hover:translate-x-1 transition-all"
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[9px] text-stone-400">{cat.badge}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/categories"
              className={cn(
                "px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] rounded-full transition-all duration-200",
                pathname === "/categories"
                  ? "text-[#BC8477] bg-[#BC8477]/10"
                  : isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/40"
              )}
            >
              Categories
            </Link>

            <Link
              href="/about"
              className={cn(
                "px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] rounded-full transition-all duration-200",
                pathname === "/about"
                  ? "text-[#BC8477] bg-[#BC8477]/10"
                  : isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/40"
              )}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={cn(
                "px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] rounded-full transition-all duration-200",
                pathname === "/contact"
                  ? "text-[#BC8477] bg-[#BC8477]/10"
                  : isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/40"
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Suite (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
            {/* Desktop Pill Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-full border text-xs transition-all duration-200 group shadow-xs",
                isTransparent
                  ? "bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white"
                  : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-900"
              )}
              aria-label="Open search dialog"
            >
              <Search size={14} className="text-[#BC8477] group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[11px] tracking-wide text-stone-500">
                Search catalogue...
              </span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-semibold text-stone-400 bg-stone-100 rounded-md border border-stone-200/70">
                <Command size={10} />K
              </kbd>
            </button>

            {/* Mobile Search Icon Button (placed on right side as requested) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "sm:hidden w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200",
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-stone-700 hover:text-[#BC8477] hover:bg-stone-100"
              )}
              aria-label="Open search dialog"
            >
              <Search size={18} />
            </button>

            {/* Wishlist Link */}
            <Link
              href={mounted && isAuthenticated ? "/account?tab=wishlist" : "/login"}
              className={cn(
                "w-8 h-8 sm:w-auto sm:h-auto p-1.5 sm:p-2.5 flex items-center justify-center rounded-full transition-all duration-200 relative group",
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-stone-700 hover:text-[#BC8477] hover:bg-stone-100"
              )}
              aria-label="View Wishlist"
            >
              <Heart size={18} className="group-hover:scale-110 transition-transform" />
            </Link>

            {/* Account / User Menu */}
            <div className="relative">
              {mounted && isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                    className={cn(
                      "flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-full border text-xs font-semibold transition-all duration-200",
                      isTransparent
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        : "bg-white border-stone-200 text-stone-800 hover:border-stone-300 hover:bg-stone-50"
                    )}
                    aria-label="User account menu"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#BC8477] text-white flex items-center justify-center font-bold text-[9px] sm:text-[10px]">
                      {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline text-[11px] font-bold max-w-[80px] truncate">
                      {user?.first_name || 'Account'}
                    </span>
                    <ChevronDown size={12} className={cn("hidden sm:inline transition-transform text-stone-400", isAccountDropdownOpen && "rotate-180")} />
                  </button>

                  {/* Account Dropdown */}
                  {isAccountDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.12)] border border-stone-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-[10px] text-stone-400 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#BC8477] transition-colors"
                        >
                          <User size={14} />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#BC8477] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Package size={14} />
                            <span>My Orders</span>
                          </div>
                        </Link>
                        <Link
                          href="/account?tab=messages"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#BC8477] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Bell size={14} />
                            <span>Notifications</span>
                          </div>
                          {unreadCount > 0 && (
                            <span className="bg-[#BC8477] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/account?tab=wishlist"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#BC8477] transition-colors"
                        >
                          <Heart size={14} />
                          <span>Saved Wishlist</span>
                        </Link>
                      </div>

                      <div className="border-t border-stone-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountDropdownOpen(false);
                            router.push('/');
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "w-8 h-8 sm:w-auto sm:h-auto p-1.5 sm:p-2.5 flex items-center justify-center rounded-full transition-all duration-200 group",
                    isTransparent
                      ? "text-white hover:bg-white/10"
                      : "text-stone-700 hover:text-[#BC8477] hover:bg-stone-100"
                  )}
                  aria-label="Account Login"
                >
                  <User size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
              )}
            </div>

            {/* Luxury Cart Trigger Pill */}
            <button
              onClick={openCart}
              className={cn(
                "flex items-center justify-center transition-all duration-300 shadow-xs relative group",
                "w-8 h-8 sm:w-auto sm:px-3.5 sm:py-2 rounded-full",
                isTransparent
                  ? "bg-white text-stone-900 hover:bg-white/90 hover:scale-105"
                  : "bg-[#181514] text-white hover:bg-[#2A2422] hover:scale-105 shadow-[0_4px_16px_rgba(24,21,20,0.18)]"
              )}
              aria-label="View Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag size={15} className="transition-transform group-hover:-rotate-6" />
                {mounted && getTotalItems() > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#BC8477] text-white text-[9px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                    {getTotalItems()}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold tracking-wider ml-2">
                Cart
              </span>
              {mounted && getTotalPrice() > 0 && (
                <span className="hidden md:inline pl-1.5 border-l border-white/20 text-xs font-semibold text-[#BC8477]">
                  ৳{getTotalPrice().toLocaleString()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Interactive Command Search Modal ── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center px-6 py-4 border-b border-stone-100">
              <Search size={20} className="text-[#BC8477] flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search timeless bags, planters, gourmet, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-1 text-base text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              >
                <X size={18} />
              </button>
            </form>

            {/* Results or Trending Tags */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isSearching ? (
                <div className="py-8 text-center text-xs font-semibold text-stone-400 animate-pulse">
                  Searching collection...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block mb-2">
                    Instant Product Matches ({searchResults.length})
                  </span>
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id || prod.slug}
                      href={`/product/${prod.slug}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-200/80 group"
                    >
                      <div className="flex items-center gap-3">
                        {prod.images?.[0]?.url && (
                          <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden relative flex-shrink-0">
                            <Image
                              src={prod.images[0].url}
                              alt={prod.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#BC8477] transition-colors line-clamp-1">
                            {prod.title}
                          </h4>
                          <span className="text-[11px] text-stone-400">
                            {prod.category?.name || 'Velora Collection'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-stone-900">
                          ৳{Number(prod.base_price || prod.price || 0).toLocaleString()}
                        </span>
                        <ArrowRight size={14} className="text-stone-300 group-hover:text-[#BC8477] group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-bold text-stone-800">No products found</p>
                  <p className="text-xs text-stone-400 mt-1">Try searching for &quot;bag&quot;, &quot;planter&quot;, or &quot;organic&quot;</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BC8477] block">
                    Trending Curations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((query) => (
                      <button
                        key={query}
                        type="button"
                        onClick={() => {
                          setSearchQuery(query);
                        }}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium text-stone-700 bg-stone-100 hover:bg-[#BC8477]/10 hover:text-[#BC8477] transition-colors border border-stone-200/50"
                      >
                        {query}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Quick navigation</span>
                    <Link
                      href="/shop"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[#BC8477] font-bold hover:underline flex items-center gap-1"
                    >
                      Browse full catalog <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Slide-Out Drawer ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl p-6 flex flex-col justify-between z-50 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                <VeloraLogo variant="dark" size={32} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-stone-500 hover:bg-stone-200/50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="py-6 space-y-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-bold text-stone-900 hover:text-[#BC8477] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-base font-bold text-stone-900 hover:text-[#BC8477] transition-colors"
                >
                  <span>Shop Collection</span>
                  <span className="text-[10px] bg-[#BC8477] text-white px-2 py-0.5 rounded-full font-bold">New</span>
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-bold text-stone-900 hover:text-[#BC8477] transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-bold text-stone-900 hover:text-[#BC8477] transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-bold text-stone-900 hover:text-[#BC8477] transition-colors"
                >
                  Contact & Concierge
                </Link>
              </div>

              {/* Mobile Quick Featured Categories */}
              <div className="pt-4 border-t border-stone-200">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BC8477] block mb-3">
                  Featured Departments
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-stone-600">
                  {FEATURED_CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop?category=${c.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white border border-stone-200/70 hover:border-[#BC8477] hover:text-[#BC8477] transition-all"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer Status */}
            <div className="pt-6 border-t border-stone-200 text-xs">
              {mounted && isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#BC8477] text-white flex items-center justify-center font-bold text-xs">
                      {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{user?.first_name} {user?.last_name}</p>
                      <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] text-[#BC8477] hover:underline">
                        View Account
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      router.push('/');
                    }}
                    className="p-2 text-stone-400 hover:text-red-600"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-3 text-center bg-[#181514] text-white font-bold rounded-xl hover:bg-[#2A2422] transition-colors"
                >
                  Sign In to Velora
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
