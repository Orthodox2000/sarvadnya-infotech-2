import type { ReactNode } from 'react';
import Image from 'next/image';
import { SITE_BASE } from '@/lib/api';
import EnquiryForm from './components/EnquiryForm';
import ChatWidget from './components/ChatWidget';

const WHATSAPP_URL = 'https://wa.me/919821309060';

type SvgProps = { className?: string };

function Svg({ className, children }: SvgProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons = {
  tally: (
    <Svg className="h-6 w-6">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </Svg>
  ),
  shield: (
    <Svg className="h-6 w-6">
      <path d="M12 3 5 6v5c0 4.4 3 7.9 7 10 4-2.1 7-5.6 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  cloud: (
    <Svg className="h-6 w-6">
      <path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.5A3.8 3.8 0 0 0 7 19h10.5Z" />
    </Svg>
  ),
  backup: (
    <Svg className="h-6 w-6">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
    </Svg>
  ),
  whatsapp: (
    <Svg className="h-6 w-6">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
      <path d="M8.5 9.5c0 4 4 6 6 5.5l1-1-2-1.5-1 .5c-1.3-.6-2.5-1.8-2.5-3l.5-1.5-1.5-1.5-1 1Z" />
    </Svg>
  ),
  module: (
    <Svg className="h-6 w-6">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  ),
  hrms: (
    <Svg className="h-6 w-6">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </Svg>
  ),
  training: (
    <Svg className="h-6 w-6">
      <path d="M2 4h14v12H2z" />
      <path d="M16 8h4v8H9" />
      <path d="m6.5 6.5 2 2-2 2M10.5 10.5H8" />
    </Svg>
  ),
  phone: (
    <Svg className="h-5 w-5">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </Svg>
  ),
  mail: (
    <Svg className="h-5 w-5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </Svg>
  ),
  pin: (
    <Svg className="h-5 w-5">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  ),
  clock: (
    <Svg className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  ),
  check: (
    <Svg className="h-5 w-5">
      <path d="m5 13 4 4L19 7" />
    </Svg>
  ),
  arrow: (
    <Svg className="h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  ),
};

const services = [
  { icon: icons.tally, title: 'TallyPrime Setup & Licensing', desc: 'Licensed TallyPrime Silver, Gold & Server editions configured the right way for your business.', href: '/products' },
  { icon: icons.shield, title: 'Annual Maintenance (AMC)', desc: 'Priority support with a 15-minute response SLA — issues solved before they cost you a day.', href: '/services/amc' },
  { icon: icons.cloud, title: 'Tally on Cloud', desc: 'Access Tally from anywhere, on any device, on secure AWS & Windows cloud infrastructure.', href: '/cloud' },
  { icon: icons.backup, title: 'TallyDrive Cloud Backup', desc: 'Automated, encrypted offsite backup so your accounting data is never lost.', href: '/products/tallydrive' },
  { icon: icons.whatsapp, title: 'Tally on WhatsApp', desc: 'Send invoices, ledgers and payment reminders to customers straight from Tally — officially.', href: '/services/tally-on-whatsapp' },
  { icon: icons.module, title: 'TDL & Custom Modules', desc: 'Custom reports, automation and workflows built for the way your business actually works.', href: '/services/tdl' },
  { icon: icons.hrms, title: 'HRMS', desc: 'Payroll, attendance and employee management that plugs into your Tally data.', href: '/hrms' },
  { icon: icons.training, title: 'Corporate Training', desc: 'Hands-on training that gets your team productive in Tally — no guesswork.', href: '/services/corporate-training' },
];

const products = [
  { title: 'TallyDrive', tag: 'CLOUD BACKUP', desc: 'Always-on encrypted backup of your company data. Restore in minutes, never lose a day of work.', href: '/products/tallydrive' },
  { title: 'TallyCapital', tag: 'WORKING CAPITAL', desc: 'Unlock working capital against your Tally data and grow without waiting on payments.', href: '/products/tallycapital' },
  { title: 'TallyPrime', tag: 'LICENSING', desc: 'Silver, Gold & Server — the official TallyPrime line, licenced and supported by us.', href: '/products' },
];

const whyUs = [
  { title: 'Certified Tally Partner', desc: 'Authorised Tally partner with deep, current product knowledge.' },
  { title: 'Trusted since 2008', desc: '1500+ businesses rely on us for daily Tally operations.' },
  { title: '15-minute AMC SLA', desc: 'Dedicated support response — because downtime is expensive.' },
  { title: 'Transparent consultancy', desc: 'Honest recommendations on what to buy, not a sales pitch.' },
];

const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
];

function SectionHeading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{kicker}</p>
      <h2 className="font-playfair text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-base text-slate-500">{sub}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Sarvadnya Infotech LLP" width={36} height={36} className="h-9 w-9 object-contain" priority />
            <span className="text-sm font-bold leading-tight text-slate-900">
              Sarvadnya <span className="text-brand-600">Infotech</span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-slate-400">Certified Tally Partner</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-slate-600 transition hover:text-brand-700">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe5b]"
          >
            {icons.whatsapp}
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </header>

      <main id="top">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-100 blur-3xl" />
          <div className="pointer-events-none absolute top-40 -left-24 h-64 w-64 rounded-full bg-sky-100 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-24">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Certified Tally Partner · Trusted Since 2008
              </p>
              <h1 className="font-playfair text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
                Tally that works as hard as <span className="text-brand-600">your business</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                1500+ businesses across India rely on Sarvadnya Infotech for TallyPrime, cloud access,
                WhatsApp automation and round-the-clock support.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700"
                >
                  Enquire Now {icons.arrow}
                </a>
                <a
                  href={`${SITE_BASE}/demo`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
                >
                  Book a Live Demo
                </a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-100 pt-8 sm:max-w-lg">
                {[
                  ['1500+', 'Businesses'],
                  ['2008', 'Partner since'],
                  ['15 min', 'AMC response SLA'],
                ].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-playfair text-2xl font-bold text-brand-700 sm:text-3xl">{num}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-3xl border border-brand-100 bg-white p-2 shadow-xl shadow-brand-100/60">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 p-8 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-200">Why choose us</p>
                  <p className="mt-4 font-playfair text-2xl font-bold leading-snug">
                    "We don't just install Tally — we make it run your business."
                  </p>
                  <div className="mt-8 space-y-3">
                    {['Licensed products, set up right', 'Data backed up & secured', 'Support that answers fast'].map((t) => (
                      <div key={t} className="flex items-center gap-2.5 text-sm text-brand-100">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">{icons.check}</span>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Services ===== */}
        <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <SectionHeading
            kicker="What we do"
            title="Services built around your Tally"
            sub="From licensing to automation — everything your accounting stack needs, under one roof."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <a
                key={s.title}
                href={`${SITE_BASE}${s.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  {s.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Learn more {icons.arrow}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ===== Products ===== */}
        <section id="products" className="scroll-mt-20 bg-gradient-to-b from-brand-50/60 to-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              kicker="Flagship products"
              title="Made to keep your data safe & moving"
              sub="The products businesses actually ask us about, every single week."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {products.map((p) => (
                <a
                  key={p.title}
                  href={`${SITE_BASE}${p.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
                >
                  <span className="mb-4 inline-block w-fit rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    {p.tag}
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{p.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                    Explore {icons.arrow}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Why Us ===== */}
        <section id="why-us" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <SectionHeading
            kicker="The Sarvadnya difference"
            title="Why 1500+ businesses stay with us"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w) => (
              <div key={w.title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-100">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  {icons.check}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{w.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Contact ===== */}
        <section id="contact" className="scroll-mt-20 bg-slate-50 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Contact us</p>
              <h2 className="font-playfair text-3xl font-bold text-slate-900 sm:text-4xl">
                Let's talk about your Tally setup
              </h2>
              <p className="mt-4 text-slate-600">
                Tell us what you need and our team will reach out with honest advice — the same day.
              </p>
              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">{icons.phone}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Call us</p>
                    <a href="tel:+919821309060" className="text-sm text-slate-600 hover:text-brand-700">+91 98213 09060</a>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">{icons.mail}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Email us</p>
                    <a href="mailto:info@sarvadnyainfotech.com" className="text-sm text-slate-600 hover:text-brand-700">info@sarvadnyainfotech.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">{icons.pin}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Visit us</p>
                    <p className="text-sm text-slate-600">Sarvadnya Infotech LLP, Business Hub, Pune, Maharashtra, India</p>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">{icons.clock}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Hours</p>
                    <p className="text-sm text-slate-600">Mon–Sat · 9:30 AM – 7:30 PM · AMC support after hours</p>
                  </div>
                </li>
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe5b]"
              >
                {icons.whatsapp} Chat on WhatsApp
              </a>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-lg font-bold text-slate-900">Send an enquiry</h3>
              <EnquiryForm />
            </div>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Sarvadnya Infotech LLP" width={34} height={34} className="h-8 w-8 object-contain" />
              <span className="text-sm font-bold text-white">
                Sarvadnya <span className="text-brand-400">Infotech</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Certified Tally Partner helping 1500+ businesses run smoother since 2008.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                ['Instagram', 'https://instagram.com/sarvadnyainfotech'],
                ['Facebook', 'https://facebook.com/sarvadnyainfotech'],
                ['LinkedIn', 'https://linkedin.com/company/sarvadnyainfotech'],
              ].map(([label, url]) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-500 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Explore</p>
            <ul className="space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.label}>
                  <a href={n.href} className="transition hover:text-white">{n.label}</a>
                </li>
              ))}
              <li>
                <a href={`${SITE_BASE}/about`} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">About Us</a>
              </li>
              <li>
                <a href={`${SITE_BASE}/tutorials`} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Tutorials</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Get in touch</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="tel:+919821309060" className="transition hover:text-white">+91 98213 09060</a>
              </li>
              <li>
                <a href="mailto:info@sarvadnyainfotech.com" className="transition hover:text-white">info@sarvadnyainfotech.com</a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">WhatsApp Us</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Sarvadnya Infotech LLP. All Rights Reserved.
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
