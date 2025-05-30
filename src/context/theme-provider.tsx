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
  const [theme, setThemeState] = useState<Theme>('blue'); // Default theme

  useEffect(() => {
    const storedTheme = localStorage.getItem('trackerly-theme') as Theme | null;
    if (storedTheme && themes.includes(storedTheme)) {
      setThemeState(storedTheme);
      document.documentElement.className = storedTheme;
    } else {
      // Set default theme if nothing in localStorage or invalid
      localStorage.setItem('trackerly-theme', 'blue');
      document.documentElement.className = 'theme-blue'; // Explicitly set default class name
    }
  }, []);

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
  
  // Fallback to ensure html class is set if it somehow gets removed
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
