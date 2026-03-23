"use client";

import { createContext, useContext, ReactNode } from "react";
import { getActiveTheme } from "./theme-config";
import type { Theme } from "./themes";

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = getActiveTheme();

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// Custom hook to use theme in components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
