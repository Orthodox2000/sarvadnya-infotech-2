import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modules = [
  {
    id: "cf-agencies",
    title: "CFA Module",
    shortDescription: "Job billing and reimbursables for CFA agencies — all inside Tally.",
    fullDescription: "Clearing & forwarding means many jobs, expenses, and bills — and reimbursables get missed. This module keeps every job's expenses and income connected in Tally. Reimbursable amounts auto-fill when you bill — no digging through files. Print CFA-format invoices with QR / IRN, bill in multiple currencies, and close jobs once done. Billing and books stay in one place.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/cf-agent-module.pdf",
    image: "/assets/images/1586528116311-ad8dd3c8310d.jpg",
    features: [
      "Create jobs with all documentation details — no more scattered files",
      "Import jobs from Excel so you never retype anything",
      "Reimbursable expenses auto-filled when you bill — nothing gets missed",
      "Print CFA-format invoices with QR code & IRN",
      "Multi-currency invoices for forwarding agencies, exchange rate included",
      "Close single or multiple jobs after final billing",
      "Job-wise profitability and open/closed job reports"
    ],
    benefits: [
      "One software for billing and accounting — no double work",
      "Never miss reimbursable charges again — paid vs billed always matches",
      "See which jobs actually make money with the ready-made profitability report",
      "E-invoices generated free by Tally itself"
    ],
    pricing: [
      { label: "CFA Module", price: "Rs. 25,000/-" }
    ],
    category: "Vertical Solution"
  },
  {
    id: "housing-societies",
    title: "Housing Society Module",
    shortDescription: "Auto maintenance bills and interest for 70+ member societies.",
    fullDescription: "If your society has 70+ members, maintenance bills and interest take forever each month. Set each member's charges once, and the module generates bills and interest vouchers itself — monthly, quarterly, or your cycle. Bills print with outstanding and interest details, late-payment interest is auto-calculated, and GST is handled per the Society Act. You stop doing the math.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/society-module.pdf",
    image: "/housing society.png",
    features: [
      "Set each member's maintenance charges once — bills generate themselves",
      "Auto bill generation monthly, quarterly, or your custom cycle",
      "Interest on delayed payments calculated automatically",
      "Print bills with outstanding & interest details (with or without receipt)",
      "Share, nomination & mortgage details kept in one place",
      "Bulk email maintenance bills to all members",
      "Registers for members, share, nomination, lien & mortgage — ready when needed"
    ],
    benefits: [
      "Built for societies with 70+ members",
      "No more manual billing and interest maths every month",
      "Surrendered / transferred members stop getting billed automatically",
      "GST compliant as per the Society Act"
    ],
    pricing: [
      { label: "Housing Society Module (implementation charges extra)", price: "Rs. 18,000/-" }
    ],
    category: "Vertical Solution"
  },
  {
    id: "sales-commission",
    title: "SalesMan / Agent Module",
    shortDescription: "Broker commission and rate difference tracking in Tally.",
    fullDescription: "Selling through agents means month-end chaos — commission, rate differences, and who's been paid. This module keeps it in Tally. Set commission at item or broker level, pick the agent in any sale, and commission calculates on your rate only. Tag amounts as paid when settled, and pull broker-wise reports anytime. Your agents see exactly what they're owed.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/commission-module.pdf",
    image: "/assets/images/1554224155-6726b3ff858f.jpg",
    features: [
      "Set commission for each broker or stock item — quantity or percentage based",
      "Pick any agent in a sale or purchase; change rates right in the bill",
      "Rate difference tracked separately — invoice shows RD + your rate",
      "Commission calculated on your rate only, not on RD (excl. tax)",
      "Mark RD & commission as paid when settled",
      "Broker-wise commission, RD and receivable/payable reports"
    ],
    benefits: [
      "No more month-end commission arguments",
      "Agents always know exactly what they're owed",
      "Paid vs unpaid RD and commission stays clear",
      "Works for any industry that sells through salesmen or agents"
    ],
    pricing: [
      { label: "SalesMan / Agent Module", price: "Rs. 4,500/-" }
    ],
    category: "Business Booster"
  },
  {
    id: "logistics-transport",
    title: "Transport Module",
    shortDescription: "Create, track and bill lorry receipts from Tally.",
    fullDescription: "Transport businesses live on LRs. This module lets you create LRs with all details, see every LR on one page, and auto-create invoices from unbilled ones. Bill one LR or many in a single invoice, print with LR details, and export the annexure. Billing runs off the LR itself, so errors go down and nothing sits unbilled.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/transport-module.pdf",
    image: "/assets/images/1519003722824-194d4455a60c.jpg",
    features: [
      "Create LRs (lorry receipts) with all required details — own or hired vehicles",
      "See every LR on a single page",
      "Auto-create invoices from unbilled LRs",
      "Bill single or multiple LRs in one invoice",
      "Print invoices with LR details and export the annexure",
      "LR report shows billing status and bill number"
    ],
    benefits: [
      "Billing driven by the LR itself — fewer manual mistakes",
      "No more hunting for which LR is billed",
      "One invoice can cover many LRs",
      "Can be customized further to fit how you work"
    ],
    pricing: [
      { label: "Transport Module", price: "TBD" }
    ],
    category: "Vertical Solution"
  },
  {
    id: "container-handling",
    title: "Container Handling Module",
    shortDescription: "Log sheet billing for container handling firms.",
    fullDescription: "In container handling, log sheets pile up and billing gets messy. Create log sheets with container and vehicle details, pick the ones to bill — one party or several — and print the bill with annexure. The unbilled log sheet report shows exactly what's pending, so nothing goes unpaid.",
    videoUrl: "https://youtu.be/YqqtzzDL6o8",
    brochureUrl: "/brochures/container-handling-module.pdf",
    image: "/contaner-mgt.jpg",
    features: [
      "Create log sheets with container & vehicle details",
      "Bill selected log sheets — bulk or single, party-wise",
      "Print bills with annexure",
      "Print or export the annexure alone",
      "All log sheets report",
      "Unbilled log sheets report — see exactly what's pending billing"
    ],
    benefits: [
      "Every log sheet gets billed — nothing slips",
      "Bulk or single invoicing, whichever suits the day",
      "Annexure printing and export built in",
      "Track container handling activity from one place"
    ],
    pricing: [
      { label: "Container Handling Module (invoice format not included)", price: "Rs. 18,000/-" }
    ],
    category: "Vertical Solution"
  },
  {
    id: "garment-retail",
    title: "Garment / Footwear Sales Module",
    shortDescription: "Color and size stock tracking for garment and footwear sellers.",
    fullDescription: "In garments and footwear, one design comes in many colors and sizes — stock becomes a headache. This module creates items as you enter purchases or sales, tracks by color and size, and keeps billing fast. Invoices print with color and size columns for more items per page, and the closing stock report shows exactly what's left.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    brochureUrl: "/brochures/garment-module.pdf",
    image: "/assets/images/1523381210434-271e8be1f52b.jpg",
    features: [
      "Items created automatically during purchase & sales entry",
      "Track every item by color and size",
      "Fast billing and purchase entry, even with many variations",
      "Invoice print with color & size columns — more items per page",
      "Closing stock report by color and size"
    ],
    benefits: [
      "No more creating items by hand before you can bill",
      "Know exactly what's in stock, in which color & size",
      "Billing stays quick even with lots of variations",
      "Buy smarter — a clear picture of what actually sells"
    ],
    pricing: [
      { label: "Garment / Footwear Sales Module", price: "Rs. 15,000/-" }
    ],
    category: "Vertical Solution"
  }
  // {
  //   id: "excel-to-tally",
  //   title: "Excel to Tally Import",
  //   shortDescription: "Eliminate manual data entry. Bulk import thousands of vouchers and masters from Excel to Tally in seconds.",
  //   fullDescription: "Stop wasting hours on manual data entry. Seamlessly migrate thousands of sales invoices, purchase vouchers, bank statements, and masters from any Excel sheet straight into TallyPrime. Enjoy lightning-fast, 100% error-free data imports with our intelligent mapping utility.",
  //   videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  //   brochureUrl: "/brochures/excel-import.pdf",
  //   image: "/assets/images/excel-to-tally-new.jpg",
  //   features: [
  //     "Intelligent Custom Mapping",
  //     "Pre-Import Error Validation",
  //     "Supports All Tally Voucher Types",
  //     "Multi-Company Import Capability"
  //   ],
  //   benefits: [
  //     "Save 90% on manual entry time",
  //     "Eliminate costly human errors",
  //     "Execute rapid bulk data migration",
  //     "Enjoy a simple, intuitive interface"
  //   ],
  //   category: "Utility Module"
  // }
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('modules');

    // Clear existing
    await collection.deleteMany({});
    console.log('Cleared existing modules');

    // Insert new
    const result = await collection.insertMany(modules.map(m => ({
      ...m,
      createdAt: new Date(),
      updatedAt: new Date()
    })));

    console.log(`Successfully seeded ${result.insertedCount} modules`);
  } catch (error) {
    console.error('Error seeding modules:', error);
  } finally {
    await client.close();
  }
}

seed();
