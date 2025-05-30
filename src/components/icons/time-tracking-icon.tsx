import type { SVGProps } from 'react';

const TimeTrackingIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle cx="12" cy="12" r="10" stroke="hsl(var(--primary))"/>
    <polyline points="12 6 12 12 16 14" stroke="hsl(var(--accent))"/>
  </svg>
);

export default TimeTrackingIcon;
