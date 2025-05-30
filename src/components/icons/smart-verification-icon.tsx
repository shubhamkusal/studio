import type { SVGProps } from 'react';

const SmartVerificationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="hsl(var(--primary))"/>
    <path d="M2 17l10 5 10-5" stroke="hsl(var(--accent))"/>
    <path d="M2 12l10 5 10-5" stroke="hsl(var(--accent))" opacity="0.6"/>
     <path d="M15 10.5l-2.5 2.5L15 15.5" stroke="hsl(var(--primary))" strokeWidth="2"/> {/* Puzzle piece shape */}
  </svg>
);

export default SmartVerificationIcon;
