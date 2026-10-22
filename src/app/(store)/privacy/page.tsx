import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Server, 
  UserCheck, 
  CreditCard, 
  Bell, 
  Mail,
  Cookie
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Velora",
  description: "Official Privacy Policy explaining how Velora collects, protects, encrypts, and handles your personal information in Bangladesh.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 22, 2026";

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction & Our Commitment",
      icon: ShieldCheck,
      content: `At Velora ("Velora", "we", "us", or "our"), safeguarding your personal information is a core pillar of our luxury service standard. This Privacy Policy delineates how Velora Lifestyle & E-Commerce Ltd. (headquartered at Agargoan, Dhaka 1229, Bangladesh) collects, secures, utilizes, and manages your personal data when you visit velora.com or interact with our services.

We operate in strict conformity with the Information and Communication Technology (ICT) Act, 2006, the Digital Security Act, and the applicable consumer protection frameworks of the People's Republic of Bangladesh. By utilizing our Platform, you acknowledge and consent to the data practices described herein.`
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: FileText,
      content: `We collect only the essential information necessary to deliver exceptional shopping, personalized styling, and reliable delivery services.

• Identity & Contact Details: Your full legal name, email address, primary phone number, and optional secondary contact number.
• Shipping & Billing Addresses: Doorstep delivery address, city, district, and postal code across any of the 64 districts in Bangladesh.
• Account Authentication: Encrypted passwords (hashed using modern salted algorithms; Velora personnel can never view your plain-text password), order history, and saved wishlist items.
• Transaction References: Payment method type (Cash on Delivery, bKash, Nagad, Credit/Debit Card) and gateway transaction identifiers (TrxID).
• Crucial Security Note on Cards: Velora NEVER captures, logs, or stores your credit/debit card numbers, CVV security codes, or banking PINs. All online payments are handled directly by certified, PCI-DSS compliant financial gateways (e.g., SSLCommerz, bKash Merchant Gateway).`
    },
    {
      id: "how-we-use-data",
      title: "3. How We Use Your Information",
      icon: UserCheck,
      content: `Your data is utilized solely for lawful business operations aimed at elevating your shopping experience:

• Order Fulfillment & Dispatch: Handing parcel details to our dedicated courier riders (Pathao, Steadfast, RedX) to execute timely doorstep delivery.
• Transactional Communications: Transmitting automated SMS dispatch alerts, OTP verification codes, digital invoice receipts, and delivery confirmations.
• Concierge Care: Assisting you with size guidance, order modifications, warranty claims, and return requests.
• Anti-Fraud Verification: Screening high-value orders or suspicious repeat cancellations to protect authentic customers and courier personnel against fraud.`
    },
    {
      id: "data-sharing",
      title: "4. Information Sharing & Third Parties",
      icon: Lock,
      content: `Velora maintains an unwavering Zero-Sale policy: We will NEVER sell, rent, monetize, or trade your personal contact details to third-party marketing brokers or advertisers.

We disclose your data strictly to trusted service partners operating under confidentiality agreements:
• Certified Logistics Networks: Courier delivery agents receive only the recipient name, physical address, and phone number required for delivery.
• Payment Gateways: Encrypted transaction amounts and reference IDs are transmitted to licensed banks and Mobile Financial Services (MFS).
• Legal & Regulatory Compliance: We may disclose information if formally compelled by lawful warrant, court subpoena, or statutory order under the laws of Bangladesh.`
    },
    {
      id: "data-security",
      title: "5. Security Architecture & Encryption",
      icon: Server,
      content: `We implement enterprise-grade defensive measures to protect your data against unauthorized interception, loss, or unauthorized access:

• 256-Bit SSL/TLS Encryption: All network traffic between your web browser and our servers is secured through high-grade SSL certificates.
• Cloud Infrastructure Security: Our production databases reside in isolated VPC containers with strict role-based access control and continuous automated threat monitoring.
• Secure Employee Access: Access to customer accounts is restricted strictly to authorized customer care personnel resolving active inquiries.`
    },
    {
      id: "cookies-analytics",
      title: "6. Cookies & Tracking Technologies",
      icon: Cookie,
      content: `We use cookies and similar lightweight browser tokens to optimize Platform performance and user convenience:

• Essential Functional Cookies: Required to keep you authenticated, remember items inside your shopping cart drawer, and preserve checkout state.
• Analytics & Performance: Anonymized metrics regarding page load speeds and visitor navigation trends to help us refine catalog usability.
• Cookie Control: You may adjust your web browser settings to block or alert you about cookies; however, disabling essential cookies may impact certain checkout functionalities.`
    },
    {
      id: "customer-rights",
      title: "7. Your Rights & Data Retention",
      icon: CheckCircle2,
      content: `You possess complete ownership and authority over your personal information:

• Access & Correction: You may review, edit, or update your profile details and saved shipping addresses anytime by logging into your Velora Account dashboard.
• Account Deletion: You retain the legal right to request complete erasure of your Velora customer profile and marketing subscription by notifying our Data Protection Officer at privacy@velora.com.
• Data Retention: We retain transaction records for the duration required by statutory financial accounting laws and tax auditing guidelines in Bangladesh.`
    },
    {
      id: "children-privacy",
      title: "8. Children's Privacy Protection",
      icon: Eye,
      content: `Velora is curated for adult consumers. We do not knowingly solicit or collect personal information from individuals under the age of 18 without verifiable parental consent. If we become aware that a minor has provided us with personal information without parental authorization, we will promptly delete such records from our servers.`
    },
    {
      id: "policy-amendments",
      title: "9. Policy Updates & Notifications",
      icon: Bell,
      content: `We may revise this Privacy Policy periodically to accommodate emerging privacy regulations, operational upgrades, or technological innovations. Any updates will be published on this page with an updated Effective Date. Continued use of the Platform subsequent to such changes indicates your acceptance.`
    },
    {
      id: "contact-dpo",
      title: "10. Contact Our Data Protection Desk",
      icon: Mail,
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or your data security, please contact our Data Protection Team:

• Official Privacy Inbox: privacy@velora.com
• General Customer Support: support@velora.com
• Direct Helpline: +8801925-251125 / +8801577-5914121
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
          <span className="text-[#BC8477]">Privacy Policy</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#BC8477] font-bold text-xs uppercase tracking-wider mb-4 border border-gray-200/80 shadow-sm">
          <Lock size={14} />
          <span>Data Protection & Privacy Charter</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight max-w-3xl mx-auto">
          Privacy <span className="text-[#BC8477]">Policy</span>
        </h1>

        <p className="text-gray-600 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
          Your trust is our greatest asset. Learn how Velora respects, encrypts, and handles your personal information with absolute integrity.
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-xs">
          <Clock size={14} className="text-[#BC8477]" />
          <span>Last Updated: {lastUpdated}</span>
          <span className="text-gray-300">·</span>
          <span>Bangladesh Jurisdictional Standard</span>
        </div>

      </section>

      {/* ── Main Privacy Content Area ── */}
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
                  Privacy Sections
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
                  Have inquiries regarding your personal data? Reach our privacy desk.
                </div>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl bg-white hover:bg-[#BC8477] hover:text-white text-gray-900 border border-[#E8E1DE] transition-colors shadow-xs"
                >
                  <span>Contact Privacy Desk</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </aside>

          {/* ════ Right Column: Privacy Clauses ════ */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Core Privacy Commitments Grid */}
            <div className="bg-gradient-to-br from-[#FAF8F5] to-white p-6 sm:p-8 rounded-3xl border border-[#E8E1DE] shadow-sm">
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight mb-2 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#BC8477]" />
                <span>Our Core Privacy Commitments</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-4">
                We believe your privacy is fundamental. Here are the guarantees we uphold unconditionally:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1DE]/70 text-xs font-bold text-gray-800 flex items-center gap-2.5">
                  <Lock size={16} className="text-[#BC8477] shrink-0" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1DE]/70 text-xs font-bold text-gray-800 flex items-center gap-2.5">
                  <CreditCard size={16} className="text-[#BC8477] shrink-0" />
                  <span>No Card/PIN Storage</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1DE]/70 text-xs font-bold text-gray-800 flex items-center gap-2.5">
                  <UserCheck size={16} className="text-[#BC8477] shrink-0" />
                  <span>Zero Data Selling</span>
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
                  Data Privacy Concierge
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Have questions about your personal data?
                </h3>
                <p className="text-xs text-gray-300 font-light">
                  Our Data Protection Officer is available to assist you at support@velora.com or privacy@velora.com.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="px-5 py-3 rounded-xl bg-[#BC8477] hover:bg-[#A86E61] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Contact Desk
                </Link>
                <Link
                  href="/terms"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
                >
                  Terms & Conditions
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
