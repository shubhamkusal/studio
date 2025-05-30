import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg width="150" height="36" viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
        <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.7" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <text
      x="0"
      y="27"
      fontFamily="Inter, sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill="hsl(var(--foreground))"
      filter="url(#logo-glow)"
    >
      TRACKERLY
    </text>
  </svg>
);

export default Logo;
