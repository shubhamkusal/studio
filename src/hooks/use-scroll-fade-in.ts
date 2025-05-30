'use client';

import { useEffect, useRef } from 'react';

export function useScrollFadeIn() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentRef.classList.add('is-visible');
          observer.unobserve(currentRef); // Optional: stop observing after visible
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Adjust threshold as needed
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return sectionRef;
}
