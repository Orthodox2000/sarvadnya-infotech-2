'use client';

import { useState, useEffect } from 'react';
import { Module } from '@/lib/modules';
import ModuleCard from '../components/ModuleCard';
import ModuleModal from '../components/ModuleModal';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactModalConfig, setContactModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: ''
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules');
        const data = await response.json();
        if (data && !data.error) {
          setModules(data);
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

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
    <div className="min-h-screen bg-white">
      {/* Compact Hero Section (Radiant Sky Theme) */}
      <section className="bg-[#f0f8fa] relative pt-12 pb-16 md:pt-16 md:pb-24 px-6 overflow-hidden border-b border-white/5">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Background Effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/40 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-sky-200/30 blur-[110px] -ml-24 -mb-24" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-sm">
            <span className="flex h-1 w-1 rounded-full bg-slate-400"></span>
            Specialized Solutions
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Custom Modules for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.2)]">Your Industry Logic</span>
          </h1>
          <p className="text-slate-600/80 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-semibold">
            Beyond standard accounting. We build deep, industry-specific logic directly into your Tally environment to automate your unique business workflows.
          </p>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {modules.map((module) => (
            <ModuleCard
              key={module._id || module.id}
              module={module}
              onViewDetails={handleViewDetails}
              onEnquire={handleEnquire}
            />
          ))}
        </div>
      </section>

      {/* Trust Banner (High Contrast CTA) */}
      <section className="py-16 px-6 bg-slate-950 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-[#0371a3]/10 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-6">Need a Custom TDL Solution?</h2>
          <p className="text-slate-400 text-sm md:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            Don't see a module that fits your specific needs? Our TDL experts can develop a bespoke solution tailored 
            exactly to your business processes.
          </p>
          <button 
            onClick={() => setContactModalConfig({ isOpen: true, type: 'callback', service: 'Bespoke TDL Customization' })}
            className="group px-10 py-4 bg-[#0371a3] text-white rounded-full font-bold hover:bg-[#00ABE4] transition-all shadow-xl shadow-sky-900/20 flex items-center gap-3 mx-auto"
          >
            Consult Our Team
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
