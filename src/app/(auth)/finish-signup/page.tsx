
// src/app/(auth)/finish-signup/page.tsx
// This page is being deprecated and replaced by the new /handle-auth-action page
// and the standard email+password sign-up flow.
// Keeping the file for now but it should not be actively used in the new flow.

'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DeprecatedFinishSignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 text-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <CardTitle className="font-headline text-2xl">Page No Longer In Use</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="max-w-md mb-6">
            This page was part of a previous sign-up flow. Our authentication process has been updated.
            If you received an email link, please ensure it&apos;s the most recent one.
            Password resets and email verifications are now handled through a unified action page.
          </CardDescription>
          <div className="space-y-3">
            <Button asChild>
              <Link href="/signup">Go to Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signin">Go to Sign In</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary">
                Back to Home
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
