export interface CapabilityFeature {
  title: string;
  description?: string;
}

export interface CapabilityCategory {
  id: string;
  title: string;
  description: string;
  color: string;
  bgLight: string;
  features: CapabilityFeature[];
}

export const capabilityCategories: CapabilityCategory[] = [
  {
    id: "accounting",
    title: "Accounting Management",
    description: "Foundational financial tracking with multi-dimensional ledger management.",
    color: "#0056b3", // Classic Corporate Blue
    bgLight: "#f0f7ff",
    features: [
      { title: "Flexible Chart of Accounts", description: "Pre-defined groups with unlimited sub-ledger creation." },
      { title: "Multi-Currency Support", description: "Manage international trade with auto-calculated forex gains/losses." },
      { title: "Dr/Cr Ledgers", description: "Comprehensive management of all ledger accounts with group tracking." },
      { title: "Company Consolidation", description: "Merge data from multiple branches for a unified group balance sheet." },
      { title: "Post-Dated Vouchers", description: "Manage future transactions without affecting current books until maturity." },
      { title: "Split Financial Year", description: "Seamlessly transition between financial years while keeping data history." },
      { title: "Interest Calculations", description: "Automated calculation on outstanding balances with flexible parameters." },
      { title: "Payment Performance", description: "Track debtor behavior with average payment days and aging analysis." }
    ]
  },
  {
    id: "inventory",
    title: "Inventory Management",
    description: "Complete stock control across multi-location warehouses and production lines.",
    color: "#198754", // Classic Forest Green
    bgLight: "#f1fcf6",
    features: [
      { title: "Multi-Godown Tracking", description: "Monitor stock across multiple warehouses and physical locations." },
      { title: "Batch & Expiry Mgmt", description: "Track perishables and medicine with automated manufacturing/expiry alerts." },
      { title: "Multi Bill of Material", description: "Define multiple BOMs for manufacturing with component-wise tracking." },
      { title: "Job Costing", description: "Monitor P&L for specific projects or jobs with direct/indirect expense mapping." },
      { title: "Re-order Levels", description: "Set minimum stock thresholds with automated replenishment alerts." },
      { title: "Physical Stock Verification", description: "Match system data with physical counts using automated adjustment journals." },
      { title: "Stock Valuation", description: "Support for FIFO, LIFO, Average, and Standard cost valuation methods." },
      { title: "Alternate Units", description: "Manage items in multiple units (e.g., Kgs and Bags) with auto-conversion." }
    ]
  },
  {
    id: "sales-purchase",
    title: "Sales & Purchase",
    description: "Streamlined order-to-cash and procure-to-pay cycles with full GST compliance.",
    color: "#d48d00", // Classic Golden Amber
    bgLight: "#fffcf0",
    features: [
      { title: "GST Compliant Invoicing", description: "Generate Tax Invoices and Bills of Supply with QR codes and E-Way bills." },
      { title: "Order Processing", description: "Track Sales and Purchase orders from quote to delivery and final billing." },
      { title: "Price Lists & Discounts", description: "Manage customer-specific price tiers and quantity-based discounts." },
      { title: "Credit Control", description: "Define credit limits for customers with alerts during invoice entry." },
      { title: "Ageing Analysis", description: "Detailed reports on outstanding bills by time period for better collection." },
      { title: "Bill Settlement", description: "Link payments directly to specific invoices for precise ledger tracking." },
      { title: "Delivery Notes", description: "Issue delivery challans and track pending billings for shipped items." },
      { title: "Multi-Billing Formats", description: "Choose between Professional, Classic, or Item-wise invoice layouts." }
    ]
  },
  {
    id: "banking",
    title: "Banking Operations",
    description: "Automated banking workflows to eliminate manual reconciliation errors.",
    color: "#0a9396", // Classic Teal
    bgLight: "#f0fdfa",
    features: [
      { title: "Auto Bank Reconciliation", description: "Upload bank statements and match entries automatically in seconds." },
      { title: "Cheque Management", description: "Track cheque books and print cheques directly on pre-printed leaves." },
      { title: "E-Payments", description: "Initiate fund transfers directly to vendor accounts via integrated bank APIs." },
      { title: "Cash Flow Projection", description: "Predict future cash positions based on pending orders and outstandings." },
      { title: "Deposit Slips", description: "Generate automated bank deposit slips for cash and cheque collections." },
      { title: "Payment Advice", description: "Email detailed payment schedules to vendors upon transaction completion." },
      { title: "Post-Dated Cheques", description: "Manage and track PDCs received and issued with maturity reminders." },
      { title: "BRS History", description: "Maintain a complete audit trail of reconciliation adjustments over time." }
    ]
  },
  {
    id: "statutory",
    title: "Statutory Compliance",
    description: "Always stay ahead of statutory deadlines with built-in error detection.",
    color: "#6f42c1", // Classic Deep Purple
    bgLight: "#f8f5ff",
    features: [
      { title: "E-Invoicing & E-Way Bill", description: "One-click generation of JSON and direct upload to government portals." },
      { title: "GSTR-1 & 3B Reporting", description: "Automated returns generation with built-in error correction (Triangulation)." },
      { title: "TDS & TCS Compliance", description: "Auto-deduct tax on payments/receipts with complete certificate tracking." },
      { title: "Statutory Summary", description: "Consolidated view of tax liabilities and input credits for a period." },
      { title: "Audit Trail (Edit Log)", description: "Mandatory compliance for MCA—tracks every modification to transactions." },
      { title: "Scenario Management", description: "Forecast tax impacts by creating 'what-if' business scenarios." },
      { title: "GST Reconciliation", description: "Match GSTR-2A/2B data with your purchase records to claim full ITC." },
      { title: "Exemption Management", description: "Handle SEZ, Exports, and Nil-rated transactions with correct tax tags." }
    ]
  },
  {
    id: "payroll",
    title: "Payroll Management",
    description: "Seamless HR operations with integrated accounting and statutory filings.",
    color: "#d63384", // Classic Professional Pink
    bgLight: "#fff5f9",
    features: [
      { title: "Employee Profiles", description: "Detailed management of categories, groups, and individual profiles." },
      { title: "Pay Structure Design", description: "Define fixed and variable pay components with complex formulas." },
      { title: "Attendance Tracking", description: "Record daily attendance or production-based work for salary processing." },
      { title: "Statutory PF/ESI", description: "Automated calculation of employer/employee shares and returns generation." },
      { title: "Income Tax & 24Q", description: "Process IT projections for employees and generate Form 16 and 24Q." },
      { title: "Pay Slip Distribution", description: "Bulk print or email password-protected pay slips to all staff." },
      { title: "Gratuity & Loans", description: "Manage long-term liabilities and employee loan repayments automatically." },
      { title: "Payroll Exceptions", description: "Track negative salary, pending attendance, or missing statutory data." }
    ]
  },
  {
    id: "security",
    title: "Data Security & Cloud",
    description: "Protect your business data with enterprise-level encryption and access control.",
    color: "#343a40", // Classic Slate Grey
    bgLight: "#f8f9fa",
    features: [
      { title: "TallyVault Encryption", description: "Highest level of data encryption—unreadable even without a password." },
      { title: "User Access Control", description: "Define granular permissions for each user at the menu or report level." },
      { title: "Password Policy", description: "Enforce periodic password changes and complexity requirements." },
      { title: "Data Synchronization", description: "Real-time or on-demand data sync between branches and Head Office." },
      { title: "ODBC & XML Integration", description: "Pull Tally data into PowerBI, Excel, or custom web dashboards via XML." },
      { title: "Auto-Backup Utility", description: "Incremental cloud backups to prevent data loss from ransomware or failure." },
      { title: "Session Management", description: "Monitor active users and force-close idle sessions for security." },
      { title: "Data Integrity Check", description: "Built-in tool to identify and repair corruption or data mismatches." }
    ]
  }
];
