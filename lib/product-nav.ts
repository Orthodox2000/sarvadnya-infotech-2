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
          { id: "tp-silver", label: "TallyPrime Silver", href: "/products#compare" },
          { id: "tp-gold", label: "TallyPrime Gold", href: "/products#compare" },
          { id: "tp-server", label: "TallyPrime Server", href: "/products#compare" },
        ]
      },
      {
        id: "tp-cloud",
        label: "Cloud Solutions",
        href: "/products#cloud",
        description: "Managed AWS & Windows infrastructure.",
        subItems: [
          { id: "c-aws", label: "AWS Cloud", href: "/products#cloud" },
          { id: "c-win", label: "Windows Cloud", href: "/products#cloud" },
          { id: "nosky-backup", label: "NoSky Backup", href: "/services#nosky-backup" },
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
    href: "/services",
    subItems: [
      {
        id: "s-tss",
        label: "TSS Renewal",
        href: "/services#amc",
        description: "Latest statutory & product updates.",
      },
      {
        id: "s-amc",
        label: "Annual Support",
        href: "/services#amc",
        description: "Priority troubleshooting & visits.",
      },
      {
        id: "s-train",
        label: "Corporate Training",
        href: "/contact",
        description: "Hands-on training for your staff.",
      },
      {
        id: "s-custom",
        label: "Bespoke Customization",
        href: "/contact",
        description: "Development of unique Tally features.",
      },
      {
        id: "s-mobile",
        label: "Tally on Mobile",
        href: "/services#biz-analyst",
        description: "Real-time reports on your smartphone.",
      },
      {
        id: "s-whatsapp",
        label: "Tally to WhatsApp",
        href: "/services#whatsapp",
        description: "Send invoices directly to WhatsApp.",
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
        id: "c-news",
        label: "Latest News",
        href: "/news",
        description: "Announcements & statutory updates.",
      },
      {
        id: "c-about",
        label: "About Us",
        href: "/about",
        description: "Our story, mission and vision.",
      },
      {
        id: "c-team",
        label: "Our Team",
        href: "/team",
        description: "Meet our Tally experts.",
      },
      {
        id: "c-contact",
        label: "Contact",
        href: "/contact",
        description: "Get in touch for support or sales.",
      },
    ],
  },
];
