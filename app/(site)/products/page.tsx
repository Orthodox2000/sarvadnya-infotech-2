'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from "../../components/Footer";
import UnifiedContactModal, { FormType } from "../../components/UnifiedContactModal";
import Link from 'next/link';

type Product = {
  name: string;
  description: string;
  tags: string[];
  link: string;
  logo: string;
};

export default function ProductsPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string; details: string}>({
    isOpen: false,
    type: 'general',
    service: '',
    details: ''
  });

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  const products: Product[] = [
    {
      name: "TallyPrime Silver",
      description: "TallyPrime Silver is meant to complete transactions, assignments and emerge business.",
      tags: ["FOR ONE USER", "SUITED FOR", "1 USER PC"],
      link: "/products/silver",
      logo: "/tallyprime logo.png"
    },
    {
      name: "TallyPrime Gold",
      description: "TallyPrime Gold offers simultaneous access, assignments and emerge business for teams.",
      tags: ["SUITED FOR", "SHARED LAN", "MULTI USER"],
      link: "/products/gold",
      logo: "/tallyprime logo.png"
    },
    {
      name: "TallyPrime Server",
      description: "TallyPrime Server is a robust and complete professional, automatic, and eminent business solution.",
      tags: ["BIGGER TEAMS", "ACCESS LOGS", "ADVANCED"],
      link: "/products/server",
      logo: "/tallyprime logo.png"
    },
    {
      name: "TallyDrive",
      description: "TallyDrive is a simple way to connect with recreate and protections for your data.",
      tags: ["AES-256", "SCHEDULED", "CLOUD BACKUP"],
      link: "/products/tallydrive",
      logo: "/tallyprime logo.png"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F7] font-sans antialiased">

      <div className="bg-[url('/mobilebg.png')] md:bg-[url('/cardbg.png')] bg-cover bg-center bg-no-repeat">
        {/* Header */}
        <section className="relative z-10 pt-16 pb-6 md:pt-16 md:pb-8 px-6 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Official Tally Products
          </h1>
        </section>

        {/* Cards Grid */}
        <section className="relative z-10 px-6 pb-16 md:pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.name}
                className="bg-white rounded-2xl p-6 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 mr-3 flex items-center justify-center border border-gray-100">
                    <Image src={p.logo} alt={p.name} width={48} height={48} className="object-contain w-full h-full" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {p.name.split(' ').map((word, i) => (
                      <span key={i}>
                        {word}
                      </span>
                    ))}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-5 flex-grow leading-relaxed">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#EBF2F7] text-[#4A6478] text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => openModal('quote', p.name, p.description)}
                    className="w-full bg-[#1A4731] hover:bg-[#123323] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm tracking-wide"
                  >
                    REQUEST QUOTE
                  </button>
                  <Link
                    href={p.link}
                    className="w-full bg-[#EAF2ED] hover:bg-[#dcede3] text-[#1A4731] border border-[#C5DACF] font-semibold py-2.5 rounded-lg transition-colors text-sm tracking-wide text-center"
                  >
                    KNOW MORE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <UnifiedContactModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />
      <Footer />
    </div>
  );
}
