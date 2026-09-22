export const theme = {
  primaryColor: "#006569",
  secondaryColor: "#E5F4F4",
  primaryButtonColor: "#006569",
  secondaryButtonColor: "#ffffff",
  headingColor: "#0f172a",
  paragraphColor: "#334155",
  backgroundColor: "#ffffff",
} as const;

export type Theme = typeof theme;
