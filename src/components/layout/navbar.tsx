
// src/components/layout/navbar.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/icons/logo';
import { Menu, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const navItems = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Company', href: '#company' },
  { label: 'Contact', href: '/contact'} // Updated href
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({ title: "Sign Out Error", description: "Failed to sign out. Please try again.", variant: "destructive" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground/90 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Button variant="ghost" asChild className="text-foreground/90 hover:text-foreground">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="text-foreground/90 hover:text-foreground border-primary hover:border-primary/80">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-foreground/90 hover:text-foreground">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity rounded-full px-4 py-1">
                <Link href="/signup">Try for Free</Link>
              </Button>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-6">
              <div className="flex flex-col space-y-6">
                <Link href="/" className="mb-6" onClick={() => setMobileMenuOpen(false)}>
                  <Logo className="h-8 w-auto" />
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-lg font-medium text-foreground/90 transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Button variant="outline" asChild className="w-full mt-4" onClick={() => {setMobileMenuOpen(false); router.push('/dashboard');}}>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button onClick={handleSignOut} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                       <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full mt-4" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity rounded-full" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/signup">Try for Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
