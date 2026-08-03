'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GSAPPageAnimator({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Section Animations
    gsap.from('.hero-text > *', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.1,
    });
    
    gsap.from('.hero-image', {
      x: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3,
    });

    // Features Strip Animation
    gsap.from('.feature-item', {
      scrollTrigger: {
        trigger: '.features-strip',
        start: 'top 90%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
    });

    // Testimonials Animation
    gsap.from('.testimonial-item', {
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });

  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
