// src/app/cookie-policy/page.tsx
import type { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy - TRACKERLY',
  description: 'Learn about how TRACKERLY uses cookies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center">
            <Cookie className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-3xl text-card-foreground">Cookie Policy</CardTitle>
            <CardDescription className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none text-card-foreground space-y-4">
            <p>
              This Cookie Policy explains what cookies are and how TRACKERLY ("us", "we", or "our") uses them on our website and services (the "Service").
              You should read this policy so you can understand what type of cookies we use, the information we collect using cookies and how that information is used.
            </p>
            
            <h3 className="font-semibold text-lg mt-6 mb-2">What Are Cookies?</h3>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit a website.
              They allow the website to recognize your device and remember if you’ve been to the website before.
              Cookies are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-2">How Do We Use Cookies?</h3>
            <p>
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
            </p>
            <p>
              [Placeholder for types of cookies used, e.g., essential cookies, performance cookies, functionality cookies, targeting/advertising cookies.]
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-2">Your Choices Regarding Cookies</h3>
            <p>
              If you prefer to avoid the use of cookies on the Website, first you must disable the use of cookies in your browser and then delete the cookies saved in your browser associated with this website. You may use this option for preventing the use of cookies at any time.
            </p>
            
            <p className="mt-8">
              <em>
                This is a placeholder document. For a fully commercial application, you should consult with a legal professional to draft a comprehensive and compliant cookie policy and implement a cookie consent mechanism.
              </em>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
