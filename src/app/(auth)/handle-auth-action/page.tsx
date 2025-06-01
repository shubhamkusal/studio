
// src/app/(auth)/handle-auth-action/page.tsx
'use client';

import { useEffect, useState, type FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  applyActionCode, 
  verifyPasswordResetCode, 
  confirmPasswordReset, 
  checkActionCode,
  type AuthError 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, ShieldCheck, KeyRound, MailWarning, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function HandleAuthActionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [mode, setMode] = useState<string | null>(null);
  const [actionCode, setActionCode] = useState<string | null>(null);
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [lang, setLang] = useState<string | null>('en');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isResetCodeVerified, setIsResetCodeVerified] = useState(false);
  const [resetEmail, setResetEmail] = useState<string | null>(null);


  useEffect(() => {
    const currentMode = searchParams.get('mode');
    const currentActionCode = searchParams.get('oobCode');
    const currentContinueUrl = searchParams.get('continueUrl'); // Optional
    const currentLang = searchParams.get('lang'); // Optional

    setMode(currentMode);
    setActionCode(currentActionCode);
    setContinueUrl(currentContinueUrl);
    if (currentLang) setLang(currentLang);

    if (!currentMode || !currentActionCode) {
      setError("Invalid request. Missing mode or action code.");
      setIsLoading(false);
      return;
    }
    processAction(currentMode, currentActionCode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const processAction = async (currentMode: string, currentActionCode: string) => {
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      switch (currentMode) {
        case 'verifyEmail':
          await applyActionCode(auth, currentActionCode);
          setStatusMessage("Email verified successfully! You can now sign in with your credentials.");
          toast({ title: "Success!", description: "Your email has been verified." });
          break;
        case 'resetPassword':
          const actionCodeInfo = await checkActionCode(auth, currentActionCode);
          setResetEmail(actionCodeInfo.data.email || 'your email');
          // verifyPasswordResetCode also checks the code but doesn't return email directly.
          // Using checkActionCode first is better to get email for display.
          await verifyPasswordResetCode(auth, currentActionCode); // verify again just to be sure before showing form
          setIsResetCodeVerified(true);
          setStatusMessage(`Please enter a new password for ${actionCodeInfo.data.email || 'your account'}.`);
          break;
        // Potentially handle other modes like 'recoverEmail' if implemented later
        default:
          setError(`Invalid action mode: ${currentMode}.`);
          toast({ title: "Error", description: `Unsupported action: ${currentMode}`, variant: "destructive" });
      }
    } catch (e) {
      const authError = e as AuthError;
      let userErrorMessage = "An error occurred. The link may be invalid or expired.";
      if (authError.code === 'auth/invalid-action-code') {
        userErrorMessage = "Invalid or expired link. Please try the action again (e.g., resend verification or request a new password reset).";
      } else if (authError.code === 'auth/user-disabled') {
        userErrorMessage = "This account has been disabled.";
      } else if (authError.code === 'auth/user-not-found') {
        userErrorMessage = "User not found. The link may be associated with a deleted account.";
      } else if (authError.code === 'auth/api-key-not-valid') {
        userErrorMessage = 'CRITICAL: Firebase API Key is not valid for this operation.';
         toast({
            title: 'CRITICAL CONFIGURATION ERROR',
            description: "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is invalid. 1. Verify key in Firebase console. 2. Update .env or hosting vars. 3. IMPORTANT: Restart server or REDEPLOY.",
            variant: 'destructive',
            duration: 15000,
         });
      } else if (authError.code === 'auth/unauthorized-domain') {
        userErrorMessage = "This domain is not authorized for Firebase operations.";
        toast({
          title: 'Action Required: Authorize Domain',
          description: "Please add your app's domain to 'Authorized domains' in Firebase console (Authentication > Settings).",
          variant: 'destructive',
          duration: 15000,
        });
      }
      setError(userErrorMessage);
      toast({ title: "Action Failed", description: userErrorMessage, variant: "destructive" });
      console.error(`Error handling action code (${currentMode}):`, authError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPasswordReset = async (event: FormEvent) => {
    event.preventDefault();
    if (!actionCode) {
      setError("Action code is missing. Cannot reset password.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setStatusMessage("Password has been reset successfully! You can now sign in with your new password.");
      toast({ title: "Password Reset Successful!", description: "You can now sign in with your new password." });
      setIsResetCodeVerified(false); // Hide password form
    } catch (e) {
      const authError = e as AuthError;
      let userErrorMessage = "Failed to reset password. Please try again.";
      if (authError.code === 'auth/weak-password') {
        userErrorMessage = "Password is too weak. Please choose a stronger password (at least 8 characters).";
      } else if (authError.code === 'auth/invalid-action-code') {
        userErrorMessage = "Invalid or expired password reset link. Please request a new one.";
        setIsResetCodeVerified(false); // Link is bad, hide form
      }
      setError(userErrorMessage);
      toast({ title: "Password Reset Failed", description: userErrorMessage, variant: "destructive" });
      console.error("Error confirming password reset:", authError);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Processing your request...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center">
            {!error && mode === 'verifyEmail' && !isResetCodeVerified && <ShieldCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />}
            {!error && mode === 'resetPassword' && isResetCodeVerified && <KeyRound className="h-12 w-12 text-primary mx-auto mb-4" />}
            {error && <MailWarning className="h-12 w-12 text-destructive mx-auto mb-4" />}
            {!error && !isResetCodeVerified && !statusMessage && mode !== 'resetPassword' && <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />}


          <CardTitle className="font-headline text-2xl">
            {error ? "Action Failed" : 
             mode === 'verifyEmail' ? "Email Verification" :
             mode === 'resetPassword' ? (isResetCodeVerified ? "Set New Password" : "Password Reset") :
             "Processing Action"}
          </CardTitle>
          {statusMessage && !error && <CardDescription>{statusMessage}</CardDescription>}
          {error && <CardDescription className="text-destructive">{error}</CardDescription>}
        </CardHeader>
        
        <CardContent>
          {mode === 'resetPassword' && isResetCodeVerified && !statusMessage.includes("successfully") && (
            <form onSubmit={handleConfirmPasswordReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                    <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 8 characters)"
                        required
                        className="bg-secondary/30 border-border/70 pr-10"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                    >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                 <div className="relative">
                    <Input
                        id="confirmNewPassword"
                        type={showConfirmNewPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="bg-secondary/30 border-border/70 pr-10"
                        disabled={isLoading}
                    />
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        tabIndex={-1}
                    >
                        {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-center text-sm pt-6">
          {(statusMessage || error) && (
             <Button asChild className="mb-4">
                <Link href={mode === 'resetPassword' && error ? "/forgot-password" : "/signin"}>
                    {mode === 'resetPassword' && error ? "Try Password Reset Again" : "Go to Sign In"}
                </Link>
            </Button>
          )}
          <Link href="/" className="text-muted-foreground hover:text-primary hover:underline text-xs">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function HandleAuthActionPage() {
  // Use Suspense to handle client-side rendering of components that use useSearchParams
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <HandleAuthActionContent />
    </Suspense>
  );
}

