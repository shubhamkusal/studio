// src/app/terms-of-service/page.tsx
import type { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - TRACKERLY',
  description: 'Read the terms and conditions for using TRACKERLY.',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-3xl text-card-foreground">Terms of Service</CardTitle>
            <CardDescription className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none text-card-foreground space-y-4">
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the TRACKERLY website and services (the "Service") operated by TRACKERLY ("us", "we", or "our").
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
            <p>
              By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
            </p>
            <h3 className="font-semibold text-lg mt-6 mb-2">1. Accounts</h3>
            <p>
              When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <h3 className="font-semibold text-lg mt-6 mb-2">2. Intellectual Property</h3>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of TRACKERLY and its licensors.
            </p>
            <h3 className="font-semibold text-lg mt-6 mb-2">3. Termination</h3>
            <p>
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="mt-8">
              <em>
                This is a placeholder document. For a fully commercial application, you should consult with a legal professional to draft comprehensive and compliant terms of service.
              </em>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
