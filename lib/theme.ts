export const theme = {
  primaryColor: "#0f172a",
  secondaryColor: "#475569",
  primaryButtonColor: "#111827",
  secondaryButtonColor: "#e2e8f0",
  headingColor: "#0b1220",
  paragraphColor: "#334155",
  backgroundColor: "#ffffff",
} as const;

export type Theme = typeof theme;
