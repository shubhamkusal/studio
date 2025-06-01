
// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, LogOut, Loader2, AlertTriangle } from 'lucide-react';
import OnboardingModal from '@/components/onboarding/onboarding-modal';

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
    if (!authLoading && user && !profileLoading) {
      if (userProfile) { // Profile exists
        if (!userProfile.organizationId || !userProfile.onboardingComplete) {
          setShowOnboardingModal(true);
        } else {
          setShowOnboardingModal(false); // User is fully onboarded
        }
      } else {
        // User exists, profile loading finished, but userProfile is null (error fetching/creating)
        // This is a critical state that indicates onboarding is needed or something went wrong fetching profile.
        console.warn("Dashboard: User authenticated, profile loading complete, but userProfile is null. Forcing onboarding modal.");
        setShowOnboardingModal(true); 
      }
    }
  }, [user, userProfile, authLoading, profileLoading]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  // Combined loading state for initial page load
  if (authLoading || (user && profileLoading && !showOnboardingModal)) { // Only show full page loader if onboarding modal isn't triggered yet
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user exists and onboarding modal should be shown (covers profile null or onboarding incomplete)
  if (user && showOnboardingModal) {
    return (
      <OnboardingModal 
        user={user} 
        isOpen={showOnboardingModal} 
        setIsOpen={(isOpen) => {
          setShowOnboardingModal(isOpen);
          if (!isOpen) { // If modal is closed (e.g. after successful onboarding)
            reloadUserProfile(); // Refresh profile to get latest org details
          }
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
              This is your TRACKERLY personal space. Org: {userProfile.organizationId}.
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
              <p className="mt-2 text-sm text-muted-foreground">
                (Dashboard content is currently a placeholder. Full features coming soon!)
              </p>
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

  // Fallback: User is logged in, auth & profile loading are done, but modal isn't triggered and main content can't show.
  // This indicates an unexpected state or an issue with profile data that the modal logic didn't catch.
  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h2 className="text-2xl font-semibold mb-3 text-card-foreground">Oops! Something went wrong.</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't load your dashboard details correctly. This might be due to a temporary issue or incomplete profile information that wasn't resolved by the onboarding step.
        </p>
        <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center">
          <Button onClick={async () => {
            setIsLoading(true); // Show loader while attempting reload
            await reloadUserProfile();
            // The useEffect hooks will re-evaluate and either show modal or dashboard content
          }} variant="outline" disabled={profileLoading || authLoading}>
            {(profileLoading || authLoading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} 
            Try Reloading Profile
          </Button>
          <Button onClick={() => router.push('/')} variant="ghost">Go to Homepage</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-8">
          If the issue persists, please contact support.
        </p>
     </div>
  );
}
