import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg width="170" height="40" viewBox="0 0 170 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
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
      <mask id="r-bite-mask">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="76" cy="15" r="3.5" fill="black" />
      </mask>
    </defs>
    <g filter="url(#logo-glow)">
      <text
        x="0"
        y="29"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        letterSpacing="0.5"
      >
        T
      </text>
      <text
        x="20"
        y="29"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        letterSpacing="0.5"
      >
        R
      </text>
       {/* "Bite" effect on R - conceptual, applied via mask in a more complex setup or direct path modification. Here, a simplified visual representation */}
      <circle cx="75.5" cy="14.5" r="1.5" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
      <line x1="75.5" y1="14.5" x2="77.5" y2="12.5" stroke="hsl(var(--primary))" strokeWidth="1"/>
      <line x1="75.5" y1="14.5" x2="77.5" y2="16.5" stroke="hsl(var(--primary))" strokeWidth="1"/>
      <text
        x="40"
        y="29"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        letterSpacing="0.5"
        mask="url(#r-bite-mask-conceptual)" 
      >
        ACKE
      </text>
       {/* Actual R with a conceptual bite using path, simplified here */}
      <path d="M68 8 H 72 V 12 C 70 12 69 11 69 10 V 8 Z M68 13 V 28 H 72 V 18 L 77 28 H 81 L 75 17 L 81 8 H 77 L 72 16 V 8 H 68 Z"
            fill="hsl(var(--foreground))"
            fontFamily="Inter, sans-serif"
            fontSize="28"
            fontWeight="bold" />

      <text
        x="82"
        y="29"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        letterSpacing="0.5"
      >
        LY
      </text>
    </g>
  </svg>
);

export default Logo;
