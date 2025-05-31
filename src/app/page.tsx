import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/landing/hero-section';
import WhyTrackerlySection from '@/components/landing/why-trackerly-section';
import CoreFeaturesSection from '@/components/landing/core-features-section'; // New Import
import InteractiveDashboardSection from '@/components/landing/interactive-dashboard-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';
import TestimonialsSection from '@/components/landing/testimonials-section';
import AnomalyDetectionCard from '@/components/landing/anomaly-detection-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Coming Soon',
    description: 'For individuals and small teams getting started.',
    features: ['Up to 5 Users', 'Core Time Tracking', 'Basic Reporting', 'Personal Productivity Mode'],
    cta: 'Notify Me',
  },
  {
    name: 'Pro',
    price: 'Coming Soon',
    description: 'For growing teams needing more features and support.',
    features: ['Up to 20 Users', 'Advanced Time Tracking', 'Smart Verifications', 'AI Anomaly Alerts', 'Basic Document Management', 'Priority Support'],
    badge: 'Most Popular',
    cta: 'Notify Me',
  },
  {
    name: 'Enterprise',
    price: 'Coming Soon',
    description: 'For large organizations with custom needs.',
    features: ['Unlimited Users', 'All Pro Features', 'Role & Shift Config', 'HRMS AI Operations', 'Voice Communication', 'Deep Analytics', 'Advanced Security & SLA'],
    cta: 'Contact Us',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WhyTrackerlySection />
        <CoreFeaturesSection /> {/* Added new section */}
        <InteractiveDashboardSection />
        <HowItWorksSection />
        <AnomalyDetectionCard />
        <TestimonialsSection />
        
        <section id="pricing" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">
                Flexible Plans for Teams of All Sizes
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Choose the plan that's right for you. All our amazing features are coming soon!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <Card key={plan.name} className={`flex flex-col ${plan.name === 'Pro' ? 'border-primary shadow-primary/20 shadow-lg' : 'border-border'}`}>
                  {plan.badge && (
                    <div className="text-center py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-t-lg">
                      {plan.badge}
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl text-card-foreground">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-foreground">{plan.price.startsWith('Coming') ? '' : '$'}</span>
                      <span className="text-4xl font-bold text-foreground">{plan.price.startsWith('Coming') ? plan.price : plan.price.split('/')[0]}</span>
                      {plan.price.includes('/') && <span className="text-muted-foreground">/{plan.price.split('/')[1]}</span>}
                       {plan.price.startsWith('Coming') && <p className="text-sm text-muted-foreground mt-1">Details coming soon</p>}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-muted-foreground">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <p className="text-center mt-8 text-sm text-muted-foreground">
              * All pricing and features are illustrative and subject to change. Final details will be announced soon.
            </p>
          </div>
        </section>

        <section id="company" className="py-16 md:py-24 text-center">
          <div className="container mx-auto">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Our Company</h2>
            <p className="text-muted-foreground mt-4">Learn more about the team behind TRACKERLY.</p>
            <p className="text-muted-foreground mt-2">We are passionate about building tools that empower remote teams.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
