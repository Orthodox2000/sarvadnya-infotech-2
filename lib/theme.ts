export const theme = {
  primaryColor: "#7338a0",
  secondaryColor: "#4a2574",
  primaryButtonColor: "#1e3a8a", // Dark Blue
  secondaryButtonColor: "#ffffff", // White for secondary/tutorial button
  headingColor: "#0f0529",
  paragraphColor: "#4a2574",
  backgroundColor: "#fbf5ec",
  white: "#ffffff",
} as const;

export type Theme = typeof theme;
