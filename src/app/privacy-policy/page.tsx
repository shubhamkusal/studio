// src/app/privacy-policy/page.tsx
import type { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - TRACKERLY',
  description: 'Learn about how TRACKERLY handles your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-3xl text-card-foreground">Privacy Policy</CardTitle>
            <CardDescription className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none text-card-foreground space-y-4">
            <p>
              Welcome to TRACKERLY! We are committed to protecting your personal information and your right to privacy.
              If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information,
              please contact us at support@trackerly.com.
            </p>
            <p>
              This privacy notice describes how we might use your information if you:
            </p>
            <ul>
              <li>Visit our website at [Your Website URL]</li>
              <li>Engage with us in other related ways ― including any sales, marketing, or events</li>
            </ul>
            <p>
              In this privacy notice, if we refer to:
            </p>
            <ul>
              <li>"Website," we are referring to any website of ours that references or links to this policy</li>
              <li>"Services," we are referring to our Website, and other related services, including any sales, marketing, or events</li>
            </ul>
            <h3 className="font-semibold text-lg mt-6 mb-2">1. WHAT INFORMATION DO WE COLLECT?</h3>
            <p>
              [Placeholder for information collection details. Explain what personal data is collected, e.g., names, email addresses, payment information, usage data, etc.]
            </p>
            <h3 className="font-semibold text-lg mt-6 mb-2">2. HOW DO WE USE YOUR INFORMATION?</h3>
            <p>
              [Placeholder for information usage details. Explain how the collected data is used, e.g., to provide and maintain the service, to notify users about changes, for customer support, to gather analysis or valuable information so that we can improve our Service, etc.]
            </p>
            <h3 className="font-semibold text-lg mt-6 mb-2">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h3>
            <p>
              [Placeholder for information sharing details. Explain if and how data is shared with third parties, e.g., service providers, business partners, or if required by law.]
            </p>
            <p className="mt-8">
              <em>
                This is a placeholder document. For a fully commercial application, you should consult with a legal professional to draft a comprehensive and compliant privacy policy.
              </em>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
