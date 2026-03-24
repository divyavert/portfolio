import { themes } from "./themes";

// Change this string to switch themes!
// Options: "warmDark", "coolDark", "light", "cyberpunk", "digitalPulse"
export const activeTheme = "digitalPulse";

export function getActiveTheme() {
  return themes[activeTheme];
}
