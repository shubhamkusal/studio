import type { SVGProps } from 'react';

const ActivityInsightsIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M3 3v18h18" stroke="hsl(var(--primary))"/>
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <circle cx="18.7" cy="8" r="1.5" fill="hsl(var(--accent))" stroke="none"/>
    <circle cx="13.6" cy="13.2" r="1.5" fill="hsl(var(--accent))" stroke="none"/>
    <circle cx="10.8" cy="10.5" r="1.5" fill="hsl(var(--accent))" stroke="none"/>
    <circle cx="7" cy="14.3" r="1.5" fill="hsl(var(--accent))" stroke="none"/>
  </svg>
);

export default ActivityInsightsIcon;
