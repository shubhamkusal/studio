// src/app/blog/page.tsx
import type { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rss } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - TRACKERLY',
  description: 'Latest news, insights, and updates from the TRACKERLY team.',
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center">
            <Rss className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-3xl text-card-foreground">TRACKERLY Blog</CardTitle>
            <CardDescription className="text-muted-foreground">
              Insights, news, and updates on remote work, productivity, and AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none text-card-foreground space-y-4">
            <p>
              Welcome to the TRACKERLY blog! Here, we'll share our thoughts on the evolving world of remote work, productivity strategies, 
              the latest in AI for workflow management, and updates about our platform.
            </p>
            
            <h3 className="font-semibold text-lg mt-6 mb-2">Latest Posts</h3>
            <p>
              <em>No blog posts yet. Check back soon!</em>
            </p>
            <p>
              [Placeholder for a list of blog posts. Each post would typically link to its own page.]
            </p>
            
            <p className="mt-8">
              <em>
                This is a placeholder blog page. For a real application, you would integrate this with a Content Management System (CMS) or build out a blogging platform.
              </em>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
