"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = window.localStorage.getItem('app-theme') as Theme | null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Optional: Check system preference as a fallback if no theme is stored
    // const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // if (systemPrefersDark) {
    //   return 'dark';
    // }
  }
  return 'light'; // Default to light if no preference found or SSR
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Effect to apply the theme class to HTML and update localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Clean up previous theme class
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);

    // Persist theme to localStorage
    try {
      window.localStorage.setItem('app-theme', theme);
    } catch (e) {
      // Handle localStorage error (e.g., private browsing mode)
      console.warn('Failed to set theme in localStorage', e);
    }
  }, [theme]);

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
