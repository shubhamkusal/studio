// hooks/useAuthRedirect.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const useAuthRedirect = () => {
  const router = useRouter();
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || '/dashboard';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, redirect to dashboard
        console.log('User already logged in, redirecting to dashboard');
        
        if (dashboardUrl.startsWith('http')) {
          window.location.href = dashboardUrl;
        } else {
          router.push(dashboardUrl);
        }
      }
    });

    return () => unsubscribe();
  }, [router, dashboardUrl]);
};

// Use in your landing page component
const LandingPage = () => {
  useAuthRedirect(); // Redirects if already logged in
  
  return (
    <div>
      {/* Your landing page content */}
    </div>
  );
};
