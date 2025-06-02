
// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth'; // Keep for potential sign out on error
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, LogOut, Loader2, AlertTriangle } from 'lucide-react';
import OnboardingModal from '@/components/onboarding/onboarding-modal';
import DashboardHomeOverview from '@/components/dashboard/dashboard-home-overview'; // Import the overview

export default function DashboardPage() {
  const { user, userProfile, authLoading, profileLoading, reloadUserProfile } = useAuth();
  const router = useRouter();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // General page loading state

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return; // Early exit if no user and auth is done
    }

    // Only proceed if auth and profile are loaded, and user exists
    if (!authLoading && user && !profileLoading) {
      if (userProfile) {
        if (!userProfile.organizationId || !userProfile.onboardingComplete) {
          setShowOnboardingModal(true);
        } else {
          setShowOnboardingModal(false);
        }
      } else {
        // User exists, profile loading finished, but userProfile is null (error or incomplete creation)
        console.warn("Dashboard: User authenticated, profile data issue. Forcing onboarding.");
        setShowOnboardingModal(true);
      }
      setPageLoading(false); // All checks complete, page is ready or modal will show
    } else if (authLoading || (user && profileLoading)) {
      // If still loading auth or profile (and user exists), keep page loading
      setPageLoading(true);
    } else if (!user && !authLoading) {
        // No user and auth done, already handled by router push, but set page loading to false
        setPageLoading(false);
    }

  }, [user, userProfile, authLoading, profileLoading, router]);


  // Handle sign out, could be moved or refactored later
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user && showOnboardingModal) {
    return (
      <OnboardingModal
        user={user}
        isOpen={showOnboardingModal}
        setIsOpen={(isOpen) => {
          setShowOnboardingModal(isOpen);
          if (!isOpen) {
            // If modal is closed (e.g., after successful onboarding),
            // reload profile to ensure data consistency before rendering dashboard.
            // The useEffect above will then re-evaluate and hide the modal
            // if onboardingComplete and organizationId are set.
            reloadUserProfile();
          }
        }}
      />
    );
  }

  // If user is authenticated, profile loaded, and onboarding is complete
  if (user && userProfile && userProfile.organizationId && userProfile.onboardingComplete) {
    // Render the actual dashboard content (wrapped by dashboard layout)
    return <DashboardHomeOverview />;
  }


  // Fallback for unexpected states, e.g., user exists but profile is still problematic
  // after onboarding attempt or if modal was closed prematurely without completing.
  // This state should ideally be rare if onboarding modal logic is robust.
  if (user && !showOnboardingModal) { // User exists, but not showing modal (meaning onboarding *should* be complete or profile error)
     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">Access Issue</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We couldn't fully load your dashboard. This might be due to incomplete setup or a temporary issue.
            Please ensure you have created or joined an organization.
          </p>
          <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center">
            <Button onClick={async () => {
              setPageLoading(true); // Show loader
              await reloadUserProfile(); // Attempt to reload profile
              // The useEffect hooks will re-evaluate and direct accordingly
            }} variant="outline" disabled={profileLoading || authLoading}>
              {(profileLoading || authLoading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Refresh Profile
            </Button>
            <Button onClick={handleSignOut} variant="ghost">Sign Out & Start Over</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-8">
            If the issue persists, please contact support.
          </p>
       </div>
    );
  }

  // If no user (and not authLoading), router.push('/signin') should have already redirected.
  // This is an ultimate fallback or can be a loader if preferred.
  return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Finalizing...</p>
      </div>
  );
}
