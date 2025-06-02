
// src/types/firestore.ts
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
  organizationId?: string | null;
  role?: 'owner' | 'admin' | 'member' | null;
  onboardingComplete?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrganizationOwner {
  uid: string;
  email: string | null;
}

export interface Organization {
  id?: string; // Document ID, set by Firestore
  name: string;
  description?: string;
  industry: Industry;
  owner: OrganizationOwner;
  orgCode: string; // Unique invite code e.g., TRK-XXXXXX
  members: string[]; // Array of user UIDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Retail",
  "Manufacturing", "Real Estate", "Non-Profit", "Consulting",
  "Marketing", "Media", "Logistics", "Hospitality", "Other"
] as const;

export type Industry = typeof industries[number];
