'use client';

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { contactService } from "@/services/contact.service";
import { useAuthStore } from "@/store/auth.store";

export default function ContactPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await contactService.sendMessage({
        ...formData,
        ...(user ? { user_id: user.id } : {})
      });
      toast.success("Your message has been sent successfully! We will get back to you soon.");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="bg-[#F7F5EE] pt-32 pb-24 px-6 lg:px-12 text-center rounded-b-[40px] max-w-[1600px] mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          Have a question, feedback, or need assistance? We'd love to hear from you. 
          Fill out the form below or reach us through our contact details.
        </p>
      </section>

      {/* ── Main Content Area ── */}
      <section className="px-6 lg:px-12 max-w-[1600px] mx-auto w-full pb-24">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Contact Information */}
          <div className="flex-1 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">Get in Touch</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                Whether you're looking for answers, would like to solve a problem, or just want to let us know how we did, you'll find many ways to contact us right here. We'll help you resolve your issues quickly and easily.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: MapPin, title: "Our Location", details: "123 Velora Street, Suite 100, New York, NY 10001" },
                { icon: Phone, title: "Phone Number", details: "+1 (800) 123-4567\nMon - Fri, 8am - 9pm EST" },
                { icon: Mail, title: "Email Address", details: "support@velora.com\nhello@velora.com" },
                { icon: Clock, title: "Working Hours", details: "Monday - Friday: 9 AM - 6 PM\nWeekend: 10 AM - 4 PM" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF0E2] flex items-center justify-center text-[#7A915C] shrink-0">
                    <item.icon size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm font-medium whitespace-pre-line leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1">
            <div className="bg-gray-50 p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Send us a Message</h3>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-bold text-gray-700">First Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="John" 
                      className="w-full h-12 bg-white rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7A915C]/20 focus:border-[#7A915C] border border-gray-200 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-bold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe" 
                      className="w-full h-12 bg-white rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7A915C]/20 focus:border-[#7A915C] border border-gray-200 transition-all" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    className="w-full h-12 bg-white rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7A915C]/20 focus:border-[#7A915C] border border-gray-200 transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-gray-700">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?" 
                    className="w-full h-12 bg-white rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7A915C]/20 focus:border-[#7A915C] border border-gray-200 transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-gray-700">Message <span className="text-red-500">*</span></label>
                  <textarea 
                    id="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..." 
                    className="w-full bg-white rounded-2xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7A915C]/20 focus:border-[#7A915C] border border-gray-200 transition-all resize-none" 
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-gray-900 text-white font-bold rounded-xl hover:bg-[#7A915C] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
