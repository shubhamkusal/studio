import type { SVGProps } from 'react';

const MultiDepartmentIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle cx="9" cy="9" r="3" stroke="hsl(var(--primary))" />
    <path d="M9 12v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7" stroke="hsl(var(--primary))" />
    <circle cx="15" cy="9" r="3" stroke="hsl(var(--accent))" />
    <path d="M15 12v7a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-7" stroke="hsl(var(--accent))" />
    <path d="M12 9h.01" stroke="hsl(var(--primary))" />
    <path d="M6 15H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" stroke="hsl(var(--primary))" />
    <path d="M18 15h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" stroke="hsl(var(--accent))" />
  </svg>
);

export default MultiDepartmentIcon;
