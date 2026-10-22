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
