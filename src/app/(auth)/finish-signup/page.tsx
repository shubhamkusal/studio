
// src/app/(auth)/finish-signup/page.tsx
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, signInWithEmailLink, updatePassword, type AuthError, type UserCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';

export default function FinishSignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLinkVerified, setIsLinkVerified] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<UserCredential['user'] | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { reloadUserProfile } = useAuth();

  useEffect(() => {
    const processEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsLoading(true);
        let storedEmail = window.localStorage.getItem('emailForSignIn');
        if (!storedEmail) {
          // Fallback if email is not in localStorage (e.g., user opened link on different device)
          // For simplicity, we'll prompt. A more robust solution might involve a separate step.
          storedEmail = window.prompt('Please provide your email address to complete sign-up:');
          if (storedEmail) window.localStorage.setItem('emailForSignIn', storedEmail);
        }

        if (!storedEmail) {
          setError('Email address is required to complete sign-up. Please try the link again or restart the sign-up process.');
          toast({ title: 'Error', description: 'Email not found for sign-up completion.', variant: 'destructive' });
          setIsLoading(false);
          return;
        }
        setEmail(storedEmail);

        try {
          const userCredential = await signInWithEmailLink(auth, storedEmail, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          
          setFirebaseUser(userCredential.user);
          setIsLinkVerified(true);
          toast({ title: 'Email Verified!', description: 'Please set your password to complete registration.' });

        } catch (e) {
          const authError = e as AuthError;
          let errorMessage = 'Invalid or expired sign-up link.';
           if (authError.code === 'auth/invalid-action-code') {
            errorMessage = 'The sign-up link is invalid or has expired. Please try signing up again.';
          } else if (authError.code === 'auth/user-disabled') {
            errorMessage = 'This account has been disabled.';
          } else if (authError.code === 'auth/api-key-not-valid'){
            errorMessage = 'Firebase API Key is not valid. Please check your NEXT_PUBLIC_FIREBASE_API_KEY environment variable and restart your server.';
          }
          setError(errorMessage);
          toast({ title: 'Sign Up Link Error', description: errorMessage, variant: 'destructive' });
          console.error('Email Link Sign In Error:', authError);
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('This page is for completing email sign-up. If you received a link, please use it. Otherwise, start the sign-up process.');
        // Optionally redirect or show minimal UI
      }
    };
    processEmailLink();
  }, [toast]);

  const handleSetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) { 
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!firebaseUser) {
      setError('User session not found. Please try the sign-up link again.');
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(firebaseUser, password);
      setIsPasswordSet(true);
      await reloadUserProfile(); 
      toast({
        title: 'Password Set Successfully!',
        description: 'Your account is ready. Redirecting...',
      });
      router.push('/dashboard'); 
    } catch (e) {
      const authError = e as AuthError;
      let errorMessage = 'Failed to set password. Please try again.';
      if (authError.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password (at least 8 characters).';
      }
      setError(errorMessage);
      toast({ title: 'Password Error', description: errorMessage, variant: 'destructive' });
      console.error('Set Password Error:', authError);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !isLinkVerified && !isPasswordSet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying sign-up link...</p>
      </div>
    );
  }

  if (!isLinkVerified && error) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-2">Sign-Up Link Problem</h1>
        <p className="text-muted-foreground max-w-md mb-6">{error}</p>
        <Button asChild>
          <Link href="/signup">Try Sign Up Again</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        {isLinkVerified && !isPasswordSet && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <ShieldCheck className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="font-headline text-3xl">Email Verified!</CardTitle>
              <CardDescription>Welcome, {email}! Please set a password for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password (min. 8 characters)"
                    required
                    className="bg-secondary/30 border-border/70"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="bg-secondary/30 border-border/70"
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                  Set Password & Finish Sign Up
                </Button>
              </form>
            </CardContent>
          </>
        )}
        {isPasswordSet && (
            <CardContent className="text-center p-8">
                 <ShieldCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="font-headline text-2xl mb-2">Account Ready!</CardTitle>
                <CardDescription className="mb-4">You&apos;re all set. Redirecting you to the dashboard...</CardDescription>
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </CardContent>
        )}
         {!isLinkVerified && !error && !isLoading && (
           <CardContent className="text-center p-8">
             <CardTitle className="font-headline text-2xl mb-2">Invalid Access</CardTitle>
             <CardDescription className="mb-4">
               This page is for completing an email-based sign-up. If you clicked a link in your email, please ensure it hasn&apos;t expired.
             </CardDescription>
             <Button asChild variant="link">
               <Link href="/signup">Go to Sign Up</Link>
             </Button>
           </CardContent>
         )}
        <CardFooter className="flex flex-col items-center text-sm pt-6">
          <Link href="/" className="text-muted-foreground hover:text-primary hover:underline text-xs">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
