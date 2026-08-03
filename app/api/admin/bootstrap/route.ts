import { NextResponse } from 'next/server';
import { updateContent, getCollection } from '@/lib/mongodb-utils';

export async function GET() {
  const heroContents = [
    {
      badge: "Upgraded to latest Tally version",
      titleText: "Trusted Tally Partner in Navi Mumbai",
      colorFrom: "#4f46e5",
      colorTo: "#7c3aed",
      description: "Beyond Software Sales — Guiding You to Maximize Your Tally Investment with Certified Support.",
      image: "/sa.png",
      features: [
        { text: "TallyPrime v7.0 Ready" },
        { text: "Certified Expert Support" },
        { text: "Custom Module Design" },
        { text: "Seamless Data Integrity" }
      ],
      ctaPrimary: { text: "Explore Capabilities", href: "/products" }
    },
    {
      badge: "Support Excellence",
      titleText: "90% First-Call Resolution",
      colorFrom: "#f97316",
      colorTo: "#e11d48",
      description: "15min Avg. Response Time | 5000+ Queries Resolved | 99% Client Satisfaction. Reliable support that keeps your business running smoothly.",
      image: "/sa.png",
      features: [
        { text: "Certified Technical Experts" },
        { text: "Dedicated Account Managers" },
        { text: "On-site & Remote Assistance" },
        { text: "15min Avg. Response" }
      ],
      ctaPrimary: { text: "Get Support", href: "/contact" }
    },
    {
      badge: "Certified Expertise",
      titleText: "Why Choose Certified Partner?",
      colorFrom: "#5D887A",
      colorTo: "#5D887A",
      description: "Experience unparalleled reliability with Tally Certified Partners. We ensure your business software is always optimized, secure, and compliant.",
      image: "/certified.png",
      features: [
        { text: "Authorized Sales & Service" },
        { text: "Certified Technical Team" },
        { text: "Deep Industry Knowledge" },
        { text: "Priority Support Access" }
      ],
      ctaPrimary: { text: "Verify Certification", href: "/contact" }
    },
    {
      badge: "Vertical Solutions",
      titleText: "Custom Tally Modules",
      colorFrom: "#059669",
      colorTo: "#0d9488",
      description: "Tailored solutions built directly into Tally to optimize your unique industry workflows and reporting.",
      image: "/sa.png",
      features: [
        { text: "Industry-Specific Logic" },
        { text: "Automated Reporting" },
        { text: "Reduced Manual Entry" },
        { text: "Scalable Add-ons" }
      ],
      ctaPrimary: { text: "View Modules", href: "/products#modules" }
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
    "/PartnerBrands/CredFlow.png",
  ];

  const faqData = [
    {
        question: "What is the difference between TallyPrime Silver, Gold, and Server products?",
        answer: "TallyPrime Silver is a single-user license ideal for small businesses. Gold supports up to 5 concurrent users with additional features. Server is an enterprise product that enhances concurrency with multi-threaded architecture, delivers better speed and performance, provides a complete activity log, and strengthens data security. Our team can help you choose the right product based on your business size and requirements.",
        category: "Products"
    },
    {
        question: "Can I upgrade from Tally.ERP 9 to TallyPrime?",
        answer: "Yes, upgrading is simple if you have an active TSS. We can assist you in migrating your data safely to TallyPrime, ensuring all your previous records are preserved while you enjoy the new, enhanced user experience with improved performance and modern interface.",
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
        answer: "Our Annual Maintenance Contract (AMC) includes priority support, regular system health checks, data backup assistance, unlimited remote troubleshooting, and access to Tally updates. It ensures your accounting operations never stop due to technical glitches. Beyond troubleshooting, each AMC period boosts your team's efficiency as you gain deeper knowledge and better command over Tally and accounts through ongoing expert guidance.",
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
        question: "What services do you provide for TallyPrime?",
        answer: "We offer end-to-end TallyPrime services including license sales, implementation, customization, data synchronization, troubleshooting, annual maintenance contracts (AMC), Tally consultancy, and business training. Whether you need help choosing the right product, optimizing your workflows, or training your team, our experts ensure your business runs smoothly.",
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
        answer: "Absolutely. TallyPrime is designed to be fully GST compliant, helping you generate GSTR-1, GSTR-3B, and GSTR-9 reports easily. It also supports E-invoicing and E-way bill generation directly from the software. With a valid TSS, you can now file GSTR-1, reconcile IMS, and manage all GST returns directly from within TallyPrime.",
        category: "Technical"
    },
    {
        question: "How does E-invoicing work in TallyPrime?",
        answer: "TallyPrime has built-in E-invoicing support that generates IRN (Invoice Reference Number) directly from the software. It automatically validates invoices against IRP, generates QR codes, and supports real-time E-way bill generation. This eliminates manual data entry and reduces errors.",
        category: "Technical"
    },
    {
        question: "Can I access Tally reports on my mobile device?",
        answer: "Yes. With a valid TSS, the built-in Tally on Mobile feature lets you view balance sheets, profit & loss statements, stock summaries, and key reports on mobile phones, tablets, and any browser-enabled device. If you don't have an active TSS, we also offer alternative solutions to access Tally features on mobile and other devices — contact us to explore the best option for your setup.",
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

  try {
    await updateContent('home_hero', heroContents);
    await updateContent('home_stats', stats);
    await updateContent('home_partners', partners);
    await updateContent('home_faq', faqData);

    // ── Email notification settings (seeded only if missing, so admin edits persist) ──
    const settingsCol = await getCollection('settings');
    const defaultFormEmail = process.env.RESEND_SENDER_EMAIL || 'webenquiry@en.sarvadnyainfotech.com';
    const emailSettings = [
      { key: 'RESEND_SENDER_EMAIL', value: defaultFormEmail },
      {
        key: 'EMAIL_FORM_RECIPIENTS',
        value: JSON.stringify(
          { quote: defaultFormEmail, enquire: defaultFormEmail, support: defaultFormEmail, callback: defaultFormEmail, demo: defaultFormEmail, general: defaultFormEmail },
          null,
          2
        ),
      },
      // Per-page destinations: only `demo` is pre-wired (keeps the existing
      // demo page behavior). Every other page stays opt-in — no email until the
      // admin assigns recipients for that destination in /admin/email-config.
      {
        key: 'EMAIL_DESTINATION_RECIPIENTS',
        value: JSON.stringify({ demo: defaultFormEmail }, null, 2),
      },
    ];
    for (const setting of emailSettings) {
      await settingsCol.updateOne(
        { key: setting.key },
        { $setOnInsert: { key: setting.key, value: setting.value, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ message: 'Database bootstrapped successfully' });
  } catch (error) {
    console.error('Bootstrap error:', error);
    return NextResponse.json({ error: 'Failed to bootstrap database' }, { status: 500 });
  }
}
