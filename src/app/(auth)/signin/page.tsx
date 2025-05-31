
// src/app/(auth)/signin/page.tsx
import AuthForm from '@/components/auth/auth-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - TRACKERLY',
  description: 'Sign in to your TRACKERLY account.',
};

export default function SignInPage() {
  return <AuthForm mode="signin" />;
}
