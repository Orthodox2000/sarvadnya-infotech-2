/**
 * Semantic Keyword Indexer
 * Maps natural language keywords to specific internal entities and URLs.
 * This allows the search engine to 'understand' intent like 'renew', 'buy', or 'features'.
 */

export interface SemanticMapping {
  keywords: string[];
  target: {
    title: string;
    description: string;
    url: string;
    type: 'Module' | 'Page' | 'Tutorial' | 'Action';
    icon: string;
  };
}

export const SEMANTIC_INDEX: SemanticMapping[] = [
  {
    keywords: ['renew', 'renewal', 'tss', 'expiry', 'validity', 'update tally'],
    target: {
      title: 'Renew Tally Software Services (TSS)',
      description: 'Ensure your TallyPrime is up-to-date with the latest features, statutory updates, and remote access by renewing your TSS subscription.',
      url: '/contact?reason=renewal',
      type: 'Action',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    }
  },
  {
    keywords: ['buy', 'purchase', 'price', 'cost', 'silver', 'gold', 'license'],
    target: {
      title: 'TallyPrime Pricing & Editions',
      description: 'Explore TallyPrime Silver (Single User) and Gold (Multi-User) editions. Get a professional quote for your business requirements.',
      url: '/products',
      type: 'Page',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  },
  {
    keywords: ['gst', 'tax', 'compliance', 'returns', 'gstr1', 'gstr3b', 'e-way bill'],
    target: {
      title: 'GST & Taxation Compliance',
      description: 'TallyPrime handles all your statutory requirements including GSTR-1, 3B, TDS, and e-Invoicing with direct portal upload.',
      url: '/modules', // Should ideally point to a GST module
      type: 'Module',
      icon: 'M9 14l6-6m-5.5.5h.501m-4.501 0h.501m-4.501 0h.501M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z'
    }
  },
  {
    keywords: ['cloud', 'aws', 'remote', 'online', 'access', 'browser', 'anywhere'],
    target: {
      title: 'TallyPrime Cloud Access',
      description: 'Access your Tally data from anywhere, anytime using any device. Secure, official cloud solutions by Sarvadnya Infotech.',
      url: '/cloud',
      type: 'Page',
      icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
    }
  },
  {
    keywords: ['whatsapp', 'message', 'send invoice', 'customer connect', 'mobile'],
    target: {
      title: 'TallyPrime with WhatsApp',
      description: 'Send invoices, payment reminders, and business reports directly to your customers via WhatsApp.',
      url: '/modules',
      type: 'Module',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    }
  },
  {
    keywords: ['training', 'learn', 'course', 'master', 'skills', 'certification'],
    target: {
      title: 'Corporate Tally Training',
      description: 'Professional hands-on training for your staff to master TallyPrime features and improve productivity.',
      url: '/services/corporate-training',
      type: 'Page',
      icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
    }
  },
  {
    keywords: ['deal', 'offer', 'discount', 'save', 'cheap', 'best price', 'special'],
    target: {
      title: 'Exclusive Deals & Offers',
      description: 'Check out our latest festive offers, bundle deals, and subscription discounts for TallyPrime and add-ons.',
      url: '/contact?reason=offer',
      type: 'Action',
      icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
    }
  },
  {
    keywords: ['info', 'help', 'guide', 'how to', 'documentation', 'manual'],
    target: {
      title: 'Tally Knowledge Hub',
      description: 'Find answers to common questions, step-by-step guides, and technical documentation for TallyPrime.',
      url: '/tutorials',
      type: 'Page',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }
];

export function findSemanticResults(query: string): any[] {
  const normalizedQuery = query.toLowerCase().trim();
  const matchedResults: any[] = [];

  SEMANTIC_INDEX.forEach(mapping => {
    const hasMatch = mapping.keywords.some(kw => 
      normalizedQuery.includes(kw) || kw.includes(normalizedQuery)
    );

    if (hasMatch) {
      matchedResults.push(mapping.target);
    }
  });

  return matchedResults;
}
