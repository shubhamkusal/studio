// src/components/theme-switcher.tsx
'use client';

import { useTheme, type Theme } from '@/context/theme-provider';
import { Button } from '@/components/ui/button';
import { Moon, Sunrise, Sunset } from 'lucide-react'; // Sunset is imported but won't be used in two-mode
import { motion, AnimatePresence } from 'framer-motion';

// Adjusted for the two-mode (Day/Night) cycle
const themeIcons: Partial<Record<Theme, JSX.Element>> = {
  light: <Sunrise className="h-5 w-5" />, // Day Mode 🌅
  'deep-dark': <Moon className="h-5 w-5" />, // Night Mode 🌙
  // 'blue' (Sunset) is intentionally omitted for the current two-mode cycle
};

const iconVariants = {
  hidden: { opacity: 0, rotate: -90, scale: 0.5 },
  visible: { opacity: 1, rotate: 0, scale: 1 },
  exit: { opacity: 0, rotate: 90, scale: 0.5 },
};

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const currentIcon = themeIcons[theme] || <Sunrise className="h-5 w-5" />; // Fallback icon

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full shadow-lg bg-card/80 backdrop-blur-sm hover:bg-card border-border/50 hover:border-primary transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-100"
      aria-label={`Switch to next theme (current: ${theme})`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme} // Key ensures animation plays on theme change
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {currentIcon}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
