
// src/app/(auth)/signup/page.tsx
import AuthForm from '@/components/auth/auth-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - TRACKERLY',
  description: 'Create your TRACKERLY account.',
};

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
