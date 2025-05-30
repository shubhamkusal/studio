// src/context/theme-provider.tsx
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'blue' | 'deep-dark';

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Theme[] = ['light', 'blue', 'deep-dark'];

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('blue'); // Default theme for SSR

  useEffect(() => {
    const storedTheme = localStorage.getItem('trackerly-theme') as Theme | null;
    let activeTheme: Theme = 'blue'; // Fallback default

    if (storedTheme && themes.includes(storedTheme)) {
      activeTheme = storedTheme;
    } else {
      // If no valid theme is in localStorage, or theme is invalid, set our default ('blue') into localStorage.
      localStorage.setItem('trackerly-theme', 'blue');
      activeTheme = 'blue';
    }

    // Apply the theme class immediately and then set the state
    document.documentElement.className = `theme-${activeTheme}`;
    setThemeState(activeTheme);
  }, []); // Runs once on client mount

  const setTheme = (newTheme: Theme) => {
    if (themes.includes(newTheme)) {
      localStorage.setItem('trackerly-theme', newTheme);
      document.documentElement.className = `theme-${newTheme}`; // Apply class before setting state for immediate feedback
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };
  
  // This secondary useEffect ensures the class is kept in sync if the theme state
  // were to be changed by means other than the setTheme function (though unlikely in this setup).
  // It also ensures the server-rendered state (if any different) gets corrected on hydration.
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);


  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
