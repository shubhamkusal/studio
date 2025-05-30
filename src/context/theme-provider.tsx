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
  const [theme, setThemeState] = useState<Theme>('blue'); // Default theme for SSR, client-side useEffect will override

  useEffect(() => {
    const storedTheme = localStorage.getItem('trackerly-theme') as Theme | null;
    let activeTheme: Theme = 'blue'; // Fallback default

    if (storedTheme && themes.includes(storedTheme)) {
      activeTheme = storedTheme;
      // If a valid theme is found in localStorage, use it.
    } else {
      // If no valid theme is in localStorage, set our default ('blue') into localStorage.
      localStorage.setItem('trackerly-theme', 'blue');
      // activeTheme is already 'blue' in this case.
    }

    setThemeState(activeTheme);
    document.documentElement.className = `theme-${activeTheme}`;
  }, []); // Runs once on client mount

  const setTheme = (newTheme: Theme) => {
    if (themes.includes(newTheme)) {
      localStorage.setItem('trackerly-theme', newTheme);
      setThemeState(newTheme);
      document.documentElement.className = `theme-${newTheme}`;
    }
  };

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };
  
  // This useEffect ensures the class is updated whenever `theme` state changes from any source.
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
