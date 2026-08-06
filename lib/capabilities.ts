export interface CapabilityFeature {
  title: string;
  description?: string;
  example?: string;
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
    description: "Your financial nerve center — track every rupee without breaking a sweat.",
    color: "#006569",
    bgLight: "#E5F4F4",
    features: [
      {
        title: "Flexible Chart of Accounts",
        description: "TallyPrime comes with a pre-built Chart of Accounts based on Indian accounting standards. You can create unlimited sub-ledgers under any group — assets, liabilities, income, or expenses. The structure adapts to your business, not the other way around.",
        example: "A bakery can create ledgers like 'Raw Material — Flour', 'Raw Material — Sugar' under Current Assets, and track each separately."
      },
      {
        title: "Multi-Currency Support",
        description: "Handle international trade with automatic forex gain/loss calculation. TallyPrime tracks exchange rates, converts amounts in real-time, and records unrealized/realized gains in your books.",
        example: "If you invoice a US client for [RUPEE_ICON]10,000 when USD/INR is 83.00, and receive payment at 83.50, Tally auto-records the ₹5,000 forex gain."
      },
      {
        title: "Dr/Cr Ledgers",
        description: "Every ledger account — whether it's a bank, debtor, creditor, or expense — is tracked with complete debit/credit history. Group-level tracking gives you consolidated views across related accounts.",
        example: "See total outstanding across all Sundry Debtors, or drill down to one customer's exact pending invoices."
      },
      {
        title: "Company Consolidation",
        description: "Running multiple branches or companies? Merge their financial data into one unified Balance Sheet. TallyPrime handles inter-company eliminations and group-level reporting automatically.",
        example: "A business with offices in Mumbai and Delhi can see a combined P&L while still viewing each location separately."
      },
      {
        title: "Post-Dated Vouchers",
        description: "Record future transactions now — they won't affect your books until the date arrives. Perfect for scheduled payments, rent agreements, or EMIs that auto-activate on maturity.",
        example: "Record a rent payment voucher dated next month. It sits inactive until that date, then automatically hits your books."
      },
      {
        title: "Split Financial Year",
        description: "Transition between financial years seamlessly. Your opening balances carry forward, previous year data stays accessible, and you can work in the new year without any data loss.",
        example: "On April 1st, split the year. All ledger balances auto-carry forward. Previous year reports remain just one click away."
      },
      {
        title: "Interest Calculations",
        description: "Auto-calculate interest on outstanding loan amounts, overdue bills, or fixed deposits. Set your own rate, method (simple/compound), and frequency — TallyPrime handles the math.",
        example: "Charge 18% interest on overdue invoices. Tally auto-calculates the exact amount when the customer pays late."
      },
      {
        title: "Payment Performance",
        description: "Track how quickly your customers pay. Average payment days, aging analysis, and collection efficiency reports help you identify slow payers before they become a problem.",
        example: "Run the 'Bills Receivable' report to see that Customer X pays 45 days late on average — adjust credit terms accordingly."
      }
    ]
  },
  {
    id: "inventory",
    title: "Inventory Management",
    description: "Know exactly what you have, where it is, and when to reorder.",
    color: "#2E7D5B",
    bgLight: "#EDF5F0",
    features: [
      {
        title: "Multi-Godown Tracking",
        description: "Monitor stock across unlimited warehouses and physical locations. Every stock movement — receipt, issue, or transfer — is tracked per godown with real-time balances.",
        example: "A retailer with 3 stores can see that Store A has 50 units of Product X, Store B has 30, and Store C has 10 — all in one screen."
      },
      {
        title: "Batch & Expiry Management",
        description: "Track perishable items by batch number with manufacturing and expiry dates. TallyPrime alerts you before items expire and auto-flags batches that are nearing their shelf life.",
        example: "A pharmacy can track each medicine batch — knowing that Batch A12 expires in 3 months while Batch B05 has 18 months left."
      },
      {
        title: "Multi Bill of Material",
        description: "Define multiple BOMs for the same product — for different production methods or component combinations. Track component-wise consumption during manufacturing.",
        example: "A furniture maker can define two BOMs for a table: one using Pine wood, another using Oak wood. Select the right BOM per production run."
      },
      {
        title: "Job Costing",
        description: "Track profitability per project or job. Assign direct materials, labor, and overhead costs to specific jobs. Get a clear P&L for each assignment.",
        example: "A contractor working on 3 projects can see that Project A earned ₹2 lakh profit while Project B is running at a loss."
      },
      {
        title: "Re-order Levels",
        description: "Set minimum stock thresholds for every item. When stock drops below the limit, TallyPrime generates an automatic alert — so you never run out of critical inventory.",
        example: "Set re-order level for 'Printer Paper' at 100 boxes. When stock hits 95, the system flags it for replenishment."
      },
      {
        title: "Physical Stock Verification",
        description: "Compare your system records with actual physical counts. TallyPrime auto-generates adjustment journals for any discrepancies, keeping your books accurate.",
        example: "System shows 200 units, but physical count reveals 195. Tally auto-creates a stock journal entry for the 5-unit difference."
      },
      {
        title: "Stock Valuation Methods",
        description: "Choose from FIFO (First In First Out), LIFO, Weighted Average, or Standard Cost methods. Each method impacts your profit calculation differently — pick what suits your business.",
        example: "A steel dealer using FIFO will sell the oldest stock first. If prices are rising, this shows lower profit but more realistic inventory value."
      },
      {
        title: "Alternate Units of Measure",
        description: "Manage items in multiple units with automatic conversion. Stock in Kgs, sell in Boxes — TallyPrime handles the conversion factor and maintains accuracy across both units.",
        example: "Rice purchased in Kgs (1 Bag = 25 Kg) can be sold in smaller packs. Tally auto-converts and tracks both units simultaneously."
      }
    ]
  },
  {
    id: "sales-purchase",
    title: "Sales & Purchase",
    description: "From quote to cash, every step automated. Zero manual bottlenecks.",
    color: "#006569",
    bgLight: "#F5F4ED",
    features: [
      {
        title: "GST Compliant Invoicing",
        description: "Generate Tax Invoices, Bills of Supply, and Credit/Debit Notes with built-in GST calculation. Auto-apply CGST+SGST for local or IGST for inter-state. QR codes and E-Way bills generated in one click.",
        example: "Create a sales invoice for ₹50,000 to a Karnataka customer from Maharashtra. Tally auto-applies 18% IGST (₹9,000) and generates the E-Way bill."
      },
      {
        title: "Order Processing",
        description: "Track the complete lifecycle — from Sales Order to Delivery Note to Sales Invoice. Every stage is linked, so you always know what's ordered, what's delivered, and what's pending.",
        example: "A customer orders 500 units. You deliver 300 today and 200 next week. Tally tracks the partial delivery and pending balance."
      },
      {
        title: "Price Lists & Discounts",
        description: "Create customer-specific price tiers with quantity-based discounts. Set different prices for wholesale, retail, and dealer segments — pricing is applied automatically during invoicing.",
        example: "Dealer price: ₹80/unit. Retail price: ₹100/unit. Bulk (100+): ₹75/unit. Tally applies the right price based on who's buying."
      },
      {
        title: "Credit Control",
        description: "Set credit limits per customer. When an invoice exceeds the allowed limit, TallyPrime warns you immediately — preventing bad debts before they happen.",
        example: "Customer X has a ₹2 lakh credit limit. If their outstanding is ₹1.8 lakh and they try to buy ₹50,000 more, Tally blocks the transaction."
      },
      {
        title: "Ageing Analysis",
        description: "See exactly how old your receivables and payables are. Reports are broken into time buckets (0-30, 31-60, 61-90, 90+ days) so you can prioritize collection efforts.",
        example: "Your Debtors Ageing shows ₹5 lakh in the 90+ day bucket — that's the money you need to chase first."
      },
      {
        title: "Bill-wise Settlement",
        description: "Link every payment to a specific invoice. No more guessing which bill was paid. TallyPrime maintains a clear trail from invoice to receipt to bank reconciliation.",
        example: "Customer pays ₹1 lakh against Invoice #456 and ₹50,000 against Invoice #478. Each payment is linked to its original bill."
      },
      {
        title: "Delivery Notes",
        description: "Issue delivery challans for shipped goods. Track what's been delivered vs what's still pending to be invoiced. Essential for businesses with delivery-before-billing workflows.",
        example: "Send 200 units with a delivery note today. Bill them next week. Tally tracks the un-billed delivery until you raise the invoice."
      },
      {
        title: "Multi-Billing Formats",
        description: "Choose between Professional, Classic, or Item-wise invoice layouts. Each format is customizable — add your logo, terms, bank details, or HSN summaries as needed.",
        example: "A B2B supplier uses Professional format. A retail shop uses Item-wise. Both can be printed from the same Tally company."
      }
    ]
  },
  {
    id: "banking",
    title: "Banking Operations",
    description: "Reconcile in seconds, not hours. Banking that actually works for you.",
    color: "#006569",
    bgLight: "#E5F4F4",
    features: [
      {
        title: "Auto Bank Reconciliation",
        description: "Import your bank statement (CSV, OFX, or QIF) and TallyPrime auto-matches entries by amount, date, and reference number. Manual matching is only needed for unusual cases.",
        example: "Import a 500-line bank statement. Tally auto-reconciles 480 entries in seconds. You just review the remaining 20 mismatches."
      },
      {
        title: "Cheque Management",
        description: "Track cheque books, unused cheque numbers, and print cheques directly on pre-printed leaves. Get alerts for bounced cheques and stale cheques.",
        example: "Issue Cheque #4521 to Vendor A. Tally records the number, date, amount, and payee. You can reprint if the cheque is lost."
      },
      {
        title: "E-Payments",
        description: "Initiate NEFT, RTGS, or IMPS transfers directly from TallyPrime. Generate payment files compatible with major Indian banks — no duplicate data entry.",
        example: "Select 10 vendors to pay. Tally generates a single bank file. Upload to your bank portal — all 10 payments processed at once."
      },
      {
        title: "Cash Flow Projection",
        description: "Predict your future cash position based on pending invoices, scheduled payments, and historical patterns. See a day-wise forecast of money in vs money out.",
        example: "Report shows ₹3 lakh inflow next week from outstanding invoices, but ₹4 lakh outflow for rent and salaries. You know to arrange ₹1 lakh in advance."
      },
      {
        title: "Deposit Slips",
        description: "Auto-generate bank deposit slips for cash and cheque deposits. Saves time and ensures every deposit is properly documented and matched against your books.",
        example: "Deposit 5 cheques and ₹20,000 cash. Tally generates the deposit slip with amounts, totals, and bank details — ready to print."
      },
      {
        title: "Payment Advice",
        description: "Automatically email detailed payment advice to vendors when a transaction is completed. Includes invoice references, amounts, and bank details for easy reconciliation on their end.",
        example: "After recording a payment to Supplier X, Tally emails them a payment advice with all invoice numbers and amounts covered."
      },
      {
        title: "Post-Dated Cheques",
        description: "Track PDCs received and issued with maturity date reminders. TallyPrime ensures you never miss a cheque date and maintains a complete PDC register.",
        example: "Record 5 post-dated cheques from customers. Tally reminds you 3 days before each date so you can deposit on time."
      },
      {
        title: "BRS Audit Trail",
        description: "Maintain a complete history of every reconciliation adjustment. Every manual match, every override is logged — making audits straightforward and transparent.",
        example: "Auditor asks why a ₹15,000 entry was manually matched. The BRS history shows the exact date, reason, and who made the adjustment."
      }
    ]
  },
  {
    id: "statutory",
    title: "Statutory Compliance",
    description: "Never miss a deadline. Built-in error detection keeps you safe.",
    color: "#6B8F7B",
    bgLight: "#E5F4F4",
    features: [
      {
        title: "E-Invoicing & E-Way Bill",
        description: "Generate IRN and QR codes directly from TallyPrime for B2B invoices above the threshold. E-Way bills for goods movement above ₹50,000 are generated with one click — no external portal needed.",
        example: "Save a ₹6 lakh sales invoice. Press Ctrl+I → Tally generates IRN, QR code, and E-Way bill in under 10 seconds."
      },
      {
        title: "GSTR-1 & 3B Reporting",
        description: "Auto-generate GST returns with built-in error correction (triangulation). TallyPrime cross-checks your GSTR-1 data with GSTR-3B and flags mismatches before you file.",
        example: "GSTR-1 shows ₹10 lakh outward supply. GSTR-3B auto-populates the same. If there's a mismatch, Tally highlights it for correction."
      },
      {
        title: "TDS & TCS Compliance",
        description: "Auto-deduct TDS on payments to contractors, freelancers, and rent. TCS collected on sales above threshold. Complete certificate tracking (Form 26Q, 27Q) built in.",
        example: "Pay ₹1 lakh to a contractor. Tally auto-deducts 10% TDS (₹10,000), credits ₹90,000 to the contractor, and tracks the ₹10,000 for quarterly filing."
      },
      {
        title: "Statutory Summary Reports",
        description: "Consolidated view of all tax liabilities — GST, TDS, TCS, PF, ESI — in one screen. See what you owe, what you've paid, and what's pending for any period.",
        example: "Dashboard shows: GST liability ₹2.5 lakh, TDS payable ₹80,000, PF contribution ₹1.2 lakh — all updated in real-time."
      },
      {
        title: "Audit Trail (Edit Log)",
        description: "MCA-mandated feature that tracks every modification to any transaction. Who changed what, when, and the before/after values — fully transparent and tamper-proof.",
        example: "Sales invoice was changed from ₹50,000 to ₹55,000. Audit trail shows: 'User A modified amount on [date] from ₹50,000 to ₹55,000 — reason: corrected HSN code'."
      },
      {
        title: "Scenario Management",
        description: "Run 'what-if' business scenarios without affecting your actual books. Test the impact of a price change, new tax rate, or bulk order before committing.",
        example: "What if GST increases from 18% to 20%? Run a scenario to see the impact on your pending invoices and future pricing."
      },
      {
        title: "GST Reconciliation",
        description: "Auto-match your purchase records with GSTR-2A/2B data from the GST portal. Identify missing invoices from vendors and claim maximum Input Tax Credit.",
        example: "You recorded ₹5 lakh in purchases, but GSTR-2B shows only ₹4.5 lakh. Tally identifies the ₹50,000 gap — follow up with the vendor who didn't file."
      },
      {
        title: "Exemption Management",
        description: "Handle SEZ supplies, exports, Nil-rated, and exempted transactions with correct GST tags. Ensures your returns are accurate and you don't overpay or underpay tax.",
        example: "Export invoice tagged as 'Zero Rated' — no GST charged, but ITC still available for refund. Tally handles the classification automatically."
      }
    ]
  },
  {
    id: "payroll",
    title: "Payroll Management",
    description: "Pay your team on time, every time. Statutory filings handled automatically.",
    color: "#8B6F7B",
    bgLight: "#F5F0F3",
    features: [
      {
        title: "Employee Profiles",
        description: "Create detailed employee records with categories, groups, departments, and individual profiles. Store PAN, Aadhaar, bank details, and statutory numbers — all in one place.",
        example: "Create 50 employees across 3 departments (Sales, Admin, Operations). Each profile has their bank account, PF number, and ESI number."
      },
      {
        title: "Pay Structure Design",
        description: "Define fixed components (Basic, HRA, DA) and variable components (overtime, bonus, incentives). Set formulas that auto-calculate based on days worked, production, or attendance.",
        example: "HRA = 40% of Basic. PF = 12% of Basic + DA. Professional Tax = based on salary slab. All auto-calculated per employee."
      },
      {
        title: "Attendance Tracking",
        description: "Record daily attendance (present/absent/half-day) or production-based work hours. Data feeds directly into salary processing — no manual calculation needed.",
        example: "Employee was absent 2 days in March. Salary auto-adjusts: (Basic ÷ 31) × 29 = actual pay for 29 working days."
      },
      {
        title: "Statutory PF & ESI",
        description: "Auto-calculate employer and employee shares for PF and ESI. Generate monthly return files (ECR for PF) and half-yearly reports — ready for government submission.",
        example: "For a ₹25,000 salary: PF employee share = ₹1,800, PF employer share = ₹1,800, ESI = ₹175. All auto-calculated and included in the payslip."
      },
      {
        title: "Income Tax & Form 16",
        description: "Process monthly IT projections for each employee based on their declarations. Generate Form 16 and quarterly 24Q returns — no year-end scramble.",
        example: "Employee declares ₹1.5 lakh under 80C. Tally proactively reduces monthly TDS accordingly, so they don't overpay and wait for a refund."
      },
      {
        title: "Pay Slip Distribution",
        description: "Bulk print or email password-protected payslips to all staff in one click. Each payslip shows earnings, deductions, and net pay with statutory breakdowns.",
        example: "Month-end: Click 'Email Payslips' → 50 employees receive their individual payslips in their inbox within 2 minutes."
      },
      {
        title: "Gratuity & Loan Management",
        description: "Track long-term gratuity liability and manage employee loan repayments automatically. Loan EMIs deduct from salary each month until fully repaid.",
        example: "Employee takes a ₹50,000 loan repayable in 10 months. Tally auto-deducts ₹5,000/month from their salary and tracks the remaining balance."
      },
      {
        title: "Payroll Exceptions",
        description: "Instantly flag issues — negative salary, missing attendance data, incomplete statutory details, or duplicate payments. Catch errors before they hit your employees' bank accounts.",
        example: "System flags Employee Y has negative salary due to excessive deductions. You review and correct before processing the bank transfer."
      }
    ]
  },
  {
    id: "security",
    title: "Data Security & Cloud",
    description: "Your data is yours. Encrypted, backed up, and under your control.",
    color: "#006569",
    bgLight: "#E5F4F4",
    features: [
      {
        title: "TallyVault Encryption",
        description: "Military-grade AES-256 encryption that makes your data completely unreadable without the password — even if someone copies the data files. This is the highest level of data protection available.",
        example: "If your laptop is stolen, the thief sees only encrypted gibberish. Without your TallyVault password, the data is permanently inaccessible."
      },
      {
        title: "Granular User Access Control",
        description: "Define exactly what each user can see and do — down to individual menu items, reports, and even voucher types. Restrict by amount, by ledger, or by time period.",
        example: "Junior accountant can create vouchers but cannot view the Balance Sheet. Manager can view reports but cannot delete entries. Owner has full access."
      },
      {
        title: "Password Policy Enforcement",
        description: "Set minimum length, complexity requirements, and mandatory change intervals. TallyPrime enforces these rules — no shortcuts, no exceptions.",
        example: "Policy: 8+ characters, must include number and special character, change every 90 days. Users who try weak passwords are blocked."
      },
      {
        title: "Data Synchronization",
        description: "Real-time or on-demand sync between branch offices and Head Office. Every transaction at a branch automatically updates at HO — no manual file transfers needed.",
        example: "Delhi branch records a sale at 3 PM. Head Office in Mumbai sees it by 3:01 PM. Both work on the same live data set."
      },
      {
        title: "ODBC & XML Integration",
        description: "Pull Tally data into PowerBI, Excel, or custom web dashboards via ODBC or XML interface. Build real-time reports and visualizations using live Tally data.",
        example: "Connect PowerBI to Tally via ODBC → build a live dashboard showing daily sales, outstanding receivables, and stock levels — updating every 5 minutes."
      },
      {
        title: "Auto-Backup Utility",
        description: "Incremental cloud backups that only save changed data — fast and storage-efficient. Protect against ransomware, hardware failure, and accidental deletion.",
        example: "Daily backup runs at 8 PM. Only new/changed transactions are uploaded. Full backup of a 5-year company completes in under 10 minutes."
      },
      {
        title: "Session Management",
        description: "Monitor all active users in real-time. See who's logged in, what they're doing, and force-close idle sessions for security compliance.",
        example: "Admin dashboard shows 4 active users. User Z has been idle for 30 minutes. Admin force-closes the session to free the license."
      },
      {
        title: "Data Integrity Check",
        description: "Built-in diagnostic tool that scans your data files for corruption, inconsistencies, or missing links. Identifies and auto-repairs common issues before they cause problems.",
        example: "Run 'Data Integrity' → system finds 3 broken links between ledgers and vouchers → auto-repairs them → data is clean and consistent."
      }
    ]
  }
];
