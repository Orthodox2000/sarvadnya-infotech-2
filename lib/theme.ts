export const theme = {
  primaryColor: "#7f00ff",
  secondaryColor: "#51158c",
  primaryButtonColor: "#7f00ff",
  secondaryButtonColor: "#ffffff",
  headingColor: "#290f4d",
  paragraphColor: "#51158c",
  backgroundColor: "#f9fafb",
  white: "#ffffff",
  accentColor: "#b163ff",
  headingLightColor: "#431f82",
} as const;

export type Theme = typeof theme;
