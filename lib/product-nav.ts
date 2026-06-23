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
          { id: "tp-silver", label: "TallyPrime Silver", href: "/products/silver" },
          { id: "tp-gold", label: "TallyPrime Gold", href: "/products/gold" },
          { id: "tp-server", label: "TallyPrime Server", href: "/products/server" },
          { id: "tallydrive", label: "TallyDrive Backup", href: "/products/tallydrive" },
        ]
      },
      {
        id: "tp-cloud",
        label: "Cloud Solutions",
        href: "/cloud",
        description: "Managed AWS & Windows infrastructure.",
        subItems: [
          { id: "c-aws", label: "AWS Cloud Server", href: "/cloud/aws" },
          { id: "c-win", label: "Windows VM", href: "/cloud/windows" },
          { id: "nosky-backup", label: "NoSky Backup", href: "/cloud/nosky" },
        ]
      },
    ],
  },
  {
    label: "Modules",
    href: "/modules",
    subItems: [
      {
        id: "m-cf",
        label: "C&F Agencies",
        href: "/modules?id=cf-agencies",
        description: "Logistics and agent management.",
      },
      {
        id: "m-soc",
        label: "Housing Societies",
        href: "/modules?id=housing-societies",
        description: "Maintenance, billing and accounting.",
      },
      {
        id: "m-trans",
        label: "Transport & Logistics",
        href: "/modules?id=logistics-transport",
        description: "Fleet management and trip sheets.",
      },
      {
        id: "m-garment",
        label: "Garment Module",
        href: "/modules?id=garment-retail",
        description: "Size, color, and fabric inventory.",
      },
      {
        id: "m-sales",
        label: "Sales & Commission",
        href: "/modules?id=sales-commission",
        description: "Track performance and commissions.",
      },
      {
        id: "m-excel",
        label: "Excel to Tally",
        href: "/modules?id=excel-to-tally",
        description: "Bulk data import tools.",
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
        href: "/services/tss",
        description: "Latest statutory & product updates.",
      },
      {
        id: "s-amc",
        label: "Annual Support",
        href: "/services/amc",
        description: "Priority troubleshooting & visits.",
      },
      {
        id: "s-train",
        label: "Corporate Training",
        href: "/services/corporate-training",
        description: "Hands-on training for your staff.",
      },
      {
        id: "s-custom",
        label: "TDL Customization",
        href: "/services/tdl",
        description: "Development of unique Tally features.",
      },
      {
        id: "s-mobile",
        label: "Tally on Mobile",
        href: "/services/mobile-app-biz",
        description: "Real-time reports on your smartphone.",
      },
      {
        id: "s-whatsapp",
        label: "Tally to WhatsApp",
        href: "/services/tally-on-whatsapp",
        description: "Send invoices directly to WhatsApp.",
      },
    ],
  },
  {
    label: "Learning",
    href: "/tutorials",
    subItems: [
      {
        id: "l-video",
        label: "Video Learning",
        href: "/tutorials",
        description: "Watch and learn with step-by-step guides.",
      },
      {
        id: "l-capabilities",
        label: "Capabilities of Tally",
        href: "/capabilities",
        description: "Explore the full power of TallyPrime.",
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
      {
        id: "c-careers",
        label: "Careers",
        href: "/careers",
        description: "Join our expert team.",
      },
      {
        id: "c-admin",
        label: "Admin Access",
        href: "/admin",
        description: "Secure administrative dashboard.",
      },
    ],
  },
];
