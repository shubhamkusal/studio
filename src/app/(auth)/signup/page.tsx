
// src/app/(auth)/signup/page.tsx
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, type AuthError } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, AlertTriangle, UserPlus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { reloadUserProfile } = useAuth();

  const handleEmailPasswordSignUp = async (event: FormEvent) => {
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

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const actionCodeSettings = {
        url: `${window.location.origin}/handle-auth-action`, // Redirect to new handler page
        handleCodeInApp: true,
      };
      await sendEmailVerification(userCredential.user, actionCodeSettings);
      
      setIsVerificationEmailSent(true);
      toast({
        title: 'Verification Email Sent!',
        description: 'We’ve sent a verification link to your email. Please check it to activate your account and then sign in.',
        duration: 10000,
      });

    } catch (e) {
      const authError = e as AuthError;
      let errorMessage = 'Failed to create account. Please try again.';
      if (authError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in or use a different email.';
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. It should be at least 8 characters long.';
      } else if (authError.code === 'auth/api-key-not-valid') {
        errorMessage = 'CRITICAL: Firebase API Key is not valid. Please check your NEXT_PUBLIC_FIREBASE_API_KEY in your .env file (and restart your server if local) or your hosting provider\'s environment variable settings (and redeploy if hosted). Authentication cannot proceed.';
         toast({
            title: 'CRITICAL CONFIGURATION ERROR',
            description: "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is invalid for this operation. 1. Verify key in Firebase console. 2. Update .env (local) or hosting vars (deployed). 3. IMPORTANT: Restart local server or REDEPLOY application.",
            variant: 'destructive',
            duration: 15000,
         });
      } else if (authError.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/Password sign-up or Email Verification is not enabled for this Firebase project.";
        toast({
            title: 'Action Required: Enable Sign-in Method',
            description: "Please enable 'Email/Password' as a sign-in provider and ensure email verification is allowed in your Firebase console (Authentication > Sign-in method).",
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
            title: 'Sign Up Failed',
            description: errorMessage,
            variant: 'destructive',
         });
      }
      setError(errorMessage);
      console.error('Email/Password Sign Up Error:', authError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      await reloadUserProfile();
      toast({
        title: 'Signed In with Google!',
        description: 'Redirecting...',
      });
      router.push('/dashboard');
    } catch (e) {
      const authError = e as AuthError;
      let errorMessage = 'Could not sign in with Google. Please try again.';
       if (authError.code) {
        switch (authError.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = 'Sign-in popup closed before completion.';
            break;
          case 'auth/account-exists-with-different-credential':
            errorMessage = 'An account already exists with this email using a different sign-in method. Please sign in using that method.';
            break;
          case 'auth/api-key-not-valid':
             errorMessage = 'CRITICAL: Firebase API Key is not valid for Google Sign-In.';
             toast({
                title: 'CRITICAL CONFIGURATION ERROR',
                description: "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is invalid for Google Sign-In. 1. Verify key in Firebase console. 2. Update .env (local) or hosting vars (deployed). 3. IMPORTANT: Restart local server or REDEPLOY application.",
                variant: 'destructive',
                duration: 15000,
             });
             break;
          case 'auth/operation-not-allowed':
            errorMessage = "Google Sign-In is not enabled for this Firebase project.";
            toast({
                title: 'Action Required: Enable Sign-in Method',
                description: "Please enable 'Google' as a sign-in provider in your Firebase console (Authentication > Sign-in method).",
                variant: 'destructive',
                duration: 10000,
            });
            break;
          case 'auth/unauthorized-domain':
            errorMessage = "This domain is not authorized for Firebase operations.";
            toast({
              title: 'Action Required: Authorize Domain',
              description: "Please add your app's domain (e.g., localhost, your-app.com) to the 'Authorized domains' list in your Firebase console (Authentication > Settings).",
              variant: 'destructive',
              duration: 15000,
            });
            break;
          default:
            errorMessage = authError.message || errorMessage;
        }
      }
      if(!['auth/api-key-not-valid', 'auth/operation-not-allowed', 'auth/unauthorized-domain'].includes(authError.code)){ 
        toast({
          title: 'Google Sign In Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      setError(errorMessage);
      console.error('Google Sign In Error:', authError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <UserPlus className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Create Your Account</CardTitle>
          <CardDescription>Join TRACKERLY today. Start by entering your email and password or using Google.</CardDescription>
        </CardHeader>
        <CardContent>
          {isVerificationEmailSent ? (
            <div className="text-center p-4 bg-primary/10 rounded-md">
              <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground">Check Your Email!</h3>
              <p className="text-muted-foreground text-sm">
                We&apos;ve sent a verification link to <strong>{email}</strong>.
                Please click the link in the email to activate your account, then you can sign in.
              </p>
              <Button variant="link" onClick={() => setIsVerificationEmailSent(false)} className="mt-3 text-primary">
                Use a different email or resend?
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailPasswordSignUp} className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password (min. 8 characters)"
                        required
                        className="bg-secondary/30 border-border/70 pr-10"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        className="bg-secondary/30 border-border/70 pr-10"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
              {error && ( 
                <div className="flex items-start p-3 rounded-md bg-destructive/10 border border-destructive/50 text-destructive text-sm">
                  <AlertTriangle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Create Account & Send Verification
              </Button>
            </form>
          )}

          {!isVerificationEmailSent && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full hover:bg-secondary/50 border-border/70"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm pt-6">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
          <Link href="/" className="mt-4 text-muted-foreground hover:text-primary hover:underline text-xs">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
    
