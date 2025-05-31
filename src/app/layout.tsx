
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/theme-provider';
import { AuthProvider } from '@/context/auth-provider'; // New Import
import ThemeSwitcher from '@/components/theme-switcher';

export const metadata: Metadata = {
  title: 'TRACKERLY - Redefining Remote Work',
  description: 'TRACKERLY helps startups track time, tasks, and engagement with ease and a touch of fun.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
          </head>
          <body className="font-body antialiased bg-background text-foreground">
            {children}
            <Toaster />
            <ThemeSwitcher />
          </body>
        </html>
      </AuthProvider>
    </ThemeProvider>
  );
}
