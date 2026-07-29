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
      description: "One person, one computer. Handles your daily billing, stock, and taxes.",
      tags: ["1-USER", "SINGLE WORKSTATION", "READY-TO-USE"],
      link: "/products/silver",
      logo: "/tallyprime logo.png"
    },
    {
      name: "TallyPrime Gold",
      description: "Your whole team works together on the same data, at the same time, on the same network.",
      tags: ["MULTI-USER", "TEAM COLLABORATION", "REAL-TIME SYNC"],
      link: "/products/gold",
      logo: "/tallyprime logo.png"
    },
    {
      name: "TallyPrime Server",
      description: "For bigger teams that need speed, access controls, and a full activity log.",
      tags: ["ENTERPRISE SPEED", "FULL AUDIT TRAIL", "HIGH-CONTROL"],
      link: "/products/server",
      logo: "/tallyprime logo.png"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F7] font-sans antialiased">

      <div className="bg-[url('/mobilebg.png')] md:bg-[url('/cardbg.png')] bg-cover bg-center bg-no-repeat">
        {/* Header */}
        <section className="relative z-10 pt-16 pb-6 md:pt-16 md:pb-8 px-6 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            TallyPrime Products
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl leading-relaxed">
            Choose the right product for your business needs.
          </p>
        </section>

        {/* Cards Grid */}
        <section className="relative z-10 px-6 pb-16 md:pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {products.map((p) => (
              <div
                key={p.name}
                className="bg-white rounded-xl px-5 py-5 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-white shrink-0 mr-3 flex items-center justify-center border border-gray-100">
                    <Image src={p.logo} alt={p.name} width={44} height={44} className="object-contain w-full h-full" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {p.name.split(' ').map((word, i) => (
                      <span key={i}>
                        {word+" "}
                      </span>
                    ))}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-8 grow leading-relaxed">
                  {p.description}
                </p>

                <div className="flex flex-nowrap gap-2 mb-5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#EBF2F7] text-[#4A6478] text-[9px] font-bold px-2 py-1 rounded-md tracking-wide uppercase"
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
                    GET PRICING
                  </button>
                  <Link
                    href={p.link}
                    className="w-full bg-[#EAF2ED] hover:bg-[#dcede3] text-[#1A4731] border border-[#C5DACF] font-semibold py-2.5 rounded-lg transition-colors text-sm tracking-wide text-center"
                  >
                    VIEW DETAILS
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
