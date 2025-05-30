'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';

const steps = [
  {
    stepNumber: 1,
    title: 'Clock In & Start Your Day',
    description: 'Easily clock in with a single click. TrackerlyY starts monitoring your work session seamlessly.',
    illustration: 'https://placehold.co/400x300/4e7dd9/FFFFFF.png?text=Step+1', // Primary color
    aiHint: 'employee computer desk',
  },
  {
    stepNumber: 2,
    title: 'Get Verified Smartly',
    description: 'Engage with our fun, quick puzzle checks at random intervals to verify active work.',
    illustration: 'https://placehold.co/400x300/a174f8/FFFFFF.png?text=Step+2', // Accent color
    aiHint: 'puzzle solving concept',
  },
  {
    stepNumber: 3,
    title: 'Track Task Progress',
    description: 'Log time against specific tasks and projects, keeping everyone aligned and informed.',
    illustration: 'https://placehold.co/400x300/66c2ff/000000.png?text=Step+3', // A light blue/cyan
    aiHint: 'progress chart interface',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useScrollFadeIn();

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>} 
      id="how-it-works" 
      className="fade-in-section py-16 md:py-24 bg-background/70" // Adjusted background
    >
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            How Trackerly<span className="text-primary">Y</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started with TrackerlyY is simple. Follow these three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step) => (
            <Card key={step.stepNumber} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-card border-border/50">
              <div className="relative h-48 w-full">
                <Image
                  src={step.illustration}
                  alt={step.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={step.aiHint}
                />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold">
                  {step.stepNumber}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center text-card-foreground">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-muted-foreground">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
