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
        id: "tp-products",
        label: "TallyPrime Products",
        href: "/products#compare",
        description: "Core business management software.",
        subItems: [
          { id: "tp-silver", label: "TallyPrime Silver", href: "/products/silver" },
          { id: "tp-gold", label: "TallyPrime Gold", href: "/products/gold" },
          { id: "tp-server", label: "TallyPrime Server", href: "/products/server" },
        ]
      },
      {
        id: "tp-do-more",
        label: "Do More with Tally",
        href: "/do-more",
        description: "Powerful solutions built for TallyPrime.",
        subItems: [
          { id: "tp-cloud", label: "Tally Cloud Access", href: "/cloud/tallycloudaccess" },
          { id: "tallydrive", label: "TallyDrive Backup", href: "/products/tallydrive" },
          { id: "tp-backup", label: "Backup for TallyPrime", href: "/cloud/backup-for-tally" },
          { id: "tp-hrms", label: "HRMS Solution", href: "/hrms" },
          { id: "tp-capital", label: "TallyCapital", href: "/products/tallycapital" },
        ]
      },
    ],
  },
  {
    label: "Modules",
    href: "/modules",
    // CHANGE: 2026-08-21 — Split Modules dropdown into 2 groups (like Products): Business Modules + new Addons column.
    // Productbar merge logic fills group "m-group" subItems with dynamic modules from /api/modules.
    subItems: [
      {
        id: "m-group",
        label: "Business Modules",
        href: "/modules",
        description: "Industry modules for TallyPrime.",
        subItems: [
          { id: "m-cf", label: "CFA Module", href: "/modules?id=cf-agencies" },
          { id: "m-soc", label: "Housing Society Module", href: "/modules?id=housing-societies" },
          { id: "m-sales", label: "SalesMan / Agent Module", href: "/modules?id=sales-commission" },
          { id: "m-trans", label: "Transport Module", href: "/modules?id=logistics-transport" },
          { id: "m-container", label: "Container Handling Module", href: "/modules?id=container-handling" },
          { id: "m-garment", label: "Garment / Footwear Module", href: "/modules?id=garment-retail" },
          // {
          //   id: "m-excel",
          //   label: "Excel to Tally",
          //   href: "/modules?id=excel-to-tally",
          //   description: "Bulk data import tools.",
          // },
        ]
      },
      {
        id: "a-group",
        label: "Addons",
        href: "/addons",
        description: "Ready TDL add-ons for TallyPrime.",
        subItems: [
          { id: "a-email-inv", label: "Auto Email Sales Invoices", href: "/addons#auto-email-sales-invoices" },
          { id: "a-double-disc", label: "Double Discount", href: "/addons#double-discount" },
          { id: "a-maker-checker", label: "Single Level Maker & Checker", href: "/addons#single-level-maker-checker" },
          { id: "a-lock-rate", label: "Lock Sales Below Last Purchase Rate", href: "/addons#lock-sales-below-last-purchase-rate" },
          { id: "a-auto-receipt", label: "Auto Receipt in Sales", href: "/addons#auto-receipt-in-sales" },
          { id: "a-view-all", label: "View All Add-ons", href: "/addons" },
        ]
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
        description: "Stay updated with latest statutory and product releases.",
      },
      {
        id: "s-amc",
        label: "AMC",
        href: "/services/amc",
        description: "Priority troubleshooting, maintenance visits and support.",
      },
      {
        id: "s-train",
        label: "Corporate Training",
        href: "/services/corporate-training",
        description: "Hands-on Tally training sessions for your accounting staff.",
      },
      {
        id: "s-custom",
        label: "TDL Customization",
        href: "/services/tdl",
        description: "Bespoke Tally features developed to fit your workflow.",
      },
      {
        id: "s-mobile",
        label: "Tally on Mobile",
        href: "/services/mobile-app-biz",
        description: "Access real-time Tally reports from your smartphone.",
      },
      {
        id: "s-whatsapp",
        label: "Tally to WhatsApp",
        href: "/services/tally-on-whatsapp",
        description: "Send invoices and alerts directly to customers on WhatsApp.",
      },
    ],
  },
  {
    label: "Learning",
    href: "/tutorials",
    subItems: [
      {
        id: "l-sara",
        label: "Learn from Sara",
        href: "/learn-sara",
        description: "Ask questions and learn Tally interactively.",
      },
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
        description: "Industry announcements, Tally updates and statutory changes.",
      },
      {
        id: "c-about",
        label: "About Us",
        href: "/about",
        description: "Our story, mission, vision and what drives us forward.",
      },
      {
        id: "c-team",
        label: "Our Team",
        href: "/team",
        description: "Meet the Tally experts behind our solutions and support.",
      },
      {
        id: "c-contact",
        label: "Contact",
        href: "/contact",
        description: "Reach out for sales inquiries, support or partnership queries.",
      },
      {
        id: "c-careers",
        label: "Careers",
        href: "/careers",
        description: "Join our growing team and build your career with us.",
      },
      // CHANGE: 2026-08-26 — Admin Access link removed for frontend-only deployment.
      // Admin panel lives in a separate deployment. Restore from admin-panel-backup if needed.
      // {
      //   id: "c-admin",
      //   label: "Admin Access",
      //   href: "/admin",
      //   description: "Secure administrative dashboard for internal management.",
      // },
    ],
  },
];
