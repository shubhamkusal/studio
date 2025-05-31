// src/components/landing/hero-section.tsx
'use client';

import { Button } from '@/components/ui/button';
import AnimatedController from './animated-controller';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  const sectionRef = useScrollFadeIn();
  
  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>} 
      className="fade-in-section container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4 sm:px-6 lg:px-8 text-center" // Ensure enough height minus navbar
    >
      <AnimatedController />
      
      <motion.div 
        className="text-center mt-10 sm:mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          Redefining Remote Work
        </h1>
        <p className="text-lg sm:text-xl text-primary/90 max-w-xl mx-auto mb-10">
          Clock-in. Get verified. Track your day the smart way with TRACKERLY.
        </p>
        <Button 
          size="lg" 
          className="mt-6 px-8 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-transform transform hover:scale-105"
          asChild
        >
          <Link href="/signup">Get Started Free</Link>
        </Button>
      </motion.div>
    </section>
  );
}
