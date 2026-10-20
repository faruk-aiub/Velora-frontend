"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function VeloraNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success("Welcome to the Velora VIP Club! Check your inbox for your ৳500 voucher code.");
    }, 700);
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
      <div className="relative rounded-[36px] sm:rounded-[44px] overflow-hidden bg-gradient-to-br from-gray-950 via-[#18181B] to-slate-900 border border-gray-800 p-8 sm:p-14 lg:p-18 text-white shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BC8477]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center relative z-10 space-y-6">
          {/* Header Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BC8477]/15 text-[#E8C5BD] border border-[#BC8477]/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#BC8477]" />
            <span>Velora VIP Membership</span>
          </div>

          {/* Title & Description */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Unlock ৳500 Off Your First Order
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed max-w-xl mx-auto">
            Join over 45,000 members enjoying early access to limited edition drops, VIP private sales, and curated lifestyle recommendations.
          </p>

          {/* Perks list */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs font-semibold text-gray-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>৳500 Instant Voucher</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Priority Flash Sale Access</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Free Shipping on 1st Order</span>
            </span>
          </div>

          {/* Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="pt-4 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 bg-white/10 p-2 rounded-2xl border border-white/15 backdrop-blur-md shadow-inner">
                <div className="flex items-center gap-2.5 px-3 w-full sm:w-auto flex-1">
                  <Mail size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-white placeholder-gray-400 focus:outline-none"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#BC8477] hover:bg-[#A87569] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap active:scale-98"
                >
                  {isLoading ? (
                    <span>Joining...</span>
                  ) : (
                    <>
                      <span>Claim ৳500 Code</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-4 max-w-md mx-auto bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-5 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={22} />
              </div>
              <h4 className="font-bold text-white text-base">You&apos;re officially on the VIP list!</h4>
              <p className="text-xs text-emerald-200 mt-1">
                Your exclusive ৳500 promo voucher has been sent to <strong>{email}</strong>.
              </p>
            </motion.div>
          )}

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium pt-1">
            <ShieldCheck size={13} className="text-gray-400" />
            <span>We respect your inbox. No spam ever. Unsubscribe with 1 click anytime.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
