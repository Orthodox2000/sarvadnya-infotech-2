import { MongoClient, ServerApiVersion } from "mongodb";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../.env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const [key, ...value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.join("=").trim().replace(/^["']|["']$/g, '');
    }
  });
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db();
    const col = db.collection('site_content');

    const heroContents = [
      {
        badge: "3 star Tally Partner",
        titleText: "Fueling MSME Ambition Through Smarter Tally Systems",
        colorFrom: "#232F3E",
        colorTo: "#00ABE4",
        description: "We don't just implement software; we clear the path for your growth. Maximize your Tally investment with certified experts who care about your bottom line as much as you do.",
        image: "/certified partner person.png",
        layout: "single",
        features: [
          { text: "Certified Tally Expertise" },
          { text: "1,500+ Active Clients" },
          { text: "Pan-India Remote Support" },
          { text: "Custom TDL Solutions" }
        ],
        ctaPrimary: { text: "Why Choose Us", href: "/about" }
      },
      {
        badge: "TallyPrime 7.1 Now Available",
        titleText: "Revolutionizing Business with Smart Tally Automation",
        colorFrom: "#232F3E",
        colorTo: "#00ABE4",
        description: "Unleash TallyPrime 7.0 with PrimeBanking and SmartFind. We build the financial engine that turns your accounting into a growth machine.",
        image: "/sa2.png",
        layout: "standard",
        features: [
          { text: "PrimeBanking Payments" },
          { text: "TallyDrive Cloud Backup" },
          { text: "SmartFind Global Search" },
          { text: "Bharat Connect Plug-in" }
        ],
        ctaPrimary: { text: "Know More", href: "/about" },
        sub1Img: "/hero/tssgold.png",
        sub2Img: "/hero/hero-main.png"
      },
      {
        badge: "Certified Cloud Solutions",
        titleText: "Tally on Cloud: Absolute Freedom.",
        colorFrom: "#232F3E",
        colorTo: "#00ABE4",
        description: "Your office, now in your pocket. Secure AWS-powered hosting with 100% uptime and zero-loss military encryption for your business data.",
        image: "/hero/dedicated-to-cloud-hosting.jpg",
        layout: "ecosystem",
        features: [
          { text: "Official AWS Hosting" },
          { text: "NoSky Cloud Performance" },
          { text: "24/7 Remote Access" },
          { text: "Automated Server Backup" }
        ],
        ctaPrimary: { text: "View Cloud Plans", href: "/cloud" }
      },
      {
        badge: "Industry Leading Support",
        titleText: "Instant Solutions. Zero Downtime.",
        colorFrom: "#232F3E",
        colorTo: "#00ABE4",
        description: "Stop waiting for answers. Our 90% First Call Resolution standard means your technical hurdles disappear before you hang up.",
        image: "/trainning.png",
        layout: "standard",
        features: [
          { text: "Instant Remote Support" },
          { text: "Expert TDL Debugging" },
          { text: "Data Recovery Services" },
          { text: "90% FCR Track Record" }
        ],
        ctaPrimary: { text: "Get Priority Support", href: "/contact" },
        sub1Img: "/PartnerBrands/Tally-Software.png",
        sub2Img: "/sa2.png"
      },
      {
        badge: "Smart Business Integration",
        titleText: "WhatsApp Sync: Real-Time Growth.",
        colorFrom: "#232F3E",
        colorTo: "#00ABE4",
        description: "Bridge the gap between accounting and communication. Send invoices and collection alerts directly to your customers instantly.",
        image: "/sa3.png",
        layout: "standard",
        features: [
          { text: "Automated PDF Sending" },
          { text: "Real-time Notifications" },
          { text: "Customer Support Sync" },
          { text: "Bulk Report Sharing" }
        ],
        ctaPrimary: { text: "Get WhatsApp Sync", href: "/services/whatsapp" },
        sub1Img: "/hero/hero-sub1.png",
        sub2Img: "/TDLandCustom.jpg"
      }
    ];

    const stats = [
      { label: 'Years Experience', value: 15, suffix: '+' },
      { label: 'Active Clients', value: 1500, suffix: '+' },
      { label: 'Queries Solved', value: 300, suffix: '+' },
    ];

    const partners = [
      "/PartnerBrands/Tally-Software.png",
      "/PartnerBrands/AWS.png",
      "/PartnerBrands/BizAnalyst.png",
    ];

    const faqData = [
      {
          question: "What is the difference between TallyPrime Silver, Gold, and Server editions?",
          answer: "TallyPrime Silver is a single-user license ideal for small businesses. Gold supports up to 5 concurrent users with additional features. Server edition offers unlimited concurrent users, centralized data management, and advanced security. Our team can help you choose the right edition based on your business size and requirements.",
          category: "Products"
      },
      {
          question: "Can I upgrade from Tally.ERP 9 to TallyPrime?",
          answer: "Yes, upgrading is simple if you have an active TSS. We can assist you in migrating your data safely to TallyPrime, ensuring all your previous records and customizations are preserved while you enjoy the new, enhanced user experience with improved performance and modern interface.",
          category: "Products"
      },
      {
          question: "What is TallyDrive and how does it help my business?",
          answer: "TallyDrive is our automated cloud backup solution that continuously backs up your Tally data to secure cloud storage. It ensures zero data loss, provides instant recovery options, and allows you to access your data from anywhere. It runs silently in the background without disrupting your work.",
          category: "Products"
      },
      {
          question: "Do you offer customized Tally modules for specific industries?",
          answer: "Absolutely. We specialize in building custom Tally modules for industries like C&F, Transport, Society Management, Garment, and Sales. These modules integrate seamlessly with TallyPrime to automate your unique workflows, generate industry-specific reports, and reduce manual data entry.",
          category: "Products"
      },
      {
          question: "What are the system requirements for TallyPrime?",
          answer: "TallyPrime requires Windows 7 or later, minimum 4GB RAM (8GB recommended), and 2GB free disk space. For optimal performance, we recommend a modern processor, SSD storage, and a stable internet connection for cloud features and updates. Our team can verify compatibility before installation.",
          category: "Products"
      },
      {
          question: "What is included in your AMC plan?",
          answer: "Our Annual Maintenance Contract (AMC) includes priority support, regular system health checks, data backup assistance, unlimited remote troubleshooting, and access to Tally updates. It ensures your accounting operations never stop due to technical glitches and you always have expert help available.",
          category: "Services"
      },
      {
          question: "Do you provide on-site support for technical issues?",
          answer: "Yes, we provide both remote and on-site support. Our 'Never Deny Service Call' policy ensures that we respond to every customer request promptly. For critical issues that cannot be resolved remotely, our certified technicians will visit your premises to resolve the problem.",
          category: "Services"
      },
      {
          question: "What is your 'Never Deny Service Call' policy?",
          answer: "It is our commitment to customer satisfaction. We guarantee that no service call will be turned away. Regardless of the complexity of the issue or the time of the request, our team will acknowledge and provide a path to resolution for every client within 15 minutes.",
          category: "Services"
      },
      {
          question: "Do you offer TallyPrime training for my team?",
          answer: "Yes, we provide comprehensive training for TallyPrime including basic accounting, advanced features, GST compliance, E-invoicing, and custom module usage. Training is available both on-site and remotely, tailored to your team's skill level and business requirements.",
          category: "Services"
      },
      {
          question: "Can you help with Tally cloud hosting and setup?",
          answer: "Absolutely. We offer Tally on Cloud solutions including AWS-hosted Tally, Windows Tally Cloud, and NoSky cloud backup. We handle the complete setup, security configuration, user management, and provide 24/7 access to your Tally data from any device, anywhere.",
          category: "Services"
      },
      {
          question: "How does Tally on Cloud work?",
          answer: "Tally on Cloud serves the Tally Desktop Application over the internet. With proper connectivity, users can access Tally with their credentials using an RDP client from any device. Our admin panel lets you manage users, data, printers, and backups easily and securely.",
          category: "Technical"
      },
      {
          question: "Is TallyPrime GST compliant?",
          answer: "Absolutely. TallyPrime is fully GST compliant, helping you generate GSTR-1, GSTR-3B, and GSTR-9 reports easily. It also supports E-invoicing and E-way bill generation directly from the software, ensuring you stay compliant with the latest tax regulations.",
          category: "Technical"
      },
      {
          question: "How does E-invoicing work in TallyPrime?",
          answer: "TallyPrime has built-in E-invoicing support that generates IRN (Invoice Reference Number) directly from the software. It automatically validates invoices against IRP, generates QR codes, and supports real-time E-way bill generation. This eliminates manual data entry and reduces errors.",
          category: "Technical"
      },
      {
          question: "Can I access Tally reports on my mobile device?",
          answer: "Yes, with a valid TSS, you can access your TallyPrime reports securely on any mobile device through a web browser. You can view balance sheets, profit & loss statements, stock summaries, and other key reports in real-time from anywhere, anytime.",
          category: "Technical"
      },
      {
          question: "What happens if I don't upgrade to TallyPrime?",
          answer: "Support for Tally.ERP 9 will continue, but you will miss out on the latest features, improved performance, enhanced security, and advanced capabilities like E-invoicing and direct E-way bill generation. Upgrading ensures you stay compliant and get the best experience.",
          category: "Technical"
      },
      {
          question: "What are your business hours?",
          answer: "Our business hours are Monday to Saturday from 9:30 AM to 6:30 PM. For existing AMC clients, we provide extended support until 8:00 PM. Emergency support is available 24/7 for critical issues through our priority support line.",
          category: "Contact"
      },
      {
          question: "How can I contact support for urgent issues?",
          answer: "For urgent support, you can call us directly at our support hotline, send a WhatsApp message, or raise a ticket through our client portal. Our 'Never Deny Service Call' policy ensures your urgent query receives immediate attention regardless of the channel.",
          category: "Contact"
      },
      {
          question: "What is the typical response time for support queries?",
          answer: "Our support team typically responds within 15 minutes during business hours. For critical issues, we provide priority response within 5 minutes. Email queries are answered within 2-4 hours. We pride ourselves on being one of the fastest-responding Tally partners.",
          category: "Contact"
      },
      {
          question: "Do you have a physical office I can visit?",
          answer: "Yes, we are located in Navi Mumbai. You can visit our office during business hours for in-person consultations, Tally demonstrations, and support. We recommend scheduling an appointment beforehand to ensure our expert team is available to assist you.",
          category: "Contact"
      },
      {
          question: "How do I get a quote for Tally products and services?",
          answer: "You can request a quote by calling us, sending an email, or filling out the contact form on our website. Our sales team will understand your requirements and provide a customized quote within 24 hours. We offer competitive pricing with discounts for multi-year subscriptions.",
          category: "Contact"
      }
    ];

    const quickAccess = [
      {
        title: "Tally Products",
        iconName: "core",
        description: "Explore TallyPrime Editions, Licensing, and specialized business modules.",
        links: [
          { label: "TallyPrime Silver", href: "/products/silver" },
          { label: "TallyPrime Gold", href: "/products/gold" },
          { label: "TallyPrime Server", href: "/products/server" },
          { label: "TallyDrive", href: "/products/tallydrive" }
        ],
        theme: {
          bg: "bg-indigo-50",
          accent: "bg-indigo-500",
          text: "text-indigo-600",
          hoverBg: "hover:bg-indigo-600",
          hoverBorder: "hover:border-indigo-200"
        }
      },
      {
        title: "Cloud Products",
        iconName: "cloud",
        description: "Secure, 24/7 remote access with Official AWS and NoSky infrastructure.",
        links: [
          { label: "AWS Cloud Server", href: "/cloud/aws" },
          { label: "Windows VM", href: "/cloud/windows" },
          { label: "NoSky Backup", href: "/cloud/nosky" }
        ],
        theme: {
          bg: "bg-blue-50",
          accent: "bg-blue-500",
          text: "text-blue-600",
          hoverBg: "hover:bg-blue-600",
          hoverBorder: "hover:border-blue-200"
        }
      },
      {
        title: "Customizations",
        iconName: "custom",
        description: "Industry-specific TDL solutions tailored to your unique business logic.",
        links: [
          { label: "Logistics & Transport", href: "/modules?id=logistics-transport" },
          { label: "Retail & Garment", href: "/modules?id=garment-retail" },
          { label: "Housing Societies", href: "/modules?id=housing-societies" },
          { label: "Excel to Tally Tool", href: "/modules?id=excel-to-tally" },
          { label: "C&F Agencies", href: "/modules?id=cf-agencies" },
          { label: "Sales Commission", href: "/modules?id=sales-commission" }
        ],
        theme: {
          bg: "bg-emerald-50",
          accent: "bg-emerald-500",
          text: "text-emerald-600",
          hoverBg: "hover:bg-emerald-600",
          hoverBorder: "hover:border-emerald-200"
        }
      },
      {
        title: "HRMS",
        iconName: "support",
        description: "Human Resource Management System — payroll, attendance, employee lifecycle & more.",
        links: [
          { label: "HRMS Overview", href: "/hrms" },
          { label: "OTU HRplus", href: "https://otuhrplus.com/" }
        ],
        theme: {
          bg: "bg-purple-50",
          accent: "bg-purple-500",
          text: "text-purple-600",
          hoverBg: "hover:bg-purple-600",
          hoverBorder: "hover:border-purple-200"
        }
      }
    ];

    const data = [
      { section: 'home_hero', content: heroContents },
      { section: 'home_stats', content: stats },
      { section: 'home_partners', content: partners },
      { section: 'home_faq', content: faqData },
      { section: 'home_quick_access', content: quickAccess },
    ];

    for (const item of data) {
      await col.updateOne(
        { section: item.section },
        { $set: { content: item.content, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log(`Updated section: ${item.section}`);
    }

    console.log("Database bootstrapped successfully");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
