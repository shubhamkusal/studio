
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

async function fetchOrCreateUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
  const userDocRef = doc(firestore, 'users', fbUser.uid);
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
      // Firestore will convert serverTimestamp to actual Timestamp
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newUserProfileData);
    // For immediate client-side use, simulate the timestamp
    const now = Timestamp.now();
    return {
      ...newUserProfileData,
      createdAt: now,
      updatedAt: now,
    } as UserProfile;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadUserProfile = async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      setProfileLoading(true);
      try {
        const profile = await fetchOrCreateUserProfile(fbUser);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null); // Handle error case
      } finally {
        setProfileLoading(false);
      }
    } else {
      setUserProfile(null);
      setProfileLoading(false);
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      await loadUserProfile(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const reloadUserProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  // Combined loading state
  const isLoading = authLoading || (user != null && profileLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, authLoading, profileLoading: user != null && profileLoading, reloadUserProfile }}>
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
