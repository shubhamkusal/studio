'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/icons/logo';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navItems = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Company', href: '#company' },
  { label: 'Contact', href: 'mailto:support@trackerlyy.com'}
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-primary-foreground/90 transition-colors hover:text-primary-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" asChild className="text-primary-foreground/90 hover:text-primary-foreground">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button className="bg-lightBluePrimary text-white hover:bg-lightBluePrimary/90 transition-opacity rounded-full px-4 py-1">
            Try for Free
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground">
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
                <Button variant="outline" asChild className="w-full mt-4" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button className="w-full bg-lightBluePrimary text-white hover:bg-lightBluePrimary/90 transition-opacity rounded-full" onClick={() => setMobileMenuOpen(false)}>
                  Try for Free
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
