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

// Updated to cycle between only two themes for now as per urgent request
const twoModeThemes: Theme[] = ['light', 'deep-dark'];

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Default to 'light' theme for the two-mode cycle
  const [theme, setThemeState] = useState<Theme>('light'); 

  useEffect(() => {
    const storedTheme = localStorage.getItem('trackerly-theme') as Theme | null;
    let activeTheme: Theme = 'light'; // Default to light for the two-mode system

    // If a theme is stored and it's one of the currently active two modes, use it
    if (storedTheme && twoModeThemes.includes(storedTheme)) {
      activeTheme = storedTheme;
    } else {
      // Otherwise, set the default ('light') and update localStorage
      localStorage.setItem('trackerly-theme', activeTheme);
    }
    
    // Apply the theme class immediately
    document.documentElement.className = `theme-${activeTheme}`;
    setThemeState(activeTheme);
  }, []); // Runs once on client mount

  const setTheme = (newTheme: Theme) => {
    // Ensure the newTheme is one of the allowed cycle themes if direct setting is used elsewhere
    if (twoModeThemes.includes(newTheme)) {
      localStorage.setItem('trackerly-theme', newTheme);
      document.documentElement.className = `theme-${newTheme}`;
      setThemeState(newTheme);
    } else {
      // Fallback to the first theme in the cycle if an invalid theme is attempted
      const fallbackTheme = twoModeThemes[0];
      localStorage.setItem('trackerly-theme', fallbackTheme);
      document.documentElement.className = `theme-${fallbackTheme}`;
      setThemeState(fallbackTheme);
    }
  };

  const toggleTheme = () => {
    const currentIndex = twoModeThemes.indexOf(theme);
    // If current theme is not in our two-mode cycle (e.g. old 'blue' from localStorage somehow slipped through initial check)
    // default to the first theme in the cycle before toggling.
    const nextIndex = (currentIndex === -1) 
                      ? 0 // default to 'light' if current is 'blue'
                      : (currentIndex + 1) % twoModeThemes.length;
    const newTheme = twoModeThemes[nextIndex];
    
    localStorage.setItem('trackerly-theme', newTheme);
    document.documentElement.className = `theme-${newTheme}`;
    setThemeState(newTheme);
  };
  
  // This useEffect ensures the class is kept in sync if the theme state
  // is changed by other means or for initial server-rendered state correction on hydration.
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
