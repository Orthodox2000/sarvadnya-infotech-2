export interface PaletteCombination {
  name: string;
  colors: string[];
}

export interface Palette {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  heading: string;
  paragraph: string;
  backgrounds: {
    name: string;
    value: string;
    isDark?: boolean;
  }[];
  combinations: PaletteCombination[];
}

export const palettes: Palette[] = [
  {
    id: "royal-violet",
    name: "Royal Violet",
    description: "A premium, sophisticated palette using deep purples and vibrant violets for a modern professional look.",
    primary: "#7f00ff",
    secondary: "#51158c",
    accent: "#b163ff",
    heading: "#290f4d",
    paragraph: "#51158c",
    backgrounds: [
      { name: "Snow White", value: "#ffffff" },
      { name: "Ghost White", value: "#f9fafb" },
      { name: "Soft Lavender", value: "#f5f3ff" },
      { name: "Deep Night", value: "#0f0529", isDark: true }
    ],
    combinations: [
      { name: "Brand Duo", colors: ["#7f00ff", "#51158c"] },
      { name: "Accent Mix", colors: ["#7f00ff", "#b163ff", "#ffffff"] },
      { name: "Deep Gradient", colors: ["#51158c", "#290f4d"] }
    ]
  },
  {
    id: "emerald-pro",
    name: "Teal Corporate",
    description: "Trustworthy and growth-oriented, utilizing deep teals and aqua accents for financial clarity.",
    primary: "#00897b",
    secondary: "#005a4e",
    accent: "#2dd4bf",
    heading: "#00433a",
    paragraph: "#005a4e",
    backgrounds: [
      { name: "Plain White", value: "#ffffff" },
      { name: "Mint Mist", value: "#e6f4f4" },
      { name: "Sage Light", value: "#eef3f3" },
      { name: "Forest Shade", value: "#032e2f", isDark: true }
    ],
    combinations: [
      { name: "Nature Duo", colors: ["#00897b", "#005a4e"] },
      { name: "Spring Fresh", colors: ["#00897b", "#2dd4bf", "#e6f4f4"] },
      { name: "Corporate Green", colors: ["#005a4e", "#00433a"] }
    ]
  },
  {
    id: "ocean-deep",
    name: "Ocean Deep",
    description: "A classic corporate teal palette that conveys stability, intelligence, and professional reliability.",
    primary: "#006569",
    secondary: "#006569",
    accent: "#14b8a6",
    heading: "#006569",
    paragraph: "#006569",
    backgrounds: [
      { name: "Pure White", value: "#ffffff" },
      { name: "Sky Tint", value: "#E5F4F4" },
      { name: "Slate Wash", value: "#f8fafc" },
      { name: "Midnight Navy", value: "#032e2f", isDark: true }
    ],
    combinations: [
      { name: "Tech Blue", colors: ["#006569", "#006569"] },
      { name: "Clean Cloud", colors: ["#006569", "#14b8a6", "#ffffff"] },
      { name: "Ocean Gradient", colors: ["#006569", "#006569"] }
    ]
  },
  {
    id: "sunset-modern",
    name: "Sunset Modern",
    description: "Energetic and warm, using amber and coral tones to create a welcoming and innovative atmosphere.",
    primary: "#f59e0b",
    secondary: "#92400e",
    accent: "#fbbf24",
    heading: "#78350f",
    paragraph: "#92400e",
    backgrounds: [
      { name: "Warm White", value: "#ffffff" },
      { name: "Apricot Hint", value: "#fffbeb" },
      { name: "Sand Light", value: "#fafaf9" },
      { name: "Burned Charcoal", value: "#1c1917", isDark: true }
    ],
    combinations: [
      { name: "Fire Duo", colors: ["#f59e0b", "#92400e"] },
      { name: "Glow Mix", colors: ["#f59e0b", "#fbbf24", "#fff7ed"] },
      { name: "Earth Deep", colors: ["#92400e", "#78350f"] }
    ]
  },
  {
    id: "crimson-luxe",
    name: "Crimson Luxe",
    description: "Bold and authoritative, using deep crimsons and rose tones for a high-impact luxury brand feel.",
    primary: "#e11d48",
    secondary: "#881337",
    accent: "#fb7185",
    heading: "#4c0519",
    paragraph: "#881337",
    backgrounds: [
      { name: "Ivory", value: "#ffffff" },
      { name: "Rose Petal", value: "#fff1f2" },
      { name: "Soft Grey", value: "#f9fafb" },
      { name: "Deep Maroon", value: "#2d0612", isDark: true }
    ],
    combinations: [
      { name: "Passion Duo", colors: ["#e11d48", "#881337"] },
      { name: "Blush Mix", colors: ["#e11d48", "#fb7185", "#ffffff"] },
      { name: "Dark Rose", colors: ["#881337", "#4c0519"] }
    ]
  }
];
