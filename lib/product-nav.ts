export type ProductSubItem = {
  id: string;
  label: string;
  href: string;
  description?: string;
  subItems?: ProductSubItem[];
};

export type ProductItem = {
  label: string;
  href: string;
  subItems: ProductSubItem[];
};

export const productItems: ProductItem[] = [
  {
    label: "Products",
    href: "/products",
    subItems: [
      {
        id: "tp-editions",
        label: "TallyPrime Editions",
        href: "/products#compare",
        description: "Core business management software.",
        subItems: [
          { id: "tp-silver", label: "Silver (Single User)", href: "/products#compare" },
          { id: "tp-gold", label: "Gold (Multi-User)", href: "/products#compare" },
          { id: "tp-server", label: "TallyPrime Server", href: "/products#compare" },
        ]
      },
      {
        id: "tp-cloud",
        label: "Cloud Solutions",
        href: "/products#cloud",
        description: "Official Tally & AWS infrastructure.",
        subItems: [
          { id: "c-aws", label: "Tally on AWS", href: "/products#cloud" },
          { id: "nosky-backup", label: "NoSky Backup", href: "/products#cloud" },
        ]
      },
    ],
  },
  {
    label: "Modules",
    href: "/products#modules",
    subItems: [
      {
        id: "m-cf",
        label: "C&F Agencies",
        href: "/products#modules",
        description: "Logistics and agent management.",
      },
      {
        id: "m-soc",
        label: "Housing Societies",
        href: "/products#modules",
        description: "Maintenance, billing and accounting.",
      },
      {
        id: "m-trans",
        label: "Transport & Logistics",
        href: "/products#modules",
        description: "Fleet management and trip sheets.",
      },
      {
        id: "m-garment",
        label: "Garment Module",
        href: "/products#modules",
        description: "Size, color, and fabric inventory.",
      },
      {
        id: "m-sales",
        label: "Sales & Commission",
        href: "/products#modules",
        description: "Track performance and commissions.",
      },
      {
        id: "m-excel",
        label: "Excel to Tally",
        href: "/products#modules",
        description: "Bulk data import tools.",
      },
      {
        id: "m-boost",
        label: "Business Boosters",
        href: "/products#modules",
        description: "Productivity add-on modules.",
      },
    ],
  },
  {
    label: "Services",
    href: "/products",
    subItems: [
      {
        id: "s-tss",
        label: "TSS Renewal",
        href: "/products",
        description: "Latest statutory & product updates.",
      },
      {
        id: "s-amc",
        label: "Annual Support",
        href: "/products",
        description: "Priority troubleshooting & visits.",
      },
      {
        id: "s-train",
        label: "Corporate Training",
        href: "/products",
        description: "Hands-on training for your staff.",
      },
      {
        id: "s-custom",
        label: "Bespoke Customization",
        href: "/products",
        description: "Development of unique Tally features.",
      },
      {
        id: "s-mobile",
        label: "Tally on Mobile",
        href: "/products",
        description: "Real-time reports on your smartphone.",
      },
    ],
  },
  {
    label: "Learning",
    href: "/tutorials",
    subItems: [
      {
        id: "r-webinars",
        label: "Weekly Webinars",
        href: "/tutorials",
        description: "Live sessions every Thursday at 3 PM.",
      },
      {
        id: "r-tutorials",
        label: "Interactive Tutorials",
        href: "/tutorials",
        description: "Guides and videos to master Tally.",
      },
    ],
  },
  {
    label: "Company",
    href: "/",
    subItems: [
      {
        id: "c-about",
        label: "About Us",
        href: "/",
        description: "Our story, mission and vision.",
      },
      {
        id: "c-team",
        label: "Our Team",
        href: "/",
        description: "Meet our Tally experts.",
      },
      {
        id: "c-contact",
        label: "Contact",
        href: "/",
        description: "Get in touch for support or sales.",
      },
    ],
  },
];
