"use client";

import { useState, useEffect } from "react";
import { themes } from "@/lib/theme/themes";

export function ThemeToggler() {
  const [currentTheme, setCurrentTheme] = useState("digitalPulse");
  const [isOpen, setIsOpen] = useState(false);

  const themeNames = Object.keys(themes);

  useEffect(() => {
    // Get the stored theme from localStorage
    const storedTheme = localStorage.getItem("theme") || "digitalPulse";
    setCurrentTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const applyTheme = (themeName: string) => {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    const colors = theme.colors;

    // Convert hex to HSL
    const hexToHSL = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return "0 0 0";
      
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)} ${Math.round(l * 100)}`;
    };

    // Apply colors
    root.style.setProperty("--background", hexToHSL(colors.background));
    root.style.setProperty("--foreground", hexToHSL(colors.foreground));
    root.style.setProperty("--card", hexToHSL(colors.card));
    root.style.setProperty("--card-foreground", hexToHSL(colors.cardForeground));
    root.style.setProperty("--primary", hexToHSL(colors.primary));
    root.style.setProperty("--primary-foreground", hexToHSL(colors.primaryForeground));
    root.style.setProperty("--secondary", hexToHSL(colors.secondary));
    root.style.setProperty("--secondary-foreground", hexToHSL(colors.secondaryForeground));
    
    if (colors.tertiary) {
      root.style.setProperty("--tertiary", hexToHSL(colors.tertiary));
      root.style.setProperty("--tertiary-foreground", hexToHSL(colors.tertiaryForeground || "#ffffff"));
    }

    root.style.setProperty("--accent-purple", hexToHSL(colors.accent.purple));
    root.style.setProperty("--accent-blue", hexToHSL(colors.accent.blue));
    root.style.setProperty("--accent-pink", hexToHSL(colors.accent.pink));
    root.style.setProperty("--accent-green", hexToHSL(colors.accent.green));
    root.style.setProperty("--accent-yellow", hexToHSL(colors.accent.yellow));
    root.style.setProperty("--muted", hexToHSL(colors.muted));
    root.style.setProperty("--muted-foreground", hexToHSL(colors.mutedForeground));
    
    // Handle border (might be rgba)
    if (colors.border.startsWith("rgba")) {
      root.style.setProperty("--border", "240 2 47");
    } else {
      root.style.setProperty("--border", hexToHSL(colors.border));
    }
    
    root.style.setProperty("--destructive", hexToHSL(colors.destructive));
    root.style.setProperty("--success", hexToHSL(colors.success));
    root.style.setProperty("--warning", hexToHSL(colors.warning));

    // Apply surface hierarchy if available
    if (colors.surface) {
      root.style.setProperty("--surface-base", hexToHSL(colors.surface.base));
      root.style.setProperty("--surface-container-low", hexToHSL(colors.surface.containerLow));
      root.style.setProperty("--surface-container", hexToHSL(colors.surface.container));
      root.style.setProperty("--surface-container-high", hexToHSL(colors.surface.containerHigh));
      root.style.setProperty("--surface-bright", hexToHSL(colors.surface.bright));
      root.style.setProperty("--surface-glass", hexToHSL(colors.surface.glass));
    }
  };

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem("theme", themeName);
    applyTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
        aria-label="Toggle theme menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="text-sm font-label uppercase tracking-wider">
          {themes[currentTheme]?.name || "Theme"}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-glass/60 backdrop-blur-glass border border-border shadow-lg z-50 overflow-hidden">
            <div className="p-2 space-y-1">
              {themeNames.map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => handleThemeChange(themeName)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentTheme === themeName
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-surface-container-high"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body font-medium">
                      {themes[themeName].name}
                    </span>
                    {currentTheme === themeName && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: themes[themeName].colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: themes[themeName].colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: themes[themeName].colors.background }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
