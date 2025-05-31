
// src/app/(auth)/signin/page.tsx
import AuthForm from '@/components/auth/auth-form';

// No server-side metadata for client components, metadata is now in AuthForm.
// It can also be defined here if this page remains a Server Component wrapping AuthForm.
// For simplicity, assuming AuthForm handles its title needs or it's set globally.

export default function SignInPage() {
  // The AuthForm component is already set up to handle both email/password sign-in
  // and Google Sign-In. No changes are needed here for the custom sign-up flow,
  // as that flow is handled by /signup and /finish-signup.
  return <AuthForm mode="signin" />;
}
