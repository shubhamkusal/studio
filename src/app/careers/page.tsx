// src/app/careers/page.tsx
import type { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers - TRACKERLY',
  description: 'Join the TRACKERLY team and help redefine remote work.',
};

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center">
            <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-3xl text-card-foreground">Careers at TRACKERLY</CardTitle>
            <CardDescription className="text-muted-foreground">
              Help us build the future of remote work.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none text-card-foreground space-y-4">
            <p>
              We're always looking for passionate and talented individuals to join our mission. 
              TRACKERLY is a fast-growing company dedicated to creating innovative solutions for remote teams and organizations.
            </p>
            
            <h3 className="font-semibold text-lg mt-6 mb-2">Why Work With Us?</h3>
            <ul>
              <li>Be part of a dynamic and innovative team.</li>
              <li>Work on cutting-edge AI and collaboration technologies.</li>
              <li>Flexible remote work environment.</li>
              <li>Competitive salary and benefits.</li>
              <li>Opportunity to make a real impact.</li>
            </ul>

            <h3 className="font-semibold text-lg mt-6 mb-2">Current Openings</h3>
            <p>
              We do not have any specific openings at the moment, but we are always interested in hearing from talented individuals. 
              If you believe you have skills that would benefit TRACKERLY, please feel free to send your resume and a cover letter to careers@trackerly.com.
            </p>
            
            <p className="mt-8">
              <em>
                This is a placeholder careers page. For a real application, you would integrate this with an Applicant Tracking System (ATS) or list actual job openings.
              </em>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
