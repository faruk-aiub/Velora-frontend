"use client";

import { useState } from "react";
import { Star, ShieldCheck, ThumbsUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ReviewItem {
  id: string;
  name: string;
  initials: string;
  avatarGradient: string;
  location: string;
  category: "all" | "tech" | "fashion" | "home";
  product: string;
  rating: number;
  date: string;
  deliveryTag: string;
  title: string;
  comment: string;
  likes: number;
}

const reviewsData: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Tanvir Ahmed",
    initials: "TA",
    avatarGradient: "from-blue-600 to-indigo-800 text-white",
    location: "Gulshan-2, Dhaka",
    category: "tech",
    product: "Sony WH-1000XM5 Noise-Canceling Wireless Headphones",
    rating: 5,
    date: "Yesterday",
    deliveryTag: "Same-Day Express Delivery",
    title: "Registered official warranty on Sony portal without any issues",
    comment: "Ordered at 11 AM using Same-Day Express in Dhaka and the delivery rider handed over the parcel at 4:30 PM. The factory seal was 100% intact with the official distributor warranty card inside. Registered the serial number on Sony Asia support portal and it validated immediately. The active noise cancellation completely blocks out Dhaka traffic noise during work calls.",
    likes: 54,
  },
  {
    id: "rev-2",
    name: "Kazi Ashiqur Rahman",
    initials: "KA",
    avatarGradient: "from-amber-600 to-amber-900 text-white",
    location: "Dhanmondi 27, Dhaka",
    category: "fashion",
    product: "Tissot PRX Powermatic 80 Automatic Luxury Watch",
    rating: 5,
    date: "3 days ago",
    deliveryTag: "Inspected at Doorstep",
    title: "Authentic Swiss automatic with stamped dealer warranty card",
    comment: "Buying high-value mechanical watches online in Bangladesh always felt risky, but Velora customer support shared live photos of the case back and warranty card serial before dispatch. The waffle blue dial catches sunlight beautifully and the 80-hour power reserve ran through the entire weekend without winding. Absolutely top-tier service.",
    likes: 47,
  },
  {
    id: "rev-3",
    name: "Farhan Kabir",
    initials: "FK",
    avatarGradient: "from-slate-700 to-slate-950 text-white",
    location: "Nasirabad Housing, Chittagong",
    category: "tech",
    product: "Apple MacBook Air M2 13.6-inch (Space Gray, 256GB)",
    rating: 5,
    date: "5 days ago",
    deliveryTag: "Chittagong 24h Delivery",
    title: "Battery cycle count was 0 upon initial boot",
    comment: "Shipped to Chittagong within 24 hours. The packaging was top-notch with thick bubble wrap and tamper-evident security tape. Turned it on and checked the system hardware report: battery cycle count was exactly 0 and Apple 1-year global warranty activated automatically. Very competitive pricing compared to local retail shops.",
    likes: 62,
  },
  {
    id: "rev-4",
    name: "Shabbir Hossain",
    initials: "SH",
    avatarGradient: "from-emerald-600 to-teal-800 text-white",
    location: "Mirpur DOHS, Dhaka",
    category: "fashion",
    product: "Levi’s 511 Slim Fit Stretch Denim Jeans (Clean Indigo)",
    rating: 5,
    date: "1 week ago",
    deliveryTag: "Verified Fit on Delivery",
    title: "Rider waited patiently while I checked the waist size",
    comment: "The most convenient part was that the delivery rider gladly waited while I unboxed the package to check the waist size and original Levi's red tab branding. Fabric has the right amount of elastane stretch for comfortable daily motorcycle commutes. Accurate sizing chart.",
    likes: 39,
  },
  {
    id: "rev-5",
    name: "Nusrat Jahan Chowdhury",
    initials: "NJ",
    avatarGradient: "from-purple-600 to-indigo-900 text-white",
    location: "Sector 7, Uttara, Dhaka",
    category: "home",
    product: "Samsung 345L Digital Inverter Double Door Refrigerator",
    rating: 5,
    date: "1 week ago",
    deliveryTag: "Apartment Delivery & Setup",
    title: "Delivered to 3rd floor apartment without a single scratch",
    comment: "The two-person delivery team handled our narrow staircase with utmost care and placed the refrigerator directly in our kitchen. The inverter compressor is practically silent, keeping perishables fresh for over 10 days. Official Samsung Bangladesh 10-year compressor warranty papers were handed over.",
    likes: 51,
  },
  {
    id: "rev-6",
    name: "Sadia Islam",
    initials: "SI",
    avatarGradient: "from-rose-600 to-pink-800 text-white",
    location: "Banani, Dhaka",
    category: "fashion",
    product: "18K Gold Plated Zirconia Celestial Crescent Moon Necklace",
    rating: 5,
    date: "2 weeks ago",
    deliveryTag: "Gift Packaging Included",
    title: "Exquisite luster and no discoloration after daily wear",
    comment: "Arrived in an elegant velvet keepsake jewelry box with a certificate card. I have been wearing it continuously for over two weeks, including during workouts and showers, and there is zero greening or tarnishing on the 18K gold plating. Will order again as gifts for my sisters.",
    likes: 43,
  },
  {
    id: "rev-7",
    name: "Mahmudul Hasan",
    initials: "MH",
    avatarGradient: "from-teal-600 to-cyan-800 text-white",
    location: "Bashundhara R/A, Dhaka",
    category: "home",
    product: "Mid-Century Velvet Accent Armchair with Solid Oak Legs",
    rating: 5,
    date: "2 weeks ago",
    deliveryTag: "Pre-Assembled Delivery",
    title: "Solid oak wood legs with floor protectors pre-installed",
    comment: "The emerald velvet texture is rich and stain-resistant. The solid oak legs come with pre-fitted felt pads so our marble tiles stay scratch-free. Assembly was as simple as hand-screwing the legs in 5 minutes. Outstanding build quality that feels much more expensive than it costs.",
    likes: 36,
  },
  {
    id: "rev-8",
    name: "Ayesha Siddiqua",
    initials: "AS",
    avatarGradient: "from-[#BC8477] to-[#7E4C41] text-white",
    location: "Kumarpara, Sylhet",
    category: "home",
    product: "Fellow Stagg EKG Precision Gooseneck Electric Kettle",
    rating: 5,
    date: "3 weeks ago",
    deliveryTag: "Courier to Sylhet",
    title: "Precise water temperature hold for specialty V60 coffee",
    comment: "Delivered safely to Sylhet in 48 hours. The laminar flow from the fluted gooseneck spout gives pinpoint pour control for light-roast specialty coffee. The PID controller holds water at 93°C steadily without fluctuating. Finding this gear locally in BD at standard pricing was impossible until Velora.",
    likes: 48,
  },
];

export function CustomerStories() {
  const [activeFilter, setActiveFilter] = useState<"all" | "tech" | "fashion" | "home">("all");
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [reviewsList, setReviewsList] = useState(reviewsData);

  const handleToggleLike = (id: string) => {
    const isLiked = likedReviews[id];
    setLikedReviews((prev) => ({ ...prev, [id]: !isLiked }));
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: isLiked ? r.likes - 1 : r.likes + 1 } : r))
    );
    if (!isLiked) {
      toast.success("Thank you for finding this review helpful!");
    }
  };

  const filteredReviews = activeFilter === "all" 
    ? reviewsList 
    : reviewsList.filter((r) => r.category === activeFilter);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
      {/* Header with Verified Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Star size={13} className="fill-amber-500 text-amber-500" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Real Experiences from Real Shoppers
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-2 max-w-xl">
            Honest, unfiltered feedback from verified buyers across Bangladesh detailing product authenticity, packaging, and fulfillment.
          </p>
        </div>

        {/* Global Rating Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 flex items-center gap-4 self-start md:self-auto shadow-xs">
          <div className="text-3xl sm:text-4xl font-black text-gray-900 font-mono tracking-tight">
            4.9
          </div>
          <div>
            <div className="flex text-amber-400 gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Based on 3,450+ Verified Orders
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {[
          { id: "all", label: "All Reviews" },
          { id: "tech", label: "Tech & Audio" },
          { id: "fashion", label: "Fashion & Watches" },
          { id: "home", label: "Home & Appliances" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? "bg-gray-900 text-white shadow-md scale-102"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Cards Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        <AnimatePresence>
          {filteredReviews.map((review) => {
            const isLiked = likedReviews[review.id];
            return (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.02)] hover:shadow-[0_16px_35px_rgb(0,0,0,0.06)] hover:border-[#BC8477]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Header: Initials Avatar, Name, Location */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Initials Avatar (No People Photos) */}
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.avatarGradient} flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider shadow-xs flex-shrink-0`}
                      >
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{review.name}</h4>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">{review.location}</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={12} className="text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Star Rating, Date & Delivery Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-3 pt-1">
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {review.date}
                    </span>
                  </div>

                  {/* Delivery Tag Pill */}
                  <div className="mb-3.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      <CheckCircle2 size={11} className="text-[#BC8477]" />
                      <span>{review.deliveryTag}</span>
                    </span>
                  </div>

                  {/* Title & Authentic Review Comment */}
                  <h5 className="font-bold text-sm text-gray-900 mb-2 leading-snug">
                    &ldquo;{review.title}&rdquo;
                  </h5>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mb-6">
                    {review.comment}
                  </p>
                </div>

                {/* Footer: Purchased Product Tag & Interactive Helpful Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 truncate">
                    <span className="text-gray-400 flex-shrink-0">Bought:</span>
                    <span className="text-gray-900 font-bold truncate">{review.product}</span>
                  </div>

                  <button
                    onClick={() => handleToggleLike(review.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isLiked
                        ? "bg-[#BC8477]/15 text-[#BC8477]"
                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                    title="Mark this review as helpful"
                  >
                    <ThumbsUp size={12} className={isLiked ? "fill-[#BC8477]" : ""} />
                    <span>{review.likes}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
