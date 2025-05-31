// src/components/landing/interactive-dashboard-section.tsx
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PuzzleVerificationModal } from './puzzle-verification-modal';
import { useState } from 'react';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';

export default function InteractiveDashboardSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useScrollFadeIn();

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>} 
      className="fade-in-section py-16 md:py-24"
    >
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Experience TRACKERLY in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See a glimpse of our intuitive dashboard designed for clarity and efficiency.
          </p>
        </div>

        <div className="relative rounded-lg shadow-2xl overflow-hidden border border-border p-2 bg-card">
          <Image
            src="https://placehold.co/1200x750.png?text=TRACKERLY%20Dashboard%0A%0AWelcome,%20User!%0A%0A%5BActivity%20Chart%5D%20%20%5BTask%20List%5D%0A%0A%5BTeam%20Stats%5D%20%20%5BRecent%20Alerts%5D"
            alt="TRACKERLY Dashboard Mockup"
            width={1200}
            height={750}
            className="rounded-md"
            data-ai-hint="dashboard interface analytics"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex flex-col items-center justify-end p-8 opacity-0 hover:opacity-100 transition-opacity duration-300">
             <Button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Trigger Puzzle Verification
              </Button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-muted-foreground">
          *Dashboard mockup. Actual interface may vary. Interactive elements are simplified for demo purposes.
        </p>
      </div>
      <PuzzleVerificationModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </section>
  );
}
