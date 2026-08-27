import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Backup for Tally",
  description: "A secure, scalable cloud backup and disaster recovery solution for TallyPrime — automated backups, centralized management, and instant 1-Click restore.",
  path: "/cloud/backup-for-tally",
  keywords: ["backup for tally", "tally cloud backup", "tally backup", "tally data backup", "disaster recovery tally", "tallydrive backup"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}