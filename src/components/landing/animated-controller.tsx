'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedController() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setPointer({ 
        x: (clientX - centerX) * 0.1, // Reduced sensitivity
        y: (clientY - centerY) * 0.1  // Reduced sensitivity
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isMounted) {
    // Render a static version or placeholder SSR to avoid hydration mismatch with mousemove
    return (
       <div className="relative group">
        <svg width="200" height="120" viewBox="0 0 200 120" aria-labelledby="controllerTitle" role="img">
          <title id="controllerTitle">Animated Game Controller</title>
          <rect x="30" y="30" width="140" height="60" rx="20" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2"/>
          <ellipse cx="40" cy="60" rx="20" ry="25" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2"/>
          <ellipse cx="160" cy="60" rx="20" ry="25" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2"/>
          <rect x="50" y="45" width="10" height="30" fill="hsl(var(--muted-foreground))" />
          <rect x="40" y="55" width="30" height="10" fill="hsl(var(--muted-foreground))" />
          <circle cx="130" cy="45" r="7" fill="hsl(var(--primary))" />
          <circle cx="150" cy="60" r="7" fill="hsl(var(--accent))" />
          <circle cx="130" cy="75" r="7" fill="hsl(var(--primary))" />
          <circle cx="110" cy="60" r="7" fill="hsl(var(--accent))" />
          <circle cx="75" cy="75" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
          <circle cx="100" cy="40" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      className="relative group"
      style={{ width: "200px", height: "120px" }} // Set explicit size for motion div
      animate={{
        rotateX: -pointer.y / 20, // Adjusted divisor for sensitivity
        rotateY: pointer.x / 20,  // Adjusted divisor for sensitivity
      }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.svg 
        width="200" 
        height="120" 
        viewBox="0 0 200 120"
        className="drop-shadow-lg"
        aria-labelledby="controllerTitle"
        role="img"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <title id="controllerTitle">Animated Game Controller</title>
        
        {/* Subtle Glow Effect for the entire controller */}
        <motion.g
          animate={{ filter: ['drop-shadow(0 0 3px hsl(var(--primary)))', 'drop-shadow(0 0 8px hsl(var(--primary)))', 'drop-shadow(0 0 3px hsl(var(--primary)))'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Main body */}
          <rect x="30" y="30" width="140" height="60" rx="20" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5"/>
          {/* Left handle */}
          <ellipse cx="40" cy="60" rx="20" ry="25" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5"/>
          {/* Right handle */}
          <ellipse cx="160" cy="60" rx="20" ry="25" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5"/>
        </motion.g>
        
        {/* D-pad */}
        <rect x="50" y="45" width="10" height="30" rx="2" fill="hsl(var(--muted-foreground))" />
        <rect x="40" y="55" width="30" height="10" rx="2" fill="hsl(var(--muted-foreground))" />
        
        {/* Buttons */}
        <motion.circle cx="130" cy="45" r="7" fill="hsl(var(--primary))" whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}/>
        <motion.circle cx="150" cy="60" r="7" fill="hsl(var(--accent))" whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }} />
        <motion.circle cx="130" cy="75" r="7" fill="hsl(var(--primary))" whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }} />
        <motion.circle cx="110" cy="60" r="7" fill="hsl(var(--accent))" whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }} />

        {/* Analog sticks */}
        <motion.g whileHover={{ scale: 1.05 }}>
          <circle cx="75" cy="75" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <circle cx="75" cy="75" r="5" fill="hsl(var(--muted-foreground) / 0.7)" />
        </motion.g>
        <motion.g whileHover={{ scale: 1.05 }}>
          <circle cx="100" cy="40" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <circle cx="100" cy="40" r="5" fill="hsl(var(--muted-foreground) / 0.7)" />
        </motion.g>
        
      </motion.svg>
    </motion.div>
  );
}
