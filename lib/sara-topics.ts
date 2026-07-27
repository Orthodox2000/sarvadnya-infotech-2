export type Topic = {
  label: string;
  answer: string;
  followUp?: Topic[];
};

export const saraTopics: Topic[] = [
  {
    label: "GST & Tax Filing",
    answer: "TallyPrime handles GST automatically. Here's what you need to know:\n\n- Enable GST: Go to Company Features (F11) > Enable GST\n- Auto-calculation: Tally calculates CGST, SGST, IGST on every invoice\n- E-Invoicing: Generate directly from Tally (one click)\n- GSTR-1: Gateway > Reports > Statutory Reports > GST > GSTR-1\n- GSTR-3B: Same path, select GSTR-3B\n- E-Way Bill: Generate for shipments above ₹50,000\n\nTallyPrime also auto-reconciles your GSTR-2A/2B with purchase records.",
    followUp: [
      { label: "How to file GSTR-1?", answer: "Steps to file GSTR-1:\n\n1. Gateway > Reports > Statutory Reports > GST > GSTR-1\n2. Review all outward supplies\n3. Check for errors (Tally highlights mismatches)\n4. Click 'Export' to generate JSON\n5. Upload to GST portal or use direct upload\n\nTally also auto-filters B2B, B2C, CDNR, and HSN summaries for you." },
      { label: "E-Invoicing steps", answer: "E-Invoicing in TallyPrime:\n\n1. Enable: F11 > GST > Enable E-Invoicing\n2. Set IRN threshold (currently ₹5 crore)\n3. Generate: While saving invoice, press Ctrl+I for IRN\n4. Tally auto-generates QR code and IRN\n5. Print the invoice with QR code\n\nNo external portal needed — everything happens inside Tally." },
    ]
  },
  {
    label: "Inventory Management",
    answer: "TallyPrime's inventory is more powerful than most people realize:\n\n- Stock Items: Create with units, opening balance, and godown\n- Godowns: Track stock across multiple locations (F11 > Enable Godowns)\n- Batches: For medicines, food, or perishables with expiry tracking\n- BOM: Bill of Materials for manufacturing businesses\n- Reorder Levels: Set minimum stock and get alerts\n- Valuation: FIFO, LIFO, or Average — pick your method\n\nPro tip: Use 'Stock Summary' report to see real-time inventory across all locations.",
    followUp: [
      { label: "Multi-location tracking", answer: "Multi-godown tracking:\n\n1. Enable Godowns: F11 > Inventory Features > Maintain Multiple Godowns\n2. Create Godowns: Inventory Info > Godowns > Create\n3. Transfer Stock: Use Stock Journal (Alt+F7) for inter-godown transfers\n4. Reports: Stock Summary shows per-godown quantities\n\nYou can also see godown-wise balance in any stock item report." },
      { label: "Barcode integration", answer: "Barcode support in TallyPrime:\n\n1. Enable barcodes: F11 > Inventory Features > Enable Barcodes\n2. Assign barcode to each stock item\n3. During invoicing, scan the barcode — item auto-fills\n4. Supports Code 128, EAN-13, and QR codes\n\nWorks with USB barcode scanners. Just plug and play." },
    ]
  },
  {
    label: "Banking & Reconciliation",
    answer: "TallyPrime makes banking effortless:\n\n- Auto BRS: Import bank statement (CSV/OFX) and match entries automatically\n- Cheque Printing: Design and print cheques directly\n- E-Payments: Send payments to vendors via NEFT/RTGS from Tally\n- Post-Dated Cheques: Track PDCs with maturity reminders\n- Cash Flow Reports: Predict future cash positions\n\nTo start auto-reconciliation: Go to Banking > Bank Reconciliation > select your bank > Import Statement.",
    followUp: [
      { label: "Auto bank reconciliation", answer: "Auto BRS steps:\n\n1. Go to Banking > Bank Reconciliation\n2. Select your bank ledger\n3. Click 'Import Bank Statement'\n4. Choose CSV, OFX, or QIF format\n5. Tally auto-matches entries by amount and date\n6. Review unmatched entries and manually match\n7. Accept — your BRS is done\n\nTime saved: Usually 2-3 hours of manual work becomes 5 minutes." },
    ]
  },
  {
    label: "Payroll & Employees",
    answer: "TallyPrime's built-in payroll handles everything:\n\n- Employee Profiles: Create with category, group, and statutory details\n- Pay Structure: Define basic, HRA, PF, ESI, and custom components\n- Attendance: Daily or production-based tracking\n- Auto PF/ESI: Employer and employee shares calculated automatically\n- Income Tax: Monthly projections and Form 16 generation\n- Payslips: Bulk print or email password-protected payslips\n\nEnable it: F11 > Payroll Features > Enable Payroll.",
    followUp: [
      { label: "Creating pay structure", answer: "Pay structure setup:\n\n1. Gateway > Payroll Info > Pay Heads > Create\n2. Create components:\n   - Basic (under Earnings, affects PF/ESI)\n   - HRA (under Earnings, statutory)\n   - PF Employee (under Deductions, statutory)\n   - PF Employer (under Contributions, statutory)\n3. Group components into Salary Details\n4. Assign to employees\n\nTally auto-calculates everything based on your structure." },
    ]
  },
  {
    label: "Reports & Analysis",
    answer: "TallyPrime has 400+ built-in reports:\n\n- Balance Sheet: Real-time, drill-down to any ledger\n- Profit & Loss: See your business health at a glance\n- Cash Flow: Day-wise cash position\n- Stock Analysis: Aging, movement, slow/fast moving items\n- Ratio Analysis: Key financial ratios auto-calculated\n- Excel Export: Any report can be exported to Excel\n- Multi-period: Compare reports across different periods\n\nKeyboard shortcuts: Alt+F1 for detailed view, Ctrl+F for search, F12 for configuration.",
    followUp: [
      { label: "Custom reports", answer: "Creating custom views:\n\n1. Open any standard report\n2. Press F12 (Configure)\n3. Change columns, rows, sorting, or grouping\n4. Save configuration — it becomes your custom view\n\nFor advanced needs:\n- Use Columnar reports (multiple periods side by side)\n- Use Cost Centre reports for department-wise tracking\n- Export to Excel and create your own dashboards\n\nTally also supports ODBC for real-time data in PowerBI or Excel." },
    ]
  },
  {
    label: "Keyboard Shortcuts",
    answer: "Master these shortcuts and TallyPrime becomes lightning fast:\n\n- Alt+G — Go To (find any feature instantly)\n- F1 — Switch between companies\n- F2 — Change date\n- F4 — Contra voucher\n- F5 — Payment voucher\n- F6 — Receipt voucher\n- F7 — Journal voucher\n- F8 — Sales voucher\n- F9 — Purchase voucher\n- Ctrl+A — Accept/Save\n- Ctrl+F — Search\n- Alt+F1 — Detailed view\n\nPro tip: Press Alt+G and type what you need — Tally finds it for you.",
    followUp: [
      { label: "Voucher shortcuts", answer: "Every voucher type has a shortcut:\n\n- F4 — Contra (bank-to-cash transfers)\n- F5 — Payment (outgoing money)\n- F6 — Receipt (incoming money)\n- F7 — Journal (adjustments)\n- F8 — Sales (your invoices)\n- F9 — Purchase (supplier bills)\n- F10 — Reversal Journal\n- Ctrl+F5 — Credit Note\n- Ctrl+F8 — Debit Note\n\nPlus: Ctrl+K opens the calculator panel from anywhere." },
    ]
  },
  {
    label: "Troubleshooting Tips",
    answer: "Common issues and fixes:\n\n- Data corruption: Use Data Integrity (Help > Troubleshooting > Data Integrity)\n- Slow performance: Compress data (Data > Compress)\n- Can't find a feature: Press Alt+G and search by name\n- GST mismatch: Use GST Reconciliation report\n- Bank BRS pending: Import statement via Banking menu\n- Backup lost: Check Tally.ESD/Backup folder\n- License issue: Reactivate via Help > Manage License\n\nAlways keep backups. TallyPrime does auto-backup, but manual is safer.",
    followUp: [
      { label: "Data backup & restore", answer: "Backup & Restore:\n\nBackup:\n1. Go to Data > Backup\n2. Select company\n3. Choose destination folder\n4. Press Enter to confirm\n\nRestore:\n1. Go to Data > Restore\n2. Select backup file\n3. Choose destination\n4. Confirm\n\nTip: Backup daily. Store on external drive or cloud. TallyPrime also has auto-cloud backup via TallyDrive." },
    ]
  }
];

export function matchTopic(query: string): { topic: Topic; score: number } | null {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  const scoredTopics = saraTopics.map(t => {
    const labelLower = t.label.toLowerCase();
    const answerLower = t.answer.toLowerCase();
    let score = 0;

    if (labelLower.includes(queryLower)) score += 20;

    for (const word of queryWords) {
      if (labelLower.includes(word)) score += 5;
      if (answerLower.includes(word)) score += 2;
    }

    if (t.followUp) {
      for (const fu of t.followUp) {
        const fuLower = fu.label.toLowerCase();
        for (const word of queryWords) {
          if (fuLower.includes(word)) score += 3;
        }
      }
    }

    return { topic: t, score };
  }).sort((a, b) => b.score - a.score);

  const bestMatch = scoredTopics[0];
  if (bestMatch && bestMatch.score >= 5) {
    return bestMatch;
  }
  return null;
}

export function getFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  const contextualResponses: [RegExp, string][] = [
    [/price|cost|rate|charge|fees|kitna|how much|expensive|cheap|budget/, "Great question! **TallyPrime Silver** is affordable for solo users, while **TallyPrime Gold** covers your whole team. Our team can share a quick quote — what's your business size?"],
    [/hello|hi|hey|namaste|good\s*(morning|afternoon|evening)/, "Hello! Welcome to Sarvadnya. We've been automating businesses since 2008. What kind of business do you run? I can recommend the perfect **TallyPrime** setup."],
    [/thank|thanks|bye|goodbye|ok|okay|theek|alright/, "You're welcome! 2000+ businesses trust Sarvadnya for their **TallyPrime** needs. Come back anytime you need help with GST, payroll, or business automation."],
    [/software|install|setup|download|update|version/, "We handle the full **TallyPrime** setup — installation, data migration, GST config. Plus our **AMC** gives you 15-min response SLA. Want us to set it up for you?"],
    [/integration|sync|connect|api|crm|erp|ecommerce/, "**TallyPrime** connects with CRMs, ERPs, and e-commerce via our **Data Integration** service. We've built custom workflows for 200+ businesses. What system do you use?"],
    [/mobile|phone|android|app|access|remote|travel/, "**Tally on Mobile** gives you live dashboards on your phone — bank balances, daily sales, stock status. No more calling your accountant. Want to see a demo?"],
    [/training|learn|teach|team|staff|employee/, "**Corporate Training** customized for your team — GST, payroll, inventory, MIS reports. Hands-on workshops with certified Tally experts. Want to schedule one?"],
    [/error|problem|issue|not working|slow|crash|bug|fix/, "Sorry about that! Our **AMC** includes 15-min response SLA, unlimited remote support, and quarterly health checks. Want our team to fix this for you?"],
    [/bank|reconcil|payment|upi|neft|rtgs|cheque/, "**TallyPrime** does auto bank reconciliation, e-payments via NEFT/RTGS, and UPI through **Bharat Connect**. Saves 2-3 hours weekly. Want to see how?"],
    [/report|analytics|data|insight|dashboard|profit|loss/, "**TallyPrime** has 400+ reports — Balance Sheet, Cash Flow, stock aging. Export to Excel or connect Power BI via ODBC. Which reports do you need?"],
    [/team|multi|user|concurrent|office|branch|lan/, "**TallyPrime Gold** lets your whole team work simultaneously on the same data. For larger setups, **TallyPrime Server** handles 10+ users. How many people need access?"],
    [/gst|tax|return|filing|compliance|gstr/, "**TallyPrime** auto-calculates GST, generates e-invoices, files GSTR-1/3B, and reconciles GSTR-2A/2B. Are you filing manually or using software currently?"],
    [/backup|data|safe|secure|cloud|restore/, "**TallyDrive** gives you automated cloud backup with AES-256 encryption and 1-click restore. Is your Tally data backed up right now?"],
    [/loan|finance|capital|money|funding|invest/, "**TallyCapital** offers business loans up to 75L unsecured, LAP up to 15Cr, and working capital facilities. Quick approvals for Tally users. Want to check eligibility?"],
    [/hr|human|resource|payroll|employee|staff|attendance/, "**HRMS** handles your complete employee lifecycle — payroll, attendance, compliance, expense tracking. Integrates directly with **TallyPrime**. Want to see it in action?"],
    [/logistics|transport|delivery|fleet|vehicle/, "Our **Logistics & Transport Module** plugs into TallyPrime for trip-wise P&L, fuel analysis, driver payouts, and vehicle maintenance alerts. Built for your industry."],
    [/garment|retail|fashion|clothing|size|color/, "Our **Garment Retail Module** handles size/color matrix, barcode, multi-store sync, and season-wise analysis — all inside **TallyPrime**. Perfect for fashion businesses."],
    [/society|housing|apartment|maintenance/, "Our **Housing Society Module** handles maintenance billing, penalty calculation, and audit-ready reports inside **TallyPrime**. Built specifically for housing societies."],
    [/whatsapp|message|chat|remind/, "**Tally on WhatsApp** sends invoices, payment reminders, and ledger queries automatically via WhatsApp. Your customers get info instantly. Want to set it up?"],
    [/cloud|online|remote|access|anywhere/, "**AWS Cloud** and **Windows Cloud Desktop** let you access TallyPrime from anywhere. **TallyCloudAccess** manages it all. Which works best for your team?"],
  ];

  for (const [pattern, response] of contextualResponses) {
    if (pattern.test(input)) return response;
  }

  const genericResponses = [
    "Sounds like you're running a business! **TallyPrime** can handle your billing, inventory, GST, and payments in one place. What does your business deal with — products, services, or both?",
    "Interesting! Whatever your business, **TallyPrime** can automate your accounting and compliance. Are you looking to simplify billing, manage inventory, or handle GST filing?",
    "Got it! Every business needs proper accounting and GST compliance. **TallyPrime** handles it all — billing, inventory, payroll, banking. What's the one thing that takes most of your time right now?",
  ];

  const hash = input.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return genericResponses[hash % genericResponses.length];
}

export const SARA_WELCOME = "Hello! I'm Sara, your Sarvadnya Infotech LLP Assistant. I can help you automate your business with Tally—feel free to ask your questions!";
