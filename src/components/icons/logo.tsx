
import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    width="200" 
    height="40" 
    viewBox="0 0 200 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    aria-labelledby="trackerlyLogoTitle"
    role="img"
    {...props}
  >
    <title id="trackerlyLogoTitle">TRACKERLY Logo</title>
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
    <g filter="url(#logo-glow)">
      {/* T */}
      <text
        x="10"
        y="29"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        letterSpacing="0.5"
      >
        T
      </text>
      
      {/* R with bite - text part */}
      <text
        x="32"
        y="29"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        letterSpacing="0.5"
      >
        R
      </text>
      {/* Bite effect on the R */}
      {/* The "R" character's top bowl is approximately from y=9 to y=19, centered around x=32 + half_width_of_R_bowl.
          Assuming R is ~20 units wide, its text anchor x=32. Its bowl extends to the right.
          A good position for the bite on R would be around x=46, y=14 for a font size of 28.
      */}
      <circle 
        cx="46" 
        cy="14.5" 
        r="4.5" 
        fill="hsl(var(--background))" 
      />
      {/* Clock hands inside the bite */}
      <line 
        x1="46" y1="14.5" 
        x2="46" y2="11.5" 
        stroke="hsl(var(--accent))" 
        strokeWidth="1" 
        strokeLinecap="round"
      /> 
      <line 
        x1="46" y1="14.5" 
        x2="49" y2="14.5" 
        stroke="hsl(var(--accent))" 
        strokeWidth="1" 
        strokeLinecap="round"
      />

      {/* ACKERLY */}
      <text
        x="55"
        y="29"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        letterSpacing="0.5"
      >
        ACKERLY
      </text>
    </g>
  </svg>
);

export default Logo;
