'use client';

import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { usePathname } from 'next/navigation';

// Register GSAP plugins globally here
gsap.registerPlugin(useGSAP);

interface LenisInstance {
  raf: (time: number) => void;
  resize: () => void;
}

interface LenisRefHandle {
  lenis?: LenisInstance;
}

export function GSAPLenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRefHandle | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Recalculate dimensions on route changes
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.resize();
    }
  }, [pathname]);

  return (
    <ReactLenis 
      root 
      ref={lenisRef} 
      autoRaf={false}
      options={{
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
