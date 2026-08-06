export const productTheme = {
  primary: "#006569", // Deep Teal
  secondary: "#312e81", // Indigo
  accent: "#14b8a6", // Teal (for FREE and Support)
  textMain: "#ffffff",
  textMuted: "#94a3b8",
  cardBg: "rgba(0, 101, 105, 0.7)",
  gradientHero: "linear-gradient(135deg, #006569 0%, #312e81 100%)",
  highlightGradient: "linear-gradient(90deg, #14b8a6 0%, #2dd4bf 100%)",
} as const;

export type ProductTheme = typeof productTheme;
