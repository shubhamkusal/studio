import type { SVGProps } from 'react';

const DeepAnalyticsIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <line x1="18" y1="20" x2="18" y2="10" stroke="hsl(var(--primary))" />
    <line x1="12" y1="20" x2="12" y2="4" stroke="hsl(var(--primary))" />
    <line x1="6" y1="20" x2="6" y2="14" stroke="hsl(var(--primary))" />
    <path d="M3 3v18h18" stroke="hsl(var(--accent))" />
  </svg>
);

export default DeepAnalyticsIcon;
