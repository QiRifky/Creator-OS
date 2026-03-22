import React, { createContext, useMemo } from 'react';
import { Colors, type ThemeColors, type ThemeMode } from '@/constants/Colors';

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  colors: Colors.dark,
  toggle: () => {},
});

export function useTheme(): ThemeContextType {
  return React.use(ThemeContext);
}

interface ThemeProviderProps {
  mode: ThemeMode;
  onToggle: () => void;
  children: React.ReactNode;
}

export function ThemeProvider({ mode, onToggle, children }: ThemeProviderProps) {
  const value = useMemo(
    () => ({
      mode,
      colors: Colors[mode],
      toggle: onToggle,
    }),
    [mode, onToggle]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
