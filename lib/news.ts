export type NewsItem = {
  id?: string;
  _id?: string;
  title: string;
  date: string;
  category: string;
  description: string;
  content: string;
  link: string;
};

export const newsItems: NewsItem[] = [
  {
    title: "New TallyPrime v7.0 Released with Advanced AI Features!",
    date: "May 12, 2026",
    category: "Product Update",
    description: "Experience the next level of accounting with AI-driven automation, faster data processing, and enhanced GST reporting.",
    content: "TallyPrime v7.0 is here, and it's a game-changer for businesses of all sizes. With integrated AI capabilities, it can now predict cash flow trends, automatically categorize expenses, and provide smarter GST compliance checks.",
    link: "/products#compare"
  },
  {
    title: "Sarvadnya Infotech LLP Awarded Top Certified Partner 2026.",
    date: "May 10, 2026",
    category: "Achievement",
    description: "We are proud to be recognized for our commitment to excellence and unmatched customer support in the Tally ecosystem.",
    content: "This award belongs to our customers who have trusted us for years. Being named the Top Certified Partner 2026 in the region motivates us to push our boundaries further.",
    link: "/about"
  },
  {
    title: "E-Invoicing Limits Reduced: Stay Compliant with TallyPrime.",
    date: "May 08, 2026",
    category: "Statutory",
    description: "New statutory regulations are in effect. Ensure your business is compliant with our seamless e-invoicing solutions.",
    content: "The government has recently lowered the threshold for mandatory e-invoicing. If your turnover exceeds the new limit, you must generate IRN for every B2B invoice.",
    link: "/contact"
  },
  {
    title: "Upcoming Webinar: Optimizing Your Supply Chain with Tally Custom Modules.",
    date: "May 05, 2026",
    category: "Event",
    description: "Join our experts this Thursday at 3 PM to learn how industry-specific modules can streamline your operations.",
    content: "Supply chain efficiency is critical in today's competitive market. In this webinar, we will demonstrate how our custom TDL modules for logistics, transport, and inventory management can provide real-time visibility and cost savings.",
    link: "/tutorials"
  },
  {
    title: "Our 'Never Deny Support' Policy is now live for all small businesses.",
    date: "May 01, 2026",
    category: "Policy",
    description: "Fast response and zero turn-away support. We ensure your Tally issues are resolved first, regardless of your contract status.",
    content: "We believe that technical glitches shouldn't stop your business growth. Our new policy ensures that any Tally user can reach out to us for emergency support.",
    link: "/contact"
  }
];
