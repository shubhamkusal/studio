import type { SVGProps } from 'react';

const RoleShiftConfigIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="hsl(var(--primary))" />
    <circle cx="9" cy="7" r="4" stroke="hsl(var(--primary))" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="hsl(var(--accent))" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="hsl(var(--accent))" />
    <path d="M19.4 15l1.6 1.6-1.4 1.4-1.6-1.6" stroke="hsl(var(--accent))" /> {/* Shift arrow concept */}
    <path d="M18 18l-2-2" stroke="hsl(var(--accent))"/>
  </svg>
);

export default RoleShiftConfigIcon;
