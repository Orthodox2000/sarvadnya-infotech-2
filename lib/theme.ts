export const theme = {
  primaryColor: "#0f172a",
  secondaryColor: "#475569",
  primaryButtonColor: "#111827",
  secondaryButtonColor: "#fff8f8",
  headingColor: "#0b1220",
  paragraphColor: "#334155",
  backgroundColor: "#ffffff",
} as const;

export type Theme = typeof theme;

// export const theme = {
//   primaryColor: "#000000",
//   secondaryColor: "#475569",
//   primaryButtonColor: "#ffffff",
//   secondaryButtonColor: "#161616",
//   headingColor: "#0b1220",
//   paragraphColor: "#334155",
//   backgroundColor: "#000000",
// } as const;
