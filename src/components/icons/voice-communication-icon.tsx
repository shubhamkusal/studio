import type { SVGProps } from 'react';

const VoiceCommunicationIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="hsl(var(--primary))" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="hsl(var(--primary))" />
    <line x1="12" y1="19" x2="12" y2="23" stroke="hsl(var(--accent))" />
    <line x1="8" y1="23" x2="16" y2="23" stroke="hsl(var(--accent))" />
  </svg>
);

export default VoiceCommunicationIcon;
