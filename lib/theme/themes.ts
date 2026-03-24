export interface Theme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    tertiary?: string;
    tertiaryForeground?: string;
    accent: {
      purple: string;
      blue: string;
      pink: string;
      green: string;
      yellow: string;
    };
    muted: string;
    mutedForeground: string;
    border: string;
    destructive: string;
    success: string;
    warning: string;
    // Surface hierarchy for Digital Pulse theme
    surface?: {
      base: string;
      containerLow: string;
      container: string;
      containerHigh: string;
      bright: string;
      glass: string;
      glassOpacity: string;
    };
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
    display?: string;
    label?: string;
  };
}

export const themes: Record<string, Theme> = {
  warmDark: {
    name: "Warm Dark",
    colors: {
      background: "#0a0a0a",
      foreground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#1a1a1a",
      primary: "#e67e4d",
      primaryForeground: "#ffffff",
      secondary: "#d4ff4f",
      secondaryForeground: "#1a1a1a",
      accent: {
        purple: "#a78bfa",
        blue: "#60a5fa",
        pink: "#f472b6",
        green: "#34d399",
        yellow: "#fbbf24",
      },
      muted: "#a0a0a0",
      mutedForeground: "#666666",
      border: "#2a2a2a",
      destructive: "#ef4444",
      success: "#22c55e",
      warning: "#f59e0b",
    },
    fonts: {
      heading: "Space Grotesk",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  },

  coolDark: {
    name: "Cool Dark",
    colors: {
      background: "#0f0f1a",
      foreground: "#ffffff",
      card: "#1a1a2e",
      cardForeground: "#ffffff",
      primary: "#6366f1",
      primaryForeground: "#ffffff",
      secondary: "#22d3ee",
      secondaryForeground: "#1a1a1a",
      accent: {
        purple: "#c084fc",
        blue: "#3b82f6",
        pink: "#ec4899",
        green: "#10b981",
        yellow: "#eab308",
      },
      muted: "#94a3b8",
      mutedForeground: "#64748b",
      border: "#1e293b",
      destructive: "#dc2626",
      success: "#16a34a",
      warning: "#ea580c",
    },
    fonts: {
      heading: "Space Grotesk",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  },

  light: {
    name: "Light",
    colors: {
      background: "#fafafa",
      foreground: "#0a0a0a",
      card: "#ffffff",
      cardForeground: "#0a0a0a",
      primary: "#e67e4d",
      primaryForeground: "#ffffff",
      secondary: "#84cc16",
      secondaryForeground: "#ffffff",
      accent: {
        purple: "#9333ea",
        blue: "#2563eb",
        pink: "#db2777",
        green: "#16a34a",
        yellow: "#ca8a04",
      },
      muted: "#71717a",
      mutedForeground: "#a1a1aa",
      border: "#e4e4e7",
      destructive: "#dc2626",
      success: "#16a34a",
      warning: "#ea580c",
    },
    fonts: {
      heading: "Space Grotesk",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  },

  cyberpunk: {
    name: "Cyberpunk",
    colors: {
      background: "#000000",
      foreground: "#00ff9f",
      card: "#0a0a0f",
      cardForeground: "#00ff9f",
      primary: "#ff0080",
      primaryForeground: "#ffffff",
      secondary: "#00fff9",
      secondaryForeground: "#000000",
      accent: {
        purple: "#b026ff",
        blue: "#0080ff",
        pink: "#ff0080",
        green: "#00ff9f",
        yellow: "#ffff00",
      },
      muted: "#666666",
      mutedForeground: "#333333",
      border: "#333333",
      destructive: "#ff0040",
      success: "#00ff9f",
      warning: "#ffff00",
    },
    fonts: {
      heading: "Space Grotesk",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  },

  digitalPulse: {
    name: "Digital Pulse",
    colors: {
      background: "#0e0e11",
      foreground: "#ffffff",
      card: "#19191d",
      cardForeground: "#ffffff",
      primary: "#ff9069",
      primaryForeground: "#ffffff",
      secondary: "#00e3fd",
      secondaryForeground: "#0e0e11",
      tertiary: "#a58cff",
      tertiaryForeground: "#ffffff",
      accent: {
        purple: "#a58cff",
        blue: "#00e3fd",
        pink: "#ff9069",
        green: "#34d399",
        yellow: "#fbbf24",
      },
      muted: "#a0a0a0",
      mutedForeground: "#666666",
      border: "rgba(72, 71, 75, 0.15)",
      destructive: "#ef4444",
      success: "#22c55e",
      warning: "#f59e0b",
      surface: {
        base: "#0e0e11",
        containerLow: "#131316",
        container: "#19191d",
        containerHigh: "#1f1f23",
        bright: "#2c2c30",
        glass: "#25252a",
        glassOpacity: "0.6",
      },
    },
    fonts: {
      display: "Epilogue",
      heading: "Epilogue",
      body: "Manrope",
      label: "Space Grotesk",
      mono: "Space Grotesk",
    },
  },
};
