"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface VeloraIconProps {
  className?: string;
  size?: number;
  variant?: "dark" | "light" | "white";
  showRing?: boolean;
}

/**
 * Maison Velora Luxury Astronomical Seal
 * A classical Roman V with 3D chiseled facets, fine-line celestial halo,
 * cardinal compass diamonds, and a crowning solitaire star.
 */
export function VeloraIcon({
  className,
  size = 40,
  variant = "dark",
  showRing = true,
}: VeloraIconProps) {
  const isWhite = variant === "white";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-transform duration-500 ease-out group-hover:scale-105 flex-shrink-0",
        className
      )}
    >
      <defs>
        {/* 18K Rose Gold Liquid Metallic Gradient */}
        <linearGradient
          id={`veloraRoseGold_${variant}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={isWhite ? "#FFFFFF" : "#FFFFFF"} />
          <stop offset="18%" stopColor={isWhite ? "#FDF5F2" : "#FCECE6"} />
          <stop offset="45%" stopColor={isWhite ? "#E8B5A9" : "#E2A597"} />
          <stop offset="70%" stopColor={isWhite ? "#C88E81" : "#BC8477"} />
          <stop offset="90%" stopColor={isWhite ? "#965243" : "#8B483A"} />
          <stop offset="100%" stopColor={isWhite ? "#63271C" : "#542016"} />
        </linearGradient>

        {/* Champagne Specular Highlight */}
        <linearGradient
          id={`veloraChampagne_${variant}`}
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor={isWhite ? "#FFF0EB" : "#FCEFEA"} />
          <stop offset="70%" stopColor={isWhite ? "#E2A69A" : "#D69B8F"} />
          <stop offset="100%" stopColor={isWhite ? "#AA6354" : "#995647"} />
        </linearGradient>

        {/* Delicate Fine-line Halo Ring */}
        <linearGradient
          id={`veloraRing_${variant}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isWhite ? 0.95 : 0.9} />
          <stop offset="30%" stopColor="#DDA092" stopOpacity={isWhite ? 0.8 : 0.7} />
          <stop offset="70%" stopColor="#BC8477" stopOpacity={isWhite ? 0.9 : 0.8} />
          <stop offset="100%" stopColor="#70362A" stopOpacity={isWhite ? 0.5 : 0.4} />
        </linearGradient>
      </defs>

      {showRing && (
        <g>
          {/* Fine-line luxury astronomical ring */}
          <circle
            cx="34"
            cy="34"
            r="32"
            stroke={`url(#veloraRing_${variant})`}
            strokeWidth="1.2"
            fill="none"
          />
          {/* Internal orbital dashed track */}
          <circle
            cx="34"
            cy="34"
            r="29.5"
            stroke={`url(#veloraRing_${variant})`}
            strokeWidth="0.5"
            strokeDasharray="2 3"
            opacity="0.4"
            fill="none"
          />

          {/* Cardinal Diamond Markers (North, South, East, West) */}
          <path d="M34 0 L35.5 2 L34 4 L32.5 2 Z" fill={`url(#veloraRoseGold_${variant})`} />
          <path d="M34 64 L35.5 66 L34 68 L32.5 66 Z" fill={`url(#veloraRoseGold_${variant})`} />
          <path d="M0 34 L2 35.5 L4 34 L2 32.5 Z" fill={`url(#veloraRoseGold_${variant})`} />
          <path d="M64 34 L66 35.5 L68 34 L66 32.5 Z" fill={`url(#veloraRoseGold_${variant})`} />
        </g>
      )}

      {/* ── Roman Maison V with 3D Chiseled Facets ── */}
      {/* Left Bold Stem (Curved inner & outer bevels) */}
      <path
        d="M14 17 H27 C25.5 18.5 25.5 19.5 26.5 21 L34 50 L31.5 50 L16 21 C15 19.5 15 18.5 14 17 Z"
        fill={`url(#veloraRoseGold_${variant})`}
      />
      {/* 3D Bevel highlight on left stem */}
      <path
        d="M19 19 H24 L34 50 L31.5 50 Z"
        fill={`url(#veloraChampagne_${variant})`}
        opacity="0.65"
      />

      {/* Right Hairline Stem with top bracketed serif */}
      <path
        d="M54 17 H43 C44 18.5 44 19.5 43 21 L33 50 L35 50 L52 21 C53 19.5 53 18.5 54 17 Z"
        fill={`url(#veloraChampagne_${variant})`}
      />

      {/* Apex Diamond Anchor Jewel */}
      <path
        d="M34 47.5 L36.5 51 L34 54.5 L31.5 51 Z"
        fill={`url(#veloraRoseGold_${variant})`}
      />

      {/* Crowning Celestial 4-Point Solitaire Star */}
      <path
        d="M34 7 C34 11 35.8 12.8 40 12.8 C35.8 12.8 34 14.6 34 18.5 C34 14.6 32.2 12.8 28 12.8 C32.2 12.8 34 11 34 7 Z"
        fill={`url(#veloraChampagne_${variant})`}
      />
      <circle cx="34" cy="12.8" r="1.3" fill="#FFFFFF" />
    </svg>
  );
}

interface VeloraLogoProps {
  variant?: "dark" | "light" | "white";
  size?: number;
  showTagline?: boolean;
  className?: string;
}

/**
 * Modern Luxury Velora Brand Lockup: Maison Astronomical Seal + Refined Editorial Wordmark
 */
export function VeloraLogo({
  variant = "dark",
  size = 40,
  showTagline = true,
  className,
}: VeloraLogoProps) {
  const isWhite = variant === "white";

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 sm:gap-3.5 group select-none shrink-0", className)}
      aria-label="Velora Home"
    >
      {/* Maison Astronomical Seal */}
      <div className="shrink-0 flex items-center justify-center">
        <VeloraIcon size={size} variant={variant} className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span
            className={cn(
              "font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl md:text-[27px] font-medium tracking-[0.16em] sm:tracking-[0.22em] uppercase leading-none transition-colors duration-300",
              isWhite
                ? "text-white group-hover:text-[#F7DFD4]"
                : "text-stone-900 group-hover:text-[#BC8477]"
            )}
          >
            VELORA
          </span>
          {/* Subtle rose gold 4-point star accent */}
          <span className="ml-1 sm:ml-1.5 text-[#BC8477] text-[10px] sm:text-xs leading-none select-none">
            ✦
          </span>
        </div>

        {showTagline && (
          <span
            className={cn(
              "text-[6.5px] sm:text-[8px] md:text-[8.5px] uppercase tracking-[0.28em] sm:tracking-[0.38em] font-semibold mt-0.5 sm:mt-1 block leading-none transition-colors duration-300",
              isWhite ? "text-stone-300/80" : "text-[#BC8477]"
            )}
          >
            HAUTE LIFESTYLE
          </span>
        )}
      </div>
    </Link>
  );
}
