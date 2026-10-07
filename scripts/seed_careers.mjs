// CHANGE: 2026-09-17 - Sync the `careers` collection with lib/jobs.ts.
// CHANGE: 2026-10-07 - + Digital Marketing Executive + Social Media Executive per owner
// ("add few position of digital marketing, social media executive"); postedAt 2026-10-07.
// The GET /api/careers route only seeds when the collection is EMPTY, so replacing openings
// needs an explicit re-seed. Upserts by `id` and DELETES any career doc whose `id` is no
// longer in the list below (so the old Tally Support / IT Sales / TDL Intern roles leave
// the page). Keep the jobs array in sync with lib/jobs.ts (duplicated here because this is
// a plain .mjs runner and lib/jobs.ts is TypeScript).
//
// Run:  node scripts/seed_careers.mjs   (MONGODB_URI from .env)

import { MongoClient } from 'mongodb';
import 'dotenv/config';

const jobs = [
  {
    id: "business-development-executive",
    title: "Business Development Executive",
    department: "Sales",
    location: "Belapur, Navi Mumbai",
    type: "Full-time",
    shortDescription: "Drive growth by building relationships with SMEs and championing Tally, Cloud and AMC solutions.",
    fullDescription: "We are looking for a driven Business Development Executive to expand our footprint across SMEs. You will prospect, present and close partnerships for TallyPrime, AWS Cloud, managed support and business automation, working closely with the sales team to hit and exceed targets.",
    aboutRole:
      "As a Business Development Executive, you are the growth engine for Sarvadnya. You will reach out to prospective businesses, understand their accounting and IT needs, demonstrate how TallyPrime, Cloud and automation solve them, and win long-term partners — on-site and over calls.",
    lookingFor:
      "The ideal candidate brings drive, structured follow-up and a consultative ear:\n- 0-3 years in B2B sales / business development (IT software or services preferred)\n- Strong spoken and written English; comfortable with cold calling and client demos\n- Ability to learn Tally/ERP and Cloud concepts quickly\n- Target-oriented with a hunger to build a client pipeline\n- Own two-wheeler / willingness to travel locally is a plus",
    whyJoinUs:
      "Why people grow here quickly:\n- Best-in-class incentive and commission structure\n- Direct exposure to real SME decision-makers\n- Full product training on TallyPrime, Cloud and automation\n- Fast-track growth into team-lead roles",
    postedAt: "2026-09-17T09:00:00Z",
    requirements: [
      "0-3 years of experience in B2B sales or business development",
      "Excellent communication and follow-up discipline",
      "Willingness to learn Tally, Cloud and ERP concepts",
      "Self-starter able to prospect independently",
      "Local travel availability preferred"
    ],
    benefits: [
      "Competitive salary + performance incentives",
      "On-the-job product and sales training",
      "Exposure to diverse industry verticals",
      "Growth into senior sales / team-lead roles"
    ]
  },
  {
    id: "junior-marketing-executive",
    title: "Junior Marketing Executive",
    department: "Marketing",
    location: "Belapur, Navi Mumbai",
    type: "Full-time",
    shortDescription: "Own digital campaigns, content and lead generation for Tally, Cloud and automation services.",
    fullDescription: "Join our marketing team to plan and execute campaigns that connect SMEs with Tally and Cloud solutions. You will run SEO, social, WhatsApp and Google lead-generation funnels, create content and measure what converts.",
    aboutRole:
      "This role owns the day-to-day execution of marketing: campaign calendars, content creation, ad and SEO coordination, social media, email/WhatsApp nurturing and reporting. You will turn brand awareness into qualified leads for the sales team.",
    lookingFor:
      "Where you win with us:\n- 0-2 years in marketing (internship counts) — B2B/tech marketing is a plus\n- Hands-on with Canva, Meta/Google Ads basics, and social scheduling tools\n- Analytical bent: comfortable with spreadsheets and simple performance reports\n- Creative eye for short-form content and campaign hooks\n- Basic understanding of SEO keywords is a bonus",
    whyJoinUs:
      "Why this role stands out:\n- Own real campaigns and measurable leads from day one\n- Learn paid ads, SEO and B2B funnels end-to-end\n- Supportive team with clear growth into senior marketing roles\n- Flexible, modern work culture",
    postedAt: "2026-09-17T09:00:00Z",
    requirements: [
      "0-2 years of marketing experience (internships included)",
      "Comfort with Canva, social scheduling and basic ad platforms",
      "Strong written communication and content instinct",
      "Data-driven mindset for campaign reporting",
      "Basic SEO understanding is a plus"
    ],
    benefits: [
      "Hands-on training across SEO, ads and content",
      "Real campaign ownership and lead-gen exposure",
      "Flexible work arrangements",
      "Clear path to senior marketing roles"
    ]
  },
  {
    id: "cre",
    title: "CRE — Customer Relations Executive",
    department: "Customer Success",
    location: "Belapur, Navi Mumbai",
    type: "Full-time",
    shortDescription: "Manage client relationships, renewals and retention for our Tally and Cloud customer base.",
    fullDescription: "You will be the trusted point of contact for our customers. This role balances account management with light technical hand-holding — coordinating support, renewing AMC/TSS plans and growing client satisfaction across the portfolio.",
    aboutRole:
      "As a Customer Relations Executive, you keep customers happy and loyal. You own the relationship layer: onboarding, periodic check-ins, renewal cycles, cross-sell of relevant Tally/Cloud/AMC plans and escalating technical needs to our support team with complete follow-through.",
    lookingFor:
      "What makes a strong CRE here:\n- 0-3 years in customer success, account management or client support\n- Warm, professional communication — you build trust fast\n- Good grasp of Tally basics or ability to learn them quickly\n- Organised follow-through: every query logged, tracked and closed\n- CRM fluency (Zoho/any) is a plus",
    whyJoinUs:
      "Why people love this role:\n- Own a real portfolio of SME relationships\n- Combine account management with Tally/Cloud product depth\n- Performance-linked rewards on retention and renewals\n- Clear path to senior customer-success roles",
    postedAt: "2026-09-17T09:00:00Z",
    requirements: [
      "0-3 years in customer success / account management / client support",
      "Excellent communication and relationship skills",
      "Willingness to learn Tally and Cloud product details",
      "Strong follow-through and documentation discipline",
      "Basic CRM experience is a plus"
    ],
    benefits: [
      "Salary + retention/renewal performance rewards",
      "Training on TallyPrime, TSS and Cloud products",
      "Direct exposure to real client decision-makers",
      "Growth into senior customer-success roles"
    ]
  },
  {
    id: "digital-marketing-executive",
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Belapur, Navi Mumbai",
    type: "Full-time",
    shortDescription: "Plan and run digital campaigns — SEO, ads, email and WhatsApp funnels — that turn awareness into qualified leads for Tally, Cloud and automation services.",
    fullDescription: "Drive the digital growth engine at Sarvadnya. You will own search and paid campaigns, landing pages, email/WhatsApp nurturing and performance reporting, connecting SMEs with TallyPrime, AWS Cloud, managed support and business automation.",
    aboutRole:
      "You are the hands-on owner of our digital funnel: keyword research and SEO execution, Google/Meta ad campaigns, lead-capture pages, email and WhatsApp sequences, and weekly performance dashboards. Your work feeds the sales team a steady stream of qualified enquiries.",
    lookingFor:
      "Where you win with us:\n- 0-2 years in digital marketing (internship counts) — B2B/tech marketing is a plus\n- Hands-on with Google Ads, Meta Ads, Google Search Console and analytics\n- Comfort with SEO tools (keyword research, on-page fixes, content briefs)\n- Spreadsheet-savvy: you report on conversions, not just impressions\n- Understanding of lead funnels for services businesses is a bonus",
    whyJoinUs:
      "Why this role stands out:\n- Own real campaigns and measurable leads from day one\n- Learn B2B SEO, paid media and marketing automation end-to-end\n- Clear growth path into senior marketing roles\n- Modern, performance-driven culture",
    postedAt: "2026-10-07T09:00:00Z",
    requirements: [
      "0-2 years of digital marketing experience (internships included)",
      "Hands-on with Google/Meta Ads and analytics tools",
      "Basic SEO knowledge: keywords, on-page, search console",
      "Strong written communication and campaign reporting",
      "Data-driven mindset with spreadsheet fluency"
    ],
    benefits: [
      "Hands-on training across SEO, paid media and automation",
      "Ownership of live campaign budgets and funnels",
      "Flexible work arrangements",
      "Clear path to senior marketing roles"
    ]
  },
  {
    id: "social-media-executive",
    title: "Social Media Executive",
    department: "Marketing",
    location: "Belapur, Navi Mumbai",
    type: "Full-time",
    shortDescription: "Own Sarvadnya's social presence — reels, posts, community and follower-to-lead conversion across Instagram, LinkedIn, Facebook and YouTube.",
    fullDescription: "Build and manage our social media presence across Instagram, LinkedIn, Facebook, YouTube and WhatsApp. You will create short-form videos and design posts, plan and schedule content calendars, engage our community and convert followers into enquiries for Tally, Cloud and support services.",
    aboutRole:
      "You are the voice of Sarvadnya on social. Day to day: shoot and edit reels and shorts, design static posts, run the content calendar, reply to comments/DMs, coordinate with the digital marketing team on paid boosts, and report growth and enquiry metrics weekly. A strong portfolio with your own content is a big plus.",
    lookingFor:
      "What makes a strong candidate:\n- 0-2 years managing social media for brands (internship counts)\n- Confident with reels/shorts, Canva and basic editing tools (CapCut etc.)\n- A creative eye for hooks, thumbnails and clean post design\n- Understands engagement metrics and how social drives enquiries\n- English fluency for B2B-friendly copy; Hindi/Marathi is a bonus",
    whyJoinUs:
      "Why this role stands out:\n- Your content reaches real SME decision-makers every day\n- Freedom to experiment with formats and trends\n- Build a standout reel/portfolio with full creative ownership\n- Flexible work culture with clear growth into social media lead roles",
    postedAt: "2026-10-07T09:00:00Z",
    requirements: [
      "0-2 years of social media management (internships included)",
      "Hands-on with reels/shorts, Canva and basic video editing",
      "Strong visual sense and English copywriting",
      "Comfortable tracking and reporting engagement metrics",
      "A personal or college content portfolio is a big plus"
    ],
    benefits: [
      "Full creative ownership of brand channels",
      "Training on paid boosts and B2B social strategy",
      "Flexible work arrangements",
      "Clear path to social media lead roles"
    ]
  }
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
    const col = db.collection('careers');

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let removed = 0;

    const ids = new Set(jobs.map((j) => j.id));
    const legacy = await col.find({}).toArray();
    for (const old of legacy) {
      if (!ids.has(old.id)) {
        await col.deleteOne({ _id: old._id });
        removed++;
        console.log(`Removed legacy opening: ${old.title}`);
      }
    }

    for (const job of jobs) {
      const existing = await col.findOne({ id: job.id });
      const doc = { ...job, updatedAt: new Date() };
      if (existing) {
        const same = existing.title === job.title
          && existing.shortDescription === job.shortDescription
          && existing.fullDescription === job.fullDescription
          && (existing.aboutRole ?? null) === job.aboutRole
          && (existing.lookingFor ?? null) === job.lookingFor
          && (existing.whyJoinUs ?? null) === job.whyJoinUs
          && existing.postedAt === job.postedAt
          && JSON.stringify(existing.requirements ?? null) === JSON.stringify(job.requirements)
          && JSON.stringify(existing.benefits ?? null) === JSON.stringify(job.benefits);
        if (same) { skipped++; continue; }
        await col.updateOne({ id: job.id }, { $set: doc });
        updated++;
      } else {
        await col.insertOne({ ...doc, createdAt: new Date() });
        inserted++;
      }
    }

    const total = await col.countDocuments({});
    console.log(`Seeded careers -> inserted: ${inserted}, updated: ${updated}, skipped(unchanged): ${skipped}, removed: ${removed}`);
    console.log(`Total career documents now: ${total}`);
  } catch (error) {
    console.error('Error seeding careers:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();