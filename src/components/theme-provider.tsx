
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize to a consistent default for SSR and initial client render.
  // 'light' is a safe default as the server cannot access localStorage.
  const [theme, setThemeState] = useState<Theme>('light');

  // This effect runs only on the client, after the initial render.
  // It determines the actual theme based on localStorage.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('app-theme') as Theme | null;
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setThemeState(storedTheme);
      }
      // Optional: Could add system preference check here as a fallback
      // else {
      //   const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      //   if (systemPrefersDark) {
      //     setThemeState('dark');
      //   }
      // }
    }
  }, []); // Empty dependency array ensures this runs once on mount, after initial render

  // Effect to apply the theme class to HTML and update localStorage when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      root.classList.remove('light', 'dark');
      root.classList.add(theme);

      try {
        window.localStorage.setItem('app-theme', theme);
      } catch (e) {
        console.warn('Failed to set theme in localStorage', e);
      }
    }
  }, [theme]); // Re-run when theme state changes

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
