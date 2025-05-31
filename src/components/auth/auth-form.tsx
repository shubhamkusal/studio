
// src/components/auth/auth-form.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, type AuthError } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase'; // Imported googleProvider
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

// Simple Google Icon SVG
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const title = mode === 'signin' ? 'Welcome Back!' : 'Create Your Account';
  const description = mode === 'signin' ? 'Sign in to access your dashboard.' : 'Join TRACKERLY today.';
  const buttonText = mode === 'signin' ? 'Sign In' : 'Sign Up';
  const Icon = mode === 'signin' ? KeyRound : UserPlus;

  const handleEmailPasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Account Created!',
          description: 'You have successfully signed up. Redirecting to dashboard...',
        });
        router.push('/dashboard');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Signed In!',
          description: 'Welcome back! Redirecting to dashboard...',
        });
        router.push('/dashboard');
      }
    } catch (e) {
      const authError = e as AuthError;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (authError.code) {
        switch (authError.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This user account has been disabled.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'This email address is already in use.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. It should be at least 6 characters.';
            break;
          case 'auth/api-key-not-valid':
             errorMessage = 'Firebase API Key is not valid. Please check your configuration.';
             break;
          default:
            errorMessage = authError.message || errorMessage;
        }
      }
      setError(errorMessage);
      toast({
        title: mode === 'signin' ? 'Sign In Failed' : 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error(authError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Signed In with Google!',
        description: 'Redirecting to dashboard...',
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
            errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
            break;
           case 'auth/api-key-not-valid':
             errorMessage = 'Firebase API Key is not valid. Please check your configuration.';
             break;
          default:
            errorMessage = authError.message || errorMessage;
        }
      }
      setError(errorMessage);
      toast({
        title: 'Google Sign In Failed',
        description: errorMessage,
        variant: 'destructive',
      });
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
             <Icon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-secondary/30 border-border/70"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icon className="mr-2 h-4 w-4" /> }
              {buttonText}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full hover:bg-secondary/50 border-border/70"
          >
            {isLoading && email === '' && password === '' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon /> }
            Sign {mode === 'signin' ? 'in' : 'up'} with Google
          </Button>

        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm pt-6">
          {mode === 'signin' ? (
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
          )}
           <Link href="/" className="mt-4 text-muted-foreground hover:text-primary hover:underline text-xs">
              Back to Home
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

