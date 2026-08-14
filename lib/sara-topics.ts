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
    label: "Keyboard Shortcuts",
    answer: "Master these shortcuts and TallyPrime becomes lightning fast:\n\n- Alt+G — Go To (find any feature instantly)\n- F1 — Switch between companies\n- F2 — Change date\n- F4 — Contra voucher\n- F5 — Payment voucher\n- F6 — Receipt voucher\n- F7 — Journal voucher\n- F8 — Sales voucher\n- F9 — Purchase voucher\n- Ctrl+A — Accept/Save\n- Ctrl+F — Search\n- Alt+F1 — Detailed view\n\nPro tip: Press Alt+G and type what you need — Tally finds it for you.",
    followUp: [
      { label: "Voucher shortcuts", answer: "Every voucher type has a shortcut:\n\n- F4 — Contra (bank-to-cash transfers)\n- F5 — Payment (outgoing money)\n- F6 — Receipt (incoming money)\n- F7 — Journal (adjustments)\n- F8 — Sales (your invoices)\n- F9 — Purchase (supplier bills)\n- F10 — Reversal Journal\n- Ctrl+F5 — Credit Note\n- Ctrl+F8 — Debit Note\n\nPlus: Ctrl+K opens the calculator panel from anywhere." },
    ]
  },
  {
    label: "TSS Renewal & Subscription",
    answer: "TSS (Tally Software Service / Tally Subscription Service) is the subscription that keeps TallyPrime's connected features active — e-invoicing, e-way bills, GST filing, and auto bank reconciliation.\n\nYes, you can renew TSS directly from inside TallyPrime:\n\n1. From the Gateway of Tally, press Alt+R (Manage TSS Renewal) — this shortcut shows when a renewal is due (about 15 days before expiry).\n2. Or go to F1 (Help) > Settings > License > Manage License, then press F9 (Renew TSS).\n3. Tally opens the Tally Solutions TSS Renewal Portal in your web browser with your serial number and billing details pre-filled.\n4. Choose your duration — 1 Year, or 2 Years for a 10% discount.\n5. Complete the payment. The updated validity syncs back into Tally automatically (see the About page).\n\nTip: Renew before expiry to get one extra month of validity. A red TSS warning appears about 15 days before expiry. When TSS is red/expired, connected features stop — e-invoicing, e-way bills, GST auto-filing and GSTR-2A/2B download, bank payments and auto-BRS, and mobile/WhatsApp reports — but offline data entry keeps working.\n\nIf the option is not visible on your screen, tell us your serial number and we can renew it for you: [[Renew TSS|/services/tss]]",
    followUp: [
      { label: "What stops when TSS expires?", answer: "When TSS is red or expired, these stop working:\n\n- E-invoicing & e-way bill generation/cancellation\n- GST auto-download of GSTR-2A/2B and direct return filing\n- Banking utilities — direct payments and auto bank reconciliation\n- Remote Access & WhatsApp — mobile/browser reports and WhatsApp invoice sharing\n\nOffline data entry keeps working. Renew before expiry to get one extra month of validity. [[Renew TSS|/services/tss]]" },
      { label: "No TSS option visible?", answer: "The Alt+R (Manage TSS Renewal) shortcut on the Gateway of Tally screen only appears when a renewal is due — roughly 15 days before your subscription ends. You can also reach it via F1 (Help) > Settings > License > Manage License, then press F9 (Renew TSS). If you still don't see it, share your serial number with our team and we will renew it for you. [[Renew TSS|/services/tss]]" },
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
  const input = userInput.toLowerCase().trim();

  const contextualResponses: [RegExp, string][] = [
    [/price|cost|rate|charge|fees|kitna|how much|expensive|cheap|budget/, "Good call checking prices! Rather than dumping numbers here, our pricing pages break it all down clearly. Tap the button that fits your size — or tell me your team size and I'll point you to the perfect setup.\n\n[[Silver Pricing|/products/silver#pricing]]\n[[Gold Pricing|/products/gold#pricing]]\n[[Server Pricing|/products/server#pricing]]\n[[Get a Quote|/contact]]"],
    [/who are you|about you|what can you do|how can you help|help me|i need help/, "I'm Sara, your business advisor from Sarvadnya Infotech LLP. We make Tally work for you. Three things businesses love us for:\n\n**TallyPrime** setup & support [[Explore|/products]]\n**AMC** with 15-min response SLA [[Learn More|/services/amc]]\n**Cloud backup** so data is never lost [[TallyDrive|/products/tallydrive]]\n\nWhat's the one thing eating the most time in your business?"],
    [/\bhello\b|\bhi\b|\bhey\b|namaste|good\s*(morning|afternoon|evening)|hii+|hlo|hola/, "Hello! Welcome to Sarvadnya — we've been automating businesses since 2008. Quick one: how many people work with your accounts? I'll suggest the perfect TallyPrime setup."],
    [/\bthanks?\b|\bty\b|thank you|\bbye\b|goodbye|\bok(ay)?\b|theek|alright|\bnice\b|\bgreat\b|\bcool\b/, "You're welcome! Whenever you're ready, I'd love to show you how **TallyDrive** keeps your data safe on autopilot. [[Explore TallyDrive|/products/tallydrive]]"],
    [/mango|fruit|vegetable|perishable|expiry|food|restaurant|cafe|kirana|grocery|pharmacy|medical|jewelry|jewellery/, "Perishable stock is a headache — expiry, wastage, reordering. **TallyPrime** tracks batches, expiry dates, and reorder levels automatically. Want me to show you how it handles that?"],
    [/software|install|setup|download|update|version|license/, "We handle the full **TallyPrime** setup — installation, data migration, GST config — and our **AMC** keeps it running with a 15-min response SLA. [[AMC Support|/services/amc]]\n\nWant us to set it up for you?"],
    [/integration|sync|connect|api|crm|erp|ecommerce|shopify|amazon|flipkart/, "**TallyPrime** connects with CRMs, ERPs, and e-commerce through our **Data Integration** service. We've built custom workflows for 200+ businesses. What system are you using?"],
    [/mobile|phone|android|app|access|remote|travel|outside|on the go|away/, "**Tally on Mobile** gives you live dashboards on your phone — bank balances, daily sales, stock status — no more calling your accountant. [[See It|/services/mobile-app-biz]]\n\nWant a quick demo?"],
    [/training|learn|teach|team|staff|students?|workshop/, "**Corporate Training** is customized for your team — GST, payroll, inventory, MIS reports — with certified Tally experts. For self-paced lessons, Learn Sara teaches step by step. [[Open Learn Sara|/learn-sara]]\n\nWant to schedule a workshop?"],
    [/error|problem|issue|not working|slow|crash|bug|fix|hang|freeze/, "Let's fix that! Quick checks: 1) restart TallyPrime, 2) confirm the license is active, 3) compress data (Data > Compress). If it still acts up, our **AMC** team jumps in with a 15-min SLA. [[AMC Support|/services/amc]]"],
    [/bank|reconcil|payment|upi|neft|rtgs|cheque|transfer/, "**TallyPrime** does auto bank reconciliation, e-payments via NEFT/RTGS, and UPI — that alone saves 2-3 hours a week. Want me to show you how?"],
    [/report|analytics|data|insight|dashboard|profit|loss|sales figures|sales report/, "**TallyPrime** has 400+ reports — Balance Sheet, cash flow, stock aging — all exportable to Excel. Which report do you need the most?"],
    [/team|multi|user|concurrent|office|branch|lan|multiple people/, "**TallyPrime Gold** lets your whole team work on the same data at once, and **TallyPrime Server** handles 10+ users for bigger setups. How many people need access?"],
    [/gst|tax|return|filing|compliance|gstr|einvoice|e-invoice|eway|e-way/, "**TallyPrime** auto-calculates GST, generates e-invoices, and files GSTR-1/3B. Are you filing manually right now? I'll show you how to automate it."],
    [/backup|data loss|lost|safe|secure|cloud|restore|stolen|corrupt/, "Worrying about lost data? **TallyDrive** backs up automatically with AES-256 encryption and 1-click restore. Is your Tally data backed up right now? [[Explore TallyDrive|/products/tallydrive]]"],
    [/loan|finance|capital|money|funding|invest|credit|borrow/, "**TallyCapital** offers business loans up to 75L unsecured, plus working capital — with quick approvals for Tally users. Want to check your eligibility?"],
    [/hr|human|resource|payroll|salary|employee|staff|attendance|leave/, "**HRMS** handles the whole employee lifecycle — payroll, attendance, compliance — and connects right into **TallyPrime**. [[See HRMS|/hrms]]\n\nWant to see it in action?"],
    [/logistics|transport|delivery|fleet|vehicle|driver|truck|lorry|\blr\b/, "Our **Transport Module** automates LR (Lorry Receipt) creation and Single / Multiple LR billing inside TallyPrime — built for transport businesses running Own / Hired vehicles. [[Explore Modules|/modules]]"],
    [/container|log sheet|logsheet|harbour|port/, "Our **Container Handling Module** handles Log Sheet creation, Bulk / Single Party invoicing, and Annexure printing for the logistics industry's container handling activity. [[Explore Modules|/modules]]"],
    [/garment|retail|fashion|clothing|size|color|colour|store|footwear|shoes/, "Our **Garment / Footwear Sales Module** auto-creates items with color & size, and makes billing fast inside TallyPrime — perfect for readymade garments and footwear. [[Explore Modules|/modules]]"],
    [/society|housing|apartment|maintenance|building/, "Our **Housing Society Module** automates maintenance billing, interest calculation, and registers inside **TallyPrime** — built exactly for societies with 70+ members. [[Explore Modules|/modules]]"],
    [/cf\b|c\s*&|clearing|forwarding|job|import|reimbursable/, "Our **CFA Module** manages Jobs with documentation, multi-currency invoicing, and job-wise profitability inside TallyPrime — built for Clearing & Forwarding agencies. [[Explore Modules|/modules]]"],
    [/broker|agent|commission|rd|rate difference|salesman/, "Our **SalesMan / Agent Module** automates broker commissions and Rate Difference (RD) tracking inside TallyPrime for any industry using agents or brokers. [[Explore Modules|/modules]]"],
    [/whatsapp|message|chat|remind/, "**Tally on WhatsApp** sends invoices, payment reminders, and ledger queries automatically — your customers get answers instantly. [[Learn More|/services/tally-on-whatsapp]]\n\nWant to set it up?"],
    [/cloud|online|remote|access|anywhere|from home|work from home/, "You can run TallyPrime from anywhere on **AWS Cloud** or **Windows Cloud Desktop**. [[Cloud Options|/cloud]]\n\nWhich would suit your team best?"],
    [/demo|trial|free|try|test/, "I'd love that! Book a free demo and our team will walk you through the right setup for your business. [[Book a Demo|/demo]]"],
    [/career|job|vacancy|interview|fresher|hiring/, "We're always looking for great people at Sarvadnya — check open roles here: [[Careers|/careers]]. And for your own team, our **Corporate Training** builds Tally skills fast."],
    [/about|company|who is|team|founder|address|location|belapur|navi mumbai/, "We're Sarvadnya Infotech LLP — a Certified Tally Partner since 2008 in Belapur, trusted by 1500+ businesses. [[About Us|/about]]\n\nWhat can we do for your business today?"],
    [/\btss\b|subscription|renew(?!.*amc)|serial\s*number/, "You can renew your **TSS** (Tally Software Service) right from inside TallyPrime: from the Gateway of Tally press **Alt+R** (Manage TSS Renewal), or go to **F1 (Help) > Settings > License > Manage License**, then press **F9 (Renew TSS)**. Tally opens the renewal portal with your serial number and billing pre-filled — pick 1 Year or 2 Years (10% discount). The Alt+R shortcut shows about 15 days before expiry. Prefer we handle it? Share your serial number and we'll renew it for you. [[Renew TSS|/services/tss]]"],
    [/news|update|latest|announcement/, "We share product updates and news regularly — have a look: [[News|/news]]. Meanwhile, our **TSS Renewal** keeps your TallyPrime current with the latest statutory releases. [[Learn More|/services/tss]]"],
    [/calculator|addition|multiply|calculate|math|\d+\s*[+\-*\/]\s*\d+/, "I can't crunch numbers myself, but **TallyPrime** does all the math for you — totals, GST, payroll, and more, with zero manual calculation. [[See TallyPrime|/products]]\n\nWhat calculation are you trying to do?"],
  ];

  for (const [pattern, response] of contextualResponses) {
    if (pattern.test(input)) return response;
  }

  const genericResponses = [
    "Sounds like you run a business! **TallyPrime** can handle billing, inventory, GST, and payments all in one place. What do you deal in — products, services, or both?",
    "Got it! Every business needs clean accounting and GST compliance. **TallyPrime** automates all of it. What's the task taking most of your time right now?",
    "Interesting! Whatever your business, **TallyPrime** simplifies the books. Is it billing, inventory, or GST filing that's giving you the most trouble?",
    "I'm with you! However you work, we can make the numbers easier — **TallyPrime** for accounting, **TallyDrive** for safe backups. [[Explore All Products|/products]]\n\nWhat does your business sell?",
  ];

  const hash = input.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return genericResponses[hash % genericResponses.length];
}

export function getTeachingFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  const teachingResponses: [RegExp, string][] = [
    [/hello|hi|hey|namaste|good\s*(morning|afternoon|evening)/, "Hello! Welcome to Learn Sara. I am here to help you master TallyPrime step by step. What would you like to learn about — GST, inventory, banking, payroll, or something else?"],
    [/thank|thanks|bye|goodbye|ok|okay|theek|alright/, "You're welcome! Keep practicing and you'll master TallyPrime in no time. Feel free to come back anytime with more questions."],
    [/\btss\b|subscription|renew(?!.*amc)|serial\s*number/, "Yes, you can renew your TSS (Tally Software Service) directly from inside TallyPrime:\n\n1. From the Gateway of Tally, press **Alt+R** (Manage TSS Renewal) — this shortcut appears when a renewal is due, about 15 days before expiry.\n2. Or go to **F1 (Help) > Settings > License > Manage License**, then press **F9 (Renew TSS)**.\n3. Tally opens the Tally Solutions renewal portal in your browser with your serial number and billing details pre-filled.\n4. Pick 1 Year, or 2 Years for a 10% discount, complete the payment, and the updated validity syncs back into Tally.\n\nRenew before expiry to get one extra month of validity. When TSS is red/expired, e-invoicing, e-way bills, GST auto-filing, bank payments, and mobile/WhatsApp reports stop — but offline data entry keeps working. If the option is not visible on your screen, share your serial number and our team will renew it for you. [[Renew TSS|/services/tss]]"],
    [/price|cost|rate|charge|fees|buy|purchase|license/, "For pricing and license details, please contact our sales team directly. Here, let us focus on learning how to use TallyPrime effectively. What feature would you like to understand?"],
    [/software|install|setup|download|update|version/, "To install TallyPrime: download from tallysolutions.com, run the installer, and follow the setup wizard. During first launch, create your company with GST details. Want me to walk you through the initial configuration step by step?"],
    [/gst|tax|return|filing|compliance|gstr/, "TallyPrime handles GST end to end. To get started: go to Company Features (F11) and Enable GST. Then set your GST rate and HSN/SAC codes. Would you like to learn how to create a GST invoice, or how to file GSTR-1?"],
    [/inventory|stock|godown|warehouse|item|product/, "TallyPrime inventory management is powerful. Start by creating Stock Items under Inventory Info. You can track quantities, values, godowns, batches, and reorder levels. What type of business inventory are you managing?"],
    [/bank|reconcil|payment|upi|neft|rtgs|cheque/, "Bank reconciliation in TallyPrime is simple: go to Banking > Bank Reconciliation, import your bank statement, and Tally auto-matches entries. Want me to explain the step-by-step process?"],
    [/payroll|salary|employee|attendance|pf|esi/, "TallyPrime payroll covers everything: employee profiles, pay structures, attendance, PF/ESI calculations, and payslip generation. Enable it via F11 > Payroll Features. Would you like to learn how to set up a pay structure?"],
    [/report|balance.sheet|profit|loss|cash.flow/, "TallyPrime has 400+ built-in reports. Press Alt+F1 for detailed view, F12 to configure columns, and Ctrl+F to search. The Balance Sheet and Profit & Loss reports update in real time. Which report would you like to learn to read?"],
    [/shortcut|keyboard|key|hotkey|ctrl|alt/, "Here are the most useful shortcuts:\n\n- Alt+G — Go To (find anything)\n- F5 — Payment voucher\n- F8 — Sales voucher\n- F9 — Purchase voucher\n- Ctrl+A — Accept/Save\n- Ctrl+F — Search\n\nWant me to explain any specific shortcut in detail?"],
    [/voucher|entry|transaction|journal|contra/, "TallyPrime uses different voucher types for different transactions:\n\n- F5 — Payment (money going out)\n- F6 — Receipt (money coming in)\- F7 — Journal (adjustments)\n- F8 — Sales (your invoices)\n- F9 — Purchase (supplier bills)\n\nWhich voucher type would you like to learn to create?"],
    [/error|problem|issue|not working|slow|crash|bug|fix/, "Common TallyPrime issues and fixes:\n\n- Slow performance: Go to Data > Compress\n- Can't find feature: Press Alt+G and search\n- Data corruption: Use Help > Troubleshooting > Data Integrity\n- GST mismatch: Use the GST Reconciliation report\n\nWhat specific issue are you facing?"],
    [/backup|restore|data|safe/, "To backup in TallyPrime: go to Data > Backup, select your company, choose a destination folder, and confirm. To restore: Data > Restore, select the backup file. I recommend backing up daily. Want to learn about automatic cloud backup with TallyDrive?"],
    [/cloud|remote|access|online|anywhere/, "You can access TallyPrime remotely via AWS Cloud or Windows Cloud Desktop. This lets you work from home, office, or while traveling. Want me to explain how remote access works step by step?"],
    [/e.invoice|einvoicing|irn|qrcode/, "E-Invoicing in TallyPrime:\n\n1. Enable: F11 > GST > Enable E-Invoicing\n2. Set IRN threshold (currently Rs. 5 crore)\n3. While saving invoice, press Ctrl+I for IRN\n4. Tally auto-generates QR code and IRN\n\nWould you like to practice creating an e-invoice?"],
    [/e.way|eway|ewaybill|shipment/, "E-Way Bill generation in TallyPrime:\n\n1. Enable: F11 > GST > Enable E-Way Bill\n2. While creating an invoice for goods above Rs. 50,000\n3. Enter vehicle details and destination\n4. Tally generates the E-Way Bill JSON\n\nWant me to walk through the complete process?"],
  ];

  for (const [pattern, response] of teachingResponses) {
    if (pattern.test(input)) return response;
  }

  const genericTeachingResponses = [
    "That is an interesting question! Let me help you understand this better in the context of TallyPrime. Could you tell me more about what you are trying to accomplish? For example, are you working with invoicing, inventory, or reports?",
    "Good question! TallyPrime has a feature for that. Let me guide you through it step by step. First, can you tell me which TallyPrime product you are using — Silver (single user) or Gold (multi user)?",
    "I understand your question. Let me break this down into simple steps. In TallyPrime, most tasks start from the Gateway of Tally. What specific area are you trying to learn — accounting, inventory, or statutory compliance?",
  ];

  const hash = input.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return genericTeachingResponses[hash % genericTeachingResponses.length];
}

export const SARA_WELCOME = "Hello! I'm Sara, your Sarvadnya Infotech LLP Assistant. I can help you automate your business with Tally—feel free to ask your questions!";
