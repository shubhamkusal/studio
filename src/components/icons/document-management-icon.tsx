import type { SVGProps } from 'react';

const DocumentManagementIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="hsl(var(--primary))" />
    <polyline points="14 2 14 8 20 8" stroke="hsl(var(--primary))" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="hsl(var(--accent))" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="hsl(var(--accent))" />
    <polyline points="10 9 9 9 8 9" stroke="hsl(var(--accent))" />
  </svg>
);

export default DocumentManagementIcon;
