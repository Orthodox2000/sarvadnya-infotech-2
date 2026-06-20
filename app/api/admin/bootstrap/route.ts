import { NextResponse } from 'next/server';
import { updateContent } from '@/lib/mongodb-utils';

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
      colorFrom: "#2563eb",
      colorTo: "#0891b2",
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
        question: "What if I do not upgrade to TallyPrime? Will Tally.ERP 9 support still applicable?",
        answer: "Yes, support for Tally.ERP 9 will continue. However, upgrading to TallyPrime is recommended to take advantage of the latest features, improved performance, and advanced capabilities like E-invoicing and direct E-way bill generation."
    },
    {
        question: "How Tally on cloud works?",
        answer: "Tally on Cloud serves Tally Desktop Application over Cloud. With proper internet connectivity, users can access Tally on Cloud with their Username and Password using RDP Client from their device. With Tally on Cloud admin panel, your Administrators can easily manage Tally on Cloud Users, Data, Printers, backups, etc."
    },
    {
        question: "Explain what is group in Tally ERP 9?",
        answer: "Group is a collection of ledgers of the same nature. In the business, expenses like electric bills, telephone bill, conveyance, etc. are commonly included in groups. Ledger based on these expenses are created to be used while accounting vouchers are entered."
    },
    {
        question: "What services do you provide for Tally Prime?",
        answer: "We offer complete Tally Prime services including license sales, implementation, customization, data synchronization, troubleshooting, and annual maintenance contracts (AMC). Our expert team ensures your business software runs smoothly without any downtime."
    },
    {
        question: "Do you offer on-site support for technical issues?",
        answer: "Yes, we provide both remote and on-site support. Our 'Never Deny Service Call' policy ensures that we respond to every customer request promptly. For critical issues that cannot be resolved remotely, our technicians will visit your premises."
    },
    {
        question: "How can I renew my Tally Software Services (TSS)?",
        answer: "You can renew your TSS directly through us. Renewal gives you access to latest product updates, banking features (E-invoicing, E-way bill), and Tally reports on mobile. Contact our support team with your serial number for a quick renewal."
    },
    {
        question: "Do you provide customized billing solutions?",
        answer: "Absolutely. We specialize in tailoring billing and accounting workflows to match your specific industry needs. Whether you are in retail, manufacturing, or service, we can customize Tally to generate the exact reports and invoice formats you require."
    },
    {
        question: "What is your 'Never Deny Service Call' policy?",
        answer: "It is our commitment to customer satisfaction. We guarantee that no service call will be turned away. Regardless of the complexity of the issue or the time of the request, our team will acknowledge and provide a path to resolution for every client."
    },
    {
        question: "Can I access Tally reports on my mobile phone?",
        answer: "Yes, with a valid TSS, you can access your TallyPrime reports securely on any mobile device through a web browser. You can view balance sheets, profit & loss statements, stock summaries, and much more in real-time."
    },
    {
        question: "What are the benefits of a Tally AMC?",
        answer: "An Annual Maintenance Contract (AMC) provides you with priority support, regular system health checks, data backup assistance, and unlimited remote troubleshooting. It ensures your accounting operations never stop due to technical glitches."
    },
    {
        question: "How do I upgrade from Tally.ERP 9 to TallyPrime?",
        answer: "Upgrading is simple if you have an active TSS. We can assist you in migrating your data safely to TallyPrime, ensuring all your previous records and customizations are preserved while you enjoy the new, enhanced user experience."
    },
    {
        question: "Is TallyPrime GST compliant?",
        answer: "Absolutely. TallyPrime is designed to be fully GST compliant, helping you generate GSTR-1, GSTR-3B, and GSTR-9 reports easily. It also supports E-invoicing and E-way bill generation directly from the software."
    }
  ];

  try {
    await updateContent('home_hero', heroContents);
    await updateContent('home_stats', stats);
    await updateContent('home_partners', partners);
    await updateContent('home_faq', faqData);

    return NextResponse.json({ message: 'Database bootstrapped successfully' });
  } catch (error) {
    console.error('Bootstrap error:', error);
    return NextResponse.json({ error: 'Failed to bootstrap database' }, { status: 500 });
  }
}
