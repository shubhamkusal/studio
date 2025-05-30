import type { SVGProps } from 'react';

const HrmsAiIcon = (props: SVGProps<SVGSVGElement>) => (
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
    {/* Brain/AI part */}
    <path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" stroke="hsl(var(--primary))"/>
    <path d="M12 20v-6" stroke="hsl(var(--primary))"/>
    <path d="M12 2a5.5 5.5 0 0 1 4.94 3.06 5.5 5.5 0 0 1 0 5.88A5.5 5.5 0 0 1 12 14a5.5 5.5 0 0 1-4.94-3.06A5.5 5.5 0 0 1 7.06 5.06 5.5 5.5 0 0 1 12 2z" stroke="hsl(var(--primary))"/>
    {/* Heartbeat/pulse part */}
    <path d="M4 14h2l2-4 2 8 2-10 2 6h2" stroke="hsl(var(--accent))"/>
    <path d="M12 14v.01" stroke="hsl(var(--accent))" strokeWidth="2.5"/>
  </svg>
);

export default HrmsAiIcon;
