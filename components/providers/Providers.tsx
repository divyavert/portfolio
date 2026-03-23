"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <ThemeProvider>{children}</ThemeProvider>
    </NextThemesProvider>
  );
}
