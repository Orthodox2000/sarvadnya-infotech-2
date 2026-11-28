// CHANGE: 2026-08-31 - Seed keyword-targeted blog posts into the shared `news` collection.
// Converts the news section into an SEO blog. Targeting the winnable queries from Search Console:
//   - Tally-product queries: tally partner mumbai, tally erp 9 add ons,
//     tally tss renewal, tally 3 star partner mumbai, cloud tally in {city}
//   - Local SEO: it companies in belapur, software companies in navi mumbai, cbd belapur
// Each post uses an explicit clean `slug` + the legacy admin fields (title/date/category/
// description/content/link) so the frontend blog (/news/[slug]) renders it with zero admin changes.
//
// Idempotent: upserts by slug - existing docs are left untouched, so this never clobbers posts
// created/edited from the admin panel.
//
// CHANGE: 2026-09-07 - added 6 local-keyword posts (tally-5-star-partner-mumbai, tally-partner-near-me,
// tally-hrms-software, tally-tss-expiry-meaning, tally-cloud-access, cbd-belapur-it-companies-list)
// and retitled 2 weak-ranking posts (tally-erp9-add-ons, tally-partner-mumbai)
// for exact-match + CTR. All content kept ASCII-only.
// CHANGE: 2026-09-07 (user correction) - Sarvadnya is a 3 star partner: tally-5-star-partner-mumbai
// repositioned as an honest "3 star vs 5 star" tier guide (states our tier plainly, no 5-star claim),
// and tally-3-star-partner-mumbai CTA now names the 3 star credential explicitly.
// CHANGE: 2026-09-16 - removed tally-dealers-mumbai (per owner: keep news professional, no "dealer"
// branding), scrubbed "dealer" tags across remaining posts, made the upsert comparison include `tags`
// so tag-only edits propagate, and added REMOVE_SLUGS so slugs dropped from this file also get deleted
// from the collection (keeps the blog professional and in sync with the seed).
// CHANGE: 2026-09-17 - TSS-renewal body copy no longer limits coverage to specific cities;
// now says "anywhere in India" per owner (local stays in titles/keywords only).
// CHANGE: 2026-11-28 - owner: remove generic partner/city/list posts, KEEP the how-to and
// document-management posts (the best performers), and add bank-statement import + Excel-to-Tally
// import articles that link to the existing /shop deep links. The retired objects are kept in
// ALL_POSTS for the record but filtered out of `posts`, and their slugs are sent to REMOVE_SLUGS
// when the seed runs so the live collection and the 301s in next.config.js stay in step.
//
// Run:  node scripts/seed_news.mjs   (MONGODB_URI from .env)

import { MongoClient } from 'mongodb';
import 'dotenv/config';
import { pathToFileURL } from 'node:url';

// CHANGE: 2026-11-28 — generic partner/city/list posts retired by owner. How-to attach data,
// document management and the other task-based guides are deliberately NOT in this list.
const REMOVED_NEWS_SLUGS = [
  'tally-partner-mumbai',
  'tally-erp9-add-ons',
  'tally-3-star-partner-mumbai',
  'cloud-tally-cities-agra-patna-lucknow-mumbai',
  'it-companies-in-belapur',
  'software-companies-in-navi-mumbai',
  'smbs-cbd-belapur-certified-tally-partner',
  'tally-5-star-partner-mumbai',
  'tally-partner-near-me',
  'cbd-belapur-it-companies-list',
];

// CHANGE: 2026-11-03 — exported so maintenance scripts (scripts/update-news-seo.mjs) read the
// SAME title/description values instead of keeping a second copy that silently drifts.
const ALL_POSTS = [
  {
    slug: 'tally-partner-mumbai',
    title: 'How to Choose the Right Tally Partner in Mumbai: Checklist (Star Rating, TSS, AMC)',
    seoTitle: 'Tally Partner in Mumbai: Checklist',
    date: 'August 31, 2026',
    category: 'Tally Partner',
    description: 'A practical checklist for choosing a Tally partner in Mumbai - star certification, TSS renewal, support SLA, cloud backup and add-on capability - plus how to verify a claim.',
    tags: ['tally partner mumbai', 'tally certified partner', 'tally support', 'tally tss renewal'],
    link: '/products',
    author: 'Sarvadnya Infotech LLP',
    content: `Finding the right Tally partner in Mumbai matters more than most businesses expect. A great partner keeps your Tally running through GST changes, TSS renewals and year-end closes. A poor one leaves you stuck for days when a voucher will not reconcile.

Here is the checklist we recommend every Mumbai business run before choosing a Tally partner.

- Confirm their official Tally certification tier (such as 3 star or higher ecosystem partner). Tally prints this against partner credentials - do not rely on a website claim alone.
- Ask how they handle TSS renewal. Your annual Tally Prime / ERP 9 subscription includes updates and support; a good partner makes renewal a one-call job instead of a research project.
- Check the support SLA in writing. Will a small team get help within the business day, or only when someone happens to be free?
- Ask specifically about Tally on Cloud and backup. Data loss is the real cost of a bad partner, so backup and offsite storage should be part of the conversation, not an add-on you have to request.
- Check TDL customisation experience. Every business eventually needs a report or invoice format that is not in the box. Your partner should understand TDL deeply enough to build it.
- Get at least two references from businesses like yours - same software, same firm size.

What local businesses should expect

For companies in Mumbai, Navi Mumbai, Vashi, Belapur and CBD Belapur district, a local partner means same-city response. When your accounts team is mid-closing, a partner who can visit or connect fast is worth more than a cheaper quote from far away.

At Sarvadnya Infotech LLP we have supported Tally for businesses since 2008 - Tally Prime, Tally ERP 9, cloud access, AMC and custom modules. If your current partner is not delivering on the checklist above, talk to us before your next TSS renewal cycle.`,
  },
  {
    slug: 'tally-erp9-add-ons',
    title: 'Tally ERP 9 Add-Ons That Save Hours: 8 TDL Solutions for Indian Businesses',
    seoTitle: 'Tally ERP 9 Add-Ons (8 TDLs)',
    date: 'August 29, 2026',
    category: 'Tally Add-Ons',
    description: '8 practical Tally ERP 9 add-ons (TDL solutions) for invoicing, dispatch, sales and purchase controls - and when custom TDL beats a manual workaround.',
    tags: ['tally erp 9 add ons', 'tally tdl', 'tally customisation', 'tally addons'],
    link: '/addons',
    author: 'Sarvadnya Infotech LLP',
    content: `Tally ERP 9 add-ons are TDL (Tally Definition Language) solutions that add behaviour Tally does not ship by default. The right add-on removes minutes - sometimes hours - of repetitive work from every voucher your team enters.

In our work with Mumbai businesses we see the same handful of requests again and again. Each one is a small add-on with a big payback.

- Auto email sales invoices after save, so customers get copies without anyone chasing
- Discount amount display in sales invoices and registers based on discount percentage
- Party-wise item last sold rate on the sales screen - no more alt-tabbing to old bills
- Block billing beyond due date for customers who exceed their credit terms
- Duplicate purchase blocking by supplier invoice number and GSTIN
- Stock group-wise item display so warehouses find products instantly
- Skip rate field for junior entry operators, and lock sales below last purchase rate
- Additional terms and conditions printed automatically on every sales invoice

Read more in our full add-on catalogue at the /addons page - each is described in plain language with what it changes on screen.

The bigger win is custom TDL. Off-the-shelf add-ons cover common cases; your business has at least one uncommon one. A TDL developer can build it so your invoice prints exactly the columns your customers need, or your stock report matches the way your godown actually works.

If your team is still fixing reports in Excel after Tally exports them, evaluate add-ons before adding headcount. Cutting ten minutes from a screen your team uses two hundred times a day is worth real money - Sarvadnya builds and supports Tally add-ons for businesses across Mumbai, Navi Mumbai and beyond.`,
  },
  {
    // CHANGE: 2026-10-26 — this post was factually wrong in three places, so it is rewritten.
    // (1) It said TSS "keeps Tally Prime and Tally ERP 9 current" and advised ERP 9 owners to
    // "renew at the current rate or pay more later" - TSS renewal on Tally.ERP 9 was
    // discontinued for all customers from 16 August 2026, so that choice no longer exists.
    // (2) The title promised "Pricing Changes" and the body never delivered a single price.
    // (3) The expiry-check step pointed at "the licence and about screen" without a path.
    // Dates and the free-upgrade cutoff below are Tally's own published position.
    // CHANGE: 2026-11-03 — GSC 28d: 59 impressions, 0 clicks, position 6.78. "What Changed" is
    // vague; the change itself (ERP 9 TSS renewal discontinued 16 August 2026) is the hook and
    // is already the article's own first fact.
    slug: 'tally-tss-renewal-2026',
    title: 'Tally TSS Renewal 2026: ERP 9 Renewals Discontinued, What Now',
    seoTitle: 'TSS Renewal 2026: ERP 9 Discontinued',
    date: 'August 28, 2026',
    category: 'TSS & Renewals',
    description: 'TSS renewal on Tally.ERP 9 was discontinued from 16 August 2026. What that means for your licence, who gets a free TallyPrime upgrade, and how to renew.',
    tags: ['tally renewal', 'tally tss', 'tally prime renewal', 'tally tss renewal', 'tally erp 9 tss renewal', 'tally erp 9 upgrade to tallyprime'],
    link: '/services/tss',
    author: 'Sarvadnya Infotech LLP',
    content: `Tally TSS (Tally Software Services) is the annual subscription behind a TallyPrime licence - it keeps the software current with statutory releases, provides the connected services a business actually uses every week, and keeps support available. When TSS lapses, you can still open your data and enter vouchers, but compliance updates and connected features stop.

The 2026 change that matters most is not a price change. It is a closure.

From 16 August 2026, TSS renewal on Tally.ERP 9 has been discontinued for all customers. If you are still running Tally.ERP 9, there is no renewal left to buy - the decision in front of you is an upgrade to TallyPrime, not another year of ERP 9. That changes the arithmetic completely: a business that had budgeted for a renewal now has to budget for a licence, and the earlier that is planned, the less disruptive it is.

Who upgrades free and who pays:

- If your TSS was active on or after 9 November 2020, the upgrade to TallyPrime is free
- If it was not, the upgrade is a paid one, and the amount depends on your edition and user count
- Either way the data file is the same one - the migration is a conversion, not a re-entry, so vouchers and masters come across

What TSS actually keeps running on TallyPrime:

- Statutory releases, so GST, e-invoice and e-way bill changes keep working as the rules change
- Connected services: e-invoicing, e-way bills, GST return filing and GSTR-2A/2B downloads, bank payments and auto bank reconciliation, and mobile or WhatsApp access to reports
- Technical support against a valid serial number
- TallyDrive cloud backup eligibility - the included cloud storage comes with an active subscription

How to check where you stand:

- In TallyPrime, open F1 (Help) > Settings > License > Manage License - the expiry date and the renewal option sit on that screen
- An Alt+R (Manage TSS Renewal) shortcut appears on the Gateway of Tally once your renewal is due
- If you run several machines or companies, list every serial number first so you renew exactly what you need and nothing you have retired

A practical checklist before you renew:

- Confirm the serial number and the edition (Silver single-user, Gold multi-user, Server) for each licence in use
- Check the expiry date, and renew before it lapses - renewing in time avoids a renewal gap
- Keep the GSTIN and billing details ready, because the renewal is raised against them
- If you are on ERP 9, treat it as an upgrade decision and ask for the free-eligibility check before assuming a cost

Sarvadnya Infotech handles TSS renewals and ERP 9 to TallyPrime upgrades for businesses anywhere in India - metro, city or town. We check your serial number, confirm whether the upgrade is free or paid, and handle the migration. If your renewal date is within the next two months, get in touch so nothing stops working while you decide.`,
  },
  {
    slug: 'tally-3-star-partner-mumbai',
    title: 'What to Look for in a Tally 3 Star Partner in Mumbai',
    seoTitle: 'Tally 3 Star Partner in Mumbai',
    date: 'August 30, 2026',
    category: 'Tally Partner',
    description: 'Tally partner tiers explained - what a Tally 3 star partner is, what certification levels mean, and how to verify one in Mumbai.',
    tags: ['tally 3 star partner in mumbai', 'tally partner tier', 'tally certification', 'tally 3 star partner'],
    link: '/services',
    author: 'Sarvadnya Infotech LLP',
    content: `When a firm calls itself a Tally partner, the star rating on their Tally certification tells you how deeply they work with Tally at an official level. Tally runs a tiered partner ecosystem - the star tier reflects ongoing training, certification and engagement with the ecosystem rather than just licence turnover.

A higher tier usually means deeper product knowledge: newer releases, cloud deployment, subscriptions and the ability to get direct support from Tally when a problem is unusual.

- Official partner certification tier - ask to see the partner credential (3 star or higher is a strong signal)
- Tally Prime and ERP 9 current product training, since the product changes every release
- Cloud and hosting capability - an official partner should deploy and support Tally on Cloud
- A support and AMC framework with defined response times
- TDL and customisation depth for reports and invoice formats unique to your business
- A customer base near your stage and industry - mid-size trading, manufacturing, logistics, services

How to verify: Tally lists and verifies its partners; you can also ask the partner for their certified partner page or customer references. A website that only says partner without a tier should be verified before you hand over data or money.

Sarvadnya Infotech is an official Tally certified 3 star partner (since 2008) serving businesses in Mumbai and Navi Mumbai - Tally Prime, ERP 9, TSS renewal, cloud access, AMC and custom modules. If you are comparing partners in Mumbai, we are happy to share our 3 star credential and references from businesses like yours; if you need a higher tier, we will tell you plainly and point you to partners who hold it.`,
  },
  {
    slug: 'cloud-tally-cities-agra-patna-lucknow-mumbai',
    title: 'Cloud Tally Setup in Agra, Patna, Lucknow & Mumbai: Pricing and What to Expect',
    seoTitle: 'Cloud Tally: Setup and Pricing',
    date: 'August 27, 2026',
    category: 'Cloud',
    description: 'Tally on Cloud setup across Indian cities - how remote access, hosting and backup work, what pricing depends on, and the checklist before you switch.',
    tags: ['cloud tally in agra', 'cloud tally in patna', 'cloud tally in lucknow', 'cloud tally in mumbai', 'tally on cloud'],
    link: '/cloud/aws',
    author: 'Sarvadnya Infotech LLP',
    content: `Tally on Cloud lets your accounts team work from anywhere on any device while your data sits on a secure, backed-up server. Businesses everywhere - Agra, Patna, Lucknow, Mumbai, Navi Mumbai - are moving to it because GST and multi-location working make single-PC Tally impractical.

What you should expect from a serious Tally cloud provider.

- Your Tally data hosted on dedicated cloud infrastructure (typically AWS-class) with daily automated backups
- Remote desktop or browser access for every team member you licence - same Tally screens, same menus
- All sessions on the same company file, so junior and senior staff never work on separate copies
- Security: your data is not shared with other clients; access is per-user, logged and revocable
- Setup time measured in a day or two, not weeks - an experienced team migrates your data and trains your staff quickly

What pricing depends on: number of users, storage and backup retention, the Tally edition (Silver / Gold / Server) and whether your provider includes support. Cheap cloud Tally that runs everyone on one shared machine with no backup will cost more when something breaks.

For example, a business migrating in Mumbai may need multi-user gold access plus offsite backup, while a single-controller shop in Agra may only need one-user access with nightly backups. A good provider prices the licence you need, not a bundle you do not.

Sarvadnya Infotech deploys and supports Tally on Cloud - official Tally licenses, AWS-hosted access and automated backups - for businesses in Mumbai, Navi Mumbai, Pune and across cities served remotely. Tell us your city and headcount and we will confirm your suitable setup.`,
  },
  {
    // CHANGE: 2026-11-03 — GSC 28d: 28 impressions at position 14.25 while the sibling post
    // /news/cbd-belapur-it-companies-list holds the same cluster at position 6.52 with 610
    // impressions. Two pages ranking for one query split the signal, so this one is re-scoped to
    // IT *support* and the list post is the canonical answer. No URL change, no content change.
    // RETIRED 2026-11-03 (owner-approved): the re-scope was not enough, so this URL now 301s to
    // /news/cbd-belapur-it-companies-list (next.config.js) and its slug sits in RETIRED_NEWS_SLUGS
    // (lib/news-utils.ts), which fetchNews() filters. The post is deliberately KEPT here so the
    // copy and its _id survive; to bring it back, remove the slug from that list and the redirect,
    // and give it its own topic so it does not re-split the Belapur cluster.
    slug: 'it-companies-in-belapur',
    title: 'IT Companies in Belapur: How Certified Tally Partners Support Navi Mumbai Business',
    seoTitle: 'IT Support Companies in Belapur',
    date: 'August 26, 2026',
    category: 'Local Business',
    description: 'How IT companies in Belapur and Navi Mumbai serve local business - software, accounting automation, cloud and support - and how to pick a partner.',
    tags: ['it companies in belapur', 'belapur it companies', 'it companies in cbd belapur', 'navi mumbai software'],
    link: '/about',
    author: 'Sarvadnya Infotech LLP',
    content: `Belapur and CBD Belapur have grown into a genuine technology hub for Navi Mumbai. IT companies in Belapur serve a customer base that spans trading houses, logistics, manufacturing units and fast-growing service businesses across the region.

What local businesses typically need from an IT partner:

- Accounting software - Tally Prime, ERP 9 and the right edition for their headcount
- Automation - TDL add-ons, import utilities and integration so manual entry shrinks
- Cloud and remote working - Tally on Cloud and secure backup so data is never a single hard drive away
- Hardware and network direction and regular support with an SLA that matches business hours
- Training so the accounts team actually uses the tools they are paying for

For companies in Belapur, Vashi, Kharghar, Nerul and the wider Navi Mumbai belt, a nearby partner means onsite help the same day when a year-end close or payroll run is blocked. That proximity is real value.

Sarvadnya Infotech is based in Belapur, Navi Mumbai - a Tally certified partner since 2008 with 1,500+ customers. We know the accounting and compliance rhythm of Mumbai-Navi Mumbai businesses because we work beside them. If you are scanning IT companies in Belapur for your next Tally or automation decision, we are a short conversation away.`,
  },
  {
    slug: 'software-companies-in-navi-mumbai',
    title: 'Software Companies in Navi Mumbai (Including for Freshers): What to Look For',
    seoTitle: 'Software Companies in Navi Mumbai',
    date: 'August 25, 2026',
    category: 'Local Business',
    description: 'How to evaluate software companies in Navi Mumbai - whether you need an implementation partner for your business or want to start your career.',
    tags: ['software companies in navi mumbai', 'software companies in navi mumbai for freshers', 'it companies in navi mumbai for freshers', 'navi mumbai tech jobs'],
    link: '/careers',
    author: 'Sarvadnya Infotech LLP',
    content: `Navi Mumbai is home to a growing cluster of software companies serving everything from enterprise IT to accounting automation. Two very different audiences search this space - businesses choosing a vendor, and freshers choosing a first employer. Both should ask different questions.

If you are a business choosing a software company in Navi Mumbai:

- Do they sell and support what you use (Tally, cloud, TDL automation) or do they only write code?
- What does implementation look like - do they configure, train and support, or just hand over a licence?
- What happens when something breaks? Define the support agreement before signing.
- Can they reference companies at your stage and in your industry?

If you are a fresher exploring software companies in Navi Mumbai:

- Do they run structured training, or expect you to perform from day one? Tally and business-process skills are teachable; a good company invests in that.
- What technologies will you actually touch - Tally, TDL, accounting automation, web (Next.js, React), cloud?
- Is there mentorship and a defined growth path rather than open-ended task work?
- Compensation frameworks often matter less than the first two years of real exposure to business software.

Sarvadnya Infotech sits at the intersection - a software company in Navi Mumbai that implements Tally, builds custom TDL modules and cloud setups, and runs a structured careers programme with Tally support, IT sales and development roles open. Whether you are hiring software or hiring people, we are part of the Navi Mumbai tech ecosystem you can start from.`,
  },
  {
    // CHANGE: 2026-10-26 — facts corrected. The old body said TallyDrive "works alongside Tally
    // Prime and ERP 9" (it requires TallyPrime 7.0 or later - ERP 9 is not supported) and
    // described restore as "a point in time" without explaining the version retention. It also
    // omitted the two facts a buyer needs most: TallyDrive requires an active TSS, and the
    // cloud copy is retained for 90 days after TSS expires. All figures below are Tally's own.
    slug: 'tallydrive-cloud-backup',
    title: 'TallyDrive Cloud Backup: Why Every Mumbai and Navi Mumbai Business Needs It',
    seoTitle: 'TallyDrive Cloud Backup Explained',
    date: 'August 24, 2026',
    category: 'Cloud Backup',
    description: 'TallyDrive cloud backup explained - automated offsite backup for TallyPrime 7.0 and later, how restores work, the free storage limits and why TSS status matters.',
    tags: ['tallydrive', 'tally cloud backup', 'tallydrive cloud backup', 'tally backup', 'tallyprime cloud backup', 'automatic tally backup'],
    link: '/products/tallydrive',
    author: 'Sarvadnya Infotech LLP',
    content: `A business that loses its Tally data loses its financial memory. One failed hard drive, one ransomware click, one stolen laptop - and ledgers, invoices, balances and customer history are gone. TallyDrive cloud backup exists to make that failure survivable.

What happens when backup is manual is predictable: it is done on Fridays, skipped on busy weeks, and the last good copy is older than anyone wants to admit. Automated cloud backup removes the human step entirely.

What TallyDrive actually is:

- A cloud backup service built into TallyPrime 7.0 and later - it is not available for Tally.ERP 9
- Available while your Tally Software Services (TSS) subscription is active
- Incremental after the first upload: only new or changed data is sent, so daily backups stay quick
- Scheduled by you, and the backup runs from TallyPrime itself
- Stored offsite with a password you set, plus a recovery key to keep separately

What you get on restore:

- A list of saved versions to restore from - TallyPrime keeps 7 versions by default, and that number is configurable between 1 and 366
- A usable company, not a loose file to reassemble - so a bad voucher batch or a corrupted company can be rolled back and the work redone
- Protection against the failures a local copy cannot survive: disk failure, theft, fire, ransomware encrypting the server

Storage and what happens when TSS stops:

- 1 GB of cloud storage is included with an active TSS on TallyPrime single-user, and 3 GB on multi-user
- Extra storage is available as an annual add-on if your data outgrows the included space
- If TSS expires, TallyDrive access stops, but the backups already in the cloud are retained for 90 days - renew inside that window and nothing is lost

For Mumbai and Navi Mumbai businesses, monsoon power cuts, office moves and laptop theft are all real events - each has ended someone's accounting data story. A business with automated backup only notices after a restore completes successfully.

Sarvadnya Infotech configures TallyDrive - automated, cloud-hosted TallyPrime backup with simple restore - for single-user firms through multi-branch companies. If your Tally data currently lives only on your server, set up backup before you need it, not after.`,
  },
  {
    slug: 'smbs-cbd-belapur-certified-tally-partner',
    title: 'Why SMBs in CBD Belapur Choose a Certified Tally Partner',
    seoTitle: 'Tally Partner in CBD Belapur',
    date: 'August 23, 2026',
    category: 'Local Business',
    description: 'Why small and mid-size businesses in CBD Belapur work with a certified Tally partner - compliance, support proximity and automation that answers the phone.',
    tags: ['cbd belapur', 'it companies in cbd belapur', 'tally partner belapur', 'software companies in cbd belapur'],
    link: '/services',
    author: 'Sarvadnya Infotech LLP',
    content: `CBD Belapur is the commercial heart of Navi Mumbai - packed with trading and services firms whose accounting runs on Tally. For an SMB in CBD Belapur, the choice of Tally partner is a working relationship that touches GST, payroll, invoices and year-end close.

Why businesses in this area tend to prefer a certified partner over a generic reseller.

- Compliance depth - certified partners stay current with Tally updates, e-invoicing and statutory changes before they become problems
- Proximity - same-city support means someone can be at your office or connect to your system fast during business hours
- Automation - a partner who builds TDL modules removes the manual rework that eats accounts-team hours
- Predictability - an AMC with a defined response time beats hoping someone answers
- They will tell you when to renew TSS instead of letting your subscription lapse

SMB owners in CBD Belapur especially value partners who understand their headcount. A six-person trading company does not need an enterprise deployment - it needs clean setup, reliable backup and someone who answers when invoicing season peaks.

Sarvadnya Infotech is a Tally certified partner based in Belapur, Navi Mumbai, serving businesses of this exact shape since 2008. If you are happy with your current software but not your current partner, we are ready to help you switch smoothly.`,
  },
  {
    // CHANGE: 2026-10-26 — corrected against Tally's own partner page (tallysolutions.com/partners).
    // The old body described 5 Star as "the highest official partner tier before enterprise
    // levels" - there is no tier above 5 Star. Tally certifies partners at exactly two levels
    // (3-Star and 5-Star), and GVLA is a SEPARATE partner category for government and very large
    // accounts, not a rung above 5-Star. The tier definitions are now Tally's own wording, and
    // verification points at Tally's Locate a Partner directory instead of "ask for the
    // credential".
    // CHANGE: 2026-11-03 — GSC 28d: 18 impressions, 0 clicks, position 5.83; the query is
    // "tally 5 star partner in mumbai" (4, position 14.5) and the old title dropped the city.
    // "Mumbai" is a typed qualifier and belongs in the title. The order stays 3 Star before 5
    // Star on purpose: the post's own 2026-10-26 correction is that Sarvadnya is a 3 star
    // partner, so the title must not read as a 5 star claim.
    slug: 'tally-5-star-partner-mumbai',
    title: 'Tally Partner Tiers in Mumbai: 3 Star vs 5 Star, What the Certification Means',
    seoTitle: 'Tally Partner Tiers in Mumbai: 3 Star vs 5 Star',
    date: 'September 6, 2026',
    category: 'Tally Partner',
    description: 'Tally partner tiers explained: what 3 star and 5 star certification mean, how to verify the tier, and why an honest 3 star Tally partner in Mumbai can fit.',
    tags: ['tally 3 star partner in mumbai', 'tally 5 star partner in mumbai', 'tally partner tiers', 'tally partner mumbai'],
    link: '/services',
    author: 'Sarvadnya Infotech LLP',
    content: `Tally runs a tiered partner ecosystem, and the star rating on a partner's certification is a useful starting signal for how that firm is equipped to help you. This post explains the tiers - especially the difference between a 3 star and a 5 star Tally partner - and where an honest 3 star partner fits.

There are exactly two Tally Certified Partner levels:

- 3 star partner: certified to address business automation needs arising from the basic activities in accounting, inventory, banking and compliance. Tally positions 3 star partners for small and medium sized businesses with simple operations and straightforward use cases.
- 5 star partner: Tally describes 5 star partners as veterans in the Tally business, with deep experience and expertise across diverse business segments and scenarios and in implementing Tally products for them. They are positioned for mature businesses with advanced automation needs and complex business or technical requirements.

Two other partner categories exist, and neither is a level above 5 star:

- Associate partners: they make the product available - a new licence or a TSS renewal - but they do not implement, train or support.
- GVLA partners: Government and Very Large Account entities, served by a specialised Tally team across business management, supply chain, compliance, financial and project management. This is a separate segment, not a rung that a normal business buys up to.

So "3 star vs 5 star" is really a question about your operations, not about prestige:

- If your operations are simple and your needs are the standard set - invoicing, GST, inventory, banking, payroll - a 3 star certified partner is exactly the level Tally designed for that work.
- If you run multiple branches, mixed business models, heavy customisation or complex integrations, a 5 star partner's breadth across scenarios is worth having.
- A higher tier does not by itself mean better day-to-day support, pricing or responsiveness. Those come from the firm, not the badge.

How to verify a tier honestly claimed:

- Search the firm on Tally's Locate a Partner directory at tallysolutions.com/partners, which lists partner type and, where available, reviews and years as a partner
- Check that the certification is current rather than described in the past tense
- Ask which certified staff would handle your account, and how their support and renewal reminders actually run
- Take two references from businesses near you - same software, similar firm size

For the 3 star angle specifically, see our separate guide on what to look for in a Tally 3 star partner in Mumbai.

About Sarvadnya Infotech: we are a Tally certified 3 star partner - and we state it plainly rather than hinting at a higher tier. That 3 star certification, backed by 1,500+ customers in Mumbai and Navi Mumbai since 2008, covers the full partner job for the businesses we serve: TallyPrime licensing, TSS renewal, AMC, TallyPrime on Cloud Access, automated backup and custom TDL modules. If your requirements are genuinely complex, we will tell you that a 5 star partner is the better fit rather than pretend otherwise. Compare tiers with the criteria above, verify us on Tally's directory, and decide on the facts - that is how a partner should want to be judged.`,
  },
  {
    slug: 'tally-partner-near-me',
    title: 'Tally Partner Near Me: How to Find and Verify a Certified Tally Partner',
    seoTitle: 'Tally Partner Near Me: Verify One',
    date: 'September 7, 2026',
    category: 'Tally Partner',
    description: 'Searching "tally partner near me"? Here is a repeatable way to find and verify a certified Tally partner in Mumbai, Navi Mumbai and Belapur - and the questions to ask.',
    tags: ['tally partner near me', 'tally partners near me', 'tally partner in mumbai', 'tally partner mumbai'],
    link: '/contact',
    author: 'Sarvadnya Infotech LLP',
    content: `Searching for a "tally partner near me" is the right instinct - Tally support is a relationship, not a one-time purchase, and a nearby partner can be at your office fast when a year-end close or payroll run is blocked. Here is a short, repeatable method to find and verify one.

Step 1 - build a shortlist

- Search for tally partner in Mumbai, Navi Mumbai, Belapur or Vashi on Google Maps and Google Search
- Note the firms with an office in your area and a website that shows real service detail
- Filter out pure licence resellers - they sell software but do not implement, train or support

Step 2 - verify each candidate

- Ask for the official Tally partner credential and confirm the certification tier
- Request the same-city response promise in writing as a support SLA
- Ask about TSS renewal, cloud backup and TDL add-on support, not just the licence price
- Take two references from businesses near you - same software, same firm size

Step 3 - decide on proximity and fit

- A partner in your city can do onsite help and connect to your system during business hours
- Confirm coverage of your exact setup: Tally Prime, Tally ERP 9, multi-user and Tally on Cloud

For businesses in Mumbai, Navi Mumbai, CBD Belapur and Vashi, Sarvadnya Infotech is an official Tally certified partner based in Belapur with 1,500+ customers across the region. If a nearby, certified partner with a defined support agreement is what you are looking for, start the conversation - we can usually visit or connect the same day.`,
  },
  {
    slug: 'tally-hrms-software',
    title: 'Tally HRMS Explained: Payroll, Attendance and Leave for SMBs',
    seoTitle: 'Tally HRMS: Payroll & Attendance',
    date: 'September 4, 2026',
    category: 'HRMS',
    description: 'Tally HRMS for payroll, attendance and leave management - how an HRMS connects to your Tally data and what small and mid-size businesses should look for.',
    tags: ['tally hrms', 'hrms software', 'tally payroll software', 'tally attendance'],
    link: '/hrms',
    author: 'Sarvadnya Infotech LLP',
    content: `HRMS stands for Human Resource Management System - software that manages payroll, attendance, leave and employee records. A good HRMS plugs into the same company data as your accounting software, so payroll figures flow into Tally instead of being retyped.

What a Tally-connected HRMS should cover:

- Payroll: salary structure, monthly payslips, arrears, and the totals that feed your Tally vouchers
- Statutory compliance: PF, ESI and other deductions computed from the same employee master
- Attendance and leave: records that roll into payroll without manual Excel consolidation
- Employee self-service: staff view payslips and leave balances themselves, reducing HR queries
- Security: role-based access so only authorised people see salaries and personal data

For small and mid-size teams, the biggest win is eliminating double entry. When payroll output transfers into Tally automatically, the close is faster and the numbers match between HR and accounts.

What to consider when comparing:

- Does it connect to the Tally edition you run (Prime / ERP 9)?
- Is payroll statutory-ready for India (PF, ESI, professional tax)?
- Is onboarding and training included, or do you configure it yourself?
- If you stop subscribing, are data exports open and simple?

Sarvadnya Infotech offers an HRMS solution that covers payroll, attendance and employee management with Tally connectivity - deployed for businesses across Mumbai and Navi Mumbai, with training and support included. If your team still builds payslips in Excel, it is worth a demo.`,
  },
  {
    slug: 'tally-tss-expiry-meaning',
    // CHANGE: 2026-10-07 — P1 retitle (plan §2B action 1): answer-form for the cluster
    // ("tss expired in tally", "tss full form", "tss renewal means") instead of the old
    // passive phrasing. Description now states the answer up front ("TSS = Tally Software
    // Services..."). `faqs` added — rendered as the visible article FAQ block AND as
    // FAQPage JSON-LD (P1 §2E.2). ASCII-only per house rule.
    // CHANGE: 2026-10-26 — factual fixes. The post said TSS "keeps Tally Prime and Tally ERP 9
    // current", but TSS renewal for Tally.ERP 9 was discontinued for all customers from
    // 16 August 2026, so an ERP 9 owner reading it would look for a renewal that no longer
    // exists. It also stated flatly that "a Tally licence stays valid for life" - true only for
    // a PERPETUAL licence; a TallyPrime rental subscription has its own end date at which the
    // software stops working, which is the exact opposite of what the post promised. Both are
    // now split out explicitly, and the vague "no support for non-urgent issues" and the
    // speculative "before a price change" line are gone.
    title: 'TSS in Tally: What It Means, Why It Expires, and How to Renew',
    // CHANGE: 2026-11-03 — GSC 28d: 741 impressions, 1 click (0.13%), position 5.77. The cluster
    // is "tss expired in tally means" (53), "tss expired in tally" (25), "tss has expired in
    // tally" (13), "tss meaning in tally" (9), plus 53 impressions on "tss full form" variants -
    // and "TSS in Tally: Meaning & Renewal" matched almost none of it. The question people
    // actually type now leads the title; the description answers it in the first line.
    seoTitle: 'TSS Expired in Tally? What It Means',
    date: 'September 5, 2026',
    category: 'TSS & Renewals',
    description: "TSS means Tally Software Services, the yearly subscription that keeps TallyPrime current. What 'TSS has expired' means, and what a renewal restores.",
    // CHANGE: 2026-10-13 — tags extended with the Search Console question variants
    // ("what is tally tss", "what is tss in tally", "what does tss mean") that were
    // already being served by this post but not declared.
    tags: ['tss expiry meaning in tally', 'tss expired in tally means', 'tally tss renewal', 'tally tss expired', 'tss full form in tally', 'tss in tally', 'tss renewal means', 'what is tally tss', 'what is tss in tally', 'what is tss in tally prime', 'what does tss mean'],
    link: '/services/tss',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'What is the full form of TSS in Tally?',
        a: 'TSS stands for Tally Software Services. It is the annual subscription that sits alongside a TallyPrime licence and covers product releases, statutory compliance updates, connected services and technical support from Tally. TSS renewal for Tally.ERP 9 was discontinued for all customers from 16 August 2026.',
      },
      {
        // CHANGE: 2026-10-13 — distinguishes the two things owners conflate, and quietly
        // bridges to the licence-expiry post. Target: "what is tally tss".
        // CHANGE: 2026-10-26 — adds the rental case, which the old answer denied by saying
        // a licence "stays valid for life" without qualification.
        q: 'Is TSS the same as a Tally licence?',
        a: 'No. A perpetual TallyPrime licence is a one-time purchase that lets you run the software for as long as you like - it never expires. TSS is the annual subscription attached to that licence that keeps the software updated, compliant and supported. A TallyPrime rental (monthly subscription) is different again: it carries its own end date and the software stops working when it lapses. That is why a perpetual licence can be perfectly valid while TSS has expired, and why holding a TSS does not extend a rental.',
      },
      {
        q: 'What does "TSS expired" mean in Tally?',
        a: 'TSS expired means your Tally Software Services coverage has lapsed. On a perpetual licence the software keeps working and your data stays safe, but you stop receiving new releases and statutory compliance updates, the connected services stop, and technical support is no longer covered until you renew.',
      },
      {
        q: 'What does TSS renewal mean?',
        a: 'TSS renewal means paying for the next period of your Tally Software Services subscription so releases, statutory compliance changes, connected services and technical support stay active. Once renewed, your licence shows the new coverage end date and the connected services unlock again.',
      },
      {
        q: 'Will Tally stop working if TSS expires?',
        a: 'It depends on the licence type, not on TSS. A perpetual TallyPrime licence keeps working with your data intact after TSS lapses - you lose updates, compliance changes, connected services and support. A TallyPrime rental subscription does stop working when its own subscription period ends, and TSS renewal does not extend that. Tally.ERP 9 keeps working, but there is no longer a TSS renewal to buy for it.',
      },
      {
        // CHANGE: 2026-10-26 — the closure is the single most consequential fact for anyone
        // still on ERP 9, so it gets its own answer instead of being buried in prose.
        q: 'Can I still renew TSS for Tally.ERP 9?',
        a: 'No. Tally discontinued TSS renewal on Tally.ERP 9 for all customers from 16 August 2026, so there is no new renewal period to buy. The path forward is an upgrade to TallyPrime: the upgrade is free if your TSS was active on or after 9 November 2020, and paid otherwise. Your existing data file is converted, not re-entered.',
      },
    ],
    content: `TSS expiry meaning in Tally, in plain terms: TSS (Tally Software Services) is the annual subscription that keeps a TallyPrime licence current - new releases, statutory compliance updates, the connected services and technical support. When the licence screen shows "TSS has expired", it means that coverage has lapsed.

First, separate the two things that both have an "expiry date":

- The licence. A perpetual TallyPrime licence never expires - you bought it, you own it, and it keeps running. A TallyPrime rental (monthly subscription) is different: it has its own end date, and when it lapses the software stops working.
- TSS. Always annual, always dated. Its expiry does not switch the software off on a perpetual licence - it switches off the updates, the connected services and the support.

So "TSS expired" does not mean Tally stops. It means your licence is no longer current, and the sooner you renew, the sooner updates and support resume. Most of the risk is quiet: it does not stop you today, it surprises you at a compliance deadline.

What actually stops when TSS lapses:

- New releases and statutory updates, so a GST, e-invoice or e-way bill rule change is not applied
- Connected services: e-invoicing, e-way bill generation, GST return filing and GSTR-2A/2B downloads, bank payments and auto bank reconciliation, and mobile or WhatsApp access to reports
- Technical support against the serial number
- TallyDrive eligibility - access stops, though backups already in the cloud are retained for 90 days

What does not stop: your data. Vouchers, masters and reports stay readable on a perpetual licence, and nothing is deleted.

How to check your status:

- In TallyPrime, open F1 (Help) > Settings > License > Manage License - the expiry date and the renewal option sit on that screen
- An Alt+R (Manage TSS Renewal) shortcut appears on the Gateway of Tally once your renewal is due
- If you run several machines or companies, list every serial number first so you renew exactly what you use and nothing you have retired

One important change in 2026: TSS renewal on Tally.ERP 9 was discontinued for all customers from 16 August 2026. If you are still on ERP 9, there is no renewal left to buy - the decision in front of you is an upgrade to TallyPrime, not another year of ERP 9. The upgrade is free if your TSS was active on or after 9 November 2020, and paid otherwise, and your data file is converted rather than re-entered.

Renewal itself is quick with a verified partner. Sarvadnya Infotech handles Tally TSS renewal for businesses anywhere in India - we check your serial number, confirm the right plan and complete the renewal in one short conversation, fully remotely. If TSS has expired on your setup, get in touch before a busy closing week rather than after it.`,
  },
  {
    // CHANGE: 2026-10-07 — P1 companion post (plan §2B action 2). Exact-match target for
    // "how to check tss expiry date in tally prime" (15 impr, pos 8.2 -> page-1 goal).
    // ASCII-only per house rule. Its `faqs` feed the article FAQ block + FAQPage JSON-LD.
    // CHANGE: 2026-10-26 — three corrections. (1) The old body said "go to the Help menu or
    // the About screen" and pointed at "the licence and about screen" - the actual TallyPrime
    // path is F1 (Help) > Settings > License > Manage License, so both the FAQ and the steps
    // now name it. (2) The line "the renewal service period starts from the renewal date, so
    // renewing late does not extend the old gap" asserted a start-date rule we cannot verify
    // for every renewal type; it now tells readers to confirm the period at renewal time
    // instead of promising a rule. (3) It offered renewal for "TallyPrime or Tally ERP 9" -
    // TSS renewal on ERP 9 was discontinued from 16 August 2026.
    // CHANGE: 2026-11-03 — GSC 28d: 122 impressions, 0 clicks, position 5.5. "Check TSS Expiry
    // in TallyPrime" dropped the "how to" that every matching query starts with (the sibling
    // tool page now owns "verify", so this one keeps "check" and stays a distinct title).
    slug: 'how-to-check-tss-expiry-date-tallyprime',
    title: 'How to Check the TSS Expiry Date in TallyPrime',
    seoTitle: 'How to Check TSS Expiry in TallyPrime',
    date: 'October 7, 2026',
    category: 'TSS & Renewals',
    description: 'How to check the TSS expiry date in TallyPrime: F1 (Help) > Settings > License > Manage License, what the coverage end date means, and when to renew.',
    // CHANGE: 2026-10-13 — tags extended for the Search Console variants
    // ("how to check tally expiry date", "how to check tally prime license expiry date").
    tags: ['how to check tss expiry date in tally prime', 'tss expiry date', 'tss expired in tally means', 'tally tss renewal', 'how to check tally expiry date', 'how to check tally prime license expiry date', 'tally license expiry date'],
    link: '/services/tss',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'Where does TallyPrime show the TSS expiry date?',
        a: 'Press F1 (Help) > Settings > License > Manage License. That screen shows the licence details and the TSS coverage end date, and it is where the "TSS has expired" notice appears once the date passes.',
      },
      {
        q: 'What does the TSS expiry date on my licence mean?',
        a: 'It is the last day your Tally Software Services subscription covers releases, statutory compliance updates, the connected services and technical support. After that date the software keeps running on a perpetual licence, but updates and connected services stop until you renew.',
      },
      {
        q: 'Can I renew TSS after the expiry date has passed?',
        a: 'Yes. A lapsed TSS can still be renewed from your licence details. Share the serial number shown on the Manage License screen with a Tally certified partner and the renewal is applied to that serial number. Confirm the coverage start and end dates when you renew, because the period you get depends on your current licence status.',
      },
      {
        // CHANGE: 2026-10-13 — covers the "how to check tally expiry date" variant (owners
        // searching for the licence date, not the TSS date) and bridges to the licence post.
        // CHANGE: 2026-10-26 — the rental sentence was misleading: a rental subscription
        // covers the software and the services together for its term, so it is the rental
        // period that is being renewed, not a separate TSS sitting on top of it.
        q: 'Does this show the Tally licence expiry date as well?',
        a: 'The Manage License screen shows both. It carries your licence details - serial number, edition, and whether the licence is perpetual or a rental - and the TSS coverage end date. A perpetual licence does not expire, so only TSS has an end date. A TallyPrime rental subscription is different: it has its own end date, it covers the software and the services together for its term, and renewing the rental extends both.',
      },
    ],
    content: `Checking the TSS expiry date in TallyPrime takes under a minute, and knowing it early protects your business from a quietly lapsed subscription at a compliance deadline. Here is how to find it.

Where the TSS expiry date appears:

- Open TallyPrime on the workstation where the licence is activated
- Press F1 (Help) > Settings > License > Manage License
- The screen shows your licence details together with the TSS coverage end date
- If the date has already passed, the same screen shows the "TSS has expired" notice and offers the renewal path
- An Alt+R (Manage TSS Renewal) shortcut also appears on the Gateway of Tally once your renewal is due, which is the reminder most people notice first

What the date means:

- Before the expiry date: releases, statutory compliance updates, the connected services and support are covered
- After the expiry date: on a perpetual licence the software keeps working and your data stays safe, but updates and connected services stop until you renew
- A TallyPrime rental subscription is the exception - it has its own end date and the software stops working when that period ends

A quick habit that prevents surprises:

- Check the Manage License screen once a month, or every time a GST or statutory change lands
- Keep the serial number shown on that screen handy - renewal is processed against it
- Confirm the coverage start and end dates when you renew, rather than assuming the new period begins on a particular date
- If you are on Tally.ERP 9, note that TSS renewal for it was discontinued for all customers from 16 August 2026, so the path there is an upgrade to TallyPrime rather than a renewal

Sarvadnya Infotech renews TSS for businesses anywhere in India. Share your licence details and we check the expiry date, confirm the right plan and complete the renewal remotely in one short conversation.`,
  },
  {
    // CHANGE: 2026-11-03 — GSC 28d: 523 impressions, 0 clicks, position 10.37 - the largest
    // zero-click news page after the shortcuts lesson. "Work Anywhere" is a tagline; the query
    // is the product phrase plus an intent (how / cost), so the title now carries both.
    slug: 'tally-cloud-access',
    title: 'Tally Cloud Access: Work on Your Tally from Anywhere, Securely',
    seoTitle: 'Tally Cloud Access: How It Works & Costs',
    date: 'September 2, 2026',
    category: 'Cloud',
    description: 'Tally cloud access: run Tally Prime or ERP 9 on a hosted server, work from any device with daily backups. What it includes, what it costs, who needs it.',
    tags: ['tally cloud access', 'tally on cloud', 'cloud tally mumbai', 'tally remote access'],
    link: '/cloud/tallycloudaccess',
    author: 'Sarvadnya Infotech LLP',
    content: `Tally cloud access lets your accounts team run Tally Prime and Tally ERP 9 from any device, from anywhere, while the company data stays on a secure, backed-up server. It replaces "Tally is only on the one PC in the office" with "Tally is wherever your team is".

What a proper Tally cloud access setup includes:

- Your Tally data hosted on dedicated infrastructure (such as AWS-class hosting), not a shared consumer machine
- Remote desktop or browser access for every licensed user - the same Tally screens and menus
- All users working on the same company file, so nobody is on a stale separate copy
- Automated daily backups, so a failed hard drive or a ransomware click is not the end of your records
- Per-user access control with logging and revocable access, so data stays private

Scenarios where cloud access pays for itself:

- Multi-branch teams that need one shared company file across cities
- Accountants who want to work from home without carrying the office machine
- Owners and CA teams who need a read of live numbers without contacting IT
- Businesses that already lost data once and want backup to be automatic

What pricing depends on: number of users, storage and backup retention, your Tally edition (Silver / Gold / Server) and whether support is included. The cheap option that runs everyone on one unbacked-up machine is not the same product.

Sarvadnya Infotech deploys Tally cloud access for businesses in Mumbai, Navi Mumbai, Pune and across India - official Tally licenses, AWS-hosted access and automated backups, with migration and staff training included. Tell us your headcount and we will confirm the right setup.`,
  },
  {
    // CHANGE: 2026-11-03 — GSC 28d: 610 impressions, 10 clicks (1.64%), position 6.52. The list
    // cluster is "it companies in belapur" (81), "it companies in belapur navi mumbai" (22),
    // "belapur it companies" (28) - so the city pair now matches the query order and "CBD" is
    // left to the body. This post is the canonical winner for the cluster (see the plan doc);
    // the weaker /news/it-companies-in-belapur was re-scoped so the two stop competing.
    slug: 'cbd-belapur-it-companies-list',
    title: 'IT Companies in CBD Belapur, Navi Mumbai: A Working List',
    seoTitle: 'IT Companies in Belapur, Navi Mumbai',
    date: 'September 3, 2026',
    category: 'Local Business',
    description: 'A working list of IT companies in Belapur, Navi Mumbai - Tally partners, software, support and automation firms - and how to shortlist one for your need.',
    tags: ['cbd belapur it companies list', 'list of companies in belapur', 'it companies in cbd belapur', 'software companies in cbd belapur'],
    link: '/about',
    author: 'Sarvadnya Infotech LLP',
    content: `CBD Belapur has become a genuine technology address for Navi Mumbai. Companies searching "IT companies in CBD Belapur" usually need one of a few things: software and licences, ongoing support with a defined SLA, or automation work like TDL modules and cloud setup. This is a working list of the kinds of firms you will find in and around CBD Belapur, so you can match the profile to your need.

Types of IT companies in Belapur:

- Tally partners and resellers - licence supply, implementation, TSS renewal, AMC and support
- Accounting automation firms - TDL add-ons, import utilities and integrations that cut manual entry
- Cloud and remote-working specialists - Tally on Cloud, server hosting, automated backups
- Software development agencies - web, mobile and business applications beyond the Tally ecosystem
- IT support and network firms - hardware direction, office networks and helpdesk contracts

A practical note: a list of companies is only useful with a filter. Before shortlisting, decide what you actually need - a licence transaction is a different vendor from a partner who configures, trains and supports your accounts team for years.

How to evaluate the shortlist:

- Confirm what they sell and support, and for which Tally editions
- Ask what happens after day one: training, support SLA, backup and renewal reminders
- Take a reference from a business near you, ideally your industry and headcount
- Prefer firms whose office is genuinely in Belapur if same-day onsite help matters to you

Sarvadnya Infotech is a Tally certified partner and IT company based in Belapur, Navi Mumbai - software licences, TSS renewal, AMC, Tally on Cloud, automated backup and custom TDL modules, serving 1,500+ businesses since 2008. If your search for IT companies in CBD Belapur is really a search for reliable Tally support, we are a short conversation away.`,
  },
  // CHANGE: 2026-10-03 - SP-3 news post. International TallyPrime licensing, based on
  // the owner's paragraph: the India edition is blocked outside India; permanent operations
  // abroad need an International Edition or a designated international/regional license
  // (UAE, Singapore, UK examples). No short-trip nuance claimed - stick to the owner's copy,
  // no invented travel-policy details. ASCII-only (hyphens, never em-dashes - see AGENTS.md).
  {
    // CHANGE: 2026-11-03 — GSC 28d: 94 impressions, 1 click (1.06%), position 3.79 — the worst
    // CTR of any page ranking in the top four. The queries are "tally international license" (8)
    // and "is tally used outside india" (6, position 2.8), and the old title carried neither
    // phrase ("TallyPrime" one word, "Licences" as a bare trailing noun). The description was
    // also 165 chars, so the reason to click was cut mid-sentence.
    slug: 'tallyprime-international-licenses',
    title: 'Using TallyPrime Outside India: International Licenses Explained',
    seoTitle: 'Tally International License: Working Outside India',
    date: 'October 2, 2026',
    category: 'Tally Prime',
    description: 'A domestic Indian TallyPrime license is not designed to keep working abroad; a permanent move needs an international edition. Options by region.',
    tags: ['tallyprime international license', 'tally international edition', 'tally outside india', 'tally prime middle east', 'tally uae'],
    link: '/products',
    author: 'Sarvadnya Infotech LLP',
    content: `If your business is moving staff or permanent systems outside India, one licensing fact matters before you pack the laptops: a domestic Indian TallyPrime license is not designed to keep working abroad. The India edition of TallyPrime is blocked from activation and reactivation outside India, so a license bought for use in India cannot simply travel with the business.

What this means in practice:

- A domestic Indian TallyPrime license will not work permanently on systems located outside India.
- The India edition cannot be activated or reactivated from abroad, even while the license is still within its TSS subscription period.
- Operating permanently in another country requires a license that is licensed for the country where TallyPrime is actually used.

Your licensing options abroad:

- Upgrade to the TallyPrime International Edition, which is licensed for use outside India.
- Purchase a designated international or regional license for your country of operation - Tally issues regional licenses for markets such as the UAE, Singapore and the UK.

Licensing rules vary by country and depend on your current license and TSS status, so check with your Tally partner before moving systems abroad. A partner can confirm whether an upgrade or a regional license fits your situation and prepare the transition before you relocate.

See the TallyPrime license options on our products page, or contact Sarvadnya Infotech for a licensing check before you move.`,
  },
  {
    // CHANGE: 2026-10-26 — corrected against TallyHelp while auditing TSS claims. The serial
    // number and validity were both sourced from "F1 > About", which is the product-info
    // screen; in TallyPrime they live on F1 (Help) > Settings > License > Manage License. The
    // line "renew before expiry to get extra validity benefits wherever applicable" implied a
    // bonus period Tally does not publish, so it is gone. Also added the 16 August 2026 ERP 9
    // closure (that licence can no longer be renewed at all) and the licence-update step that
    // has to happen before the new date shows. Description switched to ASCII (it carried a
    // curly apostrophe, which the seed file's ASCII-only rule forbids).
    slug: 'how-to-renew-tally-tss-offline',
    title: 'How to Renew Tally TSS Offline: Steps, Requirements & When to Contact Us',
    seoTitle: 'Renew Tally TSS Offline: Steps',
    date: 'October 22, 2026',
    category: 'Tally Prime',
    description: 'Guide to renewing Tally Software Services (TSS) offline when online renewal is not possible - the process, the serial number you need, and how a Tally partner can help.',
    tags: ['tss renewal', 'tss offline renewal', 'renew tally tss', 'tally prime tss renewal', 'tally software services'],
    link: '/services/tss',
    author: 'Sarvadnya Infotech LLP',
    content: `Tally Software Services (TSS) keeps your TallyPrime updated with the latest statutory changes like GST, e-Invoice, e-Way Bill and other compliance updates. In some cases the online renewal option may not work - because of network issues, licence conditions, or because the renewal prompt does not appear.

When do you need offline TSS renewal?
- Alt+R (Manage TSS Renewal) or F1 (Help) > Settings > License > Manage License > F9 (Renew TSS) is missing or does not open
- The online payment page or the Tally Solutions portal does not load
- TSS has expired and the online renewal is not triggering
- The machine runs on restricted internet access, or has none

What you need before starting:
- TallyPrime serial number - F1 (Help) > Settings > License > Manage License
- Company name and the licence type (Silver, Gold or Server)
- The registered mobile number and email on the licence
- Your existing TSS coverage end date, so the right renewal period is chosen

Steps to renew TSS offline:
1. Open F1 (Help) > Settings > License > Manage License and note the serial number and the current TSS coverage end date.
2. Share the serial number and company details with your Tally Certified Partner - Sarvadnya Infotech LLP.
3. We verify the licence and TSS status against the serial number, and confirm the renewal period and the amount.
4. You receive the renewal details and the invoice against your company details.
5. We process the offline renewal for that serial number.
6. Update the licence from the Manage License screen and confirm the new coverage end date on the same screen.

Important notes:
- TSS works on all TallyPrime licences (Silver, Gold and Server). It is not limited to Gold.
- The Alt+R (Manage TSS Renewal) option only appears on the Gateway of Tally when your renewal is due - its absence does not mean TSS is missing.
- Confirm the coverage start and end dates with your partner when you renew; the period you get depends on your current licence status.
- If TSS is expired, features like e-Invoice and e-Way Bill generation, GSTR-2A/2B download, direct GST filing and certain banking utilities are restricted. Core accounting, inventory and reports keep working.
- TSS renewal for Tally.ERP 9 was discontinued for all customers from 16 August 2026, so an ERP 9 licence cannot be renewed - the path there is an upgrade to TallyPrime.

Need help with TSS renewal? Contact Sarvadnya Infotech LLP at https://sarvadnyainfotech.com/contact or visit https://sarvadnyainfotech.com/services/tss for assistance.`,
  },
  // CHANGE: 2026-10-13 - SEO batch from the owner's Search Console export. New posts target
  // "how to lock data in tally prime" / "how to lock tally prime", "how to add gst number in
  // tally erp 9" / "how to add gst in tally erp 9", "what is tally capital" and
  // "document management software companies". Facts grounded on TallyHelp / tallysolutions.com
  // and the owner's DMS feature list; ASCII-only (hyphens, never em-dashes, no rupee glyph).
  {
    // CHANGE: 2026-10-26 — full factual rewrite of this post against TallyHelp. Seven errors
    // were corrected: the old "Create / Alter" screen label and the missing F12 reveal for
    // "Use User Access Control"; the ERP 9 era "Types of Security" and "Users for Company"
    // menu wording; the cut-off date being described outside the security level where it
    // actually lives; the password policy being bundled into the same area as the cut-off
    // date (it is its own Alt+K menu); the edit log having no enablement path at all; and a
    // recovery paragraph that understated how much is unrecoverable.
    // CHANGE: 2026-11-03 — GSC 28d: 1,984 impressions, 40 clicks (2.02%), position 3.05 - the
    // site's biggest page, and still the biggest absolute click loss: position ~2 with 2% CTR
    // means the snippet was not answering. "Lock Data in TallyPrime: How To" is not a sentence
    // anyone types; the "how to" moved to the front and "previous year" (86 of the 182
    // impressions in the lock cluster) is now in the title.
    // CHANGE: 2026-11-03 - owner request: the post now also covers the two targeted locking
    // modules we configure (GST period lock, e-invoice lock), because a company-wide cut-off
    // date stops all accounting work, not just the GST side. Date moved to the update day and
    // two query-shaped FAQ entries added so the new sections are answerable from a snippet.
    slug: 'how-to-lock-data-in-tallyprime',
    title: 'How to Lock Data in TallyPrime (Company, Users and Back-Dated Entries)',
    seoTitle: 'How to Lock Data in TallyPrime (Previous Year)',
    date: 'November 3, 2026',
    category: 'Tally Prime',
    description: 'How to lock Tally data for a previous year or a closed period in TallyPrime: user access control, user roles, a cut-off date that blocks back-dated entries, and targeted GST and e-invoice locks.',
    tags: ['how to lock data in tally prime', 'how to lock tally prime', 'user access control in tally prime', 'user roles in tally prime', 'lock back dated vouchers tally', 'tallyvault', 'edit log in tally prime', 'lock gst data in tally', 'e invoice lock in tally'],
    link: '/services/amc',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'How do I lock my company data in TallyPrime?',
        a: 'Press Alt+K (Company) > Alter, select the company, and set Control User Access to Company Data to Yes. If the option is not visible, press F12 (Configure) on that screen and set Use User Access Control to Yes. Enter the administrator username and password, then accept with Ctrl+A. From then on TallyPrime asks for those credentials every time the company is opened.',
      },
      {
        q: 'How do I stop users from entering or changing old vouchers?',
        a: 'Open Alt+K (Company) > User Roles, select the security level, and set Days Allowed for Back Dated Vouchers and the Cut-off Date for Back Dated Vouchers. Days allowed counts backwards from the date of the last entry; the cut-off date is a fixed date TallyPrime will not go before. If both are set, TallyPrime applies whichever is more restrictive.',
      },
      {
        q: 'I forgot the Security Control administrator password. What now?',
        a: 'TallyPrime has no self-service recovery for the company security password. Take a backup before you enable security and record the administrator password separately. If you are already locked out, restore a backup taken before the password was set, or contact Tally support with your licence and serial number - do not edit the data files directly.',
      },
      {
        q: 'Does locking data stop my accountant from working?',
        a: 'No. Rights are per user role. TallyPrime ships with Owner and Data Entry Operator levels, and you can create more. Your accountant can keep full access while a data entry operator is limited to recording vouchers, so nobody has to share a single login.',
      },
      {
        q: 'What is the difference between TallyVault and Security Control?',
        a: 'Security Control asks for a username and password before a company opens and controls what each user can do inside it. TallyVault encrypts the company data itself, so even the company name does not appear in the company list without the vault password. They are separate options and can be used together, and the TallyVault password cannot be retrieved if it is lost.',
      },
      {
        q: 'Can I lock only GST data and still post other entries?',
        a: 'Not with the built-in TallyPrime controls. A cut-off date freezes every voucher before that date, including bank entries, contra transfers and non-GST expenses. We configure a GST period lock module that freezes the sales, purchase, debit note and credit note vouchers for a filed return period while the rest of the accounting stays open.',
      },
      {
        q: 'How do I stop a user from changing an e-invoice after the IRN is generated?',
        a: 'The e-invoice lock module locks the voucher as soon as the IRN and QR code are recorded. A regular user cannot change the amounts, items or party details, and cannot delete the voucher, even when back-dated entry and voucher alteration are allowed elsewhere. Only an authorised user can start a proper amendment or an IRP cancellation.',
      },
    ],
    content: `Locking data in TallyPrime is really three separate locks, and most businesses need all three: a lock on opening the company, a lock on who can do what inside it, and a lock on how far back anyone can post. Here is how each one is set.

Lock 1 - restrict access to the company:

- Press Alt+K (Company) > Alter and select the company
- If you do not see a Security section, press F12 (Configure) on that screen and set Use User Access Control to Yes
- Set Control User Access to Company Data to Yes
- Enter the Username (Administrator) and Password - this is the owner-level account
- Accept with Ctrl+A

From that point TallyPrime asks for credentials before the company opens, which is the single most effective step if the machine sits in a shared office. Two habits make it work: take a backup before you enable it, and record the administrator password somewhere safe. TallyPrime has no self-service recovery for this password.

Lock 2 - restrict what each person can do:

- Press Alt+K (Company) > Users and Passwords and create one user per person: choose the user role, then enter a username and password
- Press Alt+K (Company) > User Roles to open the Security Levels screen and define what that level may do: which voucher types can be created, altered or viewed, which reports and masters are reachable, and whether company administration, backup, restore or security settings are allowed
- TallyPrime already ships with two levels, Owner and Data Entry Operator, and you can rename them or add more

Give every person their own username instead of a shared login, and keep data entry, approval and reporting in different hands. Row-level attribution is worthless if the name in the record is shared by four people.

Lock 3 - restrict how far back entries can go:

- The two back-dated controls sit inside the security level, so open Alt+K (Company) > User Roles and select the level
- Days Allowed for Back Dated Vouchers counts backwards from the date of the last entry, so the window moves as work is posted
- Cut-off Date for Back Dated Vouchers is a fixed date, and TallyPrime refuses to record or alter anything before it - the right choice once an audit or a GST return is closed
- If both are set, TallyPrime applies whichever is more restrictive

Two more settings worth knowing, because they are separate from the three locks above:

Password Policy. Press Alt+K (Company) > Password Policy for the company-wide rules: minimum length, advanced strength, expiry, password history, change on first login and whether users may change their own password. You can exempt a specific user from the policy with F12 on the Users for Company screen.

Edit Log. From TallyPrime 2.1 onwards, press F12 (Configure) on the company alteration screen and set Set Edit Log Applicability to Yes, then enable Edit Log for the company. The Edit Log report then shows what changed in masters and transactions, and records company-level events such as enabling the log, data migration and data split. This is the setting that answers "who changed this voucher", and it is separate from user access control.

TallyVault is the fourth lock, and it is a different kind of protection. Press Alt+K (Company) > TallyVault to set a vault password, or enter one while creating the company. The company data is encrypted, so the company name and financial year do not even appear in the company list until the vault password is entered. If your business falls under the audit trail requirement of the Companies (Accounts) Rules, 2014, confirm with your chartered accountant what your configuration has to demonstrate rather than assuming a checkbox is enough.

Two narrower locks we configure on top

The four locks above are company-wide. A company-wide cut-off date is the right answer once a year is closed, but it is a blunt instrument for statutory work: it stops every voucher, including the bank entries, contra transfers and non-GST expenses you still have to post after a return is filed. These are the two targeted modules we build and configure for that gap. They sit on top of user access control, they do not replace it.

GST period lock. Once a monthly or quarterly GSTR-1 or GSTR-3B return is filed, this module locks the GST-impacting vouchers for that return period - sales, purchases, debit notes and credit notes. Everything else in the same period stays open, so routine accounting does not stop. Filed figures cannot drift afterwards, and nobody has to police the cut-off date by hand.

e-Invoice lock. The moment an IRN and QR code are generated, the invoice has to stay exactly as it was sent to the IRP portal. This module locks that voucher when the IRN is recorded: amounts, items, party details and deletion are blocked for regular users, even where back-dated entry or voucher alteration is allowed for other daily work. Only an authorised user can begin a proper amendment or an IRP cancellation, so an operator cannot put the portal and the books out of step by accident.

Both are configured per company, with the roles and the unlock path documented, so the lock protects the compliance position without locking your own team out of routine work.

Before you lock anything down: take a backup, store the administrator and vault passwords where two people can find them, and test the setup with a data entry user rather than your own owner login. Then review the roles whenever staff change.

Sarvadnya Infotech is a Tally certified partner based in CBD Belapur, Navi Mumbai. We configure user access control, user roles, back-dated voucher limits and the edit log for businesses in Mumbai, Navi Mumbai and across India, and we document the administrator credentials so a staff change never locks you out of your own books.`,
  },
  {
    // CHANGE: 2026-10-26 — rewritten against Tally Solutions' own ERP 9 GST guide. The old
    // version sent readers to F3: Cmp Info as the primary path and listed "Unregistered or
    // Consumer" as valid company registration types. In Tally.ERP 9 the GSTIN is entered on a
    // dedicated GST Details screen opened from F11: Features > F3: Statutory & Taxation by
    // setting "Set/alter GST details" to Yes, and a company registration is Regular or
    // Composition (Unregistered/Consumer are party-ledger values). The TSS sentence now carries
    // the actual discontinuation date (16 August 2026) instead of leaving it vague.
    // CHANGE: 2026-11-03 — GSC 28d: 714 impressions, 3 clicks (0.42%), position 5.87. The GST
    // cluster is "how to enable gst in tally erp 9" (17), "how to change gst number in tally
    // prime" (12+7), "how to add gst number ..." (8) - all 0 clicks. The title now opens with
    // the "how to" those queries share, and the description covers add *and* change.
    slug: 'how-to-add-gst-number-in-tally-erp-9',
    title: 'How to Add a GST Number in Tally ERP 9 (and Change It Later)',
    seoTitle: 'How to Add GST Number in Tally ERP 9',
    date: 'October 13, 2026',
    category: 'GST & Compliance',
    description: 'How to add a GST number (GSTIN) in Tally ERP 9: enable GST, open GST Details, set party GSTIN - and how to change it later. Why TSS status matters.',
    tags: ['how to add gst number in tally erp 9', 'how to add gst in tally erp 9', 'gstin in tally erp 9', 'tally erp 9 gst registration', 'change gst number in tally'],
    link: '/services/tss',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'Where do I enable GST in Tally ERP 9?',
        a: 'From the Gateway of Tally press F11: Features, then F3: Statutory & Taxation, and set "Enable Goods and Services Tax (GST)" to Yes. On the same screen set "Set/alter GST details" to Yes - that second option is what opens the GST Details screen where the GSTIN is entered. Only after GST is enabled does Tally ERP 9 show the GST reports.',
      },
      {
        q: 'How do I add the GST number to an existing company?',
        a: 'Press F11: Features > F3: Statutory & Taxation, set "Set/alter GST details" to Yes, and the GST Details screen opens with the current values. Enter or replace the GSTIN/UIN, confirm the state and registration type, set the GST applicable from date, then accept with Ctrl+A. You can also reach the same details by altering the company from F3: Cmp Info.',
      },
      {
        q: 'Why is Tally not accepting my GSTIN?',
        a: 'The usual causes are a wrong state code in the first two digits, an incomplete GSTIN (it is 15 characters), a registration type that does not match the number, a GST applicable from date later than the vouchers you are entering, or a GSTIN that is not active on the GST portal. Copy the GSTIN from your registration certificate rather than retyping it from memory.',
      },
      {
        q: 'Do I need GST details on party ledgers as well?',
        a: 'Yes, for correct tax treatment. Open the party ledger and enable GST and other statutory details, then fill in the party GSTIN and registration type (Regular, Composition, Unregistered or Consumer). Inter-state supply, reverse charge and unregistered-dealer purchases all read from those fields, so an empty party ledger silently produces the wrong tax.',
      },
    ],
    content: `Adding a GST number in Tally ERP 9 is a two part job: the company needs GST enabled and a GSTIN on record, and then every relevant party ledger needs its own GST details. Miss the second part and the tax on your invoices quietly goes wrong.

Step 1 - enable GST for the company:

- Open the Gateway of Tally
- Press F11: Features, then F3: Statutory & Taxation
- Set "Enable Goods and Services Tax (GST)" to Yes

Step 2 - open the GST Details screen and add the GSTIN:

- Still on that screen, set "Set/alter GST details" to Yes - this is the option that opens the GST Details screen. Setting only "Enable GST" turns the feature on without storing a number
- Enter the GSTIN/UIN, and check that the state matches your registration certificate - it defaults to the state chosen when the company was created
- Set the registration type: Regular, or Composition if you are under the composition scheme
- Set the GST applicable from date, and the periodicity of GSTR-1 (monthly or quarterly) to match your turnover slab
- Set "e-Way Bill applicable" and its threshold limit if you move goods, and turn on "Assessee of Other Territory" only if your unit is in an exclusive economic zone
- Accept with Ctrl+A

Step 3 - check the state code. The first two digits of a GSTIN are the state code, and the company state is what makes Tally treat a supply as intra-state or inter-state. Changing the state on the GST Details screen also changes the company master and affects how existing transactions are reported, so Tally warns you before it accepts the change. That warning is worth reading rather than dismissing.

Step 4 - fill in party ledger GST details. Open each party ledger, enable GST and other statutory details, and complete the party GSTIN and registration type. Inter-state supply, reverse charge on unregistered purchases and input credit all read from these fields - this is the step most businesses skip.

Changing a GST number later follows the same path: F11: Features > F3: Statutory & Taxation > "Set/alter GST details" to Yes, replace the GSTIN, and accept. The alteration also updates the company master, so the new number is used for vouchers and printed on invoices from that point. Reprint or re-check one invoice to confirm the change landed, and if your GSTIN changed because of a restructuring, review the party ledgers and stock items afterwards as well.

One thing to plan for while you are on Tally ERP 9: TSS renewal for Tally ERP 9 was discontinued for all customers from 16 August 2026, so statutory releases and compliance updates for that release have a fixed end point. A GST portal change that needs a Tally-side update will not be delivered to ERP 9 any more. If your filing depends on being current, check your TSS status and confirm your upgrade path to TallyPrime before a filing deadline forces the decision.

Sarvadnya Infotech is a Tally certified partner in CBD Belapur, Navi Mumbai. We set up and correct GST configuration in Tally ERP 9 and TallyPrime, handle TSS renewal and status checks, and support businesses across Mumbai, Navi Mumbai and India remotely.`,
  },
  {
    // CHANGE: 2026-11-03 — GSC 28d: 236 impressions, 1 click (0.42%), position 6.7. Both
    // spellings are searched - "tally capital" (35+19+9) and "tallycapital" (15) - and the old
    // title carried only the one-word form, which reads as a brand name and not as an answer.
    slug: 'what-is-tally-capital',
    title: 'What Is TallyCapital? Business Loans for TallyPrime Users Explained',
    seoTitle: 'Tally Capital (TallyCapital): What It Is',
    date: 'October 13, 2026',
    category: 'Business Finance',
    description: "Tally Capital, or TallyCapital, is the Tally group's business-loan service for existing Tally customers, applied for in TallyPrime. What approval depends on.",
    tags: ['what is tally capital', 'tallycapital', 'tally business loan', 'business loan for tally users', 'unsecured business loan msme', 'tally capital financing'],
    link: '/products/tallycapital',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'What is TallyCapital in simple terms?',
        a: 'TallyCapital is the financing service from the Tally group that offers business loans to existing Tally customers. Instead of a separate application portal, you check pre-qualified offers from inside TallyPrime and the lender reads the business data you already keep in Tally.',
      },
      {
        q: 'Who can apply for a business loan through TallyCapital?',
        a: 'Existing Tally customers - businesses already running their books on TallyPrime. The loan itself is sanctioned by TallyCapital partner banks and NBFCs, not by Tally, so the final decision, amount and rate rest with the lender.',
      },
      {
        q: 'Do I need collateral for a TallyCapital loan?',
        a: 'Not for the unsecured business loan, which is offered without pledging any asset. Secured options exist too, such as a loan against property, and there are government-backed CGTMSE products for eligible MSMEs.',
      },
      {
        q: 'Does checking my eligibility affect my credit score?',
        a: 'No. Checking whether you pre-qualify is designed to be a soft check and does not reduce your credit score. A formal application is a separate step that you choose to take.',
      },
    ],
    content: `TallyCapital is the financing arm of the Tally group, built for one specific audience: businesses that already keep their books on Tally. If you are a TallyPrime user wondering what it is and whether it applies to you, the short answer is that it turns the accounting data you already maintain into the basis of a business loan application.

What it actually does:

- Offers business loans to existing Tally customers, applied for from inside TallyPrime rather than from a separate portal
- Shows pre-qualified offers so you can see what you may be eligible for before you commit to anything
- Passes the decision to partner banks and NBFCs - TallyCapital is the channel, the lender makes the call
- Supports both unsecured and secured routes, and government-backed MSME credit

The options we help businesses with through TallyCapital:

- Unsecured business loans, which do not require you to pledge any asset
- CGTMSE-backed credit, the government credit guarantee route for eligible MSMEs
- Loans against property, for larger requirements where a property can be offered as security
- Professional loans for practising chartered accountants

Why it is different from a normal loan application: the paperwork already exists. Because your transactions, ledgers and financial reports live in Tally, the application is pre-filled from data you have been maintaining all along, instead of you assembling statements from scratch.

What it is not: it is not a Tally licence, not a Tally subscription, and not a guarantee. Approval depends on your financials and the lender's assessment. Treat it as a channel to funding, not as an entitlement - and before borrowing, be clear about what the money is for and how the instalments will be serviced.

Sarvadnya Infotech is a Tally certified partner in CBD Belapur, Navi Mumbai. If you are a Tally user evaluating a business loan, see the options on our TallyCapital page or talk to us - we will tell you plainly whether the route fits your situation.`,
  },
  {
    slug: 'document-management-system-for-tally',
    title: 'Document Management System in TallyPrime: Find Documents in Seconds',
    seoTitle: 'Document Management in TallyPrime',
    date: 'October 23, 2026',
    category: 'Tally Add-ons',
    description: 'Attach, open and email any document inside TallyPrime. Bills, challans and certificates stay linked to their voucher or master, audit-ready in one click.',
    tags: ['document management software companies', 'document management system for tally', 'document management system in tallyprime', 'document management software for tally', 'attach documents in tallyprime', 'attach and email documents in tallyprime', 'tally document management add on', 'tdl dms for tally', 'find documents in seconds', 'paperless documentation tally'],
    link: '/addons',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'What is a document management system for Tally?',
        a: 'It is an add-on module (a TDL or TCP extension) that lets you attach, organize and view digital copies of supporting documents directly inside TallyPrime or Tally ERP 9, linked either to a voucher or to a master such as a ledger.',
      },
      {
        q: 'Which file types can I attach to a Tally voucher?',
        a: 'The common working formats: PDF (GST certificates, scanned bills), Excel (rate charts), images such as JPG (product images) and Word documents such as agreement copies. That covers most of the paperwork a business actually has to file.',
      },
      {
        q: 'Where are the attached files stored?',
        a: 'In structured folders rather than loose files. A typical setup files them automatically by voucher type and financial year, either on local or network storage or in a cloud folder such as Google Drive or OneDrive, so a document is findable by period.',
      },
      {
        q: 'How does a document add-on help during an audit?',
        a: 'The source document sits on the transaction it belongs to, so proof documents are ready throughout the year. Instead of hunting through folders for a scanned bill, an auditor or your team opens it from the Day Book, a ledger view or the relevant report in seconds, then views, prints or emails it from the same screen.',
      },
      {
        q: 'Can I control who is allowed to see or upload attachments?',
        a: 'Yes. Attachment viewing and upload rights are set by user role, so an administrator can allow full access while staff can only attach or open what their role permits. Combined with audit logs, that keeps the document trail accountable.',
      },
      {
        q: 'Can I email an attached document from Tally itself?',
        a: 'Yes. The module can email the documents already attached to a voucher, and you can add external files to the same email, so a bill or challan can be re-shared with a client or a CA without leaving TallyPrime.',
      },
      {
        q: 'Which businesses get the most out of it?',
        a: 'Any business with heavy documentation, and especially chartered accountants, trusts and NGOs, C and F agents, schools and colleges, CHAs and transporters, where paperwork has to be found again months later.',
      },
    ],
    content: `A document management system for Tally is an add-on module - a TDL or TCP extension - that lets you attach, organize and open digital copies of supporting documents directly inside TallyPrime, linked either to a transaction or to a master. It does not replace Tally and nothing is re-keyed: the document sits where the entry already is.

The short version: attach once, then open or email it in a click. Every document stays linked to every transaction and master it belongs to, right inside TallyPrime.

Why it matters: most of the time lost to a GST notice, a statutory audit or a simple vendor query is not accounting time, it is document hunting. When the purchase invoice is attached to the purchase voucher, that search collapses into a click.

Three things happen in one place:

- Attach - one file or many, on any transaction or master
- Open and view - open any attachment from any screen, including the Day Book, a ledger view or the report
- Email - share or re-share without leaving TallyPrime, and add external files to the same email

Formats that cover real paperwork: PDF (GST certificates, scanned bills), Excel (rate charts), images such as JPG (product images) and Word documents such as agreement copies.

What you can attach, as a few examples:

- Company - company PAN, GST certificate
- Stock item - product image, rate chart
- Party master - GST certificate, PAN copy, agreement copy
- Transaction - invoices, purchase orders, any supporting document

Everything you need, one click away:

- Attach any number of documents, from any transaction or master level
- Open the attachment in a click, so there is no more document hunting
- Centrally stored - all documents in one place, linked to their record, without overlap
- Email with external files - email attached documents, or add outside documents too, directly from TallyPrime
- Dedicated report - view all attachments in a single report, separately for master level and transaction level

Find anything, any time. Nothing gets lost, because every document stays linked to its master or transaction and opens from the same screen - no searching, no digging through emails or WhatsApp chats.

No more audit panic: proof documents are ready throughout the year, remote or on premise. You are not sitting with your CA only to present papers, and for an online audit it is a single click - refer any digital document, view it, print it or email it, and re-share it with your clients or CA, with every document centrally located instead of scattered.

Made for businesses that run on paperwork:

- Chartered accountants - client records always at hand
- Trusts and NGOs - receipts and records in order
- C and F agents - consignment papers sorted
- Schools and colleges - admission and fee papers organised
- CHAs - clearance documents ready
- Transporters - trip papers linked to billing
- Any business with heavy documentation - paperless, centrally stored, no overlap

Storage and permissions are set up the way your office actually works. Files can live in structured local folders, on your network, or in a cloud folder, filed by voucher type and financial year so a document is findable by period. Viewing and upload rights are controlled by user role, so an administrator and a staff member see different things, and audit logs keep the trail accountable.

Most document management software companies sell a standalone system that you then have to feed from your accounting. A Tally integrated module works the other way around: the document is attached where the entry already is, so the trail from report to source document is unbroken.

What to check before you choose a module:

- Which voucher types and masters can hold attachments, and whether that covers your busy ones
- Whether storage is local, on your network, or cloud - and whether the cloud option fits your data policy
- How retention works, and whether the folder structure survives your financial year rollover
- What backs the attachments up, because an unbacked-up document store is a new risk, not a solved one
- Whether the vendor supports your exact Tally edition and release

If your team spends a working day every quarter hunting for scanned bills, an accounting linked document store pays for itself quietly. If you already have a neat physical filing system and no audit pressure, the case is weaker. The quickest way to judge it is a free demo - bring one messy voucher and your messiest folder.

Sarvadnya Infotech is a Tally certified partner in CBD Belapur, Navi Mumbai. We implement TallyPrime add-on modules and document attachment for TallyPrime and Tally ERP 9, configure storage and permissions with you, and support businesses in Mumbai, Navi Mumbai and across India. Call 022 49647959 or 022 49742200, WhatsApp +91 98709 42557, or email info@sarvadnyainfotech.com - see our add-ons page or ask us what fits your voucher flow.`,
  },
  // CHANGE: 2026-10-26 — replaces three pre-seed admin posts that had NO `slug` field.
  // Those docs could never be reached by the upsert below (it matches on `slug`) and could
  // never be deleted by REMOVE_SLUGS (also slug-based), so they sat outside this file's
  // control. One was actively WRONG after TSS renewal on Tally.ERP 9 was discontinued on
  // 16 Aug 2026 (it still urged "renew now at existing rates"); one described unverifiable
  // "AI features"; one announced an expired webinar. They are deleted by exact title
  // (LEGACY_UNSLUGGED_TITLES below) and their old title-derived URLs are 301-redirected in
  // next.config.js, so nothing already indexed turns into a 404.
  {
    slug: 'tally-prime-rental-vs-perpetual-licence',
    title: 'TallyPrime Rental vs Perpetual Licence: Which One Should You Buy?',
    seoTitle: 'TallyPrime Rental vs Perpetual',
    date: 'October 26, 2026',
    category: 'Tally Prime',
    description: 'Perpetual or rental TallyPrime licence: what each one buys, what happens when the term ends, and where TSS fits in. A plain comparison for Indian businesses.',
    tags: ['tally prime license', 'tally prime on rent', 'tally prime rental', 'tally prime perpetual license', 'tally prime subscription', 'tally license renewal'],
    link: '/products',
    author: 'Sarvadnya Infotech LLP',
    content: `TallyPrime can be held on two very different terms, and the difference only shows up on the day the term ends. On a perpetual licence you buy the right to use that edition and keep using it. On a rental licence you pay for a fixed period, and when that period is over the licence is over. Neither is a trick, but they behave nothing alike, so the decision belongs on how long you expect to use Tally - not on the first payment alone.

What a perpetual licence buys:

- The right to use one edition (Silver single user, Gold multi-user, Server client-server) on its licensed user count, with no end date
- TSS as a separate annual subscription on top of it. TSS is what keeps statutory releases, the connected services and support running
- Your data stays usable if TSS lapses: vouchers still open and entry still works, but statutory and e-invoice updates, the connected services (e-invoicing, e-way bill, GST returns, bank payments, mobile access) and support stop until TSS is renewed

What a rental licence buys:

- The same edition, for a defined term
- When the term ends the licence ends. There is no "keeps working after the term" fallback the way a perpetual licence has
- Renewing before the end date keeps you running. Letting it end means you stop using Tally until you renew

What is the same either way:

- The edition and the user count still decide what your team can do, whichever way you pay
- Every licence carries a serial number, and renewals, upgrades and support are all raised against it
- Your company data file is your own. How you pay for the licence does not change the file or require re-entry

How to see what you hold right now:

- In TallyPrime open F1 (Help) > Settings > License > Manage License
- That screen shows the edition, the serial number, and either the TSS expiry date (perpetual) or the licence end date (rental)
- When renewal is due, an Alt+R (Manage TSS Renewal) option appears on the Gateway of Tally

How to decide:

- If Tally is how the business runs its books and you expect to still be on it in three years, a perpetual licence is the simpler base
- If you need Tally for one project, one contract, a seasonal business or a short audit cycle, a term licence matches the work
- Compare the total cost across the years you expect to use it, and remember that TSS on a perpetual licence is an annual cost that does not disappear
- Ask before you assume. A lapsed TSS on a perpetual licence is not the same as an expired rental licence, and treating the two as one is the most common mistake we see

Sarvadnya Infotech handles TallyPrime licence purchases, TSS renewals and edition upgrades from CBD Belapur, Navi Mumbai for businesses anywhere in India. Send us the serial number from Manage License and we will tell you which licence you hold, when it ends or expires, and what the correct route is.`,
    faqs: [
      {
        q: 'Does TallyPrime stop working when TSS expires?',
        a: 'On a perpetual licence, no. The software still opens and you can still enter vouchers, but statutory releases, connected services such as e-invoicing and GST returns, and support stop until TSS is renewed. On a rental licence the licence itself ends when the term ends, so it must be renewed to keep using Tally.',
      },
      {
        q: 'Can I move from a rental licence to a perpetual one?',
        a: 'Yes. It is a licence change against the same serial number, not a reinstallation, and your company data file carries across unchanged. Ask us to check the current term first so the timing does not waste a period you have already paid for.',
      },
      {
        q: 'Where do I see whether my licence is perpetual or rental?',
        a: 'Open F1 (Help) > Settings > License > Manage License in TallyPrime. The screen shows the edition, the serial number, and either the TSS expiry date or the licence end date.',
      },
    ],
  },
  {
    slug: 'tallyprime-silver-gold-server-difference',
    title: 'TallyPrime Silver vs Gold vs Server: Which Edition Fits Your Team?',
    seoTitle: 'TallyPrime Silver, Gold, Server',
    date: 'October 26, 2026',
    category: 'Tally Prime',
    description: 'TallyPrime Silver, Gold and Server compared: single user, multi-user on a local network, and client-server - so you buy the edition your team will actually use.',
    tags: ['tally prime silver vs gold', 'tally prime gold vs server', 'tally prime editions', 'tally prime multi user', 'tally prime single user', 'tally prime server'],
    link: '/products',
    author: 'Sarvadnya Infotech LLP',
    content: `Three TallyPrime editions are sold, and the names describe how many people can work at once rather than how large the business is. Buying the wrong one costs twice - once for the licence you did not need, and again for the upgrade a few months later.

What each edition is for:

- Silver - single user. One person works in the company data at a time. Correct for an owner-operated business, a small office, or a firm where only one person ever keys in
- Gold - multi-user on a local network. The data lives on one machine and the other users connect to it over the office network. Correct when several people key vouchers or raise bills from the same premises
- Server - the client-server edition, for a larger or more distributed footprint where several users work at once and the load has to spread beyond one desktop. Licensed separately from Gold

What actually decides it - not "how many employees", but "how many people need to be inside Tally at the same moment":

- Count the people working in Tally during your busiest hour, not the headcount on the payroll
- Note whether they all sit in one office. Gold assumes a local network; people spread across sites or working from home need a different answer, and that is a separate decision about how they reach the data
- Be honest about the next twelve months. Buying Gold because "we might grow" when one person keys data wastes money; buying Silver and then finding four people keying every day means paying twice

Changing edition later:

- Upgrading from Silver to Gold, or Gold to Server, is a licence change, not a data migration. The same company data file carries your masters and vouchers across
- TSS renewal, support and cloud backup continue against the same serial number
- The edition in use, the serial number and the licensed user count are shown in F1 (Help) > Settings > License > Manage License

Before you buy:

- Confirm the edition you already hold, so you are not sold a second licence you do not need
- Confirm whether TSS is current, because a new licence and an active subscription are two different payments
- Confirm where the company data will live, and who backs it up

Sarvadnya Infotech sells and supports all three TallyPrime editions from CBD Belapur, Navi Mumbai. Tell us how many people need to work in Tally at the same time and where they sit, and we will tell you the edition that fits - compare them on our products page or talk to us directly.`,
    faqs: [
      {
        q: 'Can two people work in TallyPrime Silver at the same time?',
        a: 'No. Silver is a single-user licence, so one person works in the company data at a time. If two or more people must key vouchers simultaneously, Gold (multi-user on a local network) or Server is the correct edition.',
      },
      {
        q: 'Do I lose my data if I upgrade from Silver to Gold?',
        a: 'No. The edition upgrade is a licence change, not a data migration. Your existing company data file opens in the new edition with masters and vouchers intact.',
      },
      {
        q: 'Is TallyPrime Server included with Gold?',
        a: 'No. Server is licensed separately from Gold. It is the client-server edition for a larger or more distributed footprint, not an add-on to a Gold licence.',
      },
      {
        q: 'How do I know how many users my current licence allows?',
        a: 'Open F1 (Help) > Settings > License > Manage License. The screen shows the edition in use, the serial number and the licence details.',
      },
    ],
  },
  {
    slug: 'tally-custom-modules-supply-chain',
    title: 'Tally Custom Modules for Supply Chain: What a TDL Module Can Do',
    seoTitle: 'Tally TDL Modules for Supply Chain',
    date: 'October 26, 2026',
    category: 'Tally Add-Ons',
    description: 'How a Tally TDL module fits around transport, container handling, clearing and forwarding, and warehousing - and when it beats a spreadsheet.',
    tags: ['tally custom module', 'tally tdl module', 'tally supply chain', 'tally transport module', 'tally container handling', 'tally warehouse module'],
    link: '/modules',
    author: 'Sarvadnya Infotech LLP',
    content: `A Tally module is TDL (Tally Definition Language) code that wraps one business line inside Tally. It does not replace Tally - it adds the screens, reports and controls your operation runs on but that Tally does not ship by default. For supply chain teams that is usually the difference between Tally holding the accounts and Tally holding the operation.

What supply chain teams actually ask for:

- Job-wise costing, so each consignment, container or clearing job shows its own revenue, direct costs and margin
- Transporter-wise and route-wise reports, instead of retyping freight into a spreadsheet to find out which lane is losing money
- Container and consignment tracking, with the packing, weight and document detail that travels with it
- Warehouse invoices that carry the right packing and handling detail, not a generic tax invoice
- Control points, so a dispatch or a rate change cannot be made by whoever happens to be at the keyboard

When a module beats a workaround:

- If the answer today is a spreadsheet someone fills every morning, a module is usually cheaper than the hours it removes
- If a report has to be retyped every month, the module prints it from the same vouchers your accounts team already entered
- If a control depends on someone remembering, the module enforces it at the moment of entry

Ready-made modules we run today:

- Transport business module - trip-level operations and billing inside Tally
- Container handling module - logistics detail attached to the voucher instead of a separate register
- Clearing and forwarding (CFA) module - job creation and import, multi-currency invoicing, reimbursable expense fetch, job closure and job-wise profitability
- Warehouse management with invoice format - packing and handling detail printed on the invoice itself

The full ready-made list, with what each one changes on screen, is on our shop page. The larger vertical solutions built around a single business type are on the modules page.

What a module will not do:

- It will not fix inconsistent masters. If items, parties or godowns are duplicated across the business, the new report will be consistently wrong
- It will not replace a decision. A module can show that a lane is unprofitable; it cannot choose the carrier
- It is not free-standing. It runs inside a licensed TallyPrime installation, and where it depends on current statutory or connected services it needs an active subscription

If your workflow is not in the catalogue:

- The modules above cover the common supply chain shapes, but every business has one report nobody else asks for
- Custom TDL is built the same way each time: a short requirement conversation about the exact screen, report or control; a scope you approve; development and testing against a copy of your own data; then installation and a walkthrough with the people who will use it
- You are not asked to describe the code. You describe the document you wish Tally would print

Sarvadnya Infotech builds and supports Tally TDL modules from CBD Belapur, Navi Mumbai. Tell us the report or control you are missing and we will say whether a ready-made module already does it or whether it needs a build.`,
    faqs: [
      {
        q: 'What is a TDL module in Tally?',
        a: 'TDL (Tally Definition Language) is the language used to extend Tally. A module is TDL code that adds screens, reports and controls for one business line - for example job-wise costing for a clearing and forwarding agency - without replacing Tally itself.',
      },
      {
        q: 'Can a module be built for my exact report?',
        a: 'Yes. Custom TDL is built from your requirement: you show us the report, screen or control you need, we scope it, build it, and test it against a copy of your data before installing it.',
      },
      {
        q: 'Do I need TSS for a custom module to work?',
        a: 'The module runs inside your licensed TallyPrime installation. Where it depends on current statutory or connected services, an active TSS keeps those running, so we check the subscription before a build.',
      },
    ],
  },
  // CHANGE: 2026-11-17 — audit cluster for the Document Management System page. Owner:
  // "create few articles on struggles of audit and solution for ease in audit, and attach
  // documents in tallyprime ... tally only stores links to these files and supports multiple
  // formats ... for SEO and title, focus on audit solution and best preparation for audit".
  // Three posts, distinct search intents (checklist / how it works / problem+solution), all
  // pointing at /modules/document-management. Facts limited to the brochure plus the owner's
  // storage statements: Tally keeps the link, the file stays where the business keeps it,
  // no dedicated server and no extra cloud space, PDF/Excel/Word/images supported.
  {
    slug: 'audit-preparation-checklist-small-business',
    title: 'Audit Preparation Checklist for Small Businesses: Keep Every Proof Ready',
    seoTitle: 'Audit Preparation Checklist',
    date: 'November 17, 2026',
    category: 'Tally Add-ons',
    description: 'A practical audit preparation checklist: the documents an auditor asks for, how to file them through the year, and how to reach any proof in a click.',
    tags: ['audit preparation checklist', 'how to prepare for audit', 'documents required for audit', 'audit preparation for small business', 'statutory audit checklist india', 'audit ready documents', 'gst audit documents', 'tallyprime audit preparation'],
    link: '/modules/document-management',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'What documents should I keep ready before an audit?',
        a: 'Every voucher needs its proof: sales invoices with challans or e-way bills, purchase invoices with the supplier bill and delivery note, bank statements with reconciliation, GST returns and tax paid challans, TDS returns, loan and rent agreements, fixed asset bills, salary registers with PF and ESI challans, and stock verification sheets. Keep them in the same place all year and the audit file builds itself.',
      },
      {
        q: 'How early should audit preparation start?',
        a: 'It starts on the day a voucher is entered, not a month before the audit. If the supporting document is attached to the entry at that moment, preparation costs seconds per voucher. If it is left for later, someone has to rebuild the trail from folders, email and WhatsApp.',
      },
      {
        q: 'The auditor is online and wants a bill right now. What helps?',
        a: 'A document that opens from the voucher itself. In TallyPrime that is what an attachment module does - open the entry the auditor named, and the bill, challan or certificate opens from the same screen and can be emailed on the spot.',
      },
      {
        q: 'Do I need to scan every bill?',
        a: 'No. Scan what the audit samples, what statutory proof depends on, and what a customer or supplier may question later. Most businesses scan purchase invoices, statutory certificates, agreements and payment proof, and keep the rest as a numbered physical file.',
      },
      {
        q: 'Does attaching documents make my Tally data heavier?',
        a: 'No. The attachment module stores only a reference to the file, and the file stays in the folder you keep it in. Your company data does not grow by the size of the documents, and no separate server or extra cloud storage is needed.',
      },
      {
        q: 'What breaks an otherwise organised audit file?',
        a: 'Moved folders, renamed files and unlabelled scans. A link is only as good as the file behind it, so the document folder must be backed up, and folders should not be moved or renamed without telling the person who maintains the module.',
      },
    ],
    content: `An audit rarely goes badly because the books are wrong. It goes slowly because the proof takes a week to assemble. The auditor picks a sample, asks for the bill behind one entry, and three people start opening cupboards, scrolling a phone gallery and searching a WhatsApp group.

Audit preparation is not a project for the month before the audit. It is a filing habit followed through the year. This is the checklist we share with businesses in Navi Mumbai when they ask how to get ready without a week of overtime.

What an auditor actually asks for

- Sales invoices, with the matching delivery challan or e-way bill
- Purchase invoices, with the supplier bill, delivery note or goods receipt
- Bank statements for every month, with the reconciliation
- GST returns, the GSTR-2B reconciliation and the challans for tax paid
- TDS returns and the payment challans behind them
- Ledger confirmations from the major debtors and creditors
- Loan sanction letters, agreements and the interest working
- Fixed asset bills, with registration or warranty papers where they apply
- Salary registers, PF and ESI challans, and appointment letters
- Rent agreement, electricity bills and other expense proof
- Stock statements and the physical verification sheets
- Statutory registers and board minutes

The pattern is simple: every entry has a supporting document, and the auditor wants to see the entry and the document side by side.

The four things that turn preparation into a week of work

- A voucher whose supporting bill is in a drawer, a phone gallery or a chat
- A scan saved with a name nobody can search for
- Three versions of the same agreement, with no way to tell which is final
- A document store that only one person knows how to navigate

None of these are accounting problems. They are retrieval problems, and they are the reason audit weeks feel longer than they are.

What good preparation looks like through the year

- Attach the proof to the voucher on the day the voucher is entered
- Name the scan before saving it: party, document type, month
- File by financial year first, then by voucher type
- Document each master once - GST certificate, PAN, signed agreement
- Review the attachments report once a month, not once a year
- Confirm your backup covers the document folder, not only the Tally data

That last point is the one most businesses miss. A back-up of Tally without the document folder restores a ledger full of links to files that no longer exist.

Where a TallyPrime attachment module fits

- Tally stores only the link to each file; the document stays in the folder you keep it in
- No dedicated document server and no extra cloud storage to buy
- Your company data does not grow by the size of the documents
- PDF, Excel, Word and image files all attach without conversion
- Attach at company, stock item, party master and transaction level
- Open the file from the voucher, a ledger view, the Day Book or the attachments report
- Email the attached documents, or add outside files to the same email, from TallyPrime
- View and upload rights follow the user role, with an audit log behind them

For an on-site audit the entry and its proof are on one screen. For an online audit the same document can be emailed while the auditor is still on the call, which is usually the difference between a question answered today and a query pending for a week.

Because Tally keeps a reference and not a copy, the folder you point it at becomes the source of truth. Two rules follow from that. Do not move or rename that folder without telling whoever maintains the module, and make sure it is included in your backup. A link to a deleted file is worse than no link at all.

A ten minute test you can run today

- Pick a purchase voucher from eight months ago and time how long the bill takes to find
- Ask a second person to do the same, without help
- Open a party master and find its GST certificate
- Email one attached document to an outside address
- Check whether the folder those files live in is inside your backup

If any of those five steps takes more than a minute, the audit will too. The fix is not more staff in March. It is attaching the document when the entry is made.

Sarvadnya Infotech is a Tally certified partner in CBD Belapur, Navi Mumbai. We implement the Document Management System for TallyPrime, set up the folder structure and permissions with your team, and support businesses across Mumbai, Navi Mumbai and India. Call 022 49647959 or 022 49742200, WhatsApp +91 98709 42557, or email info@sarvadnyainfotech.com for a free demo - bring one old voucher and the folder you keep its bill in.`,
  },
  {
    slug: 'attach-documents-in-tallyprime',
    title: 'Attach Documents in TallyPrime Without Extra Server or Disk Space',
    seoTitle: 'Attach Documents in TallyPrime',
    date: 'November 17, 2026',
    category: 'Tally Add-ons',
    description: 'Attach bills, challans and certificates to any TallyPrime voucher. Tally stores only the link, the file stays in your own folder - no server, no cloud space.',
    tags: ['attach documents in tallyprime', 'attach bills to tally voucher', 'tally document attachment', 'document management system for tally', 'tally stores link to document', 'tally document management without server', 'tallyprime audit documents', 'paperless documentation tally'],
    link: '/modules/document-management',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'Where is the attached document actually stored?',
        a: 'Wherever you keep it. The module records a link to the file, and the file stays in a folder on your own computer, a shared network folder, or a folder you already use. Nothing is copied into the Tally company data.',
      },
      {
        q: 'Does attaching files increase the size of my Tally data?',
        a: 'No. Only the reference is stored, so the company data does not grow by the size of the documents. A thousand scanned bills do not turn into a thousand bills worth of database.',
      },
      {
        q: 'Do I need a dedicated server or extra cloud storage?',
        a: 'No. There is no separate document server to run and no additional cloud space to purchase. If the folder is reachable from the machine running Tally, the attachment opens.',
      },
      {
        q: 'Which file formats can I attach?',
        a: 'PDF, Excel, Word and image files such as JPG. Scanned bills, GST certificates, rate charts, product images and agreement copies all attach as they are, with no conversion step.',
      },
      {
        q: 'What can a document be attached to?',
        a: 'A transaction such as an invoice or purchase order, or a master such as the company, a stock item or a party ledger. Company PAN and GST certificate, product images and rate charts, party GST and PAN copies, and any voucher document are the common cases.',
      },
      {
        q: 'Can staff see documents they should not?',
        a: 'View and upload rights are set by user role, so an administrator and a staff member see different things. Audit logs keep the trail of who attached or opened what.',
      },
      {
        q: 'What happens if someone moves or deletes the file?',
        a: 'Tally holds a link, so the link breaks if the file is moved or deleted. Keep the document folder inside your backup, and tell whoever maintains the module before you rename or relocate it.',
      },
    ],
    content: `Attaching a document in TallyPrime means linking a file to the entry it belongs to: the purchase invoice to the purchase voucher, the GST certificate to the party ledger, the rate chart to the stock item. The file does not move into Tally. Tally keeps the link, and the file stays where you already keep it.

That one design choice answers most of the questions businesses ask before they buy an attachment module.

Does it eat disk space

- No. The company data stores a reference to the file, not the file
- A scanned bill on your drive does not add its size to the Tally data
- There is no duplicate copy sitting inside the database and on the disk
- Backups of Tally data stay the size they already were

Do I need a server or cloud space

- No dedicated document server to run
- No extra cloud storage to buy for the module
- The folder can be on the machine running Tally, on a shared office machine, or in a place your team already uses
- If Tally can reach the file, the attachment opens

Where the files live, and what that means

Because the file stays outside Tally, the folder you point the module at is the real document store. Two practical rules follow.

- Include that folder in your backup, not just the Tally data
- Do not rename or move it without telling whoever maintains the module

A link to a missing file is more confusing than no link, so the folder and the module are maintained together.

What you can attach, and in which format

- PDF - scanned purchase bills, GST certificates, signed agreements
- Excel - rate charts, working sheets, price lists
- Word - agreement copies, letters, terms documents
- Images such as JPG - product photos, courier proof, site pictures

The documents attach as they are. There is no conversion step and no requirement to rebuild a scan in another format.

Where an attachment can sit

- Company level - company PAN, GST certificate
- Stock item - product image, rate chart
- Party master - GST certificate, PAN copy, agreement copy
- Transaction - invoices, purchase orders, delivery proof, any supporting paper

Attach one file or many at any of those levels. The document is then available from the same screen the entry is on, and from the single attachments report that lists everything by master and by transaction.

Attaching is only half of it

A file that is saved somewhere but impossible to find has not solved anything. The other half is retrieval.

- Open the attachment in a click from any transaction or master
- See every attachment in one report, split by master and transaction
- Email the attached documents, and add outside files to the same email
- Print from the same screen when someone wants paper

During an audit this is the difference between a question answered in seconds and a query that stays open for days, whether the auditor is sitting next to you or working remotely.

Set it up with your own filing logic

Storage is organised the way your office already works. A common setup files documents in structured folders by voucher type and financial year, so a bill from a given period is findable by period, not by memory. Rights are set by user role, so an administrator can attach and view everything while a billing clerk only handles what the role allows, and the audit log records the activity.

What to check before you install one

- Which voucher types and masters can hold attachments, and whether that covers your busy ones
- Where the files will be stored, and whether that folder is backed up
- How the folder structure survives your financial year rollover
- How the module behaves if a file is moved or renamed
- Whether the vendor supports your exact TallyPrime release

Sarvadnya Infotech is a Tally certified partner in CBD Belapur, Navi Mumbai. We implement the Document Management System for TallyPrime, agree the folder structure and permissions with your team, and support businesses across Mumbai, Navi Mumbai and India. Call 022 49647959 or 022 49742200, WhatsApp +91 98709 42557, or email info@sarvadnyainfotech.com. A free demo takes one opened voucher to show the whole flow from entry to attached bill.`,
  },
  {
    slug: 'audit-document-struggles-and-solutions',
    title: 'Seven Document Struggles That Slow Down Every Audit, and How to Fix Them',
    seoTitle: 'Seven Audit Document Struggles',
    date: 'November 17, 2026',
    category: 'Tally Add-ons',
    description: 'Late bills, missing challans, phone scans and a folder nobody can search. Seven document problems that stretch an audit, with the practical fix for each.',
    tags: ['audit problems and solutions', 'audit document management', 'documents missing during audit', 'audit solution for business', 'speed up audit', 'audit preparation tips', 'tallyprime audit solution', 'document management audit'],
    link: '/modules/document-management',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'Why do audits take longer than the accounting work suggests?',
        a: 'Because the time goes into retrieving proof, not checking entries. A sampled voucher is quick to check and slow to prove when the bill, challan or certificate has to be found in a folder, an inbox or a phone.',
      },
      {
        q: 'What is the single biggest fix for a slow audit?',
        a: 'Attach the supporting document to the voucher at the time of entry. Everything else - folders, naming, reports - is easier once the document and the entry are already connected.',
      },
      {
        q: 'Can a small business prepare for an audit without extra staff?',
        a: 'Yes, if the work is spread through the year instead of collected at the end. Attaching a file takes seconds per voucher, while reconstructing a year of proof takes days and usually involves overtime.',
      },
      {
        q: 'Do I need to buy storage or a server for this?',
        a: 'No. A TallyPrime attachment module keeps only the link to the file, and the file stays in the folder you already use. No dedicated server and no additional cloud space are required.',
      },
      {
        q: 'Which documents should never be left without an attachment?',
        a: 'Purchase invoices, statutory certificates, loan and rent agreements, payment proof for tax and TDS, and anything a customer, supplier or auditor is likely to question months later.',
      },
    ],
    content: `Every business that has been through an audit knows the shape of the problem. The accounts are ready. The auditor is ready. What is missing is a bill from October, a challan that was signed at the gate, and the certificate that was sent on WhatsApp in a different financial year.

Here are the seven document struggles we hear about most, and the practical fix for each one.

One: the bill lives in a drawer

The purchase voucher exists, the supplier has been paid, and the bill is in a physical file that only the accountant knows how to navigate.

The fix: attach the bill to the voucher on the day it is booked. A scanned copy in the entry takes seconds, and the physical file becomes a backup rather than the only source.

Two: the scan is named IMG_2024 something

A phone gallery full of unlabelled photographs is not a document store. Nobody can search it and nobody can prove which bill belongs to which voucher.

The fix: name the file before saving it - party, document type, month. Better still, let the module file it into structured folders by voucher type and financial year, so the naming convention is enforced instead of remembered.

Three: three versions of the same agreement

A draft, a signed copy and a scanned copy circulate, and no one is certain which one the auditor should see.

The fix: attach the final signed version to the party master, and treat that as the record. Drafts stay outside the store, and the version question disappears.

Four: the document is in someone's email

The certificate was received in March, forwarded twice, and now lives in one person's inbox.

The fix: attach it to the master it belongs to when it arrives, and email it from TallyPrime next time it is needed. The mailbox stops being a filing system.

Five: the audit is online and the documents are on one desktop

Remote audits expose every retrieval weakness at once. The auditor asks for a bill and someone has to be physically at the machine that holds it.

The fix: an attachment module that opens the file from the voucher and can email it from the same screen. No screen sharing of folders, no waiting for the person who sits at that desk.

Six: nothing proves the payment

The bill is there, the ledger shows the payment, and no one can produce the bank reference or the cheque image.

The fix: attach payment proof to the payment voucher as well as the bill to the purchase voucher. When the trail is bill, entry and bank proof together, most queries close at the first question.

Seven: the folder was reorganised over a weekend

Someone tidied the shared drive, renamed three folders, and every reference to the old paths is now broken. This is the one failure mode that a link-based store creates if it is managed carelessly.

The fix: treat the document folder as part of your accounting system. Put it in the backup, agree that it is not renamed without notice, and move files through the module rather than behind it.

What these seven have in common

None of them are accounting mistakes. All of them are retrieval failures, and all of them are prevented by the same habit: connect the document to the entry when the entry is made.

That is what a TallyPrime attachment module does, and it is why the storage model matters. The file stays in your own folder, Tally keeps only the link, and your company data does not grow by the size of the papers. There is no dedicated server to maintain and no extra cloud space to buy. PDF, Excel, Word and image files all attach without conversion, at company, stock item, party master and transaction level.

What preparation looks like in practice

- Attach on the day of entry, not in the week before the audit
- Keep statutory certificates on the masters they belong to
- Review the attachments report monthly and fill the gaps early
- Keep the document folder inside the backup
- Set view and upload rights by role, and rely on the audit log
- For an online audit, email from the same screen the entry is open on

A quieter audit season

The purpose is not to impress an auditor. It is to stop losing working days to a search for paper. Teams that attach as they go usually find that the audit becomes a review of the books rather than an investigation of the filing cabinet.

Sarvadnya Infotech is a Tally certified partner in CBD Belapur, Navi Mumbai. We implement the Document Management System for TallyPrime, set up storage, folder structure and permissions with your team, and support businesses in Mumbai, Navi Mumbai and across India. Call 022 49647959 or 022 49742200, WhatsApp +91 98709 42557, or email info@sarvadnyainfotech.com to book a free demo.`,
  },
  {
    // CHANGE: 2026-11-28 — new task-based post for the bank-import query cluster. Links to the
    // existing shop deep link; no tool page is invented. ASCII-only per house rule.
    slug: 'bank-statement-import-tallyprime',
    title: 'Import a Bank Statement into TallyPrime: Steps and Setup',
    seoTitle: 'Import Bank Statement in TallyPrime',
    date: 'November 28, 2026',
    category: 'How To',
    description: 'Bring a bank statement into TallyPrime, match receipts and payments, and finish the reconciliation without typing each line twice.',
    tags: ['bank statement import', 'bank import tally', 'auto bank reconciliation', 'tallyprime banking', 'brs in tallyprime'],
    link: '/shop#excel-bank-statement-import',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'Can TallyPrime import a bank statement?',
        a: 'Yes. Banking > Bank Reconciliation, select the bank ledger and use Import Statement. TallyPrime reads the statement export and matches entries by amount and date. You review the unmatched lines before accepting the reconciliation.',
      },
      {
        q: 'Why did the imported entries not match?',
        a: 'Check three things first: the date range on the export, the bank ledger selected in TallyPrime, and whether TSS is active. Auto bank reconciliation is a TSS-connected service, so an expired subscription stops the matching even when the import file is correct.',
      },
    ],
    content: `Importing a bank statement into TallyPrime is a reconciliation job, not a data-entry job. The software reads the statement, proposes matches against your ledger entries, and leaves you the exceptions to review.

Start from the right screen

1. Open Banking > Bank Reconciliation from the Gateway of Tally.
2. Select the exact bank ledger the statement belongs to. If you run more than one account, select the right one before importing, or the proposed matches will be wrong.
3. Choose Import Statement and pick the export file from your bank. CSV, OFX and QIF exports are the common formats used for this.
4. Set the date range to the period you are reconciling. A whole-year file makes review slower without adding accuracy.
5. Let TallyPrime match by amount and date, then review the unmatched lines one by one.

What the match actually does

A matched line confirms that the entry in your books and the entry in the bank statement are the same payment or receipt. It does not create an accounting entry by itself. If a bank line has no matching voucher, you still need to record that receipt or payment in TallyPrime before the reconciliation can close.

Before you blame the import file

Auto bank reconciliation is one of the services that depends on an active TSS subscription. If TSS has lapsed, the import may read the file but the automatic matching will not work. Check F1 (Help) > Settings > License > Manage License before spending time re-exporting the statement.

When the statement arrives as an Excel sheet

Some banks export a spreadsheet rather than a clean CSV, and some businesses keep a sheet of bank lines prepared by their accountant. Our shop has a ready-made bank statement importer that creates the matching receipt and payment entries from those rows, leaving only the reconciliation to finish. See the bank statement importer in the shop: [[Bank Statement Import|/shop#excel-bank-statement-import]]

A short close checklist

- Import into the correct bank ledger, every time
- Keep the export date range aligned with the period you are closing
- Record the vouchers for unmatched bank lines before accepting
- Check TSS status when matching stops working suddenly
- Keep the export file with the period's working papers

Sarvadnya Infotech is a Tally certified partner in CBD Belapur, Navi Mumbai. We set up bank reconciliation and importers for businesses across Mumbai, Navi Mumbai and India, and our AMC team handles the exceptions that a file cannot resolve. Call 022 49647959 or 022 49742200, WhatsApp +91 98709 42557, or email info@sarvadnyainfotech.com.`,
  },
  {
    // CHANGE: 2026-11-28 — new task-based post for the Excel-to-Tally query cluster. Links to the
    // existing grouped shop view; no second catalogue is declared here. ASCII-only.
    slug: 'excel-to-tally-import-vouchers-masters',
    title: 'Excel to Tally Import: Move Vouchers and Masters Without Retyping',
    seoTitle: 'Excel to Tally Import: Step Guide',
    date: 'November 28, 2026',
    category: 'How To',
    description: 'A practical guide to Excel to Tally import: which masters to load first, how voucher rows become entries, and where the ready-made importers live.',
    tags: ['excel to tally import', 'excel to tally', 'bulk voucher import', 'tally data import', 'import masters in tallyprime'],
    link: '/shop?group=excel',
    author: 'Sarvadnya Infotech LLP',
    faqs: [
      {
        q: 'What can be imported from Excel into TallyPrime?',
        a: 'Masters such as ledgers and stock items, and accounting vouchers. The shop also carries focused importers for bank statements and other repeat jobs, each with a plain-language description of the rows it accepts.',
      },
      {
        q: 'Do I need to create the ledgers before importing vouchers?',
        a: 'Yes. Import the masters first so every row can point at a real ledger or stock item. A voucher row that names a ledger TallyPrime cannot find will be rejected at validation.',
      },
    ],
    content: `Excel to Tally import is the fastest way to move a month of entries that already sit in a spreadsheet. The work is mostly preparation: get the columns right, load the masters first, and validate a small batch before you import everything.

Order matters: masters before vouchers

Create or import the ledgers, stock items and any other masters first. A voucher row refers to a ledger by name, and a name TallyPrime cannot resolve will fail validation. If you import five hundred rows and half of them fail, the cause is nearly always a master that was not loaded or a name that does not match exactly.

How a voucher row becomes an entry

A voucher importer reads each row as one accounting entry: the date, the ledger, the amount and a narration. For a single-ledger debit and credit importer, each row becomes one voucher with one ledger debited and one credited. That suits a sheet where every line already balances.

Pick the importer that matches the sheet

Our shop keeps the Excel importers together under one group, so you can compare what each one does without reading a price list. The all-vouchers importer covers general accounting vouchers; separate importers cover bank statements and other specific jobs. Each entry says plainly what it reads and what it creates. Browse the Excel group: [[Excel to Tally Importers|/shop?group=excel]]

Run a small validation batch

Before the full file, import five rows: one normal entry, one with a narration, and one that you expect to fail. Check how the five landed in TallyPrime. If the dates, ledgers and amounts are right, the remaining rows will behave the same way. If a row fails, fix the column or the master name before scaling up.

Keep the original sheet

The spreadsheet is your audit trail for the import. Keep it with the period's working papers, along with a note of which importer was used. That makes a later question about a single entry answerable in minutes.

Sarvadnya Infotech is a Tally certified partner in CBD Belapur, Navi Mumbai. We configure importers for your exact sheet, validate the first batch with you, and support the setup across Mumbai, Navi Mumbai and India. Call 022 49647959 or 022 49742200, WhatsApp +91 98709 42557, or email info@sarvadnyainfotech.com.`,
  },
];

// CHANGE: 2026-11-28 — the filter is the single retirement switch. Maintenance scripts import
// `posts`, so they see exactly what the seed will write to the live collection.
export const posts = ALL_POSTS.filter(p => !REMOVED_NEWS_SLUGS.includes(p.slug));

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const col = db.collection('news');

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let removed = 0;

    // CHANGE: 2026-09-16 — slugs removed from this file must also leave the live
    // collection, otherwise stale posts keep ranking and showing in /news, /sitemap.xml
    // and the search API. REMOVE_SLUGS is additive-on-purpose: it never deletes
    // admin-authored posts that were never seeded here.
    // CHANGE: 2026-11-28 — retired generic posts are deleted from the live collection on the
    // next seed, not just hidden, so /news, search and the sitemap all lose them together.
    const REMOVE_SLUGS = ['tally-dealers-mumbai', ...REMOVED_NEWS_SLUGS];

    for (const slug of REMOVE_SLUGS) {
      const res = await col.deleteOne({ slug });
      if (res.deletedCount) {
        removed++;
        console.log(`Removed legacy news post: ${slug}`);
      }
    }

    // CHANGE: 2026-10-26 — three pre-seed admin posts were saved WITHOUT a `slug`, so neither
    // the slug-keyed upsert below nor REMOVE_SLUGS could ever reach them. They were replaced by
    // the three factual posts at the end of `posts` (rental vs perpetual licence, Silver/Gold/
    // Server editions, supply-chain modules). Deletion is by EXACT title AND `slug` absent, so a
    // future admin post that happens to reuse a title but has its own slug is never touched.
    // Their old title-derived URLs are 301-redirected in next.config.js.
    const LEGACY_UNSLUGGED_TITLES = [
      'ERP 9 is set to change significantly from 1st July 2026',
      'New TallyPrime v7.0 Released with Advanced AI Features!',
      'Upcoming Webinar: Optimizing Your Supply Chain with Tally Custom Modules.',
    ];

    for (const title of LEGACY_UNSLUGGED_TITLES) {
      const res = await col.deleteOne({ title, slug: { $exists: false } });
      if (res.deletedCount) {
        removed++;
        console.log(`Removed legacy unslugged news post: ${title}`);
      }
    }

    for (const post of posts) {
      const existing = await col.findOne({ slug: post.slug });
      const doc = { ...post, updatedAt: new Date() };
      if (existing) {
        // CHANGE: 2026-08-31 — skip only when content AND description match,
        // so future description tweaks also get seeded.
        // CHANGE: 2026-09-07 — also compare date, so purely date refreshes apply.
        // CHANGE: 2026-09-16 — also compare tags, so tag-only edits (dealer scrub) propagate.
        // CHANGE: 2026-10-07 — also compare title and faqs, so the P1 retitle and the new
        // FAQ block (FAQPage JSON-LD source) propagate to the live doc.
        // CHANGE: 2026-10-30 — also compare seoTitle. 25 posts had titles of 71-107 chars in
        // the rendered <title> (check:seo TITLE_MAX = 60 incl. the 25-char brand suffix), so a
        // short SERP title was added to each. Without this field in the comparison the new
        // seoTitles would never reach the live docs - the seed would report "unchanged".
        const same = existing.content === post.content
          && existing.description === post.description
          && existing.date === post.date
          && existing.title === post.title
          && (existing.seoTitle ?? null) === (post.seoTitle ?? null)
          && JSON.stringify(existing.tags ?? null) === JSON.stringify(post.tags ?? null)
          && JSON.stringify(existing.faqs ?? null) === JSON.stringify(post.faqs ?? null);
        if (same) { skipped++; continue; }
        await col.updateOne({ slug: post.slug }, { $set: doc });
        updated++;
      } else {
        await col.insertOne({ ...doc, createdAt: new Date() });
        inserted++;
      }
    }

    const total = await col.countDocuments({});
    console.log(`Seeded news posts -> inserted: ${inserted}, updated: ${updated}, skipped(unchanged): ${skipped}, removed: ${removed}`);
    console.log(`Total news documents now: ${total}`);
  } catch (error) {
    console.error('Error seeding news:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

// CHANGE: 2026-11-03 — run only when this file is executed directly. `node scripts/seed_news.mjs`
// still matches (argv[1] is this file), but `import { posts } from './seed_news.mjs'` no longer
// triggers a full seed against the live cluster.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed();
}