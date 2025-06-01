
// src/app/(auth)/forgot-password/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail, type AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, AlertTriangle, ArrowLeft } from 'lucide-react'; // Changed MailLock to Mail
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePasswordReset = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsEmailSent(false);

    const actionCodeSettings = {
      url: `${window.location.origin}/handle-auth-action`, // Redirect to the central handler
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setIsEmailSent(true);
      toast({
        title: 'Password Reset Email Sent',
        description: `If an account exists for ${email}, a password reset link has been sent. Please check your inbox (and spam folder).`,
        duration: 8000,
      });
    } catch (e) {
      const authError = e as AuthError;
      let errorMessage = 'Failed to send password reset email. Please try again.';
      if (authError.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (authError.code === 'auth/user-not-found') {
        // Don't explicitly say user not found for security, just that email was sent if exists.
        // The toast above handles this implicitly.
        setIsEmailSent(true); // Still show positive feedback to avoid user enumeration
         toast({
            title: 'Password Reset Email Sent',
            description: `If an account exists for ${email}, a password reset link has been sent. Please check your inbox (and spam folder).`,
            duration: 8000,
        });
        setIsLoading(false);
        return;
      } else if (authError.code === 'auth/api-key-not-valid') {
        errorMessage = 'CRITICAL: Firebase API Key is not valid.';
         toast({
            title: 'CRITICAL CONFIGURATION ERROR',
            description: "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is invalid for this operation. 1. Verify key in Firebase console. 2. Update .env (local) or hosting vars (deployed). 3. IMPORTANT: Restart local server or REDEPLOY application.",
            variant: 'destructive',
            duration: 15000,
         });
      } else if (authError.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for Firebase operations.";
        toast({
          title: 'Action Required: Authorize Domain',
          description: "Please add your app's domain (e.g., localhost, your-app.com) to the 'Authorized domains' list in your Firebase console (Authentication > Settings).",
          variant: 'destructive',
          duration: 15000,
        });
      } else {
         toast({
            title: 'Password Reset Failed',
            description: errorMessage,
            variant: 'destructive',
         });
      }
      setError(errorMessage);
      console.error('Password Reset Error:', authError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Mail className="h-12 w-12 text-primary" /> {/* Ensured Mail icon is used */}
          </div>
          <CardTitle className="font-headline text-3xl">Reset Your Password</CardTitle>
          <CardDescription>
            {isEmailSent
              ? `A password reset link has been sent to ${email} if an account exists. Please check your inbox.`
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEmailSent ? (
             <div className="text-center p-4 bg-primary/10 rounded-md">
              <Mail className="h-10 w-10 text-primary mx-auto mb-3" /> {/* Ensured Mail icon is used */}
              <h3 className="text-lg font-semibold text-foreground">Check Your Email</h3>
              <p className="text-muted-foreground text-sm">
                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                Follow the instructions in the email to set a new password.
              </p>
              <Button variant="link" onClick={() => setIsEmailSent(false)} className="mt-3 text-primary">
                Didn't receive it or use wrong email?
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-secondary/30 border-border/70"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="flex items-start p-3 rounded-md bg-destructive/10 border border-destructive/50 text-destructive text-sm">
                  <AlertTriangle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />} {/* Ensured Mail icon is used */}
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm pt-6">
          <Button variant="ghost" onClick={() => router.push('/signin')} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
          </Button>
           <Link href="/" className="mt-4 text-muted-foreground hover:text-primary hover:underline text-xs">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
