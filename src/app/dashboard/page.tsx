
// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, LogOut, Loader2 } from 'lucide-react';
import OnboardingModal from '@/components/onboarding/onboarding-modal'; // Import the modal

export default function DashboardPage() {
  const { user, userProfile, authLoading, profileLoading, reloadUserProfile } = useAuth();
  const router = useRouter();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Only proceed if auth and profile are loaded
    if (!authLoading && user && !profileLoading && userProfile) {
      if (!userProfile.organizationId || !userProfile.onboardingComplete) {
        setShowOnboardingModal(true);
      } else {
        setShowOnboardingModal(false);
      }
    }
  }, [user, userProfile, authLoading, profileLoading]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home after sign out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  // Combined loading state for initial page load
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If no user after loading, AuthProvider will redirect or this effect will catch it.
  // This state means we have a user, but their profile indicates onboarding is needed.
  if (user && showOnboardingModal) {
    return (
      <OnboardingModal 
        user={user} 
        isOpen={showOnboardingModal} 
        setIsOpen={(isOpen) => {
          setShowOnboardingModal(isOpen);
          // If modal is closed without completing, we might want to reload profile
          // or assume they will complete it. For now, just closes.
          if (!isOpen) reloadUserProfile(); 
        }} 
      />
    );
  }
  
  // If user exists, profile is loaded, and onboarding is complete
  if (user && userProfile && userProfile.organizationId && userProfile.onboardingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl border-border/50">
          <CardHeader className="text-center">
            <LayoutDashboard className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-3xl text-card-foreground">Welcome to Your Dashboard!</CardTitle>
            <CardDescription className="text-muted-foreground">
              This is your TRACKERLY personal space for Organization: {userProfile.organizationId}.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-card-foreground">
              Signed in as: <span className="font-semibold text-primary">{user.email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              User ID: {user.uid}
            </p>
            <p className="text-sm text-muted-foreground">
              Role: <span className="capitalize">{userProfile.role || 'N/A'}</span>
            </p>
            <div className="p-6 bg-secondary/30 rounded-lg my-6">
              <p className="text-lg font-medium text-card-foreground">Your tracked time and tasks will appear here.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleSignOut} variant="destructive" className="mt-4">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Fallback, e.g. if user is present but profile is somehow null after loading
  // or if logic for modal/dashboard doesn't cover a case.
  // This usually indicates an issue in state management or data fetching logic.
  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <p>Loading dashboard or an unexpected state occurred...</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
     </div>
  );
}
