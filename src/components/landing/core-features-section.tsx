// src/components/landing/core-features-section.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';
import SmartClockIcon from '@/components/icons/smart-clock-icon';
import TimeTrackingIcon from '@/components/icons/time-tracking-icon'; // Reusing
import DocumentManagementIcon from '@/components/icons/document-management-icon';
import RoleShiftConfigIcon from '@/components/icons/role-shift-config-icon';
import HrmsAiIcon from '@/components/icons/hrms-ai-icon';
import VoiceCommunicationIcon from '@/components/icons/voice-communication-icon';
import DeepAnalyticsIcon from '@/components/icons/deep-analytics-icon';
import MultiDepartmentIcon from '@/components/icons/multi-department-icon';
import PersonalProductivityIcon from '@/components/icons/personal-productivity-icon';
import type { ComponentType, SVGProps } from 'react';

interface Feature {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const coreFeatures: Feature[] = [
  {
    icon: SmartClockIcon,
    title: 'Smart Clock-In/Out System',
    description: 'Replicates a real office experience with strict shift handling. Tracks punctuality, idle time, and work duration.',
  },
  {
    icon: TimeTrackingIcon, // Reusing
    title: 'Time Tracking & Task Management',
    description: 'Assign tasks, monitor task progress, and accurately log time spent on each specific task.',
  },
  {
    icon: DocumentManagementIcon,
    title: 'Document Management',
    description: 'Securely upload, organize, and version documents for individuals and teams, with access controls.',
  },
  {
    icon: RoleShiftConfigIcon,
    title: 'Role & Shift Configuration',
    description: 'Define user roles, manage access levels, and configure complex shift patterns, including bulk management.',
  },
  {
    icon: HrmsAiIcon,
    title: 'HRMS-Integrated AI Operations',
    description: 'AI monitors attendance, behavior, and patterns, providing anomaly detection and actionable alerts.',
  },
  {
    icon: VoiceCommunicationIcon,
    title: 'Real-Time Voice Communication',
    description: 'Discord-like voice channels for team calls, multiple workspaces, and instant communication.',
  },
  {
    icon: DeepAnalyticsIcon,
    title: 'Deep Analytics Dashboard',
    description: 'AI-powered data visualization for team efficiency, task performance, and identifying project bottlenecks.',
  },
  {
    icon: MultiDepartmentIcon,
    title: 'Multi-Department Collaboration',
    description: 'Facilitates seamless teamwork across departments like Dev, Design, HR, and Admin within unified workspaces.',
  },
  {
    icon: PersonalProductivityIcon,
    title: 'Personal Productivity Mode',
    description: 'Empowers solo users with tools for self-assigned tasks, reminders, and calendar-based workflow management.',
  },
];

export default function CoreFeaturesSection() {
  const sectionRef = useScrollFadeIn();

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="core-features"
      className="fade-in-section py-16 md:py-24"
    >
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            An Entirely New Way to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Manage & Work</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            TRACKERLY integrates every aspect of remote work into one intelligent, gamified platform. Explore the features that set us apart.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="text-center bg-card hover:shadow-xl transition-shadow duration-300 border-border/50 flex flex-col">
              <CardHeader className="items-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block">
                  <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-muted-foreground text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
