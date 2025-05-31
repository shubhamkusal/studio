// src/components/layout/footer.tsx
import Link from 'next/link';
import Logo from '@/components/icons/logo';
import { Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react'; // Added Github

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'GitHub', icon: Github, href: '#' },
];

const productLinks = [
  { name: 'Smart Clock-In', href: '/#core-features' },
  { name: 'Time Tracking', href: '/#core-features' },
  { name: 'AI Operations', href: '/#core-features' },
  { name: 'Voice Channels', href: '/#core-features' },
  { name: 'Analytics', href: '/#core-features' },
  { name: 'Pricing', href: '/#pricing' },
];

const companyLinks = [
  { name: 'About Us', href: '/#company' },
  { name: 'Careers', href: '/careers' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact Us', href: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'Cookie Policy', href: '/cookie-policy' },
];

export default function Footer() {
  return (
    <footer className="bg-background/80 text-secondary-foreground py-12 md:py-16 border-t border-border/50 mt-auto">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo className="h-10 w-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              TRACKERLY: Redefining remote work with AI-powered time and workflow management.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} className="text-muted-foreground hover:text-primary transition-colors">
                  <social.icon className="h-6 w-6" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TRACKERLY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
