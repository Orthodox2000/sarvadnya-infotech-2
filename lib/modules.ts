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
    shortDescription: "Take total control of your fleet. Automate trip sheets, track fuel, and manage maintenance directly within TallyPrime.",
    fullDescription: "Stop profit leakage in its tracks. Designed specifically for fleet owners and transport contractors, this module completely automates trip sheet management, driver payouts, and fuel expenses. Get real-time visibility into vehicle maintenance and trip-wise profitability without ever leaving your Tally environment.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/transport-module.pdf",
    image: "/assets/images/1519003722824-194d4455a60c.jpg",
    features: [
      "Trip-wise P&L Reporting",
      "Fuel Consumption Analysis",
      "Driver Payout Management",
      "Vehicle Maintenance Alerts"
    ],
    benefits: [
      "Eliminate operational leakage",
      "Gain real-time fleet visibility",
      "Seamless accounting integration",
      "Automate heavy documentation"
    ],
    category: "Vertical Solution"
  },
  {
    id: "cf-agencies",
    title: "C&F Agencies",
    shortDescription: "Simplify complex logistics billing and track containers seamlessly for Clearing & Forwarding operations.",
    fullDescription: "Say goodbye to chaotic shipping documentation. Designed exclusively for C&F agents, this module streamlines multi-layered container tracking, port documentation, and agent commissions. We simplify the notorious billing cycles of the logistics industry so you can focus on moving cargo.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/cf-agent-module.pdf",
    image: "/assets/images/1586528116311-ad8dd3c8310d.jpg",
    features: [
      "Live Container Tracking System",
      "Automated Commission Billing",
      "Customized Port Documentation",
      "Client-wise Container Reports"
    ],
    benefits: [
      "Ensure 100% error-free billing",
      "Speed up document processing",
      "Improve client transparency",
      "Accelerate cash flow management"
    ],
    category: "Vertical Solution"
  },
  {
    id: "housing-societies",
    title: "Housing Societies",
    shortDescription: "Smart, automated maintenance billing and effortless accounting for co-operative housing societies.",
    fullDescription: "Eliminate the headaches of society management. This comprehensive tool automates maintenance bill generation, instant receipt tracking, and late-payment penalty calculations. Easily generate audit-ready financial reports that strictly comply with society by-laws in just a few clicks.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/society-module.pdf",
    image: "/assets/images/1486406146926-c627a92ad1ab.jpg",
    features: [
      "Automated Maintenance Billing",
      "Late Payment Penalty Calculation",
      "Detailed Society Expense Tracking",
      "Audit-Ready Financial Reports"
    ],
    benefits: [
      "Ensure transparent society management",
      "Drastically reduce manual accounting",
      "Trigger timely collection alerts",
      "Stay compliant with society laws"
    ],
    category: "Vertical Solution"
  },
  {
    id: "excel-to-tally",
    title: "Excel to Tally Import",
    shortDescription: "Eliminate manual data entry. Bulk import thousands of vouchers and masters from Excel to Tally in seconds.",
    fullDescription: "Stop wasting hours on manual data entry. Seamlessly migrate thousands of sales invoices, purchase vouchers, bank statements, and masters from any Excel sheet straight into TallyPrime. Enjoy lightning-fast, 100% error-free data imports with our intelligent mapping utility.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/excel-import.pdf",
    image: "/assets/images/excel-to-tally-new.jpg",
    features: [
      "Intelligent Custom Mapping",
      "Pre-Import Error Validation",
      "Supports All Tally Voucher Types",
      "Multi-Company Import Capability"
    ],
    benefits: [
      "Save 90% on manual entry time",
      "Eliminate costly human errors",
      "Execute rapid bulk data migration",
      "Enjoy a simple, intuitive interface"
    ],
    category: "Utility Module"
  },
  {
    id: "garment-retail",
    title: "Garment Retail/Wholesale",
    shortDescription: "Smart multi-dimensional inventory tracking by size, color, and style for fashion retailers.",
    fullDescription: "Never lose track of your inventory again. Designed for the fast-paced fashion industry, this module adds robust, multi-dimensional tracking directly to Tally. Monitor your stock levels by size, color, brand, and fabric type across multiple retail outlets to prevent dead stock and boost overall sales.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/garment-module.pdf",
    image: "/assets/images/1523381210434-271e8be1f52b.jpg",
    features: [
      "Dynamic Size & Color Matrix",
      "Seamless Barcode Integration",
      "Real-time Multi-Store Sync",
      "Season-wise Stock Analysis"
    ],
    benefits: [
      "Gain precise stock visibility",
      "Enable lightning-fast checkouts",
      "Optimize purchasing decisions",
      "Identify profitable fashion trends"
    ],
    category: "Vertical Solution"
  },
  {
    id: "sales-commission",
    title: "Sales & Commission",
    shortDescription: "Motivate your sales team with automated, error-free commission and payout calculations.",
    fullDescription: "Turn complex incentive structures into simple, automated payouts. Define custom, multi-level commission rules based on product categories, sales volumes, or actual payment realization dates. Eliminate math disputes, motivate your sales force, and save hours of administrative work.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/commission-module.pdf",
    image: "/assets/images/1554224155-6726b3ff858f.jpg",
    features: [
      "Multi-Tier Commission Rules",
      "Target vs. Achievement Tracking",
      "Automated Payout Vouchers",
      "Live Sales Rep Dashboard"
    ],
    benefits: [
      "Provide transparent sales incentives",
      "Eliminate payout calculation disputes",
      "Drive higher sales performance",
      "Automate complex payroll logic"
    ],
    category: "Business Booster"
  }
];
