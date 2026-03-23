import { themes } from "./themes";

// Change this string to switch themes!
// Options: "warmDark", "coolDark", "light", "cyberpunk"
export const activeTheme = "warmDark";

export function getActiveTheme() {
  return themes[activeTheme];
}
