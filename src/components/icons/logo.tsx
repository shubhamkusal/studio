import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg width="150" height="36" viewBox="0 0 150 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <text x="0" y="27" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="bold" fill="hsl(var(--foreground))">
      Trackerly<tspan fill="hsl(var(--primary))">Y</tspan>
    </text>
  </svg>
);

export default Logo;
