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
  pricing?: {
    label: string;
    singleUser: string;
    multiUser: string;
  }[];
  category: string;
  sequence?: number;
}

// Excel to Tally Import — kept commented out for later
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
