import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeName = 'dark' | 'light';

interface Theme {
  name: ThemeName;
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
}

const darkTheme: Theme = {
  name: 'dark',
  background: '#020617',
  card: '#111827',
  text: '#e5e7eb',
  muted: '#9ca3af',
  border: '#4b5563',
  accent: '#38bdf8',
};

const lightTheme: Theme = {
  name: 'light',
  background: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  border: '#d1d5db',
  accent: '#2563eb',
};

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('dark');

  const theme = themeName === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeName((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
