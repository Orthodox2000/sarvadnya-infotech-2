export type EmailLogo =
  | { cid: string; data?: never; url?: never }
  | { data: string; cid?: never; url?: never }
  | { url: string; cid?: never; data?: never }
  | null
  | undefined;

export interface EmailBrandCompany {
  name?: string;
  tagline?: string;
  website?: string;
  email?: string;
  phoneLines?: string[];
  address?: string;
}

export const EMAIL_LOGO_WIDTH: number;
export const EMAIL_LOGO_HEIGHT: number;

export function brandLogoSrc(logo: EmailLogo, company?: EmailBrandCompany): string;
export function renderBrandHeader(options?: {
  company?: EmailBrandCompany;
  logo?: EmailLogo;
}): string;
export function renderBrandFooter(options?: {
  company?: EmailBrandCompany;
  footerHtml?: string;
}): string;
