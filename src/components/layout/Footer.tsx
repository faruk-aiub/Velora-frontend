import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#3A3331] text-white py-16 px-6 lg:px-12 text-center">
      <h2 className="font-serif text-3xl font-light mb-6">Velora.</h2>
      <p className="text-white/60 text-sm font-light tracking-wide mb-8">
        Premium e-commerce for the modern lifestyle.
      </p>
      
      <div className="flex flex-wrap justify-center gap-6 mb-10 text-[11px] font-bold tracking-[0.2em] uppercase text-white/80">
        <Link href="/shop" className="hover:text-[#BC8477] transition-colors">Shop All</Link>
        <Link href="/about" className="hover:text-[#BC8477] transition-colors">Our Story</Link>
        <Link href="/contact" className="hover:text-[#BC8477] transition-colors">Contact</Link>
        <Link href="/faq" className="hover:text-[#BC8477] transition-colors">FAQ</Link>
      </div>

      <div className="w-full max-w-md mx-auto h-[1px] bg-white/10 mb-8" />
      <p className="text-[10px] text-white/40 uppercase tracking-widest">
        © 2026 Velora. All rights reserved.
      </p>
    </footer>
  );
}
