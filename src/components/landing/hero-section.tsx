'use client';

import { Button } from '@/components/ui/button';
import AnimatedController from './animated-controller';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';

export default function HeroSection() {
  const sectionRef = useScrollFadeIn();
  
  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>} 
      className="fade-in-section container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4 sm:px-6 lg:px-8 text-center"
    >
      <div className="mb-8">
        <AnimatedController />
      </div>
      <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Redefining
        </span> Remote Work.
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
        TrackerlyY helps startups track time, tasks, and engagement with ease and a touch of fun.
      </p>
      <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity transform hover:scale-105">
        Get Started Free
      </Button>
    </section>
  );
}
