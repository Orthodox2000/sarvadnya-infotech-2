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
    name: "Emerald Professional",
    description: "Trustworthy and growth-oriented, utilizing forest greens and emerald accents for financial clarity.",
    primary: "#10b981",
    secondary: "#065f46",
    accent: "#34d399",
    heading: "#064e3b",
    paragraph: "#065f46",
    backgrounds: [
      { name: "Plain White", value: "#ffffff" },
      { name: "Mint Mist", value: "#f0fdf4" },
      { name: "Sage Light", value: "#f1f5f9" },
      { name: "Forest Shade", value: "#022c22", isDark: true }
    ],
    combinations: [
      { name: "Nature Duo", colors: ["#10b981", "#065f46"] },
      { name: "Spring Fresh", colors: ["#10b981", "#34d399", "#f0fdf4"] },
      { name: "Corporate Green", colors: ["#065f46", "#064e3b"] }
    ]
  },
  {
    id: "ocean-deep",
    name: "Ocean Deep",
    description: "A classic corporate blue palette that conveys stability, intelligence, and professional reliability.",
    primary: "#2563eb",
    secondary: "#1e3a8a",
    accent: "#60a5fa",
    heading: "#1e1b4b",
    paragraph: "#1e3a8a",
    backgrounds: [
      { name: "Pure White", value: "#ffffff" },
      { name: "Sky Tint", value: "#eff6ff" },
      { name: "Slate Wash", value: "#f8fafc" },
      { name: "Midnight Navy", value: "#020617", isDark: true }
    ],
    combinations: [
      { name: "Tech Blue", colors: ["#2563eb", "#1e3a8a"] },
      { name: "Clean Cloud", colors: ["#2563eb", "#60a5fa", "#ffffff"] },
      { name: "Ocean Gradient", colors: ["#1e3a8a", "#1e1b4b"] }
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
