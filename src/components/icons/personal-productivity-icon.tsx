import type { SVGProps } from 'react';

const PersonalProductivityIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="hsl(var(--primary))" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="hsl(var(--primary))" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="hsl(var(--primary))" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="hsl(var(--primary))" />
    <path d="m9 14 2 2 4-4" stroke="hsl(var(--accent))" />
  </svg>
);

export default PersonalProductivityIcon;
