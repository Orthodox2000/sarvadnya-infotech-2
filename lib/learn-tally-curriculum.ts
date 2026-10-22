// CHANGE: 2026-10-19 — Tally Insights curriculum (product-focused, B2B)
// ASCII-only. Keep product-first: modulePromo/moduleWarnings/addonWarnings must point to our own software.

export type VersionNote = {
  from?: string;
  to?: string;
  what: string;
  impact: string;
  warnings?: string[];
};

export type ModuleWarning = {
  title: string;
  text: string;
  moduleSlug?: string;
  moduleUrl?: string;
};

export type AddonWarning = {
  title: string;
  text: string;
  addonSlug?: string;
  addonUrl?: string;
};

export type LeadMagnet = {
  id: string;
  title: string;
  description: string;
  type: 'checklist' | 'pdf' | 'template';
  downloadPath: string;
  requiresLead: boolean;
  fields: ('name' | 'email' | 'phone' | 'company' | 'city')[];
  ctaText?: string;
};

export type ModulePromo = {
  title: string;
  body: string;
  productUrl?: string;
  badge?: string;
};

export type Definition = {
  term: string;
  definition: string;
  example?: string;
};

export type ExampleStep = {
  title: string;
  steps: string[];
  notes?: string[];
};

export type Shortcut = {
  keys: string;
  action: string;
  notes?: string;
};

export type Faq = {
  q: string;
  a: string;
};

export type Lesson = {
  id: string;
  slug: string;
  sectionId: string;
  sectionTitle: string;
  order: number;
  title: string;
  intro: string;
  bodyMd: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  definitions?: Definition[];
  examples?: ExampleStep[];
  shortcuts?: Shortcut[];
  versionNotes?: VersionNote[];
  moduleWarnings?: ModuleWarning[];
  addonWarnings?: AddonWarning[];
  faqs?: Faq[];
  leadMagnet?: LeadMagnet;
  modulePromo?: ModulePromo;
};

export type Section = {
  id: string;
  title: string;
  order: number;
  description: string;
};

export const SECTIONS: Section[] = [
  {
    id: 'fundamentals-version-transitions',
    title: 'Tally Fundamentals & Version Transitions',
    order: 1,
    description:
      'Understand Tally ERP 9 vs Tally Prime, latest version, and key considerations before upgrading.'
  },
  {
    id: 'shortcuts-cheat-sheet',
    title: 'Tally Prime Shortcuts',
    order: 2,
    description:
      'High-impact keyboard shortcuts to save time. Download the printable cheat sheet.'
  },
  {
    id: 'company-masters',
    title: 'Company Setup, Masters & Chart of Accounts',
    order: 3,
    description:
      'Step-by-step guidance to create companies, ledgers, groups and maintain clean masters.'
  },
  {
    id: 'vouchers-contra',
    title: 'Vouchers, Contra & Day-to-Day Entries',
    order: 4,
    description:
      'Record transactions accurately with correct voucher types and best practices.'
  },
  {
    id: 'gst-compliance',
    title: 'GST in Tally Prime',
    order: 5,
    description:
      'Enable GST, configure ledgers, record Intra/Inter-State transactions and generate GST reports.'
  },
  {
    id: 'bank-reconciliation',
    title: 'Bank Reconciliation & Cash Management',
    order: 6,
    description:
      'Perform accurate BRS, match bank statements, and clear unreconciled entries.'
  },
  {
    id: 'cost-centres',
    title: 'Cost Centres, Projects & Departmental Accounting',
    order: 7,
    description:
      'Track expenses by department/project for better control and profitability analysis.'
  },
  {
    id: 'inventory',
    title: 'Inventory, BOM & Godowns',
    order: 8,
    description:
      'Manage stock items, units, godowns, batches and Bill of Materials in Tally Prime.'
  },
  {
    id: 'payroll-hrms',
    title: 'Payroll, HR & Attendance',
    order: 9,
    description:
      'Configure payroll, pay structures, attendance, payslips and compliance requirements.'
  },
  {
    id: 'reports-analysis',
    title: 'Reports, Analysis & Audit Readiness',
    order: 10,
    description:
      'Use Tally Prime reports for financial analysis, control and year-end audit readiness.'
  },
  {
    id: 'integration',
    title: 'Integration (Excel Power Query, XML API, ODBC)',
    order: 11,
    description:
      'Connect Tally Prime with Excel, Power Query, XML API and ODBC for automated data exchange.'
  },
  {
    id: 'career-prep',
    title: 'Career Preparation (Interview, MCQ & Advanced)',
    order: 12,
    description:
      'Prepare for Tally interviews with structured Q&A, MCQs and practical scenarios.'
  },
  {
    id: 'tss-licensing-cloud',
    title: 'TSS, Licensing, Upgrades & Tally Cloud Access',
    order: 13,
    description:
      'Understand TSS, licensing, ERP 9 to Prime upgrades, Tally Cloud Access and support.'
  }
];

export const LESSONS: Lesson[] = [
  {
    id: 'tally-erp9-vs-tally-prime',
    slug: 'tally-erp9-vs-tally-prime',
    sectionId: 'fundamentals-version-transitions',
    sectionTitle: 'Tally Fundamentals & Version Transitions',
    order: 1,
    title: 'Difference Between Tally ERP 9 and Tally Prime',
    intro:
      'Understand the key difference between Tally ERP 9 and Tally Prime. Compare interface, features, usability and upgrade path for your business.',
    bodyMd:
      'Tally Prime is the modern interface built on the same trusted accounting engine. **TallyPrime 7.2** is the latest version.\n\n| Feature | **Tally ERP 9** | **Tally Prime (7.2)** |\n| :-- | :-- | :-- |\n| **User Interface (UI/UX)** | Traditional, function-key driven, menu-centric | Modern, clean, graphical and more intuitive |\n| **Navigation** | Mostly Gateway of Tally menus + F-keys | **Go To (Alt+G)** and **Switch To** for instant search and faster navigation |\n| **Keyboard Shortcuts** | Heavily reliant on F-keys and Alt/Ctrl combinations | More consistent and streamlined (e.g., Alt+G for Go To). Easier for new users |\n| **Reporting** | Reports via menus, more steps for customisation | Enhanced reporting via Go To with contextual options to view, filter, print/export |\n| **Printing & Exporting** | Multi-step print/export configuration | Simplified with better preview and flexible formats (PDF, Excel, JPEG) |\n| **Multi-Tasking** | Limited - usually need to close current screen | **Switch To** lets you move between tasks (e.g., voucher entry while checking a report) |\n| **Installation & Upgrade** | Standard installation, upgrades often manual | Smoother, more guided upgrade with better detection of older Tally data |\n| **Data Migration** | N/A | Seamless migration from Tally ERP 9 to Tally Prime supported in most cases |\n| **Licensing** | Legacy licensing model | Existing ERP 9 licenses can be upgraded to Tally Prime if **TSS** is active (no extra license cost in most upgrade cases) |\n\n**Similarities:** Core accounting, inventory, payroll, taxation (GST/TDS/TCS), data integrity, security and largely compatible data structure.\n\n**Recommendation:** **Tally Prime is highly recommended for all businesses.** Support and updates for Tally ERP 9 will be phased out over time, so moving to TallyPrime 7.2 is the smarter, future-ready choice.',
    seoTitle: 'Difference Between Tally ERP 9 and Tally Prime | Tally Insights',
    seoDescription:
      'Difference between Tally ERP 9 and Tally Prime explained with features, interface, usability, and upgrade guidance for businesses.',
    keywords: [
      'difference between tally erp 9 and tally prime',
      'tally prime vs tally erp 9',
      'tally erp 9 vs tally prime',
      'difference between erp 9 and tally prime'
    ],
    definitions: [
      {
        term: 'Tally ERP 9',
        definition: 'Legacy Tally platform widely used for accounting, inventory and compliance.'
      },
      {
        term: 'Tally Prime',
        definition: 'Current-generation Tally with simplified navigation, GoTo search, and enhanced user experience.'
      }
    ],
    faqs: [
      {
        q: 'What is the main difference between Tally ERP 9 and Tally Prime?',
        a: 'The main difference between Tally ERP 9 and Tally Prime is the modernised user interface with simplified navigation, GoTo search, and improved usability while retaining the same accounting engine.'
      },
      {
        q: 'Is Tally Prime better than Tally ERP 9?',
        a: 'Tally Prime offers a more user-friendly interface, faster navigation, and improved reporting. For most businesses, it is the recommended upgrade path.'
      },
      {
        q: 'Can I upgrade from ERP 9 to Prime?',
        a: 'Yes. Data migration is supported in most cases. Review TSS status and consult your Tally Certified Partner before upgrade.'
      }
    ],
    modulePromo: {
      title: 'Upgrade to TallyPrime 7.2',
      body: 'Need help assessing upgrade, TSS renewal or multi-user setup for your business? Contact us for a free consultation.',
      productUrl: '/contact?service=Tally%20Upgradation',
      badge: 'Free Consultation'
    }
  },
  {
    id: 'latest-version-of-tally-prime',
    slug: 'latest-version-of-tally-prime',
    sectionId: 'fundamentals-version-transitions',
    sectionTitle: 'Tally Fundamentals & Version Transitions',
    order: 2,
    title: 'Latest Version of Tally Prime',
    intro:
      'As of now, TallyPrime 7.2 is the latest version of Tally Prime. Stay updated with release-wise changes, compliance updates and upgrade guidance.',
    bodyMd:
      'As of now, **TallyPrime 7.2** is the latest version of Tally Prime.\n\n**[Contact us for a free consultation regarding upgrades](/contact?service=Tally%20Upgradation)**',
    seoTitle: 'Latest Version of Tally Prime - TallyPrime 7.2 | Tally Insights',
    seoDescription:
      'TallyPrime 7.2 is the latest version of Tally Prime. Learn how to check version, upgrade safely and stay compliant.',
    keywords: [
      'latest version of tally',
      'latest version of tally prime',
      'tally prime latest version',
      'tallyprime 7.2',
      'tally prime 7.2'
    ],
    versionNotes: [
      {
        from: 'Previous releases',
        to: 'TallyPrime 7.2',
        what: 'Latest stable release',
        impact: 'Improved stability, compliance updates and feature enhancements',
        warnings: [
          'Custom TDL modules may need validation against TallyPrime 7.2',
          'Add-ons should be tested in a backup before upgrading',
          'Keep TSS active for smooth statutory updates'
        ]
      }
    ],
    faqs: [
      {
        q: 'What is the latest version of Tally Prime?',
        a: 'The latest version of Tally Prime changes with each release. Check the official Tally Solutions release notes for the current version number and details.'
      },
      {
        q: 'How do I check my Tally Prime version?',
        a: 'Open Tally Prime and check the version displayed at the bottom or in About. Compare with the latest release notes.'
      },
      {
        q: 'What is Tally Prime?',
        a: 'Tally Prime is the current-generation Tally software with simplified navigation, GoTo search, and improved usability for accounting, inventory and compliance.'
      }
    ],
    modulePromo: {
      title: 'Release Validation for Custom Modules',
      body: 'Our custom TDL modules are validated for compatibility. We help test and adjust modules for the latest Tally Prime release.',
      productUrl: '/modules',
      badge: 'Our Modules'
    }
  },
  {
    id: 'tally-prime-shortcuts-complete-list',
    slug: 'tally-prime-shortcuts-complete-list',
    sectionId: 'shortcuts-cheat-sheet',
    sectionTitle: 'Tally Prime Shortcuts',
    order: 1,
    title: 'Tally Prime Shortcut Keys: Complete List',
    intro:
      'Master essential Tally Prime keyboard shortcuts to speed up data entry, navigation and reporting for your business team in TallyPrime 7.2.',
    bodyMd:
      "Shortcut keys in TallyPrime are primarily used to simplify the recording of transactions, navigation, and reporting. They help you work faster without relying heavily on the mouse.\n\n## Hidden/Essential Keys\n| Action | Shortcut Key |\n| :-- | :-- |\n| Go back to previous screen / close current screen | Esc |\n| Remove input provided/selected for a field | Backspace |\n| Open Company Features screen | F11 |\n| Move between fields/menus/lines/columns | Arrow Keys, Tab / Shift+Tab, Up/Down, Left/Right |\n| Move to beginning/end of text or list | Home / End / PgUp / PgDn |\n| Move to first/last field or line | Ctrl+Home / Ctrl+End |\n| Accept or save a screen | Ctrl+A |\n| Expand or collapse group in a table | Alt+Enter |\n| Rewrite data | Ctrl+Alt+R |\n| Quit the application | Alt+F4 |\n| View build information / TDL/Add-on details | Ctrl+Alt+B / Ctrl+Alt+T |\n| Open or hide calculator panel | Ctrl+N |\n| Exit a screen or application | Ctrl+Q |\n\n## Navigation in TallyPrime\n| Action | Shortcut Key |\n| :-- | :-- |\n| Go To (search & jump to masters/reports/vouchers) | Alt+G |\n| Switch To (move between tasks without losing context) | Ctrl+G |\n| Open Company menu | Alt+K |\n| Switch to another company / Open another company / Shut company | F3 / Alt+F3 / Ctrl+F3 |\n| Change date/period for voucher entry or reports | F2 / Alt+F2 |\n| Configuration (applicable for current report/view) | F12 |\n| Help / Contextual TallyHelp | F1 / Ctrl+F1 |\n| Change display language / data entry language | Ctrl+K / Ctrl+W |\n| Import / Export / Print / Email menus | Alt+O / Alt+E / Alt+P / Alt+M |\n\n## Voucher Shortcuts\n| Voucher Type | Shortcut Key |\n| :-- | :-- |\n| Contra Voucher | F4 |\n| Payment Voucher | F5 |\n| Receipt Voucher | F6 |\n| Journal Voucher | F7 |\n| Sales Voucher | F8 |\n| Purchase Voucher | F9 |\n| Credit Note | Alt+F6 |\n| Debit Note | Alt+F5 |\n| Stock Journal | Alt+F7 |\n| Physical Stock | Ctrl+F7 |\n| Delivery Note | Alt+F8 |\n| Receipt Note | Alt+F9 |\n| Sales Order / Purchase Order | Ctrl+F8 / Ctrl+F9 |\n| Rejection In / Rejection Out | Ctrl+F6 / Ctrl+F5 |\n| Payroll Voucher | Ctrl+F4 |\n| List of all vouchers | F10 |\n\n## Voucher Operations\n| Action | Shortcut Key |\n| :-- | :-- |\n| Create master on-the-fly | Alt+C |\n| Open calculator panel (from amount field) | Alt+C |\n| Retrieve narration from previous ledger / previous voucher | Alt+R / Ctrl+R |\n| Delete voucher/transaction | Alt+D |\n| Cancel voucher | Alt+X |\n| Remove item/ledger line | Ctrl+D |\n| Mark as Optional / Post-Dated | Ctrl+L / Ctrl+T |\n| Autofill details | Ctrl+F |\n| Change voucher mode | Ctrl+H |\n| Open Stock Query for selected stock item | Alt+S |\n| Copy/Paste from input field | Ctrl+C / Ctrl+V (or Ctrl+Alt+C / Ctrl+Alt+V) |\n\n## Report Shortcuts\n| Action | Shortcut Key |\n| :-- | :-- |\n| Detailed/Condensed view | Alt+F1 / Alt+F5 |\n| Drill down from a line | Enter |\n| Insert/Add voucher in report / Create entry by duplicating | Alt+I / Alt+A / Alt+2 |\n| Delete/Cancel voucher from report / Remove entry | Alt+D / Alt+X / Ctrl+R |\n| Hide/Show details / Unhide lines | Alt+T / Alt+U / Ctrl+U |\n| Expand/Collapse information | Shift+Enter / Alt+Enter |\n| Alter master during voucher entry or from drill-down | Ctrl+Enter |\n| Select/Deselect lines / Range selection / Select all / Invert selection | Spacebar / Shift+Spacebar / Shift+Up/Down / Ctrl+Spacebar / Ctrl+Shift+Home/End / Ctrl+Alt+I |\n| Add/Alter/Delete/Auto-repeat columns | Alt+C / Alt+A / Alt+D / Alt+N |\n| Filter / Conditional filter / Exception reports | Alt+F12 / Ctrl+F12 / Ctrl+J |\n| Change view / Navigate to Voucher View | Ctrl+H / Ctrl+B |\n\n## Import/Export/Print/Email\n| Action | Shortcut Key |\n| :-- | :-- |\n| Print / Export / Email current voucher or report | Ctrl+P / Ctrl+E / Ctrl+M |\n\nTip: In TallyPrime 7.2, use Alt+G (Go To) as your fastest way to discover and jump to any action, report or master from anywhere. Use the searchable table on this page to quickly find the shortcut you need.",
    seoTitle: 'Tally Prime Shortcut Keys List | Tally Insights',
    seoDescription:
      'Complete list of Tally Prime shortcut keys including Alt+G, voucher shortcuts, navigation keys and more for faster accounting.',
    keywords: [
      'tally prime shortcut keys pdf',
      'shortcut key to delete company in tally',
      'shortcut key to create ledger in tally',
      'how to delete a ledger in tally shortcut',
      'shortcut for payment voucher in tally',
      'alt f12 in tally',
      'alt+g in tally prime'
    ],
    shortcuts: [
      { keys: 'Alt+G', action: 'Go To - Search any menu/report/ledger/voucher' },
      { keys: 'Alt+C', action: 'Create master on-the-fly' },
      { keys: 'Ctrl+A', action: 'Accept/Save' },
      { keys: 'Esc', action: 'Cancel/Go back' },
      { keys: 'Ctrl+Q', action: 'Quit Tally Prime' },
      { keys: 'Alt+F2', action: 'Change Date' },
      { keys: 'Alt+F3', action: 'Company Info Menu' },
      { keys: 'F11', action: 'Company Features' },
      { keys: 'F12', action: 'Configure' },
      { keys: 'Alt+F12', action: 'Advanced Configuration' },
      { keys: 'F4', action: 'Contra Voucher' },
      { keys: 'F5', action: 'Payment Voucher' },
      { keys: 'F6', action: 'Receipt Voucher' },
      { keys: 'F7', action: 'Journal Voucher' },
      { keys: 'F8', action: 'Sales Voucher' },
      { keys: 'F9', action: 'Purchase Voucher' },
      { keys: 'Ctrl+F8', action: 'Credit Note Voucher' },
      { keys: 'Ctrl+F9', action: 'Debit Note Voucher' }
    ],
    faqs: [
      {
        q: 'What is the shortcut key to create a ledger in Tally Prime?',
        a: 'In Tally Prime, you can create a ledger on-the-fly using Alt+C from most screens, or go to Gateway of Tally > Create > Ledger. Using Alt+G (Go To) and searching "Create Ledger" is the fastest way in TallyPrime 7.2.'
      },
      {
        q: 'What is the shortcut key to delete a ledger in Tally Prime?',
        a: 'Select the ledger from the list and press Alt+D to delete (where deletion is allowed). Some system/default ledgers cannot be deleted. For exact context, check the screen prompt or refer to the printable cheat sheet below.'
      },
      {
        q: 'What is the shortcut for a Payment voucher in Tally Prime?',
        a: 'Use F5 from the Accounting Vouchers screen to open a Payment Voucher. You can also use Alt+G (Go To) and search "Payment Voucher".'
      },
      {
        q: 'How is navigation different in TallyPrime 7.2 vs Tally ERP 9?',
        a: 'TallyPrime 7.2 uses Alt+G (Go To) to search and jump to any report, master or voucher from anywhere, and Switch To to move between tasks without losing context. This is far faster than menu-hopping in Tally ERP 9.'
      },
      {
        q: 'Where can I find a printable Tally Prime shortcut keys PDF?',
        a: 'Download the Tally Prime Shortcuts Cheat-Sheet PDF below using the form to keep it offline and share with your team.'
      }
    ],
    leadMagnet: {
      id: 'lm-shortcuts',
      title: 'Tally Prime Shortcuts Cheat-Sheet (Printable PDF)',
      description: 'Concise printable list of essential shortcuts for faster Tally Prime data entry.',
      type: 'pdf',
      downloadPath: '/downloads/tally-prime-shortcuts-cheatsheet.pdf',
      requiresLead: true,
      fields: ['name', 'email', 'phone'],
      ctaText: 'Download Cheat-Sheet'
    },
    modulePromo: {
      title: 'Boost Team Productivity',
      body: 'Need multi-user setup or faster workflows for larger teams? Explore Tally Gold/Server for optimal performance.',
      productUrl: '/products/gold',
      badge: 'Recommended'
    }
  },
  {
    id: 'how-to-create-company-in-tally',
    slug: 'how-to-create-company-in-tally',
    sectionId: 'company-masters',
    sectionTitle: 'Company Setup, Masters & Chart of Accounts',
    order: 1,
    title: 'How to Create a Company in Tally Prime',
    intro:
      'Set up your company profile correctly in Tally Prime with the right financial year, base currency and statutory settings.',
    bodyMd:
      'Accurate company setup ensures correct reporting and compliance. Define financial year, address, GST details (if applicable), and security settings from the start. Keep masters clean to avoid reconciliation issues later.\n\nSteps to create a company (TallyPrime 7.2):\n1. Open Tally Prime and press Alt+F3 > Create Company (or from Company Info screen).\n2. Fill Company Name, Mailing Name, Address, State, Country and Contact details.\n3. Set Financial Year From (e.g., 01-04-YYYY) and Books Beginning From.\n4. Set Base Currency Symbol (e.g., INR).\n5. Configure GST (if applicable) and other statutory details as required.\n6. Accept with Ctrl+A.\n\nHow to open/select a company:\nAlt+F3 > Select Company > Choose your company and press Enter.\n\nHow to alter/edit company details:\nAlt+F3 > Alter > Select company name > Edit details and accept (Ctrl+A).\n\nHow to shut a company:\nAlt+F3 > Shut Company > Select company name > Enter.\n\nHow to delete a company:\nAlt+F3 > Alter > Select company > Press Alt+D > Confirm twice (Yes, Yes). (Take backup before deleting.)',
    seoTitle: 'How to Create a Company in Tally Prime | Tally Insights',
    seoDescription:
      'Step-by-step guide on how to create a company in Tally Prime with financial year, address, and GST settings.',
    keywords: [
      'how to create company in tally',
      'create company in tally prime'
    ],
    examples: [
      {
        title: 'Create New Company',
        steps: [
          'Open Tally Prime > Create Company',
          'Enter Company Name, Mailing Name, Address',
          'Set Financial Year and Books Beginning From',
          'Configure Currency, GST and other statutory details',
          'Review and Accept (Ctrl+A)'
        ],
        notes: [
          'Set correct Financial Year to avoid period selection errors',
          'Enable GST only if registered'
        ]
      }
    ],
    faqs: [
      {
        q: 'How to create a company in Tally Prime step by step?',
        a: 'Open Tally Prime > Create Company, enter basic details, set financial year, configure currency/statutory settings, then save.'
      },
      {
        q: 'Can I edit company details later?',
        a: 'Yes. Use Company Info > Alter to update details where permitted.'
      }
    ],
    modulePromo: {
      title: 'Get Your Tally Setup Right',
      body: 'Need help with initial setup, chart of accounts structuring or multi-location setup?',
      productUrl: '/contact',
      badge: 'Consulting'
    }
  },
  {
    id: 'masters-ledgers-groups',
    slug: 'masters-ledgers-groups',
    sectionId: 'company-masters',
    sectionTitle: 'Company Setup, Masters & Chart of Accounts',
    order: 2,
    title: 'Masters, Ledgers & Groups in Tally Prime',
    intro:
      'Learn how ledgers and groups form the chart of accounts and keep your books structured for clean reporting.',
    bodyMd:
      'Groups classify ledgers for automatic grouping in Balance Sheet and P&L. Create ledgers under correct groups, avoid duplicates, and use cost centres/projects where needed for departmental accounting.\n\nHow to create a ledger:\nGateway of Tally > Accounts Info > Ledgers > Create > Fill details > Accept (Ctrl+A).\n\nHow to display/check a ledger:\nGateway of Tally > Accounts Info > Ledgers > Display > Select ledger.\n\nHow to alter/correct a ledger:\nGateway of Tally > Accounts Info > Ledgers > Alter > Select wrong ledger > Make corrections > Accept (Ctrl+A).\n\nHow to create/check/alter Stock Group, Units of Measure and Stock Items:\n- Stock Group: Inventory Info > Stock Groups > Create/Display/Alter\n- Units of Measure: Inventory Info > Units of Measure > Create/Display/Alter\n- Stock Items: Inventory Info > Stock Items > Create/Display/Alter',
    seoTitle: 'Masters, Ledgers & Groups in Tally Prime | Tally Insights',
    seoDescription:
      'Understand masters, ledgers and groups in Tally Prime with examples to maintain a clean chart of accounts.',
    keywords: [
      'masters in tally',
      'ledgers in tally',
      'groups in tally'
    ],
    definitions: [
      {
        term: 'Group',
        definition: 'Pre-defined or user-defined classification used to auto-group ledgers in reports.'
      },
      {
        term: 'Ledger',
        definition: 'An account for a party, expense, income, asset or liability.'
      },
      {
        term: 'Voucher',
        definition: 'A document used to record transactions in Tally.'
      }
    ],
    examples: [
      {
        title: 'Create Ledger Example',
        steps: [
          'Gateway of Tally > Masters > Create > Ledger',
          'Enter Ledger Name',
          'Select appropriate Group',
          'Fill relevant fields (GST, Opening Balance)',
          'Accept (Ctrl+A)'
        ]
      }
    ],
    faqs: [
      {
        q: 'What is the difference between group and ledger in Tally?',
        a: 'Groups classify ledgers for reporting; ledgers are individual accounts for parties/expenses/incomes.'
      }
    ],
    modulePromo: {
      title: 'Industry-Specific Chart of Accounts',
      body: 'Our custom TDL modules and consulting help structure masters for transport, housing societies, CFA, and other industries.',
      productUrl: '/modules',
      badge: 'Our Modules'
    }
  },
  {
    id: 'vouchers-types-contra',
    slug: 'vouchers-types-contra',
    sectionId: 'vouchers-contra',
    sectionTitle: 'Vouchers, Contra & Day-to-Day Entries',
    order: 1,
    title: 'Types of Vouchers in Tally Prime',
    intro: 'Understand types of vouchers in Tally Prime with examples for accurate transaction recording.',
    bodyMd: 'Tally Prime supports multiple voucher types including Contra, Payment, Receipt, Sales, Purchase, Journal, Debit Note, Credit Note. Use correct voucher type to ensure proper ledger grouping and reports.\n\nCommon accounting vouchers (quick reference):\n1. Capital/Partner A/c receipt (e.g., partner brings capital) - record via appropriate voucher as per case.\n2. Payment Voucher (F5) - Payment for expenses/fixed assets.\n3. Contra Voucher (F4) - Cash deposit/withdrawal between cash and bank.\n4. Purchase Voucher (F9) - Purchase from creditor with item details, tax as applicable.\n5. Sales Voucher (F8) - Sales to debtor/customer with item details, tax as applicable.\n6. Receipt Voucher (F6) - Receipt from debtors/customers.\n7. Payment to Creditors - Record payment to creditor via Payment/Receipt as per nature.\n\nTip: Use Go To (Alt+G) to quickly jump to voucher types in TallyPrime 7.2.',
    seoTitle: 'Types of Vouchers in Tally Prime with Examples | Tally Insights',
    seoDescription: 'Learn types of vouchers in Tally Prime including Contra, Payment, Receipt, Sales, Purchase with examples.',
    keywords: ['types of vouchers in tally', 'what is contra entry in tally', 'contra entry in tally'],
    faqs: [
      { q: 'What are the types of vouchers in Tally?', a: 'Common types: Contra, Payment, Receipt, Sales, Purchase, Journal, Credit Note, Debit Note, Stock Journal depending on features enabled.' },
      { q: 'What is contra entry in Tally?', a: 'Contra entry records transfer between cash and bank (cash deposit/withdrawal). Use F4: Contra voucher.' }
    ],
    modulePromo: { title: 'Standardize Voucher Entry', body: 'Our custom modules help enforce voucher entry rules for teams.', productUrl: '/modules', badge: 'Our Modules' }
  },
  {
    id: 'how-to-record-bank-reconciliation-in-tally',
    slug: 'how-to-record-bank-reconciliation-in-tally',
    sectionId: 'bank-reconciliation',
    sectionTitle: 'Bank Reconciliation & Cash Management',
    order: 1,
    title: 'How to Record Bank Reconciliation in Tally Prime',
    intro: 'Learn how to record bank reconciliation in Tally Prime (BRS) to match your bank statement with books accurately.',
    bodyMd: 'Bank Reconciliation in Tally Prime helps match transactions between bank ledger and bank statement, identify differences, and maintain audit-ready records. Follow version-specific steps, match by date/amount/reference, and clear unreconciled items before month-end.',
    seoTitle: 'How to Record Bank Reconciliation in Tally Prime | Tally Insights',
    seoDescription: 'Step-by-step guide on how to record bank reconciliation in Tally Prime (BRS) with matching, reconciliation and month-end checklist.',
    keywords: ['how to record bank reconciliation in tally', 'bank reconciliation in tally prime', 'tally brs'],
    examples: [
      { title: 'Record Bank Reconciliation', steps: ['Go to Bank Ledger > Reconciliation (Alt+R)', 'Enter bank statement date range/details as applicable', 'Match transactions by Date/Amount/Reference', 'Mark Reconciled (space/accept)', 'Accept and review unreconciled list'], notes: ['Reconcile regularly (monthly) to avoid backlogs', 'Verify opening balance before starting BRS'] }
    ],
    faqs: [
      { q: 'How to record bank reconciliation in Tally Prime?', a: 'Open the Bank Ledger, use Reconciliation (Alt+R), match bank statement entries with book entries by amount/date/reference, mark reconciled and save.' },
      { q: 'What is BRS in Tally?', a: 'Bank Reconciliation Statement (BRS) in Tally matches your cash book bank balance with the bank statement to identify differences.' }
    ],
    leadMagnet: { id: 'lm-bank-reco', title: 'Bank Reconciliation Month-End Audit Checklist (PDF)', description: 'Checklist to close bank reconciliation accurately every month.', type: 'pdf', downloadPath: '/downloads/bank-reconciliation-month-end-checklist.pdf', requiresLead: true, fields: ['name','email','phone'], ctaText: 'Download Checklist' },
    modulePromo: { title: 'Automate Bank Reconciliation Workflows', body: 'Looking to streamline BRS for high-volume transactions? Explore our custom Tally solutions for reconciliation automation.', productUrl: '/modules', badge: 'Our Modules' }
  },
  {
    id: 'cost-centre-in-tally',
    slug: 'cost-centre-in-tally',
    sectionId: 'cost-centres',
    sectionTitle: 'Cost Centres, Projects & Departmental Accounting',
    order: 1,
    title: 'Cost Centre in Tally Prime with Examples',
    intro: 'Learn how to enable and use cost centre in Tally Prime for departmental/project tracking.',
    bodyMd: 'Cost centres help allocate expenses/incomes by department, project or location. Enable in F11 > Cost Centres, create centres, allocate in vouchers and review Cost Centre Reports for control.',
    seoTitle: 'Cost Centre in Tally Prime with Examples | Tally Insights',
    seoDescription: 'Step-by-step guide on cost centre in Tally Prime with examples for departmental accounting.',
    keywords: ['cost centre in tally examples', 'cost centre in tally prime'],
    faqs: [
      { q: 'What is cost centre in Tally?', a: 'A cost centre is a unit (department/project) used to track costs/revenues for analysis.' },
      { q: 'How to enable cost centre in Tally Prime?', a: 'Press F11 > Accounting Features > Maintain Cost Centres = Yes.' }
    ],
    leadMagnet: { id: 'lm-cost-centre', title: 'Cost Centre Setup Checklist (PDF)', description: 'Checklist for enabling and using cost centres effectively.', type: 'pdf', downloadPath: '/downloads/cost-centre-setup-checklist.pdf', requiresLead: true, fields: ['name','email','phone'], ctaText: 'Download Checklist' },
    modulePromo: { title: 'Departmental Accounting Made Easy', body: 'Our industry-specific modules extend cost centre capabilities.', productUrl: '/modules', badge: 'Our Modules' }
  },
  {
    id: 'tally-inventory-bom-godowns',
    slug: 'tally-inventory-bom-godowns',
    sectionId: 'inventory',
    sectionTitle: 'Inventory, BOM & Godowns',
    order: 1,
    title: 'Tally Prime Inventory: Stock Items, Godowns, BOM',
    intro: 'Comprehensive guide to Tally Prime inventory: stock items, units, godowns, batches, BOM.',
    bodyMd: 'Enable inventory (F11 > Inventory), create stock items/units/groups, use godowns for multi-location, enable batches if needed, and use BOM for manufacturing. Review stock reports for control.',
    seoTitle: 'Tally Prime Inventory Guide | Tally Insights',
    seoDescription: 'Learn Tally Prime inventory management: stock items, godowns, batches, BOM with step-by-step guidance.',
    keywords: ['tally inventory', 'godowns in tally', 'bom in tally'],
    faqs: [
      { q: 'How to enable inventory in Tally Prime?', a: 'F11 > Inventory Features > Maintain Inventory = Yes.' },
      { q: 'What is BOM in Tally?', a: 'Bill of Materials defines components/raw materials for finished goods.' }
    ],
    modulePromo: { title: 'Advanced Inventory Control', body: 'Our add-ons/modules enhance inventory for trading/manufacturing.', productUrl: '/modules', badge: 'Our Modules' }
  },
  // CHANGE: 2026-10-22 — the six sections below (gst-compliance, payroll-hrms,
  // reports-analysis, integration, career-prep, tss-licensing-cloud) existed in SECTIONS but
  // had NO lessons, so the sidebar opened an empty panel and the owner reported a section
  // with no content. Every one of them now carries a real, version-specific guide.
  {
    id: 'tally-gst',
    slug: 'tally-gst',
    sectionId: 'gst-compliance',
    sectionTitle: 'GST in Tally Prime',
    order: 1,
    title: 'GST in Tally Prime: Setup, Invoicing and GST Reports',
    intro:
      'Enable GST in TallyPrime 7.2, configure ledgers with HSN/SAC and GSTIN, raise GST invoices and produce GSTR-1, GSTR-3B and GST reports.',
    bodyMd:
      "GST is built into TallyPrime 7.2 - there is no separate GST add-on to buy. Once GST is switched on in Company Features, TallyPrime adds GST fields to your masters and vouchers, prints GST-compliant invoices, and produces the statutory reports you need for filing.\n\n## 1. Enable GST in Company Features\nPress F11 (Company Features) and switch on the GST options you need. Every option is independent, so most businesses enable plain GST first and add e-Invoicing or e-Way Bills later.\n\n| Option | What it turns on | When you need it |\n| :-- | :-- | :-- |\n| Maintain GST | GST fields on ledgers and vouchers, plus the GST report set | Every GST-registered business |\n| Maintain GST with TDS | TDS deducted on GST payments, with reporting for it | Businesses that deduct TDS while paying GST |\n| Maintain GST with TCS | Tax collected at source on GST | Businesses receiving large GST payments from registered buyers |\n| Enable e-Invoicing | IRP invoice numbering and IRN capture on invoices | Turnover above the notified e-Invoice threshold (Rs 5 crore) |\n| Enable e-Way Bills | e-Way Bill details on sales and purchase documents | Goods movement above the notified e-Way Bill threshold (Rs 50,000) |\n\nAccept the screen with Ctrl+A. The change applies to the company immediately.\n\n## 2. Create the ledgers that GST needs\n| Ledger type | Where it goes | Key settings |\n| :-- | :-- | :-- |\n| Party ledger (customer / supplier) | Any of the normal groups | Enable GST = Yes, Applicable for = Goods or Services, HSN code or SAC, GSTIN and State for registered parties |\n| GST output ledgers (CGST, SGST, IGST at each rate) | Duties and Taxes | One ledger per rate, for example GST 5, 12, 18 and 28 |\n| Input tax credit ledgers (Input CGST, Input SGST, Input IGST) | Duties and Taxes | Without these, the tax you pay on purchases is treated as an expense instead of a credit |\n| Non-GST ledgers | Normal groups | Leave Enable GST = No so that no tax is calculated against them |\n\nSet the HSN code to the number of digits the law asks for (2, 4, 6 or 8) and make sure the state on the party ledger matches the state in its GSTIN - a mismatch is the most common reason for a wrong tax split.\n\n## 3. Raise a GST invoice\n1. Press F8 for a Sales voucher and pick the customer ledger.\n2. Enter the item name, quantity and rate. The GST rate and HSN/SAC flow in from the ledger setup.\n3. Check the tax split - CGST plus SGST for an intra-state sale, IGST for an inter-state sale.\n4. Press Alt+P to print. Choose Original for Recipient, Duplicate for Transporter or Counterfoil.\n5. Set invoice numbering under F11 > Accounts Info > Invoice Numbering so every invoice number is generated and reused consistently across the GST reports.\n\nA GST invoice must carry the supplier GSTIN, the buyer GSTIN and state, a sequential invoice number and date, the HSN/SAC, the taxable value, the tax split and the total. The printed invoice from TallyPrime already carries all of these.\n\n## 4. Work with the GST reports\nGateway of Tally > Display > Statutory Reports > GST Reports gives you GSTR-1, GSTR-3B, GST Summary, GST Invoice details and the input tax credit reconciliation. Press Alt+E on any report to export it to Excel, XML or JSON, which is how most accountants hand data to their filing software.\n\nDownloading GSTR-2A and GSTR-2B from the portal, e-Invoice and e-Way Bill utilities all need an active TSS. When TSS expires, TallyPrime keeps your accounting working but those statutory utilities are restricted until it is renewed.",
    seoTitle: 'GST in Tally Prime: Setup, Invoicing and GST Reports | Tally Insights',
    seoDescription:
      'How to enable GST in TallyPrime 7.2, configure ledgers with HSN and GSTIN, raise GST invoices and generate GSTR-1, GSTR-3B and GST reports.',
    keywords: [
      'gst in tally prime',
      'how to enable gst in tally prime',
      'gstr 1 in tally prime',
      'gstr 3b in tally prime',
      'hsn code in tally prime',
      'gst invoice in tally prime'
    ],
    examples: [
      {
        title: 'Intra-state GST sale',
        steps: [
          'Enable GST in Company Features (F11) and accept with Ctrl+A',
          'Create the customer ledger with Enable GST = Yes, HSN/SAC and GSTIN',
          'Create GST ledgers for each applicable rate under Duties and Taxes',
          'Press F8, select the customer, enter item, quantity and rate',
          'Verify CGST and SGST split, then print with Alt+P'
        ],
        notes: [
          'Inter-state sales show IGST instead of CGST plus SGST',
          'Create input tax credit ledgers before your first purchase voucher'
        ]
      }
    ],
    faqs: [
      {
        q: 'How do I enable GST in TallyPrime 7.2?',
        a: 'Press F11 to open Company Features, switch on Maintain GST in the GST section, enable e-Invoicing or e-Way Bills if you need them, then accept with Ctrl+A.'
      },
      {
        q: 'Where do I enter the HSN code in Tally Prime?',
        a: 'While creating the ledger (Enable GST = Yes, then Applicable for and the HSN/SAC field) and on the voucher line when the ledger does not already carry one.'
      },
      {
        q: 'How do I generate GSTR-1 and GSTR-3B from Tally Prime?',
        a: 'Go to Display > Statutory Reports > GST Reports, pick GSTR-1 or GSTR-3B, set the period and press Alt+E to export to Excel, XML or JSON.'
      },
      {
        q: 'Why is the e-Way Bill option unavailable in Tally Prime?',
        a: 'e-Way Bills must be enabled in Company Features and they need an active TSS. If TSS has expired, the statutory utilities are restricted until it is renewed.'
      },
      {
        q: 'Do I need a separate GST add-on for Tally Prime?',
        a: 'No. GST, TDS and TCS are built into TallyPrime 7.2. The statutory download and e-Invoice utilities need an active TSS, not an add-on.'
      }
    ],
    modulePromo: {
      title: 'GST-Ready Setup for Your Business',
      body: 'We set up ledgers, tax rates, invoice numbering and GST reports for your industry, then hand over a working company.',
      productUrl: '/contact?service=GST%20Implementation',
      badge: 'Implementation'
    }
  },
  {
    id: 'tally-payroll-hrms',
    slug: 'tally-payroll-hrms',
    sectionId: 'payroll-hrms',
    sectionTitle: 'Payroll, HR & Attendance',
    order: 1,
    title: 'Payroll in TallyPrime: What Is Native, What Needs an HRMS Add-on',
    intro:
      'Understand what TallyPrime 7.2 does for payroll on its own, what an HRMS add-on adds, and how salary, PF, ESI, TDS and payslips are actually handled.',
    bodyMd:
      "Payroll is the area where teams are most often disappointed. TallyPrime is a strong accounting and compliance engine, but it does not ship with a payroll engine of its own - there is no salary-structure screen, no attendance capture and no payslip designer in the core product. Being clear about that up front saves a week of searching for a button that does not exist.\n\n## What TallyPrime 7.2 handles natively\n| Task | How the core product handles it |\n| :-- | :-- |\n| Salary and wages expense | Book a Journal or Payment voucher against your Salary and Wages ledger |\n| Employee advances and recoveries | Receipt and Journal vouchers against an Advances ledger, then settle them monthly |\n| TDS on salary | Enable TDS in Company Features; the deduction is computed on the salary payment voucher and appears in the TDS reports |\n| Provident Fund, ESI and Professional Tax | Book through ledgers under Duties and Taxes with the right group so they land in the correct statutory report |\n| Splitting salary cost across branches or projects | Turn on cost centres (F11 > Accounting Features) and tag each salary voucher with the department |\n| Attendance, leave and shift planning | Not part of core TallyPrime - this is what an HRMS add-on provides |\n\n## What an HRMS add-on adds\n| Capability | What it gives the business |\n| :-- | :-- |\n| Employee master | One record per employee with documents, contact details, joining date, salary structure and bank details |\n| One-click payroll | Monthly payroll run that calculates earnings, overtime, deductions and net pay |\n| Attendance | Biometric or mobile check-in data feeding the payroll run |\n| Payslips | Employee-wise payslips the staff can download themselves |\n| Statutory compliance | Computes and reports PF, ESI, TDS and Professional Tax for the applicable state |\n| Post to Tally | Pushes the payroll result into TallyPrime as a Payment voucher plus the statutory entries, so nothing is re-typed by your accountant |\n\n## The recommended flow\n1. Enable the payroll/HRMS add-on from F11 > Add-Ons and accept.\n2. Create employee masters and salary structures in the HRMS screen, not in Tally.\n3. Import or capture attendance for the month.\n4. Run the payroll and review the preview before posting.\n5. Post to TallyPrime - the salary payment and statutory deductions land as vouchers.\n6. Review the TDS on salary and statutory reports in TallyPrime before you file.\n\nKeep a single rule: TallyPrime is the book of record for the amounts, the HRMS owns the people data. When both are kept in step, payroll stops being a manual exercise at month end.",
    seoTitle: 'Payroll in Tally Prime: Native Features vs HRMS Add-on | Tally Insights',
    seoDescription:
      'What TallyPrime 7.2 handles for payroll natively, what an HRMS add-on adds, and the recommended payroll-to-Tally posting flow.',
    keywords: [
      'payroll in tally prime',
      'tally prime hrms',
      'tally payroll module',
      'payslip in tally',
      'tds on salary in tally prime'
    ],
    faqs: [
      {
        q: 'Does Tally Prime have a built-in payroll module?',
        a: 'No. Core TallyPrime handles the accounting side - salary vouchers, TDS on salary, PF, ESI and Professional Tax through ledgers - but attendance, salary structures and payslips come from an HRMS or payroll add-on.'
      },
      {
        q: 'How do I record salary expenses in Tally Prime?',
        a: 'Post a Payment or Journal voucher against your Salary and Wages ledger. Turn on cost centres if you need to split salary cost by department.'
      },
      {
        q: 'Is TDS on salary computed automatically in Tally Prime?',
        a: 'Yes, once TDS is enabled in Company Features and the employee TDS category is set, the deduction is computed on the salary voucher and reported under TDS reports.'
      },
      {
        q: 'Can an HRMS post payroll directly into Tally Prime?',
        a: 'Yes. Our HRMS integrates with TallyPrime and pushes the monthly payroll result as vouchers, so the accountant does not re-key anything.'
      }
    ],
    modulePromo: {
      title: 'HRMS That Posts Straight Into TallyPrime',
      body: 'Employee records, one-click payroll, attendance, payslips and statutory compliance - integrated with TallyPrime.',
      productUrl: '/hrms',
      badge: 'Our HRMS'
    }
  },
  {
    id: 'tally-reports-analysis',
    slug: 'tally-reports-analysis',
    sectionId: 'reports-analysis',
    sectionTitle: 'Reports, Analysis & Audit Readiness',
    order: 1,
    title: 'TallyPrime Reports: Balance Sheet, Profit and Loss, Cash Flow and Audit Readiness',
    intro:
      'A practical map of the TallyPrime 7.2 report suite - how to reach every report, what it answers, and how to use the reports to close the books audit-ready.',
    bodyMd:
      "TallyPrime has more reports than most people ever open, and most of them are one Alt+G away. Knowing which report answers which question is the difference between a five-minute review and an afternoon of exporting Excel.\n\n## The report map\n| Report | Where to find it | The question it answers |\n| :-- | :-- | :-- |\n| Balance Sheet | Display > Financial Reports > Balance Sheet | What do we own and owe on this date? |\n| Profit and Loss | Display > Financial Reports > Profit and Loss | Did we make money this period, and from where? |\n| Cash Flow | Display > Cash Flow | Where did the cash come from and where did it go? |\n| Trial Balance | Display > Financial Reports > Trial Balance | Do the ledger balances agree with the group totals? |\n| Day Book | Display > Day Book | What exactly happened on one day, voucher by voucher? |\n| Books of Accounts (Ledger, Journal, Voucher) | Display > Books of Accounts | Full detail for one ledger, the journal, or a voucher type |\n| Receivables and Payables (aged) | Display > Financial Reports > Receivables / Payables | Who owes us, who do we owe, and for how long? |\n| Stock / Godown / Item reports | Display > Inventory Reports | What stock do we hold, where, and at what value? |\n| GST and TDS reports | Display > Statutory Reports | What has to be filed, and what is the position on each party? |\n| Audit and analysis | Gateway of Tally > Display > Audit and Analysis | Turnover, profitability and trend views for a given period |\n\n## Faster navigation\n- Alt+G (Go To) opens a search box - type Balance Sheet, Cash Flow or Receivables and jump straight there.\n- F12 (Configure) changes the report on screen: period, columns, ledger grouping, cost centre split.\n- Alt+P prints, Alt+E exports to Excel, XML, JSON or JPEG.\n- Ctrl+G (Switch To) moves to another task without losing the report you had open - useful while a voucher is on screen.\n\n## A month-end review routine that actually closes the books\n1. Run Bank Reconciliation for every bank account and clear the unreconciled list. An unreconciled book is the most common audit query.\n2. Review the Cash Flow statement, not just the P&L - profit that has not turned into cash is the first thing an auditor asks about.\n3. Compare the Balance Sheet with the previous period and investigate every movement that is not explained by a known transaction.\n4. Reconcile the TDS payable ledger with the TDS reports before you pay, so the challan and the books agree.\n5. Match the stock report with the physical count for at least the high-value items, and record the difference through a Stock Journal rather than a Journal.\n6. Export the Trial Balance and the Balance Sheet and keep them with the voucher print for the period.\n\n## Audit-ready habits that cost nothing\n- Give every user a separate login and set security levels so only the right people can alter masters.\n- Make sure the Books Beginning From date is right, because every report is calculated from it.\n- Use narration on Journal and Payment vouchers - it is the first thing an auditor reads.\n- Keep vouchers dated in the period they belong to; back-dated entries are the second most common query.\n- Take a backup before any rewriting of data, and never rewrite data to fix a report.",
    seoTitle: 'TallyPrime Reports Guide: Balance Sheet, P&L, Cash Flow and Audit | Tally Insights',
    seoDescription:
      'A practical map of TallyPrime 7.2 reports - balance sheet, profit and loss, cash flow, receivables, GST and TDS - plus a month-end audit readiness routine.',
    keywords: [
      'tally prime reports',
      'how to check balance sheet in tally',
      'cash flow statement in tally prime',
      'trial balance in tally prime',
      'audit ready tally books',
      'tally prime go to shortcut reports'
    ],
    faqs: [
      {
        q: 'How do I open the Balance Sheet in Tally Prime?',
        a: 'Press Alt+G (Go To), type Balance Sheet and press Enter. F12 then lets you set the period and the columns you want.'
      },
      {
        q: 'Does Tally Prime have a cash flow statement?',
        a: 'Yes. Open it from Display > Cash Flow, or search for Cash Flow with Alt+G. Review it monthly alongside the profit and loss account.'
      },
      {
        q: 'How do I export a Tally report to Excel?',
        a: 'Open the report and press Alt+E, then choose Excel. The export respects the period and configuration you have set on screen.'
      },
      {
        q: 'What is the fastest way to find a report in TallyPrime 7.2?',
        a: 'Use Alt+G (Go To) and type part of the report name. It searches masters, reports and voucher types from anywhere in the product.'
      }
    ],
    modulePromo: {
      title: 'Custom Reports For Your Business',
      body: 'Need a report TallyPrime does not ship with - MIS packs, branch-wise MIS, custom ageing or statutory formats? We build them as TDL modules.',
      productUrl: '/modules',
      badge: 'Our Modules'
    }
  },
  {
    id: 'tally-integration-excel-xml-odbc',
    slug: 'tally-integration-excel-xml-odbc',
    sectionId: 'integration',
    sectionTitle: 'Integration (Excel Power Query, XML API, ODBC)',
    order: 1,
    title: 'TallyPrime Integration: Excel, XML API, ODBC and Power Query',
    intro:
      'Move data in and out of TallyPrime 7.2 - Excel import and export, the XML API for automation, ODBC connectivity and Power Query reporting.',
    bodyMd:
      "TallyPrime is a closed accounting book, but it is not a closed data silo. It exports, it imports, and it serves data over an API - which is how a finance team stops re-keying numbers between Tally and Excel.\n\n## Choose the right route\n| What you want to do | Tool to use | How it works |\n| :-- | :-- | :-- |\n| Bring ledgers, items and opening balances in from Excel | Excel import | Gateway of Tally > Import of Data > Masters, point at an Excel sheet and map the columns |\n| Take a report out for analysis | Export (Alt+E) | Export any report to Excel, XML, JSON or JPEG |\n| Push and pull data automatically | XML API | TallyPrime serves XML over HTTP on your own machine, so any script or service can read and write |\n| Build dashboards in Excel or Power BI | ODBC or Power Query | Connect to the Tally data source and treat the ledgers as tables |\n| Send data to a website or portal | XML API | Post vouchers, masters and reports from your own server to the Tally API |\n\n## Excel import, step by step\n1. Prepare one row per master, with a header row that names each field exactly as Tally expects.\n2. Gateway of Tally > Import of Data > Masters (or Vouchers for voucher data).\n3. Choose the file, then map each spreadsheet column to the Tally field in the mapping screen.\n4. Create or alter masters as part of the import - tick the option if you want the import to create masters that do not exist yet.\n5. Import, then review the log. Every rejected row is listed with the reason.\n6. Verify with a display list before you close the screen - an import that half worked is worse than no import.\n\n## The XML API\nTallyPrime can run as a server on your workstation or server and answer requests over HTTP, typically on port 9000. You send a request that names the company and the data you want, and TallyPrime returns XML (JSON is supported as well).\n\n- Point the request at the local host and the company, so the data never leaves the office network unless you build it that way.\n- The usual pattern is a scheduled script that reads the day's vouchers and writes them into your own reporting store.\n- Keep the request templates in version control and log every request - an integration that nobody can debug is worse than a manual export.\n- Always open and close the company session inside a single request. A half-open session is the most common cause of empty responses.\n\n## ODBC and Power Query\nInstall the Tally ODBC driver, enable the ODBC connection from Company Features, then connect any ODBC-compliant tool (Excel Power Query, Power BI, Tableau) to the Tally data source and treat masters, ledgers and vouchers as tables.\n\nWith Power Query the same job is done through the API: choose Get Data > Web, point it at the Tally request URL and let Power Query parse the XML response. Refresh on a schedule and your dashboard updates without anybody exporting anything.\n\n## Practical advice\n- Import masters once and maintain them in Tally. Re-importing the same masters every month is how duplicates appear.\n- Export to CSV rather than Excel for anything that will be loaded into another system - it avoids date and number formatting surprises.\n- Keep a sandbox company for integration testing so a bad request never touches live books.\n- Log every automated write. Automation without a log is an audit finding waiting to happen.",
    seoTitle: 'TallyPrime Integration: Excel, XML API, ODBC and Power Query | Tally Insights',
    seoDescription:
      'How to import masters from Excel, export reports, use the TallyPrime XML API and connect with ODBC or Power Query in TallyPrime 7.2.',
    keywords: [
      'tally prime integration',
      'tally xml api',
      'import data from excel to tally',
      'tally power query',
      'tally odbc connectivity',
      'tally prime data export'
    ],
    faqs: [
      {
        q: 'How do I import ledgers from Excel into Tally Prime?',
        a: 'Use Gateway of Tally > Import of Data > Masters, select the Excel file, map the columns to Tally fields and import. Always check the import log for rejected rows.'
      },
      {
        q: 'What is the Tally XML API used for?',
        a: 'It lets your own scripts or services read and write TallyPrime data over HTTP - typically for automated exports, website posting or a reporting warehouse.'
      },
      {
        q: 'Can I connect Power BI or Power Query to TallyPrime?',
        a: 'Yes, through the ODBC driver or by calling the XML API from Power Query. Both give you ledgers, masters and vouchers as refreshable tables.'
      },
      {
        q: 'Which export format should I use for another accounting system?',
        a: 'Prefer CSV for structured data and XML for systems that accept it. Excel is fine for analysis, but date and number formatting can change values on import.'
      }
    ],
    modulePromo: {
      title: 'Custom Integration For Your Workflow',
      body: 'We build TallyPrime integrations for MIS, portals and ERP links - XML API, Excel automation and ODBC reporting pipelines.',
      productUrl: '/contact?service=Tally%20Integration',
      badge: 'Integration'
    }
  },
  {
    id: 'tally-career-prep',
    slug: 'tally-career-prep',
    sectionId: 'career-prep',
    sectionTitle: 'Career Preparation (Interview, MCQ & Advanced)',
    order: 1,
    title: 'Tally Interview Questions and MCQs: Career Preparation Guide',
    intro:
      'Prepare for a Tally job or a client implementation role - the questions interviewers actually ask, MCQs with answers, and how to build a portfolio that gets you hired.',
    bodyMd:
      "Most Tally interviews are not about theory. The interviewer wants to know whether you can take a company from a blank screen to a working set of books, and whether you will notice when something is wrong with the data. These are the questions that come up most often, with the answer they are looking for.\n\n## Interview questions and how to answer them\n| Question | What the interviewer is really testing | How to answer it well |\n| :-- | :-- | :-- |\n| Difference between ERP 9 and Tally Prime | Whether you know the current product | Cover the interface, Go To navigation, multi-tasking and the data migration path - then say which one you would recommend and why |\n| How do you create a ledger with GST? | Whether you can set up statutory masters | Company Features first, then the ledger with Enable GST, Applicable for, HSN or SAC, GSTIN and state |\n| A customer says their books do not match the bank statement | Whether you can debug, not just operate | Bank reconciliation first, then unreconciled items, then the audit trail - never edit the books to make them agree |\n| How would you plan a new company implementation? | Whether you can run a project | Chart of accounts, masters, opening balances, voucher checks, GST setup, user roles, go-live plan |\n| What is contra and when do you use it? | Core accounting fundamentals | Movement between cash and bank only, and never for a receipt from a customer or a payment to a supplier |\n| How do you fix a wrong GST invoice after it is issued? | Whether you know the correction flow | Credit or debit note as per the situation, never an edit of the issued invoice |\n| Where do you check the TSS expiry? | Whether you understand licensing | F1 > About for the licence and TSS validity, and Alt+R > Manage TSS Renewal for the renewal screen |\n| How do you export data for the auditor? | Whether you can hand over cleanly | Export the required reports to Excel or PDF, keep the voucher print and the trial balance for the period |\n\n## Practice MCQs\n| Question | Options | Answer |\n| :-- | :-- | :-- |\n| Which shortcut opens the Go To search in TallyPrime? | A) F11 B) Alt+G C) Alt+F2 D) Ctrl+G | B) Alt+G |\n| Which voucher type records a cash deposit into the bank? | A) Payment B) Receipt C) Contra D) Journal | C) Contra |\n| Where is the HSN code maintained for a ledger? | A) Invoice print settings B) Ledger GST details C) Company Features only D) Bank reconciliation | B) Ledger GST details |\n| What is BRS? | A) Bank Receipt Summary B) Bank Reconciliation Statement c) Balance Sheet Report D) Batch Release Summary | B) Bank Reconciliation Statement |\n| TDS on salary is deducted when? | A) On customer receipts B) On salary payment C) On purchase orders D) On stock transfer | B) On salary payment |\n| Which report shows what you own and owe? | A) Profit and Loss B) Trial Balance C) Balance Sheet D) Cash Flow | C) Balance Sheet |\n\n## How to build a portfolio that gets you hired\n1. Build one complete company end to end - masters, vouchers, GST, bank reconciliation, a year-end close with all the reports exported.\n2. Write it up in two pages: what the business does, the chart of accounts you chose and why, and the checks you ran before go-live.\n3. Learn one add-on or TDL module. Knowing how to extend TallyPrime is what separates an operator from an implementer.\n4. Practise on the free TallyPrime education licence, then demo on a real client company structure.\n5. Keep your shortcuts muscle memory - interview demos are timed and navigation speed is visible.\n\n## Common mistakes to avoid in the interview\n- Claiming to know an add-on you have never opened. Say what you have used and what you would learn.\n- Describing ERP 9 menus as if they were TallyPrime menus - the interviewer will notice immediately.\n- Talking about features instead of outcomes. Say what the business gets, not what the screen does.\n- Forgetting the basics - contra, debit and credit, and why a trial balance must agree. These still get asked.",
    seoTitle: 'Tally Interview Questions and MCQs | Tally Insights',
    seoDescription:
      'TallyPrime interview preparation - the questions interviewers ask, MCQs with answers, portfolio tips and common mistakes to avoid.',
    keywords: [
      'tally interview questions',
      'tally prime mcq questions',
      'tally job interview preparation',
      'tally accountant interview questions',
      'tally certification guide'
    ],
    faqs: [
      {
        q: 'How do I prepare for a Tally Prime interview?',
        a: 'Build one complete company end to end, know the report suite and the GST setup, practise the shortcuts, and be ready to explain a month-end close and a bank reconciliation.'
      },
      {
        q: 'Is a Tally certification required to get a Tally job?',
        a: 'It helps but it is not the deciding factor. Interviewers mostly test hands-on ability - masters, vouchers, GST, reconciliation and reports.'
      },
      {
        q: 'What is the most common Tally interview mistake?',
        a: 'Answering with ERP 9 habits in a TallyPrime interview, and describing screens rather than outcomes. Use Go To, Switch To and the TallyPrime menu names.'
      }
    ],
    modulePromo: {
      title: 'We Hire And Train Tally Professionals',
      body: 'Sarvadnya Infotech is a Tally Certified Partner and we hire accountants and implementers. See our current openings.',
      productUrl: '/careers',
      badge: 'We Are Hiring'
    }
  },
  {
    id: 'tss-licensing-upgrades-cloud',
    slug: 'tss-licensing-upgrades-cloud',
    sectionId: 'tss-licensing-cloud',
    sectionTitle: 'TSS, Licensing, Upgrades & Tally Cloud Access',
    order: 1,
    title: 'TSS, Licensing, ERP 9 to Prime Upgrades and Tally Cloud Access',
    intro:
      'What Tally Software Services (TSS) is, which TallyPrime licence your business needs, how an ERP 9 upgrade works and what Tally Cloud Access gives you.',
    bodyMd:
      "TSS - Tally Software Services - is the annual subscription behind TallyPrime. It is what keeps the product compliant, keeps the screens current and unlocks the statutory utilities. Most upgrade questions are really TSS questions, so they are answered together here.\n\n## What TSS gives you\n| With active TSS | Without TSS |\n| :-- | :-- |\n| Statutory updates for GST, e-Invoice, e-Way Bill and payroll compliance | Your accounting keeps working, but statutory utilities and downloads are restricted |\n| GSTR-2A and GSTR-2B download inside TallyPrime | These downloads are blocked |\n| e-Invoice and e-Way Bill generation through the IRP and the e-Way Bill portal | Generation is restricted until it is renewed |\n| Online support and the latest release fixes | You run on whatever version you installed |\n| Tally Cloud Access for remote working | No remote access through Tally Cloud |\n\n## Which licence fits\n| Licence | Who it is for | What it gives |\n| :-- | :-- | :-- |\n| Silver | Single user, single company | Full accounting and compliance for one person |\n| Gold | Multiple users and multiple companies | Multi-user work and more than one company book |\n| Server | A whole office or branch | Unlimited users on the local network, one shared data set |\n| Education | Learners and trainees | A free learning licence with limited company books |\n\nTSS is purchased against the licence type, so a Gold user buys a multi-user TSS and a Silver user buys a single-user TSS. Check the current licence before you buy - press F1 > About for the licence details, and Alt+R > Manage TSS Renewal for the TSS screen.\n\n## Moving from ERP 9 to Tally Prime\n1. Check that TSS is active on the ERP 9 licence. An ERP 9 licence with active TSS can generally be upgraded to Tally Prime without buying a fresh licence.\n2. Take a complete backup of the ERP 9 data folder and keep it.\n3. Install Tally Prime and choose the upgrade option when it points at the existing ERP 9 data.\n4. Let the upgrade finish, then check the data: ledger balances, opening stock, outstanding bills and the number of vouchers.\n5. Re-check company features - a few of them are not carried over automatically, GST and payroll settings in particular.\n6. Validate any TDL modules and add-ons you use against TallyPrime 7.2 before go-live.\n\n## Tally Cloud Access\nTally Cloud Access lets authorised users open company books remotely over the internet, with role-based control and your data still sitting in your office. It is the usual answer for a founder or an accountant who needs the books away from the office, and it removes the temptation to copy the data onto a laptop.",
    seoTitle: 'TSS, Licensing, ERP 9 to Prime Upgrades and Tally Cloud | Tally Insights',
    seoDescription:
      'What TSS is and what it unlocks, which TallyPrime licence you need, how to move from ERP 9 to Tally Prime and what Tally Cloud Access does.',
    keywords: [
      'tally prime tss',
      'tally software services',
      'tally erp 9 to tally prime upgrade',
      'tally prime licence types',
      'tally cloud access',
      'tally prime server license'
    ],
    faqs: [
      {
        q: 'What is TSS in Tally Prime?',
        a: 'Tally Software Services is the annual subscription that keeps TallyPrime compliant and current - statutory updates, e-Invoice and e-Way Bill utilities, GSTR-2A and 2B downloads, support and Tally Cloud Access.'
      },
      {
        q: 'How do I check my TSS validity?',
        a: 'Press Alt+R for Manage TSS Renewal, or F1 > About to see the licence and TSS details on screen.'
      },
      {
        q: 'Can I upgrade my ERP 9 licence to Tally Prime?',
        a: 'Yes, if TSS is active on the ERP 9 licence. Take a full backup first, install Tally Prime, choose the upgrade option and then verify balances, stock and company features.'
      },
      {
        q: 'What happens if TSS expires?',
        a: 'Your accounting keeps working, but statutory utilities such as e-Invoice, e-Way Bill and GSTR-2A or 2B downloads are restricted until TSS is renewed.'
      },
      {
        q: 'What is Tally Cloud Access?',
        a: 'It lets authorised users open your company books remotely over the internet with role-based control, while the data stays on your own office machine.'
      }
    ],
    modulePromo: {
      title: 'Licensing And Upgrade Support',
      body: 'Not sure which licence or TSS combination fits? We check your current setup and plan the upgrade with you.',
      productUrl: '/contact?service=Tally%20Upgradation',
      badge: 'Free Consultation'
    }
  },
  {
    id: 'tss-offline-renewal-how-to-renew',
    slug: 'tss-offline-renewal-how-to-renew',
    sectionId: 'tss-licensing-cloud',
    sectionTitle: 'TSS, Licensing, Upgrades & Tally Cloud Access',
    order: 2,
    title: 'How to Renew Tally TSS Offline: Steps, Requirements and When to Contact Us',
    intro:
      'Renew Tally Software Services offline when the online option will not load - what you need before you start, the exact steps, and how Sarvadnya Infotech processes the renewal.',
    bodyMd:
      "If the online TSS renewal option does not show up, the portal will not load, or the machine has no internet access, the renewal can still be done offline through your Tally Certified Partner. This guide covers both the do-it-yourself checks and the offline path.\n\n## First, check whether you actually need the offline route\n| Symptom | What it usually means | Do this |\n| :-- | :-- | :-- |\n| No Manage TSS Renewal option in the menus | TSS is already active, or the licence type does not include TSS | Check F1 > About for the TSS validity date first |\n| The renewal screen does not load | A network or browser problem on that machine | Try a different network, or use the offline route below |\n| TSS has expired | The statutory utilities are restricted | Renew as soon as possible - do not wait for month end |\n| The office has no internet access | The machine cannot reach the licence server | Use the offline route below |\n\n## What you need before you start\n- The TallyPrime serial number - press F1 > About and note it down.\n- Company name and the licence type (Silver, Gold or Server).\n- The registered mobile number and email on the licence.\n- Your existing TSS validity date, so we can check the right renewal period.\n\n## The offline renewal steps\n1. Note the serial number from F1 > About and the current TSS validity from the same screen.\n2. Share the serial number and company details with your Tally Certified Partner - for us, that is Sarvadnya Infotech LLP.\n3. We verify the licence and TSS status against the serial number and confirm the renewal period and the amount.\n4. You receive the renewal details and the invoice against your company details.\n5. We process the offline TSS renewal for your serial number.\n6. Apply the renewal in TallyPrime and confirm the new validity date under F1 > About.\n\n## Which features come back after the renewal\n| Feature | Effect while TSS is expired | After renewal |\n| :-- | :-- | :-- |\n| GSTR-2A and GSTR-2B download | Not available | Available again from the portal |\n| e-Invoice generation with IRN | Blocked | Works with the IRP settings you already configured |\n| e-Way Bill generation | Blocked | Works again |\n| Direct statutory filing utilities | Restricted | Available |\n| Core accounting, inventory and reports | Unaffected | Unaffected |\n\n## Practical advice\n- Renew before expiry rather than after - it avoids a gap where your team is working on a restricted licence.\n- TSS is available on Silver, Gold and Server licences; it is not a Gold-only feature.\n- Keep the renewal invoice and the serial number on file - they are what you need if the licence is ever re-issued on a new machine.\n- Renewing early does not change what you are entitled to; the validity simply starts when the renewal is applied.\n\nFor the full offline renewal walkthrough, see our article on [how to renew Tally TSS offline](/news/how-to-renew-tally-tss-offline), or the [TSS service page](/services/tss).",
    seoTitle: 'How to Renew Tally TSS Offline: Steps and Requirements | Tally Insights',
    seoDescription:
      'Renew Tally Software Services offline when the online option will not load - what you need, the exact steps, and which features come back after renewal.',
    keywords: [
      'tally tss offline renewal',
      'how to renew tally tss',
      'renew tally software services offline',
      'tally prime tss renewal steps',
      'tally tss expired features'
    ],
    faqs: [
      {
        q: 'Can TSS be renewed offline?',
        a: 'Yes. Your Tally Certified Partner can process the renewal against your serial number and it can then be applied to your licence.'
      },
      {
        q: 'Where do I find my Tally serial number?',
        a: 'Press F1 > About in TallyPrime. The licence and serial number are shown on that screen.'
      },
      {
        q: 'What stops working when TSS expires?',
        a: 'e-Invoice, e-Way Bill, GSTR-2A and 2B downloads and direct statutory filing utilities are restricted. Core accounting, inventory and reports are unaffected.'
      },
      {
        q: 'Is TSS included with Silver licences?',
        a: 'Yes. TSS works on Silver, Gold and Server licences - it is not limited to Gold.'
      }
    ],
    modulePromo: {
      title: 'Offline TSS Renewal, Handled',
      body: 'Send us your serial number and we will verify the licence, process the offline renewal and guide you through applying it.',
      productUrl: '/services/tss',
      badge: 'TSS Renewal'
    }
  }
];


export function getSectionById(id: string) {
  return SECTIONS.find((s) => s.id === id);
}

export function getLessonsBySection(sectionId: string) {
  return LESSONS.filter((l) => l.sectionId === sectionId).sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(slug: string) {
  return LESSONS.find((l) => l.slug === slug);
}

export function getAllLessonSlugs() {
  return LESSONS.map((l) => ({ section: l.sectionId, slug: l.slug }));
}
