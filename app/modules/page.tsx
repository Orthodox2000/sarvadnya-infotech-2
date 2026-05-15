'use client';

import { useState } from 'react';
import { modules, Module } from '@/lib/modules';
import ModuleCard from '../components/ModuleCard';
import ModuleModal from '../components/ModuleModal';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactModalConfig, setContactModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: ''
  });

  const handleViewDetails = (module: Module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleEnquire = (module: Module) => {
    setContactModalConfig({
      isOpen: true,
      type: 'enquire',
      service: `Module: ${module.title}`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Compact Hero Section */}
      <section className="relative pt-8 pb-10 md:pt-10 md:pb-14 px-6 overflow-hidden bg-[#0f0529]">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#7338a0] to-transparent blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-indigo-500 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Specialized Solutions
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            Custom Modules for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7338a0] to-indigo-400">Your Industry Logic</span>
          </h1>
          <p className="text-white/60 text-xs md:text-lg max-w-2xl mx-auto leading-relaxed">
            Beyond standard accounting. We build deep, industry-specific logic directly into your Tally environment to automate your unique business workflows.
          </p>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onViewDetails={handleViewDetails}
              onEnquire={handleEnquire}
            />
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black text-[#0f0529] mb-6">Need a Custom TDL Solution?</h2>
          <p className="text-slate-600 text-sm md:text-lg mb-10 leading-relaxed">
            Don't see a module that fits your specific needs? Our TDL experts can develop a bespoke solution tailored 
            exactly to your business processes. Let's discuss your requirements today.
          </p>
          <button 
            onClick={() => setContactModalConfig({ isOpen: true, type: 'callback', service: 'Bespoke TDL Customization' })}
            className="px-10 py-4 bg-[#7338a0] text-white rounded-full font-bold hover:bg-[#0f0529] transition-all shadow-xl shadow-indigo-100"
          >
            Consult Our Experts
          </button>
        </div>
      </section>

      {/* Modals */}
      <ModuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        module={selectedModule}
        onEnquire={handleEnquire}
      />

      <UnifiedContactModal
        isOpen={contactModalConfig.isOpen}
        onClose={() => setContactModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={contactModalConfig.type}
        prefillService={contactModalConfig.service}
      />

      <Footer />
    </div>
  );
}
