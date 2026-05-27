export interface Module {
  _id?: string;
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  videoUrl: string;
  brochureUrl: string;
  image: string;
  features: string[];
  benefits: string[];
  category: string;
  sequence?: number;
}

export const modules: Module[] = [
  {
    id: "logistics-transport",
    title: "Logistics & Transport",
    shortDescription: "End-to-end fleet management, trip sheets, and fuel tracking integrated with Tally.",
    fullDescription: "Our Logistics & Transport module is designed for fleet owners and transport contractors. It automates trip sheet management, driver commissions, fuel expenses, and vehicle maintenance schedules directly within your TallyPrime environment.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    brochureUrl: "/brochures/transport-module.pdf", // Placeholder
    image: "/assets/images/1519003722824-194d4455a60c.jpg",
    features: [
      "Trip-wise P&L Reporting",
      "Fuel Consumption Analysis",
      "Driver Payout Management",
      "Vehicle Maintenance Alerts"
    ],
    benefits: [
      "Reduce operational leakage",
      "Real-time fleet visibility",
      "Seamless accounting integration",
      "Automated documentation"
    ],
    category: "Vertical Solution"
  },
  {
    id: "cf-agencies",
    title: "C&F Agencies",
    shortDescription: "Specialized billing and container tracking for Clearing and Forwarding agents.",
    fullDescription: "Designed for C&F agents, this module manages complex container tracking, agent commissions, and multi-layered shipping documentation. It simplifies the complex billing cycles typical in the logistics industry.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/cf-agent-module.pdf",
    image: "/assets/images/1586528116311-ad8dd3c8310d.jpg",
    features: [
      "Container Tracking System",
      "Automated Commission Billing",
      "Customized Port Documentation",
      "Client-wise Container Reports"
    ],
    benefits: [
      "Error-free billing",
      "Faster document processing",
      "Improved client transparency",
      "Better cash flow management"
    ],
    category: "Vertical Solution"
  },
  {
    id: "housing-societies",
    title: "Housing Societies",
    shortDescription: "Automated maintenance billing and receipt tracking for co-operative societies.",
    fullDescription: "A comprehensive solution for Housing Societies to automate maintenance bill generation, track receipts, calculate penalties for late payments, and generate statutory audit reports according to society norms.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/society-module.pdf",
    image: "/assets/images/1486406146926-c627a92ad1ab.jpg",
    features: [
      "Automated Maintenance Billing",
      "Late Payment Interest Calculation",
      "Society Expense Tracking",
      "Audit-Ready Financial Reports"
    ],
    benefits: [
      "Transparent society management",
      "Reduced manual accounting work",
      "Timely collection alerts",
      "Compliant with society laws"
    ],
    category: "Vertical Solution"
  },
  {
    id: "excel-to-tally",
    title: "Excel to Tally Import",
    shortDescription: "Bulk import thousands of vouchers and masters from Excel to Tally in seconds.",
    fullDescription: "Stop manual data entry. Our Excel to Tally module allows you to import thousands of sales, purchase, bank statements, and masters directly from any Excel sheet into TallyPrime without data errors.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/excel-import.pdf",
    image: "/assets/images/excel-to-tally-new.jpg",
    features: [
      "Custom Mapping Utility",
      "Error Validation Before Import",
      "Support for All Voucher Types",
      "Multi-Company Import Support"
    ],
    benefits: [
      "Save 90% manual entry time",
      "Eliminate human errors",
      "Quick bulk data migration",
      "Simple user interface"
    ],
    category: "Utility Module"
  },
  {
    id: "garment-retail",
    title: "Garment Retail/Wholesale",
    shortDescription: "Inventory tracking by size, color, and fabric type for the fashion industry.",
    fullDescription: "Manage your garment business with precision. This module adds multi-dimensional inventory tracking to Tally, allowing you to monitor stock by size, color, brand, and fabric type across multiple retail outlets.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/garment-module.pdf",
    image: "/assets/images/1523381210434-271e8be1f52b.jpg",
    features: [
      "Size & Color Matrix",
      "Barcode Integration",
      "Multi-Store Sync",
      "Season-wise Stock Analysis"
    ],
    benefits: [
      "Accurate stock visibility",
      "Faster checkout process",
      "Optimized purchasing",
      "Better trend analysis"
    ],
    category: "Vertical Solution"
  },
  {
    id: "sales-commission",
    title: "Sales & Commission",
    shortDescription: "Automate complex commission rules and payout calculations for sales teams.",
    fullDescription: "Define multi-level commission rules based on product categories, sales volume, or payment realization dates. This module automates the complex payout calculations for your entire sales force.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/commission-module.pdf",
    image: "/assets/images/1554224155-6726b3ff858f.jpg",
    features: [
      "Multi-Tier Rule Definition",
      "Target vs Achievement Reports",
      "Automated Payout Vouchers",
      "Sales Representative Dashboard"
    ],
    benefits: [
      "Transparent sales incentives",
      "Eliminate calculation disputes",
      "Motivate sales performance",
      "Automate complex payroll logic"
    ],
    category: "Business Booster"
  }
];
