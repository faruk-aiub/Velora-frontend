import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, ShieldCheck, RefreshCw, Headset } from "lucide-react";
import { BestSellingProducts } from "@/components/home/BestSellingProducts";
import { GSAPPageAnimator } from "@/components/animations/GSAPPageAnimator";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CuratedLifestyleBento } from "@/components/home/CuratedLifestyleBento";
import { FlashDealSpotlight } from "@/components/home/FlashDealSpotlight";
import { VeloraStandard } from "@/components/home/VeloraStandard";
import { CustomerStories } from "@/components/home/CustomerStories";
import { CommunityGallery } from "@/components/home/CommunityGallery";
import { VeloraNewsletter } from "@/components/home/VeloraNewsletter";

import { fetchCategoryTree } from "@/lib/categories";

export const revalidate = 60; // Cache SSR route for 60 seconds

export default async function HomePage() {
  const apiUrl = process.env.INTERNAL_API_URL || 'http://127.0.0.1:3000/api/v1';

  // Parallel server fetch with fast fallback
  const [productsRes, categories] = await Promise.all([
    fetch(`${apiUrl}/products?limit=10`, {
      next: { revalidate: 60 },
    }).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
    fetchCategoryTree(),
  ]);

  const initialProducts = productsRes.data || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="solid" />
      <GSAPPageAnimator>
      {/* ── Dynamic Hero Slider Section ── */}
      <HeroSlider />

      {/* ── Features Strip ── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 mt-4 sm:mt-6 relative z-20 features-strip">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over ৳500" },
            { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment" },
            { icon: RefreshCw, title: "Easy Returns", desc: "30 days return policy" },
            { icon: Headset, title: "24/7 Support", desc: "Dedicated support" }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4 feature-item min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-[#BC8477] shrink-0">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{feature.title}</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium truncate">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      <BestSellingProducts initialProducts={initialProducts} initialCategories={categories} />

      {/* ── Curated Lifestyle Bento ── */}
      <CuratedLifestyleBento />

      {/* ── Flash Deal Spotlight ── */}
      <FlashDealSpotlight />

      {/* ── The Velora Standard (Trust Architecture) ── */}
      <VeloraStandard />

      {/* ── #StyledWithVelora Community Gallery ── */}
      <CommunityGallery />

      {/* ── Velora VIP Club & Voucher Newsletter ── */}
      <VeloraNewsletter />

      {/* ── Verified Customer Stories (Real Experiences from Real Shoppers) ── */}
      <CustomerStories />
      
      </GSAPPageAnimator>
      <Footer />
    </div>
  );
}
