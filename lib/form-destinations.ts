export type FormDestination = {
  key: string;
  label: string;
  paths: string[];
};

export const FORM_DESTINATIONS: FormDestination[] = [
  { key: 'home', label: 'Home Page', paths: ['/'] },
  { key: 'demo', label: 'Demo / Get Now', paths: ['/demo'] },
  { key: 'products', label: 'Products Hub', paths: ['/products'] },
  { key: 'silver', label: 'TallyPrime Silver', paths: ['/products/silver'] },
  { key: 'gold', label: 'TallyPrime Gold', paths: ['/products/gold'] },
  { key: 'server', label: 'Tally Server', paths: ['/products/server'] },
  { key: 'tallydrive', label: 'TallyDrive', paths: ['/products/tallydrive'] },
  { key: 'tallycapital', label: 'TallyCapital', paths: ['/products/tallycapital'] },
  { key: 'cloud', label: 'Cloud Hub', paths: ['/cloud'] },
  { key: 'aws', label: 'AWS Cloud', paths: ['/cloud/aws'] },
  { key: 'windows', label: 'Windows Cloud', paths: ['/cloud/windows'] },
  { key: 'nosky', label: 'NoSky Cloud', paths: ['/cloud/nosky'] },
  { key: 'tallycloudaccess', label: 'Tally Cloud Access', paths: ['/cloud/tallycloudaccess'] },
  { key: 'services', label: 'Services Hub', paths: ['/services'] },
  { key: 'tss', label: 'TSS Service', paths: ['/services/tss'] },
  { key: 'tdl', label: 'TDL Service', paths: ['/services/tdl'] },
  { key: 'whatsapp', label: 'Tally on WhatsApp', paths: ['/services/tally-on-whatsapp'] },
  { key: 'amc', label: 'AMC Service', paths: ['/services/amc'] },
  { key: 'corporate-training', label: 'Corporate Training', paths: ['/services/corporate-training'] },
  { key: 'mobile-app-biz', label: 'Mobile App Biz', paths: ['/services/mobile-app-biz'] },
  { key: 'hrms', label: 'HRMS', paths: ['/hrms'] },
  { key: 'do-more', label: 'Do More', paths: ['/do-more'] },
  { key: 'modules', label: 'Modules', paths: ['/modules'] },
];

export const KNOWN_DESTINATION_KEYS = FORM_DESTINATIONS.map((d) => d.key);

export function getDestinationFromPath(pathname: string | null | undefined): string | undefined {
  const path = (pathname || '').replace(/\/+$/, '') || '/';
  const match = FORM_DESTINATIONS.find((d) => d.paths.includes(path));
  return match?.key;
}
