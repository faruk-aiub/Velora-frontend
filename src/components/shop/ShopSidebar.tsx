'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  {
    name: 'Electronics & Gadgets',
    subcategories: ['Smartphone', 'Laptop', 'Desktop Computer', 'Tablet', 'Smart Watch', 'Headphone / Earbuds', 'Bluetooth Speaker', 'Camera', 'Gaming Console', 'Computer Accessories', 'Chargers & Cables']
  },
  {
    name: 'Fashion & Clothing',
    subcategories: ['T-shirt', 'Shirt', 'Jeans', 'Pants', 'Jacket', 'Hoodie', 'Shoes', 'Sandals', 'Bags', 'Watches', 'Sunglasses', 'Fashion Accessories']
  },
  {
    name: 'Beauty & Personal Care',
    subcategories: ['Skincare Products', 'Makeup Products', 'Perfume', 'Hair Care Products', 'Grooming Products', 'Beauty Tools']
  },
  {
    name: 'Home & Living',
    subcategories: ['Furniture', 'Bed & Mattress', 'Sofa', 'Table & Chair', 'Home Decor', 'Lighting', 'Kitchen Tools', 'Storage Items', 'Curtains', 'Carpets']
  },
  {
    name: 'Kitchen & Appliances',
    subcategories: ['Refrigerator', 'Microwave Oven', 'Blender', 'Rice Cooker', 'Electric Kettle', 'Coffee Maker', 'Cookware', 'Dinner Set']
  },
  {
    name: 'Books & Stationery',
    subcategories: ['Books', 'Notebooks', 'Pens', 'Office Supplies', 'Educational Materials', 'Art Supplies']
  },
  {
    name: 'Sports & Fitness',
    subcategories: ['Gym Equipment', 'Sports Shoes', 'Fitness Tracker', 'Yoga Mat', 'Sports Accessories', 'Bicycles']
  },
  {
    name: 'Kids & Baby Products',
    subcategories: ['Baby Clothes', 'Toys', 'School Bags', 'Baby Care Products', 'Kids Accessories']
  },
  {
    name: 'Automotive',
    subcategories: ['Car Accessories', 'Bike Accessories', 'Helmet', 'Car Electronics', 'Cleaning Products']
  },
  {
    name: 'Pet Supplies',
    subcategories: ['Pet Food', 'Pet Toys', 'Pet Accessories', 'Pet Care Products']
  },
  {
    name: 'Grocery & Food',
    subcategories: ['Snacks', 'Beverages', 'Dry Food', 'Fresh Food', 'Cooking Ingredients']
  },
  {
    name: 'Digital Products',
    subcategories: ['Software', 'Online Courses', 'E-books', 'Subscriptions', 'Templates']
  },
  {
    name: 'Others',
    subcategories: ['Gifts', 'Jewelry', 'Watches', 'Handmade Products', 'Travel Accessories']
  }
];

export function ShopSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category');
  const currentSubcategory = searchParams.get('subcategory');
  
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  // Sync state with URL params
  useEffect(() => {
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
  }, [searchParams]);

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('min_price', minPrice);
    else params.delete('min_price');
    
    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const [openCategory, setOpenCategory] = useState<string | null>(currentCategory || 'Fashion & Clothing');

  const toggleCategory = (name: string) => {
    setOpenCategory(openCategory === name ? null : name);
    
    // Update URL with category (clear subcategory)
    const params = new URLSearchParams(searchParams.toString());
    if (openCategory !== name) {
      params.set('category', name);
    } else {
      params.delete('category');
    }
    params.delete('subcategory');
    router.push(`${pathname}?${params.toString()}`);
  };

  const selectSubcategory = (categoryName: string, subName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', categoryName);
    params.set('subcategory', subName);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <SlidersHorizontal size={20} className="text-[#3A3331]" />
        <h2 className="font-serif text-2xl text-[#3A3331] font-light">Filters</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#BC8477] uppercase mb-4">Categories</h3>
          <div className="space-y-2">
            {CATEGORIES.map((category) => {
              const isOpen = openCategory === category.name;
              
              return (
                <div key={category.name} className="border-b border-[#E8E1DE] last:border-0 pb-2">
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between py-2 text-left group"
                  >
                    <span className={cn(
                      "text-sm transition-colors duration-200",
                      isOpen ? "text-[#BC8477] font-medium" : "text-[#3A3331] group-hover:text-[#BC8477]"
                    )}>
                      {category.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform duration-300 text-[#7A7371]",
                        isOpen && "rotate-180 text-[#BC8477]"
                      )}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <ul className="pt-2 pb-4 space-y-2 pl-4">
                          {category.subcategories.map((sub) => (
                            <li key={sub}>
                              <button 
                                onClick={() => selectSubcategory(category.name, sub)}
                                className={cn(
                                  "text-sm hover:text-[#BC8477] transition-colors flex items-center gap-2 group w-full text-left",
                                  currentSubcategory === sub ? "text-[#BC8477] font-medium" : "text-[#7A7371]"
                                )}
                              >
                                <div className={cn(
                                  "w-1 h-1 rounded-full transition-colors",
                                  currentSubcategory === sub ? "bg-[#BC8477]" : "bg-[#D5CFCD] group-hover:bg-[#BC8477]"
                                )} />
                                {sub}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Filter */}
        <div className="pt-6 border-t border-[#E8E1DE]">
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#BC8477] uppercase mb-4">Price Range</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                placeholder="$ Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 bg-transparent border-b border-[#E8E1DE] text-sm text-[#3A3331] focus:outline-none focus:border-[#BC8477]" 
              />
              <span className="text-[#7A7371]">-</span>
              <input 
                type="number" 
                placeholder="$ Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 bg-transparent border-b border-[#E8E1DE] text-sm text-[#3A3331] focus:outline-none focus:border-[#BC8477]" 
              />
            </div>
            <button 
              onClick={applyPriceFilter}
              className="w-full h-10 border border-[#BC8477] text-[#BC8477] text-xs font-bold tracking-[0.1em] uppercase hover:bg-[#BC8477] hover:text-white transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
