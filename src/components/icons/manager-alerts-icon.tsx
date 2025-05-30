import type { SVGProps } from 'react';

const ManagerAlertsIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="hsl(var(--primary))"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="hsl(var(--accent))"/>
    <path d="M12 17v.01" stroke="hsl(var(--accent))" strokeWidth="2.5" />
  </svg>
);

export default ManagerAlertsIcon;
