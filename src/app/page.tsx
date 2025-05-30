import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/landing/hero-section';
import WhyTrackerlySection from '@/components/landing/why-trackerly-section';
import InteractiveDashboardSection from '@/components/landing/interactive-dashboard-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';
import TestimonialsSection from '@/components/landing/testimonials-section';
import AnomalyDetectionCard from '@/components/landing/anomaly-detection-card';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-discord-gradient"> {/* Applied gradient background */}
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WhyTrackerlySection />
        <InteractiveDashboardSection />
        <HowItWorksSection />
        <AnomalyDetectionCard />
        <TestimonialsSection />
        <section id="pricing" className="py-16 md:py-24 text-center">
          <div className="container mx-auto">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Pricing</h2>
            <p className="text-muted-foreground mt-4">Coming Soon! Flexible plans for teams of all sizes.</p>
          </div>
        </section>
        <section id="company" className="py-16 md:py-24 bg-background/50 text-center">
          <div className="container mx-auto">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Our Company</h2>
            <p className="text-muted-foreground mt-4">Learn more about the team behind TrackerlyY.</p>
            <p className="text-muted-foreground mt-2">We are passionate about building tools that empower remote teams.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
