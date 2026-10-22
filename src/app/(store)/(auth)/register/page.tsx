'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  User,
  Mail,
  Lock,
  Phone,
  X,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Truck,
  CreditCard
} from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '@/lib/validators/auth.schema';
import { authService } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!acceptedTerms) {
      toast.error('You must accept the Terms of Service and Privacy Policy.');
      return;
    }

    setIsPending(true);
    try {
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      await authService.register({
        email: data.email,
        password: data.password,
        first_name: firstName,
        last_name: lastName,
      });

      toast.success('Registration successful! You can now log in.');
      router.push('/login');
    } catch (error: unknown) {
      setIsPending(false);
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to register.';
      toast.error(msg);
    }
  };

  const handleAcceptModalTerms = () => {
    setAcceptedTerms(true);
    setShowTermsModal(false);
    toast.success('Terms & Conditions accepted');
  };

  const handleAcceptModalPrivacy = () => {
    setAcceptedTerms(true);
    setShowPrivacyModal(false);
    toast.success('Privacy Policy accepted');
  };

  return (
    <div className="w-full max-w-[420px] mx-auto animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h1 className="font-bold text-3xl text-gray-900 tracking-tight mb-2">
          Create Your Account
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Welcome to Velora
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <User size={18} strokeWidth={1.5} />
          </div>
          <input
            id="fullName"
            placeholder="Full Name"
            className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
            style={{ borderColor: errors.fullName ? '#E46962' : undefined }}
            {...register('fullName')}
          />
          {errors.fullName && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.fullName.message}</p>}
        </div>

        <div className="relative group pt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail size={18} strokeWidth={1.5} />
          </div>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
            style={{ borderColor: errors.email ? '#E46962' : undefined }}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.email.message}</p>}
        </div>

        <div className="relative group pt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Phone size={18} strokeWidth={1.5} />
          </div>
          <input
            id="phone"
            type="tel"
            placeholder="Phone Number"
            className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
            style={{ borderColor: errors.phone ? '#E46962' : undefined }}
            {...register('phone')}
          />
          {errors.phone && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.phone.message}</p>}
        </div>

        <div className="relative group pt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Lock size={18} strokeWidth={1.5} />
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full h-14 bg-white rounded-2xl pl-12 pr-12 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
              style={{ borderColor: errors.password ? '#E46962' : undefined }}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.password.message}</p>}
        </div>

        <div className="relative group pt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Lock size={18} strokeWidth={1.5} />
          </div>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full h-14 bg-white rounded-2xl pl-12 pr-12 text-[13px] text-gray-900 border border-[#EBE8E6] transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
              style={{ borderColor: errors.confirmPassword ? '#E46962' : undefined }}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-[#E46962] mt-1 absolute -bottom-5">{errors.confirmPassword.message}</p>}
        </div>

        {/* ── Terms & Conditions Checkbox with Interactive Modal Trigger ── */}
        <div className="flex items-start gap-3 pt-3 pb-1">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-[#D5CFCD] text-[#BC8477] focus:ring-[#BC8477] transition-colors cursor-pointer shrink-0"
          />
          <label htmlFor="terms" className="text-xs text-[#7A7371] leading-relaxed cursor-pointer select-none">
            I have read and agree to the{' '}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-[#BC8477] font-bold hover:underline cursor-pointer"
            >
              Terms & Conditions
            </button>
            {' '}and{' '}
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="text-[#BC8477] font-bold hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-[#BC8477] text-white text-[15px] font-semibold rounded-2xl hover:bg-[#A86E61] transition-all duration-300 relative flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-[#BC8477]/20 mt-4 cursor-pointer"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                Create Account
                <div className="absolute right-6">
                  <ArrowRight size={20} strokeWidth={2} />
                </div>
              </>
            )}
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-gray-500 mt-8 font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-[#BC8477] font-semibold hover:text-[#9A6B60] transition-colors ml-1">
          Sign In
        </Link>
      </p>

      {/* ── Professional Terms & Conditions Modal ── */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-xl max-h-[85vh] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center shrink-0">
                  <Scale size={20} />
                </div>
                <div>
                  <h2 id="terms-modal-title" className="text-base font-extrabold text-gray-900 tracking-tight">
                    Terms & Conditions
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Velora Customer Charter & Service Terms (Bangladesh)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div
              className="p-6 overflow-y-auto space-y-5 text-xs text-gray-600 leading-relaxed max-h-[55vh]"
              data-lenis-prevent
            >

              {/* Trust Badge Strip */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1DE]/70 flex items-center justify-between gap-3 text-[11px] font-bold text-gray-800">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#BC8477]" />
                  100% Authentic
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-[#BC8477]" />
                  7-Day Returns
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#BC8477]" />
                  Express Courier
                </span>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#BC8477]" />
                  1. Account Registration & Authenticity
                </h3>
                <p>
                  By creating an account on Velora, you confirm that you are at least 18 years old or operating under parental/guardian consent. You agree to provide accurate registration details. Every piece in our catalog is backed by our 100% Genuine Manufacturer Guarantee.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CreditCard size={13} className="text-[#BC8477]" />
                  2. Pricing, Cash on Delivery & MFS Payments
                </h3>
                <p>
                  All catalog prices are listed in Bangladeshi Taka (BDT / ৳) and include applicable statutory taxes. We support Cash on Delivery (COD), bKash, Nagad, and verified debit/credit cards. Velora reserves the right to verify high-value orders prior to dispatch to prevent fraudulent bookings.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Truck size={13} className="text-[#BC8477]" />
                  3. Doorstep Delivery & Inspection
                </h3>
                <p>
                  We dispatch nationwide across Bangladesh with estimated delivery of 24–48 hours in Dhaka and 3–5 business days outside Dhaka. You are encouraged to inspect outer packaging and tamper-evident seals upon receiving your parcel from our courier rider.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <RefreshCw size={13} className="text-[#BC8477]" />
                  4. 7-Day Doorstep Returns & Refunds
                </h3>
                <p>
                  If an item fails to exceed your expectations, request a return within 7 calendar days. Items must be in their original, unwashed, unaltered condition with security tags and warranty cards intact. Approved prepaid refunds are credited within 3–7 business days.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#BC8477]" />
                  5. Privacy & Legal Jurisdiction
                </h3>
                <p>
                  Your credentials and payment data are strictly guarded under 256-bit SSL encryption. All transactions are governed in accordance with the laws of the People&apos;s Republic of Bangladesh.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/terms"
                target="_blank"
                className="text-xs font-bold text-[#BC8477] hover:underline flex items-center gap-1"
              >
                <span>Read Full Legal Terms (Standalone Page)</span>
                <ExternalLink size={12} />
              </Link>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleAcceptModalTerms}
                  className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-[#BC8477] hover:bg-[#A86E61] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  I Agree & Accept
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* ── Professional Privacy Policy Modal ── */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-xl max-h-[85vh] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#BC8477]/10 text-[#BC8477] flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 id="privacy-modal-title" className="text-base font-extrabold text-gray-900 tracking-tight">
                    Privacy Policy
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Velora Data Protection & Privacy Charter (Bangladesh)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div
              className="p-6 overflow-y-auto space-y-5 text-xs text-gray-600 leading-relaxed max-h-[55vh]"
              data-lenis-prevent
            >

              {/* Trust Badge Strip */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1DE]/70 flex items-center justify-between gap-3 text-[11px] font-bold text-gray-800">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#BC8477]" />
                  256-Bit SSL
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock size={14} className="text-[#BC8477]" />
                  Zero Data Selling
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard size={14} className="text-[#BC8477]" />
                  No Card/PIN Storage
                </span>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#BC8477]" />
                  1. Information Collection & Purpose
                </h3>
                <p>
                  We collect essential details full legal name, phone number, email, and shipping address across all 64 districts of Bangladesh strictly to verify, process and deliver your orders and transmit real-time delivery SMS updates.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CreditCard size={13} className="text-[#BC8477]" />
                  2. Zero Card & Payment PIN Storage Guarantee
                </h3>
                <p>
                  Velora never captures, logs, or stores your credit/debit card numbers, CVV security codes, bKash PINs, or banking passwords. All online payments are handled directly by certified, PCI-DSS compliant financial gateways.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Truck size={13} className="text-[#BC8477]" />
                  3. Order Dispatch & Verified Couriers
                </h3>
                <p>
                  To ensure rapid doorstep fulfillment, only necessary recipient details (name, physical address, and contact number) are disclosed to our verified courier riders (Pathao, Steadfast, RedX) under strict non-disclosure obligations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#BC8477]" />
                  4. Uncompromising Zero-Sale Commitment
                </h3>
                <p>
                  We operate under an absolute Zero-Sale policy: Velora will never sell, rent, monetize, or trade your personal contact details or purchasing history to third-party telemarketers or external advertising networks.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lock size={13} className="text-[#BC8477]" />
                  5. Data Sovereignty & Customer Rights
                </h3>
                <p>
                  You maintain complete ownership of your personal data. You can update your account anytime or request permanent erasure of your profile by emailing privacy@velora.com in full compliance with the Bangladesh ICT Act.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/privacy"
                target="_blank"
                className="text-xs font-bold text-[#BC8477] hover:underline flex items-center gap-1"
              >
                <span>Read Full Privacy Policy (Standalone Page)</span>
                <ExternalLink size={12} />
              </Link>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleAcceptModalPrivacy}
                  className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-[#BC8477] hover:bg-[#A86E61] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  I Agree & Accept
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
