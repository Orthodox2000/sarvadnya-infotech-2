// CHANGE: 2026-10-26 — SEO layer 2: free TSS expiry checker (owner-requested free tool).
// WHAT: a server-rendered page that hosts one small client widget; all the explanatory
// content (where the date lives, what stops, how to renew) is static HTML so it is crawlable
// and cannot drift into invented behaviour. WHY: it is a genuinely useful answer to a real
// query, and every fact on it is already published in our TSS guides.
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../../components/Footer";
import TssExpiryChecker from "./TssExpiryChecker";
import { breadcrumbJsonLd, faqPageJsonLd, seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
  title: "TSS Expiry Checker for TallyPrime",
  description:
    "Enter your TSS coverage end date to see the days left, what keeps working and what stops when TSS expires.",
  path: "/tools/tss-expiry-checker",
  keywords: [
    "tss expiry checker",
    "tally tss expiry date",
    "how many days left tss",
    "tss renewal tallyprime",
    "tss expired",
  ],
});

// CHANGE: 2026-10-26 — every answer below is the audited TSS wording used in
// lib/sara-topics.ts and the news guides. Do not add day counts, discounts or "bonus
// validity" claims here: Tally does not publish them.
const FAQS = [
  {
    q: "Where do I find my TSS expiry date in TallyPrime?",
    a: "In TallyPrime press F1 (Help) > Settings > License > Manage License. That screen shows the licence and the TSS coverage end date. The Alt+R (Manage TSS Renewal) shortcut on the Gateway of Tally appears only when your renewal is due, so Manage License is the screen to use at any other time.",
  },
  {
    q: "Does Tally stop working when TSS expires?",
    a: "Your data stays safe and offline data entry keeps working. What stops is the connected side of TSS: e-invoicing and e-way bill generation, GST filing and the GSTR-2A/2B download, bank payments and auto bank reconciliation, and Remote Access / WhatsApp reports.",
  },
  {
    q: "How do I renew TSS?",
    a: "From the Gateway of Tally press Alt+R (Manage TSS Renewal) when it is shown, or open F1 (Help) > Settings > License > Manage License and press F9 (Renew TSS). Tally opens the Tally Solutions renewal page, where you choose 1 Year or 2 Years, enter the billing details and the serial number, and pay. After payment, update the licence from Manage License so TallyPrime shows the new coverage end date.",
  },
  {
    q: "Is this checker official, and is my date stored?",
    a: "No and no. This is a calculator from Sarvadnya Infotech LLP, not a Tally service, and it only does arithmetic on the date you type. The date never leaves your browser: nothing is uploaded, saved or tracked. The authoritative date is always the one shown in Manage License inside TallyPrime.",
  },
  {
    q: "What about Tally.ERP 9?",
    a: "TSS renewal for Tally.ERP 9 was discontinued for all customers from 16 August 2026, so there is nothing left to renew on ERP 9. That path is an upgrade to TallyPrime.",
  },
];

const KEEPS_WORKING = [
  "Offline data entry for sales, purchase, receipts, payments and journals",
  "Your existing company data — it stays on your machine and stays safe",
  "Reports and printing from the data you already have",
];

const STOPS = [
  "E-invoicing and e-way bill generation / cancellation",
  "GST return filing and the GSTR-2A / 2B download",
  "Bank payments and auto bank reconciliation",
  "Remote Access and WhatsApp reports",
  "New TallyPrime releases and statutory updates for the period you did not renew",
];

export default function TssExpiryCheckerPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: "TSS Expiry Checker", path: "/tools/tss-expiry-checker" },
  ]);
  const faq = faqPageJsonLd(FAQS);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          <Link href="/" className="hover:text-[#006569]">Home</Link>
          <span aria-hidden className="px-1.5">/</span>
          <Link href="/tools" className="hover:text-[#006569]">Tools</Link>
          <span aria-hidden className="px-1.5">/</span>
          <span className="text-[#006569]">TSS Expiry Checker</span>
        </nav>

        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">TSS expiry checker</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          Type the coverage end date that TallyPrime shows and this page tells you how many days of TSS you have
          left — or how long ago it lapsed — plus exactly what keeps working and what stops. Free, no sign-up,
          and your date never leaves the browser.
        </p>

        <div className="mt-7">
          <TssExpiryChecker />
        </div>

        <section className="mt-10" aria-labelledby="what-works">
          <h2 id="what-works" className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            What keeps working and what stops
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
            TSS is the annual subscription that keeps a TallyPrime licence current. When it lapses, the split is
            simple: your data and offline work continue, the connected services stop.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E5F4F4] bg-[#FBFAF6] p-5">
              <h3 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#006569]">Keeps working</h3>
              <ul className="mt-3 space-y-2">
                {KEEPS_WORKING.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-slate-700">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#006569] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-5">
              <h3 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B45309]">Stops</h3>
              <ul className="mt-3 space-y-2">
                {STOPS.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-slate-700">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#B45309] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-slate-600">
            <strong className="font-bold text-slate-900">Perpetual or rental?</strong> A perpetual TallyPrime
            licence keeps working after TSS expires, exactly as described above. A rental licence also ends when
            its own rental period ends, so check the same Manage License screen for the licence period, not just
            the TSS date.
          </p>
        </section>

        <section className="mt-10" aria-labelledby="how-to-renew">
          <h2 id="how-to-renew" className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            How to renew
          </h2>
          <ol className="mt-3 space-y-2.5">
            {[
              "From the Gateway of Tally, press Alt+R (Manage TSS Renewal) — this option appears when your renewal is due.",
              "Or open F1 (Help) > Settings > License > Manage License and press F9 (Renew TSS).",
              "Tally opens the Tally Solutions renewal page: choose 1 Year or 2 Years, enter the billing details and the serial number, and pay.",
              "After payment, update the licence from Manage License so TallyPrime shows the new coverage end date.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 text-[13px] leading-relaxed text-slate-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[#E5F4F4] text-[#006569] text-[11px] font-extrabold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[13px] leading-relaxed text-slate-600">
            If the option is not visible on your screen, or you would rather we handled it, share the serial
            number with our team —{" "}
            <Link href="/services/tss" className="font-bold text-[#006569] underline decoration-[#B8DEDE] underline-offset-2 hover:decoration-[#006569]">
              we renew TSS for businesses across India
            </Link>
            . On Tally.ERP 9 there is nothing left to renew: TSS renewal was discontinued for all customers from
            16 August 2026, so the path there is an{" "}
            <Link href="/news/tally-tss-renewal-2026" className="font-bold text-[#006569] underline decoration-[#B8DEDE] underline-offset-2 hover:decoration-[#006569]">
              upgrade to TallyPrime
            </Link>
            .
          </p>
        </section>

        <section className="mt-10" aria-labelledby="tool-faqs">
          <h2 id="tool-faqs" className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Questions about this checker
          </h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((item) => (
              <div key={item.q} className="rounded-2xl border border-[#E9F1FA] bg-white p-5">
                <h3 className="text-[15px] font-bold tracking-tight text-slate-900">{item.q}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#006569] p-5 text-white">
            <h2 className="text-[15px] font-bold">Renew TSS with us</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">
              Share the serial number and we renew it, then confirm the new coverage end date in writing.
            </p>
            <Link
              href="/services/tss"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#006569] transition-colors hover:bg-[#E5F4F4]"
            >
              TSS renewal
            </Link>
          </div>
          <div className="rounded-2xl border border-[#E9F1FA] bg-[#FBFAF6] p-5">
            <h2 className="text-[15px] font-bold text-slate-900">Prefer to read first?</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
              The guide explains what TSS actually covers, the renewal screen, and the rental-versus-perpetual
              difference.
            </p>
            <Link
              href="/learn-sara/tss-renewal-and-subscription"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#006569] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#006569] transition-colors hover:bg-[#E5F4F4]"
            >
              Read the TSS guide
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
