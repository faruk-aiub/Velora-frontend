'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Check, 
  Copy, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ChevronDown, 
  ArrowUpRight, 
  CheckCircle2, 
  Headphones,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { contactService } from "@/services/contact.service";
import { useAuthStore } from "@/store/auth.store";

// Quick inquiry tags for faster subject filling
const INQUIRY_TOPICS = [
  "Order Status & Delivery",
  "Product Advice & Sizing",
  "Returns & Exchange",
  "Payment & bKash / Nagad Issue",
  "Damaged or Wrong Product",
  "Corporate & Bulk Orders"
];

// Frequently Asked Questions
const CONTACT_FAQS = [
  {
    question: "How quickly will I receive a response?",
    answer: "Our dedicated concierge desk operates Monday through Friday (9 AM - 6 PM) and weekends (10 AM - 4 PM). During operating hours, we typically respond to inquiries within 15 to 30 minutes. Messages received outside hours are answered first thing the next morning."
  },
  {
    question: "Can I visit the Agargaon showroom in person?",
    answer: "Yes, absolutely! Our Velora Experience Center & Atelier is located in Agargaon, Dhaka 1229 (conveniently accessible via the Dhaka Metro Rail Agargaon station). You are welcome to inspect curated pieces, collect orders, or consult with our style advisors during working hours."
  },
  {
    question: "How do I track an existing order?",
    answer: "You can track your parcel live anytime by visiting our Track Order page or clicking 'Track Order' in the header. Alternatively, include your Order ID in the message form above and our support specialists will pull up your real-time courier dispatch status."
  },
  {
    question: "What is your return & exchange window?",
    answer: "We offer a 7-day doorstep hassle-free return and exchange guarantee across Bangladesh. If any delivered item does not completely delight you, simply notify us here or via WhatsApp, and our rider will collect it from your doorstep."
  }
];

export default function ContactPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isOpenNow, setIsOpenNow] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Pre-fill user information if authenticated
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: prev.first_name || user.first_name || "",
        last_name: prev.last_name || user.last_name || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  // Check live operating hours (Bangladesh Standard Time: UTC+6)
  useEffect(() => {
    const checkOperatingStatus = () => {
      const now = new Date();
      // Convert to UTC+6
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const bstTime = new Date(utc + 3600000 * 6);
      const day = bstTime.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
      const hour = bstTime.getHours();

      // Monday - Friday (1 - 5): 9 AM to 6 PM (9 to 18)
      // Weekend: Saturday (6) and Sunday (0): 10 AM to 4 PM (10 to 16)
      if (day >= 1 && day <= 5) {
        setIsOpenNow(hour >= 9 && hour < 18);
      } else {
        setIsOpenNow(hour >= 10 && hour < 16);
      }
    };

    checkOperatingStatus();
    const timer = setInterval(checkOperatingStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleTopicSelect = (topic: string) => {
    if (selectedTopic === topic) {
      // Toggle off / deselect
      setSelectedTopic("");
      setFormData(prev => ({
        ...prev,
        subject: prev.subject === topic ? "" : prev.subject
      }));
    } else {
      setSelectedTopic(topic);
      setFormData(prev => ({
        ...prev,
        subject: topic
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === "subject" && value !== selectedTopic) {
      setSelectedTopic("");
    }
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await contactService.sendMessage({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || "Website Contact Inquiry",
        message: formData.message.trim(),
        ...(user ? { user_id: user.id } : {})
      });

      toast.success("Your message has been sent successfully! We will get back to you soon.");
      setFormData({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        subject: "",
        message: ""
      });
      setSelectedTopic("");
    } catch {
      toast.error("Failed to send message. Please reach out via phone or WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#BC8477]/20 selection:text-[#BC8477]">
      <Navbar />

      {/* ── Hero Section (Aligned with Velora's Main Brand & About Page Style) ── */}
      <section className="bg-[#F7F5EE] pt-6 sm:pt-8 pb-12 sm:pb-16 px-6 lg:px-12 text-center rounded-b-[40px] md:rounded-b-[48px] max-w-[1600px] mx-auto border-b border-[#E8E1DE] mb-12">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#BC8477] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#BC8477]">Contact Us</span>
        </nav>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
          We&apos;re Here to Help You <br className="hidden md:block" />
          <span className="text-[#BC8477]">Every Step of the Way</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 font-medium max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
          Have a question about a product, need assistance with your delivery, or want to consult our style advisors? Fill out the form or connect through our direct channels.
        </p>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          
          <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center shrink-0">
              <Phone size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-[#BC8477] uppercase tracking-wider">Helpline</span>
              <span className="block text-sm font-bold text-gray-900 truncate">+8801925-251125</span>
              <span className="block text-[11px] text-gray-400 font-medium">+8801577-5914121</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center shrink-0">
              <Mail size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-[#BC8477] uppercase tracking-wider">Email Us</span>
              <span className="block text-sm font-bold text-gray-900 truncate">support@velora.com</span>
              <span className="block text-[11px] text-gray-400 font-medium">Fast Ticket Handling</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center shrink-0">
              <MapPin size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-[#BC8477] uppercase tracking-wider">Showroom</span>
              <span className="block text-sm font-bold text-gray-900 truncate">Agargoan, Dhaka</span>
              <span className="block text-[11px] text-gray-400 font-medium">Postal Code: 1229</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center shrink-0">
              <Clock size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-[#BC8477] uppercase tracking-wider">Hours</span>
              <span className="block text-sm font-bold text-gray-900 truncate">Mon - Fri: 9am - 6pm</span>
              <span className="block text-[11px] text-gray-400 font-medium">Weekend: 10am - 4pm</span>
            </div>
          </div>

        </div>

      </section>

      {/* ── Main Two-Column Layout ── */}
      <section className="px-6 lg:px-12 max-w-[1600px] mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ════ LEFT COLUMN: Contact Details & Interactive Cards ════ */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BC8477]/10 text-[#BC8477] text-xs font-bold uppercase tracking-wider mb-3">
                <span>Direct Channels</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Get in Touch
              </h2>
              <p className="text-gray-500 font-medium text-sm mt-2 leading-relaxed">
                Whether you have questions, feedback, or need immediate assistance, choose the channel most convenient for you.
              </p>
            </div>

            {/* Contact Bento Cards */}
            <div className="space-y-4">
              
              {/* 1. Phone Card */}
              <div className="group bg-[#FAF8F5] rounded-3xl p-6 border border-[#E8E1DE] hover:border-[#BC8477]/40 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#BC8477] group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                      <Phone size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Helpline</span>
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">Phone Number</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <a 
                            href="tel:+8801925251125" 
                            className="text-sm font-bold text-gray-900 hover:text-[#BC8477] transition-colors"
                          >
                            +8801925-251125
                          </a>
                          <span className="text-[10px] uppercase font-bold bg-[#BC8477]/10 text-[#BC8477] px-2 py-0.5 rounded-full">Primary</span>
                        </div>
                        <div>
                          <a 
                            href="tel:+88015775914121" 
                            className="text-sm font-medium text-gray-600 hover:text-[#BC8477] transition-colors"
                          >
                            +8801577-5914121
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <button
                      onClick={() => handleCopy("+8801925-251125", "phone", "Primary Phone")}
                      aria-label="Copy primary phone number"
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-white transition-colors"
                      title="Copy phone number"
                    >
                      {copiedKey === "phone" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                    <a
                      href="https://wa.me/8801925251125?text=Hello%20Velora%2C%20I%20have%20an%20inquiry%20regarding%20my%20order."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. Email Card */}
              <div className="group bg-[#FAF8F5] rounded-3xl p-6 border border-[#E8E1DE] hover:border-[#BC8477]/40 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#BC8477] group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                      <Mail size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Concierge Inbox</span>
                      <h3 className="text-base font-bold text-gray-900 mb-1">Email Address</h3>
                      <a 
                        href="mailto:support@velora.com" 
                        className="text-sm font-bold text-gray-900 hover:text-[#BC8477] transition-colors break-all"
                      >
                        support@velora.com
                      </a>
                      <p className="text-xs text-gray-500 font-medium mt-1">24/7 inbox monitoring & support ticket queue</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy("support@velora.com", "email", "Email Address")}
                    aria-label="Copy email address"
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-white transition-colors shrink-0"
                    title="Copy email address"
                  >
                    {copiedKey === "email" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* 3. Location Card */}
              <div className="group bg-[#FAF8F5] rounded-3xl p-6 border border-[#E8E1DE] hover:border-[#BC8477]/40 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#BC8477] group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                      <MapPin size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Atelier & Showroom</span>
                      <h3 className="text-base font-bold text-gray-900 mb-1">Our Location</h3>
                      <p className="text-sm font-bold text-gray-900">
                        Agargoan, Dhaka, 1229
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Conveniently accessible via Agargaon Metro Station
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <button
                      onClick={() => handleCopy("Agargoan, Dhaka, 1229", "location", "Location")}
                      aria-label="Copy location address"
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-white transition-colors"
                      title="Copy address"
                    >
                      {copiedKey === "location" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Agargaon,+Dhaka+1229"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#BC8477] hover:underline"
                    >
                      <span>Map</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* 4. Working Hours Card */}
              <div className="group bg-[#FAF8F5] rounded-3xl p-6 border border-[#E8E1DE] hover:border-[#BC8477]/40 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#BC8477] group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                      <Clock size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Operating Schedule</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOpenNow ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                          {isOpenNow ? "Open Now" : "Closed"}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">Working Hours</h3>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between gap-4 text-xs font-medium">
                          <span className="text-gray-500">Monday - Friday:</span>
                          <span className="font-bold text-gray-900">9 AM - 6 PM</span>
                        </div>
                        <div className="flex justify-between gap-4 text-xs font-medium">
                          <span className="text-gray-500">Weekend:</span>
                          <span className="font-bold text-gray-900">10 AM - 4 PM</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium mt-2">Time zone: BST (Bangladesh Standard Time · UTC+6)</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Embedded Google Map Frame */}
            <div className="rounded-3xl overflow-hidden border border-[#E8E1DE] bg-white shadow-sm relative">
              <div className="p-4 bg-[#F9F7F5] border-b border-[#E8E1DE] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation size={15} className="text-[#BC8477]" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Agargaon Atelier Map</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Agargaon,+Dhaka+1229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#BC8477] hover:underline flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
              <div className="relative w-full h-[280px] sm:h-[320px] bg-gray-100">
                <iframe
                  title="Velora Location Map - Agargaon, Dhaka, 1229"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.583034515545!2d90.37715207533682!3d23.77717547866782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0ea7cfef2df%3A0x69f1b95f2d01da0!2sAgargaon%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-md text-xs font-bold text-gray-800 flex items-center gap-1.5 pointer-events-auto">
                    <MapPin size={14} className="text-[#BC8477]" />
                    <span>Agargoan, Dhaka, 1229</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Agargaon,+Dhaka+1229"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto bg-gray-900 hover:bg-[#BC8477] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <span>Get Directions</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ════ RIGHT COLUMN: Contact Form ════ */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF8F5] rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 lg:p-14 border border-[#E8E1DE] shadow-sm relative">
              
              {/* Form Title & Introduction */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BC8477]/10 text-[#BC8477] text-xs font-bold uppercase tracking-wider">
                    <span>Direct Message</span>
                  </div>
                  {user && (
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Logged in as <strong className="text-gray-900 font-bold">{user.first_name}</strong>
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Send us a Message
                </h3>
                <p className="text-gray-500 font-medium text-sm mt-2 leading-relaxed">
                  Have a question, feedback, or need assistance? Fill out the form below and we will get back to you shortly.
                </p>
              </div>

              {/* Inquiry Topic Fast-Select Chips */}
              <div className="mb-8">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-3">
                  What can we help you with?
                </label>
                <div className="flex flex-wrap gap-2">
                  {INQUIRY_TOPICS.map((topic) => {
                    const isSelected = selectedTopic === topic;
                    return (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => handleTopicSelect(topic)}
                        className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 border cursor-pointer inline-flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#BC8477] text-white border-[#BC8477] shadow-sm scale-[1.02]"
                            : "bg-white text-gray-700 border-[#E8E1DE] hover:border-[#BC8477]/50"
                        }`}
                        title={isSelected ? "Click to deselect" : `Select ${topic}`}
                      >
                        <span>{topic}</span>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] leading-none">
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      First Name <span className="text-[#BC8477]">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="John" 
                      className="w-full h-12 bg-white rounded-xl px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-[#E8E1DE] transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Last Name <span className="text-[#BC8477]">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe" 
                      className="w-full h-12 bg-white rounded-xl px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-[#E8E1DE] transition-all" 
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Email Address <span className="text-[#BC8477]">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    className="w-full h-12 bg-white rounded-xl px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-[#E8E1DE] transition-all" 
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Subject
                    </label>
                    <span className="text-[11px] text-gray-400 font-medium">Include Order ID if applicable</span>
                  </div>
                  <input 
                    type="text" 
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?" 
                    className="w-full h-12 bg-white rounded-xl px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-[#E8E1DE] transition-all" 
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Message <span className="text-[#BC8477]">*</span>
                    </label>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {formData.message.length} characters
                    </span>
                  </div>
                  <textarea 
                    id="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..." 
                    className="w-full bg-white rounded-2xl p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] border border-[#E8E1DE] transition-all resize-none leading-relaxed" 
                  />
                </div>

                {/* Submit Action */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-gray-900 hover:bg-[#BC8477] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                {/* Reassurance */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 border-t border-gray-200/60 mt-6">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck size={15} className="text-[#BC8477]" />
                    <span>Encrypted & secure transmission</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Sparkles size={14} className="text-[#BC8477]" />
                    <span>Response within 15–30 mins</span>
                  </div>
                </div>

              </form>

            </div>
          </div>

        </div>
      </section>

      {/* ── Velora Experience Strip (Consistent with Homepage VeloraStandard) ── */}
      <section className="px-6 lg:px-12 max-w-[1600px] mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-[#E8E1DE] shadow-sm flex gap-5 items-start">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
              <Headphones size={24} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-base mb-1 tracking-tight">Dedicated Care Concierge</h4>
              <p className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed">
                Connect directly with our customer specialists for genuine assistance without confusing robotic menus.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-[#E8E1DE] shadow-sm flex gap-5 items-start">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
              <Truck size={24} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-base mb-1 tracking-tight">Rapid Dispatch Escalation</h4>
              <p className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed">
                Any delivery questions are directly coordinated with regional courier hubs for quick resolution.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-[#E8E1DE] shadow-sm flex gap-5 items-start">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#BC8477] flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
              <CheckCircle2 size={24} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-base mb-1 tracking-tight">7-Day Doorstep Guarantee</h4>
              <p className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed">
                Enjoy complete peace of mind with our 7-day doorstep return and exchange assurance nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="px-6 lg:px-12 max-w-[1200px] mx-auto pb-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BC8477]/10 text-[#BC8477] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Help & FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-3">
            Quick answers to common questions about communication, orders, and our experience center.
          </p>
        </div>

        <div className="space-y-4">
          {CONTACT_FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="bg-[#FAF8F5] rounded-3xl border border-[#E8E1DE] overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full px-6 sm:px-8 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/60 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-gray-900 text-sm sm:text-base tracking-tight">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shrink-0 transition-transform duration-300 shadow-sm ${isOpen ? 'rotate-180 bg-[#BC8477] text-white' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 sm:px-8 pb-6 pt-2 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed border-t border-[#E8E1DE]/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
