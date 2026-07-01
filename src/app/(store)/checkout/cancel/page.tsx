import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <main className="w-full min-h-[80vh] flex items-center justify-center pt-24 pb-20 bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-[32px] shadow-sm text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">
          Your payment was cancelled and your order has not been completed. 
          You can try paying again from your account dashboard.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            href="/account"
            className="w-full h-14 bg-gray-900 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <RefreshCcw size={18} />
            Try Payment Again
          </Link>
          
          <Link 
            href="/shop"
            className="w-full h-14 bg-white border border-gray-200 text-gray-900 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
