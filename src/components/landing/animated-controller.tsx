'use client';

import { useState } from 'react';

export default function AnimatedController() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg 
        width="200" 
        height="120" 
        viewBox="0 0 200 120" 
        className={`transition-transform duration-300 ease-out ${isHovered ? 'transform scale-105 group-hover:animate-subtle-vibrate' : ''}`}
        aria-labelledby="controllerTitle"
        role="img"
      >
        <title id="controllerTitle">Animated Game Controller</title>
        {/* Main body */}
        <rect x="30" y="30" width="140" height="60" rx="20" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2"/>
        {/* Left handle */}
        <ellipse cx="40" cy="60" rx="20" ry="25" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2"/>
        {/* Right handle */}
        <ellipse cx="160" cy="60" rx="20" ry="25" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2"/>
        
        {/* D-pad */}
        <rect x="50" y="45" width="10" height="30" fill="hsl(var(--muted-foreground))" />
        <rect x="40" y="55" width="30" height="10" fill="hsl(var(--muted-foreground))" />
        
        {/* Buttons */}
        <circle cx="130" cy="45" r="7" fill="hsl(var(--primary))" />
        <circle cx="150" cy="60" r="7" fill="hsl(var(--accent))" />
        <circle cx="130" cy="75" r="7" fill="hsl(var(--primary))" />
        <circle cx="110" cy="60" r="7" fill="hsl(var(--accent))" />

        {/* Analog sticks */}
        <circle cx="75" cy="75" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
        <circle cx="100" cy="40" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
        
        {/* Glow effect using filter (can be enhanced with CSS box-shadow) */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {isHovered && (
           <rect 
             x="30" y="30" width="140" height="60" rx="20" 
             fill="none" 
             stroke="hsl(var(--primary))" 
             strokeWidth="3"
             className="animate-glow"
           />
        )}
      </svg>
    </div>
  );
}
