export type DestinationCategory = 'products' | 'services' | 'cloud' | 'modules' | 'others';

export type FormDestination = {
  key: string;
  label: string;
  paths: string[];
  category: DestinationCategory;
};

// Ordered categories shown in the admin email config. Each page's form routes
// to its destination receiver (configured per-page in the admin panel → DB),
// grouped so Products / Services / Cloud / Modules enquiries are kept separate.
export const DESTINATION_CATEGORIES: { key: DestinationCategory; label: string; description: string }[] = [
  { key: 'products', label: 'Products Enquiries', description: 'TallyPrime products, licensing & related page forms.' },
  { key: 'services', label: 'Services Enquiries', description: 'TSS, TDL, AMC, training and other service page forms.' },
  { key: 'cloud', label: 'Cloud Enquiries', description: 'AWS / Windows / Backup for Tally / Tally Cloud Access page forms.' },
  { key: 'modules', label: 'Modules Enquiries', description: 'Custom Tally modules page forms.' },
  { key: 'others', label: 'Other Pages', description: 'Home, demo, HRMS, contact and any other form pages.' },
];

export const FORM_DESTINATIONS: FormDestination[] = [
  // Products
  { key: 'products', label: 'Products Hub', paths: ['/products'], category: 'products' },
  { key: 'silver', label: 'TallyPrime Silver', paths: ['/products/silver'], category: 'products' },
  { key: 'gold', label: 'TallyPrime Gold', paths: ['/products/gold'], category: 'products' },
  { key: 'server', label: 'Tally Server', paths: ['/products/server'], category: 'products' },
  { key: 'tallydrive', label: 'TallyDrive', paths: ['/products/tallydrive'], category: 'products' },
  { key: 'tallycapital', label: 'TallyCapital', paths: ['/products/tallycapital'], category: 'products' },

  // Services
  { key: 'services', label: 'Services Hub', paths: ['/services'], category: 'services' },
  { key: 'tss', label: 'TSS Service', paths: ['/services/tss'], category: 'services' },
  { key: 'tss-renewal', label: 'TSS Renewal', paths: [], category: 'services' },
  { key: 'tdl', label: 'TDL Service', paths: ['/services/tdl'], category: 'services' },
  { key: 'whatsapp', label: 'Tally on WhatsApp', paths: ['/services/tally-on-whatsapp'], category: 'services' },
  { key: 'amc', label: 'AMC Service', paths: ['/services/amc'], category: 'services' },
  { key: 'corporate-training', label: 'Corporate Training', paths: ['/services/corporate-training'], category: 'services' },
  { key: 'mobile-app-biz', label: 'Mobile App Biz', paths: ['/services/mobile-app-biz'], category: 'services' },

  // Cloud
  { key: 'cloud', label: 'Cloud Hub', paths: ['/cloud'], category: 'cloud' },
  { key: 'aws', label: 'AWS Cloud', paths: ['/cloud/aws'], category: 'cloud' },
  { key: 'windows', label: 'Windows Cloud', paths: ['/cloud/windows'], category: 'cloud' },
  { key: 'backup-for-tally', label: 'Backup for Tally', paths: ['/cloud/backup-for-tally'], category: 'cloud' },
  { key: 'tallycloudaccess', label: 'Tally Cloud Access', paths: ['/cloud/tallycloudaccess'], category: 'cloud' },

  // Modules
  { key: 'modules', label: 'Modules', paths: ['/modules'], category: 'modules' },

  // Other pages
  { key: 'home', label: 'Home Page', paths: ['/'], category: 'others' },
  { key: 'demo', label: 'Demo / Get Now', paths: ['/demo'], category: 'others' },
  { key: 'hrms', label: 'HRMS', paths: ['/hrms'], category: 'others' },
  { key: 'do-more', label: 'Do More', paths: ['/do-more'], category: 'others' },
  { key: 'contact', label: 'Contact Page', paths: ['/contact'], category: 'others' },
  { key: 'find-solution', label: 'Find Solution', paths: ['/find-solution'], category: 'others' },
  { key: 'report-problem', label: 'Report a Problem', paths: ['/report-problem'], category: 'others' },
];

export const KNOWN_DESTINATION_KEYS = FORM_DESTINATIONS.map((d) => d.key);

export function getDestinationFromPath(pathname: string | null | undefined): string | undefined {
  const path = (pathname || '').replace(/\/+$/, '') || '/';
  const match = FORM_DESTINATIONS.find((d) => d.paths.includes(path));
  return match?.key;
}
