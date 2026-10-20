"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ChevronRight, 
  Grid3X3, 
  Flame, 
  ShieldCheck, 
  SlidersHorizontal,
  X
} from "lucide-react";
import { CategoryTree } from "@/lib/categories";

export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'electronics-gadgets': '/hero-gadgets.jpg',
  'fashion-clothing': '/hero-clothing.jpg',
  'beauty-personal-care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
  'home-living': '/hero-home-living.jpg',
  'kitchen-appliances': '/hero-kitchen.jpg',
  'books-stationery': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop',
  'sports-fitness': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
  'kids-baby-products': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop',
  'automotive': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
  'pet-supplies': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop',
  'grocery-food': 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
  'others': '/hero-nakshi-kantha.jpg',
};

export const CATEGORY_CAPTIONS: Record<string, string> = {
  'electronics-gadgets': 'Smartphones, laptops, high-fidelity audio, and modern smart devices.',
  'fashion-clothing': 'Curated daily essentials, seasonal tailoring, outerwear, and accessories.',
  'beauty-personal-care': 'Organic skincare, luxury fragrances, wellness, and self-care staples.',
  'home-living': 'Contemporary furnishings, ambient lighting, decor, and cozy textiles.',
  'kitchen-appliances': 'Precision culinary equipment, smart blenders, coffee makers, and cookware.',
  'books-stationery': 'Inspiring literature, academic books, premium journals, and writing tools.',
  'sports-fitness': 'Gym strength gear, yoga mats, running essentials, and athletic tracking.',
  'kids-baby-products': 'Organic baby apparel, montessori toys, nursing care, and nursery goods.',
  'automotive': 'Motorcycle helmets, car interior electronics, detailing, and ride accessories.',
  'pet-supplies': 'Nutritious premium pet food, interactive toys, grooming, and cozy beds.',
  'grocery-food': 'Artisan pantry staples, fresh organic produce, gourmet snacks, and drinks.',
  'others': 'Artisan handcrafted creations, luxury watches, fine jewelry, and unique gifts.',
};

export const CATEGORY_BADGES: Record<string, string> = {
  'electronics-gadgets': 'Trending Tech',
  'fashion-clothing': 'New Season',
  'beauty-personal-care': 'Top Rated',
  'home-living': 'Best for Home',
  'kitchen-appliances': 'Popular',
  'sports-fitness': 'Active Living',
};

interface CategoriesExplorerProps {
  categories: CategoryTree[];
}

export function CategoriesExplorer({ categories }: CategoriesExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "All Departments", count: categories.length },
    { id: "tech", label: "Tech & Gadgets", slugs: ["electronics-gadgets", "automotive"] },
    { id: "lifestyle", label: "Fashion & Lifestyle", slugs: ["fashion-clothing", "beauty-personal-care", "others"] },
    { id: "home", label: "Home & Kitchen", slugs: ["home-living", "kitchen-appliances"] },
    { id: "daily", label: "Daily & Wellness", slugs: ["grocery-food", "sports-fitness", "pet-supplies", "kids-baby-products", "books-stationery"] },
  ];

  const filteredCategories = useMemo(() => {
    let result = categories;

    // Filter by Tab
    if (selectedFilter !== "all") {
      const activeTab = filterTabs.find(t => t.id === selectedFilter);
      if (activeTab && activeTab.slugs) {
        result = result.filter(c => activeTab.slugs.includes(c.slug));
      }
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(cat => {
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesCaption = (CATEGORY_CAPTIONS[cat.slug] || "").toLowerCase().includes(query);
        const matchesSub = (cat.children || []).some(sub => sub.name.toLowerCase().includes(query));
        return matchesName || matchesCaption || matchesSub;
      });
    }

    return result;
  }, [categories, selectedFilter, searchQuery]);

  // Featured Categories for Spotlight Banner (Electronics, Fashion, Home)
  const spotlightCategories = useMemo(() => {
    const slugs = ['electronics-gadgets', 'fashion-clothing', 'home-living'];
    return slugs
      .map(s => categories.find(c => c.slug === s))
      .filter(Boolean) as CategoryTree[];
  }, [categories]);

  const getImage = (cat: CategoryTree) => {
    if (cat.image_url && !cat.image_url.includes('picsum.photos')) {
      return cat.image_url;
    }
    return CATEGORY_IMAGE_MAP[cat.slug] || '/placeholder.jpg';
  };

  return (
    <div className="space-y-16">
      {/* ── Search & Filter Control Bar ── */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-30">
        <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories (e.g., Electronics, Fashion, Kitchen, Smartphone)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-gray-50 border border-gray-200/80 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/30 focus:border-[#BC8477] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Total Results Counter */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 px-4 py-2 bg-gray-50 rounded-2xl shrink-0 border border-gray-100">
              <Layers size={14} className="text-[#BC8477]" />
              <span>{filteredCategories.length} Departments Found</span>
            </div>
          </div>

          {/* Department Quick Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar border-t border-gray-100 mt-3">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? "bg-[#BC8477] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Featured Spotlight Bento (Shows when not searching) ── */}
      {!searchQuery && selectedFilter === "all" && spotlightCategories.length >= 3 && (
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#BC8477] mb-1">
                <Flame size={14} />
                <span>Featured Collections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Most Popular Categories
              </h2>
            </div>
            <Link 
              href="/shop" 
              className="text-xs sm:text-sm font-bold text-gray-500 hover:text-[#BC8477] transition-colors flex items-center gap-1 group"
            >
              <span>View All Products</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Spotlight 1: Electronics (Large Lead Card) */}
            <div className="lg:col-span-6 relative rounded-[36px] overflow-hidden group shadow-md min-h-[420px] flex flex-col justify-end p-8 sm:p-10 border border-gray-200/80">
              <Image
                src={getImage(spotlightCategories[0])}
                alt={spotlightCategories[0].name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.88]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                  <Sparkles size={12} />
                  {CATEGORY_BADGES[spotlightCategories[0].slug] || "Featured"}
                </span>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {spotlightCategories[0].name}
                  </h3>
                  <p className="text-sm text-gray-200 font-medium max-w-lg mt-2 line-clamp-2">
                    {CATEGORY_CAPTIONS[spotlightCategories[0].slug]}
                  </p>
                </div>

                {/* Subcategory Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(spotlightCategories[0].children || []).slice(0, 4).map((sub) => (
                    <span 
                      key={sub.id}
                      className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-white border border-white/10"
                    >
                      {sub.name}
                    </span>
                  ))}
                  {(spotlightCategories[0].children?.length || 0) > 4 && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-300">
                      +{(spotlightCategories[0].children?.length || 0) - 4} more
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/category/${spotlightCategories[0].slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#BC8477] hover:bg-[#A87569] text-white font-bold text-sm shadow-lg transition-all group-hover:gap-3"
                  >
                    <span>Explore Department</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Spotlight 2 & 3: Fashion & Home (Stacked) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {spotlightCategories.slice(1, 3).map((cat) => (
                <div 
                  key={cat.id} 
                  className="relative rounded-[36px] overflow-hidden group shadow-md min-h-[200px] lg:min-h-[220px] flex flex-col justify-end p-6 sm:p-8 border border-gray-200/80"
                >
                  <Image
                    src={getImage(cat)}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.88]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                        {CATEGORY_BADGES[cat.slug] || "Popular"}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-300 font-medium line-clamp-1 max-w-sm">
                        {CATEGORY_CAPTIONS[cat.slug]}
                      </p>
                    </div>

                    <Link
                      href={`/category/${cat.slug}`}
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-gray-900 shadow-md group-hover:bg-[#BC8477] group-hover:text-white transition-all shrink-0"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All Categories Modern Grid ── */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : "All Product Categories"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Select a category to view authentic collections, verified products, and curated subcategories.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400">
            <ShieldCheck size={16} className="text-[#BC8477]" />
            <span>100% Quality Inspected</span>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F5EE] text-[#BC8477] flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No categories found</h3>
            <p className="text-xs text-gray-500 mt-2">
              We couldn't find any category matching "{searchQuery}". Try searching for Electronics, Fashion, or Home.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#BC8477] text-white text-xs font-bold shadow-md hover:bg-[#A87569] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => {
              const imageSrc = getImage(cat);
              const caption = CATEGORY_CAPTIONS[cat.slug] || "Curated premium items verified for durability and modern lifestyle.";
              const subcategories = cat.children || [];
              const badge = CATEGORY_BADGES[cat.slug];

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-[32px] overflow-hidden border border-gray-100/80 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col group hover:-translate-y-1.5"
                >
                  {/* Category Image Header */}
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className="relative w-full h-56 overflow-hidden bg-gray-100 block"
                  >
                    <Image
                      src={imageSrc}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Top Status Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      {badge ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#BC8477] shadow-sm">
                          {badge}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white border border-white/10">
                          Curated
                        </span>
                      )}

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                        {subcategories.length > 0 ? `${subcategories.length} Types` : 'Catalog'}
                      </span>
                    </div>

                    {/* Bottom Category Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-sm group-hover:text-[#BC8477] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                  </Link>

                  {/* Card Content & Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
                      {caption}
                    </p>

                    {/* Subcategories Chips */}
                    {subcategories.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Popular Subcategories
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {subcategories.slice(0, 3).map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/category/${sub.slug}`}
                              className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-[#BC8477]/10 hover:text-[#BC8477] text-[11px] font-semibold text-gray-600 transition-colors border border-gray-100"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          {subcategories.length > 3 && (
                            <Link
                              href={`/category/${cat.slug}`}
                              className="px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-[10px] font-bold text-gray-400 transition-colors"
                            >
                              +{subcategories.length - 3}
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Link Button */}
                    <div className="pt-2">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-[#BC8477] text-gray-800 hover:text-white font-bold text-xs flex items-center justify-between transition-all group-hover:bg-[#BC8477] group-hover:text-white"
                      >
                        <span>Browse {cat.name}</span>
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Category Assurance Bottom Banner ── */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-8">
        <div className="bg-[#F7F5EE] rounded-[40px] border border-[#E8E1DE] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BC8477] bg-white px-3 py-1 rounded-full border border-gray-200">
              The Velora Promise
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Looking for something specific?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Every single product listed under our categories is 100% verified authentic, backed by a 7-day return policy and dedicated customer support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/shop"
              className="px-8 py-3.5 rounded-full bg-[#BC8477] hover:bg-[#A87569] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
            >
              <span>Explore All Products</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold border border-gray-200 transition-colors"
            >
              <span>Need Help?</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
