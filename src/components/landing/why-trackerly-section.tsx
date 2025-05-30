// src/components/landing/why-trackerly-section.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TimeTrackingIcon from '@/components/icons/time-tracking-icon';
import SmartVerificationIcon from '@/components/icons/smart-verification-icon';
import ManagerAlertsIcon from '@/components/icons/manager-alerts-icon';
import ActivityInsightsIcon from '@/components/icons/activity-insights-icon';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';

const features = [
  {
    icon: TimeTrackingIcon,
    title: 'Seamless Time Tracking',
    description: 'Effortlessly track work hours across projects and tasks with our intuitive interface.',
  },
  {
    icon: SmartVerificationIcon,
    title: 'Smart Verifications',
    description: 'Engaging puzzle checks ensure active work sessions, making verification fun and non-intrusive.',
  },
  {
    icon: ManagerAlertsIcon,
    title: 'Intelligent Manager Alerts',
    description: 'Get notified of unusual activity patterns or potential roadblocks, powered by AI.',
  },
  {
    icon: ActivityInsightsIcon,
    title: 'Productivity & Activity Insights', // Updated title
    description: 'Visualize productivity trends and gain actionable insights to optimize team performance.',
  },
];

export default function WhyTrackerlySection() {
  const sectionRef = useScrollFadeIn();

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>} 
      id="solutions" 
      className="fade-in-section py-16 md:py-24" 
    >
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Why <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TRACKERLY</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make TRACKERLY the ultimate productivity companion for modern teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-card hover:shadow-xl transition-shadow duration-300 border-border/50">
              <CardHeader className="items-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block"> 
                  <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
