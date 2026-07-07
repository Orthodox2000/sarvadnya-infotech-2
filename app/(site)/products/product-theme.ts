export const productTheme = {
  primary: "#1e1b4b", // Deep Indigo
  secondary: "#312e81", // Indigo
  accent: "#10b981", // Emerald (for FREE and Support)
  textMain: "#ffffff",
  textMuted: "#94a3b8",
  cardBg: "rgba(30, 27, 75, 0.7)",
  gradientHero: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
  highlightGradient: "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
} as const;

export type ProductTheme = typeof productTheme;
