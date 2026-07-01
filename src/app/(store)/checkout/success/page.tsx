import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <main className="w-full min-h-[80vh] flex items-center justify-center pt-24 pb-20 bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-[32px] shadow-sm text-center">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. We have received your order and will begin processing it shortly.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            href="/account"
            className="w-full h-14 bg-gray-900 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Package size={18} />
            View My Orders
          </Link>
          
          <Link 
            href="/shop"
            className="w-full h-14 bg-white border border-gray-200 text-gray-900 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
