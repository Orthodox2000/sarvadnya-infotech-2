// CHANGE: 2026-11-25 — EMERGENCY CPU MITIGATION.
// WHY: Vercel Active CPU stayed near 85% for the month. The site chrome (NewsFeed in the
// (site) layout) and the homepage read settings/news/partners/reviews/FAQ on EVERY render,
// and the client components then re-fetched /api/* when their initialData was absent.
// This is a committed snapshot of the LIVE public content, taken read-only from the
// production cluster on 2026-11-25. Nothing here is invented — titles, reviews, FAQ copy,
// phone/email/address and social URLs are byte-for-byte what the site served that day.
//
// TRADE-OFF (owner accepted): admin edits to news / reviews / FAQ / partners / settings no
// longer appear on the homepage, newsbar, contact page or footer until this file is
// regenerated. The API routes and DB writes are untouched; only these read paths are
// bypassed. To refresh, re-run the read-only snapshot and replace the arrays below.
//
// SECRETS: only the public NEXT_PUBLIC_* contact fields are included. GROQ/GEMINI keys,
// recipient maps, CC config and all other settings values are deliberately NOT copied.

import type { NewsItem } from './news';
import type { Review } from './reviews';
import type { Partner } from './partners';
import type { SiteSettingsShape } from './site-settings';

/** Fields the ticker actually renders — no article body needed on every page. */
export type TickerNews = Pick<NewsItem, 'title' | 'description' | 'slug' | 'date'>;

export const STATIC_NEWS: TickerNews[] = [
    {
        slug: 'tally-custom-modules-supply-chain',
        title: 'Tally Custom Modules for Supply Chain: What a TDL Module Can Do',
        date: 'October 26, 2026',
        description: 'How a Tally TDL module fits around transport, container handling, clearing and forwarding, and warehousing - and when it beats a spreadsheet.',
    },
    {
        slug: 'tallyprime-silver-gold-server-difference',
        title: 'TallyPrime Silver vs Gold vs Server: Which Edition Fits Your Team?',
        date: 'October 26, 2026',
        description: 'TallyPrime Silver, Gold and Server compared: single user, multi-user on a local network, and client-server - so you buy the edition your team will actually use.',
    },
    {
        slug: 'tally-prime-rental-vs-perpetual-licence',
        title: 'TallyPrime Rental vs Perpetual Licence: Which One Should You Buy?',
        date: 'October 26, 2026',
        description: 'Perpetual or rental TallyPrime licence: what each one buys, what happens when the term ends, and where TSS fits in. A plain comparison for Indian businesses.',
    },
    {
        slug: 'document-management-system-for-tally',
        title: 'Document Management System in TallyPrime: Find Documents in Seconds',
        date: 'October 23, 2026',
        description: 'Attach, open and email any document inside TallyPrime. Bills, challans and certificates stay linked to their voucher or master, audit-ready in one click.',
    },
    {
        slug: 'how-to-renew-tally-tss-offline',
        title: 'How to Renew Tally TSS Offline: Steps, Requirements & When to Contact Us',
        date: 'October 22, 2026',
        description: 'Guide to renewing Tally Software Services (TSS) offline when online renewal is not possible - the process, the serial number you need, and how a Tally partner can help.',
    },
    {
        slug: 'what-is-tally-capital',
        title: 'What Is TallyCapital? Business Loans for TallyPrime Users Explained',
        date: 'October 13, 2026',
        description: "Tally Capital, or TallyCapital, is the Tally group's business-loan service for existing Tally customers, applied for in TallyPrime. What approval depends on.",
    },
    {
        slug: 'how-to-add-gst-number-in-tally-erp-9',
        title: 'How to Add a GST Number in Tally ERP 9 (and Change It Later)',
        date: 'October 13, 2026',
        description: 'How to add a GST number (GSTIN) in Tally ERP 9: enable GST, open GST Details, set party GSTIN - and how to change it later. Why TSS status matters.',
    },
    {
        slug: 'how-to-check-tss-expiry-date-tallyprime',
        title: 'How to Check the TSS Expiry Date in TallyPrime',
        date: 'October 7, 2026',
        description: 'How to check the TSS expiry date in TallyPrime: F1 (Help) > Settings > License > Manage License, what the coverage end date means, and when to renew.',
    },
    {
        slug: 'tallyprime-international-licenses',
        title: 'Using TallyPrime Outside India: International Licenses Explained',
        date: 'October 2, 2026',
        description: 'A domestic Indian TallyPrime license is not designed to keep working abroad; a permanent move needs an international edition. Options by region.',
    },
    {
        slug: 'tally-partner-near-me',
        title: 'Tally Partner Near Me: How to Find and Verify a Certified Tally Partner',
        date: 'September 7, 2026',
        description: 'Searching "tally partner near me"? Here is a repeatable way to find and verify a certified Tally partner in Mumbai, Navi Mumbai and Belapur - and the questions to ask.',
    },
    {
        slug: 'tally-5-star-partner-mumbai',
        title: 'Tally Partner Tiers in Mumbai: 3 Star vs 5 Star, What the Certification Means',
        date: 'September 6, 2026',
        description: 'Tally partner tiers explained: what 3 star and 5 star certification mean, how to verify the tier, and why an honest 3 star Tally partner in Mumbai can fit.',
    },
    {
        slug: 'tally-tss-expiry-meaning',
        title: 'TSS in Tally: What It Means, Why It Expires, and How to Renew',
        date: 'September 5, 2026',
        description: "TSS means Tally Software Services, the yearly subscription that keeps TallyPrime current. What 'TSS has expired' means, and what a renewal restores.",
    },
];

/** The four reviews currently serving the live review wall (no rating invented). */
export const STATIC_REVIEWS: Review[] = [
    {
        name: 'Ashok Kumar',
        rating: 4,
        text: 'Always get quick response and solutions from the team. The staff is very polite and helpful, clearing all our doubts. Keep doing this to work well with your clients, it will be easy to work with you. Thanks for your support.',
        date: '6 Months ago',
    },
    {
        name: 'Sahil Salunke',
        rating: 5,
        text: 'Great service from Sarvadnya Infotech LLP. They helped us quickly with our Tally TSS renewal. The process was smooth and hassle-free.',
        date: '7 Months ago',
    },
    {
        name: 'CA Mohan Nagarkar',
        rating: 5,
        text: 'Thank you for your prompt support system. Keep it up.',
        date: '2 months ago',
    },
    {
        name: 'Avishkar Enterprises',
        rating: 4,
        text: '"Happy to connect with tally prime thru Sarvadnya Infotech LLP. Staff is very polite and helpful. In any trouble in tally received help in one single call and resolve the problem. Thank you"',
        date: '2 year ago',
    },
];

/** Canonical brand row — same order getPartners('brand') reconciles to (lib/partners.ts). */
export const STATIC_PARTNERS: Partner[] = [
    { name: 'AWS', imageUrl: '/PartnerBrands/AWS.png' },
    { name: 'Biz Analyst', imageUrl: '/PartnerBrands/BizAnalyst.png' },
    { name: 'TallyPrime', imageUrl: '/tallyprime logo.png' },
    { name: 'OTU', imageUrl: '/PartnerBrands/OTU.png' },
    { name: 'NoSky', imageUrl: '/PartnerBrands/Nosky.webp' },
];

/** Live `site_content.home_faq` document, unchanged. */
export const STATIC_HOME_FAQ: { question: string; answer: string; category: string }[] = [
    {
        question: 'What is the difference between TallyPrime Silver, Gold, and Server products?',
        answer: 'TallyPrime Silver is a single-user license ideal for small businesses. Gold supports up to 5 concurrent users with additional features. Server is an enterprise product that enhances concurrency with multi-threaded architecture, delivers better speed and performance, provides a complete activity log, and strengthens data security. Our team can help you choose the right product based on your business size and requirements.',
        category: 'Products',
    },
    {
        question: 'Can I upgrade from Tally.ERP 9 to TallyPrime?',
        answer: 'Yes, upgrading is simple if you have an active TSS. We can assist you in migrating your data safely to TallyPrime, ensuring all your previous records are preserved while you enjoy the new, enhanced user experience with improved performance and modern interface.',
        category: 'Products',
    },
    {
        question: 'What is TallyDrive and how does it help my business?',
        answer: 'TallyDrive is our automated cloud backup solution that continuously backs up your Tally data to secure cloud storage. It ensures zero data loss, provides instant recovery options, and allows you to access your data from anywhere. It runs silently in the background without disrupting your work.',
        category: 'Products',
    },
    {
        question: 'Do you offer customized Tally modules for specific industries?',
        answer: 'Absolutely. We specialize in building custom Tally modules for industries like C&F, Transport, Society Management, Garment, and Sales. These modules integrate seamlessly with TallyPrime to automate your unique workflows, generate industry-specific reports, and reduce manual data entry.',
        category: 'Products',
    },
    {
        question: 'What are the system requirements for TallyPrime?',
        answer: 'TallyPrime requires Windows 7 or later, minimum 4GB RAM (8GB recommended), and 2GB free disk space. For optimal performance, we recommend a modern processor, SSD storage, and a stable internet connection for cloud features and updates. Our team can verify compatibility before installation.',
        category: 'Products',
    },
    {
        question: 'What is included in your AMC plan?',
        answer: "Our Annual Maintenance Contract (AMC) includes priority support, regular system health checks, data backup assistance, unlimited remote troubleshooting, and access to Tally updates. It ensures your accounting operations never stop due to technical glitches. Beyond troubleshooting, each AMC period boosts your team's efficiency as you gain deeper knowledge and better command over Tally and accounts through ongoing expert guidance.",
        category: 'Services',
    },
    {
        question: 'Do you provide on-site support for technical issues?',
        answer: "Yes, we provide both remote and on-site support. Our 'Never Deny Service Call' policy ensures that we respond to every customer request promptly. For critical issues that cannot be resolved remotely, our certified technicians will visit your premises to resolve the problem.",
        category: 'Services',
    },
    {
        question: "What is your 'Never Deny Service Call' policy?",
        answer: 'It is our commitment to customer satisfaction. We guarantee that no service call will be turned away. Regardless of the complexity of the issue or the time of the request, our team will acknowledge and provide a path to resolution for every client within 15 minutes.',
        category: 'Services',
    },
    {
        question: 'What services do you provide for TallyPrime?',
        answer: 'We offer end-to-end TallyPrime services including license sales, implementation, customization, data synchronization, troubleshooting, annual maintenance contracts (AMC), Tally consultancy, and business training. Whether you need help choosing the right product, optimizing your workflows, or training your team, our experts ensure your business runs smoothly.',
        category: 'Services',
    },
    {
        question: 'Do you offer TallyPrime training for my team?',
        answer: "Yes, we provide comprehensive training for TallyPrime including basic accounting, advanced features, GST compliance, E-invoicing, and custom module usage. Training is available both on-site and remotely, tailored to your team's skill level and business requirements.",
        category: 'Services',
    },
    {
        question: 'Can you help with Tally cloud hosting and setup?',
        answer: 'Absolutely. We offer Tally on Cloud solutions including AWS-hosted Tally, Windows Tally Cloud, and Backup for Tally cloud backup. We handle the complete setup, security configuration, user management, and provide 24/7 access to your Tally data from any device, anywhere.',
        category: 'Services',
    },
    {
        question: 'How does Tally on Cloud work?',
        answer: 'Tally on Cloud serves the Tally Desktop Application over the internet. With proper connectivity, users can access Tally with their credentials using an RDP client from any device. Our admin panel lets you manage users, data, printers, and backups easily and securely.',
        category: 'Technical',
    },
    {
        question: 'Is TallyPrime GST compliant?',
        answer: 'Absolutely. TallyPrime is designed to be fully GST compliant, helping you generate GSTR-1, GSTR-3B, and GSTR-9 reports easily. It also supports E-invoicing and E-way bill generation directly from the software. With a valid TSS, you can now file GSTR-1, reconcile IMS, and manage all GST returns directly from within TallyPrime.',
        category: 'Technical',
    },
    {
        question: 'How does E-invoicing work in TallyPrime?',
        answer: 'TallyPrime has built-in E-invoicing support that generates IRN (Invoice Reference Number) directly from the software. It automatically validates invoices against IRP, generates QR codes, and supports real-time E-way bill generation. This eliminates manual data entry and reduces errors.',
        category: 'Technical',
    },
    {
        question: 'Can I access Tally reports on my mobile device?',
        answer: "Yes. With a valid TSS, the built-in Tally on Mobile feature lets you view balance sheets, profit & loss statements, stock summaries, and key reports on mobile phones, tablets, and any browser-enabled device. If you don't have an active TSS, we also offer alternative solutions to access Tally features on mobile and other devices — contact us to explore the best option for your setup.",
        category: 'Technical',
    },
    {
        question: "What happens if I don't upgrade to TallyPrime?",
        answer: 'Support for Tally.ERP 9 will continue, but you will miss out on the latest features, improved performance, enhanced security, and advanced capabilities like E-invoicing and direct E-way bill generation. Upgrading ensures you stay compliant and get the best experience.',
        category: 'Technical',
    },
    {
        question: 'What are your business hours?',
        answer: 'Our business hours are Monday to Saturday from 9:30 AM to 6:30 PM. For existing AMC clients, we provide extended support until 8:00 PM. Emergency support is available 24/7 for critical issues through our priority support line.',
        category: 'Contact',
    },
    {
        question: 'How can I contact support for urgent issues?',
        answer: "For urgent support, you can call us directly at our support hotline, send a WhatsApp message, or raise a ticket through our client portal. Our 'Never Deny Service Call' policy ensures your urgent query receives immediate attention regardless of the channel.",
        category: 'Contact',
    },
    {
        question: 'What is the typical response time for support queries?',
        answer: 'Our support team typically responds within 15 minutes during business hours. For critical issues, we provide priority response within 5 minutes. Email queries are answered within 2-4 hours. We pride ourselves on being one of the fastest-responding Tally partners.',
        category: 'Contact',
    },
    {
        question: 'Do you have a physical office I can visit?',
        answer: 'Yes, we are located in Navi Mumbai. You can visit our office during business hours for in-person consultations, Tally demonstrations, and support. We recommend scheduling an appointment beforehand to ensure our expert team is available to assist you.',
        category: 'Contact',
    },
    {
        question: 'How do I get a quote for Tally products and services?',
        answer: 'You can request a quote by calling us, sending an email, or filling out the contact form on our website. Our sales team will understand your requirements and provide a customized quote within 24 hours. We offer competitive pricing with discounts for multi-year subscriptions.',
        category: 'Contact',
    },
];

/** Public contact fields only — the live `settings` map, snake_case (see lib/site-settings.ts). */
export const STATIC_SITE_SETTINGS: SiteSettingsShape = {
    support_phone: '9821309060',
    whatsapp_phone: '9870942557',
    support_email: 'info@sarvadnyainfotech.com',
    office_address: '73, Vindhya Commercial Premises, Sector - 11, Plot No - 1, CBD Belapur, Mumbai, Maharashtra',
    facebook_url: 'https://www.facebook.com/people/Suman-Sawant/pfbid02fQZB9QyH59fPFffaWDfHKWhpp9mZjBSKN5x3T2zYUbgcpWW49LDAAy8Eiutqfs97l/',
    // CHANGE: 2026-11-26 — owner: Instagram handle is now @sarvadnya_infotech everywhere.
    instagram_url: 'https://www.instagram.com/sarvadnya_infotech/',
    linkedin_url: 'https://www.linkedin.com/company/sarvadnya-infotech-llp/',
    youtube_url: 'https://www.youtube.com/@sarvadnyainfotechtally',
    facebook_handle: '',
    instagram_handle: '@sarvadnya_infotech',
    linkedin_handle: 'Sarvadnya Infotech LLP',
    youtube_handle: '@sarvadnyainfotechtally',
    map_iframe_url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.0495924708366!2d73.04104427400503!3d19.01753625380763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3b5e4594221%3A0x44cc14636d30f166!2sSarvadnya%20Infotech%20LLP!5e0!3m2!1sen!2sin!4v1779446531346!5m2!1sen!2sin" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
};

/** Live modules collection (id + title) — footer's "Customized Modules" column. */
export const STATIC_FOOTER_MODULES: { id: string; title: string }[] = [
    { id: 'cf-agencies', title: 'CFA Module' },
    { id: 'housing-societies', title: 'Housing Society Module' },
    { id: 'sales-commission', title: 'SalesMan / Agent Module' },
    { id: 'logistics-transport', title: 'Transport Module' },
    { id: 'container-handling', title: 'Container Handling Module' },
    { id: 'garment-retail', title: 'Garment / Footwear Sales Module' },
];
