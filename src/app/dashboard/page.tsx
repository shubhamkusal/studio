
// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // AuthProvider already shows a global loader, but this can be a page-specific one if needed
    return null; 
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-border/50">
        <CardHeader className="text-center">
            <LayoutDashboard className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="font-headline text-3xl text-card-foreground">Welcome to Your Dashboard!</CardTitle>
          <CardDescription className="text-muted-foreground">
            This is your TRACKERLY personal space. More features coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-card-foreground">
            You are signed in as: <span className="font-semibold text-primary">{user.email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            User ID: {user.uid}
          </p>
          {/* Placeholder for future dashboard content */}
          <div className="p-6 bg-secondary/30 rounded-lg my-6">
            <p className="text-lg font-medium text-card-foreground">Your tracked time and tasks will appear here.</p>
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
