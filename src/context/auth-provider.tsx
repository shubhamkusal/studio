
// src/context/auth-provider.tsx
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { UserProfile } from '@/types/firestore';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  authLoading: boolean; // Renamed from 'loading' to be more specific
  profileLoading: boolean;
  reloadUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchOrCreateUserProfile(fbUser: FirebaseUser): Promise<UserProfile | null> {
  const userDocRef = doc(firestore, 'users', fbUser.uid);
  try {
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    } else {
      const newUserProfileData = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        onboardingComplete: false,
        organizationId: null,
        role: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userDocRef, newUserProfileData);
      const now = Timestamp.now();
      return {
        ...newUserProfileData,
        createdAt: now,
        updatedAt: now,
      } as UserProfile;
    }
  } catch (error) {
    console.error("Error in fetchOrCreateUserProfile:", error);
    // Propagate the error or return null to indicate failure
    // Depending on how you want to handle it upstream
    return null; 
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true); // Initialize as true

  const loadUserProfile = async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      setProfileLoading(true); // Set loading true before fetching
      try {
        const profile = await fetchOrCreateUserProfile(fbUser);
        setUserProfile(profile); // Profile can be UserProfile or null
      } catch (error) {
        console.error("Error loading user profile in AuthProvider:", error);
        setUserProfile(null); // Ensure profile is null on error
      } finally {
        setProfileLoading(false); // Always set loading false after attempt
      }
    } else {
      setUserProfile(null);
      setProfileLoading(false); // No user, so profile loading is done (false)
    }
  };
  
 useEffect(() => {
 const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false); // Auth state determined
 await loadUserProfile(currentUser); // Now load profile
    });
 return () => unsubscribe();
  }, []);

  const reloadUserProfile = async () => {
    if (user) {
      // No need to set authLoading here as auth state hasn't changed
      await loadUserProfile(user);
    }
  };

  // isLoading should reflect the combined loading states accurately.
  // If auth is loading, we are loading.
  // If auth is done, but we have a user, then profileLoading determines overall loading.
  // If auth is done and no user, we are not loading profile data.
  const isLoading = authLoading || (user != null && profileLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, authLoading, profileLoading, reloadUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
