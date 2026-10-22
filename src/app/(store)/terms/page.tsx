import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  FileText,
  Scale,
  CheckCircle2,
  ArrowRight,
  Clock,
  AlertCircle,
  Truck,
  CreditCard,
  RefreshCw,
  Mail
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Velora",
  description: "Official Terms and Conditions governing your use of Velora's website, marketplace, account registration, and fulfillment services in Bangladesh.",
};

export default function TermsPage() {
  const lastUpdated = "October 22, 2026";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: Scale,
      content: `Welcome to Velora ("Velora", "we", "us", or "our"). These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "Customer", or "you") and Velora Lifestyle & E-Commerce Ltd., having its flagship experience center located at Agargoan, Dhaka 1229, Bangladesh.

By registering an account, browsing our catalog, placing an order, or otherwise utilizing any services provided at velora.com (collectively, the "Platform"), you expressly agree to be bound by these Terms and our Privacy Policy. If you do not unconditionally agree to these Terms, you must immediately cease accessing or using the Platform.`
    },
    {
      id: "account-registration",
      title: "2. Account Registration & Security",
      icon: ShieldCheck,
      content: `To access select features—including order history, wishlist curation, loyalty rewards and rapid checkout—you must register an account.

• Eligibility: You must be at least 18 years of age or possess legal parental/guardian consent under the laws of the People's Republic of Bangladesh.
• Accurate Information: You agree to provide true, accurate, current, and complete details (legal name, valid mobile number, and email address). Providing fraudulent or deceptive contact information constitutes a breach of these Terms.
• Credential Confidentiality: You are solely responsible for maintaining the confidentiality of your account credentials. You agree to immediately notify Velora Concierge at support@velora.com upon suspecting any unauthorized access or breach of your credentials.`
    },
    {
      id: "authenticity-pricing",
      title: "3. Authenticity Guarantee & Pricing",
      icon: CheckCircle2,
      content: `Velora maintains a strict zero-tolerance policy against counterfeit, replica, or substandard goods.

• 100% Genuine Guarantee: All items featured in our collections spanning premium electronics, fashion timepieces, artisanal home decor, and leather goods are sourced directly from verified manufacturer distributors and authenticated craftsmen.
• Currency & Taxes: All prices listed on the Platform are in Bangladeshi Taka (BDT / ৳) and include applicable statutory Value Added Tax (VAT) unless explicitly specified otherwise.
• Pricing Discrepancies: While we employ automated accuracy protocols, typographical or system pricing errors may occur. In such rare events, Velora reserves the right to notify you before order dispatch to confirm the corrected price or issue a full immediate refund if you decline.`
    },
    {
      id: "orders-payments",
      title: "4. Orders, Payment & Anti-Fraud Protocols",
      icon: CreditCard,
      content: `Order placement constitutes an offer to purchase under these Terms, subject to acceptance and stock verification by Velora.

• Payment Channels: We accept Cash on Delivery (COD), Mobile Financial Services (bKash, Nagad, Rocket), and SSL-encrypted domestic and international Visa, MasterCard, and American Express cards.
• Verification: To protect shoppers against unauthorized card usage or fake COD bookings, Velora reserves the right to perform automated OTP verification or call you to confirm dispatch for high-value orders.
• Order Cancellation: Velora reserves the unilateral right to refuse or cancel orders exhibiting signs of automated bot activity, bulk unauthorized resale, or previous fraudulent COD rejection history.`
    },
    {
      id: "shipping-delivery",
      title: "5. Nationwide Fulfillment & Delivery",
      icon: Truck,
      content: `We coordinate with certified express courier networks to ensure swift and safe doorstep dispatch across all 64 districts of Bangladesh.

• Delivery Timelines: Estimated delivery within metropolitan Dhaka is 24 to 48 hours. Regional and divisional deliveries typically complete within 3 to 5 business days, barring force majeure events, natural calamities, or national transit interruptions.
• Doorstep Inspection: For your total peace of mind, customers are encouraged to inspect outer parcel tamper-evident seals and check physical package integrity in front of the courier rider before signing the delivery slip.`
    },
    {
      id: "returns-refunds",
      title: "6. 7-Day Doorstep Returns & Refunds",
      icon: RefreshCw,
      content: `We back every eligible purchase with Velora's signature 7-Day Doorstep Return Guarantee.

• Return Window: Return requests must be initiated within 7 calendar days from the date of confirmed delivery via your Velora Account or our Concierge Desk.
• Condition of Returned Goods: Products must be in unwashed, unused, undamaged condition with all original tags, authenticity cards, dust bags, and manufacturer packaging intact.
• Non-Returnable Items: Personalized bespoke items, customized goods, and intimate hygiene-sensitive apparel are exempt from return unless delivered damaged or defective.
• Refund Timeline: Approved refunds for prepaid orders (bKash, Nagad, Cards) are processed within 3 to 7 banking days following warehouse inspection.`
    },
    {
      id: "intellectual-property",
      title: "7. Intellectual Property & Brand Rights",
      icon: FileText,
      content: `All original materials, photography, visual layouts, branding assets, logos, copy, software codes, and trademarks displayed on Velora are the exclusive intellectual property of Velora Lifestyle & E-Commerce Ltd. or its licensed partners.

You may not copy, scrape, modify, reproduce, publicly distribute, or mirror any portion of the Platform without prior explicit written authorization from Velora management.`
    },
    {
      id: "limitation-liability",
      title: "8. Limitation of Liability & Warranties",
      icon: AlertCircle,
      content: `Velora facilitates authentic product discovery and fulfillment with high operational care.

• Manufacturer Warranties: Official manufacturer warranties for gadgets, timepieces, or appliances are honored directly through authorized warranty centers in Bangladesh as designated in the item packaging.
• Maximum Liability: In no event shall Velora, its directors, or affiliates be liable for indirect, incidental, or consequential damages. Velora's total aggregate liability arising from any transaction shall not exceed the amount actually paid by you for the specific item in dispute.`
    },
    {
      id: "governing-law",
      title: "9. Governing Law & Dispute Resolution",
      icon: Scale,
      content: `These Terms shall be interpreted and governed strictly in accordance with the laws of the People's Republic of Bangladesh, including the Consumers' Right Protection Act, 2009 and the Information and Communication Technology Act.

Any dispute, controversy, or claim arising out of or relating to these Terms that cannot be amicably settled through our Concierge Desk within 30 days shall be submitted to the exclusive jurisdiction of the competent courts of Dhaka, Bangladesh.`
    },
    {
      id: "contact-updates",
      title: "10. Amendments & Contact Information",
      icon: Mail,
      content: `Velora reserves the right to revise these Terms periodically to reflect changes in regulatory standards or operational capabilities. Continued use of the Platform following published updates signifies your binding acceptance.

For any legal notices, compliance queries, or policy clarification, please contact our Legal Concierge:
• Email: legal@velora.com / support@velora.com
• Phone: +8801925-251125 / +8801577-5914121
• Physical Atelier: Velora Flagship Experience Center, Agargoan, Dhaka 1229, Bangladesh.`
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#BC8477]/20 selection:text-[#BC8477]">
      <Navbar />

      {/* ── Header / Hero Section ── */}
      <section className="bg-[#F7F5EE] pt-12 pb-16 px-6 lg:px-12 text-center rounded-b-[40px] md:rounded-b-[48px] max-w-[1600px] mx-auto border-b border-[#E8E1DE] mb-12">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#BC8477] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#BC8477]">Terms & Conditions</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#BC8477] font-bold text-xs uppercase tracking-wider mb-4 border border-gray-200/80 shadow-sm">
          <Scale size={14} />
          <span>Legal Framework & Policies</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight max-w-3xl mx-auto">
          Terms & <span className="text-[#BC8477]">Conditions</span>
        </h1>

        <p className="text-gray-600 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
          Please review the professional guidelines, customer commitments, and contractual terms that govern your relationship with Velora in Bangladesh.
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-xs">
          <Clock size={14} className="text-[#BC8477]" />
          <span>Effective Date: {lastUpdated}</span>
          <span className="text-gray-300">·</span>
          <span>Version 2.4 (Bangladesh Jurisdictional Edition)</span>
        </div>

      </section>

      {/* ── Main Legal Content Area ── */}
      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ════ Left Column: Sticky Table of Contents ════ */}
          <aside className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div 
              className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E1DE] shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto"
              data-lenis-prevent
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8E1DE]">
                <FileText size={18} className="text-[#BC8477]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Table of Contents
                </h2>
              </div>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#BC8477] hover:bg-white rounded-xl transition-all"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-[#E8E1DE] space-y-3">
                <div className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Have questions about these terms? Reach our concierge anytime.
                </div>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl bg-white hover:bg-[#BC8477] hover:text-white text-gray-900 border border-[#E8E1DE] transition-colors shadow-xs"
                >
                  <span>Contact Legal Desk</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </aside>

          {/* ════ Right Column: Clauses & Details ════ */}
          <div className="lg:col-span-8 space-y-8">

            {/* Summary Highlights Card */}
            <div className="bg-gradient-to-br from-[#FAF8F5] to-white p-6 sm:p-8 rounded-3xl border border-[#E8E1DE] shadow-sm">
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight mb-2 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#BC8477]" />
                <span>Velora Shopper Protection Highlights</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-4">
                We believe in total transparency. Here is what you can always rely on when purchasing from Velora:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1DE]/70 text-xs font-bold text-gray-800 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#BC8477] shrink-0" />
                  <span>100% Authentic Goods</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1DE]/70 text-xs font-bold text-gray-800 flex items-center gap-2.5">
                  <RefreshCw size={16} className="text-[#BC8477] shrink-0" />
                  <span>7-Day Return Guarantee</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1DE]/70 text-xs font-bold text-gray-800 flex items-center gap-2.5">
                  <Truck size={16} className="text-[#BC8477] shrink-0" />
                  <span>Nationwide Express Fulfillment</span>
                </div>
              </div>
            </div>

            {/* Individual Clauses */}
            <div className="space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E8E1DE] shadow-xs scroll-mt-28 transition-all hover:border-[#BC8477]/40"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#BC8477] flex items-center justify-center shrink-0 border border-gray-100 shadow-xs">
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line pl-1 sm:pl-2">
                      {section.content}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Support Callout */}
            <div className="bg-[#1F1A19] text-white p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 max-w-md">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8C5BC]">
                  Customer Care & Inquiries
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Need clarification regarding these terms?
                </h3>
                <p className="text-xs text-gray-300 font-light">
                  Our Dhaka concierge team is available to assist you Monday through Friday from 9 AM to 6 PM.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="px-5 py-3 rounded-xl bg-[#BC8477] hover:bg-[#A86E61] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Contact Us
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
                >
                  Create Account
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
