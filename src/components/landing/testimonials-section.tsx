'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  quote: string;
  avatar: string;
  stars: number;
  aiHint: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'Founder & CEO',
    company: 'Innovatech Solutions',
    quote: "TrackerlyY has revolutionized how we manage our remote team. The smart verifications are genius and activity insights are invaluable!",
    avatar: 'https://placehold.co/100x100/4e7dd9/FFFFFF.png?text=SC', // Primary color
    stars: 5,
    aiHint: 'woman portrait professional',
  },
  {
    id: 2,
    name: 'David Miller',
    title: 'CTO',
    company: 'NextGen Startups',
    quote: "The ease of use and the fun gamified elements make TrackerlyY a hit with our developers. Productivity is up!",
    avatar: 'https://placehold.co/100x100/a174f8/FFFFFF.png?text=DM', // Accent color
    stars: 5,
    aiHint: 'man portrait tech',
  },
  {
    id: 3,
    name: 'Jessica Lee',
    title: 'Operations Manager',
    company: 'Creative Minds Inc.',
    quote: "We've tried other trackers, but TrackerlyY's balance of monitoring and trust is perfect for our creative team.",
    avatar: 'https://placehold.co/100x100/66c2ff/000000.png?text=JL', // Light blue
    stars: 4,
    aiHint: 'woman smiling office',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useScrollFadeIn();

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialsData.length) % testimonialsData.length);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      nextTestimonial();
    }, 5000); 
    return () => clearTimeout(timer);
  }, [currentIndex]);


  const current = testimonialsData[currentIndex];

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>} 
      className="fade-in-section py-16 md:py-24"
    >
      <div className="container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Loved by Startup <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Founders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear what our users have to say about TrackerlyY.
          </p>
        </div>

        <div className="relative">
          <Card className="max-w-2xl mx-auto bg-card shadow-lg p-6 md:p-8 overflow-hidden border-border/50">
            <CardContent className="text-center">
              <Image
                src={current.avatar}
                alt={current.name}
                width={80}
                height={80}
                className="rounded-full mx-auto mb-4 border-2 border-primary"
                data-ai-hint={current.aiHint}
              />
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < current.stars ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
              <blockquote className="text-lg italic text-card-foreground mb-4">
                "{current.quote}"
              </blockquote>
              <p className="font-semibold text-primary">{current.name}</p>
              <p className="text-sm text-muted-foreground">{current.title} at {current.company}</p>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 transform -translate-x-1/2 md:-translate-x-full rounded-full h-10 w-10 bg-card hover:bg-secondary text-foreground"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-1/2 md:translate-x-full rounded-full h-10 w-10 bg-card hover:bg-secondary text-foreground"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
         <div className="flex justify-center mt-8 space-x-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${currentIndex === index ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/50'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
      </div>
    </section>
  );
}
