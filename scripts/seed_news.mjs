// CHANGE: 2026-08-31 - Seed keyword-targeted blog posts into the shared `news` collection.
// Converts the news section into an SEO blog. Targeting the winnable queries from Search Console:
//   - Tally-product queries: tally partner mumbai, tally dealers mumbai, tally erp 9 add ons,
//     tally tss renewal, tally 3 star partner mumbai, cloud tally in {city}
//   - Local SEO: it companies in belapur, software companies in navi mumbai, cbd belapur
// Each post uses an explicit clean `slug` + the legacy admin fields (title/date/category/
// description/content/link) so the frontend blog (/news/[slug]) renders it with zero admin changes.
//
// Idempotent: upserts by slug - existing docs are left untouched, so this never clobbers posts
// created/edited from the admin panel.
//
// Run:  node scripts/seed_news.mjs   (MONGODB_URI from .env)

import { MongoClient } from 'mongodb';
import 'dotenv/config';

const posts = [
  {
    slug: 'tally-partner-mumbai',
    title: 'How to Choose the Right Tally Partner in Mumbai: A Complete Checklist',
    date: 'August 30, 2026',
    category: 'Tally Partner',
    description: 'A practical checklist for choosing a Tally partner in Mumbai - certification level, TSS renewal, support SLA, cloud backup and add-on capability.',
    tags: ['tally partner mumbai', 'tally dealer', 'tally support', 'tally certified partner'],
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
    slug: 'tally-dealers-mumbai',
    title: 'Top Tally Dealers in Mumbai: Services You Should Expect from a Certified Partner',
    date: 'August 26, 2026',
    category: 'Tally Dealers',
    description: 'What certified Tally dealers in Mumbai actually do beyond selling licences - implementation, training, AMC, cloud hosting and TDL support.',
    tags: ['tally dealers mumbai', 'tally partner', 'tally dealer', 'best tally dealers in mumbai'],
    link: '/services/amc',
    author: 'Sarvadnya Infotech LLP',
    content: `Tally dealers in Mumbai range from licence resellers to full implementation partners, and the difference shows in how your business runs after the invoice is paid. When someone calls themselves a Tally dealer, ask what happens after day one.

A reseller hands you a licence and moves on. A real dealer or certified partner stays involved: deployment, user training, data migration from your old system, GST and payroll setup, and a support agreement you can actually reach.

- Licence procurement and registration with your company GSTIN
- Fresh Tally Prime / ERP 9 installation and activation
- Data migration and company setup for your chart of accounts
- Hands-on training for your accounts and billing teams
- Annual Maintenance Contract (AMC) with defined response times
- Access to secure Tally on Cloud hosting and automated backups
- Custom TDL modules - invoices, reports, import utilities and industry workflows

Mumbai businesses also value dealers who understand city-specific compliance. E-invoicing thresholds, GSTN-registered firms, and the volume of sale and purchase vouchers typical of Mumbai trade all change how Tally should be configured. A dealer who has implemented the same setup across Vashi, Thane, Borivali and BKC will configure your company faster than one learning on the job.

Sarvadnya Infotech is a Tally certified partner in Navi Mumbai serving 1,500+ businesses since 2008. We treat every licence as the start of a relationship - AMC, cloud backup and support included. If you are evaluating Tally dealers in Mumbai, list the services above and compare what each one actually commits to.`,
  },
  {
    slug: 'tally-erp9-add-ons',
    title: 'Tally ERP 9 Add-Ons That Save Your Accounts Team Hours Every Week',
    date: 'August 21, 2026',
    category: 'Tally Add-Ons',
    description: 'Practical Tally ERP 9 add-ons (TDL solutions) for invoicing, dispatch, sales and purchase controls - and how custom TDL beats manual workarounds.',
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
    slug: 'tally-tss-renewal-2026',
    title: 'Tally TSS Renewal 2026: Pricing Changes and How to Prepare',
    date: 'August 15, 2026',
    category: 'TSS & Renewals',
    description: 'Tally TSS renewal 2026 explained - what changes, how Tally ERP 9 renewal pricing works, and the checklist to renew before the price changes.',
    tags: ['tally renewal', 'tally tss', 'tally prime renewal', 'tally tss renewal'],
    link: '/services/tss',
    author: 'Sarvadnya Infotech LLP',
    content: `Tally TSS (Tally Software Services) is the annual subscription that keeps Tally Prime and Tally ERP 9 current - updates, statutory compliance changes and support. When TSS lapses, you keep using the software but lose updates and the ability to stay compliant as rules change.

Renewal timing is the single biggest cost lever for most businesses. Tally changes its renewal pricing from time to time, and renewing just before a price change saves real money for companies that plan ahead.

- Check your TSS expiry date in Tally - it is shown in the licence and about screen
- Inventory which of your machines are covered so you renew exactly what you need
- Look at Tally Prime vs ERP 9 first - Prime includes newer features bundled in the subscription
- Renewal is per-licence; consolidating old licences before renewing often reduces total cost
- Keep GSTIN and company details ready - renewal is processed against them

If you are on Tally ERP 9, the renewal decision is straightforward: renew at the current rate or pay more later. The earlier you confirm, the more predictable your cost.

Sarvadnya Infotech handles TSS renewals for businesses across Mumbai, Navi Mumbai, Pune and beyond. We check your licence, confirm the right plan and complete renewal for you - typically one short conversation. If your renewal date is within the next two months, get in touch so we can lock in your pricing and keep your compliance updates uninterrupted.`,
  },
  {
    slug: 'tally-3-star-partner-mumbai',
    title: 'What to Look for in a Tally 3 Star Partner in Mumbai',
    date: 'August 10, 2026',
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

Sarvadnya Infotech is an official Tally certified partner (since 2008) serving businesses in Mumbai and Navi Mumbai - Tally Prime, ERP 9, TSS renewal, cloud access, AMC and custom modules. If you are comparing partners in Mumbai, we are happy to share exactly what certification we hold and references from businesses like yours.`,
  },
  {
    slug: 'cloud-tally-cities-agra-patna-lucknow-mumbai',
    title: 'Cloud Tally Setup in Agra, Patna, Lucknow & Mumbai: Pricing and What to Expect',
    date: 'August 5, 2026',
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
    slug: 'it-companies-in-belapur',
    title: 'IT Companies in Belapur: How Certified Tally Partners Support Navi Mumbai Business',
    date: 'August 1, 2026',
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
    date: 'July 28, 2026',
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
    slug: 'tallydrive-cloud-backup',
    title: 'TallyDrive Cloud Backup: Why Every Mumbai and Navi Mumbai Business Needs It',
    date: 'July 20, 2026',
    category: 'Cloud Backup',
    description: 'TallyDrive cloud backup explained - automated offsite Tally backup, how it protects against data loss, and why Mumbai and Navi Mumbai businesses need it.',
    tags: ['tallydrive', 'tally cloud backup', 'tallydrive cloud backup', 'tally backup'],
    link: '/products/tallydrive',
    author: 'Sarvadnya Infotech LLP',
    content: `A business that loses its Tally data loses its financial memory. One failed hard drive, one ransomware click, one stolen laptop - and ledgers, invoices, balances and customer history are gone. TallyDrive cloud backup exists to make that failure survivable.

What happens when backup is manual is predictable: it is done on Fridays, skipped on busy weeks, and the last good copy is older than anyone wants to admit. Automated cloud backup removes the human step entirely.

- Backups run automatically at your chosen schedule, every working day - no one has to remember
- Data is stored offsite, so a single-machine failure does not destroy your records
- Restore is practical - you select a point in time and get your data back, not an out-of-context file
- It works alongside Tally Prime and ERP 9 without slowing your day-to-day work
- Older versions are retained, so a bad voucher or corruption is recoverable

For Mumbai and Navi Mumbai businesses, monsoon power cuts, office moves and laptop theft are all real events - each has ended someone's accounting data story. A business with automated backup only notices after restore completes successfully.

Sarvadnya Infotech provides TallyDrive - automated, cloud-hosted Tally backup with simple restore - for single-user firms through multi-branch companies. If your Tally data currently lives only on your server, set up backup before you need it, not after.`,
  },
  {
    slug: 'smbs-cbd-belapur-certified-tally-partner',
    title: 'Why SMBs in CBD Belapur Choose a Certified Tally Partner',
    date: 'July 12, 2026',
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
];

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

    for (const post of posts) {
      const existing = await col.findOne({ slug: post.slug });
      const doc = { ...post, updatedAt: new Date() };
      if (existing) {
        // CHANGE: 2026-08-31 — skip only when content AND description match,
        // so future description tweaks also get seeded.
        const same = existing.content === post.content && existing.description === post.description;
        if (same) { skipped++; continue; }
        await col.updateOne({ slug: post.slug }, { $set: doc });
        updated++;
      } else {
        await col.insertOne({ ...doc, createdAt: new Date() });
        inserted++;
      }
    }

    const total = await col.countDocuments({});
    console.log(`Seeded news posts -> inserted: ${inserted}, updated: ${updated}, skipped(unchanged): ${skipped}`);
    console.log(`Total news documents now: ${total}`);
  } catch (error) {
    console.error('Error seeding news:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();