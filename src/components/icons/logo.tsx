
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
      {/* Bite effect on the R - changed to ellipse and updated clock hands */}
      <ellipse
        cx="46"
        cy="14.5"
        rx="4.5"
        ry="4.2" /* Slightly squashed ellipse */
        fill="hsl(var(--background))"
      />
      {/* Clock hands inside the bite - 10:10 position, slightly thicker */}
      {/* Hour hand (short, towards 10) */}
      <line
        x1="46" y1="14.5"
        x2="44.27" y2="13.5"  /* Approx. 10 o'clock position */
        stroke="hsl(var(--accent))"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* Minute hand (long, towards 2 (10 mins)) */}
      <line
        x1="46" y1="14.5"
        x2="47.4" y2="16.92" /* Approx. 2 o'clock position */
        stroke="hsl(var(--accent))"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* ACKERLY */}
      <text
        x="55" /* Adjusted x position to account for R */
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
