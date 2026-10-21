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
    if (!container.current) return;

    // Hero Section Animations (only if elements exist)
    const heroTexts = container.current.querySelectorAll('.hero-text > *');
    if (heroTexts.length > 0) {
      gsap.from(heroTexts, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.1,
      });
    }
    
    const heroImage = container.current.querySelector('.hero-image');
    if (heroImage) {
      gsap.from(heroImage, {
        x: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3,
      });
    }

    // Features Strip Animation (only if trigger and items exist)
    const featuresStrip = container.current.querySelector('.features-strip');
    const featureItems = container.current.querySelectorAll('.feature-item');
    if (featuresStrip && featureItems.length > 0) {
      gsap.from(featureItems, {
        scrollTrigger: {
          trigger: featuresStrip,
          start: 'top 90%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }

    // Testimonials Animation (only if trigger and items exist)
    const testimonialsSection = container.current.querySelector('.testimonials-section');
    const testimonialItems = container.current.querySelectorAll('.testimonial-item');
    if (testimonialsSection && testimonialItems.length > 0) {
      gsap.from(testimonialItems, {
        scrollTrigger: {
          trigger: testimonialsSection,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }

  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
