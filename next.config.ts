import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ultra-fast compilation: Disable React 19 duplicate dev render & AST checks
  reactStrictMode: false,
  poweredByHeader: false,

  // Keep recently navigated pages warm in memory for instantaneous sub-20ms transitions
  onDemandEntries: {
    maxInactiveAge: 300 * 1000,
    pagesBufferLength: 30,
  },

  // Ultra-fast compilation: Tree-shake heavy libraries at compile time
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'gsap',
      '@gsap/react',
      'recharts',
      'clsx',
      'tailwind-merge',
      'sonner',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
      '@tanstack/react-table',
      'zod',
      'axios',
      'lenis',
      'zustand',
      'react-hook-form',
      '@hookform/resolvers',
      'next-themes',
      'next-seo',
    ],
  },

  // Ultra-fast image delivery: Allow browser to load compressed CDN images in parallel
  // completely bypassing Next.js server image proxy bottlenecks
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'thumb.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      }
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
