import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen flex w-full bg-background ${cormorant.variable}`}>
      {/* ── Left Hero Panel (Hidden on Mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden bg-muted">
        {/* Editorial Fashion Image */}
        <Image
          src="/auth-hero.png"
          alt="Premium Fashion"
          fill
          priority
          className="object-cover object-center"
          sizes="50vw"
        />

        {/* Soft overlay gradient for subtle contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 mix-blend-multiply opacity-60" />

        {/* Top left Brand */}
        <div className="relative z-10 p-12">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 rounded-full border-[1.5px] border-white/80 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/10 transition-colors">
              <span className="text-white font-serif text-xl font-light">V</span>
            </div>
            <span className="font-sans tracking-[0.2em] text-white text-sm uppercase">Velora</span>
          </Link>
        </div>

        {/* Bottom Text Content */}
        <div className="relative z-10 p-12">
          <div className="w-12 h-[1px] bg-white/40 mb-8" />
          <h2 className="font-serif text-5xl md:text-6xl text-white mb-6 font-light leading-[1.1]">
            Where Style Meets <br />
            <span className="italic">Sophistication</span>
          </h2>
          <p className="text-white/80 text-sm md:text-base font-sans font-light tracking-wide max-w-md mb-12 leading-relaxed">
            Discover curated collections of premium fashion and lifestyle pieces, crafted for the modern woman who knows her worth.
          </p>

          <div className="flex gap-10">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-white/60" />
              <span className="text-white/80 text-[10px] uppercase tracking-widest font-semibold">Free<br/>Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-white/60" />
              <span className="text-white/80 text-[10px] uppercase tracking-widest font-semibold">Easy<br/>Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-white/60" />
              <span className="text-white/80 text-[10px] uppercase tracking-widest font-semibold">Premium<br/>Quality</span>
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-white/20 mt-12 mb-4" />
          <p className="text-[10px] text-white/50 uppercase tracking-widest">
            © 2026 Velora · Premium Fashion
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 overflow-y-auto bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
